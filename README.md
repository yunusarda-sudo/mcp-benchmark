# MCP Benchmark

[![CI](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml)
[![Ecosystem Servers](https://img.shields.io/badge/MCP_Ecosystem-130%2B_Servers-blueviolet)](fixtures/ecosystem-100.json)
[![Live Web Playground](https://img.shields.io/badge/Live_Playground-GitHub_Pages-emerald)](https://yunusarda-sudo.github.io/mcp-benchmark/)
[![Automated Sync](https://img.shields.io/badge/Ecosystem_Sync-Weekly_Cron-cyan)](.github/workflows/sync-ecosystem.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

MCP Benchmark is a quantitative quality benchmark, linter, and auto-fixer for **Model Context Protocol (MCP)** tool definitions. It scores tool catalogs using deterministic rules for schema strictness, semantic density, and context token efficiency — working entirely offline without needing an LLM or API keys.

> 🚀 **[Try the Live Web Playground](https://yunusarda-sudo.github.io/mcp-benchmark/)** — Paste any MCP tool JSON, get an instant Google Lighthouse-style scorecard, token cost estimates, and one-click auto-fixes directly in your browser.

---

## 🌐 Ecosystem Benchmark Corpus (130+ MCP Servers)

MCP Benchmark includes an active reference corpus of **130+ standard and community MCP servers** spanning developer tools, cloud providers, databases, and APIs. A scheduled [GitHub Action](.github/workflows/sync-ecosystem.yml) automatically syncs and scores newly released servers weekly.

Run the ecosystem benchmark across all 102 servers with one command:

```bash
npx --yes github:yunusarda-sudo/mcp-benchmark --ecosystem
```

Or generate a searchable HTML report:

```bash
node dist/cli.js --ecosystem --html ecosystem-leaderboard.html
```

## 🏆 Official MCP Ecosystem Leaderboard (Rankings)

Deterministic quality benchmarks for **102 standard MCP servers**, evaluated by the **Tool Quality Index (TQI)** across Schema Strictness (40%), Semantic Density (35%), and Context Token Footprint (25%).

> 💡 **Where does your MCP server rank?** Test your catalog locally:
> ```bash
> npx --yes github:yunusarda-sudo/mcp-benchmark -f tools.json
> ```

### Top 25 MCP Servers

| Rank | MCP Server | Grade | TQI Score | Schema Strictness | Semantic Density | Token Efficiency | Avg Tokens/Tool |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **BetterStack MCP** | `A+` | **100/100** | 100% | 100% | 100% | 64 tok |
| 2 | **Shopify Store MCP** | `A+` | **100/100** | 100% | 100% | 100% | 65 tok |
| 3 | **Git MCP** | `A+` | **96/100** | 90% | 100% | 100% | 72 tok |
| 4 | **GitLab MCP** | `A+` | **96/100** | 100% | 100% | 85% | 94 tok |
| 5 | **PostgreSQL MCP** | `A+` | **96/100** | 90% | 100% | 100% | 59 tok |
| 6 | **SQLite MCP** | `A+` | **96/100** | 90% | 100% | 100% | 74 tok |
| 7 | **MySQL MCP** | `A+` | **96/100** | 90% | 100% | 100% | 60 tok |
| 8 | **ClickHouse MCP** | `A+` | **96/100** | 100% | 100% | 85% | 91 tok |
| 9 | **S3 MinIO MCP** | `A+` | **96/100** | 90% | 100% | 100% | 77 tok |
| 10 | **Tavily Search MCP** | `A+` | **96/100** | 100% | 100% | 85% | 85 tok |
| 11 | **Perplexity MCP** | `A+` | **96/100** | 90% | 100% | 100% | 60 tok |
| 12 | **Notion MCP** | `A+` | **96/100** | 90% | 100% | 100% | 65 tok |
| 13 | **Obsidian MCP** | `A+` | **96/100** | 90% | 100% | 100% | 62 tok |
| 14 | **Jira MCP** | `A+` | **96/100** | 90% | 100% | 100% | 67 tok |
| 15 | **Confluence MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 16 | **Trello MCP** | `A+` | **96/100** | 90% | 100% | 100% | 77 tok |
| 17 | **Asana MCP** | `A+` | **96/100** | 90% | 100% | 100% | 77 tok |
| 18 | **ClickUp MCP** | `A+` | **96/100** | 90% | 100% | 100% | 70 tok |
| 19 | **Todoist MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 20 | **Telegram MCP** | `A+` | **96/100** | 90% | 100% | 100% | 75 tok |
| 21 | **Zendesk MCP** | `A+` | **96/100** | 90% | 100% | 100% | 80 tok |
| 22 | **Intercom MCP** | `A+` | **96/100** | 90% | 100% | 100% | 80 tok |
| 23 | **PagerDuty MCP** | `A+` | **96/100** | 100% | 100% | 85% | 116 tok |
| 24 | **Twilio MCP** | `A+` | **96/100** | 90% | 100% | 100% | 77 tok |
| 25 | **AWS Cloud MCP** | `A+` | **96/100** | 90% | 100% | 100% | 65 tok |

<details>
<summary><b>👉 Click here to expand and view all 102 MCP Server Rankings (Full Leaderboard)</b></summary>
<br>

| Rank | MCP Server | Grade | TQI Score | Schema Strictness | Semantic Density | Token Efficiency | Avg Tokens/Tool |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **BetterStack MCP** | `A+` | **100/100** | 100% | 100% | 100% | 64 tok |
| 2 | **Shopify Store MCP** | `A+` | **100/100** | 100% | 100% | 100% | 65 tok |
| 3 | **Git MCP** | `A+` | **96/100** | 90% | 100% | 100% | 72 tok |
| 4 | **GitLab MCP** | `A+` | **96/100** | 100% | 100% | 85% | 94 tok |
| 5 | **PostgreSQL MCP** | `A+` | **96/100** | 90% | 100% | 100% | 59 tok |
| 6 | **SQLite MCP** | `A+` | **96/100** | 90% | 100% | 100% | 74 tok |
| 7 | **MySQL MCP** | `A+` | **96/100** | 90% | 100% | 100% | 60 tok |
| 8 | **ClickHouse MCP** | `A+` | **96/100** | 100% | 100% | 85% | 91 tok |
| 9 | **S3 MinIO MCP** | `A+` | **96/100** | 90% | 100% | 100% | 77 tok |
| 10 | **Tavily Search MCP** | `A+` | **96/100** | 100% | 100% | 85% | 85 tok |
| 11 | **Perplexity MCP** | `A+` | **96/100** | 90% | 100% | 100% | 60 tok |
| 12 | **Notion MCP** | `A+` | **96/100** | 90% | 100% | 100% | 65 tok |
| 13 | **Obsidian MCP** | `A+` | **96/100** | 90% | 100% | 100% | 62 tok |
| 14 | **Jira MCP** | `A+` | **96/100** | 90% | 100% | 100% | 67 tok |
| 15 | **Confluence MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 16 | **Trello MCP** | `A+` | **96/100** | 90% | 100% | 100% | 77 tok |
| 17 | **Asana MCP** | `A+` | **96/100** | 90% | 100% | 100% | 77 tok |
| 18 | **ClickUp MCP** | `A+` | **96/100** | 90% | 100% | 100% | 70 tok |
| 19 | **Todoist MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 20 | **Telegram MCP** | `A+` | **96/100** | 90% | 100% | 100% | 75 tok |
| 21 | **Zendesk MCP** | `A+` | **96/100** | 90% | 100% | 100% | 80 tok |
| 22 | **Intercom MCP** | `A+` | **96/100** | 90% | 100% | 100% | 80 tok |
| 23 | **PagerDuty MCP** | `A+` | **96/100** | 100% | 100% | 85% | 116 tok |
| 24 | **Twilio MCP** | `A+` | **96/100** | 90% | 100% | 100% | 77 tok |
| 25 | **AWS Cloud MCP** | `A+` | **96/100** | 90% | 100% | 100% | 65 tok |
| 26 | **Azure Cloud MCP** | `A+` | **96/100** | 90% | 100% | 100% | 57 tok |
| 27 | **Vercel MCP** | `A+` | **96/100** | 90% | 100% | 100% | 63 tok |
| 28 | **Netlify MCP** | `A+` | **96/100** | 90% | 100% | 100% | 59 tok |
| 29 | **Railway MCP** | `A+` | **96/100** | 90% | 100% | 100% | 65 tok |
| 30 | **Render MCP** | `A+` | **96/100** | 90% | 100% | 100% | 61 tok |
| 31 | **Fly.io MCP** | `A+` | **96/100** | 90% | 100% | 100% | 57 tok |
| 32 | **DigitalOcean MCP** | `A+` | **96/100** | 90% | 100% | 100% | 58 tok |
| 33 | **Sentry MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 34 | **Grafana MCP** | `A+` | **96/100** | 90% | 100% | 100% | 58 tok |
| 35 | **Prometheus MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 36 | **New Relic MCP** | `A+` | **96/100** | 90% | 100% | 100% | 58 tok |
| 37 | **Mixpanel MCP** | `A+` | **96/100** | 90% | 100% | 100% | 62 tok |
| 38 | **Puppeteer MCP** | `A+` | **96/100** | 90% | 100% | 100% | 60 tok |
| 39 | **Playwright MCP** | `A+` | **96/100** | 90% | 100% | 100% | 63 tok |
| 40 | **Fetch HTTP MCP** | `A+` | **96/100** | 100% | 100% | 85% | 82 tok |
| 41 | **Crawl4AI MCP** | `A+` | **96/100** | 90% | 100% | 100% | 65 tok |
| 42 | **Browserless MCP** | `A+` | **96/100** | 90% | 100% | 100% | 63 tok |
| 43 | **BrightData MCP** | `A+` | **96/100** | 90% | 100% | 100% | 62 tok |
| 44 | **Make.com MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 45 | **PayPal MCP** | `A+` | **96/100** | 90% | 100% | 100% | 63 tok |
| 46 | **Square MCP** | `A+` | **96/100** | 90% | 100% | 100% | 63 tok |
| 47 | **Plaid Banking MCP** | `A+` | **96/100** | 90% | 100% | 100% | 68 tok |
| 48 | **HubSpot CRM MCP** | `A+` | **96/100** | 90% | 100% | 100% | 63 tok |
| 49 | **Salesforce MCP** | `A+` | **96/100** | 90% | 100% | 100% | 60 tok |
| 50 | **QuickBooks MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 51 | **Xero Accounting MCP** | `A+` | **96/100** | 90% | 100% | 100% | 60 tok |
| 52 | **PubMed Bio MCP** | `A+` | **96/100** | 90% | 100% | 100% | 67 tok |
| 53 | **Spotify Music MCP** | `A+` | **96/100** | 90% | 100% | 100% | 64 tok |
| 54 | **Reddit MCP** | `A+` | **96/100** | 100% | 100% | 85% | 89 tok |
| 55 | **Twitter X MCP** | `A+` | **96/100** | 90% | 100% | 100% | 62 tok |
| 56 | **HackerNews MCP** | `A+` | **96/100** | 90% | 100% | 100% | 62 tok |
| 57 | **Weather MCP** | `A+` | **96/100** | 90% | 100% | 100% | 72 tok |
| 58 | **Google Drive MCP** | `A+` | **96/100** | 90% | 100% | 100% | 66 tok |
| 59 | **Google Calendar MCP** | `A+` | **96/100** | 90% | 100% | 100% | 80 tok |
| 60 | **Filesystem MCP** | `A+` | **95/100** | 90% | 100% | 95% | 70 tok |
| 61 | **Docker MCP** | `A+` | **94/100** | 90% | 100% | 93% | 75 tok |
| 62 | **Redis MCP** | `A+` | **94/100** | 90% | 100% | 93% | 76 tok |
| 63 | **GitHub MCP** | `A+` | **92/100** | 90% | 100% | 85% | 119 tok |
| 64 | **VS Code MCP** | `A+` | **92/100** | 90% | 100% | 85% | 96 tok |
| 65 | **Kubernetes MCP** | `A+` | **92/100** | 90% | 100% | 85% | 86 tok |
| 66 | **Terraform MCP** | `A+` | **92/100** | 90% | 100% | 85% | 88 tok |
| 67 | **Ansible MCP** | `A+` | **92/100** | 90% | 100% | 85% | 106 tok |
| 68 | **Jenkins MCP** | `A+` | **92/100** | 90% | 100% | 85% | 84 tok |
| 69 | **MongoDB MCP** | `A+` | **92/100** | 90% | 100% | 85% | 102 tok |
| 70 | **Elasticsearch MCP** | `A+` | **92/100** | 90% | 100% | 85% | 81 tok |
| 71 | **Snowflake MCP** | `A+` | **92/100** | 90% | 100% | 85% | 81 tok |
| 72 | **BigQuery MCP** | `A+` | **92/100** | 90% | 100% | 85% | 86 tok |
| 73 | **Supabase MCP** | `A+` | **92/100** | 90% | 100% | 85% | 88 tok |
| 74 | **Firebase MCP** | `A+` | **92/100** | 90% | 100% | 85% | 85 tok |
| 75 | **Pinecone MCP** | `A+` | **92/100** | 90% | 100% | 85% | 91 tok |
| 76 | **Qdrant MCP** | `A+` | **92/100** | 90% | 100% | 85% | 111 tok |
| 77 | **Weaviate MCP** | `A+` | **92/100** | 90% | 100% | 85% | 88 tok |
| 78 | **Chroma MCP** | `A+` | **92/100** | 90% | 100% | 85% | 97 tok |
| 79 | **Milvus MCP** | `A+` | **92/100** | 90% | 100% | 85% | 93 tok |
| 80 | **Neo4j Graph MCP** | `A+` | **92/100** | 90% | 100% | 85% | 82 tok |
| 81 | **Brave Search MCP** | `A+` | **92/100** | 90% | 100% | 85% | 83 tok |
| 82 | **Exa Neural Search MCP** | `A+` | **92/100** | 90% | 100% | 85% | 83 tok |
| 83 | **Linear MCP** | `A+` | **92/100** | 90% | 100% | 85% | 102 tok |
| 84 | **Airtable MCP** | `A+` | **92/100** | 90% | 100% | 85% | 81 tok |
| 85 | **Slack MCP** | `A+` | **92/100** | 90% | 100% | 85% | 82 tok |
| 86 | **Discord MCP** | `A+` | **92/100** | 90% | 100% | 85% | 83 tok |
| 87 | **Microsoft Teams MCP** | `A+` | **92/100** | 90% | 100% | 85% | 99 tok |
| 88 | **SendGrid MCP** | `A+` | **92/100** | 90% | 100% | 85% | 97 tok |
| 89 | **Mailchimp MCP** | `A+` | **92/100** | 90% | 100% | 85% | 83 tok |
| 90 | **Google Cloud MCP** | `A+` | **92/100** | 90% | 100% | 85% | 84 tok |
| 91 | **Cloudflare MCP** | `A+` | **92/100** | 90% | 100% | 85% | 85 tok |
| 92 | **Datadog MCP** | `A+` | **92/100** | 90% | 100% | 85% | 103 tok |
| 93 | **PostHog MCP** | `A+` | **92/100** | 90% | 100% | 85% | 85 tok |
| 94 | **Segment MCP** | `A+` | **92/100** | 90% | 100% | 85% | 98 tok |
| 95 | **LaunchDarkly MCP** | `A+` | **92/100** | 90% | 100% | 85% | 99 tok |
| 96 | **Cheerio MCP** | `A+` | **92/100** | 90% | 100% | 85% | 86 tok |
| 97 | **Apify MCP** | `A+` | **92/100** | 90% | 100% | 85% | 82 tok |
| 98 | **n8n Automation MCP** | `A+` | **92/100** | 90% | 100% | 85% | 84 tok |
| 99 | **Stripe Payments MCP** | `A+` | **92/100** | 90% | 100% | 85% | 95 tok |
| 100 | **Google Sheets MCP** | `A+` | **92/100** | 90% | 100% | 85% | 118 tok |
| 101 | **YouTube Transcript MCP** | `A+` | **92/100** | 90% | 100% | 85% | 86 tok |
| 102 | **ArXiv Research MCP** | `A+` | **92/100** | 90% | 100% | 85% | 84 tok |

</details>

---

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

### 🚀 Submit Your MCP Server to the Leaderboard
Want your MCP server ranked on the official leaderboard and get a quality badge?
1. Open a PR adding a single JSON file to [`registry/servers/<your-server>.json`](registry/servers/) following [`registry/schema.json`](registry/schema.json).
2. Or run:
   ```bash
   node dist/cli.js --submit my-tools.json \
     --name "My Server" \
     --category "Databases & Storage" \
     --repo "https://github.com/org/my-server"
   ```
3. Or submit via the [GitHub Issue Form](https://github.com/yunusarda-sudo/mcp-benchmark/issues/new?template=submit_server.yml).

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
