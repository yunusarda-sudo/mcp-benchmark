#!/usr/bin/env node
// Regenerates the README "Newly released" and leaderboard summary sections,
// LEADERBOARD.md and docs/ecosystem-data.js from registry/servers.
// Requires `npm run build`. Output is deterministic for a given registry state.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  NEW_RELEASES_LIMIT,
  renderLeaderboardFile,
  renderLeaderboardSummaryMarkdown,
  renderNewReleasesMarkdown,
  replaceBetween,
  safeHttpsUrl,
  selectNewReleases,
} from './lib/ecosystem-artifacts.mjs';

const MARKERS = {
  syncInfo: ['<!-- SYNC_INFO_START -->', '<!-- SYNC_INFO_END -->'],
  newReleases: ['<!-- NEW_RELEASES_START -->', '<!-- NEW_RELEASES_END -->'],
  leaderboardTop: ['<!-- LEADERBOARD_TOP_START -->', '<!-- LEADERBOARD_TOP_END -->'],
};

function syncSummary(state, rows) {
  const counts = state.counts ?? {};
  const date = (state.lastRun ?? state.lastSync ?? '').slice(0, 10) || 'not yet synced';
  const totalTools = rows.reduce((sum, r) => sum + r.toolsCount, 0);
  const manual = rows.filter(r => r.sourceType === 'manual').length;
  const lines = [
    `**${rows.length} servers · ${totalTools} tools · last sync ${date}.**`,
    `Last run: ${counts.scanned ?? 0} registry entries scanned, ${counts.candidates ?? 0} auth-free remote candidates, ${counts.ok ?? 0} returned tools, ${counts.authRequired ?? 0} required authentication, ${counts.failed ?? 0} failed${state.truncated ? ' (probe cap reached)' : ''}.`,
    `Probed newest first by registry publish date, at most ${state.limits?.maxProbes ?? '?'} per run and at most ${state.limits?.maxPerOperator ?? '?'} listed servers per operator (registrable domain of the remote host).`,
  ];
  if (manual > 0) lines.push(`${manual} of the listed servers are manual community entries (marked "manual entry"), not live probes.`);
  return lines.join('\n');
}

function slugsByName(registryDir) {
  const map = new Map();
  for (const file of fs.readdirSync(registryDir).filter(f => f.endsWith('.json')).sort()) {
    try {
      map.set(JSON.parse(fs.readFileSync(path.join(registryDir, file), 'utf8')).name, file.slice(0, -5));
    } catch {
      // loadRegistry already reports and skips unreadable entries.
    }
  }
  return map;
}

function toWebRow(result, meta, slug) {
  const source = meta.source;
  const isRegistry = source.type === 'registry';
  return {
    name: result.serverName,
    title: meta.title ?? result.serverName,
    slug,
    grade: result.grade,
    tqi: result.overallTQI,
    strictness: result.averageSchemaStrictness,
    density: result.averageSemanticDensity,
    efficiency: result.averageTokenEfficiency,
    tokensPerTool: result.averageTokensPerTool,
    category: meta.category,
    repository: safeHttpsUrl(meta.repository),
    sourceType: source.type,
    registryName: isRegistry ? source.name : null,
    version: isRegistry ? source.version ?? null : null,
    fetchedAt: isRegistry ? source.fetchedAt : source.submittedAt,
    publishedAt: isRegistry ? source.publishedAt ?? null : null,
    toolsCount: result.toolsAnalyzed,
    tools: result.tools.map(t => ({ name: t.toolName, tokens: t.tokenCount, score: t.metrics.overallScore })),
  };
}

function writeIfChanged(filePath, content) {
  const current = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (current !== content) fs.writeFileSync(filePath, content, 'utf8');
}

function updateReadme(readmePath, rows, summary, newReleases) {
  if (!fs.existsSync(readmePath)) return;
  const readme = fs.readFileSync(readmePath, 'utf8');
  let next = replaceBetween(readme, ...MARKERS.syncInfo, summary);
  next = replaceBetween(next, ...MARKERS.newReleases, renderNewReleasesMarkdown(newReleases));
  next = replaceBetween(next, ...MARKERS.leaderboardTop, renderLeaderboardSummaryMarkdown(rows));
  next = next.replace(/badge\/MCP_Registry-\d+_Servers-/, `badge/MCP_Registry-${rows.length}_Servers-`);
  writeIfChanged(readmePath, next);
}

export async function generateEcosystemArtifacts(rootDir) {
  const registryModule = path.join(rootDir, 'dist', 'registry.js');
  if (!fs.existsSync(registryModule)) throw new Error('dist/registry.js not found: run `npm run build` first');
  const { benchmarkRegistry, loadRegistry } = await import(pathToFileURL(registryModule).href);

  const registryDir = path.join(rootDir, 'registry', 'servers');
  const statePath = path.join(rootDir, 'registry', 'sync-state.json');
  const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};

  const { metadata } = loadRegistry(registryDir);
  const slugs = slugsByName(registryDir);
  // benchmarkRegistry sorts by TQI, token efficiency, then name: the leaderboard order.
  const rows = benchmarkRegistry(registryDir).map(r => toWebRow(r, metadata[r.serverName], slugs.get(r.serverName)));
  const newReleases = selectNewReleases(rows, NEW_RELEASES_LIMIT);
  const summary = syncSummary(state, rows);

  updateReadme(path.join(rootDir, 'README.md'), rows, summary, newReleases);
  writeIfChanged(path.join(rootDir, 'LEADERBOARD.md'), renderLeaderboardFile(rows, summary));

  const docsPath = path.join(rootDir, 'docs', 'ecosystem-data.js');
  const sync = {
    lastSync: state.lastRun ?? state.lastSync ?? null,
    servers: rows.length,
    tools: rows.reduce((sum, r) => sum + r.toolsCount, 0),
    newReleases: newReleases.map(r => r.name),
  };
  writeIfChanged(
    docsPath,
    `window.ECOSYSTEM_SYNC = ${JSON.stringify(sync)};\n` + `window.ECOSYSTEM_DATA = ${JSON.stringify(rows, null, 1)};\n`
  );

  console.log(`Regenerated README sections, LEADERBOARD.md and ${path.relative(rootDir, docsPath)} (${rows.length} servers)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  generateEcosystemArtifacts(rootDir).catch(err => {
    console.error('Artifact generation failed:', err);
    process.exit(1);
  });
}
