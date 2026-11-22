#!/usr/bin/env node
// Syncs registry/servers/*.json from the official MCP Registry.
//
// Phase 1 scope: only auth-free remote (streamable-http) servers are probed with
// a live initialize → tools/list handshake. Packages are never downloaded or run.
// A server is written only when it returns at least one valid tool; nothing is
// invented. Env: MAX_PROBES (default 400), FULL_SYNC=1 to ignore lastSync.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  REGISTRY_BASE_URL,
  USER_AGENT,
  assertPublicHost,
  buildServerEntry,
  classifyFailure,
  isValidRegistryName,
  mapWithConcurrency,
  officialMeta,
  orderCandidates,
  isLatestActive,
  probeServer,
  selectRemote,
  serverFilePath,
  slugify,
  toolsSha256,
  validateTools,
} from './lib/registry-sync.mjs';
import { generateEcosystemArtifacts } from './generate-ecosystem-artifacts.mjs';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryDir = path.join(rootDir, 'registry', 'servers');
const statePath = path.join(rootDir, 'registry', 'sync-state.json');

const CONCURRENCY = 6;
const PAGE_SIZE = 100;
const MAX_REGISTRY_PAGES = 2000;
const MAX_REGISTRY_PAGE_BYTES = 8 * 1024 * 1024;
const DEFAULT_MAX_PROBES = 400;

function parseMaxProbes(raw) {
  if (raw === undefined || raw === '') return DEFAULT_MAX_PROBES;
  const value = Number.parseInt(raw, 10);
  if (!Number.isInteger(value) || value < 0 || value > 100_000) {
    throw new Error(`MAX_PROBES must be an integer between 0 and 100000, got "${raw}"`);
  }
  return value;
}

function readState() {
  if (!fs.existsSync(statePath)) return {};
  const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
  if (state.lastSync !== undefined && Number.isNaN(Date.parse(state.lastSync))) {
    throw new Error(`registry/sync-state.json has an invalid lastSync: ${state.lastSync}`);
  }
  return state;
}

async function fetchRegistryPage(cursor, updatedSince) {
  const url = new URL(REGISTRY_BASE_URL);
  url.searchParams.set('limit', String(PAGE_SIZE));
  url.searchParams.set('version', 'latest');
  if (cursor) url.searchParams.set('cursor', cursor);
  if (updatedSince) url.searchParams.set('updated_since', updatedSince);
  const res = await fetch(url, {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    redirect: 'error',
    signal: AbortSignal.timeout(30_000),
  });
  if (!res.ok) throw new Error(`Registry request failed: HTTP ${res.status} for ${url}`);
  const text = await res.text();
  if (text.length > MAX_REGISTRY_PAGE_BYTES) throw new Error('Registry page exceeds size cap');
  const body = JSON.parse(text);
  if (!Array.isArray(body?.servers)) throw new Error('Registry response has no servers array');
  const next = body.metadata?.nextCursor;
  return { items: body.servers, nextCursor: typeof next === 'string' && next ? next : undefined };
}

async function scanRegistry(updatedSince) {
  const items = [];
  let cursor;
  for (let page = 0; page < MAX_REGISTRY_PAGES; page += 1) {
    const { items: pageItems, nextCursor } = await fetchRegistryPage(cursor, updatedSince);
    items.push(...pageItems);
    if (!nextCursor || nextCursor === cursor) return items;
    cursor = nextCursor;
  }
  throw new Error(`Registry pagination exceeded ${MAX_REGISTRY_PAGES} pages`);
}

/** Maps registry name → { slug, entry } for files created by this sync. */
function loadSyncedEntries() {
  const byName = new Map();
  const slugs = new Set();
  if (!fs.existsSync(registryDir)) return { byName, slugs };
  for (const file of fs.readdirSync(registryDir).filter(f => f.endsWith('.json'))) {
    const slug = file.slice(0, -'.json'.length);
    slugs.add(slug);
    try {
      const entry = JSON.parse(fs.readFileSync(path.join(registryDir, file), 'utf8'));
      if (entry?.source?.type === 'registry' && typeof entry.source.name === 'string') {
        byName.set(entry.source.name, { slug, entry });
      }
    } catch (err) {
      console.warn(`[warn] Skipping unreadable ${file}: ${err.message}`);
    }
  }
  return { byName, slugs };
}

function assignSlug(name, existing, takenSlugs) {
  const known = existing.byName.get(name);
  if (known) return known.slug;
  const base = slugify(name);
  if (!base) return undefined;
  const slug = takenSlugs.has(base) ? `${base}-${toolsSha256(name).slice(0, 8)}` : base;
  takenSlugs.add(slug);
  return slug;
}

function removeEntry(existing, name, counts) {
  const known = existing.byName.get(name);
  if (!known) return;
  fs.rmSync(serverFilePath(registryDir, known.slug), { force: true });
  existing.byName.delete(name);
  counts.removed += 1;
}

async function probeCandidate(candidate) {
  try {
    await assertPublicHost(new URL(candidate.remoteUrl).hostname);
    const rawTools = await probeServer(candidate.remoteUrl);
    const { tools } = validateTools(rawTools);
    if (tools.length === 0) return { candidate, outcome: 'failed', reason: 'no valid tools' };
    return { candidate, outcome: 'ok', tools };
  } catch (err) {
    return { candidate, outcome: classifyFailure(err), reason: err.message };
  }
}

function sameSnapshot(previous, candidate, tools) {
  const source = previous?.entry?.source;
  return (
    source?.version === candidate.server.version &&
    source?.remoteUrl === candidate.remoteUrl &&
    source?.toolsSha256 === toolsSha256(tools)
  );
}

function applyResult(result, existing, takenSlugs, counts, fetchedAt) {
  const { candidate, outcome } = result;
  const name = candidate.server.name;
  counts[outcome] += 1;
  const previous = existing.byName.get(name);
  if (outcome !== 'ok') {
    // Keep a prior real snapshot only when it describes the same version and URL.
    const stillValid = previous?.entry?.source?.version === candidate.server.version && previous?.entry?.source?.remoteUrl === candidate.remoteUrl;
    if (!stillValid) removeEntry(existing, name, counts);
    return;
  }
  if (sameSnapshot(previous, candidate, result.tools)) return;
  const slug = assignSlug(name, existing, takenSlugs);
  if (!slug) return;
  const entry = buildServerEntry({ server: candidate.server, remoteUrl: candidate.remoteUrl, tools: result.tools, fetchedAt });
  fs.writeFileSync(serverFilePath(registryDir, slug), `${JSON.stringify(entry, null, 2)}\n`, 'utf8');
  existing.byName.set(name, { slug, entry });
}

async function main() {
  const maxProbes = parseMaxProbes(process.env.MAX_PROBES);
  const state = readState();
  const isFull = process.env.FULL_SYNC === '1' || !state.lastSync;
  const startedAt = new Date().toISOString();
  fs.mkdirSync(registryDir, { recursive: true });

  console.log(`Scanning ${REGISTRY_BASE_URL} (${isFull ? 'full' : `updated since ${state.lastSync}`})`);
  const items = await scanRegistry(isFull ? undefined : state.lastSync);

  const counts = { scanned: items.length, latestActive: 0, candidates: 0, probed: 0, ok: 0, authRequired: 0, failed: 0, removed: 0 };
  const existing = loadSyncedEntries();
  const takenSlugs = new Set(existing.slugs);
  const candidates = [];
  const seen = new Set();

  for (const item of items) {
    const server = item?.server;
    if (!isValidRegistryName(server?.name)) continue;
    if (!isLatestActive(item)) {
      // The latest version was deprecated or deleted: stop listing it.
      if (officialMeta(item)?.isLatest === true) removeEntry(existing, server.name, counts);
      continue;
    }
    if (seen.has(server.name)) continue;
    seen.add(server.name);
    counts.latestActive += 1;
    const remoteUrl = selectRemote(server);
    if (!remoteUrl) {
      removeEntry(existing, server.name, counts); // no longer has an auth-free remote
      continue;
    }
    candidates.push({ server, remoteUrl });
  }
  counts.candidates = candidates.length;

  if (isFull) {
    // A full scan sees every latest server: drop entries the registry no longer lists.
    for (const name of [...existing.byName.keys()]) if (!seen.has(name)) removeEntry(existing, name, counts);
  }

  const known = new Map([...existing.byName].map(([name, { entry }]) => [name, entry.source]));
  const ordered = orderCandidates(candidates, known, state.resumeAfter);
  const toProbe = ordered.slice(0, maxProbes);
  const isTruncated = ordered.length > toProbe.length;
  const lastFresh = toProbe.filter(c => !known.has(c.server.name)).at(-1);
  counts.probed = toProbe.length;
  console.log(`${counts.latestActive} latest active servers, ${counts.candidates} auth-free remote candidates, probing ${toProbe.length}`);

  const results = await mapWithConcurrency(toProbe, CONCURRENCY, probeCandidate);
  for (const result of results) applyResult(result, existing, takenSlugs, counts, startedAt);

  const nextState = {
    // A capped run does not advance lastSync, so skipped candidates are retried
    // (with no previous lastSync the next run is a full scan again).
    lastSync: isTruncated ? state.lastSync : startedAt,
    lastRun: startedAt,
    mode: isFull ? 'full' : 'incremental',
    truncated: isTruncated,
    // Where the next capped run continues probing never-listed servers.
    ...(isTruncated && lastFresh ? { resumeAfter: lastFresh.server.name } : {}),
    listedServers: existing.byName.size,
    counts,
  };
  fs.writeFileSync(statePath, `${JSON.stringify(nextState, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(nextState, null, 2));

  await generateEcosystemArtifacts(rootDir);
}

main().catch(err => {
  console.error('Registry sync failed:', err);
  process.exit(1);
});
