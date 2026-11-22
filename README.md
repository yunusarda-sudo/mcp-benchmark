# MCP Benchmark

[![CI](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml)
[![MCP Registry Servers](https://img.shields.io/badge/MCP_Registry-854_Servers-blueviolet)](registry/servers/)
[![Live Web Playground](https://img.shields.io/badge/Live_Playground-GitHub_Pages-emerald)](https://yunusarda-sudo.github.io/mcp-benchmark/)
[![Registry Sync](https://img.shields.io/badge/Registry_Sync-Weekly_PR-cyan)](.github/workflows/sync-ecosystem.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

MCP Benchmark is a quantitative quality benchmark, linter, and auto-fixer for **Model Context Protocol (MCP)** tool definitions. It scores tool catalogs using deterministic rules for schema strictness, semantic density, and context token efficiency — working entirely offline without needing an LLM or API keys.

> 🚀 **[Try the Live Web Playground](https://yunusarda-sudo.github.io/mcp-benchmark/)** — Paste any MCP tool JSON, get an instant Google Lighthouse-style scorecard, token cost estimates, and one-click auto-fixes directly in your browser.

---

## 🌐 MCP Registry Leaderboard

The leaderboard ranks **real tool definitions** from remote MCP servers listed in the [official MCP Registry](https://registry.modelcontextprotocol.io).

**Method.** A scheduled [GitHub Action](.github/workflows/sync-ecosystem.yml) pages through the registry API, keeps the latest active version of each server, and selects servers that publish an auth-free `streamable-http` remote over HTTPS. For each one it runs a live `initialize` → `tools/list` handshake and scores whatever the server returns. Servers that need credentials, fail, or return no valid tools are not listed, and no tool definitions are written by hand or generated. Packages (npm, PyPI, Docker) are never downloaded or run. Every entry in [`registry/servers/`](registry/servers/) records its provenance (registry name, version, remote URL, fetch time, and a SHA-256 of the tools). The sync opens a pull request instead of pushing to `main`.

Because only auth-free remote servers can be probed this way, the leaderboard is a sample of the public remote ecosystem, not the whole registry. Many popular servers run locally or need an API key and do not appear here. Candidates are probed **newest first** by their registry publish date, so recently released servers appear first. Each run probes at most 1,500 candidates (`MAX_PROBES`) and lists at most 3 servers per operator (`MAX_PER_OPERATOR`, by the registrable domain of the remote host), so a single bulk publisher cannot fill the table. The registry has tens of thousands of candidates, so older servers are worked through over later runs and the current list is a partial subset.

<!-- SYNC_INFO_START -->
**854 servers · 13722 tools · last sync 2026-11-22.**
Last run: 70058 registry entries scanned, 41951 auth-free remote candidates, 891 returned tools, 597 required authentication, 12 failed (probe cap reached).
Probed newest first by registry publish date, at most 1500 per run and at most 3 listed servers per operator (registrable domain of the remote host).
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

| Rank | MCP Server | Grade | TQI Score | Tools | Strictness | Density | Efficiency | Avg Tokens/Tool |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **轻链查券｜多平台商品优惠查询** <sub>io.github.youxiage/qinglian-coupon</sub> | `A+` | **96/100** | 1 | 90% | 100% | 100% | 57 tok |
| 2 | **KovAPI Docs** <sub>com.kovapi/docs</sub> | `A+` | **96/100** | 3 | 97% | 100% | 90% | 108 tok |
| 3 | **Ahmed Shaikh's Blog** <sub>dev.ahmedshaikh/blog</sub> | `A+` | **96/100** | 3 | 97% | 100% | 90% | 103 tok |
| 4 | **Wallet Doctor** <sub>com.manhourplan/wallet-doctor</sub> | `A+` | **96/100** | 5 | 100% | 100% | 85% | 118 tok |
| 5 | **トゥーンエル** <sub>com.tooneru/manga</sub> | `A+` | **96/100** | 6 | 100% | 100% | 85% | 128 tok |
| 6 | **Tally food nutrients** <sub>io.github.martindochamp/tally-foods</sub> | `A+` | **96/100** | 2 | 100% | 100% | 85% | 136 tok |
| 7 | [**PageDigest — Web Page Summarizer &amp; Structured Extractor**](https://github.com/SuBai520-QWQ/pagedigest) <sub>io.github.SuBai520-QWQ/pagedigest</sub> | `A+` | **96/100** | 1 | 100% | 100% | 85% | 134 tok |
| 8 | [**Alshhbaa Brassware — نحاسيات الشهباء**](https://github.com/Alshhbaa/alshhbaa-agent-kit) <sub>com.alshhbaa/server</sub> | `A+` | **96/100** | 6 | 100% | 100% | 83% | 129 tok |
| 9 | [**Wisely Arcade Games**](https://github.com/SaqibNaseer404/wiselyarcade) <sub>io.github.SaqibNaseer404/wiselyarcade</sub> | `A+` | **95/100** | 6 | 90% | 100% | 95% | 81 tok |
| 10 | **stash** <sub>org.duckdns.agentnotes/stash</sub> | `A+` | **95/100** | 3 | 90% | 100% | 95% | 105 tok |
| 11 | [**대전한콕 Daejeon Hankok**](https://github.com/iamhuman-cheolheelee/daejeon-hankok-mcp) <sub>com.ferrorium.daejeon/hankok</sub> | `A+` | **95/100** | 11 | 95% | 100% | 88% | 124 tok |
| 12 | [**BPJ First-Party AI Tools**](https://github.com/f-tiger/agi-site) <sub>io.github.f-tiger/bpj-ai-tools</sub> | `A+` | **95/100** | 500 | 96% | 100% | 86% | 116 tok |
| 13 | [**Alshhbaa Brassware Store — نحاسيات الشهباء**](https://github.com/Alshhbaa/alshhbaa-agent-kit) <sub>com.alshhbaa.shop/server</sub> | `A+` | **95/100** | 4 | 98% | 100% | 85% | 143 tok |
| 14 | **SchedJoules Calendars** <sub>com.schedjoules/calendars</sub> | `A+` | **95/100** | 3 | 97% | 100% | 85% | 121 tok |
| 15 | **SchedJoules Calendars** <sub>io.github.schedjoules/calendars</sub> | `A+` | **95/100** | 3 | 97% | 100% | 85% | 121 tok |
| 16 | **KOREA WAVE NEWS** <sub>io.github.lifenplanner/koreawavenews</sub> | `A+` | **95/100** | 9 | 98% | 100% | 82% | 143 tok |
| 17 | **Zhannett** <sub>com.zhannett/zhannett</sub> | `A+` | **95/100** | 10 | 100% | 100% | 81% | 164 tok |
| 18 | **com.archlooks/projects** | `A+` | **95/100** | 3 | 100% | 100% | 80% | 141 tok |
| 19 | **io.free3d/models** | `A+` | **95/100** | 3 | 100% | 100% | 80% | 138 tok |
| 20 | [**FilmCraft — Video Editing Assistant MCP**](https://github.com/yueliao11/mcp-servers) <sub>tech.filmcraft/video-editing-assistant</sub> | `A+` | **95/100** | 3 | 100% | 100% | 80% | 148 tok |
| 21 | **Aethel: AI interview facts and free practice** <sub>pro.aethel/company-interviews</sub> | `A+` | **95/100** | 4 | 100% | 100% | 78% | 145 tok |
| 22 | **NeatAnswer** <sub>com.neatanswer/mcp</sub> | `A+` | **94/100** | 13 | 90% | 98% | 94% | 85 tok |
| 23 | [**LingYi Tools**](https://github.com/Jascenn/lingyi-tools-mcp) <sub>io.github.Jascenn/lingyi-tools-mcp</sub> | `A+` | **94/100** | 5 | 88% | 100% | 94% | 76 tok |
| 24 | [**Mecenai**](https://github.com/MonoVarTon/mecenai) <sub>io.github.MonoVarTon/mecenai</sub> | `A+` | **94/100** | 4 | 90% | 100% | 93% | 87 tok |
| 25 | **BuyExamVouchers** <sub>com.buyexamvouchers/exam-vouchers</sub> | `A+` | **94/100** | 5 | 92% | 100% | 91% | 90 tok |

<details>
<summary><b>▶ Click to expand all 854 ranked MCP servers (Ranks 26–854)</b></summary>

| Rank | MCP Server | Grade | TQI Score | Tools | Strictness | Density | Efficiency | Avg Tokens/Tool |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 26 | **RisingTests AI Request Desk** <sub>com.risingtests/mcp</sub> | `A+` | **94/100** | 7 | 90% | 100% | 91% | 100 tok |
| 27 | **Data Center Index** <sub>ai.datacenterindex/datacenterindex</sub> | `A+` | **94/100** | 8 | 93% | 100% | 89% | 110 tok |
| 28 | [**GoTokenMe**](https://github.com/openmediainc/gotokenme-mini) <sub>com.gotokenme/gotokenme</sub> | `A+` | **94/100** | 4 | 93% | 100% | 89% | 112 tok |
| 29 | **critics.press** <sub>press.critics/critics-press</sub> | `A+` | **94/100** | 5 | 92% | 100% | 88% | 97 tok |
| 30 | [**RandomColorGenerator — Accessible Palette &amp; WCAG MCP**](https://github.com/yueliao11/mcp-servers) <sub>app.randomcolorgenerator/color-palette</sub> | `A+` | **94/100** | 2 | 95% | 100% | 85% | 122 tok |
| 31 | **DNSFix** <sub>com.dnsfix/dnsfix</sub> | `A+` | **94/100** | 14 | 94% | 100% | 85% | 129 tok |
| 32 | **Pools Arena** <sub>markets.pools/arena</sub> | `A+` | **94/100** | 6 | 94% | 100% | 85% | 126 tok |
| 33 | [**Classical Pharmacopoeia: Ayurvedic, Unani, Siddha, Greco-Roman Formulary Records**](https://github.com/kawal393/apex-tatva-guardian) <sub>store.apex-tat-va.www/ashwagandha-triphala-brahmi-shilajit-guggulu-rasayana-bhasma-arishta-kvatha-ghrita-dosha-contraindication-toxicology-herbalism-greco-roman-hermetic-kemetic-spagyric</sub> | `A+` | **94/100** | 6 | 93% | 100% | 85% | 126 tok |
| 34 | [**Herb &amp; Supplement Safety Index by Health Goal: Sleep, Anxiety, Immunity, Liver**](https://github.com/kawal393/apex-tatva-guardian) <sub>store.apex-tat-va.www/sleep-anxiety-stress-memory-immunity-digestion-liver-thyroid-respiratory-energy-joint-pain-women-hair-skin-diabetes-herb-safety</sub> | `A+` | **94/100** | 6 | 93% | 100% | 85% | 126 tok |
| 35 | [**Cormak.app**](https://github.com/ecabpro-sudo/cormak-mcp) <sub>app.cormak/mcp-server</sub> | `A+` | **94/100** | 16 | 95% | 100% | 83% | 126 tok |
| 36 | [**BOTERNITY**](https://github.com/botcraftmarket/boternity-mcp) <sub>com.boternity/boternity</sub> | `A+` | **94/100** | 30 | 96% | 99% | 83% | 140 tok |
| 37 | **Recall365 — Global Product Recalls** <sub>io.recall365/recall365</sub> | `A+` | **94/100** | 6 | 95% | 100% | 83% | 149 tok |
| 38 | [**First names in Switzerland**](https://gitlab.com/opendata.ch/vornamen) <sub>ch.opendata/vornamen</sub> | `A+` | **94/100** | 4 | 98% | 100% | 81% | 160 tok |
| 39 | [**Sudan Atlas**](https://github.com/aminshennan/sudan-atlas) <sub>io.github.aminshennan/sudan-atlas</sub> | `A+` | **94/100** | 6 | 97% | 100% | 80% | 159 tok |
| 40 | [**ClaudeCodeMods Registry MCP**](https://github.com/yueliao11/mcp-servers) <sub>net.claudecodemods/mods-registry</sub> | `A+` | **94/100** | 3 | 97% | 100% | 80% | 118 tok |
| 41 | [**Startups Españolas press desk**](https://github.com/martinschenk/startups-espanolas-mcp) <sub>es.startups-espanolas/notas-de-prensa</sub> | `A+` | **94/100** | 5 | 100% | 100% | 75% | 181 tok |
| 42 | **AI for alle: priser og fakta om AI-værktøjer** <sub>dk.ai-foralle/ai-foralle</sub> | `A+` | **94/100** | 6 | 100% | 100% | 74% | 209 tok |
| 43 | **OLA Vital Center** <sub>com.olavital/ola</sub> | `A+` | **93/100** | 3 | 87% | 100% | 95% | 63 tok |
| 44 | **PickZeal** <sub>com.pickzeal/pickzeal</sub> | `A+` | **93/100** | 3 | 87% | 100% | 95% | 83 tok |
| 45 | [**TokenSafe**](https://github.com/tokensafe-dev/tokensafe) <sub>dev.tokensafe/tokensafe</sub> | `A+` | **93/100** | 13 | 87% | 100% | 94% | 72 tok |
| 46 | **ai.agentapihub/douyin-xiaohongshu-rednote-social-scraper-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 47 | **ai.agentapihub/facebook-meta-google-tiktok-ads-library-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 48 | **ai.agentapihub/threads-instagram-truthsocial-linkedin-posts-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 49 | **Willy Kammerer · Versicherungsmakler für Hebammen** <sub>de.hebammenversicherungen/site</sub> | `A+` | **93/100** | 4 | 88% | 100% | 93% | 86 tok |
| 50 | [**API Key Safety \(education only\)**](https://github.com/Duffey234/api-key-safety-mcp) <sub>io.github.Duffey234/api-key-safety-mcp</sub> | `A+` | **93/100** | 5 | 88% | 100% | 91% | 97 tok |
| 51 | [**Elementum Design System MCP**](https://github.com/pinguxx/Elementum) <sub>io.github.pinguxx/elementum</sub> | `A+` | **93/100** | 10 | 89% | 100% | 91% | 90 tok |
| 52 | **CoinVet** <sub>dev.pages.coinvet/coinvet</sub> | `A+` | **93/100** | 7 | 89% | 100% | 89% | 97 tok |
| 53 | [**MCP &amp; x402 Credit Score, Uptime SLA &amp; Rug-Pull Drift Bureau MCP**](https://github.com/BeakDo/defi-customs-mcp-hub) <sub>dev.workers.b2bintel-edge.sec-biotech-priorart-gateway/mcp-credit-score-uptime-rugpull-registry-mcp</sub> | `A+` | **93/100** | 6 | 90% | 100% | 88% | 104 tok |
| 54 | [**HarbiFırsat Deals \(Turkey\)**](https://github.com/erangun/harbifirsat) <sub>io.github.erangun/harbifirsat</sub> | `A+` | **93/100** | 7 | 91% | 100% | 87% | 109 tok |
| 55 | **Dr. AI Hub** <sub>com.draihub/mcp</sub> | `A+` | **93/100** | 7 | 92% | 100% | 85% | 130 tok |
| 56 | [**FeedMCP — Social Media Data MCP**](https://github.com/FeedMCP/feedmcp) <sub>com.feedmcp/mcp</sub> | `A+` | **93/100** | 4 | 90% | 100% | 85% | 110 tok |
| 57 | **Jobs Every Hour** <sub>com.jobseveryhour/jobs</sub> | `A+` | **93/100** | 2 | 92% | 100% | 85% | 125 tok |
| 58 | [**Lazynext AI Slop Checker**](https://github.com/lazynextai/Autonomous-AI-Company-OS) <sub>com.lazynext/ai-slop-checker</sub> | `A+` | **93/100** | 7 | 94% | 98% | 85% | 132 tok |
| 59 | [**EU Cloud**](https://github.com/moveinfra/eu-cloud-mcp) <sub>io.github.moveinfra/eu-cloud-mcp</sub> | `A+` | **93/100** | 4 | 93% | 100% | 85% | 136 tok |
| 60 | **Omics Health Chile** <sub>io.github.omicshealth2025-ship-it/omics-health</sub> | `A+` | **93/100** | 7 | 91% | 100% | 85% | 121 tok |
| 61 | [**ParadeDB**](https://github.com/paradedb/website) <sub>io.github.paradedb/mcp</sub> | `A+` | **93/100** | 4 | 93% | 100% | 85% | 111 tok |
| 62 | **FlowGate Launch Verdict** <sub>io.github.VAAS-X/flowgate</sub> | `A+` | **93/100** | 3 | 93% | 100% | 85% | 127 tok |
| 63 | **nosebleed.si guides** <sub>si.nosebleed/guides</sub> | `A+` | **93/100** | 3 | 93% | 100% | 85% | 112 tok |
| 64 | [**Ricky Moorhouse's blog**](https://github.com/rickymoorhouse/blog) <sub>uk.rickymoorhouse/blog</sub> | `A+` | **93/100** | 3 | 92% | 100% | 85% | 112 tok |
| 65 | **GitPicker** <sub>io.github.LAOSP9/gitpicker</sub> | `A+` | **93/100** | 14 | 91% | 100% | 84% | 133 tok |
| 66 | **Racketeer Pre-Trade Checks \(Solana\)** <sub>dev.workers.racketeer.racketeer-botapi/pretrade</sub> | `A+` | **93/100** | 12 | 95% | 98% | 83% | 132 tok |
| 67 | **Registry Pages** <sub>io.github.jamessvn/registry-pages</sub> | `A+` | **93/100** | 10 | 93% | 100% | 82% | 134 tok |
| 68 | **myIO Documentation** <sub>hu.myio/docs</sub> | `A+` | **93/100** | 4 | 95% | 100% | 81% | 147 tok |
| 69 | [**Pubroot**](https://github.com/buildngrowsv/pubroot-website) <sub>io.github.buildngrowsv/pubroot</sub> | `A+` | **93/100** | 9 | 93% | 100% | 81% | 141 tok |
| 70 | **Nubbo** <sub>app.nubbo/nubbo</sub> | `A+` | **93/100** | 30 | 96% | 100% | 79% | 163 tok |
| 71 | **PresiTracker2027** <sub>io.github.fcroiseaux/presitracker2027</sub> | `A+` | **93/100** | 11 | 96% | 100% | 79% | 187 tok |
| 72 | **Mindful Give Charity Finder** <sub>com.mindfulgive/charities</sub> | `A+` | **93/100** | 2 | 95% | 100% | 78% | 168 tok |
| 73 | **Openship** <sub>org.openship/software-alternatives</sub> | `A+` | **93/100** | 2 | 95% | 100% | 78% | 141 tok |
| 74 | **Résidences Montréal** <sub>com.residences-montreal/residences</sub> | `A+` | **93/100** | 7 | 97% | 100% | 76% | 200 tok |
| 75 | [**Viventii Events, Leisure, POIs, Tickets &amp; Ticket Resale**](https://github.com/borsty2103/viventii-mcp) <sub>io.github.borsty2103/viventii-mcp</sub> | `A+` | **93/100** | 16 | 99% | 100% | 76% | 183 tok |
| 76 | **TallyForge Quant Signals** <sub>dev.fly.tallyforge-quant-signals/quant-signals</sub> | `A+` | **93/100** | 6 | 98% | 100% | 75% | 166 tok |
| 77 | **ME3** <sub>app.me3/me3</sub> | `A+` | **93/100** | 4 | 98% | 100% | 74% | 220 tok |
| 78 | **Pira Experience** <sub>com.piraexperience/pira-experience</sub> | `A+` | **93/100** | 6 | 100% | 98% | 74% | 202 tok |
| 79 | **X PrimeFlow** <sub>trade.xprimeflow/mcp</sub> | `A+` | **93/100** | 10 | 100% | 100% | 73% | 194 tok |
| 80 | **SSTracker free youth training** <sub>app.sstracker/sstracker</sub> | `A+` | **93/100** | 4 | 99% | 100% | 70% | 223 tok |
| 81 | **Daily Tonic by Coach Moshiur** <sub>com.coachmoshiur/daily-tonic</sub> | `A+` | **93/100** | 2 | 100% | 100% | 70% | 165 tok |
| 82 | **Expiry Tracker storage guide** <sub>com.getexpirytracker/storage-guide</sub> | `A+` | **93/100** | 2 | 100% | 100% | 70% | 202 tok |
| 83 | **AI Verified** <sub>io.aiverified/verify-business</sub> | `A+` | **93/100** | 1 | 100% | 100% | 70% | 162 tok |
| 84 | [**DONVI108 Free Research Beta**](https://github.com/ho11-bit/donvi108-agent-skills) <sub>io.github.ho11-bit/donvi108-research</sub> | `A+` | **93/100** | 1 | 100% | 100% | 70% | 247 tok |
| 85 | [**Moedux — Diagnóstico Financeiro**](https://github.com/jhonnysabino/moedux-agent-tools) <sub>io.github.jhonnysabino/moedux</sub> | `A+` | **93/100** | 2 | 100% | 100% | 70% | 174 tok |
| 86 | **Swellwise** <sub>io.swellwise/forecast</sub> | `A+` | **93/100** | 3 | 100% | 100% | 70% | 217 tok |
| 87 | [**io.github.f-tiger/hvac-btu-heat-klimaanlage**](https://github.com/f-tiger/agi-site) | `A+` | **93/100** | 500 | 99% | 100% | 69% | 229 tok |
| 88 | [**Kongus Site MCP Server**](https://github.com/Kongus/site) <sub>io.github.Kongus/site</sub> | `A+` | **92/100** | 7 | 83% | 100% | 96% | 60 tok |
| 89 | **AgentNet** <sub>site.chatgpt.niftycucumber8.agentnet-amsewada/agentnet</sub> | `A+` | **92/100** | 3 | 83% | 100% | 95% | 59 tok |
| 90 | **Freedom Agent Mail** <sub>com.freedomagentmail/mail</sub> | `A+` | **92/100** | 6 | 85% | 100% | 93% | 99 tok |
| 91 | [**MNOGO DENEG — pay-per-call crypto &amp; AI APIs \(x402\)**](https://github.com/makar-aibot/mnogo-deneg-x402) <sub>io.github.makar-aibot/mnogo-deneg</sub> | `A+` | **92/100** | 60 | 85% | 100% | 93% | 80 tok |
| 92 | [**GetArtCraft — Open-Source Rust Creative Suite MCP**](https://github.com/yueliao11/mcp-servers) <sub>net.getartcraft/rust-creative-suite</sub> | `A+` | **92/100** | 2 | 85% | 100% | 93% | 95 tok |
| 93 | **Agent Loopr** <sub>com.agentloopr/website</sub> | `A+` | **92/100** | 5 | 86% | 100% | 91% | 88 tok |
| 94 | **未定世界 · Agent World** <sub>xyz.400860/agent-world</sub> | `A+` | **92/100** | 12 | 86% | 100% | 91% | 105 tok |
| 95 | **Volotel SkyWay – Cluj-Napoca Airport** <sub>eu.volotel/booking</sub> | `A+` | **92/100** | 3 | 87% | 100% | 90% | 115 tok |
| 96 | [**ArcanumFleet MCP Server**](https://github.com/LarynaB/arcanumfleet-mcp-server) <sub>io.github.LarynaB/arcanumfleet-mcp-server</sub> | `A+` | **92/100** | 13 | 87% | 100% | 90% | 87 tok |
| 97 | [**uibrik**](https://github.com/Malay146/uibrik-mcp) <sub>com.uibrik/components</sub> | `A+` | **92/100** | 4 | 88% | 100% | 89% | 136 tok |
| 98 | [**VR.org VR / AR / XR Reader**](https://github.com/evanatpizzarobot/vr-org-mcp) <sub>org.vr/vr-mcp</sub> | `A+` | **92/100** | 11 | 86% | 100% | 89% | 110 tok |
| 99 | [**DealMonitor**](https://github.com/rwkaspar/dealmonitor) <sub>app.dealmonitor/dealmonitor</sub> | `A+` | **92/100** | 6 | 90% | 98% | 88% | 103 tok |
| 100 | [**ScamNav**](https://github.com/seo-seo/scamnav-site) <sub>com.scamnav/scamnav</sub> | `A+` | **92/100** | 5 | 88% | 100% | 88% | 121 tok |
| 101 | **BrightKey Education Data** <sub>co.brightkey/education-data</sub> | `A+` | **92/100** | 8 | 88% | 100% | 87% | 113 tok |
| 102 | **UtilVet** <sub>dev.pages.utilvet/utilvet</sub> | `A+` | **92/100** | 17 | 89% | 100% | 87% | 120 tok |
| 103 | [**PromptMentions**](https://github.com/jimbob1414/promptmentions-mcp) <sub>com.promptmentions/promptmentions</sub> | `A+` | **92/100** | 12 | 91% | 99% | 86% | 119 tok |
| 104 | **EuKreate Home Value** <sub>ai.eukollab/eukreate-home-value</sub> | `A+` | **92/100** | 1 | 90% | 100% | 85% | 160 tok |
| 105 | [**ScentAI Fragrance Finder MCP**](https://github.com/yueliao11/mcp-servers) <sub>com.getscentai/fragrance-finder</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 115 tok |
| 106 | **Agent-Ready Scan** <sub>com.manhourplan/agent-ready-scan</sub> | `A+` | **92/100** | 1 | 90% | 100% | 85% | 153 tok |
| 107 | **Selfhost Recipes** <sub>com.selfhostrecipes/selfhost-recipes</sub> | `A+` | **92/100** | 4 | 89% | 100% | 85% | 131 tok |
| 108 | **Mechanic Atlas Auto Manual** <sub>com.us.mechanic/auto-manual</sub> | `A+` | **92/100** | 10 | 90% | 100% | 85% | 124 tok |
| 109 | **DomainVet** <sub>dev.pages.domainvet/domainvet</sub> | `A+` | **92/100** | 7 | 90% | 100% | 85% | 111 tok |
| 110 | [**EU Money**](https://github.com/kmate77-radar/eu-money-mcp) <sub>hu.eumoney/eu-money</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 131 tok |
| 111 | [**ooooOasis TSX Data**](https://github.com/oooooasis-fds/tsx-data) <sub>io.github.oooooasis-fds/tsx-data</sub> | `A+` | **92/100** | 5 | 88% | 100% | 85% | 110 tok |
| 112 | **Assistant Hub** <sub>io.rmassistanthub/assistant-hub</sub> | `A+` | **92/100** | 14 | 90% | 99% | 85% | 123 tok |
| 113 | [**Poste Restante: a text adventure for AIs**](https://github.com/hplant6/poste-restante) <sub>me.itshenry/poste-restante</sub> | `A+` | **92/100** | 2 | 90% | 100% | 85% | 155 tok |
| 114 | [**GEO Optimizer — AI Search &amp; Robots.txt Audit**](https://github.com/yueliao11/mcp-servers) <sub>tech.geooptimizer/geo-audit</sub> | `A+` | **92/100** | 2 | 90% | 100% | 85% | 108 tok |
| 115 | **Agent Classifieds** <sub>dev.agentclassifieds/board</sub> | `A+` | **92/100** | 6 | 92% | 98% | 84% | 157 tok |
| 116 | [**Lookproof DNS, mail and TLS security checks**](https://github.com/lookproof/x402-examples) <sub>io.github.lookproof/lookproof-mcp</sub> | `A+` | **92/100** | 22 | 90% | 100% | 84% | 142 tok |
| 117 | **Carfinity car marketplace** <sub>ai.carfinity/marketplace</sub> | `A+` | **92/100** | 7 | 90% | 100% | 83% | 144 tok |
| 118 | [**PokerAgile**](https://github.com/florianmousseau/pokeragile) <sub>io.github.florianmousseau/pokeragile</sub> | `A+` | **92/100** | 7 | 90% | 100% | 83% | 137 tok |
| 119 | **TradingLookup open data** <sub>io.github.tradinglookup/data</sub> | `A+` | **92/100** | 8 | 90% | 100% | 83% | 149 tok |
| 120 | **Supercycle** <sub>com.supercyclehq/supercycle</sub> | `A+` | **92/100** | 19 | 92% | 98% | 82% | 148 tok |
| 121 | **Lexu** <sub>io.lexu/mcp</sub> | `A+` | **92/100** | 15 | 92% | 99% | 82% | 141 tok |
| 122 | [**AddSynapse Rooms**](https://github.com/SakkoulasGiannis/addsynapse-rooms) <sub>com.addsynapse/rooms</sub> | `A+` | **92/100** | 4 | 93% | 100% | 81% | 147 tok |
| 123 | [**Weav**](https://github.com/dubdubdubco/weav-mcp-server) <sub>com.weav/mcp</sub> | `A+` | **92/100** | 48 | 92% | 99% | 81% | 153 tok |
| 124 | **IKANGAI Vibe Support** <sub>com.ikangai/vibe-support</sub> | `A+` | **92/100** | 6 | 93% | 100% | 80% | 125 tok |
| 125 | [**EuroKYB**](https://github.com/clime-alertviz/eurokyb-mcp) <sub>com.alertviz/eurokyb-mcp</sub> | `A+` | **92/100** | 5 | 94% | 100% | 79% | 154 tok |
| 126 | **Markhaven** <sub>com.markhavenbrands/markhaven</sub> | `A+` | **92/100** | 5 | 92% | 100% | 79% | 174 tok |
| 127 | **Veritas Silicea art shop** <sub>dev.workers.veritas-silicea.veritas-silicea-shop/art</sub> | `A+` | **92/100** | 5 | 92% | 100% | 79% | 152 tok |
| 128 | **ingilizce.io – English Vocabulary Video Tutor** <sub>io.ingilizce/vocabulary-video-tutor</sub> | `A+` | **92/100** | 5 | 94% | 100% | 79% | 146 tok |
| 129 | [**Sharekite**](https://github.com/Sharekite/sharekite-plugin) <sub>app.sharekite/sharekite</sub> | `A+` | **92/100** | 6 | 93% | 100% | 78% | 195 tok |
| 130 | **Climatch** <sub>io.github.burmanharry/climatch</sub> | `A+` | **92/100** | 9 | 95% | 100% | 78% | 187 tok |
| 131 | **Unicorn Screener** <sub>vc.unicornscreener/unicorn-screener</sub> | `A+` | **92/100** | 5 | 96% | 97% | 78% | 195 tok |
| 132 | **Kargom** <sub>io.github.kargom-ai/kargom</sub> | `A+` | **92/100** | 10 | 96% | 99% | 76% | 206 tok |
| 133 | [**x402Fi**](https://github.com/RWA-ID/x402fi) <sub>dev.x402fi/x402fi</sub> | `A+` | **92/100** | 3 | 100% | 95% | 75% | 207 tok |
| 134 | **jwatte.com website tools** <sub>com.jwatte/site</sub> | `A+` | **92/100** | 7 | 99% | 98% | 74% | 209 tok |
| 135 | **Pakeesim eSIM** <sub>com.pakeesim/esim</sub> | `A+` | **92/100** | 8 | 100% | 96% | 74% | 213 tok |
| 136 | **SteadyScrape SEO Data** <sub>dev.steadyscrape/seo-data</sub> | `A+` | **92/100** | 9 | 95% | 100% | 73% | 193 tok |
| 137 | [**Agent Tollbooth 402**](https://github.com/Red-Center-Studio/agent-tollbooth-402) <sub>io.github.Red-Center-Studio/agent-tollbooth-402</sub> | `A+` | **92/100** | 8 | 96% | 100% | 73% | 174 tok |
| 138 | [**SEO Data MCP \(SteadyScrape\)**](https://github.com/steadyscrape/seo-data-mcp) <sub>io.github.steadyscrape/seo-data-mcp</sub> | `A+` | **92/100** | 9 | 95% | 100% | 73% | 193 tok |
| 139 | **ThreatNexus** <sub>app.threatnexus/threatnexus</sub> | `A+` | **92/100** | 12 | 98% | 99% | 70% | 215 tok |
| 140 | **IRM Consulting &amp; Advisory** <sub>com.irmcon/services</sub> | `A+` | **92/100** | 6 | 98% | 100% | 69% | 215 tok |
| 141 | **Herofold** <sub>dev.herofold/herofold</sub> | `A+` | **92/100** | 6 | 100% | 98% | 69% | 232 tok |
| 142 | **GMBSync Remote MCP Server** <sub>com.gmbsync/gmbsync-mcp</sub> | `A+` | **92/100** | 3 | 100% | 100% | 68% | 199 tok |
| 143 | **Milésima** <sub>com.profblu.milesima/milesima</sub> | `A+` | **92/100** | 8 | 100% | 98% | 68% | 242 tok |
| 144 | [**WhatConverts MCP by usefulapi**](https://github.com/m190/usefulapi-mcp) <sub>io.usefulapi/whatconverts</sub> | `A+` | **92/100** | 15 | 100% | 99% | 67% | 287 tok |
| 145 | **AI-Only Society** <sub>cfd.neytom.ai/mcp</sub> | `A+` | **91/100** | 5 | 80% | 100% | 97% | 67 tok |
| 146 | **CON, Central Operating Network** <sub>com.centralonet/con</sub> | `A+` | **91/100** | 5 | 82% | 100% | 94% | 79 tok |
| 147 | [**Money Reactor — 87 paid x402 APIs via MCP**](https://github.com/makar-aibot/money-reactor-mcp) <sub>io.github.makar-aibot/money-reactor</sub> | `A+` | **91/100** | 35 | 82% | 100% | 94% | 85 tok |
| 148 | **La Cartelera** <sub>app.lacartelera/cartelera</sub> | `A+` | **91/100** | 6 | 81% | 100% | 93% | 86 tok |
| 149 | **com.camilafonseca/psychotherapy** | `A+` | **91/100** | 6 | 83% | 100% | 93% | 73 tok |
| 150 | [**DankMachine meme sounds**](https://github.com/HalberdLLC/dank-meme-sounds) <sub>com.dankmachine/dank-meme-sounds</sub> | `A+` | **91/100** | 8 | 83% | 100% | 93% | 93 tok |
| 151 | **NodeRings** <sub>com.noderings/mcp</sub> | `A+` | **91/100** | 53 | 86% | 96% | 93% | 83 tok |
| 152 | **LivedProof \(demo\)** <sub>dev.pages.livedproof/livedproof</sub> | `A+` | **91/100** | 4 | 83% | 100% | 93% | 77 tok |
| 153 | **AI Capital Index** <sub>com.aicapitalindex/data</sub> | `A+` | **91/100** | 3 | 84% | 100% | 90% | 100 tok |
| 154 | [**Kartic - Digital Loyalty Stamp Cards For Local Businesses**](https://github.com/zsevic/kartic-mcp) <sub>app.kartic/digital-loyalty-stamp-cards</sub> | `A+` | **91/100** | 7 | 85% | 100% | 89% | 106 tok |
| 155 | [**Formation Lane US LLC Fees &amp; Deadlines**](https://github.com/formationlane/llc-fees-mcp) <sub>com.formationlane/llc-fees</sub> | `A+` | **91/100** | 4 | 85% | 100% | 89% | 110 tok |
| 156 | **notfiction: is it real?** <sub>com.notfiction/news</sub> | `A+` | **91/100** | 7 | 87% | 98% | 87% | 110 tok |
| 157 | **Battery Payback** <sub>uk.co.batterypayback/battery-payback</sub> | `A+` | **91/100** | 7 | 85% | 100% | 86% | 154 tok |
| 158 | **Venoh AI Visibility** <sub>com.venoh/ai-visibility</sub> | `A+` | **91/100** | 3 | 87% | 100% | 85% | 131 tok |
| 159 | **ForthRoute Returns** <sub>io.forthroute/returns</sub> | `A+` | **91/100** | 5 | 88% | 100% | 85% | 115 tok |
| 160 | [**ooooOasis Factor Data**](https://github.com/oooooasis-fds/factor-data) <sub>io.github.oooooasis-fds/factor-data</sub> | `A+` | **91/100** | 2 | 85% | 100% | 85% | 113 tok |
| 161 | [**Rustyplan**](https://github.com/SverrirValgeirsson/rustyplan) <sub>io.github.SverrirValgeirsson/rustyplan</sub> | `A+` | **91/100** | 7 | 90% | 97% | 85% | 125 tok |
| 162 | **Maple Minute** <sub>com.mapleminute/mapleminute</sub> | `A+` | **91/100** | 9 | 89% | 98% | 84% | 299 tok |
| 163 | **SwapTitan: No-KYC &amp; Private Monero Swaps** <sub>net.swaptitan/swaptitan</sub> | `A+` | **91/100** | 24 | 90% | 98% | 84% | 136 tok |
| 164 | **Krane** <sub>com.kraneapp/krane</sub> | `A+` | **91/100** | 7 | 87% | 100% | 83% | 143 tok |
| 165 | **Microverse Market Data** <sub>com.microversesystems/market-data</sub> | `A+` | **91/100** | 9 | 89% | 100% | 83% | 142 tok |
| 166 | **InmoRadar** <sub>com.inmoradar/inmoradar</sub> | `A+` | **91/100** | 4 | 93% | 96% | 81% | 176 tok |
| 167 | [**ShipStatic**](https://github.com/shipstatic/mcp) <sub>com.shipstatic/mcp</sub> | `A+` | **91/100** | 15 | 91% | 98% | 81% | 168 tok |
| 168 | **The Builders Supply catalog** <sub>com.thebuilderssupply/catalog</sub> | `A+` | **91/100** | 8 | 89% | 100% | 81% | 140 tok |
| 169 | **Truce** <sub>com.trucehq/truce</sub> | `A+` | **91/100** | 7 | 90% | 100% | 81% | 158 tok |
| 170 | [**Hyperliquid, Orderly &amp; Polymarket Builder-Code Safe Perp Order MCP**](https://github.com/BeakDo/defi-customs-mcp-hub) <sub>dev.workers.b2bintel-edge.defi-route-intel/hyperliquid-polymarket-builder-code-perp-mcp</sub> | `A+` | **91/100** | 14 | 89% | 100% | 81% | 158 tok |
| 171 | [**MCP Apps Interactive DeFi, Polymarket &amp; RWA Checkout Terminal UI**](https://github.com/BeakDo/defi-customs-mcp-hub) <sub>dev.workers.b2bintel-edge.defi-route-intel/mcp-apps-interactive-defi-checkout-ui-mcp</sub> | `A+` | **91/100** | 14 | 89% | 100% | 81% | 158 tok |
| 172 | [**Valeur Intrinsèque**](https://gitlab.com/louisvld/valeur-intrinseque) <sub>fr.valeur-intrinseque/valeur-intrinseque</sub> | `A+` | **91/100** | 10 | 93% | 97% | 81% | 140 tok |
| 173 | **io.tiktokapi/tiktok-scraper-video-downloader-api-mcp** | `A+` | **91/100** | 21 | 90% | 100% | 81% | 132 tok |
| 174 | **Palimpsest: a text adventure for AIs** <sub>me.itshenry/palimpsest</sub> | `A+` | **91/100** | 4 | 90% | 100% | 81% | 137 tok |
| 175 | **allMCPservers directory** <sub>com.allmcpservers/directory</sub> | `A+` | **91/100** | 4 | 89% | 100% | 80% | 150 tok |
| 176 | **com.gtxagent/gtxagent-mcp** | `A+` | **91/100** | 14 | 91% | 100% | 80% | 137 tok |
| 177 | [**CLNS — Korea Import Compliance**](https://github.com/CLNS-KR/CLNS-KR) <sub>io.github.CLNS-KR/clns</sub> | `A+` | **91/100** | 15 | 89% | 100% | 80% | 164 tok |
| 178 | [**x402 Structured Data &amp; Headless Scraper**](https://github.com/greatscottatl/x402-cluster) <sub>io.github.greatscottatl/x402-cluster</sub> | `A+` | **91/100** | 6 | 90% | 100% | 80% | 151 tok |
| 179 | **Host.al: .al domains and servers in Albania** <sub>al.host/mcp</sub> | `A+` | **91/100** | 7 | 92% | 98% | 79% | 158 tok |
| 180 | **MacProof** <sub>com.macproof/macproof</sub> | `A+` | **91/100** | 8 | 91% | 100% | 79% | 157 tok |
| 181 | **Humanome** <sub>co.humanome/humanome</sub> | `A+` | **91/100** | 4 | 95% | 96% | 78% | 196 tok |
| 182 | [**ContrastAPI**](https://github.com/UPinar/contrastapi) <sub>com.contrastcyber/api</sub> | `A+` | **91/100** | 40 | 92% | 100% | 78% | 172 tok |
| 183 | **PerpMetric perpetuals data** <sub>com.perpmetric/perpmetric</sub> | `A+` | **91/100** | 7 | 91% | 100% | 78% | 170 tok |
| 184 | **RyRacer AI Arena** <sub>com.ryracer/arena</sub> | `A+` | **91/100** | 15 | 90% | 100% | 78% | 152 tok |
| 185 | **Synapse** <sub>io.github.Aadeshjain25/synapse</sub> | `A+` | **91/100** | 7 | 91% | 100% | 78% | 167 tok |
| 186 | **Serverdex** <sub>io.serverdex/serverdex</sub> | `A+` | **91/100** | 3 | 90% | 100% | 78% | 181 tok |
| 187 | **theowf, the forum for AI agents** <sub>org.theowf/forum</sub> | `A+` | **91/100** | 16 | 91% | 100% | 78% | 173 tok |
| 188 | [**HealthStylz Clinical Nutrition, Calculators &amp; Circadian Environment MCP**](https://github.com/harrybuild/healthstylz-mcp) <sub>io.github.harrybuild/healthstylz-mcp</sub> | `A+` | **91/100** | 9 | 92% | 100% | 77% | 210 tok |
| 189 | **Faxvio** <sub>com.faxvio/faxvio</sub> | `A+` | **91/100** | 5 | 92% | 100% | 76% | 152 tok |
| 190 | [**Kultranz: US Salary, Tax &amp; Cost of Living**](https://github.com/CodePhantom-1/kultranz-mcp) <sub>io.github.CodePhantom-1/kultranz-mcp</sub> | `A+` | **91/100** | 5 | 94% | 97% | 76% | 172 tok |
| 191 | **Singularity Layer MCP** <sub>io.github.ivaavimusic/singularity</sub> | `A+` | **91/100** | 81 | 92% | 100% | 76% | 194 tok |
| 192 | [**CashbackPro**](https://github.com/linkin931/cashbackpro-mcp) <sub>org.cashbackpro/cashbackpro</sub> | `A+` | **91/100** | 5 | 94% | 97% | 76% | 158 tok |
| 193 | [**Been There – The AI Bar**](https://github.com/janehardbot/been-there) <sub>com.cideolabs.beenthere/been-there</sub> | `A+` | **91/100** | 3 | 93% | 100% | 75% | 174 tok |
| 194 | **Reachout recovery meetings** <sub>com.kurtrasmussen.reachout/meetings</sub> | `A+` | **91/100** | 7 | 93% | 100% | 75% | 190 tok |
| 195 | **The Independent AI** <sub>com.theindependentai/mcp</sub> | `A+` | **91/100** | 8 | 94% | 98% | 75% | 173 tok |
| 196 | [**AIPayGen**](https://github.com/Damien829/aipaygen) <sub>io.github.Damien829/aipaygen</sub> | `A+` | **91/100** | 111 | 95% | 99% | 75% | 186 tok |
| 197 | **Legado Finance** <sub>es.legadofinance/legado</sub> | `A+` | **91/100** | 8 | 94% | 100% | 74% | 221 tok |
| 198 | **Padel Stay Guide** <sub>com.padelstayguide/padel-hotels</sub> | `A+` | **91/100** | 4 | 95% | 100% | 73% | 238 tok |
| 199 | **ShelfXray quick-commerce shelf data** <sub>in.shelfxray/shelf-data</sub> | `A+` | **91/100** | 5 | 94% | 100% | 73% | 197 tok |
| 200 | **Poacher** <sub>io.poacher/poacher</sub> | `A+` | **91/100** | 66 | 97% | 98% | 73% | 232 tok |
| 201 | [**SpendCanary free Google Ads tools**](https://github.com/spendcanary/mcp-free-tools) <sub>com.spendcanary/free-tools</sub> | `A+` | **91/100** | 9 | 96% | 100% | 71% | 221 tok |
| 202 | [**IELTSera — IELTS Band Score, CLB &amp; Writing Coach**](https://github.com/Faheel101/ielts-mastery) <sub>io.github.Faheel101/ieltsera-mcp</sub> | `A+` | **91/100** | 7 | 96% | 100% | 71% | 214 tok |
| 203 | [**Teamup Calendar MCP by usefulapi**](https://github.com/m190/usefulapi-mcp) <sub>io.usefulapi/teamup-calendar</sub> | `A+` | **91/100** | 15 | 97% | 98% | 71% | 248 tok |
| 204 | **Cron Schedule Check** <sub>ai.opencurrent/cron-check</sub> | `A+` | **91/100** | 1 | 95% | 100% | 70% | 179 tok |
| 205 | [**Settle Watch**](https://github.com/benmcalillycreative/x402-trust-board) <sub>io.github.benmcalillycreative/settle-watch</sub> | `A+` | **91/100** | 2 | 95% | 100% | 70% | 165 tok |
| 206 | [**ChinaTaxCalc — China Expat IIT, BIA Allowance, Annual Bonus &amp; GBA 15% Rebate Engine**](https://github.com/AbigailDavised/chinataxcalc-mcp) <sub>com.chinataxcalc/mcp</sub> | `A+` | **91/100** | 8 | 95% | 100% | 69% | 234 tok |
| 207 | [**Cross Stitch Pattern Maker**](https://github.com/cross-stitched/mcp) <sub>io.github.cross-stitched/cross-stitch-pattern-maker</sub> | `A+` | **91/100** | 4 | 95% | 100% | 69% | 225 tok |
| 208 | [**Botchelor**](https://github.com/smithdavedesign/botchelor) <sub>io.github.smithdavedesign/botchelor</sub> | `A+` | **91/100** | 37 | 97% | 99% | 69% | 278 tok |
| 209 | [**FitzTopPicks APIs: calendars, recipes, names, places, sizes and more**](https://github.com/fitz1567/fitztoppicks-mcp) <sub>com.fitztoppicks/calendars-ingredients</sub> | `A+` | **91/100** | 96 | 97% | 100% | 68% | 252 tok |
| 210 | **Korea Payroll &amp; Tax \(kkuldogu\)** <sub>io.github.dooolmang/kkuldogu-korea-payroll</sub> | `A+` | **91/100** | 69 | 100% | 96% | 68% | 266 tok |
| 211 | **Magic Prices France** <sub>fr.magicprices/mcp</sub> | `A+` | **91/100** | 14 | 99% | 98% | 66% | 229 tok |
| 212 | **Magic Prices Italia** <sub>it.magicprices/mcp</sub> | `A+` | **91/100** | 14 | 99% | 98% | 66% | 229 tok |
| 213 | **Magic Prices UK** <sub>uk.co.magicprices/mcp</sub> | `A+` | **91/100** | 14 | 99% | 98% | 66% | 228 tok |
| 214 | **DalVivo** <sub>net.dalvivo/catalogue</sub> | `A+` | **91/100** | 7 | 99% | 100% | 65% | 306 tok |
| 215 | **THE MOAT — Global Business Intelligence** <sub>com.moatpost/the-moat</sub> | `A+` | **91/100** | 4 | 100% | 100% | 60% | 289 tok |
| 216 | [**Cards4Play**](https://github.com/mattdowell/cards4play-mcp) <sub>com.cards4play/cards4play</sub> | `A+` | **90/100** | 10 | 77% | 100% | 96% | 66 tok |
| 217 | [**NewKitchenAI - Kitchen Design Reference**](https://github.com/weiwosuoai/newkitchenai-mcp) <sub>com.newkitchenai/kitchen-design</sub> | `A+` | **90/100** | 5 | 80% | 100% | 94% | 80 tok |
| 218 | **Snowbelly Nutrition** <sub>app.snowbelly/nutrition</sub> | `A+` | **90/100** | 4 | 80% | 100% | 93% | 97 tok |
| 219 | **Bettiz Legal — guías legales \(Chile\)** <sub>cl.bettizlegal/guides</sub> | `A+` | **90/100** | 4 | 79% | 100% | 93% | 95 tok |
| 220 | **Gilroy Motor — electric motorcycles \(Chile\)** <sub>cl.gilroymotor/agent-door</sub> | `A+` | **90/100** | 4 | 79% | 100% | 93% | 87 tok |
| 221 | [**Barakah Halal Stock Screen**](https://github.com/pancake-pixels/barakah-halal-mcp) <sub>com.barakahprofits.app/halal-screen</sub> | `A+` | **90/100** | 2 | 85% | 93% | 93% | 117 tok |
| 222 | **HALOWERK EU Power Dispatch API** <sub>com.halowerk/energy-research-hub</sub> | `A+` | **90/100** | 29 | 80% | 99% | 92% | 90 tok |
| 223 | [**CantorFi lending vaults and agent door**](https://github.com/cantorfi/cantorfi-mcp) <sub>io.github.cantorfi/cantorfi-mcp</sub> | `A+` | **90/100** | 10 | 82% | 100% | 91% | 89 tok |
| 224 | **waystation – message wall for AI agents** <sub>dev.rcptr.waystation/waystation</sub> | `A+` | **90/100** | 3 | 82% | 100% | 90% | 102 tok |
| 225 | **Skillshop** <sub>io.github.McCoyLab87/skillshop</sub> | `A+` | **90/100** | 9 | 86% | 97% | 87% | 114 tok |
| 226 | [**ONZIP**](https://github.com/NodajiFi-Tokenomy/NodajiFi-Ecosystem) <sub>com.globalpiggy/onzip</sub> | `A+` | **90/100** | 2 | 85% | 100% | 85% | 116 tok |
| 227 | [**Merlonix Monitoring**](https://github.com/cmhenry79/merlonix-mcp) <sub>com.merlonix/monitoring</sub> | `A+` | **90/100** | 16 | 89% | 100% | 85% | 125 tok |
| 228 | **magne.tools** <sub>tools.magne/catalog</sub> | `A+` | **90/100** | 4 | 88% | 96% | 85% | 117 tok |
| 229 | **TideTrade** <sub>app.tidetrade/tidetrade</sub> | `A+` | **90/100** | 6 | 88% | 98% | 84% | 141 tok |
| 230 | **LinkVet** <sub>dev.pages.linkvet/linkvet</sub> | `A+` | **90/100** | 11 | 87% | 100% | 84% | 122 tok |
| 231 | **LocalSpot Trip** <sub>com.localspottrip/trip-planner</sub> | `A+` | **90/100** | 9 | 87% | 100% | 82% | 136 tok |
| 232 | [**ADS Beast**](https://github.com/notformal/adsbeast-plugins) <sub>io.github.notformal/adsbeast</sub> | `A+` | **90/100** | 184 | 86% | 100% | 82% | 146 tok |
| 233 | [**Apex Edge — x402-paid machine services**](https://github.com/nonsynthetic/apex-edge-tools) <sub>net.nonsynthetic/apex-edge</sub> | `A+` | **90/100** | 17 | 86% | 99% | 82% | 141 tok |
| 234 | [**FetchTranscript**](https://github.com/fetchtranscript/mcp-server) <sub>com.fetchtranscript/fetchtranscript</sub> | `A+` | **90/100** | 8 | 89% | 98% | 81% | 124 tok |
| 235 | [**PyAI Voice AI**](https://github.com/atomsai/pyai-platform-backend) <sub>io.github.atomsai/pyai</sub> | `A+` | **90/100** | 59 | 87% | 100% | 81% | 214 tok |
| 236 | **DeFi Capital Flow-Price Gap** <sub>io.github.zsraduly77/defi-flow-price-gap</sub> | `A+` | **90/100** | 10 | 92% | 94% | 81% | 149 tok |
| 237 | [**Krate**](https://github.com/incyashraj/krate) <sub>tech.krate/krate</sub> | `A+` | **90/100** | 8 | 89% | 98% | 81% | 160 tok |
| 238 | **Bluedose GLP-1 Tools** <sub>com.bluedoseapp/glp1-tools</sub> | `A+` | **90/100** | 3 | 87% | 100% | 80% | 125 tok |
| 239 | **PlainError** <sub>com.plainerror/plainerror</sub> | `A+` | **90/100** | 3 | 93% | 95% | 80% | 155 tok |
| 240 | [**CyberSafe MCP**](https://github.com/kshitij9896/cybersafe-mcp) <sub>io.github.kshitij9896/cybersafe-mcp</sub> | `A+` | **90/100** | 6 | 90% | 98% | 80% | 131 tok |
| 241 | **RentCast API** <sub>io.rentcast/api</sub> | `A+` | **90/100** | 4 | 88% | 100% | 80% | 171 tok |
| 242 | **Jason Lau Academy** <sub>academy.jasonlau/classes</sub> | `A+` | **90/100** | 6 | 92% | 98% | 79% | 172 tok |
| 243 | **Atom Industries** <sub>ai.atomindustries/agent-channel</sub> | `A+` | **90/100** | 7 | 89% | 100% | 79% | 274 tok |
| 244 | **Atom Technologies** <sub>ai.atomtechnologies/agent-channel</sub> | `A+` | **90/100** | 7 | 89% | 100% | 79% | 274 tok |
| 245 | **Atom Backends** <sub>com.atombackends/agent-channel</sub> | `A+` | **90/100** | 7 | 89% | 100% | 79% | 273 tok |
| 246 | **Atom Panamá** <sub>com.atompanama/agent-channel</sub> | `A+` | **90/100** | 7 | 89% | 100% | 79% | 273 tok |
| 247 | **Atom XII** <sub>com.atomxii/agent-channel</sub> | `A+` | **90/100** | 7 | 89% | 100% | 79% | 272 tok |
| 248 | **BugOtter** <sub>com.bugotter/mcp</sub> | `A+` | **90/100** | 80 | 88% | 100% | 79% | 178 tok |
| 249 | **AEGIS \(McX Ventures\)** <sub>com.mcx-ventures/aegis</sub> | `A+` | **90/100** | 6 | 90% | 98% | 79% | 160 tok |
| 250 | **Schütze Capital** <sub>com.schutzecapital/agent-channel</sub> | `A+` | **90/100** | 7 | 89% | 100% | 79% | 274 tok |
| 251 | [**AgentPulse**](https://github.com/Akshat-Srivastava-PS/AgentPulse) <sub>io.github.Akshat-Srivastava-PS/agentpulse</sub> | `A+` | **90/100** | 5 | 90% | 97% | 79% | 142 tok |
| 252 | [**Swiss public transport**](https://gitlab.com/opendata.ch/Transport) <sub>ch.opendata/transport</sub> | `A+` | **90/100** | 4 | 90% | 100% | 78% | 162 tok |
| 253 | [**E-Invoice Checker**](https://github.com/EleqanT/einvoicechecker-mcp) <sub>com.einvoicechecker/einvoice</sub> | `A+` | **90/100** | 9 | 90% | 98% | 78% | 188 tok |
| 254 | **Piqline \(open door\)** <sub>com.piqline/open</sub> | `A+` | **90/100** | 4 | 95% | 93% | 78% | 175 tok |
| 255 | **Tidy Quid budget planners** <sub>dev.workers.svenco.tidyquid/tidyquid</sub> | `A+` | **90/100** | 6 | 89% | 100% | 78% | 163 tok |
| 256 | [**Bifrost K-Finance &amp; Korea Customs x402**](https://github.com/ballostark-wq/bifrost-kfinance-mcp) <sub>io.github.ballostark-wq/bifrost-kfinance-mcp</sub> | `A+` | **90/100** | 6 | 90% | 100% | 78% | 157 tok |
| 257 | **AnswerKB** <sub>com.answerkb/kb</sub> | `A+` | **90/100** | 6 | 93% | 95% | 77% | 191 tok |
| 258 | [**Stork: search, scrape and docs**](https://github.com/storkai/stork-mcp) <sub>ai.stork/core</sub> | `A+` | **90/100** | 6 | 91% | 100% | 75% | 173 tok |
| 259 | [**DentalCostFinder Canada MCP**](https://github.com/yueliao11/mcp-servers) <sub>ca.dentalcostfinder/canada-dental</sub> | `A+` | **90/100** | 3 | 90% | 100% | 75% | 144 tok |
| 260 | **Gracieta: teatro, humor y musicales en España** <sub>com.gracieta/gracieta</sub> | `A+` | **90/100** | 5 | 92% | 97% | 75% | 196 tok |
| 261 | [**Agent402.Tools: payments and trust for AI agents**](https://github.com/MikeyPetrillo/Agent402) <sub>io.github.MikeyPetrillo/agent402</sub> | `A+` | **90/100** | 16 | 89% | 100% | 75% | 186 tok |
| 262 | **4fillment** <sub>com.4fillment/fulfillment</sub> | `A+` | **90/100** | 7 | 90% | 100% | 74% | 226 tok |
| 263 | [**UFCalendar Fight API — MMA MCP server**](https://github.com/UFCalendar/fight-api-skill) <sub>com.ufcalendar/fight-api</sub> | `A+` | **90/100** | 58 | 93% | 98% | 74% | 208 tok |
| 264 | [**Agent Evidence Utility**](https://github.com/defcron/agent-evidence-utility) <sub>io.github.defcron/agent-evidence-utility</sub> | `A+` | **90/100** | 4 | 90% | 100% | 74% | 176 tok |
| 265 | **Wrenform Quick Forms** <sub>com.wrenform/wrenform-quick</sub> | `A+` | **90/100** | 4 | 95% | 96% | 73% | 186 tok |
| 266 | [**Phono.Crescendo**](https://github.com/pjtribot-blip/ref-crescendo) <sub>io.github.pjtribot-blip/phono-crescendo</sub> | `A+` | **90/100** | 4 | 94% | 96% | 73% | 187 tok |
| 267 | [**Stoa: swaps on Robinhood Chain**](https://github.com/StoaDex/Stoa) <sub>io.github.StoaDex/stoa</sub> | `A+` | **90/100** | 17 | 94% | 96% | 72% | 196 tok |
| 268 | [**Tereno on Base**](https://github.com/tereno-xyz/tereno-mcp) <sub>xyz.tereno/tereno</sub> | `A+` | **90/100** | 23 | 94% | 97% | 72% | 221 tok |
| 269 | **Europe Instead** <sub>com.europeinstead/europe-instead</sub> | `A+` | **90/100** | 5 | 94% | 100% | 71% | 215 tok |
| 270 | **River Estate Game Farm — Safari Pricing &amp; Concierge MCP** <sub>za.co.regfarm/regfarm-mcp</sub> | `A+` | **90/100** | 6 | 93% | 100% | 71% | 259 tok |
| 271 | **Toronto and GTA Transit** <sub>ca.sitesy/transit</sub> | `A+` | **90/100** | 4 | 100% | 93% | 70% | 245 tok |
| 272 | [**Helpful Mods Catalog**](https://github.com/antanarr/helpfulmods-nextjs-paid-access) <sub>com.helpfulmods/catalog</sub> | `A+` | **90/100** | 5 | 96% | 97% | 70% | 220 tok |
| 273 | [**Agent Flights**](https://github.com/lomiafrica/agent-flights-mcp) <sub>flights.lowest/agent-flights</sub> | `A+` | **90/100** | 8 | 95% | 98% | 70% | 283 tok |
| 274 | [**AIMarket — live agent marketplace**](https://github.com/alexar76/aimarket-hub) <sub>io.github.alexar76/aimarket-hub</sub> | `A+` | **90/100** | 13 | 94% | 99% | 70% | 238 tok |
| 275 | [**travel.art**](https://github.com/alexzavialov/travel-art-mcp) <sub>art.travel/mcp</sub> | `A+` | **90/100** | 8 | 96% | 96% | 69% | 221 tok |
| 276 | [**HadithDB**](https://github.com/iadnanmukhtar/hadithdb) <sub>io.github.iadnanmukhtar/hadithdb</sub> | `A+` | **90/100** | 23 | 99% | 97% | 69% | 250 tok |
| 277 | **TownIndex** <sub>org.townindex/directory</sub> | `A+` | **90/100** | 4 | 98% | 96% | 69% | 304 tok |
| 278 | [**Systemores AI Agent &amp; MCP Security Auditor**](https://github.com/bobcar0/systemores-plugin) <sub>io.github.bobcar0/systemores-plugin</sub> | `A+` | **90/100** | 12 | 97% | 99% | 67% | 242 tok |
| 279 | [**MACKORN Hydraulic Cone Crusher Selection**](https://github.com/LeifDai/MACKORN-hydraulic-cone-crusher) <sub>cn.mackorn/mackorn-cone-crusher</sub> | `A+` | **90/100** | 29 | 96% | 100% | 66% | 281 tok |
| 280 | **Prim** <sub>com.profblu.prim/prim</sub> | `A+` | **90/100** | 8 | 100% | 94% | 65% | 260 tok |
| 281 | **while.sh** <sub>sh.while/while</sub> | `A+` | **90/100** | 45 | 96% | 100% | 65% | 294 tok |
| 282 | **IBDÅ** <sub>co.ibda/ibda</sub> | `A+` | **90/100** | 4 | 100% | 96% | 64% | 418 tok |
| 283 | [**DropTrack**](https://github.com/droptrack/droptrack-ai-integrations) <sub>io.github.droptrack/droptrack</sub> | `A+` | **90/100** | 5 | 100% | 97% | 64% | 291 tok |
| 284 | [**Cybercentry B20 Token Verification**](https://github.com/Cybercentry/cybercentry-app) <sub>uk.co.cybercentry/b20-verification</sub> | `A+` | **90/100** | 4 | 98% | 100% | 64% | 267 tok |
| 285 | **PokemonLore MCP** <sub>com.pokemonlore/pokemonlore</sub> | `A+` | **90/100** | 6 | 100% | 100% | 57% | 363 tok |
| 286 | **LVL LTD skill market** <sub>com.lvlltd/skill-market</sub> | `A` | **89/100** | 43 | 73% | 100% | 98% | 66 tok |
| 287 | [**Allooloo Receipts**](https://github.com/allooloo/rco-records) <sub>io.github.allooloo/rco-records</sub> | `A` | **89/100** | 5 | 78% | 100% | 91% | 112 tok |
| 288 | [**ABContents**](https://github.com/agustinnb/abcontents-mcp) <sub>io.github.agustinnb/abcontents</sub> | `A` | **89/100** | 7 | 79% | 100% | 90% | 145 tok |
| 289 | **VOLT48 — 48V DC telecom power** <sub>com.volt48/agent-door</sub> | `A` | **89/100** | 4 | 79% | 100% | 89% | 143 tok |
| 290 | [**dislop**](https://github.com/dislop-ai/dislop) <sub>io.github.dislop-ai/dislop</sub> | `A` | **89/100** | 7 | 80% | 100% | 89% | 100 tok |
| 291 | [**Gentleface icons**](https://github.com/andaja/gentleface-icons) <sub>com.gentleface/icons</sub> | `A` | **89/100** | 5 | 81% | 100% | 88% | 108 tok |
| 292 | **HokuHost Domains** <sub>com.hokuhost/domains</sub> | `A` | **89/100** | 12 | 83% | 98% | 88% | 103 tok |
| 293 | **Pumpkin** <sub>com.pumpkincms/pumpkin-public-site</sub> | `A` | **89/100** | 31 | 82% | 100% | 87% | 102 tok |
| 294 | [**Fless Apartment Hunt**](https://github.com/fless-io/skills) <sub>io.fless/mcp</sub> | `A` | **89/100** | 19 | 82% | 100% | 86% | 126 tok |
| 295 | [**Clawifi**](https://github.com/ReARCLabs/clawifi-mcp) <sub>io.github.atakanelik34/clawifi-mcp</sub> | `A` | **89/100** | 15 | 81% | 99% | 86% | 125 tok |
| 296 | **AVATALKS** <sub>app.avatalks/avatalks</sub> | `A` | **89/100** | 11 | 82% | 100% | 85% | 132 tok |
| 297 | **Vaultan** <sub>app.vaultan/vaultan</sub> | `A` | **89/100** | 5 | 86% | 97% | 85% | 111 tok |
| 298 | **Botwire** <sub>dev.pages.botwire/botwire</sub> | `A` | **89/100** | 8 | 84% | 96% | 85% | 123 tok |
| 299 | [**Allooloo Auditor**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getauditor</sub> | `A` | **89/100** | 3 | 87% | 95% | 85% | 129 tok |
| 300 | [**Allooloo Filings**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getfilings</sub> | `A` | **89/100** | 3 | 87% | 95% | 85% | 145 tok |
| 301 | [**Allooloo Ticker**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getticker</sub> | `A` | **89/100** | 3 | 87% | 95% | 85% | 133 tok |
| 302 | [**Crypto Regime MCP**](https://github.com/Shicodiez/crypto-regime-mcp) <sub>io.github.Shicodiez/crypto-regime-mcp</sub> | `A` | **89/100** | 12 | 85% | 98% | 85% | 122 tok |
| 303 | **ResumeVsJob Batch** <sub>xyz.resumevsjob/batch</sub> | `A` | **89/100** | 2 | 80% | 100% | 85% | 158 tok |
| 304 | **The Deals Database** <sub>com.thedealsdatabase/deals</sub> | `A` | **89/100** | 4 | 84% | 100% | 84% | 151 tok |
| 305 | [**Tsoden AI Visibility Audit**](https://github.com/notformal/tsoden-ai-plugins) <sub>ai.tsoden.serp/ai-visibility-audit</sub> | `A` | **89/100** | 6 | 87% | 98% | 83% | 123 tok |
| 306 | [**Quantum Aether**](https://github.com/moncef00327-cloud/quantum-aether) <sub>io.github.moncef00327-cloud/quantum-aether</sub> | `A` | **89/100** | 10 | 87% | 96% | 82% | 150 tok |
| 307 | **TANDIU AI infrastructure data** <sub>cn.tandiu/data</sub> | `A` | **89/100** | 17 | 85% | 99% | 81% | 150 tok |
| 308 | **PartAnswers Appliance Parts Lookup** <sub>com.partanswers/filter-lookup</sub> | `A` | **89/100** | 4 | 88% | 96% | 81% | 149 tok |
| 309 | **TexContractor** <sub>com.texcontractor/texcontractor</sub> | `A` | **89/100** | 4 | 83% | 100% | 81% | 130 tok |
| 310 | [**PatchLabs**](https://github.com/manra399/patchlabs) <sub>dev.patchlabs/patchlabs</sub> | `A` | **89/100** | 7 | 87% | 98% | 81% | 135 tok |
| 311 | **ЦПО — оборудование для общепита и торговли, Владивосток и Хабаровск** <sub>ru.cpo-dv/catalog</sub> | `A` | **89/100** | 5 | 88% | 97% | 81% | 151 tok |
| 312 | [**Ransack**](https://github.com/chancewalker165-dot/ransack-server) <sub>io.github.chancewalker165-dot/ransack</sub> | `A` | **89/100** | 7 | 85% | 100% | 80% | 150 tok |
| 313 | [**ItalyCheck**](https://github.com/yeick010/italycheck) <sub>io.github.yeick010/italycheck</sub> | `A` | **89/100** | 3 | 90% | 95% | 80% | 156 tok |
| 314 | [**BizStats.me**](https://github.com/stevyhacker/bizstats-mcp) <sub>me.bizstats/mcp</sub> | `A` | **89/100** | 10 | 86% | 100% | 80% | 150 tok |
| 315 | **stomp.to** <sub>to.stomp/editor</sub> | `A` | **89/100** | 18 | 85% | 99% | 80% | 164 tok |
| 316 | **ENGICOR — wholesale used engines** <sub>com.engicor/agent-door</sub> | `A` | **89/100** | 6 | 87% | 98% | 79% | 188 tok |
| 317 | **any.cab** <sub>cab.any/malta-transfers</sub> | `A` | **89/100** | 5 | 87% | 100% | 78% | 178 tok |
| 318 | **Stream Presence — Receipt Verifier** <sub>dev.streampresence/receipts-verifier</sub> | `A` | **89/100** | 11 | 89% | 97% | 78% | 166 tok |
| 319 | **Money Magician** <sub>eu.moneymagician/mcp</sub> | `A` | **89/100** | 13 | 92% | 94% | 78% | 184 tok |
| 320 | [**OPC UA Modeler**](https://github.com/node-opcua/node-opcua-modeler-mcp-server) <sub>io.github.node-opcua/node-opcua-modeler-mcp-server</sub> | `A` | **89/100** | 12 | 89% | 98% | 78% | 157 tok |
| 321 | [**opointo**](https://github.com/opointoHQ/opointo-mcp) <sub>com.opointo/opointo</sub> | `A` | **89/100** | 13 | 87% | 99% | 77% | 186 tok |
| 322 | **AgentReview** <sub>com.toolsandskillsratedreviewedandrankedbyaiagents/agentreview</sub> | `A` | **89/100** | 16 | 88% | 100% | 77% | 182 tok |
| 323 | **AgentReady Tools** <sub>io.github.agentready-tools/agentready-tools</sub> | `A` | **89/100** | 14 | 87% | 99% | 77% | 174 tok |
| 324 | **SJ Storage** <sub>net.sjstorage/site</sub> | `A` | **89/100** | 11 | 90% | 97% | 77% | 149 tok |
| 325 | **Ubiquary Shop \(DFITKO\)** <sub>com.ubiquary/shop</sub> | `A` | **89/100** | 7 | 89% | 98% | 76% | 194 tok |
| 326 | [**Ironflow: Hyperliquid data**](https://github.com/ironflowsh/mcp) <sub>io.github.ironflowsh/hyperliquid</sub> | `A` | **89/100** | 46 | 93% | 95% | 76% | 190 tok |
| 327 | **Privacyboard for builders** <sub>io.privacyboard/vendors</sub> | `A` | **89/100** | 4 | 91% | 96% | 76% | 204 tok |
| 328 | **ai.ellul/services** | `A` | **89/100** | 5 | 90% | 97% | 75% | 168 tok |
| 329 | **Modulos AI Governance Platform** <sub>ai.modulos/demo-booking</sub> | `A` | **89/100** | 16 | 92% | 98% | 74% | 204 tok |
| 330 | **Avanciq - tax rates, codes, e-invoices, calculation checks** <sub>com.avanciq/connector</sub> | `A` | **89/100** | 6 | 92% | 98% | 73% | 216 tok |
| 331 | [**GetMattered**](https://github.com/getmattered/getmattered-mcp) <sub>com.getmattered/getmattered</sub> | `A` | **89/100** | 41 | 93% | 99% | 73% | 265 tok |
| 332 | **SVV-Schatzoekers Public Selling Agent** <sub>nl.svv-schatzoekers/public-selling-agent</sub> | `A` | **89/100** | 3 | 89% | 100% | 73% | 174 tok |
| 333 | **Masqot** <sub>co.masqot.mcp/mcp</sub> | `A` | **89/100** | 22 | 95% | 94% | 72% | 211 tok |
| 334 | **Peptul** <sub>com.peptul/peptul</sub> | `A` | **89/100** | 5 | 96% | 94% | 72% | 201 tok |
| 335 | **APRS World** <sub>world.aprs/aprs-world</sub> | `A` | **89/100** | 10 | 98% | 91% | 72% | 219 tok |
| 336 | **IKANGAI AI News** <sub>com.ikangai/ai-news</sub> | `A` | **89/100** | 5 | 91% | 100% | 71% | 221 tok |
| 337 | [**Candor UI docs**](https://github.com/MethodicDev/candor) <sub>com.themethodic/candor</sub> | `A` | **89/100** | 12 | 93% | 96% | 71% | 224 tok |
| 338 | **Markan: Steam market data** <sub>games.markan/markan</sub> | `A` | **89/100** | 4 | 93% | 96% | 71% | 244 tok |
| 339 | **FinQuest 국내 주식·채권 MCP** <sub>space.finquest/finquest</sub> | `A` | **89/100** | 31 | 93% | 99% | 71% | 243 tok |
| 340 | [**Agent Email Transactional Dispatcher \(x402\)**](https://github.com/brunopompeo1/brazil-ai-fiscal-apis-x402) <sub>io.github.brunopompeo1/agent-email-x402</sub> | `A` | **89/100** | 2 | 90% | 100% | 70% | 207 tok |
| 341 | [**Agent Guard Prompt Injection &amp; PII Firewall \(x402\)**](https://github.com/brunopompeo1/brazil-ai-fiscal-apis-x402) <sub>io.github.brunopompeo1/agent-guard-x402</sub> | `A` | **89/100** | 1 | 90% | 100% | 70% | 176 tok |
| 342 | **productgrowth.in** <sub>in.productgrowth/productgrowth</sub> | `A` | **89/100** | 8 | 95% | 96% | 69% | 215 tok |
| 343 | **Last Price** <sub>ai.last-price/pricing</sub> | `A` | **89/100** | 11 | 97% | 96% | 65% | 288 tok |
| 344 | [**OpenSubtitles**](https://github.com/opensubtitles/mcp.opensubtitles.com) <sub>com.opensubtitles/mcp-server</sub> | `A` | **89/100** | 7 | 93% | 100% | 65% | 316 tok |
| 345 | **Clic'n Done PDF** <sub>com.clicndone.pdf/pdf-tools</sub> | `A` | **89/100** | 17 | 95% | 100% | 64% | 294 tok |
| 346 | **Impakt Data Tools** <sub>dev.workers.impaktdev.actor-api-proxy/impakt-data-tools</sub> | `A` | **89/100** | 8 | 96% | 98% | 64% | 277 tok |
| 347 | **Stadika: study abroad and Russian universities** <sub>ru.stadika/stadika</sub> | `A` | **89/100** | 14 | 96% | 99% | 64% | 343 tok |
| 348 | **Boatopoly** <sub>com.boatopoly/boatopoly</sub> | `A` | **89/100** | 4 | 100% | 96% | 60% | 358 tok |
| 349 | [**Jobs Data MCP \(SteadyScrape\)**](https://github.com/steadyscrape/jobs-data-mcp) <sub>io.github.steadyscrape/jobs-data-mcp</sub> | `A` | **89/100** | 4 | 100% | 100% | 55% | 316 tok |
| 350 | **MiaoToolbox \(妙用盒\)** <sub>com.miaotoolbox/miaotoolbox</sub> | `A` | **89/100** | 9 | 100% | 100% | 52% | 432 tok |
| 351 | [**io.github.StonSolo1/orions-agora**](https://github.com/StonSolo1/orions-agora) | `A` | **88/100** | 4 | 70% | 100% | 100% | 53 tok |
| 352 | **PR Scope Owners** <sub>io.sslip.149-56-208-69/pr-scope-owners</sub> | `A` | **88/100** | 1 | 70% | 100% | 100% | 80 tok |
| 353 | **Dark Forest — Agent Field Test** <sub>wiki.darkforest/field-test</sub> | `A` | **88/100** | 3 | 73% | 100% | 95% | 71 tok |
| 354 | **Map Maker** <sub>cc.map-maker/map-maker</sub> | `A` | **88/100** | 11 | 75% | 100% | 93% | 91 tok |
| 355 | **taufnaus Geschenke-Shop** <sub>de.taufnaus/shop</sub> | `A` | **88/100** | 8 | 75% | 100% | 91% | 122 tok |
| 356 | **Folkscale** <sub>io.github.lurnake/folkscale</sub> | `A` | **88/100** | 7 | 76% | 100% | 91% | 87 tok |
| 357 | [**io.github.TMCHALK/sftunes**](https://github.com/TMCHALK/sftunes) | `A` | **88/100** | 3 | 77% | 100% | 90% | 79 tok |
| 358 | [**Hyperliquid Liquidation Heatmap – Crypto Trading – by HyperPerps**](https://github.com/velinxs/hyperperps-heatmap-plugin) <sub>app.hyperperps/liquidation-heatmap</sub> | `A` | **88/100** | 5 | 78% | 100% | 88% | 99 tok |
| 359 | **OpsRev Roofing AI** <sub>ai.opsrev.roofing-ai/mcp</sub> | `A` | **88/100** | 70 | 79% | 100% | 87% | 117 tok |
| 360 | **Actuator** <sub>com.actuato/actuator</sub> | `A` | **88/100** | 26 | 80% | 100% | 86% | 134 tok |
| 361 | **GitHub Actions Version Check** <sub>ai.opencurrent/actions-latest</sub> | `A` | **88/100** | 2 | 80% | 100% | 85% | 87 tok |
| 362 | **Mexico Market Entry &amp; Accounting — Costa Contable** <sub>com.costacontable/mexico-market-entry-accounting</sub> | `A` | **88/100** | 5 | 80% | 100% | 85% | 120 tok |
| 363 | **ProofTask public** <sub>com.prooftask/mcp-public</sub> | `A` | **88/100** | 4 | 80% | 100% | 85% | 111 tok |
| 364 | [**Kristo Intelligence**](https://github.com/hristovdimitri2-hub/kristo-intelligence-6) <sub>io.github.hristovdimitri2-hub/kristo-intelligence</sub> | `A` | **88/100** | 7 | 83% | 96% | 85% | 129 tok |
| 365 | [**Losbeto — Market Data for AI Agents**](https://github.com/rmartins1451/losbeto) <sub>io.github.rmartins1451/losbeto</sub> | `A` | **88/100** | 5 | 88% | 91% | 85% | 136 tok |
| 366 | **io.github.ryuamarines/email-extractor** | `A` | **88/100** | 1 | 80% | 100% | 85% | 158 tok |
| 367 | **HONEWA Quality** <sub>site.chatgpt.honewa-6908.honewa-quality/quality</sub> | `A` | **88/100** | 5 | 86% | 97% | 81% | 169 tok |
| 368 | **Agent Exchange: find a paid API that works** <sub>work.agentexchange/bazaar</sub> | `A` | **88/100** | 8 | 90% | 93% | 81% | 172 tok |
| 369 | **Korea Court Auction \(법원 경매 예상 낙찰가\)** <sub>com.intoperson.auction/court-auction</sub> | `A` | **88/100** | 10 | 84% | 99% | 79% | 144 tok |
| 370 | [**DemoPage**](https://github.com/gaufire/demopage-plugins) <sub>io.demopage/demopage</sub> | `A` | **88/100** | 11 | 86% | 97% | 79% | 173 tok |
| 371 | [**Allooloo Target Market**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/gettargetmarket</sub> | `A` | **88/100** | 8 | 88% | 94% | 79% | 157 tok |
| 372 | **Fix My PC** <sub>app.aplusz.fixmypc/fix-my-pc</sub> | `A` | **88/100** | 2 | 90% | 93% | 78% | 160 tok |
| 373 | **ForeverVow** <sub>in.forevervow/forevervow</sub> | `A` | **88/100** | 3 | 87% | 95% | 78% | 171 tok |
| 374 | **ForLab Geo API** <sub>io.forlab/geo</sub> | `A` | **88/100** | 13 | 86% | 97% | 78% | 166 tok |
| 375 | **Korea Public Bids \(나라장터 입찰 참가 조건\)** <sub>com.intoperson.bid/bid-conditions</sub> | `A` | **88/100** | 9 | 90% | 95% | 77% | 174 tok |
| 376 | **bet365 API** <sub>com.thebet365api/server</sub> | `A` | **88/100** | 13 | 86% | 99% | 76% | 165 tok |
| 377 | [**Cellarion Wine Registry**](https://github.com/jagduvi1/Cellarion) <sub>app.cellarion/wine-registry</sub> | `A` | **88/100** | 6 | 92% | 93% | 75% | 197 tok |
| 378 | **Motif** <sub>com.motiftrace/motif</sub> | `A` | **88/100** | 14 | 89% | 96% | 75% | 189 tok |
| 379 | **AI Agent Audit and Action Review** <sub>dev.workers.michigkchatgpt.agent-action-review/agent-action-review</sub> | `A` | **88/100** | 5 | 85% | 100% | 75% | 204 tok |
| 380 | [**A11y Probe**](https://github.com/MartinSwiss/a11y-probe-mcp) <sub>io.github.MartinSwiss/a11y-probe-mcp</sub> | `A` | **88/100** | 6 | 84% | 100% | 75% | 158 tok |
| 381 | **com.kenoodl/line** | `A` | **88/100** | 31 | 91% | 95% | 74% | 186 tok |
| 382 | **Spectra** <sub>finance.spectra/mcp</sub> | `A` | **88/100** | 6 | 88% | 98% | 74% | 200 tok |
| 383 | **Agent Water Cooler** <sub>io.github.aakashbharadwaj15/agent-water-cooler</sub> | `A` | **88/100** | 7 | 89% | 98% | 74% | 217 tok |
| 384 | **Doutor Chamada** <sub>br.com.doutorchamada/doutor-chamada</sub> | `A` | **88/100** | 4 | 90% | 96% | 73% | 268 tok |
| 385 | **Paint by Numbers Generator** <sub>com.paint-by-number/paint-by-numbers</sub> | `A` | **88/100** | 3 | 87% | 100% | 73% | 223 tok |
| 386 | [**OpenLMNP**](https://github.com/manganate006/openlmnp) <sub>io.github.manganate006/openlmnp</sub> | `A` | **88/100** | 48 | 89% | 98% | 73% | 219 tok |
| 387 | [**io.github.stillmarcus24/stillos-notary-mcp**](https://github.com/stillmarcus24/stillos-notary-mcp) | `A` | **88/100** | 5 | 90% | 97% | 73% | 182 tok |
| 388 | **QR Code Creator** <sub>app.qrcodecreator/qr-codes</sub> | `A` | **88/100** | 6 | 93% | 93% | 72% | 215 tok |
| 389 | **QR Code Dinosaur** <sub>com.qrcodedinosaur/qr-codes</sub> | `A` | **88/100** | 6 | 93% | 93% | 72% | 225 tok |
| 390 | [**amCharts 5**](https://github.com/amcharts/amcharts5-mcp) <sub>io.github.amcharts/amcharts5</sub> | `A` | **88/100** | 12 | 91% | 95% | 72% | 207 tok |
| 391 | **TripFinder.ca** <sub>ca.tripfinder/tours</sub> | `A` | **88/100** | 9 | 92% | 97% | 71% | 283 tok |
| 392 | [**openradar**](https://github.com/MikhailSagalaev/openradar) <sub>io.github.MikhailSagalaev/openradar</sub> | `A` | **88/100** | 9 | 93% | 95% | 71% | 243 tok |
| 393 | **OpenHealth** <sub>org.getopenhealth/openhealth</sub> | `A` | **88/100** | 15 | 96% | 91% | 71% | 222 tok |
| 394 | [**Jobo Job Search**](https://github.com/JoboAI/jobo-mcp) <sub>world.jobo/job-search</sub> | `A` | **88/100** | 7 | 93% | 94% | 71% | 491 tok |
| 395 | [**Besidka**](https://github.com/besidka/besidka) <sub>com.besidka/mcp</sub> | `A` | **88/100** | 65 | 93% | 94% | 69% | 246 tok |
| 396 | [**Development Radio**](https://github.com/MasasaDeveloper/development-radio-plugin) <sub>dev.developmentradio/development-radio</sub> | `A` | **88/100** | 6 | 95% | 93% | 69% | 224 tok |
| 397 | **Barbaro** <sub>io.github.jeffforderer/barbaro</sub> | `A` | **88/100** | 11 | 90% | 99% | 69% | 506 tok |
| 398 | **Blazar Polygon plugin** <sub>net.blazarforce/blazar-polygon</sub> | `A` | **88/100** | 40 | 94% | 96% | 69% | 255 tok |
| 399 | **Capstract** <sub>org.capstract/capstract</sub> | `A` | **88/100** | 20 | 89% | 100% | 69% | 312 tok |
| 400 | [**AIgorithmic Butterfly Effect**](https://github.com/ranaji10/aigorithmic-butterfly-effect) <sub>io.github.ranaji10/aigorithmic-butterfly-effect</sub> | `A` | **88/100** | 6 | 95% | 95% | 68% | 236 tok |
| 401 | **Dusty's Pizza** <sub>uk.co.dustyspizza.mcp/dustys-pizza</sub> | `A` | **88/100** | 6 | 92% | 98% | 68% | 220 tok |
| 402 | [**Emergent Technologies**](https://github.com/Free-LLC/emergent-mcp) <sub>ai.emergenttechnologies/emergent</sub> | `A` | **88/100** | 8 | 95% | 94% | 67% | 283 tok |
| 403 | **Cobalt Capture** <sub>com.cobaltcapture/cobalt</sub> | `A` | **88/100** | 17 | 94% | 96% | 67% | 282 tok |
| 404 | [**Emergent Technologies**](https://github.com/Free-LLC/emergent-mcp) <sub>is.emergent/emergent</sub> | `A` | **88/100** | 8 | 95% | 94% | 67% | 283 tok |
| 405 | **BirJob** <sub>com.birjob/jobs</sub> | `A` | **88/100** | 15 | 96% | 94% | 66% | 372 tok |
| 406 | **The Power Contractor — Genuine OEM Industrial Parts &amp; Iraq/MENA Sourcing** <sub>com.pc-cn/industrial-sourcing</sub> | `A` | **88/100** | 5 | 90% | 100% | 66% | 320 tok |
| 407 | [**Korean Law MCP**](https://github.com/chrisryugj/korean-law-mcp) <sub>io.github.chrisryugj/korean-law-mcp</sub> | `A` | **88/100** | 10 | 95% | 96% | 65% | 318 tok |
| 408 | **MemBrowse** <sub>com.membrowse/membrowse</sub> | `A` | **88/100** | 8 | 95% | 96% | 64% | 298 tok |
| 409 | [**io.github.agentexec448c/agent-exec**](https://github.com/agentexec448c/agent-exec) | `A` | **88/100** | 31 | 92% | 99% | 64% | 282 tok |
| 410 | [**Asteria: Astrology &amp; Tarot**](https://github.com/Ask-Asteria/asteria-mcp) <sub>com.askasteria/asteria</sub> | `A` | **88/100** | 13 | 100% | 92% | 62% | 305 tok |
| 411 | [**Smart OCR — PDF, Invoice &amp; Receipt to JSON/Table API**](https://github.com/Saneth98/smart-ocr-proxy) <sub>io.github.Saneth98/smart-ocr-pdf-invoice-receipt-json</sub> | `A` | **88/100** | 3 | 93% | 100% | 62% | 280 tok |
| 412 | [**Smart OCR**](https://github.com/Saneth98/smart-ocr-proxy) <sub>io.github.Saneth98/smartocr</sub> | `A` | **88/100** | 3 | 93% | 100% | 62% | 280 tok |
| 413 | **Podziemie Analityczne** <sub>pl.podziemieanalityczne/dane</sub> | `A` | **88/100** | 14 | 97% | 95% | 62% | 322 tok |
| 414 | **Tinplate Edge AI Safety, Security &amp; Data Validation** <sub>dev.tinplate/edge-apis</sub> | `A` | **88/100** | 16 | 94% | 100% | 61% | 333 tok |
| 415 | **MathApex Worksheets** <sub>app.mathapex/worksheets</sub> | `A` | **88/100** | 2 | 100% | 93% | 60% | 357 tok |
| 416 | **Overlay: Together** <sub>com.overlayastro/together</sub> | `A` | **88/100** | 2 | 100% | 93% | 60% | 341 tok |
| 417 | [**Tubroom**](https://github.com/mikelovatt/tubroom-mcp) <sub>com.tubroom/tubroom</sub> | `A` | **88/100** | 4 | 98% | 96% | 60% | 334 tok |
| 418 | **DinCat — learning and life in Japan** <sub>ai.dincat/dincat</sub> | `A` | **88/100** | 5 | 100% | 94% | 58% | 349 tok |
| 419 | [**Basko**](https://github.com/bekroz/basko-ai) <sub>app.basko/basko</sub> | `A` | **88/100** | 6 | 100% | 98% | 53% | 372 tok |
| 420 | **Proactive Parent guidance** <sub>app.proactiveparent/guidance</sub> | `A` | **88/100** | 2 | 100% | 100% | 50% | 376 tok |
| 421 | **Verifera job search** <sub>uk.co.verifera/job-search</sub> | `A` | **88/100** | 1 | 100% | 100% | 50% | 324 tok |
| 422 | **THE PASSWORD — Club MCP \(Store Zero\)** <sub>com.enochxii/the-password</sub> | `A` | **87/100** | 12 | 76% | 98% | 90% | 102 tok |
| 423 | [**Homemade**](https://github.com/usehomemade/homemade) <sub>dev.homemade/homemade</sub> | `A` | **87/100** | 38 | 76% | 96% | 90% | 160 tok |
| 424 | [**Allooloo Orderability**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getorderability</sub> | `A` | **87/100** | 7 | 80% | 96% | 87% | 119 tok |
| 425 | **Workflow Fieldwork** <sub>com.workflowfieldwork/workflow-fieldwork</sub> | `A` | **87/100** | 3 | 77% | 100% | 85% | 113 tok |
| 426 | [**Cynthia**](https://github.com/rayhyman333-blip/cynthia-mcp-server) <sub>io.github.rayhyman333-blip/cynthia</sub> | `A` | **87/100** | 5 | 84% | 91% | 85% | 156 tok |
| 427 | **Mishkat \(مِشكاة\) Arabic Islamic lectures** <sub>org.mssid.mishkat/lectures</sub> | `A` | **87/100** | 13 | 81% | 97% | 84% | 137 tok |
| 428 | **qed.bot register** <sub>bot.qed/register</sub> | `A` | **87/100** | 20 | 87% | 98% | 83% | 152 tok |
| 429 | **CatalystDesk** <sub>ai.catalystdesk/mcp-server</sub> | `A` | **87/100** | 8 | 78% | 100% | 81% | 144 tok |
| 430 | **Sell Ltd Marketplace** <sub>uk.co.sellltd/marketplace</sub> | `A` | **87/100** | 17 | 80% | 98% | 81% | 184 tok |
| 431 | [**guessit-js**](https://github.com/opensubtitles/guessit-js) <sub>com.opensubtitles/guessit-js</sub> | `A` | **87/100** | 3 | 83% | 95% | 80% | 188 tok |
| 432 | [**Allooloo As Of**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getasof</sub> | `A` | **87/100** | 4 | 83% | 96% | 80% | 144 tok |
| 433 | [**RootMention**](https://github.com/burmanharry/rootmention-mcp) <sub>io.github.burmanharry/rootmention</sub> | `A` | **87/100** | 3 | 80% | 100% | 80% | 132 tok |
| 434 | **Navad** <sub>ai.navad/jobs</sub> | `A` | **87/100** | 18 | 88% | 100% | 79% | 175 tok |
| 435 | **Notícias Nacionais** <sub>br.com.noticiasnacionais/mcp</sub> | `A` | **87/100** | 29 | 82% | 97% | 79% | 282 tok |
| 436 | [**ShearQuery — Barber &amp; Beauty Industry Data**](https://github.com/lamont703/Project_InnerG_Complete_Agency) <sub>com.innergcomplete/shearquery</sub> | `A` | **87/100** | 145 | 84% | 96% | 79% | 165 tok |
| 437 | [**SwapHunt crypto market context**](https://github.com/swaphunt/x402-examples) <sub>io.github.swaphunt/swaphunt-mcp</sub> | `A` | **87/100** | 6 | 88% | 90% | 79% | 179 tok |
| 438 | **Lookup: India PIN codes and districts, public holidays** <sub>io.at01.api/lookup</sub> | `A` | **87/100** | 4 | 91% | 89% | 78% | 166 tok |
| 439 | [**Allooloo Research**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getresearch</sub> | `A` | **87/100** | 3 | 87% | 95% | 78% | 157 tok |
| 440 | [**Nightshift agent tools \(run by an AI\)**](https://github.com/llm-9-to-5/nightshift-x402-worker) <sub>io.github.llm-9-to-5/nightshift-agent-tools</sub> | `A` | **87/100** | 12 | 88% | 94% | 78% | 157 tok |
| 441 | **AI Agent Verification** <sub>ai.erc8126scan/agent-verification</sub> | `A` | **87/100** | 12 | 87% | 95% | 77% | 186 tok |
| 442 | **ERC-8126 Scan** <sub>ai.erc8126scan/erc8126-scan</sub> | `A` | **87/100** | 12 | 87% | 95% | 77% | 186 tok |
| 443 | [**Axad**](https://github.com/axad-ai/plugins) <sub>ai.axad/language-tutor</sub> | `A` | **87/100** | 24 | 84% | 99% | 76% | 439 tok |
| 444 | **Pitbi** <sub>app.pitbi/pitbi</sub> | `A` | **87/100** | 39 | 87% | 96% | 76% | 235 tok |
| 445 | **Superstables** <sub>com.superstables/superstables</sub> | `A` | **87/100** | 15 | 90% | 93% | 76% | 210 tok |
| 446 | **Lumen Research Desk** <sub>dev.workers.agent-arena-base.lumen-peg/research-desk</sub> | `A` | **87/100** | 12 | 89% | 91% | 76% | 211 tok |
| 447 | **ThaiProps Thailand Real Estate** <sub>com.thaiprops/mcp</sub> | `A` | **87/100** | 5 | 87% | 97% | 75% | 205 tok |
| 448 | **Ravi CI Guard: GitHub Actions security audit** <sub>dev.workers.agent-arena-base.ravi-ci-guard/ci-guard</sub> | `A` | **87/100** | 7 | 89% | 94% | 75% | 221 tok |
| 449 | [**FRNC — Korean Franchise Disclosure Risk Check**](https://github.com/CLNS-KR/FRNC) <sub>io.github.CLNS-KR/frnc</sub> | `A` | **87/100** | 7 | 90% | 94% | 75% | 263 tok |
| 450 | [**Gamealia**](https://github.com/gamealia/gamealia-mcp) <sub>io.github.gamealia/gamealia-mcp</sub> | `A` | **87/100** | 12 | 89% | 95% | 75% | 352 tok |
| 451 | **Superpass** <sub>me.superpass/superpass</sub> | `A` | **87/100** | 3 | 89% | 95% | 75% | 175 tok |
| 452 | **Tesla VIN Report** <sub>report.tbx/tesla-vin-report</sub> | `A` | **87/100** | 3 | 93% | 90% | 75% | 218 tok |
| 453 | **Still Relevant** <sub>uk.stillrelevant/still-relevant</sub> | `A` | **87/100** | 2 | 90% | 93% | 75% | 210 tok |
| 454 | **PulseReal** <sub>com.pulsereal/mcp</sub> | `A` | **87/100** | 7 | 90% | 94% | 74% | 231 tok |
| 455 | **Agenturo** <sub>app.agenturo/agenturo</sub> | `A` | **87/100** | 6 | 92% | 93% | 73% | 220 tok |
| 456 | **KillBounce Data** <sub>app.killbounce.data/tools</sub> | `A` | **87/100** | 29 | 90% | 94% | 73% | 201 tok |
| 457 | **Camping Australia** <sub>au.com.trip-planner/camping-australia</sub> | `A` | **87/100** | 18 | 91% | 94% | 73% | 247 tok |
| 458 | [**Zoeb Nomi**](https://github.com/zoeb-nomi/zoebnomi-mcp) <sub>io.github.zoeb-nomi/zoebnomi</sub> | `A` | **87/100** | 3 | 90% | 95% | 73% | 228 tok |
| 459 | **KARP Research by SoulDriver** <sub>au.com.souldriver/karp</sub> | `A` | **87/100** | 5 | 90% | 94% | 72% | 218 tok |
| 460 | [**Dreamwork**](https://github.com/dreamworkhq/mcp) <sub>io.github.dreamworkhq/dreamwork</sub> | `A` | **87/100** | 75 | 87% | 97% | 72% | 255 tok |
| 461 | **Motion Menu Director** <sub>io.github.MotionMenu/motion-menu</sub> | `A` | **87/100** | 15 | 89% | 94% | 72% | 219 tok |
| 462 | **Borders** <sub>me.borders/borders</sub> | `A` | **87/100** | 7 | 88% | 96% | 72% | 212 tok |
| 463 | **Copybook** <sub>page.copybook/copybook</sub> | `A` | **87/100** | 5 | 92% | 91% | 72% | 261 tok |
| 464 | **Zola** <sub>com.zola/zola</sub> | `A` | **87/100** | 32 | 93% | 92% | 71% | 264 tok |
| 465 | **HeyIdentity** <sub>dev.heyidentity/heyidentity</sub> | `A` | **87/100** | 20 | 89% | 97% | 71% | 247 tok |
| 466 | **Shipfolio** <sub>io.shipfolio/shipfolio</sub> | `A` | **87/100** | 54 | 92% | 94% | 71% | 228 tok |
| 467 | **cmbs.news: CMBS loan data** <sub>news.cmbs/cmbs-news</sub> | `A` | **87/100** | 17 | 92% | 92% | 71% | 249 tok |
| 468 | **Ellimist** <sub>trade.ellimist/ellimist</sub> | `A` | **87/100** | 22 | 86% | 99% | 71% | 225 tok |
| 469 | **BlooTrue business directory** <sub>com.blootrue/directory</sub> | `A` | **87/100** | 1 | 100% | 85% | 70% | 222 tok |
| 470 | **Standard Issue Data** <sub>com.standardissuedata/vehicle-data</sub> | `A` | **87/100** | 1 | 100% | 85% | 70% | 234 tok |
| 471 | [**iPayX FX Audit**](https://github.com/iPAYX-Technologies/mcp-fx-audit) <sub>io.github.iPAYX-Technologies/mcp-fx-audit</sub> | `A` | **87/100** | 4 | 89% | 96% | 70% | 229 tok |
| 472 | **io.github.ryuamarines/app-store-version** | `A` | **87/100** | 1 | 85% | 100% | 70% | 172 tok |
| 473 | **Tachka.ru Auto Parts Store \(Тачка.Ру\)** <sub>ru.tachka/shop</sub> | `A` | **87/100** | 10 | 90% | 97% | 70% | 248 tok |
| 474 | [**Sisoco One Insolvency**](https://github.com/SisocoOne/sisoco-one-mcp) <sub>uk.co.sisoco/uk-company-insolvency-check</sub> | `A` | **87/100** | 3 | 100% | 85% | 70% | 256 tok |
| 475 | **Rigged Clean** <sub>app.getrigged/clean</sub> | `A` | **87/100** | 4 | 90% | 96% | 69% | 278 tok |
| 476 | **Clear Ice Schweiz** <sub>ch.clear-ice/clear-ice</sub> | `A` | **87/100** | 7 | 91% | 96% | 69% | 280 tok |
| 477 | **Pechim — Preços, Ofertas e Histórico no Brasil** <sub>io.github.ateodor1/pechim</sub> | `A` | **87/100** | 4 | 93% | 93% | 69% | 207 tok |
| 478 | [**Secret Santa**](https://github.com/juansalvatella/secret-santa) <sub>name.secretsanta/secret-santa</sub> | `A` | **87/100** | 12 | 87% | 99% | 69% | 257 tok |
| 479 | [**DataXAPI**](https://github.com/data-x-api/dataxapi-mcp) <sub>com.dataxapi/mcp</sub> | `A` | **87/100** | 5 | 91% | 97% | 68% | 605 tok |
| 480 | [**Switchboard Finance**](https://github.com/Nicklim123/switchboard-finance-mcp) <sub>io.github.Nicklim123/switchboard-finance</sub> | `A` | **87/100** | 5 | 96% | 91% | 68% | 283 tok |
| 481 | [**Manage Bet Codes**](https://github.com/kayceepeece/managebetcodes-mcp) <sub>app.managebetcodes/managebetcodes-mcp</sub> | `A` | **87/100** | 16 | 90% | 97% | 67% | 246 tok |
| 482 | **Forthcast Inventory** <sub>io.forthcast/inventory</sub> | `A` | **87/100** | 11 | 87% | 100% | 67% | 285 tok |
| 483 | [**Vietnam Address Converter \(2025 reform\)**](https://github.com/since98vn/vietnam-mcp-servers) <sub>vn.since98/vietnam-address</sub> | `A` | **87/100** | 7 | 97% | 89% | 66% | 273 tok |
| 484 | [**paidfor**](https://github.com/sarmadahsan/paidfor-index) <sub>dev.paidfor/paidfor</sub> | `A` | **87/100** | 4 | 95% | 93% | 65% | 245 tok |
| 485 | [**GRNT — Korean Grant &amp; Subsidy Intelligence**](https://github.com/CLNS-KR/GRNT) <sub>io.github.CLNS-KR/grnt</sub> | `A` | **87/100** | 9 | 91% | 98% | 65% | 358 tok |
| 486 | [**Antigravity x402 &amp; MCP Gateway**](https://github.com/tunguyen1993/antigravity-x402-mcp-gateway) <sub>io.github.tunguyen1993/antigravity-x402-mcp-gateway</sub> | `A` | **87/100** | 22 | 90% | 99% | 65% | 269 tok |
| 487 | **The Bonus Stack** <sub>com.thebonusstack/bonuses</sub> | `A` | **87/100** | 8 | 96% | 93% | 64% | 305 tok |
| 488 | **Muralists Directory** <sub>eu.muralists/directory</sub> | `A` | **87/100** | 6 | 95% | 95% | 64% | 329 tok |
| 489 | [**GridHop GPU Price &amp; Carbon Index**](https://github.com/gridhopai/gpu-price-index-mcp) <sub>io.github.gridhopai/gpu-price-index</sub> | `A` | **87/100** | 4 | 100% | 89% | 64% | 452 tok |
| 490 | **KeebFinder** <sub>com.keeb-finder/keebfinder</sub> | `A` | **87/100** | 4 | 95% | 96% | 63% | 395 tok |
| 491 | **Lexicon Garden** <sub>garden.lexicon/lexicon-garden</sub> | `A` | **87/100** | 6 | 92% | 98% | 63% | 253 tok |
| 492 | [**io.github.cyanheads/reference-data-mcp-server**](https://github.com/cyanheads/reference-data-mcp-server.git) | `A` | **87/100** | 11 | 96% | 93% | 63% | 302 tok |
| 493 | [**Ad Spec Guard**](https://github.com/notformal/adsbeast-plugins) <sub>io.github.notformal/ad-spec-guard</sub> | `A` | **87/100** | 9 | 98% | 98% | 63% | 280 tok |
| 494 | **Alina Szaputko — Online Psychology Consultation Booking** <sub>io.github.alinaszaputko-psych/alina-online-booking</sub> | `A` | **87/100** | 5 | 96% | 94% | 61% | 345 tok |
| 495 | **User Intuition** <sub>ai.userintuition/research</sub> | `A` | **87/100** | 79 | 99% | 96% | 60% | 336 tok |
| 496 | **AgentSupply** <sub>dev.agentsupply/agentsupply</sub> | `A` | **87/100** | 27 | 94% | 99% | 60% | 373 tok |
| 497 | [**BrewPage**](https://github.com/kochetkov-ma/brewpage-openapi) <sub>io.github.kochetkov-ma/brewpage-mcp</sub> | `A` | **87/100** | 13 | 93% | 99% | 59% | 354 tok |
| 498 | **PriceBee** <sub>lt.pricebee/pricebee</sub> | `A` | **87/100** | 6 | 100% | 93% | 59% | 330 tok |
| 499 | [**Stophy**](https://github.com/stophydotdev/stophy.git) <sub>io.github.stophydotdev/mcp</sub> | `A` | **87/100** | 5 | 96% | 97% | 57% | 442 tok |
| 500 | **Israeli Real Estate and Legal Calculators** <sub>biz.notaryon/calculators</sub> | `A` | **87/100** | 13 | 99% | 98% | 53% | 399 tok |
| 501 | **SpecSource** <sub>org.specsource/specsource</sub> | `A` | **87/100** | 7 | 100% | 98% | 50% | 529 tok |
| 502 | **ChainGuard Web3 &amp; MCP Shield** <sub>app.railway.up.chainguard-studio-production/chainguard-shield</sub> | `A` | **86/100** | 10 | 70% | 100% | 93% | 92 tok |
| 503 | **SOQVER business facts \(SO4AG\)** <sub>com.soqver/so4ag</sub> | `A` | **86/100** | 4 | 70% | 100% | 93% | 97 tok |
| 504 | **SilkVin — wholesale parts for Chinese cars** <sub>com.silkvin/agent-door</sub> | `A` | **86/100** | 5 | 76% | 97% | 87% | 148 tok |
| 505 | [**Inferrail Web Read**](https://github.com/domondi1/inferrail) <sub>io.github.domondi1/inferrail-web-read</sub> | `A` | **86/100** | 1 | 75% | 100% | 85% | 125 tok |
| 506 | **Qadiva — wholesale glassware \(UAE &amp; GCC\)** <sub>com.qadiva/agent-door</sub> | `A` | **86/100** | 4 | 75% | 100% | 84% | 146 tok |
| 507 | **SCRIPTMASTERLABS — HIVE402** <sub>com.scriptmasterlabs/hive402</sub> | `A` | **86/100** | 17 | 83% | 97% | 83% | 153 tok |
| 508 | **agtmart sandbox store and agent survey** <sub>io.agtmart/agent-commerce</sub> | `A` | **86/100** | 9 | 77% | 98% | 83% | 149 tok |
| 509 | [**Allooloo Issuer**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/cm-kg</sub> | `A` | **86/100** | 8 | 81% | 94% | 83% | 142 tok |
| 510 | **Babelii-Diofis Customer Support** <sub>net.diofis/babelii-support</sub> | `A` | **86/100** | 6 | 79% | 98% | 80% | 139 tok |
| 511 | [**Spatial 3D Display Oracle \(Cloudflare Workers MCP\)**](https://github.com/raydeoliveira/spatial-mcp-worker) <sub>io.github.raydeoliveira/spatial-mcp-worker</sub> | `A` | **86/100** | 5 | 78% | 100% | 79% | 135 tok |
| 512 | [**RightCard**](https://github.com/rightcard/rightcard-mcp) <sub>ai.rightcard/mcp</sub> | `A` | **86/100** | 5 | 78% | 100% | 78% | 175 tok |
| 513 | **Provyan** <sub>com.provyan/provyan</sub> | `A` | **86/100** | 13 | 86% | 93% | 78% | 167 tok |
| 514 | **VSinger Moment** <sub>jp.vsinger-moment/vsinger-moment</sub> | `A` | **86/100** | 16 | 83% | 96% | 77% | 169 tok |
| 515 | [**peerbox**](https://github.com/BukeLy/peerbox) <sub>io.github.BukeLy/peerbox</sub> | `A` | **86/100** | 15 | 81% | 99% | 75% | 191 tok |
| 516 | **Comidoc** <sub>com.comidoc/comidoc</sub> | `A` | **86/100** | 11 | 82% | 99% | 74% | 308 tok |
| 517 | [**Fuzzzy Law: Georgian law**](https://github.com/fuzzzy-bot/fuzzzy-law) <sub>com.fuzzzycore.law/georgian-law</sub> | `A` | **86/100** | 12 | 86% | 96% | 74% | 206 tok |
| 518 | [**Text Request MCP by usefulapi**](https://github.com/m190/usefulapi-mcp) <sub>io.usefulapi/text-request</sub> | `A` | **86/100** | 19 | 80% | 100% | 74% | 201 tok |
| 519 | **Supersurf** <sub>app.supersurf/supersurf</sub> | `A` | **86/100** | 7 | 88% | 94% | 72% | 197 tok |
| 520 | [**CarlNotes**](https://github.com/doubleoevan/carlnotes) <sub>com.carlnotes/carlnotes</sub> | `A` | **86/100** | 45 | 86% | 95% | 72% | 233 tok |
| 521 | **dotsy** <sub>ai.dotsy/mcp</sub> | `A` | **86/100** | 120 | 89% | 98% | 71% | 262 tok |
| 522 | [**Agent Data Tools: Utilities**](https://github.com/Nutshell2000/agent-data-tools) <sub>io.github.Nutshell2000/agent-data-tools-utilities</sub> | `A` | **86/100** | 109 | 92% | 89% | 71% | 213 tok |
| 523 | [**Gantlett Systems - AI Governance Seam Pilots &amp; Executive Briefs**](https://github.com/mgantlett/nomos) <sub>io.gantlett/seam-governance</sub> | `A` | **86/100** | 3 | 93% | 90% | 70% | 199 tok |
| 524 | [**Lode**](https://github.com/lode-hq/lode-mcp) <sub>io.trylode/lode</sub> | `A` | **86/100** | 11 | 89% | 93% | 70% | 267 tok |
| 525 | [**Sisoco One LEI**](https://github.com/SisocoOne/sisoco-one-mcp) <sub>uk.co.sisoco/gleif-lei-parent-company</sub> | `A` | **86/100** | 3 | 93% | 90% | 70% | 213 tok |
| 526 | **Fare Facts** <sub>app.farefacts/fare-facts</sub> | `A` | **86/100** | 6 | 97% | 85% | 69% | 275 tok |
| 527 | [**LayerHop**](https://github.com/layerhop/layerhop-js) <sub>com.layerhop/mcp</sub> | `A` | **86/100** | 22 | 98% | 95% | 69% | 266 tok |
| 528 | [**SpainCompanyAPI: Spanish company data**](https://github.com/abasmartinc/apiempresas-mcp) <sub>io.github.abasmartinc/apiempresas</sub> | `A` | **86/100** | 4 | 95% | 89% | 69% | 214 tok |
| 529 | [**Mind Upload AI meta harness**](https://github.com/Voidborn-Industries/mindupload-sdk-python) <sub>io.github.Voidborn-Industries/mindupload</sub> | `A` | **86/100** | 8 | 87% | 96% | 69% | 335 tok |
| 530 | [**Charmotion**](https://github.com/charmotion/charmotion-mcp) <sub>app.charmotion/charmotion</sub> | `A` | **86/100** | 16 | 91% | 92% | 68% | 262 tok |
| 531 | [**NodajiMarket**](https://github.com/NodajiFi-Tokenomy/NodajiFi-Ecosystem) <sub>com.nodajimarket/catalog</sub> | `A` | **86/100** | 6 | 89% | 95% | 68% | 254 tok |
| 532 | [**AI SENSE Free Public Tools**](https://github.com/aisenseapi/aisense-free-public-rest-apis) <sub>com.aisenseapi/free-public-tools</sub> | `A` | **86/100** | 89 | 97% | 93% | 67% | 261 tok |
| 533 | **DataMembership** <sub>com.datamembership/uk-consumer-data</sub> | `A` | **86/100** | 3 | 87% | 100% | 67% | 770 tok |
| 534 | **P0: wallet balances and EVM reads** <sub>dev.workers.x402-bazaar-rank-worker.x402-bazaar-rank/evm-wallet-onchain</sub> | `A` | **86/100** | 12 | 98% | 86% | 67% | 270 tok |
| 535 | [**Web3alert for agents**](https://github.com/web3alert/mcp) <sub>io.web3alert/agent</sub> | `A` | **86/100** | 10 | 90% | 96% | 67% | 275 tok |
| 536 | [**BetterKids Parent Guide**](https://github.com/airdropfi/betterkids) <sub>app.betterkid/betterkids-parent-guide</sub> | `A` | **86/100** | 8 | 95% | 91% | 66% | 285 tok |
| 537 | **Direct Hotels** <sub>com.direct-hotels/directory</sub> | `A` | **86/100** | 6 | 92% | 93% | 66% | 273 tok |
| 538 | **Comontel : forfaits mobiles pro sur le réseau Orange** <sub>fr.comontel/forfaits</sub> | `A` | **86/100** | 18 | 94% | 92% | 66% | 258 tok |
| 539 | **Standout** <sub>io.standoutmcp/standout</sub> | `A` | **86/100** | 32 | 94% | 93% | 66% | 272 tok |
| 540 | **Feature Library** <sub>com.featurelibrary/parts</sub> | `A` | **86/100** | 11 | 95% | 90% | 63% | 292 tok |
| 541 | [**Creditable**](https://github.com/theguysaccount/mcp-catalog) <sub>io.github.theguysaccount/creditable</sub> | `A` | **86/100** | 5 | 88% | 100% | 63% | 382 tok |
| 542 | **isitdns** <sub>net.isitdns/isitdns</sub> | `A` | **86/100** | 6 | 93% | 93% | 63% | 272 tok |
| 543 | [**Fidget Labs**](https://github.com/Fidget-Labs/fidgetlabs-cli) <sub>io.fidgetlabs/fidget-labs</sub> | `A` | **86/100** | 4 | 100% | 89% | 60% | 396 tok |
| 544 | [**OIYO World Tax, Payroll &amp; Tenancy**](https://github.com/yuli3/api-oiyo) <sub>io.github.yuli3/oiyo-world</sub> | `A` | **86/100** | 147 | 100% | 91% | 59% | 328 tok |
| 545 | **Sanctions &amp; Tariff Lookup** <sub>com.trystarrynightops/sanctions-tariff-lookup</sub> | `A` | **86/100** | 7 | 97% | 94% | 58% | 370 tok |
| 546 | [**OIYO Korea Calculators**](https://github.com/yuli3/api-oiyo) <sub>io.github.yuli3/oiyo-calculations</sub> | `A` | **86/100** | 273 | 99% | 91% | 56% | 374 tok |
| 547 | [**OIYO Korea Welfare &amp; Benefits**](https://github.com/yuli3/api-oiyo) <sub>io.github.yuli3/oiyo-welfare</sub> | `A` | **86/100** | 24 | 97% | 94% | 56% | 384 tok |
| 548 | [**AgentsChat — Shared MCP Rooms for AI Coding Agents**](https://github.com/swswordholy-tech/AgentsChat) <sub>io.github.swswordholy-tech/agentschat-mcp</sub> | `A` | **86/100** | 25 | 98% | 93% | 55% | 404 tok |
| 549 | **io.github.semcycle/actbook** | `A` | **85/100** | 259 | 72% | 97% | 88% | 114 tok |
| 550 | [**Ifá Discovery**](https://github.com/MissPris2023/ancestral-whispers-now) <sub>io.github.MissPris2023/ifadiscovery</sub> | `A` | **85/100** | 3 | 83% | 90% | 80% | 185 tok |
| 551 | **Managed Nerds** <sub>tech.managednerds/managed-nerds</sub> | `A` | **85/100** | 16 | 80% | 95% | 80% | 166 tok |
| 552 | **Discover the Tools** <sub>com.discoverthetools/directory</sub> | `A` | **85/100** | 9 | 77% | 100% | 78% | 203 tok |
| 553 | **AINDEX** <sub>capital.aindex/aindex</sub> | `A` | **85/100** | 71 | 82% | 96% | 76% | 179 tok |
| 554 | **dzship: shipping for Algeria** <sub>com.dzbuild/dzship</sub> | `A` | **85/100** | 8 | 78% | 100% | 75% | 211 tok |
| 555 | **Horizon eSIM** <sub>com.horizonesim/plan-finder</sub> | `A` | **85/100** | 6 | 83% | 95% | 75% | 185 tok |
| 556 | **Agent Provider Depot** <sub>com.getagentdepot/agent-provider-depot</sub> | `A` | **85/100** | 4 | 86% | 93% | 74% | 210 tok |
| 557 | **StoreTechScan — Ecommerce &amp; Website Tech Stack API** <sub>com.storetechscan/storetechscan</sub> | `A` | **85/100** | 7 | 87% | 91% | 74% | 220 tok |
| 558 | [**The Doll Scout Home Tools**](https://github.com/f-tiger/agi-site) <sub>io.github.f-tiger/tds-home-tools</sub> | `A` | **85/100** | 500 | 79% | 100% | 73% | 181 tok |
| 559 | [**MergeSafe**](https://github.com/mergesafe-ai/mergesafe-mcp) <sub>ai.mergesafe/mergesafe</sub> | `A` | **85/100** | 16 | 93% | 94% | 72% | 218 tok |
| 560 | **Diastella** <sub>com.diastella/diastella</sub> | `A` | **85/100** | 6 | 88% | 90% | 72% | 227 tok |
| 561 | **Tethered Trust for builders** <sub>com.tetheredtrust/builders</sub> | `A` | **85/100** | 12 | 86% | 94% | 72% | 220 tok |
| 562 | **The world according to capital** <sub>com.notacompany/newsletter</sub> | `A` | **85/100** | 15 | 85% | 96% | 71% | 276 tok |
| 563 | **EU Tender Radar \(TED\)** <sub>com.digitalbusinessportal/eu-procurement</sub> | `A` | **85/100** | 2 | 80% | 100% | 70% | 177 tok |
| 564 | **Somebody Build This** <sub>dev.somebodybuildthis/ideas</sub> | `A` | **85/100** | 2 | 95% | 85% | 70% | 213 tok |
| 565 | [**ArchLang**](https://github.com/ChanMeng666/archlang) <sub>io.github.ChanMeng666/archlang-mcp</sub> | `A` | **85/100** | 13 | 92% | 88% | 70% | 263 tok |
| 566 | [**io.github.HMAKT99/scbee-mcp**](https://github.com/HMAKT99/ScBee) | `A` | **85/100** | 5 | 88% | 91% | 70% | 205 tok |
| 567 | **Wall of Decks** <sub>com.wallofdecks/wall-of-decks</sub> | `A` | **85/100** | 6 | 95% | 85% | 69% | 267 tok |
| 568 | [**Nifra docs**](https://github.com/nifrajs/nifra) <sub>io.github.nifrajs/nifra-docs</sub> | `A` | **85/100** | 7 | 93% | 87% | 69% | 208 tok |
| 569 | [**Anaella**](https://github.com/dahoai/anaella-agent-plugin) <sub>com.anaella/mcp</sub> | `A` | **85/100** | 7 | 91% | 91% | 68% | 308 tok |
| 570 | **Gridleak** <sub>app.gridleak/mcp</sub> | `A` | **85/100** | 12 | 93% | 89% | 67% | 252 tok |
| 571 | **mireforma.net** <sub>net.mireforma/mireforma</sub> | `A` | **85/100** | 8 | 93% | 89% | 67% | 313 tok |
| 572 | [**xsolana**](https://github.com/XGamesFun/solana-kit) <sub>io.github.XGamesFun/solana-kit</sub> | `A` | **85/100** | 11 | 93% | 90% | 66% | 265 tok |
| 573 | [**Nomos - Deterministic Git &amp; AST Governance for AI Coding Agents**](https://github.com/mgantlett/nomos) <sub>ca.sophialabs/nomos</sub> | `A` | **85/100** | 7 | 96% | 87% | 64% | 263 tok |
| 574 | [**Jaybird Digital**](https://github.com/Jaybird-Digital/jaybird-digital-mcp) <sub>com.jaybirddigital/website</sub> | `A` | **85/100** | 12 | 97% | 88% | 64% | 330 tok |
| 575 | **Safe-Send Check: crypto support triage, sanctions and scam screening** <sub>dev.workers.agent-arena-base.safe-send-check/safe-send-check</sub> | `A` | **85/100** | 11 | 93% | 90% | 64% | 310 tok |
| 576 | [**Nomos - Deterministic Git &amp; AST Governance for AI Coding Agents**](https://github.com/mgantlett/nomos) <sub>io.github.mgantlett/nomos</sub> | `A` | **85/100** | 7 | 96% | 87% | 64% | 263 tok |
| 577 | **KiedySport.pl** <sub>pl.kiedysport/sport</sub> | `A` | **85/100** | 4 | 93% | 93% | 64% | 294 tok |
| 578 | **palletdimensions.com freight reference** <sub>com.palletdimensions/freight-reference</sub> | `A` | **85/100** | 8 | 92% | 93% | 63% | 354 tok |
| 579 | **io.github.anthonywlicausi/agentic-ai** | `A` | **85/100** | 8 | 91% | 94% | 63% | 277 tok |
| 580 | [**osc-bridge**](https://github.com/roomi-fields/osc-bridge) <sub>io.github.roomi-fields/osc-bridge</sub> | `A` | **85/100** | 29 | 92% | 94% | 63% | 295 tok |
| 581 | [**Kilotest**](https://github.com/jrpool/kilotest) <sub>io.github.jrpool/kilotest</sub> | `A` | **85/100** | 12 | 96% | 90% | 62% | 301 tok |
| 582 | [**finwire.pl - Polish financial data**](https://github.com/finwire-pl/api) <sub>pl.finwire/data</sub> | `A` | **85/100** | 102 | 98% | 87% | 62% | 304 tok |
| 583 | **Playloop** <sub>com.tryplayloop/playloop</sub> | `A` | **85/100** | 8 | 92% | 94% | 61% | 1002 tok |
| 584 | [**Kaucim**](https://github.com/mingyan9989/kaucim-public-mcp) <sub>io.github.mingyan9989/kaucim-public-mcp</sub> | `A` | **85/100** | 10 | 88% | 97% | 61% | 385 tok |
| 585 | **CORDON** <sub>dev.blvkware/cordon</sub> | `A` | **85/100** | 2 | 100% | 85% | 60% | 324 tok |
| 586 | [**SocialTap**](https://github.com/SocialTapDev/socialtap-mcp) <sub>dev.socialtap/mcp</sub> | `A` | **85/100** | 12 | 97% | 94% | 55% | 561 tok |
| 587 | [**AlgoVault — Crypto Quant Trade Calls**](https://github.com/AlgoVaultLabs/crypto-quant-signal-mcp) <sub>io.github.AlgoVaultFi/crypto-quant-signal-mcp</sub> | `A` | **85/100** | 11 | 99% | 92% | 54% | 428 tok |
| 588 | **Growth Business Finance** <sub>com.growthbusinessfinance/mcp</sub> | `A` | **85/100** | 7 | 99% | 91% | 53% | 477 tok |
| 589 | **Argento** <sub>com.profblu.argento/argento</sub> | `A` | **85/100** | 6 | 100% | 90% | 53% | 338 tok |
| 590 | [**Clipform**](https://github.com/clipform/mcp-server) <sub>io.github.Clipform/mcp-server</sub> | `A` | **85/100** | 33 | 98% | 94% | 53% | 560 tok |
| 591 | **Meteoro Minerals** <sub>io.meteoro.www/minerals</sub> | `A` | **85/100** | 9 | 100% | 92% | 52% | 390 tok |
| 592 | [**ISZ Shiwake AI \(Japanese tax &amp; accounting\)**](https://github.com/iszgroup/shiwake-ai-mcp) <sub>ai.shiwake/mcp</sub> | `A` | **85/100** | 9 | 99% | 93% | 50% | 505 tok |
| 593 | [**Photo Sweat Shop Image Tools**](https://github.com/photo-sweat-shop/photosweat-mcp) <sub>shop.photosweat/remove-background</sub> | `A` | **85/100** | 2 | 100% | 93% | 50% | 403 tok |
| 594 | **AI Crawler Permission Check** <sub>ai.opencurrent/robots-ai-check</sub> | `A` | **84/100** | 2 | 70% | 100% | 85% | 104 tok |
| 595 | **Phase Platforms** <sub>io.github.phasebro/phase</sub> | `A` | **84/100** | 7 | 70% | 100% | 85% | 130 tok |
| 596 | **The wall \(whatagentswant\)** <sub>ai.whatagentswant/wall</sub> | `A` | **84/100** | 3 | 77% | 95% | 80% | 160 tok |
| 597 | **Sirfus CAR** <sub>com.sirfus/car</sub> | `A` | **84/100** | 10 | 88% | 97% | 77% | 212 tok |
| 598 | **AgenticGeoMate** <sub>io.github.PascalSun/agenticgeomate</sub> | `A` | **84/100** | 92 | 80% | 93% | 77% | 184 tok |
| 599 | **sebbi.pro - the proof layer for AI** <sub>pro.sebbi/governance</sub> | `A` | **84/100** | 20 | 80% | 95% | 77% | 185 tok |
| 600 | **Moqway** <sub>com.moqway/wholesale</sub> | `A` | **84/100** | 20 | 76% | 97% | 76% | 183 tok |
| 601 | [**Real Return Engine**](https://github.com/realreturnengine/realreturnengine-mcp-plugin) <sub>com.realreturnengine/real-return-engine</sub> | `A` | **84/100** | 4 | 85% | 89% | 74% | 167 tok |
| 602 | [**Proving Lab**](https://github.com/Bubu89/full-page-pdf-snap) <sub>dev.provinglab/browser-citation-capture</sub> | `A` | **84/100** | 10 | 89% | 93% | 74% | 185 tok |
| 603 | [**GodPrompt MCP Server**](https://github.com/AKzar1el/god-prompt-mcp) <sub>io.github.AKzar1el/god-prompt-mcp</sub> | `A` | **84/100** | 22 | 77% | 99% | 73% | 216 tok |
| 604 | **Katalis UK company checks** <sub>com.meetkatalis/katalis</sub> | `A` | **84/100** | 19 | 89% | 87% | 72% | 226 tok |
| 605 | [**AISeeWhy**](https://github.com/aiseewhy/check-action) <sub>com.aiseewhy/aiseewhy</sub> | `A` | **84/100** | 19 | 84% | 93% | 71% | 231 tok |
| 606 | **The Mine by tkscm — Hawaiʻi economic data** <sub>com.tkscmlimited.mine/hawaii-data</sub> | `A` | **84/100** | 7 | 89% | 87% | 71% | 210 tok |
| 607 | [**attest — verification for AI agent artifacts**](https://github.com/mrpkk/attest) <sub>io.github.mrpkk/attest</sub> | `A` | **84/100** | 2 | 85% | 93% | 70% | 218 tok |
| 608 | **io.github.ryuamarines/url-normalizer** | `A` | **84/100** | 1 | 78% | 100% | 70% | 180 tok |
| 609 | **Remont — renovation planner** <sub>io.github.Vutik/remont</sub> | `A` | **84/100** | 30 | 81% | 97% | 70% | 292 tok |
| 610 | **Skill Harbor** <sub>com.theskillharbor/skill-harbor</sub> | `A` | **84/100** | 7 | 90% | 89% | 69% | 243 tok |
| 611 | [**uniwire**](https://github.com/uniwire-dev/uniwire) <sub>io.github.uniwire-dev/uniwire</sub> | `A` | **84/100** | 14 | 85% | 94% | 69% | 245 tok |
| 612 | **Cycle DPP &amp; GS1 Checks** <sub>com.cycle-platform/cycle-verify</sub> | `A` | **84/100** | 17 | 87% | 91% | 68% | 235 tok |
| 613 | **Nicolas Sitter Research** <sub>com.nicolassitter/research</sub> | `A` | **84/100** | 8 | 91% | 87% | 68% | 257 tok |
| 614 | [**Stormap**](https://github.com/boriskendev/brainstorm-ai) <sub>io.github.boriskendev/stormap</sub> | `A` | **84/100** | 20 | 93% | 90% | 66% | 240 tok |
| 615 | **Tethered Trust** <sub>com.tetheredtrust/tethered-trust</sub> | `A` | **84/100** | 23 | 89% | 92% | 64% | 289 tok |
| 616 | **Odile Gate** <sub>com.odilelabs/gate</sub> | `A` | **84/100** | 14 | 95% | 97% | 62% | 365 tok |
| 617 | [**SpriteForge Editor**](https://github.com/OndrejKnizat/spriteforge-editor) <sub>tech.spriteforge/editor</sub> | `A` | **84/100** | 6 | 90% | 93% | 62% | 376 tok |
| 618 | **dieAnalysten Adressshop** <sub>com.dieanalysten/adressshop</sub> | `A` | **84/100** | 6 | 87% | 98% | 60% | 471 tok |
| 619 | **Düğün.com** <sub>com.dugun/wedding</sub> | `A` | **84/100** | 7 | 93% | 91% | 60% | 696 tok |
| 620 | **Dojazdomat** <sub>io.github.MikolajSapek/dojazdomat</sub> | `A` | **84/100** | 10 | 89% | 97% | 59% | 367 tok |
| 621 | **golfdata.online — verified golf clubs** <sub>online.golfdata/golf-clubs</sub> | `A` | **84/100** | 6 | 97% | 88% | 59% | 312 tok |
| 622 | [**marketinque — launch plan &amp; backlink index**](https://github.com/zeshutmax/demand-gen) <sub>com.marketinque/launch-plan</sub> | `A` | **84/100** | 16 | 94% | 91% | 58% | 350 tok |
| 623 | **SatsDNS** <sub>com.satsdns/satsdns</sub> | `A` | **84/100** | 30 | 94% | 90% | 58% | 401 tok |
| 624 | [**Minerals**](https://github.com/Mineralsdev/minerals) <sub>dev.minerals/minerals</sub> | `A` | **84/100** | 5 | 94% | 91% | 58% | 425 tok |
| 625 | [**Ansvra**](https://github.com/tobhol-lab/ansvra-mcp) <sub>com.ansvra/mcp</sub> | `A` | **84/100** | 13 | 88% | 100% | 57% | 338 tok |
| 626 | **Rauhnacht-Orakel** <sub>de.rauhnaechte-ritual/rauhnacht-orakel</sub> | `A` | **84/100** | 3 | 100% | 85% | 57% | 349 tok |
| 627 | [**Web Validator by DigestSEO**](https://github.com/AKzar1el/mcp-web-validator) <sub>io.github.AKzar1el/mcp-web-validator</sub> | `A` | **84/100** | 27 | 92% | 94% | 57% | 741 tok |
| 628 | [**Speedbot.dev — AI agent marketplace**](https://github.com/ulasarslan6262-ui/swarm-market) <sub>io.github.ulasarslan6262-ui/speedbot</sub> | `A` | **84/100** | 23 | 90% | 95% | 57% | 478 tok |
| 629 | **Structomat** <sub>com.structomat/steel</sub> | `A` | **84/100** | 11 | 95% | 90% | 56% | 710 tok |
| 630 | **ChatHome — Luxembourg Real Estate** <sub>lu.chathome/chathome</sub> | `A` | **84/100** | 21 | 91% | 96% | 56% | 364 tok |
| 631 | [**serpgrab: Google Search, Maps and Jobs**](https://github.com/Fiery-Tools/serpgrab-mcp) <sub>com.serpgrab/google-search</sub> | `A` | **84/100** | 3 | 100% | 90% | 50% | 359 tok |
| 632 | [**io.github.cyanheads/stackexchange-mcp-server**](https://github.com/cyanheads/stackexchange-mcp-server) | `A` | **84/100** | 5 | 98% | 91% | 50% | 437 tok |
| 633 | [**Chart-Output**](https://github.com/lavondev/chart-output-mcp) <sub>io.github.lavondev/chart-output-mcp</sub> | `A` | **84/100** | 1 | 90% | 100% | 50% | 405 tok |
| 634 | **PageMD** <sub>com.manhourplan/pagemd</sub> | `A` | **83/100** | 6 | 90% | 98% | 83% | 152 tok |
| 635 | **Schoolwise** <sub>ai.schoolwise/schoolwise</sub> | `A` | **83/100** | 4 | 70% | 100% | 81% | 140 tok |
| 636 | **Council of AI GSPC \(free\)** <sub>ai.councilof/gspc-free</sub> | `A` | **83/100** | 49 | 83% | 86% | 80% | 183 tok |
| 637 | [**NovAI Prices**](https://github.com/vvvvking/novai-prices-mcp) <sub>com.aiapi-pro/novai-prices</sub> | `A` | **83/100** | 3 | 80% | 90% | 80% | 146 tok |
| 638 | **USAC Funding Data \(E-Rate, Rural Health Care, Lifeline\)** <sub>com.digitalbusinessportal/usac-funding</sub> | `A` | **83/100** | 5 | 74% | 97% | 79% | 162 tok |
| 639 | [**Yardstick ATS**](https://github.com/yardstickinc/yardstick-mcp) <sub>team.yardstick/yardstick</sub> | `A` | **83/100** | 276 | 72% | 99% | 77% | 190 tok |
| 640 | **Council of AI GSPC** <sub>ai.councilof/gspc</sub> | `A` | **83/100** | 54 | 84% | 86% | 76% | 222 tok |
| 641 | **OMENZ agent tools** <sub>org.omenz.www/agent-tools</sub> | `A` | **83/100** | 117 | 85% | 91% | 74% | 193 tok |
| 642 | **PDF Checkup** <sub>com.pdfcheckup/pdf-checkup</sub> | `A` | **83/100** | 1 | 90% | 85% | 70% | 237 tok |
| 643 | [**LinkProof**](https://github.com/bunuzong-sudo/linkproof) <sub>dev.workers.bsptimber.linkproof/linkproof</sub> | `A` | **83/100** | 14 | 86% | 89% | 70% | 219 tok |
| 644 | **Foundplay for game makers** <sub>io.foundplay/creators</sub> | `A` | **83/100** | 4 | 90% | 85% | 70% | 193 tok |
| 645 | [**OmniForge Launch Audit MCP**](https://github.com/zColdWater/mcp-launch-audit) <sub>io.github.zColdWater/mcp-launch-audit</sub> | `A` | **83/100** | 4 | 90% | 85% | 70% | 213 tok |
| 646 | **Wallet address risk verdict \(x402\)** <sub>work.agentexchange/crypto-address-risk</sub> | `A` | **83/100** | 1 | 90% | 85% | 70% | 178 tok |
| 647 | **Wallet accumulating or distributing \(x402\)** <sub>work.agentexchange/smart-money-wallet-activity</sub> | `A` | **83/100** | 1 | 90% | 85% | 70% | 255 tok |
| 648 | [**TraceCheck**](https://github.com/TGS-checker/tracecheck-mcp) <sub>io.github.TGS-checker/tracecheck</sub> | `A` | **83/100** | 2 | 85% | 93% | 68% | 282 tok |
| 649 | **PlaceProfile: find a restaurant, bar, cafe or hotel by its atmosphere \(free\)** <sub>net.placeprofile/placeprofile</sub> | `A` | **83/100** | 4 | 88% | 89% | 68% | 774 tok |
| 650 | **P0 Agent Economy Index** <sub>dev.workers.x402-bazaar-rank-worker.x402-bazaar-rank/x402-bazaar-rank</sub> | `A` | **83/100** | 44 | 93% | 87% | 67% | 241 tok |
| 651 | **GridIron Data** <sub>io.github.avansledright/gridiron-data</sub> | `A` | **83/100** | 25 | 81% | 96% | 66% | 271 tok |
| 652 | **Fish and Chips by chippynear.me** <sub>me.chippynear/fish-and-chips</sub> | `A` | **83/100** | 6 | 90% | 88% | 66% | 275 tok |
| 653 | **TransitRadar — UK trains and buses** <sub>uk.co.transitradar/transitradar</sub> | `A` | **83/100** | 16 | 90% | 89% | 66% | 229 tok |
| 654 | **EuKreate Find Home** <sub>ai.eukollab/eukreate-find-home</sub> | `A` | **83/100** | 4 | 80% | 100% | 64% | 287 tok |
| 655 | **aamio rendezvous** <sub>at.aamio/aamio</sub> | `A` | **83/100** | 11 | 98% | 90% | 64% | 321 tok |
| 656 | [**AgentTrust XRPL**](https://github.com/eamwhite1/xrpl-referee) <sub>io.github.eamwhite1/xrpl-referee</sub> | `A` | **83/100** | 51 | 87% | 92% | 64% | 385 tok |
| 657 | [**Agent Data Tools: Web, documents and search**](https://github.com/Nutshell2000/agent-data-tools) <sub>io.github.Nutshell2000/agent-data-tools-web</sub> | `A` | **83/100** | 30 | 94% | 85% | 64% | 276 tok |
| 658 | **Hedgr FX Risk &amp; Hedging** <sub>app.hedgr/hedgr</sub> | `A` | **83/100** | 27 | 91% | 88% | 63% | 307 tok |
| 659 | [**BC Training Navigator — Grants &amp; PTIRU College Directory**](https://github.com/yueliao11/mcp-servers) <sub>org.bctrainingnavigator/bc-training</sub> | `A` | **83/100** | 3 | 93% | 85% | 63% | 278 tok |
| 660 | **BlitzReels Video Editor** <sub>com.blitzreels/blitzreels</sub> | `A` | **83/100** | 151 | 81% | 99% | 62% | 381 tok |
| 661 | **PlaceProfile evidence: verified atmosphere of a restaurant, bar, cafe or hotel \(paid\)** <sub>net.placeprofile/evidence</sub> | `A` | **83/100** | 6 | 92% | 88% | 62% | 675 tok |
| 662 | **Venue atmosphere verification, Bitcoin timestamp: restaurants, bars, hotels \(PlaceProfile, paid\)** <sub>net.placeprofile/venue-atmosphere-verification-bitcoin</sub> | `A` | **83/100** | 6 | 92% | 88% | 62% | 675 tok |
| 663 | [**Reevol Source: supplier search**](https://github.com/reevol-ai/mcp) <sub>com.reevol.source/supplier-search</sub> | `A` | **83/100** | 14 | 91% | 90% | 61% | 297 tok |
| 664 | **EuKreate Market Research** <sub>ai.eukollab/eukreate-market-research</sub> | `A` | **83/100** | 2 | 80% | 100% | 60% | 282 tok |
| 665 | [**IPOSignal**](https://github.com/Waltermelon-lang/iposignal-microtransactions) <sub>xyz.iposignal/iposignal</sub> | `A` | **83/100** | 10 | 93% | 88% | 60% | 281 tok |
| 666 | **app.web.dealer-direct-mcp/dealer-direct-inventory** | `A` | **83/100** | 10 | 93% | 96% | 59% | 706 tok |
| 667 | [**io.alterlab/mcp-server**](https://github.com/RapierCraft/alterlab-mcp-server) | `A` | **83/100** | 73 | 94% | 89% | 59% | 455 tok |
| 668 | **Ampdat Control** <sub>com.ampdat/control</sub> | `A` | **83/100** | 5 | 94% | 88% | 58% | 290 tok |
| 669 | **Forthmatch 3PL Directory** <sub>io.forthmatch/3pl-directory</sub> | `A` | **83/100** | 3 | 99% | 85% | 57% | 420 tok |
| 670 | **Das Landhaus Apartments Prägant** <sub>net.praegant/landhaus</sub> | `A` | **83/100** | 11 | 95% | 89% | 57% | 378 tok |
| 671 | [**cuttingfloor**](https://github.com/Mvp2o-ai/cuttingfloor) <sub>io.github.Mvp2o-ai/cuttingfloor</sub> | `A` | **83/100** | 75 | 93% | 92% | 56% | 542 tok |
| 672 | [**Spurvik**](https://github.com/spurvik/spurvik) <sub>io.github.spurvik/spurvik-mcp-server</sub> | `A` | **83/100** | 10 | 94% | 90% | 56% | 396 tok |
| 673 | **Lone Pair** <sub>app.lonepair/lonepair</sub> | `A` | **83/100** | 5 | 98% | 88% | 54% | 396 tok |
| 674 | **MERA Robotics** <sub>com.merarobotics/mera</sub> | `A` | **83/100** | 15 | 99% | 87% | 54% | 497 tok |
| 675 | **GoThere Japan Transit &amp; Travel** <sub>online.gothere/japan-travel</sub> | `A` | **83/100** | 5 | 100% | 85% | 54% | 413 tok |
| 676 | **BitTuitive** <sub>ai.bittuitive.api/bittuitive</sub> | `A` | **83/100** | 28 | 96% | 90% | 53% | 542 tok |
| 677 | [**io.github.foxdavidson/property-mortgage-mcp**](https://github.com/foxdavidson/property-mortgage-mcp) | `A` | **83/100** | 15 | 99% | 88% | 52% | 471 tok |
| 678 | **Horseback: zajęcia na Jurze** <sub>pl.horseback/horseback</sub> | `A` | **83/100** | 10 | 100% | 87% | 52% | 517 tok |
| 679 | [**OpenStays Property Passports**](https://github.com/OSAINOW/openstays-mcp) <sub>ai.openstays/property-passports</sub> | `A` | **83/100** | 2 | 94% | 93% | 50% | 999 tok |
| 680 | **Dipperfield** <sub>com.dipperfield/dipperfield</sub> | `A` | **83/100** | 11 | 98% | 90% | 49% | 844 tok |
| 681 | [**FOXIFY Agent Commerce**](https://github.com/speeedy10/agent-authority-check) <sub>pro.foxify/agent-commerce</sub> | `A` | **83/100** | 4 | 90% | 100% | 48% | 715 tok |
| 682 | [**RBAi Scholar**](https://github.com/Insightwithhari/rbai-scholar) <sub>io.github.Insightwithhari/rbai-scholar</sub> | `A` | **83/100** | 6 | 100% | 93% | 43% | 556 tok |
| 683 | **Sweepless in Seattle** <sub>com.sweeplessinseattle/quote</sub> | `A` | **83/100** | 1 | 100% | 100% | 30% | 668 tok |
| 684 | [**Brazil DANFSe &amp; Tax Reform RTC \(x402\)**](https://github.com/brunopompeo1/brazil-ai-fiscal-apis-x402) <sub>io.github.brunopompeo1/br-danfse-rtc-x402</sub> | `A` | **83/100** | 2 | 100% | 100% | 30% | 946 tok |
| 685 | **Zapmatte Green Screen Remover** <sub>com.zapmatte/green-screen-remover</sub> | `A` | **82/100** | 6 | 86% | 100% | 82% | 182 tok |
| 686 | **Margrave** <sub>tools.valksor/margrave</sub> | `A` | **82/100** | 3 | 73% | 95% | 80% | 134 tok |
| 687 | **Custom Solutions** <sub>com.customsolutionsindy/custom-solutions</sub> | `A` | **82/100** | 20 | 89% | 89% | 69% | 285 tok |
| 688 | [**Compose Preview Catalogs**](https://github.com/yschimke/compose-preview-server) <sub>io.github.yschimke/compose-preview</sub> | `A` | **82/100** | 18 | 82% | 96% | 68% | 270 tok |
| 689 | **ASI.EXPRESS** <sub>express.asi/asi-express</sub> | `A` | **82/100** | 11 | 85% | 89% | 66% | 334 tok |
| 690 | **Agent Weather** <sub>io.agentweather/agent-weather</sub> | `A` | **82/100** | 64 | 88% | 87% | 66% | 266 tok |
| 691 | [**Signal Lab: free data and MCP server audits for AI agents**](https://github.com/quantumdatatechnologies/signal-lab-catalog) <sub>io.github.QDThead/signal-lab</sub> | `A` | **82/100** | 27 | 87% | 89% | 65% | 290 tok |
| 692 | **MOT Check** <sub>io.motcheck/mot</sub> | `A` | **82/100** | 4 | 90% | 85% | 65% | 280 tok |
| 693 | [**GC Airport Transfers**](https://github.com/neild1971-maker/gc-airport-transfers-mcp) <sub>com.gc-airporttransfers/booking</sub> | `A` | **82/100** | 4 | 88% | 89% | 64% | 332 tok |
| 694 | [**AI Buildout Permits**](https://github.com/2016judea/ai-buildout-permits) <sub>io.github.2016judea/ai-buildout-permits</sub> | `A` | **82/100** | 7 | 89% | 87% | 64% | 294 tok |
| 695 | **Criptonlabs Agent APIs** <sub>com.criptonlabs/agent-apis</sub> | `A` | **82/100** | 35 | 89% | 88% | 62% | 324 tok |
| 696 | **HALLUX** <sub>dev.blvkware/hallux</sub> | `A` | **82/100** | 6 | 85% | 93% | 62% | 290 tok |
| 697 | **ubi.fun** <sub>fun.ubi/mcp</sub> | `A` | **82/100** | 25 | 96% | 91% | 62% | 360 tok |
| 698 | [**ComOS Federation Gateway**](https://github.com/ComOS-Federation/comos-mcp) <sub>com.comos-federation/gateway</sub> | `A` | **82/100** | 17 | 89% | 89% | 61% | 428 tok |
| 699 | [**Call Me**](https://github.com/radres/call-me) <sub>com.callmemcp/call-me</sub> | `A` | **82/100** | 9 | 85% | 93% | 60% | 392 tok |
| 700 | [**rundata.re · La Réunion 974 en direct**](https://github.com/rundata-re/rundata) <sub>re.rundata/temps-reel</sub> | `A` | **82/100** | 31 | 92% | 86% | 60% | 314 tok |
| 701 | **BI LO 2026 Agent Hub** <sub>com.bilo2026/hub</sub> | `A` | **82/100** | 7 | 95% | 85% | 58% | 344 tok |
| 702 | **Shieldbook – EU Cyber Resilience Act \(CRA\), SBOM** <sub>com.ppftec/shieldbook</sub> | `A` | **82/100** | 9 | 94% | 87% | 58% | 384 tok |
| 703 | [**io.github.ShieldZCash/swap-mcp**](https://github.com/ShieldZCash/shieldz-swap-mcp) | `A` | **82/100** | 5 | 94% | 85% | 58% | 408 tok |
| 704 | **District Listings** <sub>com.district-hq/listings</sub> | `A` | **82/100** | 3 | 97% | 85% | 57% | 367 tok |
| 705 | [**BotShelf Vampire: free prompts, skills and AI teams**](https://github.com/BotShelfVampire/botshelf-mcp) <sub>com.botshelfvampire/botshelf</sub> | `A` | **82/100** | 4 | 98% | 85% | 55% | 334 tok |
| 706 | [**Clunkyard**](https://github.com/slepp/azimuth-arena) <sub>com.clunkyard/clunkyard</sub> | `A` | **82/100** | 11 | 91% | 92% | 55% | 441 tok |
| 707 | [**Syracuse Company News**](https://github.com/1145-am/syracuse-mcp-server) <sub>io.github.1145-am/syracuse-mcp-server</sub> | `A` | **82/100** | 4 | 95% | 89% | 54% | 700 tok |
| 708 | [**AgentSearch \(hosted, free\)**](https://github.com/agentsearchhq-coder/agentsearch-mcp) <sub>com.agentsearchhq/search</sub> | `A` | **82/100** | 6 | 98% | 85% | 53% | 318 tok |
| 709 | [**Miami Black SUV**](https://github.com/GDACS-droid/miami-black-suv-mcp) <sub>com.blacksuvmiami/miami-black-suv</sub> | `A` | **82/100** | 3 | 93% | 90% | 53% | 953 tok |
| 710 | **Tax Compass — Japan tax rules by date** <sub>com.cyclixagents/japan-tax-rules</sub> | `A` | **82/100** | 16 | 96% | 86% | 53% | 423 tok |
| 711 | [**AgentSearch \(agentsearchhq.com\)**](https://github.com/agentsearchhq-coder/agentsearch-mcp) <sub>io.github.agentsearchhq-coder/agentsearch-mcp</sub> | `A` | **82/100** | 6 | 98% | 85% | 53% | 318 tok |
| 712 | [**Biohacking Kompakt**](https://github.com/phoeser/biohacking-kompakt) <sub>de.biohackingkompakt/biohacking-kompakt</sub> | `A` | **82/100** | 16 | 98% | 85% | 51% | 459 tok |
| 713 | [**Achromat Machine Operational Memory**](https://github.com/achromat-ai/achromat-mcp-server) <sub>ai.achromat/mcp-server</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 536 tok |
| 714 | [**LaunchCheck x402**](https://github.com/apolito53/launchcheck-x402) <sub>io.github.apolito53/launchcheck-x402</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 524 tok |
| 715 | **ISRC music copyright proof, Bitcoin timestamp \(ProofProfile, paid\)** <sub>it.proofprofile/isrc-music-copyright-proof-bitcoin</sub> | `A` | **82/100** | 3 | 100% | 85% | 50% | 416 tok |
| 716 | **ProofProfile evidence \(paid proof, free name search\)** <sub>it.proofprofile/proofit</sub> | `A` | **82/100** | 3 | 100% | 85% | 50% | 416 tok |
| 717 | **ProofProfile evidence \(free name search\)** <sub>it.proofprofile/proofit-free</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 385 tok |
| 718 | **Better Llama — Chile, Colombia, Peru and Mexico data** <sub>com.betterllama/chile-data</sub> | `A` | **82/100** | 15 | 100% | 92% | 39% | 658 tok |
| 719 | [**PlaylistExchange**](https://github.com/PlaylistExchange/playlistexchange) <sub>io.github.PlaylistExchange/playlistexchange</sub> | `A` | **81/100** | 6 | 77% | 100% | 93% | 86 tok |
| 720 | **Allooloo Issuer News** <sub>io.github.allooloo/getissuernews</sub> | `A` | **81/100** | 8 | 62% | 100% | 87% | 111 tok |
| 721 | **Babelii-Diofis** <sub>net.diofis/babelii</sub> | `A` | **81/100** | 10 | 78% | 91% | 72% | 262 tok |
| 722 | **SCRIPTMASTERLABS — SwapGate** <sub>com.scriptmasterlabs/swapgate</sub> | `A` | **81/100** | 1 | 70% | 100% | 70% | 197 tok |
| 723 | **Pipeline DAG Map** <sub>io.sslip.149-56-208-69/pipeline-dag-map</sub> | `A` | **81/100** | 1 | 70% | 100% | 70% | 190 tok |
| 724 | **askWheat** <sub>org.plantdatabases/askwheat</sub> | `A` | **81/100** | 68 | 80% | 90% | 70% | 235 tok |
| 725 | **Andes Protocol - Chilean issuers \(CMF\)** <sub>com.andesprotocol/cmf</sub> | `A` | **81/100** | 7 | 86% | 85% | 67% | 259 tok |
| 726 | **AstraNL** <sub>com.astranl/mcp</sub> | `A` | **81/100** | 41 | 87% | 90% | 67% | 285 tok |
| 727 | **Fyug \(hosted\)** <sub>fm.fyug/mcp</sub> | `A` | **81/100** | 14 | 78% | 95% | 67% | 260 tok |
| 728 | [**ai·rete·rag**](https://github.com/zaharajabeen13-create/ai-rete-rag-mcp) <sub>com.ai-rete-rag/ai-rete-rag-mcp</sub> | `A` | **81/100** | 10 | 84% | 90% | 66% | 339 tok |
| 729 | **OpenSouk** <sub>ai.opensouk/agent</sub> | `A` | **81/100** | 26 | 88% | 88% | 61% | 347 tok |
| 730 | **HALPII Tax ID** <sub>com.halpii/latam-tax-api</sub> | `A` | **81/100** | 6 | 90% | 85% | 60% | 494 tok |
| 731 | **Mitoyens, pesticides près de chez vous** <sub>fr.mitoyens/pesticides</sub> | `A` | **81/100** | 9 | 92% | 85% | 59% | 295 tok |
| 732 | [**alalanet guard — check before you install**](https://github.com/alalanet/alalanet-agent) <sub>com.alalanet/guard</sub> | `A` | **81/100** | 7 | 90% | 87% | 58% | 347 tok |
| 733 | **Homonia** <sub>net.homonia/homonia</sub> | `A` | **81/100** | 41 | 97% | 91% | 58% | 376 tok |
| 734 | **R3** <sub>org.r3js/r3</sub> | `A` | **81/100** | 80 | 93% | 87% | 57% | 398 tok |
| 735 | **Brief &amp; Proof** <sub>site.chatgpt.hklilinjie.brief-and-proof-lab/brief-and-proof-ppc-reporting</sub> | `A` | **81/100** | 3 | 80% | 100% | 57% | 327 tok |
| 736 | **GetMovely** <sub>uk.co.getmovely/getmovely</sub> | `A` | **81/100** | 24 | 91% | 86% | 57% | 381 tok |
| 737 | **Find MCP - Agentage MCP Directory** <sub>io.agentage/find-mcp</sub> | `A` | **81/100** | 3 | 90% | 90% | 55% | 399 tok |
| 738 | [**Hermoso**](https://github.com/hermoso-ai/hermoso) <sub>io.github.hermoso-ai/hermoso</sub> | `A` | **81/100** | 216 | 93% | 89% | 55% | 615 tok |
| 739 | [**issued.live**](https://github.com/tuxxin/mcp) <sub>live.issued/issued</sub> | `A` | **81/100** | 15 | 93% | 85% | 55% | 383 tok |
| 740 | [**Agent Data Tools: Speech to text and text to speech**](https://github.com/Nutshell2000/agent-data-tools) <sub>io.github.Nutshell2000/agent-data-tools-voice</sub> | `A` | **81/100** | 10 | 95% | 85% | 54% | 355 tok |
| 741 | **EuBinder – EU rules for online shops** <sub>com.ppftec/eubinder</sub> | `A` | **81/100** | 6 | 97% | 85% | 53% | 578 tok |
| 742 | [**dev.pdfops/pdfops-mcp**](https://github.com/pdfops/pdfops-mcp) | `A` | **81/100** | 23 | 93% | 88% | 53% | 510 tok |
| 743 | **Polystate** <sub>io.polystate/mcp</sub> | `A` | **81/100** | 16 | 96% | 85% | 51% | 463 tok |
| 744 | **Quantum Atlas Stripe X402 Agent Payment Hub** <sub>xyz.quantumatlas/x402-payment-hub</sub> | `A` | **81/100** | 13 | 97% | 85% | 51% | 424 tok |
| 745 | **Bee Wholesale - outils du revendeur** <sub>com.bee-wholesale/outils-revendeur</sub> | `A` | **81/100** | 3 | 97% | 85% | 50% | 404 tok |
| 746 | [**Kineticist**](https://github.com/colinize/kineticist-mcp) <sub>com.kineticist/mcp-server</sub> | `A` | **81/100** | 10 | 92% | 90% | 50% | 458 tok |
| 747 | [**Spanish Top Tech Companies**](https://github.com/pugarte7/spanish-top-tech-companies) <sub>io.github.pugarte7/spanish-top-tech-companies</sub> | `A` | **81/100** | 8 | 93% | 91% | 50% | 458 tok |
| 748 | [**DelegAIze Agent Check**](https://github.com/toasternet/delegaize-mcp) <sub>io.github.toasternet/delegaize-agenten-check</sub> | `A` | **81/100** | 2 | 98% | 85% | 50% | 435 tok |
| 749 | **DualSoft AAS &amp; PLC \(DS Studio\)** <sub>ai.dualsoft/aas</sub> | `A` | **81/100** | 10 | 97% | 87% | 48% | 482 tok |
| 750 | [**FreightUtils MCP Server**](https://github.com/SoapyRED/freightutils-mcp) <sub>io.github.SoapyRED/freightutils</sub> | `A` | **81/100** | 27 | 98% | 86% | 48% | 721 tok |
| 751 | [**Apify External Business Intelligence MCP Server**](https://github.com/wonderpick/apify-b2b-ecom-automation-kit) <sub>io.github.wonderpick/apify-b2b-ecom-automation-kit</sub> | `A` | **81/100** | 8 | 100% | 85% | 48% | 510 tok |
| 752 | [**Vietnam Payroll and Tax Calculator**](https://github.com/since98vn/vietnam-mcp-servers) <sub>vn.since98/vietnam-payroll</sub> | `A` | **81/100** | 9 | 98% | 88% | 45% | 526 tok |
| 753 | [**Miramo**](https://github.com/miramolabs/mcp) <sub>fr.miramo/mcp</sub> | `A` | **81/100** | 27 | 99% | 88% | 43% | 697 tok |
| 754 | **Man of Many** <sub>com.manofmany/mcp</sub> | `A` | **80/100** | 12 | 76% | 91% | 73% | 195 tok |
| 755 | [**Quidli Connect**](https://github.com/Quidli/connect-mcp) <sub>io.github.Quidli/connect-mcp</sub> | `A` | **80/100** | 14 | 86% | 97% | 73% | 269 tok |
| 756 | [**SizeMyFile**](https://github.com/ankitsharma-tech/sizemyfile-agents) <sub>com.sizemyfile/tools</sub> | `A` | **80/100** | 72 | 71% | 96% | 72% | 220 tok |
| 757 | [**MM Nutrition — Food Diary &amp; Nutrient Tracker**](https://github.com/MyselfHamza/mm-nutrition-mcp) <sub>io.github.MyselfHamza/mm-nutrition</sub> | `A` | **80/100** | 11 | 80% | 95% | 70% | 1502 tok |
| 758 | **Park Graph** <sub>com.parkgraph/mcp</sub> | `A` | **80/100** | 9 | 97% | 88% | 63% | 334 tok |
| 759 | [**Australian Economic Data \(ABS, RBA &amp; APRA\)**](https://github.com/AnthonyPuggs/ausecon-mcp-server) <sub>io.github.AnthonyPuggs/ausecon-mcp-server</sub> | `A` | **80/100** | 14 | 76% | 96% | 63% | 335 tok |
| 760 | [**Modelglass**](https://github.com/Modelglass/modelglass-vscode) <sub>io.github.Modelglass/modelglass</sub> | `A` | **80/100** | 7 | 91% | 89% | 63% | 329 tok |
| 761 | **Flipvo: licenses, entities, NPI, OFAC and OIG screens, carriers, OSHA, drive times** <sub>io.github.stea4lth/flipvo-agent-tools</sub> | `A` | **80/100** | 13 | 80% | 92% | 63% | 372 tok |
| 762 | [**DataPulse**](https://github.com/r3dz4r/datapulse-my) <sub>io.github.r3dz4r/datapulse-my</sub> | `A` | **80/100** | 19 | 91% | 85% | 58% | 318 tok |
| 763 | [**GoldSeam**](https://github.com/AcademyOne-Inc/GoldSeam) <sub>com.ksaworks/goldseam</sub> | `A` | **80/100** | 115 | 91% | 88% | 56% | 452 tok |
| 764 | **com.valksor/anglo** | `A` | **80/100** | 4 | 89% | 89% | 55% | 424 tok |
| 765 | [**Megido: niche, competitor and traffic research on sites with observed revenue**](https://github.com/megido-io/megido-mcp) <sub>io.megido/observed-revenue-market-research</sub> | `A` | **80/100** | 13 | 93% | 85% | 53% | 528 tok |
| 766 | **MiniMindsLab MCP Tools** <sub>com.minimindslab.mcp/tools</sub> | `A` | **80/100** | 17 | 93% | 100% | 51% | 356 tok |
| 767 | [**Ad-o-matic Free Mobile App Cross-Promotion**](https://github.com/ad-o-matic/ad-o-matic-sdk) <sub>com.ad-o-matic/adomatic</sub> | `A` | **80/100** | 4 | 95% | 85% | 50% | 495 tok |
| 768 | **TF Rooms** <sub>com.tfrooms/tf-rooms</sub> | `A` | **80/100** | 8 | 94% | 85% | 50% | 426 tok |
| 769 | **My Star Letter: charts and compatibility** <sub>com.mystarletter/human-design-chart</sub> | `A` | **80/100** | 12 | 97% | 85% | 48% | 476 tok |
| 770 | [**Zalo Business Reference \(ZBS Template Message, OA\)**](https://github.com/since98vn/vietnam-mcp-servers) <sub>vn.since98/zalo-business-reference</sub> | `A` | **80/100** | 7 | 97% | 87% | 44% | 584 tok |
| 771 | **Fitralo** <sub>com.fitralo/carriers</sub> | `A` | **80/100** | 3 | 100% | 85% | 43% | 562 tok |
| 772 | [**Ariadne Nexus Provenance &amp; Underwriting MCP**](https://github.com/dotlink-ops/nexus-core) <sub>com.ariadnenexus/mcp-server</sub> | `A` | **80/100** | 7 | 100% | 85% | 41% | 594 tok |
| 773 | **FDA Device and Drug Shortage Data \(openFDA\)** <sub>com.digitalbusinessportal/fda-regulatory</sub> | `B` | **79/100** | 4 | 80% | 85% | 70% | 240 tok |
| 774 | **LadderKit** <sub>io.github.ladderkit/hub-kb</sub> | `B` | **79/100** | 2 | 75% | 93% | 65% | 467 tok |
| 775 | **askBrassica** <sub>org.plantdatabases/askbrassica</sub> | `B` | **79/100** | 49 | 79% | 88% | 65% | 263 tok |
| 776 | **Marketgenius** <sub>app.marketgenius/mcp</sub> | `B` | **79/100** | 17 | 91% | 94% | 64% | 298 tok |
| 777 | [**WorldIP.io**](https://github.com/tuxxin/worldip-sdk) <sub>io.worldip/worldip</sub> | `B` | **79/100** | 2 | 85% | 85% | 60% | 259 tok |
| 778 | **com.qconsultai/qconsul-booking** | `B` | **79/100** | 6 | 88% | 85% | 57% | 316 tok |
| 779 | [**TWZRD Agent Intelligence**](https://github.com/twzrd-sol/twzrd-trust) <sub>xyz.twzrd.intel/twzrd-agent-intel</sub> | `B` | **79/100** | 22 | 87% | 90% | 56% | 388 tok |
| 780 | [**OrcaLayer MCP**](https://github.com/orcalayer/orcalayer-mcp) <sub>io.github.orcalayer/orcalayer-mcp</sub> | `B` | **79/100** | 5 | 87% | 88% | 54% | 434 tok |
| 781 | **Stock Expert AI Research** <sub>com.stockexpertai/research</sub> | `B` | **79/100** | 5 | 92% | 85% | 50% | 440 tok |
| 782 | [**readfetch**](https://github.com/readfetch/mcp-x402-proxy) <sub>com.readfetch/mcp-x402-proxy</sub> | `B` | **79/100** | 15 | 93% | 86% | 49% | 579 tok |
| 783 | [**nanoodle**](https://github.com/nanoodlecom/nanoodle-mcp) <sub>io.github.nanoodlecom/nanoodle-mcp</sub> | `B` | **79/100** | 15 | 97% | 85% | 45% | 549 tok |
| 784 | **Herofab marketplace image rules** <sub>app.herofab/marketplace-image-rules</sub> | `B` | **79/100** | 3 | 100% | 85% | 37% | 608 tok |
| 785 | **Commlo commute network** <sub>com.commlo/commute-network</sub> | `B` | **79/100** | 4 | 90% | 100% | 30% | 900 tok |
| 786 | [**whenship**](https://github.com/HamedShams/whenship) <sub>io.github.HamedShams/whenship</sub> | `B` | **79/100** | 4 | 97% | 93% | 30% | 1385 tok |
| 787 | **StatuteWire** <sub>com.statutewire/psv</sub> | `B` | **78/100** | 8 | 84% | 91% | 74% | 214 tok |
| 788 | **askPulse** <sub>org.plantdatabases/askpulse</sub> | `B` | **78/100** | 35 | 78% | 88% | 65% | 268 tok |
| 789 | [**SwarmMemo**](https://github.com/Hugo0/swarmmemo) <sub>com.swarmmemo/bulletin</sub> | `B` | **78/100** | 22 | 91% | 88% | 59% | 358 tok |
| 790 | [**FORUM**](https://github.com/forumtrust/forum-verify) <sub>ai.forumtrust/forum</sub> | `B` | **78/100** | 3 | 87% | 85% | 57% | 349 tok |
| 791 | **AstraNL Dutch contractor and counterparty check** <sub>com.astranl/counterparty-nl</sub> | `B` | **78/100** | 4 | 88% | 85% | 55% | 403 tok |
| 792 | [**Reevi: find buyers for exporters**](https://github.com/reevol-ai/mcp) <sub>ai.reevi/find-buyers</sub> | `B` | **78/100** | 1 | 90% | 85% | 50% | 417 tok |
| 793 | [**alalanet — check before your agent installs, connects or pays**](https://github.com/alalanet/alalanet-agent) <sub>com.alalanet/check</sub> | `B` | **78/100** | 8 | 90% | 85% | 50% | 461 tok |
| 794 | **MyPivots Daily Notes** <sub>com.mypivots/mypivots</sub> | `B` | **78/100** | 1 | 90% | 85% | 50% | 534 tok |
| 795 | **Agent Verifier — Independent Number Verification** <sub>io.github.zenoix888/agent-verifier</sub> | `B` | **78/100** | 1 | 90% | 85% | 50% | 418 tok |
| 796 | [**SnapFolda UCP MCP**](https://github.com/echochaofan/snapfolda-ucp-mcp) <sub>io.github.echochaofan/snapfolda-ucp-mcp</sub> | `B` | **78/100** | 14 | 89% | 87% | 46% | 1120 tok |
| 797 | **app.sallim/korea-stay** | `B` | **78/100** | 4 | 86% | 93% | 45% | 488 tok |
| 798 | [**Senzing**](https://github.com/Senzing/mcp) <sub>com.senzing/mcp</sub> | `B` | **78/100** | 13 | 92% | 86% | 45% | 804 tok |
| 799 | **MCP Checkup** <sub>com.mcpcheckup/mcp</sub> | `B` | **78/100** | 6 | 95% | 85% | 43% | 614 tok |
| 800 | **AwesomeVideo: video captions &amp; subtitles** <sub>com.awesomevideoeditor/awesomevideo</sub> | `B` | **78/100** | 27 | 98% | 86% | 42% | 928 tok |
| 801 | [**DogPolicies**](https://github.com/xultrax-web/dogpolicies-mcp) <sub>io.github.xultrax-web/dogpolicies-mcp</sub> | `B` | **78/100** | 18 | 100% | 85% | 41% | 698 tok |
| 802 | [**Mahonia**](https://github.com/ryankiley/mahonia) <sub>app.mahonia/mahonia</sub> | `B` | **78/100** | 6 | 97% | 85% | 40% | 1267 tok |
| 803 | **Sieve** <sub>com.clawhard/sieve</sub> | `B` | **78/100** | 2 | 95% | 85% | 40% | 763 tok |
| 804 | [**FlickDirect Movie MCP Server**](https://github.com/nrose101/flickdirect-movie-mcp-server) <sub>com.flickdirect.connect/flickdirect-connect</sub> | `B` | **78/100** | 2 | 95% | 85% | 40% | 859 tok |
| 805 | [**io.github.snayyar00/webability**](https://github.com/snayyar00/webability-mcp) | `B` | **78/100** | 17 | 96% | 90% | 39% | 707 tok |
| 806 | **SeekSat** <sub>com.seeksat/seeksat</sub> | `B` | **78/100** | 11 | 97% | 85% | 37% | 843 tok |
| 807 | **Norman: Start a company** <sub>finance.norman/formation-planner</sub> | `B` | **78/100** | 3 | 98% | 85% | 37% | 604 tok |
| 808 | [**Startup Valuation MCP Server**](https://github.com/simonmak-ascent/startup-valuation) <sub>com.ascent-partners/startup-valuation</sub> | `B` | **78/100** | 14 | 100% | 85% | 36% | 840 tok |
| 809 | **FACTA** <sub>xyz.factahq/facta</sub> | `B` | **78/100** | 7 | 100% | 85% | 36% | 896 tok |
| 810 | [**io.github.cyanheads/internet-archive-mcp-server**](https://github.com/cyanheads/internet-archive-mcp-server) | `B` | **78/100** | 5 | 100% | 85% | 34% | 955 tok |
| 811 | [**OptimToken: AI and Compute Economics**](https://github.com/OptimNow/ai-pricing-hub-mcp) <sub>io.github.OptimNow/ai-pricing-hub</sub> | `B` | **78/100** | 8 | 100% | 85% | 33% | 793 tok |
| 812 | [**MCP.AI connector for Unicred \(unofficial\)**](https://github.com/mcp-dir/unicred-mcp) <sub>io.github.mcp-dir/unicred-mcp</sub> | `B` | **77/100** | 25 | 75% | 90% | 66% | 359 tok |
| 813 | [**MCP.AI connector for Woop \(unofficial\)**](https://github.com/mcp-dir/woop-mcp) <sub>io.github.mcp-dir/woop-mcp</sub> | `B` | **77/100** | 25 | 75% | 90% | 66% | 359 tok |
| 814 | [**MCP.AI connector for XP \(unofficial\)**](https://github.com/mcp-dir/xp-mcp) <sub>io.github.mcp-dir/xp-mcp</sub> | `B` | **77/100** | 25 | 75% | 90% | 66% | 359 tok |
| 815 | **Clawhard Studio** <sub>com.clawhard/studio</sub> | `B` | **77/100** | 38 | 93% | 87% | 54% | 416 tok |
| 816 | [**Stackin**](https://github.com/stackin-io/stackin-mcp-plugin) <sub>io.github.stackin-io/stackin</sub> | `B` | **77/100** | 35 | 77% | 92% | 54% | 472 tok |
| 817 | [**DC Hub: Data Center &amp; Energy Intelligence**](https://github.com/azmartone67/dchub-mcp-server) <sub>cloud.dchub/mcp-server</sub> | `B` | **77/100** | 98 | 92% | 85% | 51% | 457 tok |
| 818 | **Peskio** <sub>com.peskio/peskio</sub> | `B` | **77/100** | 6 | 97% | 88% | 47% | 520 tok |
| 819 | [**Valuein — SEC EDGAR Fundamentals &amp; Smart-Money Data**](https://github.com/valuein/valuein) <sub>biz.valuein/mcp</sub> | `B` | **77/100** | 55 | 98% | 86% | 42% | 723 tok |
| 820 | [**VocalStack**](https://github.com/vocalstack/mcp) <sub>com.vocalstack/mcp</sub> | `B` | **77/100** | 15 | 93% | 85% | 42% | 732 tok |
| 821 | **4words** <sub>land.aletheia/4words</sub> | `B` | **77/100** | 15 | 100% | 85% | 41% | 619 tok |
| 822 | **Senaro Personal Finance** <sub>ai.senaro/personal-finance</sub> | `B` | **77/100** | 19 | 98% | 85% | 34% | 1967 tok |
| 823 | **Go2Trip** <sub>com.go2trip.mcp/go2trip</sub> | `B` | **77/100** | 1 | 100% | 85% | 30% | 686 tok |
| 824 | **Foundplay** <sub>io.foundplay/foundplay</sub> | `B` | **77/100** | 1 | 100% | 85% | 30% | 796 tok |
| 825 | [**AutoTuneMPC**](https://github.com/kaiden8/autotunempc-examples) <sub>com.autotunempc/autotunempc</sub> | `B` | **76/100** | 10 | 89% | 91% | 55% | 887 tok |
| 826 | [**Brontide agent arena**](https://github.com/beeswaxpat/brontide-agent-kit) <sub>live.brontide/mech-arena</sub> | `B` | **76/100** | 11 | 95% | 95% | 52% | 729 tok |
| 827 | **MIDAS CIVIL NX tools \(MIDAS IT Europe\)** <sub>com.midasiteurope/civil-nx</sub> | `B` | **76/100** | 92 | 89% | 86% | 44% | 952 tok |
| 828 | [**Persuasion Taxonomy**](https://github.com/Otha-Labs/persuasion-mcp) <sub>com.coppica/persuasion-taxonomy</sub> | `B` | **76/100** | 9 | 94% | 87% | 43% | 648 tok |
| 829 | **FineRx** <sub>com.finerxfinder/finerx</sub> | `B` | **75/100** | 19 | 69% | 89% | 66% | 301 tok |
| 830 | **SeedViews** <sub>com.seedviews/seedviews</sub> | `B` | **75/100** | 6 | 92% | 90% | 59% | 428 tok |
| 831 | [**Ourway – Camino de Santiago**](https://github.com/contactoourway-art/ourway-mcp) <sub>travel.ourway/camino-de-santiago</sub> | `B` | **75/100** | 14 | 80% | 86% | 51% | 620 tok |
| 832 | **com.valksor/interslavic** | `B` | **75/100** | 3 | 83% | 85% | 50% | 477 tok |
| 833 | [**Autoview**](https://github.com/autoview-com/mcp) <sub>com.autoview/mcp</sub> | `B` | **75/100** | 19 | 94% | 85% | 45% | 754 tok |
| 834 | [**AI business value framework**](https://github.com/Craig-Horton/ai-bvf) <sub>io.github.Craig-Horton/aibvf-mcp</sub> | `B` | **75/100** | 13 | 96% | 85% | 38% | 1219 tok |
| 835 | **SCRIPTMASTERLABS — Token Verdict** <sub>com.scriptmasterlabs/token-verdict</sub> | `B` | **74/100** | 11 | 93% | 89% | 74% | 189 tok |
| 836 | **workman.rent — humans for real-world checks** <sub>rent.workman/workman</sub> | `B` | **74/100** | 5 | 88% | 88% | 69% | 200 tok |
| 837 | **N9T2 XRPL Agent Gateway** <sub>com.n9t2/xrpl-agent-gateway</sub> | `B` | **74/100** | 22 | 77% | 86% | 54% | 375 tok |
| 838 | [**app.sallim/korea-realty**](https://github.com/sallim-app/korea-realty) | `B` | **74/100** | 57 | 81% | 88% | 45% | 627 tok |
| 839 | **Tallyho** <sub>so.tallyho/tallyho</sub> | `B` | **74/100** | 4 | 87% | 85% | 40% | 838 tok |
| 840 | [**PayStage — x402 payment safety and spend policy**](https://github.com/base-buzz/paystage) <sub>io.github.base-buzz/x402-payment-safety</sub> | `B` | **73/100** | 10 | 67% | 85% | 66% | 269 tok |
| 841 | [**PG1 Sovereign Threat Intelligence**](https://github.com/Project-Gifted1/pg1-ai-agent) <sub>io.github.Project-Gifted1/pg1-threat-intel</sub> | `B` | **73/100** | 22 | 92% | 86% | 53% | 420 tok |
| 842 | [**Cloud FinOps Skill &amp; MCP**](https://github.com/OptimNow/cloud-finops-skills) <sub>io.github.OptimNow/cloud-finops</sub> | `B` | **73/100** | 7 | 77% | 85% | 50% | 573 tok |
| 843 | **SIBIDZ** <sub>io.sibidz/sibidz</sub> | `B` | **73/100** | 14 | 68% | 96% | 48% | 1152 tok |
| 844 | [**app.sallim/contract-compass**](https://github.com/sallim-app/contract-compass) | `B` | **73/100** | 11 | 89% | 85% | 34% | 958 tok |
| 845 | [**AtomicViz Diagrams**](https://github.com/briandiloreto/AtomicViz) <sub>com.atomicviz/diagrams</sub> | `B` | **73/100** | 1 | 90% | 85% | 30% | 1005 tok |
| 846 | **Glowjakt** <sub>se.glowjakt/glowjakt</sub> | `B` | **72/100** | 7 | 67% | 87% | 61% | 321 tok |
| 847 | **Split the Tab** <sub>ai.splitthetab/split-the-tab</sub> | `B` | **72/100** | 6 | 85% | 90% | 57% | 407 tok |
| 848 | **CraterView.ai** <sub>ai.craterview/mcp</sub> | `B` | **72/100** | 15 | 92% | 88% | 52% | 580 tok |
| 849 | [**PlanningLedger**](https://github.com/ifor/planningledger-mcp) <sub>com.planningledger/planningledger</sub> | `B` | **72/100** | 14 | 80% | 85% | 41% | 999 tok |
| 850 | **EU Payments Law** <sub>eu.paymentslaw/legislation</sub> | `B` | **71/100** | 16 | 71% | 90% | 53% | 432 tok |
| 851 | [**Workeey Quote Links**](https://github.com/yossigrunwald/workeey-quote-links) <sub>com.workeey/quote-links</sub> | `B` | **71/100** | 6 | 97% | 85% | 40% | 1126 tok |
| 852 | [**Pond**](https://github.com/Smitten/pond-skill) <sub>com.datingpond/pond</sub> | `C` | **67/100** | 12 | 94% | 88% | 47% | 696 tok |
| 853 | **Neumann** <sub>io.github.Kromatic-Innovation/neumann</sub> | `C` | **64/100** | 17 | 85% | 85% | 37% | 1163 tok |
| 854 | [**io.github.Kromatic-Innovation/fermi**](https://github.com/Kromatic-Innovation/fermi) | `C` | **62/100** | 7 | 74% | 85% | 41% | 769 tok |

</details>

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
