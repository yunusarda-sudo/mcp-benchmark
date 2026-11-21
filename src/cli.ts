#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs } from 'node:util';
import { benchmarkServerTools } from './analyzer.js';
import { CatalogComparison, compareToolCatalogs } from './compare.js';
import { generateHtmlReport } from './htmlReport.js';
import { fetchToolsFromStdioServer, fetchToolsFromSseServer } from './liveClient.js';
import { fixToolCatalog } from './fixer.js';
import { generateSarifReport } from './sarif.js';
import { loadToolsFromConfig } from './configLoader.js';
import { generateSvgBadge } from './badge.js';
import { ECOSYSTEM_SERVERS } from './ecosystem.js';
import { estimateTokenEconomics, formatTokenEconomicsMarkdown } from './costEstimator.js';
import { formatPrComment } from './prComment.js';
import { McpToolDefinition, ServerBenchmarkResult } from './types.js';


// Split a command line string into executable + args, respecting quotes.
function splitCommand(input: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (/\s/.test(ch)) {
      if (current) {
        tokens.push(current);
        current = '';
      }
    } else {
      current += ch;
    }
  }
  if (quote) throw new Error('--cmd contains an unclosed quote.');
  if (current) tokens.push(current);

  return tokens;
}

// Realistic tool definitions for top MCP servers:
const DATASETS: Record<string, McpToolDefinition[]> = {
  'Filesystem MCP (Official)': [
    {
      name: 'read_file',
      description: 'Read the complete contents of a file from the local file system using UTF-8 encoding.',
      inputSchema: {
        type: 'object',
        required: ['path'],
        properties: {
          path: { type: 'string', description: 'The absolute path to the file to read.' },
        },
      },
    },
    {
      name: 'write_file',
      description: 'Create a new file or completely overwrite an existing file with the provided contents.',
      inputSchema: {
        type: 'object',
        required: ['path', 'content'],
        properties: {
          path: { type: 'string', description: 'The absolute path to write the file to.' },
          content: { type: 'string', description: 'The string content to write.' },
        },
      },
    },
    {
      name: 'list_directory',
      description: 'List the contents of a directory, returning filenames and file types.',
      inputSchema: {
        type: 'object',
        required: ['path'],
        properties: {
          path: { type: 'string', description: 'The directory path to inspect.' },
        },
      },
    },
  ],

  'Postgres MCP (Official)': [
    {
      name: 'query',
      description: 'Execute a read-only SQL query against the connected PostgreSQL database and return rows as JSON.',
      inputSchema: {
        type: 'object',
        required: ['sql'],
        properties: {
          sql: { type: 'string', description: 'The read-only SELECT query to run.' },
        },
      },
    },
  ],

  'Taskade MCP': [
    {
      name: 'createTask',
      description: 'Create a new task inside a designated project workspace with priority and due date.',
      inputSchema: {
        type: 'object',
        required: ['workspaceId', 'title'],
        properties: {
          workspaceId: { type: 'string', description: 'The unique ID of the target workspace.' },
          title: { type: 'string', description: 'Title or summary of the task.' },
          priority: { type: 'string', enum: ['low', 'medium', 'high'], description: 'Urgency level.' },
          notify: { type: 'boolean', description: 'Whether to alert collaborators.' },
        },
      },
    },
    {
      name: 'getTask',
      description: 'Retrieve detailed task metadata, subtasks, and execution status by ID.',
      inputSchema: {
        type: 'object',
        required: ['taskId'],
        properties: {
          taskId: { type: 'string', description: 'The unique identifier of the task.' },
          includeArchived: { type: 'boolean', description: 'Include completed or archived records.' },
        },
      },
    },
  ],

  'Cremind MCP': [
    {
      name: 'search_notes',
      description: 'Search indexed documents and developer knowledge base using semantic vector retrieval.',
      inputSchema: {
        type: 'object',
        required: ['query'],
        properties: {
          query: { type: 'string', description: 'The semantic search query.' },
          limit: { type: 'integer', description: 'Maximum number of items to return.' },
        },
      },
    },
  ],

  'Unoptimized / Ambiguous MCP (Baseline Negative)': [
    {
      name: 'do_action',
      description: 'This tool allows you to basically do whatever action you need on the data.',
      inputSchema: {
        properties: {
          data: { description: 'The payload' },
          opts: {},
        },
      },
    },
  ],
};

function markdownText(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\r?\n|\r/g, ' ')
    .replace(/[\\|`*_\[\]]/g, '\\$&');
}

function formatComparison(comparison: CatalogComparison): string {
  const lines = [
    '## Catalog comparison',
    '',
    `Added: ${comparison.addedTools.length} · Removed: ${comparison.removedTools.length} · Changed: ${comparison.changedTools.length} · Breaking: ${comparison.breakingChanges.length} · New findings: ${comparison.newDiagnostics.length} · Resolved: ${comparison.resolvedDiagnostics.length}`,
    '',
  ];
  for (const tool of comparison.addedTools) lines.push(`- Added **${markdownText(tool)}**.`);
  for (const tool of comparison.removedTools) lines.push(`- Removed **${markdownText(tool)}**.`);
  for (const change of comparison.changedTools) lines.push(`- Changed **${markdownText(change.toolName)}** (${change.fields.join(', ')}).`);
  for (const change of comparison.breakingChanges) {
    if (change.kind === 'required-input-added') {
      lines.push(`- **${markdownText(change.toolName)}** now requires ${markdownText(change.property)}.`);
    }
  }
  for (const finding of comparison.newDiagnostics) {
    lines.push(`- New **${finding.severity}** ${finding.code} on **${markdownText(finding.toolName)}** (${markdownText(finding.path || '/')}): ${markdownText(finding.message)}. ${markdownText(finding.suggestion)}`);
  }
  return lines.join('\n') + '\n\n';
}

export function formatMarkdownLeaderboard(results: ServerBenchmarkResult[]): string {
  let md = '# 📊 Model Context Protocol (MCP) Tool Quality Benchmark — Leaderboard\n\n';
  md += '| Rank | MCP Server | Grade | TQI Score | Schema Strictness | Semantic Density | Token Efficiency | Avg Tokens/Tool |\n';
  md += '|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|\n';

  results.forEach((r, idx) => {
    md += `| ${idx + 1} | **${markdownText(r.serverName)}** | \`${r.grade}\` | **${r.overallTQI}/100** | ${r.averageSchemaStrictness}% | ${r.averageSemanticDensity}% | ${r.averageTokenEfficiency}% | ${r.averageTokensPerTool} tok |\n`;
  });

  md += '\n\n### 🔍 Detailed Diagnostic Insights\n\n';
  for (const r of results) {
    md += `#### ${markdownText(r.serverName)} (Grade: ${r.grade} · TQI: ${r.overallTQI}/100)\n`;
    for (const t of r.tools) {
      md += `* **${markdownText(t.toolName)}** (${t.metrics.overallScore}/100) — Estimated tokens: ${t.tokenCount}\n`;
      if (t.diagnostics?.length) {
        for (const finding of t.diagnostics) {
          md += `  * ${finding.severity.toUpperCase()} ${finding.code} (${markdownText(finding.path || '/')}): ${markdownText(finding.message)}. ${markdownText(finding.suggestion)}\n`;
        }
      } else if (t.findings.length) {
        for (const finding of t.findings) md += `  * ${markdownText(finding)}\n`;
      } else {
        md += '  * No findings.\n';
      }
    }
    md += '\n';
  }

  return md;
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Usage: mcp-benchmark [options]

Deterministic quantitative quality benchmark and linter for Model Context Protocol (MCP) tool definitions.

Options:
  --file, -f <path>      Path to a JSON file containing tool definitions to lint
  --cmd <command>        Launch a local MCP server over stdio and benchmark its live tools
  --url, -u <endpoint>   Connect to a remote MCP server using legacy HTTP+SSE
  --config, -c <path>    Load and benchmark all servers defined in a client config (claude_desktop_config.json, mcp.json)
  --header, -H <k:v>     Custom HTTP header for remote MCP connection (can be specified multiple times)
  --fix                  Automatically clean conversational fluff and schema inconsistencies in --file
  --write [path]         Save fixed tools back to disk (defaults to overwriting --file if path omitted)
  --fail-under <score>   Require a minimum TQI from 0 to 100
  --baseline <path>      Compare a tool catalog against the input source
  --fail-on <level>      Fail on critical, high (or higher), or breaking changes; repeatable
  --english-style        Add advisory checks for English wording
  --json                 Output results as JSON
  --markdown, -m         Output results as a Markdown table (default)
  --html [path]          Write a self-contained HTML report to disk (default: mcp-benchmark-report.html)
  --sarif [path]         Write a GitHub Code Scanning SARIF v2.1.0 report (default: mcp-benchmark.sarif)
  --badge [path]         Write a SVG quality badge for READMEs (default: mcp-badge.svg)
  --ecosystem            Benchmark the full 100+ server MCP ecosystem corpus
  --cost                 Estimate context window token consumption and financial cost
  --pr-comment [path]    Write a formatted GitHub PR comment markdown summary (default: mcp-pr-comment.md)
  --help, -h             Show this help message

Examples:
  mcp-benchmark                         Run the bundled examples
  mcp-benchmark --ecosystem             Benchmark 100+ official and community MCP servers
  mcp-benchmark -f tools.json         Lint and score your own MCP tool definitions
  mcp-benchmark -f tools.json --cost  Estimate token footprint & API cost per 1k sessions
  mcp-benchmark -f tools.json --fix --write  Auto-clean descriptions and fix schema issues
  mcp-benchmark -c ~/.cursor/mcp.json Benchmark all servers in a configuration file
  mcp-benchmark --cmd "node fixtures/echo-mcp-server.mjs"
  mcp-benchmark --url "http://localhost:8000/sse"
  mcp-benchmark -u "https://api.example.com/mcp/sse" -H "Authorization: Bearer token"
  mcp-benchmark -f tools.json --fail-under 80
  mcp-benchmark --baseline before.json --file after.json --pr-comment pr-comment.md
  mcp-benchmark --html report.html      Write a shareable HTML report
  mcp-benchmark -f tools.json --sarif   Export SARIF report for GitHub Code Scanning
  mcp-benchmark -f tools.json --badge   Generate SVG quality badge for README
`);
  process.exit(0);
}

function readOptions(args: string[]) {
  const normalized = args.map((arg, i) => {
    if (arg === '--html' && (!args[i + 1] || args[i + 1].startsWith('-'))) {
      return '--html=mcp-benchmark-report.html';
    }
    if (arg === '--sarif' && (!args[i + 1] || args[i + 1].startsWith('-'))) {
      return '--sarif=mcp-benchmark.sarif';
    }
    if (arg === '--badge' && (!args[i + 1] || args[i + 1].startsWith('-'))) {
      return '--badge=mcp-badge.svg';
    }
    if (arg === '--pr-comment' && (!args[i + 1] || args[i + 1].startsWith('-'))) {
      return '--pr-comment=mcp-pr-comment.md';
    }
    if (arg === '--write' && (!args[i + 1] || args[i + 1].startsWith('-'))) {
      return '--write=__DEFAULT__';
    }
    return arg;
  });
  const { values } = parseArgs({
    args: normalized,
    options: {
      file: { type: 'string', short: 'f' },
      cmd: { type: 'string' },
      url: { type: 'string', short: 'u' },
      config: { type: 'string', short: 'c' },
      header: { type: 'string', short: 'H', multiple: true },
      fix: { type: 'boolean' },
      write: { type: 'string' },
      'fail-under': { type: 'string' },
      baseline: { type: 'string' },
      'fail-on': { type: 'string', multiple: true },
      'english-style': { type: 'boolean' },
      json: { type: 'boolean' },
      markdown: { type: 'boolean', short: 'm' },
      html: { type: 'string' },
      sarif: { type: 'string' },
      badge: { type: 'string' },
      ecosystem: { type: 'boolean' },
      cost: { type: 'boolean' },
      'pr-comment': { type: 'string' },
    },
  });

  const sources = [values.file, values.cmd, values.url, values.config].filter(value => value !== undefined);
  if (sources.length > 1) throw new Error('Choose only one of --file, --cmd, --url, or --config.');
  if (sources.some(value => !value.trim())) throw new Error('The selected input option requires a non-empty value.');
  if (values.json && values.markdown) throw new Error('Choose either --json or --markdown.');

  if (values.fix && !values.file) {
    throw new Error('--fix requires --file to specify the tool catalog to clean.');
  }

  const threshold = values['fail-under'];
  if (threshold !== undefined && (!/^\d+$/.test(threshold) || Number(threshold) > 100)) {
    throw new Error('--fail-under must be an integer from 0 to 100.');
  }

  const failOn = values['fail-on'] ?? [];
  if (failOn.some(level => level !== 'critical' && level !== 'high' && level !== 'breaking')) {
    throw new Error('--fail-on must be critical, high, or breaking.');
  }
  if (values.baseline !== undefined && (!values.baseline.trim() || sources.length !== 1)) {
    throw new Error('--baseline requires a file path and one of --file, --cmd, --url, or --config.');
  }
  if (failOn.includes('breaking') && !values.baseline) throw new Error('--fail-on breaking requires --baseline.');

  if (values.header && !values.url) throw new Error('--header requires --url.');
  const headers = Object.fromEntries((values.header ?? []).map(header => {
    const colon = header.indexOf(':');
    const name = header.slice(0, colon).trim();
    if (colon < 1 || !name) throw new Error('--header must use the format Name: value.');
    return [name, header.slice(colon + 1).trim()];
  }));

  return {
    ...values,
    headers: values.header ? headers : undefined,
    failOn,
    failUnder: threshold === undefined ? null : Number(threshold),
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readToolFile(file: string): McpToolDefinition[] {
  const filePath = path.resolve(file);
  let input: unknown;
  try {
    input = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Cannot read tool definitions from ${filePath}: ${message}`);
  }

  let list = input;
  if (isRecord(input) && input.jsonrpc === '2.0') {
    if (!isRecord(input.result) || Object.hasOwn(input, 'error')) {
      throw new Error('Expected a successful tools/list JSON-RPC response.');
    }
    list = input.result;
  }
  if (isRecord(list) && list.nextCursor !== undefined && list.nextCursor !== null) {
    throw new Error('The export lists only one page. Combine all tools into a single array and try again.');
  }
  const tools = isRecord(list) ? list.tools : list;
  if (!Array.isArray(tools)) {
    throw new Error('Expected a tool array, a { "tools": [...] } object, or a tools/list JSON-RPC response.');
  }

  for (const [index, tool] of tools.entries()) {
    const location = `Tool ${index + 1}`;
    if (!isRecord(tool) || typeof tool.name !== 'string' || !tool.name.trim()) {
      throw new Error(`${location} must have a non-empty name.`);
    }
    if (tool.description !== undefined && typeof tool.description !== 'string') {
      throw new Error(`${location} description must be a string.`);
    }
    const schema = tool.inputSchema;
    if (schema === undefined) continue;
    if (!isRecord(schema)) throw new Error(`${location} inputSchema must be an object.`);
    if (schema.properties !== undefined && !isRecord(schema.properties)) {
      throw new Error(`${location} inputSchema.properties must be an object.`);
    }
    if (schema.required !== undefined && (!Array.isArray(schema.required) || !schema.required.every(key => typeof key === 'string'))) {
      throw new Error(`${location} inputSchema.required must be an array of strings.`);
    }
  }
  return tools as McpToolDefinition[];
}

async function run() {
  const options = readOptions(args);
  const analysis = { englishStyle: options['english-style'] };

  if (options.fix && options.file) {
    const rawTools = readToolFile(options.file);
    const { tools: fixedTools, changes } = fixToolCatalog(rawTools);
    if (options.write) {
      const targetPath = options.write === '__DEFAULT__' ? path.resolve(options.file) : path.resolve(options.write);
      fs.writeFileSync(targetPath, JSON.stringify({ tools: fixedTools }, null, 2), 'utf-8');
      console.error(`✨ Fixed ${changes.length} issue(s) across ${fixedTools.length} tool(s). Saved to ${targetPath}`);
    } else {
      console.error(`✨ Fixed ${changes.length} issue(s) across ${fixedTools.length} tool(s). (Pass --write to save)`);
    }
    if (changes.length > 0) {
      for (const change of changes) {
        console.error(`  - [${change.toolName}] ${change.action}: ${change.detail}`);
      }
    }
  }

  const baseline = options.baseline === undefined ? undefined : readToolFile(options.baseline);
  const results: ServerBenchmarkResult[] = [];
  let comparison: CatalogComparison | undefined;
  const benchmark = (name: string, tools: McpToolDefinition[]) => {
    if (baseline) comparison = compareToolCatalogs(baseline, tools, analysis);
    results.push(benchmarkServerTools(name, tools, analysis));
  };

  if (options.cmd !== undefined) {
    const [command, ...cmdArgs] = splitCommand(options.cmd);
    if (!command) throw new Error('--cmd requires a non-empty executable name.');
    benchmark(options.cmd, await fetchToolsFromStdioServer(command, cmdArgs));
  } else if (options.url !== undefined) {
    benchmark(options.url, await fetchToolsFromSseServer(options.url, options.headers));
  } else if (options.config !== undefined) {
    const loaded = await loadToolsFromConfig(options.config);
    for (const server of loaded) {
      if (server.error) {
        console.error(`⚠️ Could not load server "${server.serverName}": ${server.error}`);
      } else {
        benchmark(server.serverName, server.tools);
      }
    }
  } else if (options.file !== undefined) {
    const serverName = path.basename(options.file, path.extname(options.file));
    benchmark(serverName, readToolFile(options.file));
  } else if (options.ecosystem) {
    for (const [serverName, tools] of Object.entries(ECOSYSTEM_SERVERS)) benchmark(serverName, tools);
    results.sort((a, b) => b.overallTQI - a.overallTQI);
  } else {
    for (const [serverName, tools] of Object.entries(DATASETS)) benchmark(serverName, tools);
    results.sort((a, b) => b.overallTQI - a.overallTQI);
  }

  const markdown = (comparison ? formatComparison(comparison) : '') + formatMarkdownLeaderboard(results);
  if (options.json) {
    console.log(JSON.stringify(comparison ? { comparison, benchmark: results } : results, null, 2));
  } else {
    console.log(markdown);
  }

  if (options.html !== undefined) {
    const resolvedHtmlPath = path.resolve(options.html);
    fs.writeFileSync(resolvedHtmlPath, generateHtmlReport(results, comparison), 'utf-8');
    console.error(`📄 HTML report written to ${resolvedHtmlPath}`);
  }
  if (options.sarif !== undefined) {
    const resolvedSarifPath = path.resolve(options.sarif);
    const sourceUri = options.file || options.cmd || options.url || options.config || 'bundled-datasets';
    fs.writeFileSync(resolvedSarifPath, generateSarifReport(results, sourceUri), 'utf-8');
    console.error(`🛡️ SARIF report written to ${resolvedSarifPath}`);
  }
  if (options.badge !== undefined) {
    const resolvedBadgePath = path.resolve(options.badge);
    const avgScore = results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.overallTQI, 0) / results.length) : 0;
    let grade = 'F';
    if (avgScore >= 90) grade = 'A+';
    else if (avgScore >= 80) grade = 'A';
    else if (avgScore >= 70) grade = 'B';
    else if (avgScore >= 60) grade = 'C';
    else if (avgScore >= 50) grade = 'D';
    fs.writeFileSync(resolvedBadgePath, generateSvgBadge(avgScore, grade), 'utf-8');
    console.error(`🛡️ SVG quality badge written to ${resolvedBadgePath}`);
  }

  if (options.cost) {
    const totalTokens = results.reduce((acc, r) => acc + r.totalTokens, 0);
    const totalTools = results.reduce((acc, r) => acc + r.toolsAnalyzed, 0);
    const costReport = estimateTokenEconomics(totalTokens, totalTools);
    console.log('\n' + formatTokenEconomicsMarkdown(costReport));
  }

  if (options['pr-comment'] !== undefined) {
    if (!comparison) {
      throw new Error('--pr-comment requires --baseline to compare changes against.');
    }
    const resolvedPrCommentPath = path.resolve(options['pr-comment']);
    const baselineBenchmark = baseline ? benchmarkServerTools('baseline', baseline, analysis) : undefined;
    const candidateBenchmark = results[0] ?? benchmarkServerTools('candidate', [], analysis);
    const prCommentMd = formatPrComment(comparison, candidateBenchmark, baselineBenchmark);
    fs.writeFileSync(resolvedPrCommentPath, prCommentMd, 'utf-8');
    console.error(`💬 GitHub PR comment written to ${resolvedPrCommentPath}`);
  }

  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, markdown, 'utf-8');
  }

  const minScore = Math.min(...results.map(result => result.overallTQI));
  if (options.failUnder !== null && minScore < options.failUnder) {
    console.error(`CI Gate Failed: Minimum TQI score (${minScore}) is below required threshold (${options.failUnder}).`);
    process.exitCode = 1;
  }
  if (options.failOn.includes('breaking') && comparison?.breakingChanges.length) {
    console.error(`CI Gate Failed: ${comparison.breakingChanges.length} breaking catalog change(s).`);
    process.exitCode = 1;
  }

  const minimumSeverity = options.failOn.includes('high') ? 'high'
    : options.failOn.includes('critical') ? 'critical' : undefined;
  if (minimumSeverity) {
    const diagnostics = comparison?.newDiagnostics
      ?? results.flatMap(result => result.tools.flatMap(tool => tool.diagnostics ?? []));
    const count = diagnostics.filter(finding =>
      finding.severity === 'critical' || (minimumSeverity === 'high' && finding.severity === 'high')
    ).length;
    if (count) {
      console.error(`CI Gate Failed: ${count} ${comparison ? 'new ' : ''}finding(s) at ${minimumSeverity} severity or higher.`);
      process.exitCode = 1;
    }
  }
}

try {
  await run();
} catch (error) {
  console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
}
