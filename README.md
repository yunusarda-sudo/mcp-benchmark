# mcp-benchmark

<div align="center">

[![npm version](https://img.shields.io/npm/v/mcp-benchmark.svg)](https://www.npmjs.com/package/mcp-benchmark)
[![CI](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml)
[![MCP Registry Servers](https://img.shields.io/badge/MCP_Registry-854_Servers-blueviolet)](LEADERBOARD.md)
[![Web Playground](https://img.shields.io/badge/Web_Playground-Live-10b981)](https://yunusarda-sudo.github.io/mcp-benchmark/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**A deterministic linter, security inspector, and quantitative quality benchmark for Model Context Protocol (MCP) tool definitions.**

[Web Playground](https://yunusarda-sudo.github.io/mcp-benchmark/) · [Leaderboard (854)](LEADERBOARD.md) · [Rules Catalog](https://yunusarda-sudo.github.io/mcp-benchmark/) · [npm Package](https://www.npmjs.com/package/mcp-benchmark)

</div>

---

Point `mcp-benchmark` at any `tools/list` export, running server, or client config (`claude_desktop_config.json`, `mcp.json`). It reports schema gaps, ambiguous descriptions, prompt-injection directives, and the exact token cost injected into LLM contexts on every turn.

Runs **100% offline**, calls **zero LLMs**, and produces identical results every time — making it an ideal deterministic gate for CI/CD pipelines.

```bash
npx mcp-benchmark -f tools.json
```

Try the **[Browser Playground & Searchable Leaderboard](https://yunusarda-sudo.github.io/mcp-benchmark/)** (zero install, paste tools, get instant TQI and model token costs).

---

## ⚡ Quick Start

### 1. Run via CLI (Instant, No Install)

```bash
# Lint a tool definition file
npx mcp-benchmark -f tools.json

# Auto-fix common issues (clean fluff, add root type, fix enums)
npx mcp-benchmark -f tools.json --fix --write

# Estimate token consumption & API costs per 1,000 agent sessions
npx mcp-benchmark -f tools.json --cost

# Auto-discover and audit all MCP servers configured on your machine (Cursor, Claude, VS Code)
npx mcp-benchmark --discover

# Lint a local live server over stdio
npx mcp-benchmark --cmd "node build/index.js"
```

### 2. Install Globally or as a Project DevDependency

```bash
npm install -g mcp-benchmark
# or in your project:
npm install -D mcp-benchmark
```

### 3. GitHub Actions CI Gate

Add deterministic MCP quality verification and Code Scanning alerts to your pull requests:

```yaml
- name: Lint MCP Tool Definitions
  uses: yunusarda-sudo/mcp-benchmark@v1
  with:
    file: tools.json
    fail-under: '80'
    sarif: mcp-results.sarif

- name: Upload SARIF to GitHub Code Scanning
  uses: github/codeql-action/upload-sarif@v3
  if: always()
  with:
    sarif_file: mcp-results.sarif
```

### 4. Agent Skill (Claude Code, Cursor, Codex)

Install as an autonomous agent skill so coding agents can audit your tools and propose fixes automatically:

```bash
npx skills add yunusarda-sudo/mcp-benchmark
```

Or in Claude Code:
```text
/plugin install mcp-benchmark --marketplace yunusarda-sudo/mcp-benchmark
```

---

## 📊 Example Output

Running on the bundled [`examples/sample-mcp-tools.json`](examples/sample-mcp-tools.json) (3 tools):

```text
$ mcp-benchmark -f examples/sample-mcp-tools.json

| Rank | MCP Server       | Grade | TQI Score | Schema Strictness | Semantic Density | Token Efficiency | Avg Tokens/Tool |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1    | sample-mcp-tools | B     | 73/100    | 47%               | 90%              | 90%              | 95 tok          |

sample-mcp-tools (Grade: B · TQI: 73/100)
* search_knowledge_base (96/100) — Estimated tokens: 145
  * No findings.
* send_notification (68/100) — Estimated tokens: 42
  * WARNING schema.root-type (/inputSchema/type): inputSchema missing root type: "object".
  * WARNING schema.parameter-types (/inputSchema/properties): 2 parameters lack explicit JSON primitive types.
  * WARNING schema.parameter-descriptions (/inputSchema/properties): Multiple input parameters lack descriptions.
* handle_data (54/100) — Estimated tokens: 98
  * WARNING schema.root-type (/inputSchema/type): inputSchema missing root type: "object".
  * INFO description.filler (/description): Description contains conversational filler phrases.
```

### 🛠️ 1-Click Auto-Fix (`--fix`)

Mechanical defects and conversational fluff can be repaired automatically:

```text
$ mcp-benchmark -f examples/sample-mcp-tools.json --fix --write
✨ Fixed 3 issue(s) across 3 tool(s).
  - [send_notification] set-root-type: Set inputSchema.type to "object"
  - [handle_data] set-root-type: Set inputSchema.type to "object"
  - [handle_data] clean-fluff-description: Cleaned conversational fluff from description
```

### 💰 Token Economics & Footprint (`--cost`)

Every tool definition is injected into the model's context window on **every single agent turn**. Bloated schemas cause significant latency and API costs:

```text
$ mcp-benchmark -f tools.json --cost
* Catalog Size: 285 tokens per model turn (~95 tok/tool)
* 15-Turn Agent Session: 4,275 tokens consumed by tool schemas alone
* At 1,000 sessions/month: 4,275,000 tokens injected into LLM context
```

---

## 📐 Quality, Security & Linter Rules

The Tool Quality Index (TQI, 0 to 100) is calculated across three primary dimensions, with deductions for security risks:

* **Schema Strictness (40%):** Validates root `type: "object"`, explicit parameter primitive types, property descriptions, and constraints (enums, array items, regex patterns).
* **Semantic Density (35%):** Analyzes description clarity, optimal length (25–400 chars), and flags conversational fluff that confuses tool selection.
* **Token Efficiency (25%):** Measures context consumption per tool to eliminate schema bloat.
* **Security & Prompt Hygiene (Penalties):** Detects prompt injection overrides, data exfiltration directives, and covert actions hidden inside tool or parameter descriptions.

| Rule ID | Domain | Default Severity | Description |
| :--- | :--- | :---: | :--- |
| `schema.root-type` | Schema | Warning | Requires `inputSchema.type: "object"` for JSON Schema compliance. |
| `schema.required-fields` | Schema | Critical | Ensures `required` is an array of strings referencing defined properties. |
| `schema.property-boolean-required` | Schema | Warning | Flags invalid OpenAPI/boolean `required: true/false` inside property objects. |
| `schema.parameter-types` | Schema | Warning | Flags parameters lacking explicit JSON primitive types (`string`, `number`, etc.). |
| `schema.array-without-items` | Schema | Warning | Flags arrays missing an `items` schema (causes LLM argument hallucination). |
| `schema.empty-enum` | Schema | Critical | Flags empty `enum: []` arrays that make valid arguments impossible. |
| `description.empty` | Semantic | Critical | Disallows tools with empty or missing descriptions. |
| `description.length` | Semantic | Info | Encourages optimal description length (25–400 characters). |
| `description.filler` | Semantic | Info | Flags conversational fluff phrases ("this tool allows you to..."). |
| `security.prompt-hygiene` | Security | Critical | Flags prompt injection, system overrides, and secret exfiltration directives. |
| `efficiency.context-footprint` | Efficiency | Info | Flags oversized tool definitions exceeding 600 context tokens. |
| `tool.empty-name` | Naming | Critical | Ensures every tool has a non-empty name. |
| `tool.name-length` | Naming | Warning | Checks that tool names stay under 64 characters for LLM function calling. |
| `tool.invalid-name-format` | Naming | Warning | Ensures tool names only use alphanumeric characters, underscores, and hyphens. |

---

## 🏆 Ecosystem Leaderboard & Sync

The project continuously probes and benchmarks remote, auth-free servers from the [official MCP Registry](https://registry.modelcontextprotocol.io).

All 854 synced servers are categorized into 16 domain sectors:
* **AI, LLMs & Agents** · **Developer Tools & DevOps** · **Databases & Storage** · **Vector DBs & AI Search**
* **Finance, Crypto & Web3** · **E-Commerce & Retail** · **Design, UI & 3D Media** · **Web Scraping & Automation**
* **Communication & Alerting** · **Productivity & Notes** · **Healthcare & Wellness** · **Jobs, Career & Learning**
* **Travel, Maps & Navigation** · **Security & Identity** · **Observability & Analytics** · **Social, Media & Knowledge**

Explore the full interactive leaderboard with sorting, search, and tool inspection at:  
👉 **[https://yunusarda-sudo.github.io/mcp-benchmark/](https://yunusarda-sudo.github.io/mcp-benchmark/)**

### Newly Released Servers

<!-- NEW_RELEASES_START -->
| Published | Server | Grade | TQI | Tools | Data |
|:---|:---|:---:|---:|---:|:---:|
| 2026-11-22 | **Zapmatte Green Screen Remover** · `com.zapmatte/green-screen-remover` | `A` | 82 | 6 | [json](registry/servers/com-zapmatte-green-screen-remover.json) |
| 2026-11-22 | [**GoldSeam**](https://github.com/AcademyOne-Inc/GoldSeam) · `com.ksaworks/goldseam` | `A` | 80 | 115 | [json](registry/servers/com-ksaworks-goldseam.json) |
| 2026-11-22 | [**Charmotion**](https://github.com/charmotion/charmotion-mcp) · `app.charmotion/charmotion` | `A` | 86 | 16 | [json](registry/servers/app-charmotion-charmotion.json) |
| 2026-11-22 | [**io.github.cyanheads/internet-archive-mcp-server**](https://github.com/cyanheads/internet-archive-mcp-server) | `B` | 78 | 5 | [json](registry/servers/io-github-cyanheads-internet-archive-mcp-server.json) |
| 2026-11-22 | [**Syracuse Company News**](https://github.com/1145-am/syracuse-mcp-server) · `io.github.1145-am/syracuse-mcp-server` | `A` | 82 | 4 | [json](registry/servers/io-github-1145-am-syracuse-mcp-server.json) |
| 2026-11-22 | **ЦПО — оборудование для общепита и торговли, Владивосток и Хабаровск** · `ru.cpo-dv/catalog` | `A` | 89 | 5 | [json](registry/servers/ru-cpo-dv-catalog.json) |
| 2026-11-22 | [**Kongus Site MCP Server**](https://github.com/Kongus/site) · `io.github.Kongus/site` | `A+` | 92 | 7 | [json](registry/servers/io-github-kongus-site.json) |
| 2026-11-22 | **Jason Lau Academy** · `academy.jasonlau/classes` | `A+` | 90 | 6 | [json](registry/servers/academy-jasonlau-classes.json) |
| 2026-11-22 | **AI for alle: priser og fakta om AI-værktøjer** · `dk.ai-foralle/ai-foralle` | `A+` | 94 | 6 | [json](registry/servers/dk-ai-foralle-ai-foralle.json) |
| 2026-11-22 | [**OptimToken: AI and Compute Economics**](https://github.com/OptimNow/ai-pricing-hub-mcp) · `io.github.OptimNow/ai-pricing-hub` | `B` | 78 | 8 | [json](registry/servers/io-github-optimnow-ai-pricing-hub.json) |
<!-- NEW_RELEASES_END -->

### Top Synced Servers

<!-- LEADERBOARD_TOP_START -->
| # | Server | Grade | TQI | Tools | Tokens/tool | Data |
|---:|:---|:---:|---:|---:|---:|:---:|
| 1 | **轻链查券｜多平台商品优惠查询** · `io.github.youxiage/qinglian-coupon` | `A+` | 96 | 1 | 57 | [json](registry/servers/io-github-youxiage-qinglian-coupon.json) |
| 2 | **KovAPI Docs** · `com.kovapi/docs` | `A+` | 96 | 3 | 108 | [json](registry/servers/com-kovapi-docs.json) |
| 3 | **Ahmed Shaikh's Blog** · `dev.ahmedshaikh/blog` | `A+` | 96 | 3 | 103 | [json](registry/servers/dev-ahmedshaikh-blog.json) |
| 4 | **Wallet Doctor** · `com.manhourplan/wallet-doctor` | `A+` | 96 | 5 | 118 | [json](registry/servers/com-manhourplan-wallet-doctor.json) |
| 5 | **トゥーンエル** · `com.tooneru/manga` | `A+` | 96 | 6 | 128 | [json](registry/servers/com-tooneru-manga.json) |
| 6 | **Tally food nutrients** · `io.github.martindochamp/tally-foods` | `A+` | 96 | 2 | 136 | [json](registry/servers/io-github-martindochamp-tally-foods.json) |
| 7 | [**PageDigest — Web Page Summarizer &amp; Structured Extractor**](https://github.com/SuBai520-QWQ/pagedigest) · `io.github.SuBai520-QWQ/pagedigest` | `A+` | 96 | 1 | 134 | [json](registry/servers/io-github-subai520-qwq-pagedigest.json) |
| 8 | [**Alshhbaa Brassware — نحاسيات الشهباء**](https://github.com/Alshhbaa/alshhbaa-agent-kit) · `com.alshhbaa/server` | `A+` | 96 | 6 | 129 | [json](registry/servers/com-alshhbaa-server.json) |
| 9 | [**Wisely Arcade Games**](https://github.com/SaqibNaseer404/wiselyarcade) · `io.github.SaqibNaseer404/wiselyarcade` | `A+` | 95 | 6 | 81 | [json](registry/servers/io-github-saqibnaseer404-wiselyarcade.json) |
| 10 | **stash** · `org.duckdns.agentnotes/stash` | `A+` | 95 | 3 | 105 | [json](registry/servers/org-duckdns-agentnotes-stash.json) |
| 11 | [**대전한콕 Daejeon Hankok**](https://github.com/iamhuman-cheolheelee/daejeon-hankok-mcp) · `com.ferrorium.daejeon/hankok` | `A+` | 95 | 11 | 124 | [json](registry/servers/com-ferrorium-daejeon-hankok.json) |
| 12 | [**BPJ First-Party AI Tools**](https://github.com/f-tiger/agi-site) · `io.github.f-tiger/bpj-ai-tools` | `A+` | 95 | 500 | 116 | [json](registry/servers/io-github-f-tiger-bpj-ai-tools.json) |
| 13 | [**Alshhbaa Brassware Store — نحاسيات الشهباء**](https://github.com/Alshhbaa/alshhbaa-agent-kit) · `com.alshhbaa.shop/server` | `A+` | 95 | 4 | 143 | [json](registry/servers/com-alshhbaa-shop-server.json) |
| 14 | **SchedJoules Calendars** · `com.schedjoules/calendars` | `A+` | 95 | 3 | 121 | [json](registry/servers/com-schedjoules-calendars.json) |
| 15 | **SchedJoules Calendars** · `io.github.schedjoules/calendars` | `A+` | 95 | 3 | 121 | [json](registry/servers/io-github-schedjoules-calendars.json) |
<!-- LEADERBOARD_TOP_END -->

<!-- SYNC_INFO_START -->
**854 servers · 13722 tools · last sync 2026-11-22.**
Last run: 70058 registry entries scanned, 41951 auth-free remote candidates, 891 returned tools, 597 required authentication, 12 failed (probe cap reached).
Probed newest first by registry publish date, at most 1500 per run and at most 3 listed servers per operator (registrable domain of the remote host).
<!-- SYNC_INFO_END -->

The complete ranked list of all 854 servers is published in **[LEADERBOARD.md](LEADERBOARD.md)**.

---

## 🧰 CLI Command Reference

| Command / Option | Description |
| :--- | :--- |
| `mcp-benchmark -f tools.json` | Lint and score any tool definitions file. |
| `mcp-benchmark -f tools.json --fix --write` | Auto-clean conversational fluff, fix missing root types, and repair schemas in place. |
| `mcp-benchmark -f tools.json --cost` | Estimate multi-turn context token consumption and monthly API costs. |
| `mcp-benchmark --discover` | Automatically scan local machine for Claude Desktop, Cursor, and VS Code MCP configs. |
| `mcp-benchmark -c ~/.cursor/mcp.json` | Benchmark all servers configured in a client config file. |
| `mcp-benchmark --cmd "node build/index.js"` | Connect to a local stdio MCP server, execute `tools/list`, and score output. |
| `mcp-benchmark --url "https://api.example.com/sse"` | Benchmark a live remote MCP server over HTTP+SSE with optional `-H` headers. |
| `mcp-benchmark -f tools.json --fail-under 80` | Set a minimum threshold score (exits code `1` if overall TQI is below threshold). |
| `mcp-benchmark -f tools.json --sarif report.sarif` | Export GitHub Code Scanning SARIF v2.1.0 diagnostic report. |
| `mcp-benchmark -f tools.json --badge badge.svg` | Generate an SVG quality badge for your repository README. |
| `mcp-benchmark -f tools.json --html report.html` | Export an interactive standalone HTML report. |
| `mcp-benchmark --baseline v1.json -f v2.json` | Catch breaking changes (removed tools, newly required parameters) between versions. |
| `mcp-benchmark --ecosystem` | Benchmark all local registry server exports in bulk. |
| `mcp-benchmark --rules` | List all available benchmark heuristics and default severities. |

---

## 💻 Programmatic TypeScript / JavaScript API

```ts
import { analyzeToolDefinition, autoFixTools, benchmarkServerTools } from 'mcp-benchmark';

// 1. Analyze an individual tool definition
const result = analyzeToolDefinition({
  name: 'query_user_records',
  description: 'Retrieve user account profile and subscription status.',
  inputSchema: {
    type: 'object',
    required: ['user_id'],
    properties: {
      user_id: { type: 'string', description: 'Unique user identifier.' }
    }
  }
});

console.log(`Tool Score: ${result.metrics.overallScore}/100`);
console.log(`Diagnostics: ${result.findings.length} issue(s)`);

// 2. Auto-fix an array of tools
const { fixedTools, changeCount } = autoFixTools([/* raw tools */]);
console.log(`Applied ${changeCount} automatic repairs.`);
```

---

## 🤝 Contributing

We welcome community contributions, bug reports, and new linter rules!

* **Submit an MCP Server:** If your server is published to the official MCP Registry with an auth-free remote, our weekly sync will automatically probe and rank it. You can also submit manual community entries using `mcp-benchmark --submit <path> --name <name> --category <category>` (see [CONTRIBUTING.md](CONTRIBUTING.md)).
* **Add a Linter Rule:** Rules live in [`src/rules/`](src/rules/). Follow the [Rule Authoring Guide](CONTRIBUTING.md#-2-add-a-new-benchmark-or-linter-rule).
* **Report an Issue:** Found an edge case or scoring mismatch? [Open a GitHub Issue](https://github.com/yunusarda-sudo/mcp-benchmark/issues).

---

## 📄 License

[MIT](LICENSE) © 2026 [Yunus Arda Güney](https://github.com/yunusarda-sudo)
