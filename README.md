# MCP Benchmark

[![CI](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml)
[![MCP Registry Servers](https://img.shields.io/badge/MCP_Registry-0_Servers-blueviolet)](registry/servers/)
[![Live Web Playground](https://img.shields.io/badge/Live_Playground-GitHub_Pages-emerald)](https://yunusarda-sudo.github.io/mcp-benchmark/)
[![Registry Sync](https://img.shields.io/badge/Registry_Sync-Weekly_PR-cyan)](.github/workflows/sync-ecosystem.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

MCP Benchmark is a quantitative quality benchmark, linter, and auto-fixer for **Model Context Protocol (MCP)** tool definitions. It scores tool catalogs using deterministic rules for schema strictness, semantic density, and context token efficiency — working entirely offline without needing an LLM or API keys.

> 🚀 **[Try the Live Web Playground](https://yunusarda-sudo.github.io/mcp-benchmark/)** — Paste any MCP tool JSON, get an instant Google Lighthouse-style scorecard, token cost estimates, and one-click auto-fixes directly in your browser.

---

## 🌐 MCP Registry Leaderboard

The leaderboard ranks **real tool definitions** from remote MCP servers listed in the [official MCP Registry](https://registry.modelcontextprotocol.io).

**Method.** A scheduled [GitHub Action](.github/workflows/sync-ecosystem.yml) pages through the registry API, keeps the latest active version of each server, and selects servers that publish an auth-free `streamable-http` remote over HTTPS. For each one it runs a live `initialize` → `tools/list` handshake and scores whatever the server returns. Servers that need credentials, fail, or return no valid tools are not listed, and no tool definitions are written by hand or generated. Packages (npm, PyPI, Docker) are never downloaded or run. Every entry in [`registry/servers/`](registry/servers/) records its provenance (registry name, version, remote URL, fetch time, and a SHA-256 of the tools). The sync opens a pull request instead of pushing to `main`.

Because only auth-free remote servers can be probed this way, the leaderboard is a sample of the public remote ecosystem, not the whole registry. Many popular servers run locally or need an API key and do not appear here.

<!-- SYNC_INFO_START -->
<!-- SYNC_INFO_END -->

Benchmark the synced servers locally:

```bash
npx --yes github:yunusarda-sudo/mcp-benchmark --ecosystem
node dist/cli.js --ecosystem --html ecosystem-leaderboard.html
```

Scores use the **Tool Quality Index (TQI)**: Schema Strictness (40%), Semantic Density (35%), and Context Token Footprint (25%).

> 💡 **Where does your MCP server rank?** Test your catalog locally:
> ```bash
> npx --yes github:yunusarda-sudo/mcp-benchmark -f tools.json
> ```

### Rankings

<!-- LEADERBOARD_START -->
<!-- LEADERBOARD_END -->

---

## Use it from your AI agent

Install the bundled skill so Claude Code, Cursor, Codex and other agents can audit an MCP server's tools and propose fixes on request:

```bash
npx skills add yunusarda-sudo/mcp-benchmark
```

In Claude Code you can install it as a plugin instead:

```text
/plugin install mcp-benchmark --marketplace yunusarda-sudo/mcp-benchmark
```

The skill lives in [`skills/mcp-benchmark/SKILL.md`](skills/mcp-benchmark/SKILL.md).

## Quickstart

Run the bundled examples directly from GitHub with Node.js 18 or newer:

```bash
npx --yes github:yunusarda-sudo/mcp-benchmark
```

For repeatable runs, pin the Git dependency to a commit SHA. To work with the included sample file, clone the repository:

```bash
git clone https://github.com/yunusarda-sudo/mcp-benchmark.git
cd mcp-benchmark
npm ci
node dist/cli.js --file examples/sample-mcp-tools.json --json
```

The sample has **3 tools** and scores **73/100 (B)** under the current rules. Use the [sample tool catalog](examples/sample-mcp-tools.json) as a starting point for your own input.

## Inspect a catalog

| Input | Example |
| --- | --- |
| Servers synced from the MCP Registry | `node dist/cli.js --ecosystem --html report.html` |
| JSON file | `node dist/cli.js --file examples/sample-mcp-tools.json --json` |
| Local MCP server over stdio | `node dist/cli.js --cmd "node fixtures/echo-mcp-server.mjs"` |
| MCP server using the legacy HTTP+SSE transport | `node dist/cli.js --url http://localhost:8000/sse` |
| Multi-server config (Claude Desktop / Cursor) | `node dist/cli.js --config ~/.cursor/mcp.json` |

A JSON input can be a tool array, an object with a `tools` array, or a complete [MCP `tools/list` JSON-RPC response](https://modelcontextprotocol.io/specification/2025-11-25/server/tools#listing-tools). For a paginated export, combine the tools from all pages into one array. Live inspection follows successive `nextCursor` values for the configured server and only lists tool definitions. The stdio mode starts the supplied executable, so use a command you trust.

`--ecosystem` benchmarks the servers in `registry/servers/`, whose tools were fetched live from auth-free remote servers in the MCP Registry (see [MCP Registry Leaderboard](#-mcp-registry-leaderboard)). Pass `--registry-dir <path>` to benchmark another directory of entries.

`--html report.html` saves a standalone interactive report with live tool search and diagnostic filtering. `--sarif report.sarif` exports an OASIS SARIF v2.1.0 report for GitHub Code Scanning. `--badge mcp-badge.svg` generates an SVG quality badge for your repository. `--json` sends only report JSON to stdout, with diagnostics on stderr. Use `--help` for all options.

## Automated Fixes (`--fix`)

Automatically clean up common schema issues and conversational filler:

```bash
# Preview fixes in terminal
node dist/cli.js --file tools.json --fix

# Apply and save cleaned definitions directly to file
node dist/cli.js --file tools.json --fix --write
```

The fixer automatically:
- Injects missing root `type: "object"` and initializes `properties`.
- Cleans conversational filler words ("This tool allows you to...", "Basically...", etc.) from descriptions.
- Prunes non-existent fields and deduplicates entries in `inputSchema.required`.
- Prunes empty enum arrays (`enum: []`).
- Sets default `{ type: "string" }` items schema on `type: "array"` fields lacking `items`.

## 💰 Token Economics & Cost Estimator (`--cost`)

In multi-turn autonomous agent conversations, tool schemas are re-injected into the context window on **every single turn**. Bloated descriptions and loose parameter schemas silently cost thousands of dollars in LLM API bills.

Calculate your context token consumption and estimated monthly API spend across 1,000 multi-turn sessions:

```bash
node dist/cli.js --file tools.json --cost
```

Output:
```markdown
### 💰 Context Window Token Economics

* **Catalog Size:** 320 tokens per model turn (~64 tok/tool)
* **15-Turn Agent Session:** 4,800 tokens consumed by tool schemas alone
* **At 1,000 sessions/month:** 4,800,000 tokens injected into LLM context

| LLM Provider | Estimated Schema Cost / 1k Sessions |
|:---|:---:|
| **Anthropic Claude 3.5 Sonnet** ($3/M) | $14.40 |
| **OpenAI GPT-4o** ($2.50/M) | $12.00 |
| **Google Gemini 1.5 Pro** ($2/M) | $9.60 |
```

## 💬 Automated GitHub PR Comment (`--pr-comment`)

Generate a structured, ready-to-post GitHub PR comment comparing candidate changes against baseline:

```bash
node dist/cli.js --baseline base.json --file candidate.json --pr-comment pr-comment.md
```

Includes delta scores, token footprint diff, breaking change warnings, and collapsible diagnostic details.

## README SVG Quality Badge

Generate a retina-crisp SVG badge to display your tool quality score:

```bash
node dist/cli.js --file tools.json --badge mcp-badge.svg
```

Embed it in your markdown:
```markdown
![MCP Quality](mcp-badge.svg)
```

## GitHub Actions & SARIF Export

Use the composite GitHub Action directly in your workflows:

```yaml
- name: Run MCP Benchmark
  uses: yunusarda-sudo/mcp-benchmark@v1
  with:
    file: 'tools.json'
    fail-under: '80'
    sarif: 'mcp-results.sarif'

- name: Upload SARIF to GitHub Code Scanning
  uses: github/codeql-action/upload-sarif@v3
  if: always()
  with:
    sarif_file: 'mcp-results.sarif'
```

## CI usage

Run this in an existing workflow step after checkout and Node setup:

```bash
npx --yes github:yunusarda-sudo/mcp-benchmark --file ./tools.json --fail-under 70
```

Replace `./tools.json` with your catalog. Pick a threshold from 0 to 100 based on your current results. A score at the threshold passes. Invalid arguments, unreadable or incomplete exports, connection errors, and scores below the threshold exit with code `1`. If `GITHUB_STEP_SUMMARY` is set, the CLI writes a Markdown report there.

## Compare changes in a pull request

```bash
node dist/cli.js --baseline examples/pr-base.json --file examples/pr-candidate.json \
  --fail-on breaking --fail-on critical --html comparison.html
```

The example reports that `get_customer` was removed, `create_booking` gained a required `staffId`, and `list_services` lacks a description. It writes the report and exits with code `1`.

- `--fail-on breaking` requires a baseline. It flags removed tools and newly required top-level input properties.
- `--fail-on critical` or `--fail-on high` fails on findings at that severity or higher. With a baseline, it considers only new findings. Repeat `--fail-on` to combine checks.
- Findings in `diagnostics` carry a stable `code`, `severity`, JSON Pointer `path`, `message`, and `suggestion`. The existing `findings` strings remain available.
- Plain `--json` still returns a benchmark array. With `--baseline`, it returns an object with `comparison` and `benchmark` fields.

This compares selected tool fields and reports common breaking changes. Semantic JSON Schema compatibility and client behavior require additional tests.

For a project that tracks its catalog as `tools.json`, use this GitHub Actions workflow after these options are available on the benchmark ref. Pin that ref to an immutable commit for repeatable CI results.

```yaml
name: Compare MCP tools
on: [pull_request]
permissions:
  contents: read
jobs:
  compare:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Compare tool catalogs
        env:
          BASE_SHA: ${{ github.event.pull_request.base.sha }}
        run: |
          git show "$BASE_SHA:tools.json" > "$RUNNER_TEMP/mcp-baseline.json"
          npx --yes github:yunusarda-sudo/mcp-benchmark \
            --baseline "$RUNNER_TEMP/mcp-baseline.json" --file tools.json \
            --fail-on breaking --fail-on critical
```

## Bundled examples

The default command scores the small illustrative definitions in [the CLI source](src/cli.ts). These scores are fixture results. They do not measure the live vendor implementations, current tool catalogs, or LLM performance.

| Fixture | Tools | Grade | TQI |
| --- | ---: | --- | ---: |
| Postgres-style | 1 | A+ | 96 |
| Filesystem-style | 3 | A+ | 95 |
| Taskade-style | 2 | A+ | 94 |
| Cremind-style | 1 | A+ | 92 |
| Ambiguous baseline | 1 | C | 62 |

## Scoring

The **Tool Quality Index (TQI)** averages tool scores across a server. Each tool score weights schema strictness at 40%, semantic density at 35%, and estimated token efficiency at 25%. The analyzer also subtracts penalties for matching suspicious text patterns. The [analyzer source](src/analyzer.ts) defines the rules and weights.

- **Schema strictness** checks signals such as root type, property types, descriptions, and constraints. Full JSON Schema and MCP protocol validation are outside the scope of this score.
- **Semantic density** checks description length and common filler phrases. Use `--english-style` for optional English action-verb advice. The advice does not affect TQI.
- **Token efficiency** estimates tokens from serialized string length divided by four and rounded up. Actual counts vary by tokenizer.
- **Security findings** are heuristic review signals. A clean report cannot establish that a tool is safe.

When comparing runs, keep the input fixture and benchmark commit fixed. Use an offline export if the remote catalog can change between runs.

## Library usage

After installing from GitHub with `npm install github:yunusarda-sudo/mcp-benchmark`:

```ts
import { analyzeToolDefinition } from 'mcp-benchmark';

const report = analyzeToolDefinition({
  name: 'list_services',
  description: 'List the available services and their published durations.',
  inputSchema: { type: 'object', properties: {} },
});

console.log(report.metrics.overallScore, report.findings);
```

## 🤝 Community & Contributions

We want MCP Benchmark to be shaped and driven by the global MCP developer community.

### 🚀 Get Your MCP Server on the Leaderboard
The leaderboard is built from the [official MCP Registry](https://registry.modelcontextprotocol.io). To be listed automatically, [publish your server to the registry](https://github.com/modelcontextprotocol/registry) with an auth-free `streamable-http` remote; the next weekly sync probes it and opens a pull request with its live `tools/list` output.

Servers that cannot be probed (local-only or authenticated) can be added as a manual entry, which the leaderboard marks as "manual entry":

```bash
node dist/cli.js --submit my-tools.json \
  --name "My Server" \
  --category "Databases & Storage" \
  --repo "https://github.com/org/my-server"
```

This writes `registry/servers/manual-<slug>.json` with `source: { "type": "manual" }`. Open a PR with that file, or use the [GitHub Issue Form](https://github.com/yunusarda-sudo/mcp-benchmark/issues/new?template=submit_server.yml).

### 📐 Pluggable Linter & Benchmark Rules
All linting and scoring rules are modularized under [`src/rules/`](src/rules/).
- List all available rules:
  ```bash
  npx mcp-benchmark --rules
  ```
- Propose or add new checks (e.g. schema, security, naming, efficiency) by following our [Rule Contribution Guide](CONTRIBUTING.md#-2-add-a-new-benchmark-or-linter-rule).

### 🔍 Auto-Discover Local Client Configs
Scan your machine for installed MCP servers across Claude Desktop, Cursor, and VS Code:
```bash
npx mcp-benchmark --discover
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow, server registry schema, and rule authoring guide. The project is licensed under [MIT](LICENSE).
