import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { McpToolDefinition, ServerBenchmarkResult } from './types.js';
import { benchmarkServerTools } from './analyzer.js';

/** Provenance of tools fetched live from a remote server listed in the MCP Registry. */
export interface RegistrySource {
  type: 'registry';
  registry: string;
  name: string;
  version: string;
  remoteUrl: string;
  publishedAt?: string;
  fetchedAt: string;
  toolsSha256: string;
}

/** Provenance of a community entry submitted by hand (not verified against a live server). */
export interface ManualSource {
  type: 'manual';
  submittedAt: string;
}

export type EntrySource = RegistrySource | ManualSource;

export interface RegistryServerEntry {
  $schema?: string;
  name: string;
  title?: string;
  category: string;
  description?: string;
  repository?: string;
  maintainer?: string;
  tools: McpToolDefinition[];
  source: EntrySource;
}

/** registry/servers inside the installed package (independent of the working directory). */
export const PACKAGE_REGISTRY_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'registry', 'servers');

function isEntrySource(value: unknown): value is EntrySource {
  if (!value || typeof value !== 'object') return false;
  const source = value as Record<string, unknown>;
  if (source.type === 'manual') return typeof source.submittedAt === 'string';
  return (
    source.type === 'registry' &&
    typeof source.name === 'string' &&
    typeof source.remoteUrl === 'string' &&
    typeof source.fetchedAt === 'string' &&
    typeof source.toolsSha256 === 'string'
  );
}

export function loadRegistry(registryDir?: string): {
  servers: Record<string, McpToolDefinition[]>;
  metadata: Record<string, RegistryServerEntry>;
} {
  const dir = registryDir || path.resolve(process.cwd(), 'registry', 'servers');
  if (!fs.existsSync(dir)) {
    return { servers: {}, metadata: {} };
  }

  const files = fs.readdirSync(dir).filter(f => f.endsWith('.json')).sort();
  const servers: Record<string, McpToolDefinition[]> = {};
  const metadata: Record<string, RegistryServerEntry> = {};

  for (const file of files) {
    let entry: RegistryServerEntry;
    try {
      entry = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf8')) as RegistryServerEntry;
    } catch (error) {
      console.error(`⚠️ Skipping ${file}: invalid JSON (${error instanceof Error ? error.message : String(error)})`);
      continue;
    }
    // Entries without provenance are not trusted data and are never ranked.
    if (entry && typeof entry.name === 'string' && Array.isArray(entry.tools) && isEntrySource(entry.source)) {
      servers[entry.name] = entry.tools;
      metadata[entry.name] = entry;
    } else {
      console.error(`⚠️ Skipping ${file}: missing name, tools, or source provenance`);
    }
  }

  return { servers, metadata };
}

export function benchmarkRegistry(registryDir?: string): ServerBenchmarkResult[] {
  const { servers } = loadRegistry(registryDir);
  const results: ServerBenchmarkResult[] = [];

  for (const [serverName, tools] of Object.entries(servers)) {
    results.push(benchmarkServerTools(serverName, tools));
  }

  // Sort descending by TQI overall score, then by token efficiency, then by name for stable output
  results.sort(
    (a, b) =>
      b.overallTQI - a.overallTQI ||
      b.averageTokenEfficiency - a.averageTokenEfficiency ||
      a.serverName.localeCompare(b.serverName)
  );
  return results;
}

/** Escapes untrusted text for a GitHub Markdown table cell (no HTML, links, or pipes). */
export function escapeMarkdownCell(value: string): string {
  return value
    .replace(/[\u0000-\u001f\u007f]/g, ' ')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/([\\`*_[\]()|!#~])/g, '\\$1')
    .trim();
}

function safeHttpsUrl(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return undefined;
    return url.toString().replace(/[()<>\s]/g, ch => `%${ch.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')}`);
  } catch {
    return undefined;
  }
}

function formatServerCell(serverName: string, meta: RegistryServerEntry | undefined): string {
  const label = escapeMarkdownCell(meta?.title || serverName);
  const repository = safeHttpsUrl(meta?.repository);
  const linked = repository ? `[**${label}**](${repository})` : `**${label}**`;
  const id = meta?.title ? ` <sub>${escapeMarkdownCell(serverName)}</sub>` : '';
  const manual = meta?.source.type === 'manual' ? ' <sub>(manual entry)</sub>' : '';
  return `${linked}${id}${manual}`;
}

const TABLE_HEADER =
  '| Rank | MCP Server | Grade | TQI Score | Tools | Strictness | Density | Efficiency | Avg Tokens/Tool |\n' +
  '|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|\n';

function formatRow(r: ServerBenchmarkResult, rank: number, metadata?: Record<string, RegistryServerEntry>): string {
  const server = formatServerCell(r.serverName, metadata?.[r.serverName]);
  return `| ${rank} | ${server} | \`${r.grade}\` | **${r.overallTQI}/100** | ${r.toolsAnalyzed} | ${r.averageSchemaStrictness}% | ${r.averageSemanticDensity}% | ${r.averageTokenEfficiency}% | ${r.averageTokensPerTool} tok |\n`;
}

export function generateLeaderboardMarkdown(results: ServerBenchmarkResult[], metadata?: Record<string, RegistryServerEntry>): string {
  const top25 = results.slice(0, 25);
  const remaining = results.slice(25);

  let md = TABLE_HEADER;
  top25.forEach((r, idx) => {
    md += formatRow(r, idx + 1, metadata);
  });

  if (remaining.length > 0) {
    md += `\n<details>\n<summary><b>▶ Click to expand all ${results.length} ranked MCP servers (Ranks 26–${results.length})</b></summary>\n\n`;
    md += TABLE_HEADER;
    remaining.forEach((r, idx) => {
      md += formatRow(r, idx + 26, metadata);
    });
    md += '\n</details>\n';
  }

  return md;
}

const LEADERBOARD_START = '<!-- LEADERBOARD_START -->';
const LEADERBOARD_END = '<!-- LEADERBOARD_END -->';

export function updateReadmeLeaderboard(
  options: { readmePath?: string; registryDir?: string } = {}
): { updated: boolean; count: number; markersFound: boolean } {
  const readmePath = options.readmePath || path.resolve(process.cwd(), 'README.md');
  if (!fs.existsSync(readmePath)) {
    return { updated: false, count: 0, markersFound: false };
  }

  const { metadata } = loadRegistry(options.registryDir);
  const results = benchmarkRegistry(options.registryDir);
  const content = fs.readFileSync(readmePath, 'utf8');
  const start = content.indexOf(LEADERBOARD_START);
  const end = content.indexOf(LEADERBOARD_END);
  if (start === -1 || end < start) {
    return { updated: false, count: results.length, markersFound: false };
  }

  const table = results.length > 0 ? generateLeaderboardMarkdown(results, metadata) : '_No servers with verified tool data yet._\n';
  const before = content.substring(0, start + LEADERBOARD_START.length);
  const after = content.substring(end);
  const newContent = `${before}\n\n${table}\n${after}`;

  if (newContent !== content) {
    fs.writeFileSync(readmePath, newContent, 'utf8');
    return { updated: true, count: results.length, markersFound: true };
  }

  return { updated: false, count: results.length, markersFound: true };
}

export function registerServer(
  entry: Omit<RegistryServerEntry, 'source'>,
  registryDir?: string
): string {
  const dir = registryDir || path.resolve(process.cwd(), 'registry', 'servers');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const slug = entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (!slug) {
    throw new Error(`Cannot derive a file name from server name "${entry.name}"`);
  }
  const targetPath = path.join(dir, `manual-${slug}.json`);

  const serverData: RegistryServerEntry = {
    $schema: '../schema.json',
    name: entry.name,
    category: entry.category,
    description: entry.description || `${entry.name} tools for AI agents.`,
    repository: entry.repository,
    maintainer: entry.maintainer || 'community',
    tools: entry.tools,
    source: { type: 'manual', submittedAt: new Date().toISOString() },
  };

  fs.writeFileSync(targetPath, JSON.stringify(serverData, null, 2) + '\n', 'utf8');
  return targetPath;
}
