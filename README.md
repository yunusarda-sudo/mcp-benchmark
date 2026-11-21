# MCP Benchmark

[![CI](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml)
[![Ecosystem Servers](https://img.shields.io/badge/MCP_Ecosystem-102_Servers-blueviolet)](fixtures/ecosystem-100.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

MCP Benchmark is a quantitative quality benchmark, linter, and auto-fixer for **Model Context Protocol (MCP)** tool definitions. It scores tool catalogs using deterministic rules for schema strictness, semantic density, and context token efficiency — working entirely offline without needing an LLM or API keys.

---

## 🌐 Ecosystem Benchmark Corpus (102 Standard MCP Servers)

MCP Benchmark includes a comprehensive reference corpus of **102 standard MCP servers** spanning developer tools, cloud providers, databases, and APIs.

Run the ecosystem benchmark across all 102 servers with one command:

```bash
npx --yes github:yunusarda-sudo/mcp-benchmark --ecosystem
```

Or generate a searchable HTML report:

```bash
node dist/cli.js --ecosystem --html ecosystem-leaderboard.html
```

### Ecosystem Breakdown by Category

| Category | Servers | Representative Servers Included |
| --- | :---: | --- |
| **Developer Tools & VCS** | 10 | Filesystem, Git, GitHub, GitLab, VS Code, Docker, Kubernetes, Terraform, Ansible, Jenkins |
| **Databases & Storage** | 12 | PostgreSQL, SQLite, MySQL, Redis, MongoDB, Elasticsearch, ClickHouse, Snowflake, BigQuery, Supabase, Firebase, S3/MinIO |
| **Vector DBs & AI Search** | 10 | Pinecone, Qdrant, Weaviate, Chroma, Milvus, Neo4j Graph, Tavily, Brave Search, Perplexity, Exa |
| **Productivity & Notes** | 10 | Notion, Obsidian, Linear, Jira, Confluence, Trello, Asana, ClickUp, Airtable, Todoist |
| **Communication & Alerting** | 10 | Slack, Discord, Telegram, Microsoft Teams, Zendesk, Intercom, PagerDuty, Twilio, SendGrid, Mailchimp |
| **Cloud & Hosting Platforms** | 10 | AWS Cloud, Google Cloud, Azure, Cloudflare, Vercel, Netlify, Railway, Render, Fly.io, DigitalOcean |
| **Observability & Analytics** | 10 | Sentry, Datadog, Grafana, Prometheus, New Relic, PostHog, Mixpanel, Segment, BetterStack, LaunchDarkly |
| **Web Scraping & Automation** | 10 | Puppeteer, Playwright, Fetch HTTP, Cheerio, Crawl4AI, Browserless, BrightData, Apify, n8n, Make.com |
| **Payments, CRM & Finance** | 10 | Stripe, Shopify, PayPal, Square, Plaid Banking, HubSpot CRM, Salesforce, QuickBooks, Xero, Google Sheets |
| **Social, Media & Knowledge** | 10 | YouTube Transcript, ArXiv, PubMed Bio, Spotify, Reddit, Twitter/X, HackerNews, Weather, Google Drive, Google Calendar |
| **Total Benchmark Corpus** | **102** | *All catalog definitions available in [`fixtures/ecosystem-100.json`](fixtures/ecosystem-100.json)* |

---

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
| 100+ Ecosystem benchmark corpus | `node dist/cli.js --ecosystem --html report.html` |
| JSON file | `node dist/cli.js --file examples/sample-mcp-tools.json --json` |
| Local MCP server over stdio | `node dist/cli.js --cmd "node fixtures/echo-mcp-server.mjs"` |
| MCP server using the legacy HTTP+SSE transport | `node dist/cli.js --url http://localhost:8000/sse` |
| Multi-server config (Claude Desktop / Cursor) | `node dist/cli.js --config ~/.cursor/mcp.json` |

A JSON input can be a tool array, an object with a `tools` array, or a complete [MCP `tools/list` JSON-RPC response](https://modelcontextprotocol.io/specification/2025-11-25/server/tools#listing-tools). For a paginated export, combine the tools from all pages into one array. Live inspection follows successive `nextCursor` values for the configured server and only lists tool definitions. The stdio mode starts the supplied executable, so use a command you trust.

`--ecosystem` benchmarks the curated corpus of **102 standard MCP servers** spanning developer tools, databases, vector search, cloud providers, and productivity APIs.

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

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for the development workflow and fixture guidance. The project is licensed under [MIT](LICENSE).
