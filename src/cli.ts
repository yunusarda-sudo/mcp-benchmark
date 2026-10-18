#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { benchmarkServerTools } from './analyzer.js';
import { generateHtmlReport } from './htmlReport.js';
import { fetchToolsFromStdioServer } from './liveClient.js';
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

export function formatMarkdownLeaderboard(results: ServerBenchmarkResult[]): string {
  let md = '# 📊 Model Context Protocol (MCP) Tool Quality Benchmark — Leaderboard\n\n';
  md += '| Rank | MCP Server | Grade | TQI Score | Schema Strictness | Semantic Density | Token Efficiency | Avg Tokens/Tool |\n';
  md += '|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|\n';

  results.forEach((r, idx) => {
    md += `| ${idx + 1} | **${r.serverName}** | \`${r.grade}\` | **${r.overallTQI}/100** | ${r.averageSchemaStrictness}% | ${r.averageSemanticDensity}% | ${r.averageTokenEfficiency}% | ${r.averageTokensPerTool} tok |\n`;
  });

  md += '\n\n### 🔍 Detailed Diagnostic Insights\n\n';
  for (const r of results) {
    md += `#### ${r.serverName} (Grade: ${r.grade} · TQI: ${r.overallTQI}/100)\n`;
    for (const t of r.tools) {
      md += `* **\`${t.toolName}\`** (${t.metrics.overallScore}/100) — Tokens: ${t.tokenCount}\n`;
      if (t.findings.length > 0) {
        for (const f of t.findings) {
          md += `  * ⚠️ _${f}_\n`;
        }
      } else {
        md += `  * ✅ _Optimal schema strictness, imperative density, and boundary guards._\n`;
      }
    }
    if (r.collisions && r.collisions.length > 0) {
      md += `\n  **⚔️ Tool Collisions (${r.collisions.length})**\n`;
      for (const c of r.collisions) {
        md += `  * \`${c.toolA}\` ↔ \`${c.toolB}\` — similarity ${c.similarityScore} — _${c.reason}_\n`;
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
  --fail-under <score>   Exit with non-zero code if TQI score is below this threshold (CI/CD gate)
  --json                 Output results as JSON
  --markdown, -m         Output results as a Markdown table (default)
  --html [path]          Write a self-contained HTML report to disk (default: mcp-benchmark-report.html)
  --help, -h             Show this help message

Examples:
  npx mcp-benchmark                       Run reference benchmark suite across standard servers
  npx mcp-benchmark -f tools.json         Lint and score your own MCP tool definitions
  npx mcp-benchmark --cmd "npx -y @modelcontextprotocol/server-everything"
  npx mcp-benchmark -f tools.json --fail-under 80
  npx mcp-benchmark --html report.html    Write a shareable HTML report
`);
  process.exit(0);
}

const fileIdx = args.indexOf('--file') !== -1 ? args.indexOf('--file') : args.indexOf('-f');
const cmdIdx = args.indexOf('--cmd');
const failUnderIdx = args.indexOf('--fail-under');
const failUnder = failUnderIdx !== -1 ? parseInt(args[failUnderIdx + 1], 10) : null;
const isJson = args.includes('--json');

const htmlIdx = args.indexOf('--html');
let htmlPath: string | null = null;
if (htmlIdx !== -1) {
  const candidate = args[htmlIdx + 1];
  htmlPath = candidate && !candidate.startsWith('-') ? candidate : 'mcp-benchmark-report.html';
}

const results: ServerBenchmarkResult[] = [];

if (cmdIdx !== -1) {
  const rawCommand = args[cmdIdx + 1];
  if (!rawCommand) {
    console.error('Error: --cmd requires a server command string, e.g. --cmd "npx -y @scope/server".');
    process.exit(1);
  }

  const [command, ...cmdArgs] = splitCommand(rawCommand);
  let tools: McpToolDefinition[];
  try {
    tools = await fetchToolsFromStdioServer(command, cmdArgs);
  } catch (e: any) {
    console.error(`Error: Failed to inspect live MCP server "${rawCommand}": ${e.message}`);
    process.exit(1);
  }

  results.push(benchmarkServerTools(rawCommand, tools));
} else if (fileIdx !== -1 && args[fileIdx + 1]) {
  const filePath = path.resolve(process.cwd(), args[fileIdx + 1]);
  if (!fs.existsSync(filePath)) {
    console.error(`Error: File not found at ${filePath}`);
    process.exit(1);
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch (e: any) {
    console.error(`Error: Invalid JSON in ${filePath}: ${e.message}`);
    process.exit(1);
  }

  const tools: McpToolDefinition[] = Array.isArray(parsed) ? parsed : (parsed.tools || []);
  const serverName = path.basename(filePath, path.extname(filePath));
  results.push(benchmarkServerTools(serverName, tools));
} else {
  for (const [serverName, tools] of Object.entries(DATASETS)) {
    results.push(benchmarkServerTools(serverName, tools));
  }
  results.sort((a, b) => b.overallTQI - a.overallTQI);
}

if (isJson) {
  console.log(JSON.stringify(results, null, 2));
} else {
  console.log(formatMarkdownLeaderboard(results));
}

if (htmlPath !== null) {
  const resolvedHtmlPath = path.resolve(process.cwd(), htmlPath);
  fs.writeFileSync(resolvedHtmlPath, generateHtmlReport(results), 'utf-8');
  console.error(`📄 HTML report written to ${resolvedHtmlPath}`);
}

if (process.env.GITHUB_STEP_SUMMARY) {
  fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, formatMarkdownLeaderboard(results), 'utf-8');
}

if (failUnder !== null) {
  const minScore = Math.min(...results.map((r) => r.overallTQI));
  if (minScore < failUnder) {
    console.error(`❌ CI Gate Failed: Minimum TQI score (${minScore}) is below required threshold (${failUnder}).`);
    process.exit(1);
  }
}
