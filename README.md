# mcp-benchmark

[![npm](https://img.shields.io/npm/v/mcp-benchmark.svg)](https://www.npmjs.com/package/mcp-benchmark)
[![CI](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml)
[![MCP Registry Servers](https://img.shields.io/badge/MCP_Registry-854_Servers-blueviolet)](LEADERBOARD.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**A deterministic linter and quality score for MCP tool definitions.** Point it at a `tools/list` export, a local server, or a client config and it reports schema gaps, vague descriptions, prompt-injection patterns, and how many context tokens your tools cost on every turn. It runs offline, calls no LLM, and gives the same result every time, so it works as a CI gate.

```bash
npx mcp-benchmark -f tools.json
```

A browser playground (paste tools, get a score, no install) and a searchable leaderboard live at **https://yunusarda-sudo.github.io/mcp-benchmark/**.

## Example

Running it on the bundled [`examples/sample-mcp-tools.json`](examples/sample-mcp-tools.json) (3 tools):

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
  * ...
  * INFO description.filler (/description): Description contains conversational filler phrases.
```

`--fix` repairs what can be repaired mechanically:

```text
$ mcp-benchmark -f examples/sample-mcp-tools.json --fix
✨ Fixed 3 issue(s) across 3 tool(s). (Pass --write to save)
  - [send_notification] set-root-type: Set inputSchema.type to "object"
  - [handle_data] set-root-type: Set inputSchema.type to "object"
  - [handle_data] clean-fluff-description: Cleaned conversational fluff from description: "This tool allows you to basically do wha..." -> "Do whatever you need with the provided d..."
```

After `--fix --write` the same file scores 78/100. `--cost` estimates the context the catalog uses:

```text
* Catalog Size: 285 tokens per model turn (~95 tok/tool)
* 15-Turn Agent Session: 4,275 tokens consumed by tool schemas alone
* At 1,000 sessions/month: 4,275,000 tokens injected into LLM context
```

(Output trimmed, with Markdown emphasis and escapes removed for reading. Token counts are estimates: serialized length divided by four.)

## Install

**CLI** (Node.js 18 or newer):

```bash
npx mcp-benchmark -f tools.json                                 # once published to npm
npx --yes github:yunusarda-sudo/mcp-benchmark -f tools.json     # works today
```

**GitHub Action:**

```yaml
- uses: yunusarda-sudo/mcp-benchmark@v1
  with:
    file: tools.json
    fail-under: '80'
    sarif: mcp-results.sarif
```

**Agent skill** for Claude Code, Cursor, Codex and other agents, so they can audit a server's tools and propose fixes on request:

```bash
npx skills add yunusarda-sudo/mcp-benchmark
```

In Claude Code you can install it as a plugin instead:

```text
/plugin install mcp-benchmark --marketplace yunusarda-sudo/mcp-benchmark
```

## What it does

- **Scores every tool** with the Tool Quality Index (TQI, 0 to 100): schema strictness 40%, semantic density 35%, token efficiency 25%, minus penalties for risky description patterns.
- **Reports findings with stable codes**, severity, a JSON Pointer path, and a suggested fix, for example `schema.array-without-items` or `description.prompt-override`.
- **Estimates token cost** of the catalog per turn and per session (`--cost`).
- **Diffs against a baseline** and flags breaking changes: removed tools and newly required parameters (`--baseline`, `--fail-on breaking`).
- **Fixes common issues** in place: missing root `type: "object"`, filler phrases, dangling `required` entries, empty enums, arrays without `items` (`--fix --write`).
- **Fits CI**: `--fail-under`, SARIF v2.1.0 for GitHub Code Scanning, a Markdown PR comment, an SVG badge, a standalone HTML report, and a job summary when `GITHUB_STEP_SUMMARY` is set.
- **Reads any source**: a JSON file (tool array, `{ tools }`, or a raw `tools/list` response), a stdio server (`--cmd`), a legacy HTTP+SSE endpoint (`--url`), or every server in a Claude Desktop / Cursor config (`--config`).

The checks are deterministic heuristics. They do not run your tools, call a model, or prove that a tool is safe.

## Newly released servers

The most recently published servers in the official MCP Registry that the weekly sync could probe, with their live scores. Regenerated on every sync.

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

## Leaderboard

Top servers by TQI from the synced registry sample. The full ranked list is in **[LEADERBOARD.md](LEADERBOARD.md)**, and the [site](https://yunusarda-sudo.github.io/mcp-benchmark/) lets you search and filter it.

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

Many servers reach A+ because the rules reward a typed, described, compact schema. A high TQI says the definitions are well formed. It does not rank how useful a server is.

## Methodology and data

A scheduled [workflow](.github/workflows/sync-ecosystem.yml) pages through the [official MCP Registry](https://registry.modelcontextprotocol.io) API, keeps the latest active version of each server, and selects servers that publish an auth-free `streamable-http` remote over HTTPS. For each one it runs a live `initialize` → `tools/list` handshake and scores whatever the server returns. Packages (npm, PyPI, Docker) are never downloaded or run. No tool definitions are written by hand or generated. The sync opens a pull request; it never pushes to `main`.

<!-- SYNC_INFO_START -->
**854 servers · 13722 tools · last sync 2026-11-22.**
Last run: 70058 registry entries scanned, 41951 auth-free remote candidates, 891 returned tools, 597 required authentication, 12 failed (probe cap reached).
Probed newest first by registry publish date, at most 1500 per run and at most 3 listed servers per operator (registrable domain of the remote host).
<!-- SYNC_INFO_END -->

**Provenance.** Every entry in [`registry/servers/`](registry/servers/) stores the registry name, version, remote URL, publish time, fetch time, and a SHA-256 of the tools it scored. The Data links in the tables above point at those files.

**Limitations.**

- Only auth-free remote servers can be probed. Servers that run locally or need an API key are missing, so this is a sample of the public remote ecosystem, not the whole registry.
- Candidates are probed newest first, at most 1,500 per run and at most 3 listed servers per operator, so a bulk publisher cannot fill the table. Older servers are worked through over later runs.
- Scores reflect the tools a server returned on the fetch date. Catalogs change.
- Server names, titles, and descriptions are third-party text. They are escaped in the README and rendered as plain text on the site.

Benchmark the synced data yourself:

```bash
npx --yes github:yunusarda-sudo/mcp-benchmark --ecosystem --html ecosystem.html
```

## Scoring

Each tool score is a weighted sum; the server TQI is the average over its tools. Grades: A+ ≥ 90, A ≥ 80, B ≥ 70, C ≥ 60, D ≥ 50, F below. The [analyzer source](src/analyzer.ts) and the [rules](src/rules/) define every check.

- **Schema strictness** checks root type, property types, descriptions, required fields, and constraints. Full JSON Schema validation is out of scope.
- **Semantic density** checks description length and filler phrases. `--english-style` adds optional English wording advice that does not affect TQI.
- **Token efficiency** estimates tokens from serialized length divided by four. Real counts depend on the tokenizer.
- **Security findings** are pattern matches for prompt overrides, exfiltration, and covert actions. A clean report is not a safety guarantee.

`mcp-benchmark --rules` lists every rule.

## CI and SARIF

Upload findings to GitHub Code Scanning:

```yaml
- uses: yunusarda-sudo/mcp-benchmark@v1
  with:
    file: tools.json
    fail-under: '80'
    sarif: mcp-results.sarif

- uses: github/codeql-action/upload-sarif@v3
  if: always()
  with:
    sarif_file: mcp-results.sarif
```

Action inputs: `file`, `cmd`, `url`, `config`, `baseline`, `fail-under`, `fail-on`, `sarif`, `badge`, `cost`, `pr-comment`, `html` (see [`action.yml`](action.yml)).

Or call the CLI from any step. A score at the threshold passes; invalid input, connection errors, and scores below it exit with code `1`:

```bash
npx --yes github:yunusarda-sudo/mcp-benchmark --file ./tools.json --fail-under 70
```

**Catch breaking changes in a pull request** by comparing against the base branch:

```yaml
- name: Compare tool catalogs
  env:
    BASE_SHA: ${{ github.event.pull_request.base.sha }}
  run: |
    git show "$BASE_SHA:tools.json" > "$RUNNER_TEMP/mcp-baseline.json"
    npx --yes github:yunusarda-sudo/mcp-benchmark \
      --baseline "$RUNNER_TEMP/mcp-baseline.json" --file tools.json \
      --fail-on breaking --fail-on critical --pr-comment pr-comment.md
```

`--fail-on breaking` flags removed tools and newly required top-level inputs. `--fail-on critical` or `high` fails on findings at that severity; with a baseline, only new findings count. Try it locally with `--baseline examples/pr-base.json --file examples/pr-candidate.json`. Pin the benchmark ref to a commit SHA for repeatable results.

## Other inputs and outputs

| Task | Command |
| --- | --- |
| Lint a local stdio server | `mcp-benchmark --cmd "node fixtures/echo-mcp-server.mjs"` |
| Lint a legacy HTTP+SSE server | `mcp-benchmark --url http://localhost:8000/sse` |
| Lint every server in a client config | `mcp-benchmark --config ~/.cursor/mcp.json` |
| Find local client configs | `mcp-benchmark --discover` |
| Write an HTML report | `mcp-benchmark -f tools.json --html report.html` |
| Write an SVG badge | `mcp-benchmark -f tools.json --badge mcp-badge.svg` |
| Machine-readable output | `mcp-benchmark -f tools.json --json` |

The stdio mode starts the command you give it, so use one you trust. `--help` lists every option.

## Library usage

```ts
import { analyzeToolDefinition } from 'mcp-benchmark';

const report = analyzeToolDefinition({
  name: 'list_services',
  description: 'List the available services and their published durations.',
  inputSchema: { type: 'object', properties: {} },
});

console.log(report.metrics.overallScore, report.findings);
```

Until the npm release, install with `npm install github:yunusarda-sudo/mcp-benchmark`.

## Contributing

- **Get your server listed**: [publish it to the MCP Registry](https://github.com/modelcontextprotocol/registry) with an auth-free `streamable-http` remote and the next weekly sync will probe it. Servers that cannot be probed can be added as a marked manual entry with `--submit` (see [CONTRIBUTING.md](CONTRIBUTING.md)).
- **Add a rule**: rules live in [`src/rules/`](src/rules/); the [rule guide](CONTRIBUTING.md#-2-add-a-new-benchmark-or-linter-rule) walks through one.
- **Report a scoring problem**: [open an issue](https://github.com/yunusarda-sudo/mcp-benchmark/issues) with the tool JSON and the result you expected.

## License

[MIT](LICENSE)
