#!/usr/bin/env node
// Regenerates the README leaderboard, docs/ecosystem-data.js and
// fixtures/ecosystem-registry.json from registry/servers. Requires `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SYNC_INFO_START = '<!-- SYNC_INFO_START -->';
const SYNC_INFO_END = '<!-- SYNC_INFO_END -->';

function replaceBetween(content, start, end, replacement) {
  const from = content.indexOf(start);
  const to = content.indexOf(end);
  if (from === -1 || to < from) return content;
  return `${content.slice(0, from + start.length)}\n${replacement}\n${content.slice(to)}`;
}

function syncSummary(state, results, metadata) {
  const counts = state.counts ?? {};
  const date = (state.lastRun ?? state.lastSync ?? '').slice(0, 10) || 'not yet synced';
  const totalTools = results.reduce((sum, r) => sum + r.toolsAnalyzed, 0);
  const manual = Object.values(metadata).filter(m => m.source.type === 'manual').length;
  const lines = [
    `**${results.length} servers · ${totalTools} tools · last sync ${date}.**`,
    `Last run: ${counts.scanned ?? 0} registry entries scanned, ${counts.candidates ?? 0} auth-free remote candidates, ${counts.ok ?? 0} returned tools, ${counts.authRequired ?? 0} required authentication, ${counts.failed ?? 0} failed${state.truncated ? ' (probe cap reached)' : ''}.`,
  ];
  if (manual > 0) lines.push(`${manual} of the listed servers are manual community entries (marked "manual entry"), not live probes.`);
  return lines.join('\n');
}

export async function generateEcosystemArtifacts(rootDir) {
  const registryModule = path.join(rootDir, 'dist', 'registry.js');
  if (!fs.existsSync(registryModule)) throw new Error('dist/registry.js not found: run `npm run build` first');
  const { benchmarkRegistry, loadRegistry, updateReadmeLeaderboard } = await import(pathToFileURL(registryModule).href);

  const registryDir = path.join(rootDir, 'registry', 'servers');
  const readmePath = path.join(rootDir, 'README.md');
  const statePath = path.join(rootDir, 'registry', 'sync-state.json');
  const state = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, 'utf8')) : {};

  const { servers, metadata } = loadRegistry(registryDir);
  const results = benchmarkRegistry(registryDir);
  updateReadmeLeaderboard({ readmePath, registryDir });

  const readme = fs.readFileSync(readmePath, 'utf8');
  const withSummary = replaceBetween(readme, SYNC_INFO_START, SYNC_INFO_END, syncSummary(state, results, metadata)).replace(
    /badge\/MCP_Registry-\d+_Servers-/,
    `badge/MCP_Registry-${results.length}_Servers-`
  );
  if (withSummary !== readme) fs.writeFileSync(readmePath, withSummary, 'utf8');

  const slugByName = new Map(
    fs
      .readdirSync(registryDir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          return [JSON.parse(fs.readFileSync(path.join(registryDir, f), 'utf8')).name, f.slice(0, -5)];
        } catch {
          return [undefined, undefined];
        }
      })
  );

  const webData = results.map(r => {
    const meta = metadata[r.serverName];
    return {
      name: r.serverName,
      title: meta.title ?? r.serverName,
      slug: slugByName.get(r.serverName),
      grade: r.grade,
      tqi: r.overallTQI,
      strictness: r.averageSchemaStrictness,
      density: r.averageSemanticDensity,
      efficiency: r.averageTokenEfficiency,
      tokensPerTool: r.averageTokensPerTool,
      category: meta.category,
      repository: meta.repository ?? null,
      sourceType: meta.source.type,
      fetchedAt: meta.source.type === 'registry' ? meta.source.fetchedAt : meta.source.submittedAt,
      toolsCount: r.toolsAnalyzed,
      tools: r.tools.map(t => ({ name: t.toolName, tokens: t.tokenCount, score: t.metrics.overallScore })),
    };
  });
  const docsPath = path.join(rootDir, 'docs', 'ecosystem-data.js');
  fs.writeFileSync(
    docsPath,
    `window.ECOSYSTEM_SYNC = ${JSON.stringify({ lastSync: state.lastRun ?? state.lastSync ?? null, servers: webData.length })};\n` +
      `window.ECOSYSTEM_DATA = ${JSON.stringify(webData, null, 1)};\n`,
    'utf8'
  );

  const fixturePath = path.join(rootDir, 'fixtures', 'ecosystem-registry.json');
  fs.writeFileSync(fixturePath, `${JSON.stringify(servers, null, 1)}\n`, 'utf8');
  console.log(`Regenerated README leaderboard, ${path.relative(rootDir, docsPath)} and ${path.relative(rootDir, fixturePath)} (${results.length} servers)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
  generateEcosystemArtifacts(rootDir).catch(err => {
    console.error('Artifact generation failed:', err);
    process.exit(1);
  });
}
