# MCP Benchmark

[![CI](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml)
[![MCP Registry Servers](https://img.shields.io/badge/MCP_Registry-1611_Servers-blueviolet)](registry/servers/)
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
**1611 servers · 25628 tools · last sync 2026-11-23.**
Last run: 71303 registry entries scanned, 42468 auth-free remote candidates, 937 returned tools, 546 required authentication, 17 failed (probe cap reached).
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
| 4 | **ae.brainy/brainy-48** | `A+` | **96/100** | 3 | 100% | 100% | 85% | 123 tok |
| 5 | **Wallet Doctor** <sub>com.manhourplan/wallet-doctor</sub> | `A+` | **96/100** | 5 | 100% | 100% | 85% | 118 tok |
| 6 | **トゥーンエル** <sub>com.tooneru/manga</sub> | `A+` | **96/100** | 6 | 100% | 100% | 85% | 128 tok |
| 7 | **Tally food nutrients** <sub>io.github.martindochamp/tally-foods</sub> | `A+` | **96/100** | 2 | 100% | 100% | 85% | 136 tok |
| 8 | [**PageDigest — Web Page Summarizer &amp; Structured Extractor**](https://github.com/SuBai520-QWQ/pagedigest) <sub>io.github.SuBai520-QWQ/pagedigest</sub> | `A+` | **96/100** | 1 | 100% | 100% | 85% | 134 tok |
| 9 | **What Brandon Thinks** <sub>net.whatbrandonthinks/chat-report</sub> | `A+` | **96/100** | 3 | 100% | 100% | 85% | 132 tok |
| 10 | [**Alshhbaa Brassware — نحاسيات الشهباء**](https://github.com/Alshhbaa/alshhbaa-agent-kit) <sub>com.alshhbaa/server</sub> | `A+` | **96/100** | 6 | 100% | 100% | 83% | 129 tok |
| 11 | **com.faultydata/faultydata** | `A+` | **95/100** | 5 | 88% | 100% | 100% | 64 tok |
| 12 | **RankCert** <sub>com.rankcert/rankcert</sub> | `A+` | **95/100** | 4 | 90% | 100% | 96% | 81 tok |
| 13 | [**Wisely Arcade Games**](https://github.com/SaqibNaseer404/wiselyarcade) <sub>io.github.SaqibNaseer404/wiselyarcade</sub> | `A+` | **95/100** | 6 | 90% | 100% | 95% | 81 tok |
| 14 | **stash** <sub>org.duckdns.agentnotes/stash</sub> | `A+` | **95/100** | 3 | 90% | 100% | 95% | 105 tok |
| 15 | [**BOTERNITY**](https://github.com/botcraftmarket/boternity-mcp) <sub>com.boternity/boternity</sub> | `A+` | **95/100** | 44 | 93% | 100% | 91% | 95 tok |
| 16 | **Vigilena** <sub>com.vigilena/japan-companies</sub> | `A+` | **95/100** | 5 | 94% | 100% | 91% | 94 tok |
| 17 | **GStars docs** <sub>dev.gstars/gstars-docs</sub> | `A+` | **95/100** | 3 | 93% | 100% | 90% | 100 tok |
| 18 | [**Agri Prices \(MCP Africa Master Class\)**](https://github.com/AppimateSA/mcp-masterclass) <sub>io.github.luthandomaqondo-95/agri-prices</sub> | `A+` | **95/100** | 3 | 93% | 100% | 90% | 93 tok |
| 19 | **Preptoo** <sub>fr.preptoo/admissions</sub> | `A+` | **95/100** | 4 | 95% | 100% | 89% | 88 tok |
| 20 | [**PDF Dark — Invert PDF Colors &amp; Dark Mode**](https://github.com/1436941541/pdf-dark) <sub>io.github.1436941541/pdf-dark</sub> | `A+` | **95/100** | 4 | 95% | 100% | 89% | 115 tok |
| 21 | [**Part Guide AI Catalog**](https://github.com/pat-the-cat-cat/parts.guide) <sub>io.github.pat-the-cat-cat/part-guide-ai</sub> | `A+` | **95/100** | 4 | 95% | 100% | 89% | 91 tok |
| 22 | [**대전한콕 Daejeon Hankok**](https://github.com/iamhuman-cheolheelee/daejeon-hankok-mcp) <sub>com.ferrorium.daejeon/hankok</sub> | `A+` | **95/100** | 11 | 95% | 100% | 88% | 124 tok |
| 23 | [**BPJ First-Party AI Tools**](https://github.com/f-tiger/agi-site) <sub>io.github.f-tiger/bpj-ai-tools</sub> | `A+` | **95/100** | 500 | 96% | 100% | 86% | 116 tok |
| 24 | **Rosmaryn** <sub>app.rosmaryn/encyclopedia</sub> | `A+` | **95/100** | 3 | 98% | 100% | 85% | 124 tok |
| 25 | [**Alshhbaa Brassware Store — نحاسيات الشهباء**](https://github.com/Alshhbaa/alshhbaa-agent-kit) <sub>com.alshhbaa.shop/server</sub> | `A+` | **95/100** | 4 | 98% | 100% | 85% | 143 tok |

<details>
<summary><b>▶ Click to expand all 1611 ranked MCP servers (Ranks 26–1611)</b></summary>

| Rank | MCP Server | Grade | TQI Score | Tools | Strictness | Density | Efficiency | Avg Tokens/Tool |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 26 | [**Motion Brew**](https://github.com/easiblu/motion-brew-components) <sub>com.motion-brew/motion-brew</sub> | `A+` | **95/100** | 5 | 96% | 100% | 85% | 142 tok |
| 27 | **SchedJoules Calendars** <sub>com.schedjoules/calendars</sub> | `A+` | **95/100** | 3 | 97% | 100% | 85% | 121 tok |
| 28 | **com.videodataapi/youtube-transcript-video-search-mcp** | `A+` | **95/100** | 8 | 96% | 100% | 85% | 124 tok |
| 29 | **TurboStarter Docs MCP** <sub>dev.turbostarter/docs</sub> | `A+` | **95/100** | 2 | 95% | 100% | 85% | 123 tok |
| 30 | **SchedJoules Calendars** <sub>io.github.schedjoules/calendars</sub> | `A+` | **95/100** | 3 | 97% | 100% | 85% | 121 tok |
| 31 | **Firmoteka** <sub>ru.firmoteka/companies</sub> | `A+` | **95/100** | 3 | 97% | 100% | 85% | 94 tok |
| 32 | **KOREA WAVE NEWS** <sub>io.github.lifenplanner/koreawavenews</sub> | `A+` | **95/100** | 9 | 98% | 100% | 82% | 143 tok |
| 33 | **Zhannett** <sub>com.zhannett/zhannett</sub> | `A+` | **95/100** | 10 | 100% | 100% | 81% | 164 tok |
| 34 | **com.archlooks/projects** | `A+` | **95/100** | 3 | 100% | 100% | 80% | 141 tok |
| 35 | **io.free3d/models** | `A+` | **95/100** | 3 | 100% | 100% | 80% | 138 tok |
| 36 | **Toronto Walk** <sub>io.github.howardchenghuang-dotcom/torontowalk</sub> | `A+` | **95/100** | 3 | 100% | 100% | 80% | 133 tok |
| 37 | [**Sound Cocktail**](https://github.com/indulgers/sound-lab) <sub>io.github.indulgers/sound-cocktail</sub> | `A+` | **95/100** | 3 | 100% | 100% | 80% | 143 tok |
| 38 | [**Yiditu 易．地圖 — I Ching Geo Feng Shui**](https://github.com/kingbbs/yiditu-mcp) <sub>io.github.kingbbs/yiditu-mcp</sub> | `A+` | **95/100** | 3 | 100% | 100% | 80% | 157 tok |
| 39 | [**FilmCraft — Video Editing Assistant MCP**](https://github.com/yueliao11/mcp-servers) <sub>tech.filmcraft/video-editing-assistant</sub> | `A+` | **95/100** | 3 | 100% | 100% | 80% | 148 tok |
| 40 | **LogToLast Trading Journal &amp; Playbook** <sub>com.logtolast/trading-journal</sub> | `A+` | **95/100** | 2 | 100% | 100% | 78% | 159 tok |
| 41 | **Aethel: AI interview facts and free practice** <sub>pro.aethel/company-interviews</sub> | `A+` | **95/100** | 4 | 100% | 100% | 78% | 145 tok |
| 42 | **Wake** <sub>ai.wakeagents/wake</sub> | `A+` | **94/100** | 4 | 88% | 100% | 96% | 75 tok |
| 43 | **NeatAnswer** <sub>com.neatanswer/mcp</sub> | `A+` | **94/100** | 13 | 90% | 98% | 94% | 85 tok |
| 44 | [**LingYi Tools**](https://github.com/Jascenn/lingyi-tools-mcp) <sub>io.github.Jascenn/lingyi-tools-mcp</sub> | `A+` | **94/100** | 5 | 88% | 100% | 94% | 76 tok |
| 45 | **KA-Forge** <sub>cn.ctaning/ka-forge</sub> | `A+` | **94/100** | 2 | 90% | 100% | 93% | 57 tok |
| 46 | **AgentPayStore Bridge** <sub>com.agentpaystore/muskox3</sub> | `A+` | **94/100** | 2 | 90% | 100% | 93% | 88 tok |
| 47 | [**x402 Crediting Swarm**](https://github.com/kwizzlesurp10-ctrl/x402-crediting-swarm) <sub>io.github.kwizzlesurp10-ctrl/x402-crediting-swarm</sub> | `A+` | **94/100** | 4 | 90% | 100% | 93% | 94 tok |
| 48 | [**Mecenai**](https://github.com/MonoVarTon/mecenai) <sub>io.github.MonoVarTon/mecenai</sub> | `A+` | **94/100** | 4 | 90% | 100% | 93% | 87 tok |
| 49 | **IdentityHood** <sub>org.identityhood/registry</sub> | `A+` | **94/100** | 2 | 90% | 100% | 93% | 93 tok |
| 50 | **BuyExamVouchers** <sub>com.buyexamvouchers/exam-vouchers</sub> | `A+` | **94/100** | 5 | 92% | 100% | 91% | 90 tok |
| 51 | **Talval** <sub>com.talval/research</sub> | `A+` | **94/100** | 7 | 90% | 100% | 91% | 93 tok |
| 52 | **Company Framework** <sub>io.github.CompanyFramework/connector</sub> | `A+` | **94/100** | 10 | 91% | 100% | 91% | 102 tok |
| 53 | **KasaFox Fault Code Registry** <sub>com.kasafox/registry</sub> | `A+` | **94/100** | 3 | 90% | 100% | 90% | 107 tok |
| 54 | [**Dosidal: prescription medicine records for AI agents**](https://github.com/Dosidal/dosidal-agents) <sub>io.github.Dosidal/dosidal</sub> | `A+` | **94/100** | 3 | 92% | 100% | 90% | 118 tok |
| 55 | **Data Center Index** <sub>ai.datacenterindex/datacenterindex</sub> | `A+` | **94/100** | 8 | 93% | 100% | 89% | 110 tok |
| 56 | [**GoTokenMe**](https://github.com/openmediainc/gotokenme-mini) <sub>com.gotokenme/gotokenme</sub> | `A+` | **94/100** | 4 | 93% | 100% | 89% | 112 tok |
| 57 | **Didymus Lab Bible Context** <sub>com.didymuslab/bible-context</sub> | `A+` | **94/100** | 5 | 94% | 100% | 88% | 103 tok |
| 58 | **AI Agent Market \(experiment\)** <sub>io.github.agenticsettleio/agent-market</sub> | `A+` | **94/100** | 16 | 93% | 100% | 88% | 110 tok |
| 59 | **critics.press** <sub>press.critics/critics-press</sub> | `A+` | **94/100** | 5 | 92% | 100% | 88% | 97 tok |
| 60 | **GlobalWay \(出海通\)** <sub>ai.globalway/globalway</sub> | `A+` | **94/100** | 6 | 94% | 100% | 85% | 136 tok |
| 61 | [**RandomColorGenerator — Accessible Palette &amp; WCAG MCP**](https://github.com/yueliao11/mcp-servers) <sub>app.randomcolorgenerator/color-palette</sub> | `A+` | **94/100** | 2 | 95% | 100% | 85% | 122 tok |
| 62 | **DNSFix** <sub>com.dnsfix/dnsfix</sub> | `A+` | **94/100** | 14 | 94% | 100% | 85% | 129 tok |
| 63 | **Funciara.com guides** <sub>com.funciara/docs</sub> | `A+` | **94/100** | 2 | 95% | 100% | 85% | 129 tok |
| 64 | **Clearsignal Labs Token Scam Screen** <sub>dev.workers.grokbot2020.token-scam-screen/screener</sub> | `A+` | **94/100** | 4 | 95% | 100% | 85% | 103 tok |
| 65 | [**Drafto**](https://github.com/JakubAnderwald/drafto) <sub>eu.drafto/mcp</sub> | `A+` | **94/100** | 11 | 96% | 98% | 85% | 122 tok |
| 66 | [**Holdsport \(SportMember\) MCP by usefulapi**](https://github.com/m190/usefulapi-mcp) <sub>io.usefulapi/holdsport</sub> | `A+` | **94/100** | 11 | 95% | 100% | 85% | 124 tok |
| 67 | **Pools Arena** <sub>markets.pools/arena</sub> | `A+` | **94/100** | 6 | 94% | 100% | 85% | 126 tok |
| 68 | [**Classical Pharmacopoeia: Ayurvedic, Unani, Siddha, Greco-Roman Formulary Records**](https://github.com/kawal393/apex-tatva-guardian) <sub>store.apex-tat-va.www/ashwagandha-triphala-brahmi-shilajit-guggulu-rasayana-bhasma-arishta-kvatha-ghrita-dosha-contraindication-toxicology-herbalism-greco-roman-hermetic-kemetic-spagyric</sub> | `A+` | **94/100** | 6 | 93% | 100% | 85% | 126 tok |
| 69 | [**Herb &amp; Supplement Safety Index by Health Goal: Sleep, Anxiety, Immunity, Liver**](https://github.com/kawal393/apex-tatva-guardian) <sub>store.apex-tat-va.www/sleep-anxiety-stress-memory-immunity-digestion-liver-thyroid-respiratory-energy-joint-pain-women-hair-skin-diabetes-herb-safety</sub> | `A+` | **94/100** | 6 | 93% | 100% | 85% | 126 tok |
| 70 | [**Cormak.app**](https://github.com/ecabpro-sudo/cormak-mcp) <sub>app.cormak/mcp-server</sub> | `A+` | **94/100** | 16 | 95% | 100% | 83% | 126 tok |
| 71 | **Recall365 — Global Product Recalls** <sub>io.recall365/recall365</sub> | `A+` | **94/100** | 6 | 95% | 100% | 83% | 149 tok |
| 72 | **OpenMortgage** <sub>tech.thecompound.openmortgage/openmortgage</sub> | `A+` | **94/100** | 16 | 95% | 100% | 83% | 139 tok |
| 73 | **에브리원 빌더 — Korean IT/AI news &amp; media comparison** <sub>io.github.sw-woo/everyone-builder</sub> | `A+` | **94/100** | 6 | 97% | 100% | 82% | 145 tok |
| 74 | [**First names in Switzerland**](https://gitlab.com/opendata.ch/vornamen) <sub>ch.opendata/vornamen</sub> | `A+` | **94/100** | 4 | 98% | 100% | 81% | 160 tok |
| 75 | **OpenCollege** <sub>tech.thecompound.opencollege/opencollege</sub> | `A+` | **94/100** | 12 | 97% | 100% | 81% | 158 tok |
| 76 | **MamaChoice** <sub>il.co.mamachoice/guides</sub> | `A+` | **94/100** | 3 | 97% | 100% | 80% | 138 tok |
| 77 | [**Sudan Atlas**](https://github.com/aminshennan/sudan-atlas) <sub>io.github.aminshennan/sudan-atlas</sub> | `A+` | **94/100** | 6 | 97% | 100% | 80% | 159 tok |
| 78 | [**ClaudeCodeMods Registry MCP**](https://github.com/yueliao11/mcp-servers) <sub>net.claudecodemods/mods-registry</sub> | `A+` | **94/100** | 3 | 97% | 100% | 80% | 118 tok |
| 79 | **PRO11 Pro Clubs** <sub>net.pro11/pro-clubs</sub> | `A+` | **94/100** | 9 | 96% | 100% | 80% | 160 tok |
| 80 | [**AIML Rounds**](https://github.com/datawithsuman/datawithsuman.github.io) <sub>com.aimlrounds/aimlrounds</sub> | `A+` | **94/100** | 8 | 96% | 100% | 79% | 168 tok |
| 81 | **Jerome Handy Wash** <sub>com.jeromehandywash/site</sub> | `A+` | **94/100** | 9 | 100% | 98% | 79% | 180 tok |
| 82 | **FREN** <sub>com.frenyap/fren</sub> | `A+` | **94/100** | 4 | 98% | 100% | 78% | 183 tok |
| 83 | **Global TripX** <sub>com.globaltripx/tripx</sub> | `A+` | **94/100** | 3 | 100% | 100% | 75% | 163 tok |
| 84 | **Shangri Lingua** <sub>com.shangrilingua/study</sub> | `A+` | **94/100** | 6 | 100% | 100% | 75% | 184 tok |
| 85 | [**Startups Españolas press desk**](https://github.com/martinschenk/startups-espanolas-mcp) <sub>es.startups-espanolas/notas-de-prensa</sub> | `A+` | **94/100** | 5 | 100% | 100% | 75% | 181 tok |
| 86 | **AI for alle: priser og fakta om AI-værktøjer** <sub>dk.ai-foralle/ai-foralle</sub> | `A+` | **94/100** | 6 | 100% | 100% | 74% | 209 tok |
| 87 | **Stacja Neapol** <sub>pl.stacjaneapol/stacja-neapol</sub> | `A+` | **94/100** | 4 | 100% | 100% | 74% | 181 tok |
| 88 | [**TraBot Market Intel**](https://github.com/trabotpro/trabot) <sub>io.github.trabotpro/trabot-intel</sub> | `A+` | **93/100** | 8 | 81% | 100% | 100% | 46 tok |
| 89 | [**TAG Lending Group**](https://github.com/taglendinggroup-LLC/agent-api) <sub>com.taglendinggroup/agent-api</sub> | `A+` | **93/100** | 4 | 85% | 100% | 96% | 83 tok |
| 90 | **PackDesk** <sub>com.kasafox/packdesk</sub> | `A+` | **93/100** | 3 | 85% | 100% | 95% | 80 tok |
| 91 | **OLA Vital Center** <sub>com.olavital/ola</sub> | `A+` | **93/100** | 3 | 87% | 100% | 95% | 67 tok |
| 92 | **PickZeal** <sub>com.pickzeal/pickzeal</sub> | `A+` | **93/100** | 3 | 87% | 100% | 95% | 83 tok |
| 93 | [**Video Transcript MCP for TikTok, Instagram Reels &amp; YouTube — Mira**](https://github.com/Mira-AI-Tools/mira-mcp) <sub>io.github.Mira-AI-Tools/mira</sub> | `A+` | **93/100** | 3 | 87% | 100% | 95% | 92 tok |
| 94 | **Agents Index** <sub>org.agentsindex/agentsindex</sub> | `A+` | **93/100** | 3 | 87% | 100% | 95% | 85 tok |
| 95 | **CoHostBnB** <sub>xyz.cohostbnb/cohostbnb</sub> | `A+` | **93/100** | 6 | 85% | 100% | 95% | 83 tok |
| 96 | **WaistHeart** <sub>com.waistheart/waistheart</sub> | `A+` | **93/100** | 5 | 86% | 100% | 94% | 92 tok |
| 97 | **toolgiv \(툴기브\)** <sub>io.github.Flowish/toolgiv</sub> | `A+` | **93/100** | 8 | 86% | 100% | 94% | 78 tok |
| 98 | **ai.agentapihub/douyin-xiaohongshu-rednote-social-scraper-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 99 | **ai.agentapihub/facebook-meta-google-tiktok-ads-library-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 100 | **ai.agentapihub/threads-instagram-truthsocial-linkedin-posts-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 101 | **Elite Soccer Academy** <sub>com.eliteaiempire/soccer</sub> | `A+` | **93/100** | 4 | 87% | 100% | 93% | 117 tok |
| 102 | **碳小六 · AI 原生节能降碳平台** <sub>com.lingtanlian/carbon-six</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 93 tok |
| 103 | **Willy Kammerer · Versicherungsmakler für Hebammen** <sub>de.hebammenversicherungen/site</sub> | `A+` | **93/100** | 4 | 88% | 100% | 93% | 86 tok |
| 104 | [**SancturAI**](https://github.com/Elessiah/SancturAI) <sub>io.github.Elessiah/sancturai</sub> | `A+` | **93/100** | 33 | 88% | 99% | 93% | 79 tok |
| 105 | **AIWebsiteMaker** <sub>org.aiwebsitemaker/aiwebsitemaker</sub> | `A+` | **93/100** | 4 | 87% | 100% | 93% | 117 tok |
| 106 | **El truco del Guardián** <sub>tech.bestiario/truco</sub> | `A+` | **93/100** | 8 | 88% | 100% | 93% | 74 tok |
| 107 | **AISchoolPro** <sub>xyz.aischoolpro/aischoolpro</sub> | `A+` | **93/100** | 4 | 87% | 100% | 93% | 117 tok |
| 108 | **RisingTests AI Request Desk** <sub>com.risingtests/mcp</sub> | `A+` | **93/100** | 9 | 89% | 100% | 92% | 104 tok |
| 109 | [**htmlweb.ru — справочники и проверки для AI**](https://github.com/kdg22/mcp-htmlweb) <sub>ru.htmlweb/mcp</sub> | `A+` | **93/100** | 9 | 88% | 100% | 92% | 87 tok |
| 110 | **Scrubline** <sub>com.eliteaiempire/scrubline</sub> | `A+` | **93/100** | 5 | 87% | 100% | 91% | 118 tok |
| 111 | **Look4Expo — Global B2B Trade Show Directory** <sub>com.look4expo/expo</sub> | `A+` | **93/100** | 5 | 88% | 100% | 91% | 83 tok |
| 112 | [**API Key Safety \(education only\)**](https://github.com/Duffey234/api-key-safety-mcp) <sub>io.github.Duffey234/api-key-safety-mcp</sub> | `A+` | **93/100** | 5 | 88% | 100% | 91% | 97 tok |
| 113 | **Filmagic** <sub>app.filmagic/filmagic</sub> | `A+` | **93/100** | 3 | 90% | 100% | 90% | 115 tok |
| 114 | [**undocsend docs**](https://github.com/itseasyco/undocsend-agents) <sub>com.undocsend/docs</sub> | `A+` | **93/100** | 3 | 90% | 100% | 90% | 112 tok |
| 115 | **Jiggicons** <sub>io.github.adrianabelarde/jiggicons</sub> | `A+` | **93/100** | 3 | 89% | 100% | 90% | 111 tok |
| 116 | **CoinVet** <sub>dev.pages.coinvet/coinvet</sub> | `A+` | **93/100** | 7 | 89% | 100% | 89% | 97 tok |
| 117 | [**HarbiFırsat Deals \(Turkey\)**](https://github.com/erangun/harbifirsat) <sub>io.github.erangun/harbifirsat</sub> | `A+` | **93/100** | 7 | 91% | 100% | 87% | 109 tok |
| 118 | [**Elementum Design System MCP**](https://github.com/pinguxx/Elementum) <sub>io.github.pinguxx/elementum</sub> | `A+` | **93/100** | 11 | 91% | 100% | 86% | 106 tok |
| 119 | **com.cheapxapi/social-creator-instagram-twitter-profile-mcp** | `A+` | **93/100** | 31 | 91% | 100% | 85% | 118 tok |
| 120 | **com.cheapxapi/social-video-transcript-search-tweets-mcp** | `A+` | **93/100** | 31 | 91% | 100% | 85% | 118 tok |
| 121 | **com.cheapxapi/x-trending-topics-twitter-tweets-mcp** | `A+` | **93/100** | 31 | 91% | 100% | 85% | 118 tok |
| 122 | **Dr. AI Hub** <sub>com.draihub/mcp</sub> | `A+` | **93/100** | 7 | 92% | 100% | 85% | 130 tok |
| 123 | [**FeedMCP — Social Media Data MCP**](https://github.com/FeedMCP/feedmcp) <sub>com.feedmcp/mcp</sub> | `A+` | **93/100** | 4 | 90% | 100% | 85% | 110 tok |
| 124 | **Jobs Every Hour** <sub>com.jobseveryhour/jobs</sub> | `A+` | **93/100** | 2 | 92% | 100% | 85% | 125 tok |
| 125 | [**Lazynext AI Slop Checker**](https://github.com/lazynextai/Autonomous-AI-Company-OS) <sub>com.lazynext/ai-slop-checker</sub> | `A+` | **93/100** | 7 | 94% | 98% | 85% | 132 tok |
| 126 | **Magetoo Tage Mage** <sub>fr.magetoo/tage-mage</sub> | `A+` | **93/100** | 5 | 92% | 100% | 85% | 126 tok |
| 127 | **1322 API Docs** <sub>io.1322/docs</sub> | `A+` | **93/100** | 2 | 90% | 100% | 85% | 130 tok |
| 128 | **DJs Andorra** <sub>io.github.djs-ad/djs-andorra</sub> | `A+` | **93/100** | 4 | 93% | 100% | 85% | 132 tok |
| 129 | [**EU Cloud**](https://github.com/moveinfra/eu-cloud-mcp) <sub>io.github.moveinfra/eu-cloud-mcp</sub> | `A+` | **93/100** | 4 | 93% | 100% | 85% | 136 tok |
| 130 | **Omics Health Chile** <sub>io.github.omicshealth2025-ship-it/omics-health</sub> | `A+` | **93/100** | 7 | 91% | 100% | 85% | 121 tok |
| 131 | [**io.github.pablo-albaladejo/kaiord**](https://github.com/pablo-albaladejo/kaiord) | `A+` | **93/100** | 8 | 93% | 100% | 85% | 119 tok |
| 132 | [**ParadeDB**](https://github.com/paradedb/website) <sub>io.github.paradedb/mcp</sub> | `A+` | **93/100** | 4 | 93% | 100% | 85% | 111 tok |
| 133 | [**UX Search: Government Auction Prices**](https://github.com/ux-llc/uxsearch) <sub>io.github.ux-llc/uxsearch</sub> | `A+` | **93/100** | 6 | 92% | 100% | 85% | 118 tok |
| 134 | **FlowGate Launch Verdict** <sub>io.github.VAAS-X/flowgate</sub> | `A+` | **93/100** | 3 | 93% | 100% | 85% | 127 tok |
| 135 | **nosebleed.si guides** <sub>si.nosebleed/guides</sub> | `A+` | **93/100** | 3 | 93% | 100% | 85% | 112 tok |
| 136 | [**Ricky Moorhouse's blog**](https://github.com/rickymoorhouse/blog) <sub>uk.rickymoorhouse/blog</sub> | `A+` | **93/100** | 3 | 92% | 100% | 85% | 112 tok |
| 137 | **Solana Signal** <sub>cyou.solsignal/solana-signal</sub> | `A+` | **93/100** | 10 | 93% | 100% | 84% | 120 tok |
| 138 | **GitPicker** <sub>io.github.LAOSP9/gitpicker</sub> | `A+` | **93/100** | 14 | 91% | 100% | 84% | 133 tok |
| 139 | **Foodeist** <sub>com.foodeist/restaurants</sub> | `A+` | **93/100** | 8 | 94% | 100% | 83% | 145 tok |
| 140 | **Still Roach token check** <sub>com.stillroach/token-check</sub> | `A+` | **93/100** | 7 | 93% | 100% | 83% | 127 tok |
| 141 | **Racketeer Pre-Trade Checks \(Solana\)** <sub>dev.workers.racketeer.racketeer-botapi/pretrade</sub> | `A+` | **93/100** | 12 | 95% | 98% | 83% | 132 tok |
| 142 | [**Lightning Wallet**](https://github.com/lightningfaucet/lightning-wallet-mcp) <sub>io.github.lightningfaucet/lightning-wallet-mcp</sub> | `A+` | **93/100** | 86 | 94% | 98% | 83% | 141 tok |
| 143 | [**Ask Bestie Beauty**](https://github.com/pat-the-cat-cat/parts.guide) <sub>io.github.pat-the-cat-cat/askbestie-beauty</sub> | `A+` | **93/100** | 8 | 94% | 100% | 83% | 143 tok |
| 144 | **DietCamera Calorie Dictionary** <sub>com.doinglab.dietcamera/calorie</sub> | `A+` | **93/100** | 5 | 95% | 100% | 82% | 134 tok |
| 145 | **com.forumdataapi/hacker-news-reddit-forum-search-mcp** | `A+` | **93/100** | 9 | 94% | 100% | 82% | 135 tok |
| 146 | **Leaxor** <sub>com.leaxor/leaxor</sub> | `A+` | **93/100** | 7 | 94% | 98% | 82% | 166 tok |
| 147 | [**NorCal Pitch**](https://github.com/Creed5252/wordpress-directory-mcp) <sub>com.norcalpitch/norcal-pitch</sub> | `A+` | **93/100** | 6 | 93% | 100% | 82% | 171 tok |
| 148 | [**PNW Pitch**](https://github.com/Creed5252/wordpress-directory-mcp) <sub>com.pnwpitch/pnw-pitch</sub> | `A+` | **93/100** | 6 | 93% | 100% | 82% | 173 tok |
| 149 | [**SoCal Pitch**](https://github.com/Creed5252/wordpress-directory-mcp) <sub>com.socalpitch/socal-pitch</sub> | `A+` | **93/100** | 6 | 93% | 100% | 82% | 172 tok |
| 150 | [**Southwest Pitch**](https://github.com/Creed5252/wordpress-directory-mcp) <sub>com.southwestpitch/southwest-pitch</sub> | `A+` | **93/100** | 6 | 93% | 100% | 82% | 175 tok |
| 151 | **Registry Pages** <sub>io.github.jamessvn/registry-pages</sub> | `A+` | **93/100** | 10 | 93% | 100% | 82% | 134 tok |
| 152 | **myIO Documentation** <sub>hu.myio/docs</sub> | `A+` | **93/100** | 4 | 95% | 100% | 81% | 147 tok |
| 153 | [**Pubroot**](https://github.com/buildngrowsv/pubroot-website) <sub>io.github.buildngrowsv/pubroot</sub> | `A+` | **93/100** | 9 | 93% | 100% | 81% | 141 tok |
| 154 | [**Part Guide**](https://github.com/pat-the-cat-cat/parts.guide) <sub>io.github.pat-the-cat-cat/part-guide</sub> | `A+` | **93/100** | 8 | 95% | 100% | 81% | 147 tok |
| 155 | [**Vinylscout — Dutch Vinyl LP &amp; Record Player Prices**](https://github.com/techbybuild/vinylscout-mcp) <sub>io.github.techbybuild/vinylscout-mcp</sub> | `A+` | **93/100** | 7 | 94% | 100% | 81% | 147 tok |
| 156 | **HotWhatHow** <sub>com.hotwhathow/prices</sub> | `A+` | **93/100** | 3 | 100% | 95% | 80% | 146 tok |
| 157 | **Nubbo** <sub>app.nubbo/nubbo</sub> | `A+` | **93/100** | 30 | 96% | 100% | 79% | 163 tok |
| 158 | **com.shopdataapi/amazon-product-walmart-shopify-mcp** | `A+` | **93/100** | 16 | 94% | 100% | 79% | 147 tok |
| 159 | **PresiTracker2027** <sub>io.github.fcroiseaux/presitracker2027</sub> | `A+` | **93/100** | 11 | 96% | 100% | 79% | 187 tok |
| 160 | [**Innovative Workspace**](https://github.com/jwayne554/iw-mcp) <sub>space.innovativework/iw-mcp</sub> | `A+` | **93/100** | 10 | 96% | 100% | 79% | 179 tok |
| 161 | **HomeReady Australia rules** <sub>au.com.homereadyaustralia/rules</sub> | `A+` | **93/100** | 2 | 95% | 100% | 78% | 159 tok |
| 162 | **Mindful Give Charity Finder** <sub>com.mindfulgive/charities</sub> | `A+` | **93/100** | 2 | 95% | 100% | 78% | 168 tok |
| 163 | **SinoAgriTech Crop &amp; AgriTech** <sub>com.sinoagritech/research-mcp</sub> | `A+` | **93/100** | 4 | 95% | 100% | 78% | 177 tok |
| 164 | **SinoAILab AI &amp; Robotics** <sub>com.sinoailab/research-mcp</sub> | `A+` | **93/100** | 4 | 95% | 100% | 78% | 176 tok |
| 165 | **SinoBioData Biomedical Research** <sub>com.sinobiodata/research-mcp</sub> | `A+` | **93/100** | 4 | 95% | 100% | 78% | 176 tok |
| 166 | **SinoGreenTech Clean Energy** <sub>com.sinogreentech/research-mcp</sub> | `A+` | **93/100** | 4 | 95% | 100% | 78% | 177 tok |
| 167 | **SinoTechIntel Materials &amp; Tech** <sub>com.sinotechintel/research-mcp</sub> | `A+` | **93/100** | 4 | 95% | 100% | 78% | 178 tok |
| 168 | **Openship** <sub>org.openship/software-alternatives</sub> | `A+` | **93/100** | 2 | 95% | 100% | 78% | 141 tok |
| 169 | **Absurdly Obvious** <sub>com.absurdlyobvious/games</sub> | `A+` | **93/100** | 5 | 96% | 100% | 76% | 173 tok |
| 170 | **Résidences Montréal** <sub>com.residences-montreal/residences</sub> | `A+` | **93/100** | 7 | 97% | 100% | 76% | 200 tok |
| 171 | [**Viventii Events, Leisure, POIs, Tickets &amp; Ticket Resale**](https://github.com/borsty2103/viventii-mcp) <sub>io.github.borsty2103/viventii-mcp</sub> | `A+` | **93/100** | 16 | 99% | 100% | 76% | 183 tok |
| 172 | [**com.apple-rag/mcp-server**](https://github.com/BingoWon/apple-rag-mcp) | `A+` | **93/100** | 3 | 97% | 100% | 75% | 203 tok |
| 173 | **TallyForge Quant Signals** <sub>dev.fly.tallyforge-quant-signals/quant-signals</sub> | `A+` | **93/100** | 6 | 98% | 100% | 75% | 166 tok |
| 174 | **GeoLocale** <sub>io.geolocale/geolocale</sub> | `A+` | **93/100** | 3 | 97% | 100% | 75% | 191 tok |
| 175 | [**MaCalculatriceEnLigne**](https://github.com/tresor4k/macalc-mcp) <sub>io.github.tresor4k/macalc-mcp</sub> | `A+` | **93/100** | 17 | 99% | 98% | 75% | 194 tok |
| 176 | [**Shiptrail**](https://github.com/npqk4vrzsx-gif/shiptrail-mcp) <sub>io.shiptrail/shiptrail</sub> | `A+` | **93/100** | 9 | 100% | 98% | 75% | 208 tok |
| 177 | **ME3** <sub>app.me3/me3</sub> | `A+` | **93/100** | 4 | 98% | 100% | 74% | 220 tok |
| 178 | **Pira Experience** <sub>com.piraexperience/pira-experience</sub> | `A+` | **93/100** | 6 | 100% | 98% | 74% | 202 tok |
| 179 | **Nanukamachi Tourism Portal** <sub>io.github.hks409/nanukamachi</sub> | `A+` | **93/100** | 7 | 97% | 100% | 74% | 183 tok |
| 180 | **X PrimeFlow** <sub>trade.xprimeflow/mcp</sub> | `A+` | **93/100** | 10 | 100% | 100% | 73% | 194 tok |
| 181 | **SSTracker free youth training** <sub>app.sstracker/sstracker</sub> | `A+` | **93/100** | 4 | 99% | 100% | 70% | 223 tok |
| 182 | **Daily Tonic by Coach Moshiur** <sub>com.coachmoshiur/daily-tonic</sub> | `A+` | **93/100** | 2 | 100% | 100% | 70% | 165 tok |
| 183 | **Expiry Tracker storage guide** <sub>com.getexpirytracker/storage-guide</sub> | `A+` | **93/100** | 2 | 100% | 100% | 70% | 202 tok |
| 184 | [**Wigoo**](https://github.com/youssbim/wigoo-mcp) <sub>com.getwigoo/wigoo</sub> | `A+` | **93/100** | 4 | 100% | 100% | 70% | 222 tok |
| 185 | **Injection Check** <sub>com.injectioncheck/injectioncheck</sub> | `A+` | **93/100** | 1 | 100% | 100% | 70% | 197 tok |
| 186 | **SolarDesk** <sub>com.kasafox/solardesk</sub> | `A+` | **93/100** | 1 | 100% | 100% | 70% | 186 tok |
| 187 | [**Model Salt**](https://github.com/modelsalt/model-salt) <sub>com.modelsalt/model-salt</sub> | `A+` | **93/100** | 1 | 100% | 100% | 70% | 221 tok |
| 188 | **GStars** <sub>dev.gstars/gstars</sub> | `A+` | **93/100** | 4 | 100% | 100% | 70% | 219 tok |
| 189 | **AI Verified** <sub>io.aiverified/verify-business</sub> | `A+` | **93/100** | 1 | 100% | 100% | 70% | 162 tok |
| 190 | **Albert Tan Sin Hon Research Resource Agent** <sub>io.github.Albertito-AI/research-resource-agent</sub> | `A+` | **93/100** | 3 | 100% | 100% | 70% | 211 tok |
| 191 | [**DONVI108 Free Research Beta**](https://github.com/ho11-bit/donvi108-agent-skills) <sub>io.github.ho11-bit/donvi108-research</sub> | `A+` | **93/100** | 1 | 100% | 100% | 70% | 247 tok |
| 192 | [**Moedux — Diagnóstico Financeiro**](https://github.com/jhonnysabino/moedux-agent-tools) <sub>io.github.jhonnysabino/moedux</sub> | `A+` | **93/100** | 2 | 100% | 100% | 70% | 174 tok |
| 193 | **Swellwise** <sub>io.swellwise/forecast</sub> | `A+` | **93/100** | 3 | 100% | 100% | 70% | 217 tok |
| 194 | **PASSO** <sub>com.frenyap/passo</sub> | `A+` | **93/100** | 4 | 100% | 100% | 69% | 236 tok |
| 195 | [**io.github.f-tiger/hvac-btu-heat-klimaanlage**](https://github.com/f-tiger/agi-site) | `A+` | **93/100** | 500 | 99% | 100% | 69% | 230 tok |
| 196 | **Matdata – Swedish food composition data** <sub>se.matdata/matdata</sub> | `A+` | **93/100** | 5 | 100% | 100% | 69% | 215 tok |
| 197 | **AutoAlerto** <sub>com.autoalerto/mcp</sub> | `A+` | **92/100** | 2 | 80% | 100% | 100% | 79 tok |
| 198 | **Transcribe Audio to Text by Sum** <sub>com.sumtranscribe/sum-transcribe-audio-to-text</sub> | `A+` | **92/100** | 3 | 80% | 100% | 100% | 52 tok |
| 199 | [**ExMachina Weather Windows**](https://github.com/systems-exmachina/weather-windows-x402) <sub>io.github.systems-exmachina/weather-windows</sub> | `A+` | **92/100** | 1 | 80% | 100% | 100% | 68 tok |
| 200 | **RealCryptoCap** <sub>com.realcryptocap/realcryptocap</sub> | `A+` | **92/100** | 11 | 83% | 100% | 96% | 75 tok |
| 201 | [**Kongus Site MCP Server**](https://github.com/Kongus/site) <sub>io.github.Kongus/site</sub> | `A+` | **92/100** | 7 | 83% | 100% | 96% | 60 tok |
| 202 | **LegalDraft** <sub>xyz.legaldraft/legaldraft</sub> | `A+` | **92/100** | 7 | 84% | 100% | 96% | 94 tok |
| 203 | **WeShoal — free browser tools finder** <sub>com.weshoal/tools</sub> | `A+` | **92/100** | 5 | 84% | 100% | 94% | 96 tok |
| 204 | [**io.github.manteclaw/manteclaw-mcp-lite**](https://github.com/manteclaw/manteclaw-mcp-lite) | `A+` | **92/100** | 100 | 85% | 100% | 94% | 76 tok |
| 205 | **Bestiario** <sub>tech.bestiario/bestiario</sub> | `A+` | **92/100** | 5 | 84% | 100% | 94% | 70 tok |
| 206 | **mcp-audit — MCP static scan \(SARIF + CI\)** <sub>top.web3project/mcp-audit</sub> | `A+` | **92/100** | 5 | 88% | 96% | 94% | 70 tok |
| 207 | **Freedom Agent Mail** <sub>com.freedomagentmail/mail</sub> | `A+` | **92/100** | 6 | 85% | 100% | 93% | 99 tok |
| 208 | **New York Gates** <sub>io.github.igeo-websites/nygates.com</sub> | `A+` | **92/100** | 2 | 85% | 100% | 93% | 85 tok |
| 209 | [**MNOGO DENEG — pay-per-call crypto &amp; AI APIs \(x402\)**](https://github.com/makar-aibot/mnogo-deneg-x402) <sub>io.github.makar-aibot/mnogo-deneg</sub> | `A+` | **92/100** | 60 | 85% | 100% | 93% | 80 tok |
| 210 | [**GetArtCraft — Open-Source Rust Creative Suite MCP**](https://github.com/yueliao11/mcp-servers) <sub>net.getartcraft/rust-creative-suite</sub> | `A+` | **92/100** | 2 | 85% | 100% | 93% | 95 tok |
| 211 | **Agent Loopr** <sub>com.agentloopr/website</sub> | `A+` | **92/100** | 5 | 86% | 100% | 91% | 88 tok |
| 212 | **未定世界 · Agent World** <sub>xyz.400860/agent-world</sub> | `A+` | **92/100** | 12 | 86% | 100% | 91% | 105 tok |
| 213 | **App Store Rejection Help** <sub>com.mavenhandle/app-store-help</sub> | `A+` | **92/100** | 3 | 87% | 100% | 90% | 109 tok |
| 214 | [**MyPetDance**](https://github.com/ken-fs/mypetdance-mcp) <sub>com.mypetdance/templates</sub> | `A+` | **92/100** | 3 | 86% | 100% | 90% | 92 tok |
| 215 | **Volotel SkyWay – Cluj-Napoca Airport** <sub>eu.volotel/booking</sub> | `A+` | **92/100** | 3 | 87% | 100% | 90% | 115 tok |
| 216 | [**ArcanumFleet MCP Server**](https://github.com/LarynaB/arcanumfleet-mcp-server) <sub>io.github.LarynaB/arcanumfleet-mcp-server</sub> | `A+` | **92/100** | 13 | 87% | 100% | 90% | 87 tok |
| 217 | **Seenly** <sub>io.github.seenly721/seenly</sub> | `A+` | **92/100** | 3 | 87% | 100% | 90% | 113 tok |
| 218 | **Arki Chain** <sub>io.github.zhuhuo4374/arki-chain</sub> | `A+` | **92/100** | 3 | 87% | 100% | 90% | 89 tok |
| 219 | [**LeadSail — Software Growth Engine**](https://github.com/LeadSail/leadsail-io) <sub>io.leadsail.api/store-audit</sub> | `A+` | **92/100** | 3 | 87% | 100% | 90% | 103 tok |
| 220 | **Barcode Report** <sub>com.barcodereport/barcode-lookup</sub> | `A+` | **92/100** | 4 | 87% | 100% | 89% | 125 tok |
| 221 | [**uibrik**](https://github.com/Malay146/uibrik-mcp) <sub>com.uibrik/components</sub> | `A+` | **92/100** | 4 | 88% | 100% | 89% | 136 tok |
| 222 | [**VR.org VR / AR / XR Reader**](https://github.com/evanatpizzarobot/vr-org-mcp) <sub>org.vr/vr-mcp</sub> | `A+` | **92/100** | 11 | 86% | 100% | 89% | 110 tok |
| 223 | [**DealMonitor**](https://github.com/rwkaspar/dealmonitor) <sub>app.dealmonitor/dealmonitor</sub> | `A+` | **92/100** | 6 | 90% | 98% | 88% | 103 tok |
| 224 | [**ScamNav**](https://github.com/seo-seo/scamnav-site) <sub>com.scamnav/scamnav</sub> | `A+` | **92/100** | 5 | 88% | 100% | 88% | 121 tok |
| 225 | **Photo Warehouse Product Catalogue** <sub>nz.co.photowarehouse/catalogue</sub> | `A+` | **92/100** | 4 | 87% | 100% | 88% | 148 tok |
| 226 | **BrightKey Education Data** <sub>co.brightkey/education-data</sub> | `A+` | **92/100** | 8 | 88% | 100% | 87% | 113 tok |
| 227 | **GTA 6 Brands tracker** <sub>com.gta6brands/tracker</sub> | `A+` | **92/100** | 8 | 90% | 100% | 87% | 103 tok |
| 228 | **Velvet Companion AI** <sub>com.velvetcompanionai/velvet</sub> | `A+` | **92/100** | 7 | 89% | 100% | 87% | 132 tok |
| 229 | **UtilVet** <sub>dev.pages.utilvet/utilvet</sub> | `A+` | **92/100** | 17 | 89% | 100% | 87% | 120 tok |
| 230 | [**PcMasterRace GAMING**](https://github.com/spaumz/pcmr-gaming) <sub>io.github.spaumz/pcmasterrace-gaming</sub> | `A+` | **92/100** | 8 | 90% | 98% | 87% | 106 tok |
| 231 | [**PromptMentions**](https://github.com/jimbob1414/promptmentions-mcp) <sub>com.promptmentions/promptmentions</sub> | `A+` | **92/100** | 12 | 91% | 99% | 86% | 119 tok |
| 232 | **EuKreate Home Value** <sub>ai.eukollab/eukreate-home-value</sub> | `A+` | **92/100** | 1 | 90% | 100% | 85% | 160 tok |
| 233 | [**AI-TENDER — open procurements of Belarus**](https://github.com/Apex-prim/ai-tender-mcp) <sub>by.ai-tender/tenders</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 118 tok |
| 234 | **AllVisas** <sub>com.allvisas/visas</sub> | `A+` | **92/100** | 6 | 88% | 100% | 85% | 116 tok |
| 235 | **Agent Access Gateway \(research\)** <sub>com.claude-did-this/access-gateway</sub> | `A+` | **92/100** | 1 | 90% | 100% | 85% | 128 tok |
| 236 | [**ScentAI Fragrance Finder MCP**](https://github.com/yueliao11/mcp-servers) <sub>com.getscentai/fragrance-finder</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 115 tok |
| 237 | [**Storra for Brands**](https://github.com/storra-eng/storra-mcp) <sub>com.getstorra/brands</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 117 tok |
| 238 | [**Storra for Creators**](https://github.com/storra-eng/storra-mcp) <sub>com.getstorra/creators</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 125 tok |
| 239 | **Agent-Ready Scan** <sub>com.manhourplan/agent-ready-scan</sub> | `A+` | **92/100** | 1 | 90% | 100% | 85% | 153 tok |
| 240 | [**ClaimTrace**](https://github.com/mayamate26/claimtrace) <sub>com.mayamate/claimtrace</sub> | `A+` | **92/100** | 1 | 90% | 100% | 85% | 158 tok |
| 241 | **PartsTable** <sub>com.partstable/mcp</sub> | `A+` | **92/100** | 5 | 90% | 100% | 85% | 96 tok |
| 242 | **ColorType personality test** <sub>com.personality-test-free/colortype</sub> | `A+` | **92/100** | 4 | 89% | 100% | 85% | 120 tok |
| 243 | **Selfhost Recipes** <sub>com.selfhostrecipes/selfhost-recipes</sub> | `A+` | **92/100** | 4 | 89% | 100% | 85% | 131 tok |
| 244 | **Mechanic Atlas Auto Manual** <sub>com.us.mechanic/auto-manual</sub> | `A+` | **92/100** | 10 | 90% | 100% | 85% | 124 tok |
| 245 | **SolSignal Web Tools** <sub>cyou.solsignal/web-tools</sub> | `A+` | **92/100** | 4 | 89% | 100% | 85% | 115 tok |
| 246 | **DomainVet** <sub>dev.pages.domainvet/domainvet</sub> | `A+` | **92/100** | 7 | 90% | 100% | 85% | 111 tok |
| 247 | [**PlugRail JP Nutrition**](https://github.com/plugrail/servers) <sub>dev.plugrail/jp-nutrition</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 125 tok |
| 248 | **SkillU** <sub>dev.skillu/skillu</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 104 tok |
| 249 | [**EU Money**](https://github.com/kmate77-radar/eu-money-mcp) <sub>hu.eumoney/eu-money</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 131 tok |
| 250 | [**GEO &amp; SEO Readiness MCP \(v2.2\)**](https://github.com/alicexixi85/geo-seo-mcp-pro) <sub>io.github.alicexixi85/geo-seo-mcp-pro</sub> | `A+` | **92/100** | 2 | 90% | 100% | 85% | 128 tok |
| 251 | [**ooooOasis TSX Data**](https://github.com/oooooasis-fds/tsx-data) <sub>io.github.oooooasis-fds/tsx-data</sub> | `A+` | **92/100** | 5 | 88% | 100% | 85% | 110 tok |
| 252 | [**Jarvis Tools**](https://github.com/tony88pisa/jarvis-tools) <sub>io.github.tony88pisa/jarvis-tools</sub> | `A+` | **92/100** | 3 | 90% | 100% | 85% | 134 tok |
| 253 | **Assistant Hub** <sub>io.rmassistanthub/assistant-hub</sub> | `A+` | **92/100** | 14 | 90% | 99% | 85% | 123 tok |
| 254 | [**Poste Restante: a text adventure for AIs**](https://github.com/hplant6/poste-restante) <sub>me.itshenry/poste-restante</sub> | `A+` | **92/100** | 2 | 90% | 100% | 85% | 155 tok |
| 255 | [**MCP Check**](https://github.com/DcodeNischal/mcp-check) <sub>np.com.nischaldhakal/mcp-check</sub> | `A+` | **92/100** | 4 | 90% | 100% | 85% | 117 tok |
| 256 | **MakeMyContent** <sub>org.makemycontent/makemycontent</sub> | `A+` | **92/100** | 2 | 88% | 100% | 85% | 167 tok |
| 257 | [**GEO Optimizer — AI Search &amp; Robots.txt Audit**](https://github.com/yueliao11/mcp-servers) <sub>tech.geooptimizer/geo-audit</sub> | `A+` | **92/100** | 2 | 90% | 100% | 85% | 108 tok |
| 258 | **PriceGraph UK** <sub>uk.co.pricegraph/mcp</sub> | `A+` | **92/100** | 21 | 90% | 100% | 85% | 125 tok |
| 259 | **Agent Classifieds** <sub>dev.agentclassifieds/board</sub> | `A+` | **92/100** | 6 | 92% | 98% | 84% | 157 tok |
| 260 | [**Lookproof DNS, mail and TLS security checks**](https://github.com/lookproof/x402-examples) <sub>io.github.lookproof/lookproof-mcp</sub> | `A+` | **92/100** | 22 | 90% | 100% | 84% | 142 tok |
| 261 | [**copy.top**](https://github.com/copydottop/mcp) <sub>top.copy/mcp</sub> | `A+` | **92/100** | 16 | 91% | 100% | 84% | 142 tok |
| 262 | **Carfinity car marketplace** <sub>ai.carfinity/marketplace</sub> | `A+` | **92/100** | 7 | 90% | 100% | 83% | 144 tok |
| 263 | **Money Gotchas Rough Math** <sub>com.nofussblueprint/rough-math</sub> | `A+` | **92/100** | 6 | 92% | 100% | 83% | 142 tok |
| 264 | [**PokerAgile**](https://github.com/florianmousseau/pokeragile) <sub>io.github.florianmousseau/pokeragile</sub> | `A+` | **92/100** | 7 | 90% | 100% | 83% | 137 tok |
| 265 | **TradingLookup open data** <sub>io.github.tradinglookup/data</sub> | `A+` | **92/100** | 8 | 90% | 100% | 83% | 149 tok |
| 266 | **RDAP API** <sub>io.rdapapi/rdap</sub> | `A+` | **92/100** | 7 | 90% | 100% | 83% | 147 tok |
| 267 | [**草料二维码 · 扫码端 \(CaoLiao QR Code Scan-side\)**](https://github.com/caoliao/mcp) <sub>im.cli/caoliao-scan</sub> | `A+` | **92/100** | 5 | 92% | 100% | 82% | 133 tok |
| 268 | **Lexu** <sub>io.lexu/mcp</sub> | `A+` | **92/100** | 15 | 92% | 99% | 82% | 141 tok |
| 269 | [**AddSynapse Rooms**](https://github.com/SakkoulasGiannis/addsynapse-rooms) <sub>com.addsynapse/rooms</sub> | `A+` | **92/100** | 4 | 93% | 100% | 81% | 147 tok |
| 270 | **Postbye** <sub>com.postbye/postbye</sub> | `A+` | **92/100** | 4 | 90% | 100% | 81% | 141 tok |
| 271 | [**Weav**](https://github.com/dubdubdubco/weav-mcp-server) <sub>com.weav/mcp</sub> | `A+` | **92/100** | 48 | 92% | 99% | 81% | 153 tok |
| 272 | [**Global Metro Power Rankings**](https://github.com/ashwin-desikan/metro-power-rankings) <sub>org.citizenofnowhere.rankings/global-metro-power-rankings</sub> | `A+` | **92/100** | 8 | 91% | 100% | 81% | 135 tok |
| 273 | **IKANGAI Vibe Support** <sub>com.ikangai/vibe-support</sub> | `A+` | **92/100** | 6 | 93% | 100% | 80% | 125 tok |
| 274 | [**DiffCI**](https://github.com/DiffCI/core) <sub>io.github.DiffCI/diffci</sub> | `A+` | **92/100** | 3 | 93% | 100% | 80% | 131 tok |
| 275 | **AskFur pet devices \(pre-launch\)** <sub>io.github.howardchenghuang-dotcom/askfur</sub> | `A+` | **92/100** | 3 | 93% | 100% | 80% | 151 tok |
| 276 | [**EuroKYB**](https://github.com/clime-alertviz/eurokyb-mcp) <sub>com.alertviz/eurokyb-mcp</sub> | `A+` | **92/100** | 5 | 94% | 100% | 79% | 154 tok |
| 277 | **Markhaven** <sub>com.markhavenbrands/markhaven</sub> | `A+` | **92/100** | 5 | 92% | 100% | 79% | 174 tok |
| 278 | **Veritas Silicea art shop** <sub>dev.workers.veritas-silicea.veritas-silicea-shop/art</sub> | `A+` | **92/100** | 5 | 92% | 100% | 79% | 152 tok |
| 279 | [**Stofscout — Dutch Robot Vacuum Prices, Specs &amp; Parts**](https://github.com/techbybuild/stofscout-mcp) <sub>io.github.techbybuild/stofscout-mcp</sub> | `A+` | **92/100** | 6 | 93% | 100% | 79% | 189 tok |
| 280 | **ingilizce.io – English Vocabulary Video Tutor** <sub>io.ingilizce/vocabulary-video-tutor</sub> | `A+` | **92/100** | 5 | 94% | 100% | 79% | 146 tok |
| 281 | [**Sharekite**](https://github.com/Sharekite/sharekite-plugin) <sub>app.sharekite/sharekite</sub> | `A+` | **92/100** | 6 | 93% | 100% | 78% | 195 tok |
| 282 | [**PlugRail Japanese Calendar**](https://github.com/plugrail/servers) <sub>dev.plugrail/jp-calendar</sub> | `A+` | **92/100** | 4 | 93% | 100% | 78% | 188 tok |
| 283 | [**peerbox**](https://github.com/BukeLy/peerbox) <sub>io.github.BukeLy/peerbox</sub> | `A+` | **92/100** | 16 | 96% | 98% | 78% | 177 tok |
| 284 | **Climatch** <sub>io.github.burmanharry/climatch</sub> | `A+` | **92/100** | 9 | 95% | 100% | 78% | 187 tok |
| 285 | **Unicorn Screener** <sub>vc.unicornscreener/unicorn-screener</sub> | `A+` | **92/100** | 5 | 96% | 97% | 78% | 195 tok |
| 286 | **neatly: damage bill checker \(Australia\)** <sub>au.com.getneatly/neatly</sub> | `A+` | **92/100** | 15 | 96% | 99% | 77% | 189 tok |
| 287 | **neatly: damage bill checker \(US\)** <sub>com.checkneatly/neatly</sub> | `A+` | **92/100** | 15 | 96% | 99% | 77% | 189 tok |
| 288 | **Just List** <sub>com.justlistapp/just-list</sub> | `A+` | **92/100** | 11 | 95% | 99% | 77% | 167 tok |
| 289 | **LazyEdge** <sub>net.lazyedge/lazyedge</sub> | `A+` | **92/100** | 11 | 95% | 99% | 77% | 165 tok |
| 290 | **OpenInjury** <sub>tech.thecompound.openinjury/openinjury</sub> | `A+` | **92/100** | 15 | 98% | 97% | 77% | 168 tok |
| 291 | [**APICK**](https://github.com/lead788/apick-mcp) <sub>app.apick/all</sub> | `A+` | **92/100** | 255 | 95% | 99% | 76% | 199 tok |
| 292 | **themes.dev UI** <sub>dev.themes/ui</sub> | `A+` | **92/100** | 4 | 95% | 100% | 76% | 184 tok |
| 293 | [**SODAX MCP**](https://github.com/gosodax/sodax-mcp) <sub>io.github.gosodax/sodax-mcp</sub> | `A+` | **92/100** | 40 | 97% | 99% | 76% | 198 tok |
| 294 | **Kargom** <sub>io.github.kargom-ai/kargom</sub> | `A+` | **92/100** | 10 | 96% | 99% | 76% | 206 tok |
| 295 | **AVS Indexer** <sub>com.asiavirtualsolutions/indexer</sub> | `A+` | **92/100** | 8 | 98% | 96% | 75% | 192 tok |
| 296 | [**x402Fi**](https://github.com/RWA-ID/x402fi) <sub>dev.x402fi/x402fi</sub> | `A+` | **92/100** | 3 | 100% | 95% | 75% | 207 tok |
| 297 | **FFxF** <sub>net.ffxf/cloud</sub> | `A+` | **92/100** | 72 | 96% | 98% | 75% | 200 tok |
| 298 | **jwatte.com website tools** <sub>com.jwatte/site</sub> | `A+` | **92/100** | 7 | 99% | 98% | 74% | 209 tok |
| 299 | **Pakeesim eSIM** <sub>com.pakeesim/esim</sub> | `A+` | **92/100** | 8 | 100% | 96% | 74% | 213 tok |
| 300 | **com.placesdataapi/google-maps-places-mcp** | `A+` | **92/100** | 9 | 97% | 100% | 74% | 194 tok |
| 301 | **SteadyScrape SEO Data** <sub>dev.steadyscrape/seo-data</sub> | `A+` | **92/100** | 9 | 95% | 100% | 73% | 193 tok |
| 302 | [**Agent Tollbooth 402**](https://github.com/Red-Center-Studio/agent-tollbooth-402) <sub>io.github.Red-Center-Studio/agent-tollbooth-402</sub> | `A+` | **92/100** | 8 | 96% | 100% | 73% | 174 tok |
| 303 | [**Jumbula MCP by usefulapi**](https://github.com/m190/usefulapi-mcp) <sub>io.usefulapi/jumbula</sub> | `A+` | **92/100** | 12 | 97% | 100% | 73% | 245 tok |
| 304 | [**ChinaDocCheck — 16-Country China Hague Apostille, USDOS Jurisdiction &amp; 180-Day Validity Engine**](https://github.com/AbigailDavised/chinadoccheck-mcp) <sub>com.chinadoccheck/mcp</sub> | `A+` | **92/100** | 8 | 98% | 100% | 72% | 215 tok |
| 305 | [**SpotVahti**](https://github.com/synthentica/spotvahti-ai) <sub>fi.spotvahti/spotvahti</sub> | `A+` | **92/100** | 5 | 99% | 97% | 72% | 248 tok |
| 306 | [**Power Day Planner**](https://github.com/michaelvrlaku1/powersystems-ai-access) <sub>io.github.michaelvrlaku1/powerday</sub> | `A+` | **92/100** | 9 | 97% | 100% | 72% | 207 tok |
| 307 | **Repleader** <sub>net.repleader/mcp</sub> | `A+` | **92/100** | 33 | 99% | 97% | 72% | 212 tok |
| 308 | **Orb Vector** <sub>com.orbvector/orb-vector-mcp</sub> | `A+` | **92/100** | 8 | 99% | 98% | 71% | 241 tok |
| 309 | **ThreatNexus** <sub>app.threatnexus/threatnexus</sub> | `A+` | **92/100** | 12 | 98% | 99% | 70% | 215 tok |
| 310 | **com.searchdataapi/google-search-serp-news-mcp** | `A+` | **92/100** | 6 | 98% | 100% | 70% | 215 tok |
| 311 | **IRM Consulting &amp; Advisory** <sub>com.irmcon/services</sub> | `A+` | **92/100** | 6 | 98% | 100% | 69% | 215 tok |
| 312 | **Herofold** <sub>dev.herofold/herofold</sub> | `A+` | **92/100** | 6 | 100% | 98% | 69% | 232 tok |
| 313 | **Milésima** <sub>com.profblu.milesima/milesima</sub> | `A+` | **92/100** | 8 | 100% | 98% | 68% | 242 tok |
| 314 | [**GlobalHostia**](https://github.com/manojkumardevisetty/globalhostia-gemini-extension) <sub>com.globalhostia/store</sub> | `A+` | **92/100** | 10 | 100% | 99% | 67% | 236 tok |
| 315 | [**Headroom Desk options calculators**](https://github.com/headroomdesk/calculators) <sub>io.github.headroomdesk/calculators</sub> | `A+` | **92/100** | 8 | 99% | 100% | 67% | 297 tok |
| 316 | **AI-Only Society** <sub>cfd.neytom.ai/mcp</sub> | `A+` | **91/100** | 5 | 80% | 100% | 97% | 67 tok |
| 317 | **com.nesimplicity/real-estate** | `A+` | **91/100** | 4 | 80% | 100% | 96% | 78 tok |
| 318 | **CON, Central Operating Network** <sub>com.centralonet/con</sub> | `A+` | **91/100** | 5 | 82% | 100% | 94% | 79 tok |
| 319 | [**Money Reactor — 87 paid x402 APIs via MCP**](https://github.com/makar-aibot/money-reactor-mcp) <sub>io.github.makar-aibot/money-reactor</sub> | `A+` | **91/100** | 35 | 82% | 100% | 94% | 85 tok |
| 320 | **La Cartelera** <sub>app.lacartelera/cartelera</sub> | `A+` | **91/100** | 6 | 81% | 100% | 93% | 86 tok |
| 321 | **com.camilafonseca/psychotherapy** | `A+` | **91/100** | 6 | 83% | 100% | 93% | 73 tok |
| 322 | [**DankMachine meme sounds**](https://github.com/HalberdLLC/dank-meme-sounds) <sub>com.dankmachine/dank-meme-sounds</sub> | `A+` | **91/100** | 8 | 83% | 100% | 93% | 93 tok |
| 323 | **NodeRings** <sub>com.noderings/mcp</sub> | `A+` | **91/100** | 53 | 86% | 96% | 93% | 83 tok |
| 324 | **LivedProof \(demo\)** <sub>dev.pages.livedproof/livedproof</sub> | `A+` | **91/100** | 4 | 83% | 100% | 93% | 77 tok |
| 325 | **HesapNokta Science** <sub>io.github.omercebeci/hesapnokta-science</sub> | `A+` | **91/100** | 4 | 83% | 100% | 93% | 91 tok |
| 326 | **Elite Agentic Solutions** <sub>com.eliteagenticsolutions/eas</sub> | `A+` | **91/100** | 8 | 83% | 100% | 91% | 95 tok |
| 327 | **CloudCostAI** <sub>com.eliteaiempire/cloudcostai</sub> | `A+` | **91/100** | 8 | 83% | 100% | 91% | 98 tok |
| 328 | **David Morales portfolio** <sub>com.heydavidmorales/portfolio</sub> | `A+` | **91/100** | 7 | 86% | 98% | 91% | 108 tok |
| 329 | **The Very Lab** <sub>com.theverylab/the-very-lab</sub> | `A+` | **91/100** | 5 | 84% | 100% | 91% | 77 tok |
| 330 | **MyAIContractor** <sub>org.myaicontractor/myaicontractor</sub> | `A+` | **91/100** | 8 | 83% | 100% | 91% | 99 tok |
| 331 | **AI Capital Index** <sub>com.aicapitalindex/data</sub> | `A+` | **91/100** | 3 | 84% | 100% | 90% | 100 tok |
| 332 | [**TailsTrack for Busy Pet Parents**](https://github.com/premkrishn/TailTrack) <sub>io.github.premkrishn/tails-track</sub> | `A+` | **91/100** | 3 | 83% | 100% | 90% | 99 tok |
| 333 | [**Kartic - Digital Loyalty Stamp Cards For Local Businesses**](https://github.com/zsevic/kartic-mcp) <sub>app.kartic/digital-loyalty-stamp-cards</sub> | `A+` | **91/100** | 7 | 85% | 100% | 89% | 106 tok |
| 334 | [**Formation Lane US LLC Fees &amp; Deadlines**](https://github.com/formationlane/llc-fees-mcp) <sub>com.formationlane/llc-fees</sub> | `A+` | **91/100** | 4 | 85% | 100% | 89% | 110 tok |
| 335 | **MyEcommerceAI / AI4Ecommerce** <sub>com.myecommerceai/myecommerceai</sub> | `A+` | **91/100** | 7 | 84% | 100% | 89% | 101 tok |
| 336 | **Hodoyoku Japan data** <sub>dev.pages.hodoyoku/japan-data</sub> | `A+` | **91/100** | 4 | 84% | 100% | 89% | 84 tok |
| 337 | **notfiction: is it real?** <sub>com.notfiction/news</sub> | `A+` | **91/100** | 7 | 87% | 98% | 87% | 110 tok |
| 338 | **varujupp.ee** <sub>ee.varujupp/varujupp</sub> | `A+` | **91/100** | 8 | 87% | 100% | 87% | 119 tok |
| 339 | **EditClips** <sub>online.editclips/mcp</sub> | `A+` | **91/100** | 5 | 86% | 100% | 87% | 122 tok |
| 340 | **Pier** <sub>social.pier/pier</sub> | `A+` | **91/100** | 10 | 86% | 100% | 87% | 106 tok |
| 341 | **CareerProAI** <sub>tech.careerpro/careerpro</sub> | `A+` | **91/100** | 13 | 87% | 98% | 87% | 114 tok |
| 342 | **Battery Payback** <sub>uk.co.batterypayback/battery-payback</sub> | `A+` | **91/100** | 7 | 85% | 100% | 86% | 154 tok |
| 343 | **Avioverse EASA library** <sub>aero.avioverse/library</sub> | `A+` | **91/100** | 5 | 88% | 100% | 85% | 118 tok |
| 344 | **FilmFX Photo Filters** <sub>app.filmfx/filmfx</sub> | `A+` | **91/100** | 2 | 85% | 100% | 85% | 121 tok |
| 345 | **Venoh AI Visibility** <sub>com.venoh/ai-visibility</sub> | `A+` | **91/100** | 3 | 87% | 100% | 85% | 131 tok |
| 346 | **ForthRoute Returns** <sub>io.forthroute/returns</sub> | `A+` | **91/100** | 5 | 88% | 100% | 85% | 115 tok |
| 347 | **e-Fatura API \(Turkish e-invoice parser\)** <sub>io.github.boradenizarol-svg/efatura</sub> | `A+` | **91/100** | 2 | 85% | 100% | 85% | 106 tok |
| 348 | [**Veyra Trust**](https://github.com/mioku50/Veyra) <sub>io.github.mioku50/veyra-trust</sub> | `A+` | **91/100** | 3 | 87% | 100% | 85% | 117 tok |
| 349 | [**ooooOasis Factor Data**](https://github.com/oooooasis-fds/factor-data) <sub>io.github.oooooasis-fds/factor-data</sub> | `A+` | **91/100** | 2 | 85% | 100% | 85% | 113 tok |
| 350 | [**Rustyplan**](https://github.com/SverrirValgeirsson/rustyplan) <sub>io.github.SverrirValgeirsson/rustyplan</sub> | `A+` | **91/100** | 7 | 90% | 97% | 85% | 125 tok |
| 351 | **FreeAPI.watch** <sub>watch.freeapi/api-watch</sub> | `A+` | **91/100** | 6 | 87% | 100% | 85% | 123 tok |
| 352 | **Maple Minute** <sub>com.mapleminute/mapleminute</sub> | `A+` | **91/100** | 9 | 89% | 98% | 84% | 299 tok |
| 353 | [**Durable Agent Directory**](https://github.com/seanebones-lang/directory-) <sub>dev.nexteleven/durable-agent-directory</sub> | `A+` | **91/100** | 8 | 90% | 98% | 84% | 158 tok |
| 354 | [**OutboundAuth Deliverability**](https://github.com/SaqibNaseer404/outboundauth) <sub>io.github.SaqibNaseer404/outboundauth</sub> | `A+` | **91/100** | 10 | 90% | 99% | 84% | 117 tok |
| 355 | **The Speakeasy \(a quiet room for AI agents\)** <sub>io.github.sitewireai/speakeasy</sub> | `A+` | **91/100** | 17 | 90% | 97% | 84% | 127 tok |
| 356 | **SwapTitan: No-KYC &amp; Private Monero Swaps** <sub>net.swaptitan/swaptitan</sub> | `A+` | **91/100** | 24 | 90% | 98% | 84% | 136 tok |
| 357 | **Krane** <sub>com.kraneapp/krane</sub> | `A+` | **91/100** | 7 | 87% | 100% | 83% | 143 tok |
| 358 | **Microverse Market Data** <sub>com.microversesystems/market-data</sub> | `A+` | **91/100** | 9 | 89% | 100% | 83% | 142 tok |
| 359 | [**io.github.sapientsai/temporal-mcp-server**](https://github.com/sapientsai/mcp-servers) | `A+` | **91/100** | 5 | 88% | 100% | 82% | 141 tok |
| 360 | **ADV IT Performance \(AEO websites\)** <sub>ca.adv-it-performance/aeo-catalog</sub> | `A+` | **91/100** | 4 | 90% | 100% | 81% | 131 tok |
| 361 | **InmoRadar** <sub>com.inmoradar/inmoradar</sub> | `A+` | **91/100** | 4 | 93% | 96% | 81% | 176 tok |
| 362 | **ScraperWatch** <sub>com.scraperwatch/scraperwatch</sub> | `A+` | **91/100** | 10 | 91% | 100% | 81% | 145 tok |
| 363 | [**ShipStatic**](https://github.com/shipstatic/mcp) <sub>com.shipstatic/mcp</sub> | `A+` | **91/100** | 15 | 91% | 98% | 81% | 168 tok |
| 364 | **com.shortvidapi/tiktok-instagram-videos-mcp** | `A+` | **91/100** | 21 | 90% | 100% | 81% | 132 tok |
| 365 | **Supercycle** <sub>com.supercyclehq/supercycle</sub> | `A+` | **91/100** | 21 | 92% | 97% | 81% | 158 tok |
| 366 | **The Builders Supply catalog** <sub>com.thebuilderssupply/catalog</sub> | `A+` | **91/100** | 8 | 89% | 100% | 81% | 140 tok |
| 367 | **Truce** <sub>com.trucehq/truce</sub> | `A+` | **91/100** | 7 | 90% | 100% | 81% | 158 tok |
| 368 | [**Valeur Intrinsèque**](https://gitlab.com/louisvld/valeur-intrinseque) <sub>fr.valeur-intrinseque/valeur-intrinseque</sub> | `A+` | **91/100** | 10 | 93% | 97% | 81% | 140 tok |
| 369 | **ATI Lab** <sub>io.atilab/mcp</sub> | `A+` | **91/100** | 10 | 91% | 97% | 81% | 170 tok |
| 370 | **zato crypto data** <sub>io.github.datenhaus/zato</sub> | `A+` | **91/100** | 20 | 90% | 100% | 81% | 134 tok |
| 371 | [**hollow — a tree hole for AI agents**](https://github.com/jeffkit/hollow) <sub>io.github.jeffkit/hollow</sub> | `A+` | **91/100** | 4 | 90% | 100% | 81% | 141 tok |
| 372 | **io.tiktokapi/tiktok-scraper-video-downloader-api-mcp** | `A+` | **91/100** | 21 | 90% | 100% | 81% | 132 tok |
| 373 | **Palimpsest: a text adventure for AIs** <sub>me.itshenry/palimpsest</sub> | `A+` | **91/100** | 4 | 90% | 100% | 81% | 137 tok |
| 374 | **allMCPservers directory** <sub>com.allmcpservers/directory</sub> | `A+` | **91/100** | 4 | 89% | 100% | 80% | 150 tok |
| 375 | **com.gtxagent/gtxagent-mcp** | `A+` | **91/100** | 14 | 91% | 100% | 80% | 137 tok |
| 376 | [**CLNS — Korea Import Compliance**](https://github.com/CLNS-KR/CLNS-KR) <sub>io.github.CLNS-KR/clns</sub> | `A+` | **91/100** | 15 | 89% | 100% | 80% | 164 tok |
| 377 | [**x402 Structured Data &amp; Headless Scraper**](https://github.com/greatscottatl/x402-cluster) <sub>io.github.greatscottatl/x402-cluster</sub> | `A+` | **91/100** | 6 | 90% | 100% | 80% | 151 tok |
| 378 | [**agent-bev**](https://github.com/agent-bev/bev-door) <sub>ai.agent-bev/bev-door</sub> | `A+` | **91/100** | 9 | 90% | 100% | 79% | 131 tok |
| 379 | **i22** <sub>ai.i22/website</sub> | `A+` | **91/100** | 10 | 91% | 100% | 79% | 161 tok |
| 380 | **Host.al: .al domains and servers in Albania** <sub>al.host/mcp</sub> | `A+` | **91/100** | 7 | 92% | 98% | 79% | 158 tok |
| 381 | **com.b2bprofileapi/b2b-company-serp-web-search-mcp** | `A+` | **91/100** | 7 | 91% | 100% | 79% | 157 tok |
| 382 | **com.b2bprofileapi/b2b-shopify-merchant-company-profile-mcp** | `A+` | **91/100** | 7 | 91% | 100% | 79% | 157 tok |
| 383 | **com.b2bprofileapi/real-estate-brokerage-company-profile-mcp** | `A+` | **91/100** | 7 | 91% | 100% | 79% | 157 tok |
| 384 | [**CosVoice**](https://github.com/CosVoice/cosvoice-mcp) <sub>com.cosvoice/cosvoice</sub> | `A+` | **91/100** | 27 | 92% | 99% | 79% | 204 tok |
| 385 | **com.jobpostingsapi/job-postings-ats-mcp** | `A+` | **91/100** | 9 | 90% | 100% | 79% | 173 tok |
| 386 | **MacProof** <sub>com.macproof/macproof</sub> | `A+` | **91/100** | 8 | 91% | 100% | 79% | 157 tok |
| 387 | [**Mountain West Pitch**](https://github.com/Creed5252/wordpress-directory-mcp) <sub>com.mountainwestpitch/mountain-west-pitch</sub> | `A+` | **91/100** | 6 | 93% | 98% | 79% | 177 tok |
| 388 | **Preço FIPE** <sub>com.precofipe/preco-fipe</sub> | `A+` | **91/100** | 5 | 90% | 100% | 79% | 156 tok |
| 389 | [**Runheed**](https://github.com/getrunheed/runheed-plugin) <sub>com.runheed/runheed</sub> | `A+` | **91/100** | 13 | 92% | 99% | 79% | 152 tok |
| 390 | [**ARL Protocol**](https://github.com/armanalabsai/arlcoin.io) <sub>io.github.armanalabsai/arl-protocol</sub> | `A+` | **91/100** | 13 | 94% | 97% | 79% | 165 tok |
| 391 | **mocop** <sub>ai.mocop/mocop</sub> | `A+` | **91/100** | 23 | 92% | 100% | 78% | 186 tok |
| 392 | **Humanome** <sub>co.humanome/humanome</sub> | `A+` | **91/100** | 4 | 95% | 96% | 78% | 196 tok |
| 393 | [**Agent Meets Agent**](https://github.com/PKSaaS/agent-meets-agent-mcp) <sub>com.agentmeetsagent/agent-meets-agent</sub> | `A+` | **91/100** | 2 | 90% | 100% | 78% | 177 tok |
| 394 | [**ContrastAPI**](https://github.com/UPinar/contrastapi) <sub>com.contrastcyber/api</sub> | `A+` | **91/100** | 40 | 92% | 100% | 78% | 172 tok |
| 395 | **Handshakr** <sub>com.handshakr/handshakr</sub> | `A+` | **91/100** | 4 | 98% | 93% | 78% | 196 tok |
| 396 | **Nas House** <sub>com.nashouse/mcp</sub> | `A+` | **91/100** | 4 | 90% | 100% | 78% | 159 tok |
| 397 | **PerpMetric perpetuals data** <sub>com.perpmetric/perpmetric</sub> | `A+` | **91/100** | 7 | 91% | 100% | 78% | 170 tok |
| 398 | **RyRacer AI Arena** <sub>com.ryracer/arena</sub> | `A+` | **91/100** | 15 | 90% | 100% | 78% | 152 tok |
| 399 | **Varosyan company and tender data** <sub>com.varosyanllc/company-data</sub> | `A+` | **91/100** | 7 | 93% | 98% | 78% | 184 tok |
| 400 | **AgentSidekick directory** <sub>dev.agentsidekick/directory</sub> | `A+` | **91/100** | 7 | 92% | 100% | 78% | 163 tok |
| 401 | **Synapse** <sub>io.github.Aadeshjain25/synapse</sub> | `A+` | **91/100** | 7 | 91% | 100% | 78% | 167 tok |
| 402 | **Serverdex** <sub>io.serverdex/serverdex</sub> | `A+` | **91/100** | 3 | 90% | 100% | 78% | 181 tok |
| 403 | **CAD Monster** <sub>monster.cad/converter</sub> | `A+` | **91/100** | 2 | 90% | 100% | 78% | 190 tok |
| 404 | **theowf, the forum for AI agents** <sub>org.theowf/forum</sub> | `A+` | **91/100** | 16 | 91% | 100% | 78% | 173 tok |
| 405 | [**HealthStylz Clinical Nutrition, Calculators &amp; Circadian Environment MCP**](https://github.com/harrybuild/healthstylz-mcp) <sub>io.github.harrybuild/healthstylz-mcp</sub> | `A+` | **91/100** | 9 | 92% | 100% | 77% | 210 tok |
| 406 | **Patchfirst** <sub>co.patchfirst/patchfirst</sub> | `A+` | **91/100** | 7 | 93% | 100% | 76% | 190 tok |
| 407 | **EDAKON · herramientas del ciclo inmobiliario** <sub>com.edakon/herramientas</sub> | `A+` | **91/100** | 7 | 91% | 100% | 76% | 210 tok |
| 408 | **Faxvio** <sub>com.faxvio/faxvio</sub> | `A+` | **91/100** | 5 | 92% | 100% | 76% | 152 tok |
| 409 | **Vegaholic US Vegan Menus** <sub>com.vegaholic/menus</sub> | `A+` | **91/100** | 5 | 94% | 100% | 76% | 165 tok |
| 410 | [**Kultranz: US Salary, Tax &amp; Cost of Living**](https://github.com/CodePhantom-1/kultranz-mcp) <sub>io.github.CodePhantom-1/kultranz-mcp</sub> | `A+` | **91/100** | 5 | 94% | 97% | 76% | 172 tok |
| 411 | [**CashbackPro**](https://github.com/linkin931/cashbackpro-mcp) <sub>org.cashbackpro/cashbackpro</sub> | `A+` | **91/100** | 5 | 94% | 97% | 76% | 158 tok |
| 412 | **SuburbScanner** <sub>au.com.suburbscanner/suburbscanner</sub> | `A+` | **91/100** | 7 | 93% | 100% | 75% | 226 tok |
| 413 | [**Been There – The AI Bar**](https://github.com/janehardbot/been-there) <sub>com.cideolabs.beenthere/been-there</sub> | `A+` | **91/100** | 3 | 93% | 100% | 75% | 174 tok |
| 414 | **Reachout recovery meetings** <sub>com.kurtrasmussen.reachout/meetings</sub> | `A+` | **91/100** | 7 | 93% | 100% | 75% | 190 tok |
| 415 | **모아 — AI 쇼핑 비교·주문 창구** <sub>com.moaibuy/moa</sub> | `A+` | **91/100** | 12 | 92% | 100% | 75% | 192 tok |
| 416 | [**MyLatinLife Data**](https://github.com/mylatinlife/mylatinlife-data-mcp) <sub>com.mylatinlife/data</sub> | `A+` | **91/100** | 31 | 95% | 98% | 75% | 199 tok |
| 417 | **The Independent AI** <sub>com.theindependentai/mcp</sub> | `A+` | **91/100** | 8 | 94% | 98% | 75% | 173 tok |
| 418 | **CodeLint.Dev Tools** <sub>dev.codelint/tools</sub> | `A+` | **91/100** | 45 | 96% | 97% | 75% | 194 tok |
| 419 | **RyuMoon Data Tools** <sub>dev.workers.ryumoon.ryumoon-x402-tools/ryumoon-data-tools</sub> | `A+` | **91/100** | 6 | 93% | 100% | 75% | 179 tok |
| 420 | **NaRabotu — jobs in Israel** <sub>il.co.narabotu/narabotu</sub> | `A+` | **91/100** | 12 | 93% | 100% | 75% | 186 tok |
| 421 | [**AIPayGen**](https://github.com/Damien829/aipaygen) <sub>io.github.Damien829/aipaygen</sub> | `A+` | **91/100** | 111 | 95% | 99% | 75% | 186 tok |
| 422 | **Singularity Layer MCP** <sub>io.github.ivaavimusic/singularity</sub> | `A+` | **91/100** | 83 | 92% | 99% | 75% | 199 tok |
| 423 | [**SVAMI Agentic ID**](https://github.com/svami-ai/svami-agentic-id) <sub>travel.mytour/agentic-id</sub> | `A+` | **91/100** | 3 | 92% | 100% | 75% | 191 tok |
| 424 | [**ChinaMedsCheck — China Customs GACC Medication Legality &amp; Airport Red-Channel Engine**](https://github.com/AbigailDavised/chinamedscheck-mcp) <sub>com.chinamedscheck/mcp</sub> | `A+` | **91/100** | 8 | 94% | 100% | 74% | 185 tok |
| 425 | **Legado Finance** <sub>es.legadofinance/legado</sub> | `A+` | **91/100** | 8 | 94% | 100% | 74% | 221 tok |
| 426 | **Hop With Ann route finder** <sub>com.hopwithann/route-finder</sub> | `A+` | **91/100** | 3 | 93% | 100% | 73% | 206 tok |
| 427 | **Padel Stay Guide** <sub>com.padelstayguide/padel-hotels</sub> | `A+` | **91/100** | 4 | 95% | 100% | 73% | 238 tok |
| 428 | **ShelfXray quick-commerce shelf data** <sub>in.shelfxray/shelf-data</sub> | `A+` | **91/100** | 5 | 94% | 100% | 73% | 197 tok |
| 429 | [**U.S. Market Regime**](https://github.com/alicexixi85/us-market-regime-mcp) <sub>io.github.alicexixi85/us-market-regime-mcp</sub> | `A+` | **91/100** | 3 | 93% | 100% | 73% | 199 tok |
| 430 | **Poacher** <sub>io.poacher/poacher</sub> | `A+` | **91/100** | 66 | 97% | 98% | 73% | 232 tok |
| 431 | [**Isto Intents**](https://github.com/istointents/isto-intents-mcp) <sub>com.istointents/intents</sub> | `A+` | **91/100** | 4 | 100% | 96% | 71% | 258 tok |
| 432 | [**SpendCanary free Google Ads tools**](https://github.com/spendcanary/mcp-free-tools) <sub>com.spendcanary/free-tools</sub> | `A+` | **91/100** | 9 | 96% | 100% | 71% | 221 tok |
| 433 | [**IELTSera — IELTS Band Score, CLB &amp; Writing Coach**](https://github.com/Faheel101/ielts-mastery) <sub>io.github.Faheel101/ieltsera-mcp</sub> | `A+` | **91/100** | 7 | 96% | 100% | 71% | 214 tok |
| 434 | **Cron Schedule Check** <sub>ai.opencurrent/cron-check</sub> | `A+` | **91/100** | 1 | 95% | 100% | 70% | 179 tok |
| 435 | [**Action2MCP Custom GPT Action to Remote MCP Compiler**](https://github.com/ak10082247-max/action2mcp) <sub>io.github.ak10082247-max/action2mcp</sub> | `A+` | **91/100** | 1 | 95% | 100% | 70% | 166 tok |
| 436 | [**Settle Watch**](https://github.com/benmcalillycreative/x402-trust-board) <sub>io.github.benmcalillycreative/settle-watch</sub> | `A+` | **91/100** | 2 | 95% | 100% | 70% | 165 tok |
| 437 | [**ChinaTaxCalc — China Expat IIT, BIA Allowance, Annual Bonus &amp; GBA 15% Rebate Engine**](https://github.com/AbigailDavised/chinataxcalc-mcp) <sub>com.chinataxcalc/mcp</sub> | `A+` | **91/100** | 8 | 95% | 100% | 69% | 234 tok |
| 438 | [**RexCelTech pvault — Protein Database &amp; Construct Workbench**](https://github.com/Rexceltech/pvault) <sub>com.rexceltech/pvault</sub> | `A+` | **91/100** | 8 | 96% | 100% | 69% | 225 tok |
| 439 | [**Cross Stitch Pattern Maker**](https://github.com/cross-stitched/mcp) <sub>io.github.cross-stitched/cross-stitch-pattern-maker</sub> | `A+` | **91/100** | 4 | 95% | 100% | 69% | 225 tok |
| 440 | [**Botchelor**](https://github.com/smithdavedesign/botchelor) <sub>io.github.smithdavedesign/botchelor</sub> | `A+` | **91/100** | 37 | 97% | 99% | 69% | 278 tok |
| 441 | [**Club Ladder**](https://github.com/whosman/chessclubladder-mcp) <sub>io.github.whosman/chessclubladder</sub> | `A+` | **91/100** | 6 | 98% | 98% | 69% | 219 tok |
| 442 | [**FreeAgent MCP by usefulapi**](https://github.com/m190/usefulapi-mcp) <sub>io.usefulapi/freeagent</sub> | `A+` | **91/100** | 20 | 96% | 100% | 69% | 251 tok |
| 443 | [**FitzTopPicks APIs: calendars, recipes, names, places, sizes and more**](https://github.com/fitz1567/fitztoppicks-mcp) <sub>com.fitztoppicks/calendars-ingredients</sub> | `A+` | **91/100** | 96 | 97% | 100% | 68% | 252 tok |
| 444 | **TidyUse Home &amp; Garden Calculators** <sub>com.tidyuse/calculators</sub> | `A+` | **91/100** | 19 | 97% | 100% | 68% | 259 tok |
| 445 | **Korea Payroll &amp; Tax \(kkuldogu\)** <sub>io.github.dooolmang/kkuldogu-korea-payroll</sub> | `A+` | **91/100** | 69 | 100% | 96% | 68% | 266 tok |
| 446 | **Magic Prices France** <sub>fr.magicprices/mcp</sub> | `A+` | **91/100** | 14 | 99% | 98% | 66% | 229 tok |
| 447 | **Magic Prices Italia** <sub>it.magicprices/mcp</sub> | `A+` | **91/100** | 14 | 99% | 98% | 66% | 229 tok |
| 448 | **Magic Prices UK** <sub>uk.co.magicprices/mcp</sub> | `A+` | **91/100** | 14 | 99% | 98% | 66% | 228 tok |
| 449 | **DalVivo** <sub>net.dalvivo/catalogue</sub> | `A+` | **91/100** | 7 | 99% | 100% | 65% | 306 tok |
| 450 | **Standard Local** <sub>com.standardlocal/standard-local</sub> | `A+` | **91/100** | 6 | 100% | 100% | 63% | 284 tok |
| 451 | [**io.github.zbooroll-droid/zboryx-services**](https://github.com/zbooroll-droid/zboryx-services) | `A+` | **91/100** | 3 | 100% | 100% | 63% | 259 tok |
| 452 | **THE MOAT — Global Business Intelligence** <sub>com.moatpost/the-moat</sub> | `A+` | **91/100** | 4 | 100% | 100% | 60% | 289 tok |
| 453 | **TraderMarketCap** <sub>com.tradermarketcap/prices</sub> | `A+` | **90/100** | 6 | 75% | 100% | 100% | 56 tok |
| 454 | [**io.github.wobuliangren/pet-import-guide**](https://github.com/petimportguide/pet-import-guide-data) | `A+` | **90/100** | 6 | 77% | 100% | 98% | 58 tok |
| 455 | [**Cards4Play**](https://github.com/mattdowell/cards4play-mcp) <sub>com.cards4play/cards4play</sub> | `A+` | **90/100** | 10 | 77% | 100% | 96% | 66 tok |
| 456 | [**NewKitchenAI - Kitchen Design Reference**](https://github.com/weiwosuoai/newkitchenai-mcp) <sub>com.newkitchenai/kitchen-design</sub> | `A+` | **90/100** | 5 | 80% | 100% | 94% | 80 tok |
| 457 | **Snowbelly Nutrition** <sub>app.snowbelly/nutrition</sub> | `A+` | **90/100** | 4 | 80% | 100% | 93% | 97 tok |
| 458 | **Bettiz Legal — guías legales \(Chile\)** <sub>cl.bettizlegal/guides</sub> | `A+` | **90/100** | 4 | 79% | 100% | 93% | 95 tok |
| 459 | **Gilroy Motor — electric motorcycles \(Chile\)** <sub>cl.gilroymotor/agent-door</sub> | `A+` | **90/100** | 4 | 79% | 100% | 93% | 87 tok |
| 460 | [**Barakah Halal Stock Screen**](https://github.com/pancake-pixels/barakah-halal-mcp) <sub>com.barakahprofits.app/halal-screen</sub> | `A+` | **90/100** | 2 | 85% | 93% | 93% | 117 tok |
| 461 | **Kesterley Index** <sub>com.kesterley/index</sub> | `A+` | **90/100** | 4 | 80% | 100% | 93% | 80 tok |
| 462 | [**Sjothr company tokenization and fundraising**](https://github.com/Djangode/sjothr-mcp) <sub>io.github.Djangode/sjothr-mcp</sub> | `A+` | **90/100** | 6 | 78% | 100% | 93% | 92 tok |
| 463 | **Resolva Life Free Lab** <sub>life.resolva/public-fixtures</sub> | `A+` | **90/100** | 2 | 80% | 100% | 93% | 78 tok |
| 464 | **HALOWERK EU Power Dispatch API** <sub>com.halowerk/energy-research-hub</sub> | `A+` | **90/100** | 29 | 80% | 99% | 92% | 90 tok |
| 465 | **AutoPay** <sub>com.synairo.api/autopay</sub> | `A+` | **90/100** | 21 | 80% | 100% | 91% | 90 tok |
| 466 | **AgentCaliper Registry Evidence** <sub>dev.agentcaliper/registry-evidence</sub> | `A+` | **90/100** | 5 | 80% | 100% | 91% | 84 tok |
| 467 | [**CantorFi lending vaults and agent door**](https://github.com/cantorfi/cantorfi-mcp) <sub>io.github.cantorfi/cantorfi-mcp</sub> | `A+` | **90/100** | 10 | 82% | 100% | 91% | 89 tok |
| 468 | **MyKidsBook** <sub>org.mykidsbook/mykidsbook</sub> | `A+` | **90/100** | 8 | 82% | 100% | 91% | 103 tok |
| 469 | **KnowAPI** <sub>dev.knowapi/data</sub> | `A+` | **90/100** | 6 | 82% | 100% | 90% | 105 tok |
| 470 | **waystation – message wall for AI agents** <sub>dev.rcptr.waystation/waystation</sub> | `A+` | **90/100** | 3 | 82% | 100% | 90% | 102 tok |
| 471 | [**GetFreeCarCheck: UK car reliability and MOT data**](https://github.com/getfreecarcheck/car-data-api) <sub>uk.co.getfreecarcheck/car-data</sub> | `A+` | **90/100** | 10 | 82% | 100% | 90% | 96 tok |
| 472 | **IBAN Analyzer** <sub>com.iban-analyzer/iban-analyzer</sub> | `A+` | **90/100** | 5 | 86% | 97% | 88% | 121 tok |
| 473 | [**Toledo Cleaning Price Estimator**](https://github.com/goldguydcl-hue/toledo-cleaning-prices-mcp) <sub>com.simplycleantoledo/toledo-cleaning-prices</sub> | `A+` | **90/100** | 4 | 85% | 96% | 88% | 182 tok |
| 474 | **Skillshop** <sub>io.github.McCoyLab87/skillshop</sub> | `A+` | **90/100** | 9 | 86% | 97% | 87% | 114 tok |
| 475 | **Agent Ops Jobs** <sub>com.agentopsboard/jobs</sub> | `A+` | **90/100** | 4 | 83% | 100% | 85% | 138 tok |
| 476 | **CalmVoy** <sub>com.calmvoy/fichas-de-pais</sub> | `A+` | **90/100** | 2 | 90% | 93% | 85% | 176 tok |
| 477 | [**ONZIP**](https://github.com/NodajiFi-Tokenomy/NodajiFi-Ecosystem) <sub>com.globalpiggy/onzip</sub> | `A+` | **90/100** | 2 | 85% | 100% | 85% | 116 tok |
| 478 | [**Check before you pay**](https://github.com/loopholetape/check-before-you-pay) <sub>com.loopholetape/check-before-you-pay</sub> | `A+` | **90/100** | 3 | 90% | 95% | 85% | 132 tok |
| 479 | [**Merlonix Monitoring**](https://github.com/cmhenry79/merlonix-mcp) <sub>com.merlonix/monitoring</sub> | `A+` | **90/100** | 16 | 89% | 100% | 85% | 125 tok |
| 480 | **Roamduck: mobile top-ups, gift cards and travel eSIMs** <sub>com.roamduck/roamduck</sub> | `A+` | **90/100** | 16 | 88% | 96% | 85% | 135 tok |
| 481 | [**CLIA Certificate Renewal Sentinel**](https://github.com/Marcoco27/clia-certificate-sentinel-mcp) <sub>fr.amacunia/clia-laboratory-certificate-expiration-renewal</sub> | `A+` | **90/100** | 2 | 90% | 93% | 85% | 156 tok |
| 482 | [**NPDES Permit Renewal Sentinel**](https://github.com/Marcoco27/npdes-permit-renewal-sentinel-mcp) <sub>fr.amacunia/npdes-permit-expiration-renewal-application-deadline</sub> | `A+` | **90/100** | 2 | 90% | 93% | 85% | 162 tok |
| 483 | **OtterBay – free software** <sub>io.github.paninosupreme-hash/otterbay</sub> | `A+` | **90/100** | 3 | 90% | 95% | 85% | 155 tok |
| 484 | **magne.tools** <sub>tools.magne/catalog</sub> | `A+` | **90/100** | 4 | 88% | 96% | 85% | 117 tok |
| 485 | **Mad Check** <sub>xyz.madcheck/mad-check</sub> | `A+` | **90/100** | 6 | 84% | 100% | 85% | 126 tok |
| 486 | **TideTrade** <sub>app.tidetrade/tidetrade</sub> | `A+` | **90/100** | 6 | 88% | 98% | 84% | 141 tok |
| 487 | [**Construction Company Software**](https://github.com/constructioncompanysoftware/mcp) <sub>com.construction-company-software/mcp</sub> | `A+` | **90/100** | 17 | 85% | 100% | 84% | 127 tok |
| 488 | **LinkVet** <sub>dev.pages.linkvet/linkvet</sub> | `A+` | **90/100** | 11 | 87% | 100% | 84% | 122 tok |
| 489 | **Rendered Fits open data** <sub>io.github.renderedfits/open-data</sub> | `A+` | **90/100** | 7 | 86% | 98% | 84% | 138 tok |
| 490 | [**URLGate**](https://github.com/Arithmos111/urlgate) <sub>xyz.urlgate/mcp</sub> | `A+` | **90/100** | 38 | 86% | 98% | 84% | 148 tok |
| 491 | **Credit Guru** <sub>com.creditguruhq/creditguru</sub> | `A+` | **90/100** | 8 | 87% | 100% | 83% | 122 tok |
| 492 | **Global Quran** <sub>com.globalquran/mcp</sub> | `A+` | **90/100** | 8 | 86% | 100% | 83% | 119 tok |
| 493 | **Kudimi Studios catalogue** <sub>com.kudimistudios/catalogue</sub> | `A+` | **90/100** | 6 | 86% | 100% | 83% | 132 tok |
| 494 | **Who reads the web** <sub>com.whoreadsthe/agents</sub> | `A+` | **90/100** | 6 | 87% | 100% | 83% | 130 tok |
| 495 | [**ADS Beast**](https://github.com/notformal/adsbeast-plugins) <sub>io.github.notformal/adsbeast</sub> | `A+` | **90/100** | 206 | 86% | 100% | 83% | 138 tok |
| 496 | **LocalSpot Trip** <sub>com.localspottrip/trip-planner</sub> | `A+` | **90/100** | 9 | 87% | 100% | 82% | 136 tok |
| 497 | **de.plateaucandy/plateau-candy** | `A+` | **90/100** | 5 | 86% | 100% | 82% | 127 tok |
| 498 | [**Apex Edge — x402-paid machine services**](https://github.com/nonsynthetic/apex-edge-tools) <sub>net.nonsynthetic/apex-edge</sub> | `A+` | **90/100** | 17 | 86% | 99% | 82% | 141 tok |
| 499 | **druckflotte.at Druckerzubehör** <sub>at.druckflotte/druckflotte</sub> | `A+` | **90/100** | 13 | 90% | 98% | 81% | 153 tok |
| 500 | **Signetex** <sub>ch.signetex/register</sub> | `A+` | **90/100** | 9 | 90% | 97% | 81% | 168 tok |
| 501 | **ChoEsim Travel eSIM** <sub>com.choesim/travel-esim</sub> | `A+` | **90/100** | 5 | 86% | 100% | 81% | 140 tok |
| 502 | [**FetchTranscript**](https://github.com/fetchtranscript/mcp-server) <sub>com.fetchtranscript/fetchtranscript</sub> | `A+` | **90/100** | 8 | 89% | 98% | 81% | 124 tok |
| 503 | [**PyAI Voice AI**](https://github.com/atomsai/pyai-platform-backend) <sub>io.github.atomsai/pyai</sub> | `A+` | **90/100** | 59 | 87% | 100% | 81% | 214 tok |
| 504 | **DeFi Capital Flow-Price Gap** <sub>io.github.zsraduly77/defi-flow-price-gap</sub> | `A+` | **90/100** | 10 | 92% | 94% | 81% | 149 tok |
| 505 | [**Krate**](https://github.com/incyashraj/krate) <sub>tech.krate/krate</sub> | `A+` | **90/100** | 8 | 89% | 98% | 81% | 160 tok |
| 506 | **Bluedose GLP-1 Tools** <sub>com.bluedoseapp/glp1-tools</sub> | `A+` | **90/100** | 3 | 87% | 100% | 80% | 125 tok |
| 507 | **PlainError** <sub>com.plainerror/plainerror</sub> | `A+` | **90/100** | 3 | 93% | 95% | 80% | 155 tok |
| 508 | **SGL event finder** <sub>com.sovereigngl/sgl-public</sub> | `A+` | **90/100** | 7 | 89% | 100% | 80% | 160 tok |
| 509 | **ALD Mobility** <sub>es.aldmobility/car-rental</sub> | `A+` | **90/100** | 4 | 87% | 100% | 80% | 191 tok |
| 510 | [**CyberSafe MCP**](https://github.com/kshitij9896/cybersafe-mcp) <sub>io.github.kshitij9896/cybersafe-mcp</sub> | `A+` | **90/100** | 6 | 90% | 98% | 80% | 131 tok |
| 511 | **RentCast API** <sub>io.rentcast/api</sub> | `A+` | **90/100** | 4 | 88% | 100% | 80% | 171 tok |
| 512 | **borbur.net salary and tax calculators** <sub>net.borbur/salary-calculators</sub> | `A+` | **90/100** | 20 | 90% | 97% | 80% | 144 tok |
| 513 | **Jason Lau Academy** <sub>academy.jasonlau/classes</sub> | `A+` | **90/100** | 6 | 92% | 98% | 79% | 172 tok |
| 514 | **BugOtter** <sub>com.bugotter/mcp</sub> | `A+` | **90/100** | 80 | 88% | 100% | 79% | 178 tok |
| 515 | **3D Model and Image Conversion by imagetostl.com** <sub>com.imagetostl/3d-converter</sub> | `A+` | **90/100** | 5 | 90% | 97% | 79% | 184 tok |
| 516 | **AEGIS \(McX Ventures\)** <sub>com.mcx-ventures/aegis</sub> | `A+` | **90/100** | 6 | 90% | 98% | 79% | 160 tok |
| 517 | **Papyras Coupons** <sub>com.papyrascoupons/coupons</sub> | `A+` | **90/100** | 7 | 91% | 98% | 79% | 178 tok |
| 518 | **ScratchDB** <sub>com.scratchdb/scratchdb</sub> | `A+` | **90/100** | 6 | 91% | 98% | 79% | 170 tok |
| 519 | [**Recall Kitchen**](https://github.com/Recall-Kitchen/rk-mcp) <sub>io.github.adamdecaf/recall-kitchen</sub> | `A+` | **90/100** | 20 | 95% | 97% | 79% | 185 tok |
| 520 | [**AgentPulse**](https://github.com/Akshat-Srivastava-PS/AgentPulse) <sub>io.github.Akshat-Srivastava-PS/agentpulse</sub> | `A+` | **90/100** | 5 | 90% | 97% | 79% | 142 tok |
| 521 | [**MusVideo**](https://github.com/tjsdyy/MusVideoSkills) <sub>io.github.tjsdyy/musvideo</sub> | `A+` | **90/100** | 11 | 92% | 96% | 79% | 167 tok |
| 522 | **DeployIt** <sub>ai.deployit/product-expert</sub> | `A+` | **90/100** | 3 | 93% | 95% | 78% | 218 tok |
| 523 | [**Swiss public transport**](https://gitlab.com/opendata.ch/Transport) <sub>ch.opendata/transport</sub> | `A+` | **90/100** | 4 | 90% | 100% | 78% | 162 tok |
| 524 | [**E-Invoice Checker**](https://github.com/EleqanT/einvoicechecker-mcp) <sub>com.einvoicechecker/einvoice</sub> | `A+` | **90/100** | 9 | 90% | 98% | 78% | 188 tok |
| 525 | **Piqline \(open door\)** <sub>com.piqline/open</sub> | `A+` | **90/100** | 4 | 95% | 93% | 78% | 175 tok |
| 526 | **Xaminat** <sub>com.xaminat/xaminat</sub> | `A+` | **90/100** | 5 | 92% | 97% | 78% | 170 tok |
| 527 | **xmlvalid** <sub>com.xmlvalid/xmlvalid</sub> | `A+` | **90/100** | 5 | 92% | 97% | 78% | 181 tok |
| 528 | **Die PARTEI Reutlingen** <sub>de.die-partei-reutlingen/public</sub> | `A+` | **90/100** | 6 | 89% | 100% | 78% | 152 tok |
| 529 | **MoneyTools x402 Precheck — check a seller's 402 terms and OFAC-screen payTo** <sub>dev.moneytools/pay-precheck</sub> | `A+` | **90/100** | 128 | 89% | 99% | 78% | 166 tok |
| 530 | **Tidy Quid budget planners** <sub>dev.workers.svenco.tidyquid/tidyquid</sub> | `A+` | **90/100** | 6 | 89% | 100% | 78% | 163 tok |
| 531 | [**siz.la**](https://github.com/NeoReader/sizla-docs) <sub>io.github.NeoReader/sizla</sub> | `A+` | **90/100** | 15 | 95% | 100% | 78% | 178 tok |
| 532 | **AnswerKB** <sub>com.answerkb/kb</sub> | `A+` | **90/100** | 6 | 93% | 95% | 77% | 191 tok |
| 533 | [**Deyaho Phone Calls MCP**](https://github.com/Deyaho/deyaho-phone-calls-mcp) <sub>com.deyaho/phone-calls</sub> | `A+` | **90/100** | 5 | 92% | 97% | 77% | 295 tok |
| 534 | **claw.mobile AI tools catalogue** <sub>mobile.claw/ai-tools</sub> | `A+` | **90/100** | 6 | 92% | 98% | 77% | 171 tok |
| 535 | [**The Valley Desk**](https://github.com/ajhcs/the-valley-desk) <sub>org.thevalleydesk/directory</sub> | `A+` | **90/100** | 5 | 90% | 100% | 77% | 229 tok |
| 536 | [**PivotBank**](https://github.com/mgulraize/pivotbank-mcp) <sub>app.pivotbank/pivotbank</sub> | `A+` | **90/100** | 5 | 92% | 97% | 76% | 187 tok |
| 537 | **Lansary Company Intelligence** <sub>com.lansary/company-intelligence</sub> | `A+` | **90/100** | 7 | 90% | 100% | 76% | 209 tok |
| 538 | [**Bifrost K-Finance &amp; Korea Customs x402**](https://github.com/ballostark-wq/bifrost-kfinance-mcp) <sub>io.github.ballostark-wq/bifrost-kfinance-mcp</sub> | `A+` | **90/100** | 10 | 90% | 100% | 76% | 203 tok |
| 539 | **AI Third Space** <sub>io.github.niraseang/ai-third-space</sub> | `A+` | **90/100** | 120 | 91% | 98% | 76% | 185 tok |
| 540 | [**io.github.Savirinc/unfragile**](https://github.com/Savirinc/unfragile-mcp-server) | `A+` | **90/100** | 4 | 93% | 96% | 76% | 228 tok |
| 541 | [**Stork: search, scrape and docs**](https://github.com/storkai/stork-mcp) <sub>ai.stork/core</sub> | `A+` | **90/100** | 6 | 91% | 100% | 75% | 173 tok |
| 542 | **Act 60 Business** <sub>business.act60/mcp</sub> | `A+` | **90/100** | 9 | 93% | 97% | 75% | 206 tok |
| 543 | [**DentalCostFinder Canada MCP**](https://github.com/yueliao11/mcp-servers) <sub>ca.dentalcostfinder/canada-dental</sub> | `A+` | **90/100** | 3 | 90% | 100% | 75% | 144 tok |
| 544 | **RegMap Canada** <sub>ca.regmap/regmap</sub> | `A+` | **90/100** | 10 | 93% | 99% | 75% | 200 tok |
| 545 | **Gracieta: teatro, humor y musicales en España** <sub>com.gracieta/gracieta</sub> | `A+` | **90/100** | 5 | 92% | 97% | 75% | 196 tok |
| 546 | **Werop** <sub>com.werop/catalog</sub> | `A+` | **90/100** | 8 | 90% | 100% | 75% | 189 tok |
| 547 | [**AI Chili Video Generation Studio &amp; API**](https://github.com/AI-Chili/aichili) <sub>io.github.AI-Chili/aichili</sub> | `A+` | **90/100** | 7 | 92% | 100% | 75% | 175 tok |
| 548 | **DesignMD Pro** <sub>app.designmdpro/designmdpro</sub> | `A+` | **90/100** | 4 | 98% | 93% | 74% | 227 tok |
| 549 | **4fillment** <sub>com.4fillment/fulfillment</sub> | `A+` | **90/100** | 7 | 90% | 100% | 74% | 226 tok |
| 550 | [**UFCalendar Fight API — MMA MCP server**](https://github.com/UFCalendar/fight-api-skill) <sub>com.ufcalendar/fight-api</sub> | `A+` | **90/100** | 58 | 93% | 98% | 74% | 208 tok |
| 551 | [**Agent Evidence Utility**](https://github.com/defcron/agent-evidence-utility) <sub>io.github.defcron/agent-evidence-utility</sub> | `A+` | **90/100** | 4 | 90% | 100% | 74% | 176 tok |
| 552 | [**io.github.kwizzlesurp10-ctrl/x402-mcp**](https://github.com/kwizzlesurp10-ctrl/x402-mcp) | `A+` | **90/100** | 21 | 90% | 100% | 74% | 211 tok |
| 553 | **ForexNewsRadar — FX &amp; Gold Macro Impulse &amp; VETO Shield** <sub>com.forexnewsradar/mcp</sub> | `A+` | **90/100** | 5 | 94% | 97% | 73% | 190 tok |
| 554 | [**GlobalHostia Account**](https://github.com/manojkumardevisetty/globalhostia-gemini-extension) <sub>com.globalhostia/account</sub> | `A+` | **90/100** | 85 | 93% | 98% | 73% | 214 tok |
| 555 | **iplover** <sub>com.iplover/iplover</sub> | `A+` | **90/100** | 5 | 100% | 91% | 73% | 214 tok |
| 556 | [**ScrapeCrate**](https://github.com/scrapecrate/mcp-server) <sub>com.scrapecrate/scrapecrate</sub> | `A+` | **90/100** | 35 | 95% | 97% | 73% | 205 tok |
| 557 | **Wrenform Quick Forms** <sub>com.wrenform/wrenform-quick</sub> | `A+` | **90/100** | 4 | 95% | 96% | 73% | 186 tok |
| 558 | [**Swift Agent Network member directory**](https://github.com/jtbrazil07-oss/swift-agent-network-mcp) <sub>io.github.jtbrazil07-oss/swift-agent-network</sub> | `A+` | **90/100** | 4 | 95% | 96% | 73% | 209 tok |
| 559 | [**Phono.Crescendo**](https://github.com/pjtribot-blip/ref-crescendo) <sub>io.github.pjtribot-blip/phono-crescendo</sub> | `A+` | **90/100** | 4 | 94% | 96% | 73% | 187 tok |
| 560 | [**Heurion Clinical Research Tools**](https://github.com/heurion-org/heurion) <sub>org.heurion/clinical-research-tools</sub> | `A+` | **90/100** | 8 | 92% | 100% | 73% | 185 tok |
| 561 | **RailCore Developers** <sub>tech.railcore/developers</sub> | `A+` | **90/100** | 8 | 94% | 98% | 73% | 192 tok |
| 562 | [**Stoa: swaps on Robinhood Chain**](https://github.com/StoaDex/Stoa) <sub>io.github.StoaDex/stoa</sub> | `A+` | **90/100** | 17 | 94% | 96% | 72% | 196 tok |
| 563 | **Twitter/X API MCP: Search Tweets, Users, Followers \(TwitterAPI.io\)** <sub>io.twitterapi/mcp-server</sub> | `A+` | **90/100** | 12 | 94% | 98% | 72% | 206 tok |
| 564 | **Twitter/X Search Tweets &amp; Followers MCP \(TwitterAPI.io\)** <sub>io.twitterapi/twitter-x-search-tweets-followers</sub> | `A+` | **90/100** | 12 | 94% | 98% | 72% | 206 tok |
| 565 | **Codethrift** <sub>org.codethrift/codethrift</sub> | `A+` | **90/100** | 5 | 94% | 97% | 72% | 215 tok |
| 566 | [**Tereno on Base**](https://github.com/tereno-xyz/tereno-mcp) <sub>xyz.tereno/tereno</sub> | `A+` | **90/100** | 23 | 94% | 97% | 72% | 221 tok |
| 567 | **Europe Instead** <sub>com.europeinstead/europe-instead</sub> | `A+` | **90/100** | 5 | 94% | 100% | 71% | 215 tok |
| 568 | [**AMIRA — Africa Multiple Research Data**](https://github.com/AM-Digital-Research-Environment/amira-mcp-server) <sub>io.github.AM-Digital-Research-Environment/amira-mcp-server</sub> | `A+` | **90/100** | 40 | 93% | 100% | 71% | 235 tok |
| 569 | **Toronto and GTA Transit** <sub>ca.sitesy/transit</sub> | `A+` | **90/100** | 4 | 100% | 93% | 70% | 245 tok |
| 570 | [**Helpful Mods Catalog**](https://github.com/antanarr/helpfulmods-nextjs-paid-access) <sub>com.helpfulmods/catalog</sub> | `A+` | **90/100** | 5 | 96% | 97% | 70% | 220 tok |
| 571 | [**Agent Flights**](https://github.com/lomiafrica/agent-flights-mcp) <sub>flights.lowest/agent-flights</sub> | `A+` | **90/100** | 8 | 95% | 98% | 70% | 283 tok |
| 572 | [**AIMarket — live agent marketplace**](https://github.com/alexar76/aimarket-hub) <sub>io.github.alexar76/aimarket-hub</sub> | `A+` | **90/100** | 13 | 94% | 99% | 70% | 238 tok |
| 573 | **org.echoempire/web-tools** | `A+` | **90/100** | 6 | 93% | 100% | 70% | 198 tok |
| 574 | **Pickbench** <sub>ai.pickbench/pickbench</sub> | `A+` | **90/100** | 7 | 100% | 94% | 69% | 227 tok |
| 575 | [**travel.art**](https://github.com/alexzavialov/travel-art-mcp) <sub>art.travel/mcp</sub> | `A+` | **90/100** | 8 | 96% | 96% | 69% | 221 tok |
| 576 | **Direct Detailing Services** <sub>com.directdetailingservicesllc/booking</sub> | `A+` | **90/100** | 8 | 94% | 100% | 69% | 276 tok |
| 577 | **Kernel Terrassenplaner** <sub>de.kernelterrasse/terrassenplaner</sub> | `A+` | **90/100** | 6 | 94% | 100% | 69% | 556 tok |
| 578 | **Agitech Site Check** <sub>group.agitech/site-check</sub> | `A+` | **90/100** | 4 | 98% | 96% | 69% | 232 tok |
| 579 | [**HadithDB**](https://github.com/iadnanmukhtar/hadithdb) <sub>io.github.iadnanmukhtar/hadithdb</sub> | `A+` | **90/100** | 23 | 99% | 97% | 69% | 250 tok |
| 580 | [**RulesWatch**](https://github.com/whosman/ruleswatch-mcp) <sub>io.github.whosman/ruleswatch</sub> | `A+` | **90/100** | 5 | 100% | 94% | 69% | 260 tok |
| 581 | **TownIndex** <sub>org.townindex/directory</sub> | `A+` | **90/100** | 4 | 98% | 96% | 69% | 304 tok |
| 582 | [**RoboWrite**](https://github.com/RoboAdApp/robowrite-plugin) <sub>ai.robowrite/mcp</sub> | `A+` | **90/100** | 76 | 98% | 98% | 68% | 345 tok |
| 583 | **Showcasia property search** <sub>com.showcasia/property-search</sub> | `A+` | **90/100** | 2 | 95% | 100% | 68% | 231 tok |
| 584 | [**Systemores AI Agent &amp; MCP Security Auditor**](https://github.com/bobcar0/systemores-plugin) <sub>io.github.bobcar0/systemores-plugin</sub> | `A+` | **90/100** | 12 | 97% | 99% | 67% | 242 tok |
| 585 | [**Front of Goal**](https://github.com/whosman/frontofgoal-mcp) <sub>io.github.whosman/frontofgoal</sub> | `A+` | **90/100** | 6 | 100% | 95% | 67% | 248 tok |
| 586 | [**MACKORN Hydraulic Cone Crusher Selection**](https://github.com/LeifDai/MACKORN-hydraulic-cone-crusher) <sub>cn.mackorn/mackorn-cone-crusher</sub> | `A+` | **90/100** | 29 | 96% | 100% | 66% | 281 tok |
| 587 | **Codemate website** <sub>com.codemate/website</sub> | `A+` | **90/100** | 9 | 97% | 98% | 66% | 357 tok |
| 588 | **Prim** <sub>com.profblu.prim/prim</sub> | `A+` | **90/100** | 8 | 100% | 94% | 65% | 265 tok |
| 589 | [**Cash For My Note Calculators**](https://github.com/donofdebt/cashformynote-mcp) <sub>io.github.donofdebt/cashformynote-mcp</sub> | `A+` | **90/100** | 21 | 99% | 96% | 65% | 258 tok |
| 590 | **while.sh** <sub>sh.while/while</sub> | `A+` | **90/100** | 45 | 96% | 100% | 65% | 294 tok |
| 591 | [**DropTrack**](https://github.com/droptrack/droptrack-ai-integrations) <sub>io.github.droptrack/droptrack</sub> | `A+` | **90/100** | 5 | 100% | 97% | 64% | 291 tok |
| 592 | [**Cybercentry B20 Token Verification**](https://github.com/Cybercentry/cybercentry-app) <sub>uk.co.cybercentry/b20-verification</sub> | `A+` | **90/100** | 4 | 98% | 100% | 64% | 267 tok |
| 593 | **Подшито: инструменты юриста** <sub>ru.podshito/tools</sub> | `A+` | **90/100** | 33 | 98% | 99% | 63% | 314 tok |
| 594 | **BRAINIAC Web &amp; Page Intelligence** <sub>software.brainiac/web-intelligence</sub> | `A+` | **90/100** | 6 | 100% | 98% | 63% | 229 tok |
| 595 | [**App Pain API**](https://github.com/hawkmill/app-pain-api) <sub>io.github.hawkmill/app-pain-api</sub> | `A+` | **90/100** | 7 | 99% | 98% | 61% | 323 tok |
| 596 | **PokemonLore MCP** <sub>com.pokemonlore/pokemonlore</sub> | `A+` | **90/100** | 6 | 100% | 100% | 57% | 363 tok |
| 597 | **LVL LTD skill market** <sub>com.lvlltd/skill-market</sub> | `A` | **89/100** | 43 | 73% | 100% | 98% | 66 tok |
| 598 | [**TokenSafe**](https://github.com/tokensafe-dev/tokensafe) <sub>dev.tokensafe/tokensafe</sub> | `A` | **89/100** | 9 | 73% | 100% | 98% | 51 tok |
| 599 | **Phoenix Collective** <sub>io.github.PhoenixClaw01/phoenix-collective</sub> | `A` | **89/100** | 14 | 78% | 100% | 93% | 103 tok |
| 600 | **DTA — Mongolia's signed macro data terminal** <sub>mn.dta/terminal</sub> | `A` | **89/100** | 11 | 77% | 99% | 93% | 84 tok |
| 601 | [**Allooloo Receipts**](https://github.com/allooloo/rco-records) <sub>io.github.allooloo/rco-records</sub> | `A` | **89/100** | 5 | 78% | 100% | 91% | 112 tok |
| 602 | [**ABContents**](https://github.com/agustinnb/abcontents-mcp) <sub>io.github.agustinnb/abcontents</sub> | `A` | **89/100** | 7 | 79% | 100% | 90% | 145 tok |
| 603 | **EAS LLM Gateway** <sub>com.eliteagenticsolutions/gateway</sub> | `A` | **89/100** | 4 | 80% | 100% | 89% | 79 tok |
| 604 | **VOLT48 — 48V DC telecom power** <sub>com.volt48/agent-door</sub> | `A` | **89/100** | 4 | 79% | 100% | 89% | 143 tok |
| 605 | [**Gentleface icons**](https://github.com/andaja/gentleface-icons) <sub>com.gentleface/icons</sub> | `A` | **89/100** | 5 | 81% | 100% | 88% | 108 tok |
| 606 | **HokuHost Domains** <sub>com.hokuhost/domains</sub> | `A` | **89/100** | 12 | 83% | 98% | 88% | 103 tok |
| 607 | [**Moltspace**](https://github.com/moltspace/moltspace) <sub>io.github.moltspace/moltspace</sub> | `A` | **89/100** | 11 | 80% | 100% | 88% | 113 tok |
| 608 | **The Congregation of Tomorrow: the workbench** <sub>org.congregationoftomorrow/workbench</sub> | `A` | **89/100** | 6 | 80% | 100% | 88% | 114 tok |
| 609 | **ETH Gas Price** <sub>org.ethgasprice/gas</sub> | `A` | **89/100** | 6 | 80% | 100% | 88% | 90 tok |
| 610 | **Pumpkin** <sub>com.pumpkincms/pumpkin-public-site</sub> | `A` | **89/100** | 31 | 82% | 100% | 87% | 102 tok |
| 611 | **Lumen House** <sub>io.github.hotsyrup/lumen-house</sub> | `A` | **89/100** | 7 | 80% | 100% | 87% | 103 tok |
| 612 | **Connecty** <sub>nl.connecty/connecty</sub> | `A` | **89/100** | 7 | 84% | 96% | 87% | 116 tok |
| 613 | [**Fless Apartment Hunt**](https://github.com/fless-io/skills) <sub>io.fless/mcp</sub> | `A` | **89/100** | 19 | 82% | 100% | 86% | 126 tok |
| 614 | [**Clawifi**](https://github.com/ReARCLabs/clawifi-mcp) <sub>io.github.atakanelik34/clawifi-mcp</sub> | `A` | **89/100** | 15 | 81% | 99% | 86% | 125 tok |
| 615 | **AVATALKS** <sub>app.avatalks/avatalks</sub> | `A` | **89/100** | 11 | 82% | 100% | 85% | 132 tok |
| 616 | **Vaultan** <sub>app.vaultan/vaultan</sub> | `A` | **89/100** | 5 | 86% | 97% | 85% | 111 tok |
| 617 | **Agent Audit Office** <sub>com.agentauditoffice/ratings</sub> | `A` | **89/100** | 3 | 83% | 100% | 85% | 103 tok |
| 618 | [**ByJG Open Source Docs**](https://github.com/byjg/mcpserver-byjg-docs) <sub>com.byjg/docs</sub> | `A` | **89/100** | 3 | 82% | 100% | 85% | 164 tok |
| 619 | **Botwire** <sub>dev.pages.botwire/botwire</sub> | `A` | **89/100** | 8 | 84% | 96% | 85% | 123 tok |
| 620 | [**Allooloo Auditor**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getauditor</sub> | `A` | **89/100** | 3 | 87% | 95% | 85% | 129 tok |
| 621 | [**Allooloo Filings**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getfilings</sub> | `A` | **89/100** | 3 | 87% | 95% | 85% | 145 tok |
| 622 | [**Allooloo Ticker**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getticker</sub> | `A` | **89/100** | 3 | 87% | 95% | 85% | 133 tok |
| 623 | [**Crypto Regime MCP**](https://github.com/Shicodiez/crypto-regime-mcp) <sub>io.github.Shicodiez/crypto-regime-mcp</sub> | `A` | **89/100** | 12 | 85% | 98% | 85% | 122 tok |
| 624 | **ResumeVsJob Batch** <sub>xyz.resumevsjob/batch</sub> | `A` | **89/100** | 2 | 80% | 100% | 85% | 158 tok |
| 625 | **The Deals Database** <sub>com.thedealsdatabase/deals</sub> | `A` | **89/100** | 4 | 84% | 100% | 84% | 151 tok |
| 626 | [**The Pitch Network**](https://github.com/Creed5252/wordpress-directory-mcp) <sub>org.pitchnetwork/pitch-network</sub> | `A` | **89/100** | 4 | 85% | 96% | 84% | 172 tok |
| 627 | [**Tsoden AI Visibility Audit**](https://github.com/notformal/tsoden-ai-plugins) <sub>ai.tsoden.serp/ai-visibility-audit</sub> | `A` | **89/100** | 6 | 87% | 98% | 83% | 123 tok |
| 628 | **OCKLU Hyper Market** <sub>com.ocklu/hypermarket</sub> | `A` | **89/100** | 21 | 83% | 99% | 83% | 140 tok |
| 629 | [**Panal**](https://github.com/gucclabs/Panal) <sub>lat.panal/panal</sub> | `A` | **89/100** | 7 | 90% | 94% | 83% | 145 tok |
| 630 | **TF Handy Wash** <sub>com.tfhandywash/site</sub> | `A` | **89/100** | 9 | 85% | 98% | 82% | 138 tok |
| 631 | [**qr: QR codes that never expire**](https://github.com/mandymozart/qr) <sub>io.github.mandymozart/qr</sub> | `A` | **89/100** | 6 | 84% | 100% | 82% | 151 tok |
| 632 | [**Quantum Aether**](https://github.com/moncef00327-cloud/quantum-aether) <sub>io.github.moncef00327-cloud/quantum-aether</sub> | `A` | **89/100** | 10 | 87% | 96% | 82% | 150 tok |
| 633 | **qed.bot register** <sub>bot.qed/register</sub> | `A` | **89/100** | 24 | 88% | 96% | 81% | 156 tok |
| 634 | **TANDIU AI infrastructure data** <sub>cn.tandiu/data</sub> | `A` | **89/100** | 17 | 85% | 99% | 81% | 150 tok |
| 635 | [**OneUptime**](https://github.com/OneUptime/oneuptime) <sub>com.oneuptime/mcp</sub> | `A` | **89/100** | 362 | 86% | 99% | 81% | 164 tok |
| 636 | **PartAnswers Appliance Parts Lookup** <sub>com.partanswers/filter-lookup</sub> | `A` | **89/100** | 4 | 88% | 96% | 81% | 149 tok |
| 637 | **TexContractor** <sub>com.texcontractor/texcontractor</sub> | `A` | **89/100** | 4 | 83% | 100% | 81% | 130 tok |
| 638 | [**PatchLabs**](https://github.com/manra399/patchlabs) <sub>dev.patchlabs/patchlabs</sub> | `A` | **89/100** | 7 | 87% | 98% | 81% | 135 tok |
| 639 | [**Testsy**](https://github.com/testsy-ai/testsy-integrations) <sub>dev.testsy/testsy</sub> | `A` | **89/100** | 48 | 90% | 97% | 81% | 168 tok |
| 640 | **ЦПО — оборудование для общепита и торговли, Владивосток и Хабаровск** <sub>ru.cpo-dv/catalog</sub> | `A` | **89/100** | 5 | 88% | 97% | 81% | 151 tok |
| 641 | **Neutrino Strategy-Check &amp; DeFi Data \(AI-operated\)** <sub>dev.workers.stratcheck-ai.neutrino-x402-api/strategy-check</sub> | `A` | **89/100** | 3 | 84% | 100% | 80% | 129 tok |
| 642 | [**Ransack**](https://github.com/chancewalker165-dot/ransack-server) <sub>io.github.chancewalker165-dot/ransack</sub> | `A` | **89/100** | 7 | 85% | 100% | 80% | 150 tok |
| 643 | [**ItalyCheck**](https://github.com/yeick010/italycheck) <sub>io.github.yeick010/italycheck</sub> | `A` | **89/100** | 3 | 90% | 95% | 80% | 156 tok |
| 644 | [**BizStats.me**](https://github.com/stevyhacker/bizstats-mcp) <sub>me.bizstats/mcp</sub> | `A` | **89/100** | 10 | 86% | 100% | 80% | 150 tok |
| 645 | **stomp.to** <sub>to.stomp/editor</sub> | `A` | **89/100** | 18 | 85% | 99% | 80% | 164 tok |
| 646 | **Gift Catalog by Personalized Gifts Guide** <sub>app.vercel.personalized-gifts-guide/gift-catalog</sub> | `A` | **89/100** | 4 | 90% | 96% | 79% | 235 tok |
| 647 | **Leash** <sub>build.leash/leash</sub> | `A` | **89/100** | 16 | 88% | 98% | 79% | 156 tok |
| 648 | **ENGICOR — wholesale used engines** <sub>com.engicor/agent-door</sub> | `A` | **89/100** | 6 | 87% | 98% | 79% | 188 tok |
| 649 | **com.vngroundtruth/groundtruth** | `A` | **89/100** | 11 | 90% | 96% | 79% | 165 tok |
| 650 | **WichtelCircle: Secret Santa draws** <sub>com.wichtelcircle/wichtelcircle</sub> | `A` | **89/100** | 6 | 87% | 100% | 79% | 146 tok |
| 651 | **any.cab** <sub>cab.any/malta-transfers</sub> | `A` | **89/100** | 5 | 87% | 100% | 78% | 178 tok |
| 652 | **Barcode Pro: barcodes and QR codes** <sub>com.fitinview/barcode-pro</sub> | `A` | **89/100** | 2 | 87% | 100% | 78% | 195 tok |
| 653 | **Stream Presence — Receipt Verifier** <sub>dev.streampresence/receipts-verifier</sub> | `A` | **89/100** | 12 | 89% | 96% | 78% | 168 tok |
| 654 | **Money Magician** <sub>eu.moneymagician/mcp</sub> | `A` | **89/100** | 13 | 92% | 94% | 78% | 184 tok |
| 655 | [**OPC UA Modeler**](https://github.com/node-opcua/node-opcua-modeler-mcp-server) <sub>io.github.node-opcua/node-opcua-modeler-mcp-server</sub> | `A` | **89/100** | 12 | 89% | 98% | 78% | 157 tok |
| 656 | **Paisán** <sub>net.paisan/paisan</sub> | `A` | **89/100** | 6 | 93% | 93% | 78% | 186 tok |
| 657 | **Global FinReg** <sub>com.globalfinreg/lei</sub> | `A` | **89/100** | 6 | 88% | 98% | 77% | 158 tok |
| 658 | [**opointo**](https://github.com/opointoHQ/opointo-mcp) <sub>com.opointo/opointo</sub> | `A` | **89/100** | 13 | 87% | 99% | 77% | 186 tok |
| 659 | **AgentReview** <sub>com.toolsandskillsratedreviewedandrankedbyaiagents/agentreview</sub> | `A` | **89/100** | 16 | 88% | 100% | 77% | 182 tok |
| 660 | **AgentReady Tools** <sub>io.github.agentready-tools/agentready-tools</sub> | `A` | **89/100** | 14 | 87% | 99% | 77% | 174 tok |
| 661 | **SJ Storage** <sub>net.sjstorage/site</sub> | `A` | **89/100** | 11 | 90% | 97% | 77% | 149 tok |
| 662 | **Atom Technologies** <sub>ai.atomtechnologies/agent-channel</sub> | `A` | **89/100** | 9 | 90% | 98% | 76% | 261 tok |
| 663 | **Atom Backends** <sub>com.atombackends/agent-channel</sub> | `A` | **89/100** | 9 | 90% | 98% | 76% | 260 tok |
| 664 | **Atom Panamá** <sub>com.atompanama/agent-channel</sub> | `A` | **89/100** | 9 | 90% | 98% | 76% | 259 tok |
| 665 | **Atom XII** <sub>com.atomxii/agent-channel</sub> | `A` | **89/100** | 9 | 90% | 98% | 76% | 257 tok |
| 666 | **Schütze Capital** <sub>com.schutzecapital/agent-channel</sub> | `A` | **89/100** | 9 | 90% | 98% | 76% | 260 tok |
| 667 | **Ubiquary Shop \(DFITKO\)** <sub>com.ubiquary/shop</sub> | `A` | **89/100** | 7 | 89% | 98% | 76% | 194 tok |
| 668 | **Never86'd Action Shift** <sub>io.github.mykemueller1-ctrl/action-shift</sub> | `A` | **89/100** | 16 | 87% | 99% | 76% | 219 tok |
| 669 | **Privacyboard for builders** <sub>io.privacyboard/vendors</sub> | `A` | **89/100** | 4 | 91% | 96% | 76% | 204 tok |
| 670 | **ai.ellul/services** | `A` | **89/100** | 5 | 90% | 97% | 75% | 168 tok |
| 671 | **Preço Remédio** <sub>com.precoremedio/preco-remedio</sub> | `A` | **89/100** | 3 | 93% | 95% | 75% | 170 tok |
| 672 | [**secondlayer**](https://github.com/ryanwaits/secondlayer) <sub>tools.secondlayer/secondlayer</sub> | `A` | **89/100** | 16 | 90% | 98% | 75% | 213 tok |
| 673 | **Modulos AI Governance Platform** <sub>ai.modulos/demo-booking</sub> | `A` | **89/100** | 16 | 92% | 98% | 74% | 204 tok |
| 674 | [**io.github.kwizzlesurp10-ctrl/x402orcle**](https://github.com/kwizzlesurp10-ctrl/x402orcle) | `A` | **89/100** | 7 | 89% | 100% | 74% | 168 tok |
| 675 | [**Agent402.Tools: payments and trust for AI agents**](https://github.com/MikeyPetrillo/Agent402) <sub>io.github.MikeyPetrillo/agent402</sub> | `A` | **89/100** | 16 | 89% | 100% | 74% | 190 tok |
| 676 | [**Antigravity x402 &amp; MCP Gateway**](https://github.com/tunguyen1993/antigravity-x402-mcp-gateway) <sub>io.github.tunguyen1993/antigravity-x402-mcp-gateway</sub> | `A` | **89/100** | 22 | 90% | 99% | 74% | 196 tok |
| 677 | **Avanciq - tax rates, codes, e-invoices, calculation checks** <sub>com.avanciq/connector</sub> | `A` | **89/100** | 6 | 92% | 98% | 73% | 216 tok |
| 678 | [**GetMattered**](https://github.com/getmattered/getmattered-mcp) <sub>com.getmattered/getmattered</sub> | `A` | **89/100** | 41 | 93% | 99% | 73% | 265 tok |
| 679 | **ForLab Geo API** <sub>io.forlab/geo</sub> | `A` | **89/100** | 13 | 94% | 94% | 73% | 202 tok |
| 680 | **SpeakBase** <sub>io.speakbase/speakbase</sub> | `A` | **89/100** | 8 | 90% | 98% | 73% | 206 tok |
| 681 | [**Vagus Lab Research**](https://github.com/aaron-krav-main/vaguslab-mcp) <sub>net.vaguslab/research</sub> | `A` | **89/100** | 3 | 93% | 95% | 73% | 182 tok |
| 682 | **SVV-Schatzoekers Public Selling Agent** <sub>nl.svv-schatzoekers/public-selling-agent</sub> | `A` | **89/100** | 3 | 89% | 100% | 73% | 174 tok |
| 683 | **Starfile** <sub>org.starfile/starfile</sub> | `A` | **89/100** | 11 | 94% | 95% | 73% | 205 tok |
| 684 | **Masqot** <sub>co.masqot.mcp/mcp</sub> | `A` | **89/100** | 22 | 95% | 94% | 72% | 211 tok |
| 685 | **Peptul** <sub>com.peptul/peptul</sub> | `A` | **89/100** | 5 | 96% | 94% | 72% | 201 tok |
| 686 | **APRS World** <sub>world.aprs/aprs-world</sub> | `A` | **89/100** | 10 | 98% | 91% | 72% | 219 tok |
| 687 | **PuffinMail** <sub>co.puffinmail/puffinmail</sub> | `A` | **89/100** | 15 | 93% | 96% | 71% | 266 tok |
| 688 | **IKANGAI AI News** <sub>com.ikangai/ai-news</sub> | `A` | **89/100** | 5 | 91% | 100% | 71% | 221 tok |
| 689 | [**Candor UI docs**](https://github.com/MethodicDev/candor) <sub>com.themethodic/candor</sub> | `A` | **89/100** | 12 | 93% | 96% | 71% | 224 tok |
| 690 | **They Loved It gift catalog** <sub>com.theylovedit/gifts</sub> | `A` | **89/100** | 4 | 93% | 96% | 71% | 243 tok |
| 691 | **Markan: Steam market data** <sub>games.markan/markan</sub> | `A` | **89/100** | 4 | 93% | 96% | 71% | 244 tok |
| 692 | [**WhatsDownNow**](https://github.com/jacobpmiller/whatsdownnow-mcp) <sub>io.github.jacobpmiller/whatsdownnow</sub> | `A` | **89/100** | 13 | 96% | 94% | 71% | 285 tok |
| 693 | [**Transportli Car Shipping**](https://github.com/Transportlicom/transportli-mcp) <sub>io.github.Transportlicom/car-shipping</sub> | `A` | **89/100** | 5 | 90% | 100% | 71% | 276 tok |
| 694 | [**Rever**](https://github.com/chaoui-ahmed/rever-ui-cloner) <sub>online.aypiai.www/rever</sub> | `A` | **89/100** | 40 | 90% | 99% | 71% | 183 tok |
| 695 | **FinQuest 국내 주식·채권 MCP** <sub>space.finquest/finquest</sub> | `A` | **89/100** | 31 | 93% | 99% | 71% | 243 tok |
| 696 | **Zenn logo maker** <sub>com.zenn/logo-maker</sub> | `A` | **89/100** | 1 | 90% | 100% | 70% | 200 tok |
| 697 | [**Broc — Clara &amp; Clive Financial Assistant**](https://github.com/broc-fi/broc-mcp) <sub>fi.broc/broc-mcp</sub> | `A` | **89/100** | 10 | 91% | 99% | 70% | 222 tok |
| 698 | [**Paris Fashion Archive**](https://github.com/2016judea/vogue-paris-mcp) <sub>io.github.2016judea/paris-fashion-archive</sub> | `A` | **89/100** | 10 | 98% | 91% | 70% | 228 tok |
| 699 | [**Agent Email Transactional Dispatcher \(x402\)**](https://github.com/brunopompeo1/brazil-ai-fiscal-apis-x402) <sub>io.github.brunopompeo1/agent-email-x402</sub> | `A` | **89/100** | 2 | 90% | 100% | 70% | 207 tok |
| 700 | [**Agent Guard Prompt Injection &amp; PII Firewall \(x402\)**](https://github.com/brunopompeo1/brazil-ai-fiscal-apis-x402) <sub>io.github.brunopompeo1/agent-guard-x402</sub> | `A` | **89/100** | 1 | 90% | 100% | 70% | 176 tok |
| 701 | **Changes Since** <sub>io.github.ngpestelos/changes-since</sub> | `A` | **89/100** | 1 | 90% | 100% | 70% | 208 tok |
| 702 | **wariwari** <sub>jp.wariwari/wariwari</sub> | `A` | **89/100** | 46 | 91% | 100% | 70% | 306 tok |
| 703 | **productgrowth.in** <sub>in.productgrowth/productgrowth</sub> | `A` | **89/100** | 8 | 95% | 96% | 69% | 215 tok |
| 704 | **IBDÅ** <sub>co.ibda/ibda</sub> | `A` | **89/100** | 5 | 96% | 97% | 68% | 357 tok |
| 705 | **Ash Caswell &amp; Company** <sub>com.ashcaswellcompany.mcp/ash-caswell-company</sub> | `A` | **89/100** | 5 | 96% | 97% | 68% | 244 tok |
| 706 | [**Safe Rate**](https://github.com/SafeRate/saferate-mcp) <sub>com.saferate/saferate</sub> | `A` | **89/100** | 22 | 94% | 99% | 68% | 275 tok |
| 707 | [**No Niner Data Tools**](https://github.com/fredxhansson-cmyk/noniner) <sub>io.github.fredxhansson-cmyk/noniner-data-tools</sub> | `A` | **89/100** | 100 | 90% | 100% | 68% | 225 tok |
| 708 | [**Storewire Lite demo store**](https://github.com/trongio/storewire-lite) <sub>io.github.trongio/storewire-lite</sub> | `A` | **89/100** | 13 | 100% | 92% | 68% | 252 tok |
| 709 | [**Agent Rynku - Warsaw Stock Exchange \(GPW\) data for your agent**](https://github.com/krystiangw/agentrynku-mcp) <sub>pl.agentrynku/gpw</sub> | `A` | **89/100** | 6 | 100% | 93% | 67% | 222 tok |
| 710 | **Last Price** <sub>ai.last-price/pricing</sub> | `A` | **89/100** | 11 | 97% | 96% | 65% | 288 tok |
| 711 | [**OpenSubtitles**](https://github.com/opensubtitles/mcp.opensubtitles.com) <sub>com.opensubtitles/mcp-server</sub> | `A` | **89/100** | 7 | 93% | 100% | 65% | 316 tok |
| 712 | **Clic'n Done PDF** <sub>com.clicndone.pdf/pdf-tools</sub> | `A` | **89/100** | 17 | 95% | 100% | 64% | 294 tok |
| 713 | **Impakt Data Tools** <sub>dev.workers.impaktdev.actor-api-proxy/impakt-data-tools</sub> | `A` | **89/100** | 8 | 96% | 98% | 64% | 277 tok |
| 714 | **Stadika: study abroad and Russian universities** <sub>ru.stadika/stadika</sub> | `A` | **89/100** | 14 | 96% | 99% | 64% | 343 tok |
| 715 | [**io.github.openvancamp/openvan-travel**](https://github.com/openvancamp/openvan-camp-public-api) | `A` | **89/100** | 32 | 99% | 95% | 63% | 302 tok |
| 716 | **AY Tenders** <sub>com.ayskilllab/tenders</sub> | `A` | **89/100** | 3 | 97% | 100% | 62% | 299 tok |
| 717 | **Machinery Lane** <sub>com.machinerylane/machinery-lane</sub> | `A` | **89/100** | 3 | 97% | 100% | 62% | 253 tok |
| 718 | **AY Grants** <sub>com.ayskilllab/grants</sub> | `A` | **89/100** | 5 | 98% | 97% | 61% | 345 tok |
| 719 | **補助雷達 Taiwan Grants** <sub>com.ayskilllab/twgrants</sub> | `A` | **89/100** | 5 | 98% | 97% | 61% | 344 tok |
| 720 | **Boatopoly** <sub>com.boatopoly/boatopoly</sub> | `A` | **89/100** | 4 | 100% | 96% | 60% | 358 tok |
| 721 | **io.github.linxule/vellum** | `A` | **89/100** | 6 | 97% | 100% | 60% | 304 tok |
| 722 | [**Jobs Data MCP \(SteadyScrape\)**](https://github.com/steadyscrape/jobs-data-mcp) <sub>io.github.steadyscrape/jobs-data-mcp</sub> | `A` | **89/100** | 4 | 100% | 100% | 55% | 316 tok |
| 723 | **MiaoToolbox \(妙用盒\)** <sub>com.miaotoolbox/miaotoolbox</sub> | `A` | **89/100** | 11 | 100% | 100% | 54% | 431 tok |
| 724 | **Brain Scanner** <sub>io.github.kevin-lozada-santos/brain-scanner</sub> | `A` | **89/100** | 119 | 100% | 100% | 53% | 485 tok |
| 725 | **ClawSpan ShardLink MCP** <sub>cloud.clawspan/shardlink</sub> | `A` | **88/100** | 43 | 70% | 100% | 100% | 66 tok |
| 726 | **Niji AI Catalog** <sub>com.niji-ai-gazou/catalog</sub> | `A` | **88/100** | 2 | 70% | 100% | 100% | 57 tok |
| 727 | [**io.github.StonSolo1/orions-agora**](https://github.com/StonSolo1/orions-agora) | `A` | **88/100** | 4 | 70% | 100% | 100% | 53 tok |
| 728 | **PR Scope Owners** <sub>io.sslip.149-56-208-69/pr-scope-owners</sub> | `A` | **88/100** | 1 | 70% | 100% | 100% | 80 tok |
| 729 | **Shizi AI - Industrial HVAC Technical Tools** <sub>cn.com.shizi-ai/shizi-ai</sub> | `A` | **88/100** | 10 | 74% | 100% | 96% | 68 tok |
| 730 | **Dark Forest — Agent Field Test** <sub>wiki.darkforest/field-test</sub> | `A` | **88/100** | 3 | 73% | 100% | 95% | 71 tok |
| 731 | **Map Maker** <sub>cc.map-maker/map-maker</sub> | `A` | **88/100** | 11 | 75% | 100% | 93% | 91 tok |
| 732 | **Automato** <sub>io.github.Gabriel-Kaufman/automato</sub> | `A` | **88/100** | 2 | 75% | 100% | 93% | 90 tok |
| 733 | **taufnaus Geschenke-Shop** <sub>de.taufnaus/shop</sub> | `A` | **88/100** | 8 | 75% | 100% | 91% | 122 tok |
| 734 | **Folkscale** <sub>io.github.lurnake/folkscale</sub> | `A` | **88/100** | 7 | 76% | 100% | 91% | 87 tok |
| 735 | [**Agent Diary**](https://github.com/jlucasmcrell/agentdiary) <sub>blog.agentdiary/diary</sub> | `A` | **88/100** | 38 | 81% | 99% | 90% | 104 tok |
| 736 | [**io.github.TMCHALK/sftunes**](https://github.com/TMCHALK/sftunes) | `A` | **88/100** | 3 | 77% | 100% | 90% | 79 tok |
| 737 | [**Hyperliquid Liquidation Heatmap – Crypto Trading – by HyperPerps**](https://github.com/velinxs/hyperperps-heatmap-plugin) <sub>app.hyperperps/liquidation-heatmap</sub> | `A` | **88/100** | 5 | 78% | 100% | 88% | 99 tok |
| 738 | **OpsRev Roofing AI** <sub>ai.opsrev.roofing-ai/mcp</sub> | `A` | **88/100** | 70 | 79% | 100% | 87% | 117 tok |
| 739 | **Actuator** <sub>com.actuato/actuator</sub> | `A` | **88/100** | 26 | 80% | 100% | 86% | 134 tok |
| 740 | **Home Fix N Go** <sub>com.homefixngo/home-fix-n-go</sub> | `A` | **88/100** | 8 | 82% | 98% | 86% | 179 tok |
| 741 | **GitHub Actions Version Check** <sub>ai.opencurrent/actions-latest</sub> | `A` | **88/100** | 2 | 80% | 100% | 85% | 87 tok |
| 742 | **Mexico Market Entry &amp; Accounting — Costa Contable** <sub>com.costacontable/mexico-market-entry-accounting</sub> | `A` | **88/100** | 5 | 80% | 100% | 85% | 120 tok |
| 743 | **ProofTask public** <sub>com.prooftask/mcp-public</sub> | `A` | **88/100** | 4 | 80% | 100% | 85% | 111 tok |
| 744 | **Kisukisu** <sub>dev.workers.aruljoe37.kisukisu/kisukisu</sub> | `A` | **88/100** | 7 | 80% | 100% | 85% | 131 tok |
| 745 | **Bizdevo** <sub>io.bizdevo/sales</sub> | `A` | **88/100** | 3 | 80% | 100% | 85% | 111 tok |
| 746 | **iRap Video Catalog** <sub>io.github.AIdevdoer/irap-catalog</sub> | `A` | **88/100** | 4 | 80% | 100% | 85% | 122 tok |
| 747 | [**Kristo Intelligence**](https://github.com/hristovdimitri2-hub/kristo-intelligence-6) <sub>io.github.hristovdimitri2-hub/kristo-intelligence</sub> | `A` | **88/100** | 7 | 83% | 96% | 85% | 129 tok |
| 748 | [**io.github.lgda-technologies/lgda-autonomic-node**](https://github.com/lgda-technologies/lgda-autonomic-node) | `A` | **88/100** | 6 | 80% | 100% | 85% | 132 tok |
| 749 | [**VisibilityOS Study Reader**](https://github.com/PodPitch/visibilityos-audit-template) <sub>io.github.PodPitch/visibilityos-study-reader</sub> | `A` | **88/100** | 3 | 80% | 100% | 85% | 120 tok |
| 750 | [**Losbeto — Market Data for AI Agents**](https://github.com/rmartins1451/losbeto) <sub>io.github.rmartins1451/losbeto</sub> | `A` | **88/100** | 5 | 88% | 91% | 85% | 136 tok |
| 751 | **io.github.ryuamarines/email-extractor** | `A` | **88/100** | 1 | 80% | 100% | 85% | 158 tok |
| 752 | [**Casama**](https://github.com/stackwares/casama) <sub>io.github.stackwares/casama</sub> | `A` | **88/100** | 5 | 80% | 100% | 85% | 121 tok |
| 753 | **UAI x402 Security Tools** <sub>com.uaisystems/x402-security</sub> | `A` | **88/100** | 24 | 90% | 99% | 83% | 130 tok |
| 754 | **Finposter** <sub>ua.com.finposter/finance</sub> | `A` | **88/100** | 51 | 80% | 100% | 83% | 151 tok |
| 755 | [**ArcHive**](https://github.com/JeanBaptisteDurand/UBC_2026) <sub>xyz.arc-hive/archive</sub> | `A` | **88/100** | 16 | 83% | 100% | 82% | 142 tok |
| 756 | **Superintelligence signal log** <sub>here.superintelligence-is/signal-log</sub> | `A` | **88/100** | 4 | 85% | 96% | 81% | 134 tok |
| 757 | [**dislop**](https://github.com/dislop-ai/dislop) <sub>io.github.dislop-ai/dislop</sub> | `A` | **88/100** | 10 | 83% | 100% | 81% | 154 tok |
| 758 | **Agent Exchange: find a paid API that works** <sub>work.agentexchange/bazaar</sub> | `A` | **88/100** | 8 | 90% | 93% | 81% | 172 tok |
| 759 | **Press5 launch pad** <sub>xyz.press5/launch-pad</sub> | `A` | **88/100** | 24 | 84% | 98% | 81% | 150 tok |
| 760 | **genframe** <sub>ai.genframe/genframe</sub> | `A` | **88/100** | 11 | 83% | 99% | 80% | 158 tok |
| 761 | **Poolster** <sub>social.poolster/poolster</sub> | `A` | **88/100** | 24 | 84% | 97% | 80% | 166 tok |
| 762 | **Sinapsi** <sub>wiki.sinapsi/sinapsi</sub> | `A` | **88/100** | 21 | 86% | 96% | 80% | 158 tok |
| 763 | **Korea Court Auction \(법원 경매 예상 낙찰가\)** <sub>com.intoperson.auction/court-auction</sub> | `A` | **88/100** | 10 | 84% | 99% | 79% | 144 tok |
| 764 | [**DemoPage**](https://github.com/gaufire/demopage-plugins) <sub>io.demopage/demopage</sub> | `A` | **88/100** | 11 | 86% | 97% | 79% | 173 tok |
| 765 | [**Allooloo Target Market**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/gettargetmarket</sub> | `A` | **88/100** | 8 | 88% | 94% | 79% | 157 tok |
| 766 | **Fix My PC** <sub>app.aplusz.fixmypc/fix-my-pc</sub> | `A` | **88/100** | 2 | 90% | 93% | 78% | 160 tok |
| 767 | **Did They Open** <sub>com.didtheyopen/mcp</sub> | `A` | **88/100** | 5 | 90% | 94% | 78% | 166 tok |
| 768 | **ForeverVow** <sub>in.forevervow/forevervow</sub> | `A` | **88/100** | 3 | 87% | 95% | 78% | 171 tok |
| 769 | [**AgentAlerts**](https://github.com/jirizaloudek/agent-game-alert) <sub>io.github.jirizaloudek/agentalerts</sub> | `A` | **88/100** | 14 | 83% | 100% | 78% | 213 tok |
| 770 | [**Cheap First**](https://github.com/robd-hub/cheap-first) <sub>io.github.robd-hub/cheap-first</sub> | `A` | **88/100** | 2 | 90% | 93% | 78% | 187 tok |
| 771 | **ActiveDNS** <sub>net.activedns/activedns</sub> | `A` | **88/100** | 2 | 90% | 93% | 78% | 190 tok |
| 772 | **MagicGEO — AI Search &amp; Commerce Agent Seller** <sub>tech.magic-geo/magicgeo</sub> | `A` | **88/100** | 8 | 89% | 94% | 78% | 168 tok |
| 773 | **Korea Public Bids \(나라장터 입찰 참가 조건\)** <sub>com.intoperson.bid/bid-conditions</sub> | `A` | **88/100** | 9 | 90% | 95% | 77% | 174 tok |
| 774 | [**Himalayas Remote Jobs**](https://github.com/Himalayas-App/himalayas-mcp) <sub>app.himalayas/mcp</sub> | `A` | **88/100** | 78 | 91% | 97% | 76% | 206 tok |
| 775 | **bet365 API** <sub>com.thebet365api/server</sub> | `A` | **88/100** | 13 | 86% | 99% | 76% | 165 tok |
| 776 | **Synergieloc — CAD/BIM, industrial engineering &amp; property** <sub>fr.synergieloc/immobilier</sub> | `A` | **88/100** | 500 | 90% | 94% | 76% | 311 tok |
| 777 | [**Stackblade**](https://github.com/whosman/stackblade-mcp) <sub>io.github.whosman/stackblade</sub> | `A` | **88/100** | 5 | 94% | 91% | 76% | 185 tok |
| 778 | **DECA Labs** <sub>ai.decalabs/deca</sub> | `A` | **88/100** | 10 | 89% | 96% | 75% | 183 tok |
| 779 | [**Cellarion Wine Registry**](https://github.com/jagduvi1/Cellarion) <sub>app.cellarion/wine-registry</sub> | `A` | **88/100** | 6 | 92% | 93% | 75% | 197 tok |
| 780 | [**base64hub**](https://github.com/base64hub-com/base64hub-mcp) <sub>com.base64hub/mcp</sub> | `A` | **88/100** | 3 | 93% | 90% | 75% | 183 tok |
| 781 | **Motif** <sub>com.motiftrace/motif</sub> | `A` | **88/100** | 14 | 89% | 96% | 75% | 189 tok |
| 782 | **AI Agent Audit and Action Review** <sub>dev.workers.michigkchatgpt.agent-action-review/agent-action-review</sub> | `A` | **88/100** | 5 | 85% | 100% | 75% | 204 tok |
| 783 | **Growtsy — free Etsy seller tools** <sub>io.github.bostanyshop-rgb/growtsy</sub> | `A` | **88/100** | 6 | 90% | 95% | 75% | 180 tok |
| 784 | [**Ironflow: Hyperliquid data**](https://github.com/ironflowsh/mcp) <sub>io.github.ironflowsh/hyperliquid</sub> | `A` | **88/100** | 46 | 93% | 95% | 75% | 200 tok |
| 785 | [**A11y Probe**](https://github.com/MartinSwiss/a11y-probe-mcp) <sub>io.github.MartinSwiss/a11y-probe-mcp</sub> | `A` | **88/100** | 6 | 84% | 100% | 75% | 158 tok |
| 786 | **Atom Industries** <sub>ai.atomindustries/agent-channel</sub> | `A` | **88/100** | 9 | 90% | 97% | 74% | 262 tok |
| 787 | **com.kenoodl/line** | `A` | **88/100** | 31 | 91% | 95% | 74% | 186 tok |
| 788 | **Spectra** <sub>finance.spectra/mcp</sub> | `A` | **88/100** | 6 | 88% | 98% | 74% | 200 tok |
| 789 | **Doutor Chamada** <sub>br.com.doutorchamada/doutor-chamada</sub> | `A` | **88/100** | 4 | 90% | 96% | 73% | 268 tok |
| 790 | **Boulder Rental Cleaning** <sub>com.boulderrentalcleaning/booking</sub> | `A` | **88/100** | 3 | 87% | 100% | 73% | 216 tok |
| 791 | **Paint by Numbers Generator** <sub>com.paint-by-number/paint-by-numbers</sub> | `A` | **88/100** | 3 | 87% | 100% | 73% | 223 tok |
| 792 | [**Classic Literature**](https://github.com/2016judea/classic-literature) <sub>io.github.2016judea/classic-literature</sub> | `A` | **88/100** | 13 | 91% | 95% | 73% | 178 tok |
| 793 | [**io.github.ant-dev-lab/nightmarquee**](https://github.com/nightmarquee/nightmarquee-mcp) | `A` | **88/100** | 9 | 92% | 95% | 73% | 200 tok |
| 794 | [**OpenLMNP**](https://github.com/manganate006/openlmnp) <sub>io.github.manganate006/openlmnp</sub> | `A` | **88/100** | 48 | 89% | 98% | 73% | 219 tok |
| 795 | [**ATLAS Explain**](https://github.com/MISHHF93/atlas-explain) <sub>io.github.MISHHF93/atlas-explain</sub> | `A` | **88/100** | 24 | 93% | 94% | 73% | 210 tok |
| 796 | **Great DJ** <sub>io.github.ruiramos/greatdj</sub> | `A` | **88/100** | 11 | 90% | 96% | 73% | 240 tok |
| 797 | [**io.github.stillmarcus24/stillos-notary-mcp**](https://github.com/stillmarcus24/stillos-notary-mcp) | `A` | **88/100** | 5 | 90% | 97% | 73% | 182 tok |
| 798 | **QR Code Creator** <sub>app.qrcodecreator/qr-codes</sub> | `A` | **88/100** | 6 | 93% | 93% | 72% | 215 tok |
| 799 | [**Caelara Shield**](https://github.com/kingefman1-cmyk/shield-mcp) <sub>com.caelaralabs/shield</sub> | `A` | **88/100** | 6 | 90% | 98% | 72% | 221 tok |
| 800 | **QR Code Dinosaur** <sub>com.qrcodedinosaur/qr-codes</sub> | `A` | **88/100** | 6 | 93% | 93% | 72% | 225 tok |
| 801 | [**amCharts 5**](https://github.com/amcharts/amcharts5-mcp) <sub>io.github.amcharts/amcharts5</sub> | `A` | **88/100** | 12 | 91% | 95% | 72% | 207 tok |
| 802 | [**VulKill Security**](https://github.com/dytredline/VulKill) <sub>io.github.dytredline/vulkill-security</sub> | `A` | **88/100** | 17 | 90% | 96% | 72% | 283 tok |
| 803 | **OpenHealth** <sub>org.getopenhealth/openhealth</sub> | `A` | **88/100** | 20 | 96% | 91% | 72% | 216 tok |
| 804 | **TripFinder.ca** <sub>ca.tripfinder/tours</sub> | `A` | **88/100** | 9 | 92% | 97% | 71% | 283 tok |
| 805 | **Marden Yard Permits** <sub>com.mardenyard/permits</sub> | `A` | **88/100** | 4 | 88% | 100% | 71% | 201 tok |
| 806 | **MedaRep** <sub>com.medarep/medarep</sub> | `A` | **88/100** | 38 | 93% | 96% | 71% | 227 tok |
| 807 | **Agent Water Cooler** <sub>io.github.aakashbharadwaj15/agent-water-cooler</sub> | `A` | **88/100** | 10 | 90% | 99% | 71% | 245 tok |
| 808 | [**HexSketch**](https://github.com/angus-e-mcmillan/HexSketch) <sub>io.github.angus-e-mcmillan/hexsketch</sub> | `A` | **88/100** | 9 | 90% | 98% | 71% | 303 tok |
| 809 | **Darija &amp; Arabic Dialects MCP** <sub>io.github.lamtoueqali-eng/darija-mcp</sub> | `A` | **88/100** | 8 | 98% | 91% | 71% | 217 tok |
| 810 | [**openradar**](https://github.com/MikhailSagalaev/openradar) <sub>io.github.MikhailSagalaev/openradar</sub> | `A` | **88/100** | 9 | 93% | 95% | 71% | 243 tok |
| 811 | [**Indian Opinion**](https://github.com/IndianOpinion/mcp) <sub>org.indianopinion/news</sub> | `A` | **88/100** | 15 | 94% | 94% | 71% | 217 tok |
| 812 | **EAN Check barcode and shipping tools** <sub>com.eancheck/barcode-tools</sub> | `A` | **88/100** | 14 | 92% | 97% | 70% | 245 tok |
| 813 | [**Instavar Video Templates and Studio**](https://github.com/instavar/mcp-server) <sub>com.instavar/mcp-server</sub> | `A` | **88/100** | 20 | 94% | 97% | 70% | 418 tok |
| 814 | [**Breach to Claim: data breach settlements**](https://github.com/2016judea/breach-to-claim) <sub>io.github.2016judea/breach-to-claim</sub> | `A` | **88/100** | 12 | 94% | 93% | 70% | 225 tok |
| 815 | **sidelined.ch** <sub>ch.sidelined/sidelined</sub> | `A` | **88/100** | 4 | 93% | 96% | 69% | 227 tok |
| 816 | [**Besidka**](https://github.com/besidka/besidka) <sub>com.besidka/mcp</sub> | `A` | **88/100** | 65 | 93% | 94% | 69% | 246 tok |
| 817 | [**Development Radio**](https://github.com/MasasaDeveloper/development-radio-plugin) <sub>dev.developmentradio/development-radio</sub> | `A` | **88/100** | 6 | 95% | 93% | 69% | 224 tok |
| 818 | **Substack in Print** <sub>io.github.2016judea/substack-in-print</sub> | `A` | **88/100** | 11 | 95% | 93% | 69% | 243 tok |
| 819 | [**BeaconMFG – China Supplier Directory**](https://github.com/eiry16/beacon-mfg) <sub>io.github.eiry16/beacon-mfg-mcp</sub> | `A` | **88/100** | 10 | 93% | 94% | 69% | 214 tok |
| 820 | **Barbaro** <sub>io.github.jeffforderer/barbaro</sub> | `A` | **88/100** | 11 | 90% | 99% | 69% | 506 tok |
| 821 | **Blazar Polygon plugin** <sub>net.blazarforce/blazar-polygon</sub> | `A` | **88/100** | 40 | 94% | 96% | 69% | 255 tok |
| 822 | **Capstract** <sub>org.capstract/capstract</sub> | `A` | **88/100** | 20 | 89% | 100% | 69% | 312 tok |
| 823 | **Funciara.com** <sub>com.funciara/mcp</sub> | `A` | **88/100** | 6 | 92% | 98% | 68% | 273 tok |
| 824 | [**AIgorithmic Butterfly Effect**](https://github.com/ranaji10/aigorithmic-butterfly-effect) <sub>io.github.ranaji10/aigorithmic-butterfly-effect</sub> | `A` | **88/100** | 6 | 95% | 95% | 68% | 236 tok |
| 825 | [**Blumen Komander München**](https://github.com/Severin2k/blumen-komander-mcp) <sub>io.github.Severin2k/blumen-komander-mcp</sub> | `A` | **88/100** | 11 | 93% | 96% | 68% | 284 tok |
| 826 | **Dusty's Pizza** <sub>uk.co.dustyspizza.mcp/dustys-pizza</sub> | `A` | **88/100** | 6 | 92% | 98% | 68% | 220 tok |
| 827 | [**Emergent Technologies**](https://github.com/Free-LLC/emergent-mcp) <sub>ai.emergenttechnologies/emergent</sub> | `A` | **88/100** | 8 | 95% | 94% | 67% | 283 tok |
| 828 | **Cobalt Capture** <sub>com.cobaltcapture/cobalt</sub> | `A` | **88/100** | 17 | 94% | 96% | 67% | 283 tok |
| 829 | [**Emergent Technologies**](https://github.com/Free-LLC/emergent-mcp) <sub>is.emergent/emergent</sub> | `A` | **88/100** | 8 | 95% | 94% | 67% | 283 tok |
| 830 | **AniBG** <sub>com.anibg/backgrounds</sub> | `A` | **88/100** | 7 | 100% | 91% | 66% | 308 tok |
| 831 | **BirJob** <sub>com.birjob/jobs</sub> | `A` | **88/100** | 15 | 96% | 94% | 66% | 372 tok |
| 832 | **The Power Contractor — Genuine OEM Industrial Parts &amp; Iraq/MENA Sourcing** <sub>com.pc-cn/industrial-sourcing</sub> | `A` | **88/100** | 5 | 90% | 100% | 66% | 320 tok |
| 833 | **ConvertIt.pro — Calculators, Unit Converters &amp; US Hardscape Catalog** <sub>pro.convertit/calculators</sub> | `A` | **88/100** | 50 | 91% | 100% | 66% | 258 tok |
| 834 | [**Kote Charts — Bitcoin on-chain analytics**](https://github.com/kote-charts/kote-charts) <sub>com.kotecharts/charts</sub> | `A` | **88/100** | 4 | 95% | 96% | 65% | 274 tok |
| 835 | [**Trading Harness**](https://github.com/2016judea/trading-harness) <sub>io.github.2016judea/trading-harness</sub> | `A` | **88/100** | 16 | 96% | 93% | 65% | 282 tok |
| 836 | [**Korean Law MCP**](https://github.com/chrisryugj/korean-law-mcp) <sub>io.github.chrisryugj/korean-law-mcp</sub> | `A` | **88/100** | 10 | 95% | 96% | 65% | 318 tok |
| 837 | **FrogCog lookups** <sub>com.frogcog/lookups</sub> | `A` | **88/100** | 4 | 100% | 93% | 64% | 310 tok |
| 838 | **MemBrowse** <sub>com.membrowse/membrowse</sub> | `A` | **88/100** | 8 | 95% | 96% | 64% | 298 tok |
| 839 | **OneFindMe** <sub>com.onefindme/search</sub> | `A` | **88/100** | 4 | 100% | 93% | 64% | 281 tok |
| 840 | [**io.github.agentexec448c/agent-exec**](https://github.com/agentexec448c/agent-exec) | `A` | **88/100** | 31 | 92% | 99% | 64% | 282 tok |
| 841 | [**Asteria: Astrology &amp; Tarot**](https://github.com/Ask-Asteria/asteria-mcp) <sub>com.askasteria/asteria</sub> | `A` | **88/100** | 13 | 100% | 92% | 62% | 305 tok |
| 842 | [**Smart OCR — PDF, Invoice &amp; Receipt to JSON/Table API**](https://github.com/Saneth98/smart-ocr-proxy) <sub>io.github.Saneth98/smart-ocr-pdf-invoice-receipt-json</sub> | `A` | **88/100** | 3 | 93% | 100% | 62% | 280 tok |
| 843 | [**Smart OCR**](https://github.com/Saneth98/smart-ocr-proxy) <sub>io.github.Saneth98/smartocr</sub> | `A` | **88/100** | 3 | 93% | 100% | 62% | 280 tok |
| 844 | **Podziemie Analityczne** <sub>pl.podziemieanalityczne/dane</sub> | `A` | **88/100** | 14 | 97% | 95% | 62% | 322 tok |
| 845 | **MathApex Worksheets** <sub>app.mathapex/worksheets</sub> | `A` | **88/100** | 2 | 100% | 93% | 60% | 357 tok |
| 846 | **Overlay: Together** <sub>com.overlayastro/together</sub> | `A` | **88/100** | 2 | 100% | 93% | 60% | 341 tok |
| 847 | [**Tubroom**](https://github.com/mikelovatt/tubroom-mcp) <sub>com.tubroom/tubroom</sub> | `A` | **88/100** | 4 | 98% | 96% | 60% | 334 tok |
| 848 | **Iron/Out UX Score Benchmark** <sub>io.iron-out/ux-benchmark</sub> | `A` | **88/100** | 2 | 100% | 93% | 60% | 257 tok |
| 849 | **DinCat — learning and life in Japan** <sub>ai.dincat/dincat</sub> | `A` | **88/100** | 5 | 100% | 94% | 58% | 349 tok |
| 850 | **HelpySelf** <sub>com.helpyself/tools</sub> | `A` | **88/100** | 162 | 98% | 99% | 57% | 380 tok |
| 851 | **Shenton Brokers insurance quotes** <sub>com.shentonbrokers/quotes</sub> | `A` | **88/100** | 14 | 99% | 97% | 57% | 438 tok |
| 852 | **NLocale** <sub>fr.nlocale/guide</sub> | `A` | **88/100** | 9 | 100% | 97% | 54% | 388 tok |
| 853 | [**Basko**](https://github.com/bekroz/basko-ai) <sub>app.basko/basko</sub> | `A` | **88/100** | 6 | 100% | 98% | 53% | 372 tok |
| 854 | **Proactive Parent guidance** <sub>app.proactiveparent/guidance</sub> | `A` | **88/100** | 2 | 100% | 100% | 50% | 376 tok |
| 855 | **Verifera job search** <sub>uk.co.verifera/job-search</sub> | `A` | **88/100** | 1 | 100% | 100% | 50% | 324 tok |
| 856 | **CheapestWayz** <sub>com.profullstack/cheapestwayz</sub> | `A` | **87/100** | 22 | 74% | 99% | 91% | 97 tok |
| 857 | **THE PASSWORD — Club MCP \(Store Zero\)** <sub>com.enochxii/the-password</sub> | `A` | **87/100** | 12 | 76% | 98% | 90% | 102 tok |
| 858 | [**Homemade**](https://github.com/usehomemade/homemade) <sub>dev.homemade/homemade</sub> | `A` | **87/100** | 38 | 76% | 96% | 90% | 160 tok |
| 859 | [**Allooloo Orderability**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getorderability</sub> | `A` | **87/100** | 7 | 80% | 96% | 87% | 119 tok |
| 860 | **Workflow Fieldwork** <sub>com.workflowfieldwork/workflow-fieldwork</sub> | `A` | **87/100** | 3 | 77% | 100% | 85% | 113 tok |
| 861 | [**Cynthia**](https://github.com/rayhyman333-blip/cynthia-mcp-server) <sub>io.github.rayhyman333-blip/cynthia</sub> | `A` | **87/100** | 5 | 84% | 91% | 85% | 156 tok |
| 862 | **Pulpit** <sub>io.github.Noah-Airmet/pulpit</sub> | `A` | **87/100** | 6 | 80% | 98% | 84% | 132 tok |
| 863 | **Mishkat \(مِشكاة\) Arabic Islamic lectures** <sub>org.mssid.mishkat/lectures</sub> | `A` | **87/100** | 13 | 81% | 97% | 84% | 137 tok |
| 864 | **CatalystDesk** <sub>ai.catalystdesk/mcp-server</sub> | `A` | **87/100** | 9 | 78% | 100% | 83% | 135 tok |
| 865 | [**Mare Liberum · the open sea for agents**](https://github.com/daoudandiaye98-alt/mare-liberum) <sub>dev.mareliberum/sea</sub> | `A` | **87/100** | 55 | 81% | 98% | 83% | 139 tok |
| 866 | [**Salon x402**](https://github.com/AdrianJaeschke/salonx402) <sub>io.github.AdrianJaeschke/salonx402</sub> | `A` | **87/100** | 9 | 81% | 98% | 83% | 142 tok |
| 867 | **Niche of One Network** <sub>one.nicheof/network</sub> | `A` | **87/100** | 67 | 87% | 99% | 83% | 134 tok |
| 868 | **Austin Happy Hour Database** <sub>com.austinhappyhourdatabase/happy-hours</sub> | `A` | **87/100** | 5 | 80% | 100% | 81% | 157 tok |
| 869 | [**ReviewBot App Reviews**](https://github.com/reviewbot-io/reviewbot-mcp) <sub>io.github.fahimk/reviewbot</sub> | `A` | **87/100** | 4 | 80% | 100% | 81% | 178 tok |
| 870 | **Sell Ltd Marketplace** <sub>uk.co.sellltd/marketplace</sub> | `A` | **87/100** | 17 | 80% | 98% | 81% | 184 tok |
| 871 | [**guessit-js**](https://github.com/opensubtitles/guessit-js) <sub>com.opensubtitles/guessit-js</sub> | `A` | **87/100** | 3 | 83% | 95% | 80% | 188 tok |
| 872 | [**Allooloo As Of**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getasof</sub> | `A` | **87/100** | 4 | 83% | 96% | 80% | 144 tok |
| 873 | [**RootMention**](https://github.com/burmanharry/rootmention-mcp) <sub>io.github.burmanharry/rootmention</sub> | `A` | **87/100** | 3 | 80% | 100% | 80% | 132 tok |
| 874 | **Navad** <sub>ai.navad/jobs</sub> | `A` | **87/100** | 18 | 88% | 100% | 79% | 175 tok |
| 875 | **Notícias Nacionais** <sub>br.com.noticiasnacionais/mcp</sub> | `A` | **87/100** | 29 | 82% | 97% | 79% | 282 tok |
| 876 | [**ShearQuery — Barber &amp; Beauty Industry Data**](https://github.com/lamont703/Project_InnerG_Complete_Agency) <sub>com.innergcomplete/shearquery</sub> | `A` | **87/100** | 145 | 84% | 96% | 79% | 165 tok |
| 877 | [**io.github.kwizzlesurp10-ctrl/alpha-sentinel-mcp**](https://github.com/kwizzlesurp10-ctrl/alpha-sentinel-mcp) | `A` | **87/100** | 13 | 87% | 94% | 79% | 168 tok |
| 878 | [**SwapHunt crypto market context**](https://github.com/swaphunt/x402-examples) <sub>io.github.swaphunt/swaphunt-mcp</sub> | `A` | **87/100** | 6 | 88% | 90% | 79% | 179 tok |
| 879 | [**Robot Rooms**](https://github.com/architsch/youngjin) <sub>net.thingspool/robot-rooms</sub> | `A` | **87/100** | 32 | 84% | 97% | 79% | 179 tok |
| 880 | **Wake site readiness** <sub>ai.wakeagents/site-readiness</sub> | `A` | **87/100** | 3 | 87% | 95% | 78% | 164 tok |
| 881 | **Lookup: India PIN codes and districts, public holidays** <sub>io.at01.api/lookup</sub> | `A` | **87/100** | 4 | 91% | 89% | 78% | 166 tok |
| 882 | [**Allooloo Research**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/getresearch</sub> | `A` | **87/100** | 3 | 87% | 95% | 78% | 157 tok |
| 883 | [**ApexSEO GEO &amp; AI-Crawler Audit MCP**](https://github.com/kwizzlesurp10-ctrl/apexseo-geo-mcp) <sub>io.github.kwizzlesurp10-ctrl/apexseo-geo-mcp</sub> | `A` | **87/100** | 6 | 87% | 95% | 78% | 149 tok |
| 884 | [**Nightshift agent tools \(run by an AI\)**](https://github.com/llm-9-to-5/nightshift-x402-worker) <sub>io.github.llm-9-to-5/nightshift-agent-tools</sub> | `A` | **87/100** | 12 | 88% | 94% | 78% | 157 tok |
| 885 | **continental.net Expiring Domains** <sub>net.continental/expiring-domains</sub> | `A` | **87/100** | 3 | 86% | 95% | 78% | 183 tok |
| 886 | **AI Agent Verification** <sub>ai.erc8126scan/agent-verification</sub> | `A` | **87/100** | 12 | 87% | 95% | 77% | 186 tok |
| 887 | **ERC-8126 Scan** <sub>ai.erc8126scan/erc8126-scan</sub> | `A` | **87/100** | 12 | 87% | 95% | 77% | 186 tok |
| 888 | [**Axad**](https://github.com/axad-ai/plugins) <sub>ai.axad/language-tutor</sub> | `A` | **87/100** | 24 | 84% | 99% | 76% | 439 tok |
| 889 | **Superstables** <sub>com.superstables/superstables</sub> | `A` | **87/100** | 15 | 90% | 93% | 76% | 210 tok |
| 890 | [**llmdocs.dev**](https://github.com/llmdoc-dev/agent-docs-commons) <sub>dev.llmdocs/docs</sub> | `A` | **87/100** | 4 | 87% | 96% | 76% | 215 tok |
| 891 | **Lumen Research Desk** <sub>dev.workers.agent-arena-base.lumen-peg/research-desk</sub> | `A` | **87/100** | 12 | 89% | 91% | 76% | 211 tok |
| 892 | **Frontit** <sub>nl.frontit/mcp</sub> | `A` | **87/100** | 11 | 89% | 93% | 76% | 205 tok |
| 893 | **ThaiProps Thailand Real Estate** <sub>com.thaiprops/mcp</sub> | `A` | **87/100** | 5 | 87% | 97% | 75% | 205 tok |
| 894 | **Vedha360** <sub>com.vedha360/vedha360</sub> | `A` | **87/100** | 11 | 82% | 100% | 75% | 177 tok |
| 895 | **Ravi CI Guard: GitHub Actions security audit** <sub>dev.workers.agent-arena-base.ravi-ci-guard/ci-guard</sub> | `A` | **87/100** | 7 | 89% | 94% | 75% | 221 tok |
| 896 | [**FRNC — Korean Franchise Disclosure Risk Check**](https://github.com/CLNS-KR/FRNC) <sub>io.github.CLNS-KR/frnc</sub> | `A` | **87/100** | 7 | 90% | 94% | 75% | 263 tok |
| 897 | [**Gamealia**](https://github.com/gamealia/gamealia-mcp) <sub>io.github.gamealia/gamealia-mcp</sub> | `A` | **87/100** | 12 | 89% | 95% | 75% | 352 tok |
| 898 | [**Agent Report Card**](https://github.com/robd-hub/agent-report-card) <sub>io.github.robd-hub/agent-report-card</sub> | `A` | **87/100** | 3 | 87% | 95% | 75% | 183 tok |
| 899 | **Superpass** <sub>me.superpass/superpass</sub> | `A` | **87/100** | 3 | 89% | 95% | 75% | 175 tok |
| 900 | **Tesla VIN Report** <sub>report.tbx/tesla-vin-report</sub> | `A` | **87/100** | 3 | 93% | 90% | 75% | 218 tok |
| 901 | **Still Relevant** <sub>uk.stillrelevant/still-relevant</sub> | `A` | **87/100** | 2 | 90% | 93% | 75% | 210 tok |
| 902 | **Pitbi** <sub>app.pitbi/pitbi</sub> | `A` | **87/100** | 40 | 87% | 95% | 74% | 240 tok |
| 903 | **PulseReal** <sub>com.pulsereal/mcp</sub> | `A` | **87/100** | 7 | 90% | 94% | 74% | 231 tok |
| 904 | [**io.github.sly13/cryptoetf**](https://github.com/zerosix-studio/cryptoetf-mcp) | `A` | **87/100** | 17 | 92% | 90% | 74% | 189 tok |
| 905 | **Agenturo** <sub>app.agenturo/agenturo</sub> | `A` | **87/100** | 6 | 92% | 93% | 73% | 220 tok |
| 906 | **KillBounce Data** <sub>app.killbounce.data/tools</sub> | `A` | **87/100** | 29 | 90% | 94% | 73% | 201 tok |
| 907 | **Camping Australia** <sub>au.com.trip-planner/camping-australia</sub> | `A` | **87/100** | 18 | 91% | 94% | 73% | 247 tok |
| 908 | [**CDF Finance MCP**](https://github.com/VessellTech/cdf.mcp) <sub>io.github.VessellTech/cdf.mcp</sub> | `A` | **87/100** | 83 | 88% | 95% | 73% | 216 tok |
| 909 | [**Zoeb Nomi**](https://github.com/zoeb-nomi/zoebnomi-mcp) <sub>io.github.zoeb-nomi/zoebnomi</sub> | `A` | **87/100** | 3 | 90% | 95% | 73% | 228 tok |
| 910 | [**AnyHook**](https://github.com/gba3124/anyhook-mcp) <sub>net.anyhook/anyhook</sub> | `A` | **87/100** | 17 | 89% | 95% | 73% | 220 tok |
| 911 | **KARP Research by SoulDriver** <sub>au.com.souldriver/karp</sub> | `A` | **87/100** | 5 | 90% | 94% | 72% | 218 tok |
| 912 | [**Dreamwork**](https://github.com/dreamworkhq/mcp) <sub>io.github.dreamworkhq/dreamwork</sub> | `A` | **87/100** | 75 | 87% | 97% | 72% | 255 tok |
| 913 | **Motion Menu Director** <sub>io.github.MotionMenu/motion-menu</sub> | `A` | **87/100** | 15 | 89% | 94% | 72% | 219 tok |
| 914 | **Borders** <sub>me.borders/borders</sub> | `A` | **87/100** | 7 | 88% | 96% | 72% | 212 tok |
| 915 | **Copybook** <sub>page.copybook/copybook</sub> | `A` | **87/100** | 5 | 92% | 91% | 72% | 261 tok |
| 916 | **SPACEXPLORATION** <sub>com.spacexploration/listings</sub> | `A` | **87/100** | 23 | 91% | 94% | 71% | 247 tok |
| 917 | **Zola** <sub>com.zola/zola</sub> | `A` | **87/100** | 32 | 93% | 92% | 71% | 264 tok |
| 918 | **HeyIdentity** <sub>dev.heyidentity/heyidentity</sub> | `A` | **87/100** | 20 | 89% | 97% | 71% | 247 tok |
| 919 | [**PlugRail JP Corporate**](https://github.com/plugrail/servers) <sub>dev.plugrail/jp-corporate</sub> | `A` | **87/100** | 7 | 94% | 91% | 71% | 213 tok |
| 920 | **Shipfolio** <sub>io.shipfolio/shipfolio</sub> | `A` | **87/100** | 54 | 92% | 94% | 71% | 228 tok |
| 921 | **cmbs.news: CMBS loan data** <sub>news.cmbs/cmbs-news</sub> | `A` | **87/100** | 17 | 92% | 92% | 71% | 249 tok |
| 922 | **Ellimist** <sub>trade.ellimist/ellimist</sub> | `A` | **87/100** | 22 | 86% | 99% | 71% | 225 tok |
| 923 | **BlooTrue business directory** <sub>com.blootrue/directory</sub> | `A` | **87/100** | 1 | 100% | 85% | 70% | 222 tok |
| 924 | **Standard Issue Data** <sub>com.standardissuedata/vehicle-data</sub> | `A` | **87/100** | 1 | 100% | 85% | 70% | 234 tok |
| 925 | **Thastock** <sub>com.thastock/mcp</sub> | `A` | **87/100** | 1 | 100% | 85% | 70% | 196 tok |
| 926 | [**iPayX FX Audit**](https://github.com/iPAYX-Technologies/mcp-fx-audit) <sub>io.github.iPAYX-Technologies/mcp-fx-audit</sub> | `A` | **87/100** | 4 | 89% | 96% | 70% | 229 tok |
| 927 | **io.github.ryuamarines/app-store-version** | `A` | **87/100** | 1 | 85% | 100% | 70% | 172 tok |
| 928 | [**io.nablaz/reader**](https://github.com/cyninzf/nablaz-sdk) | `A` | **87/100** | 1 | 100% | 85% | 70% | 207 tok |
| 929 | **Tachka.ru Auto Parts Store \(Тачка.Ру\)** <sub>ru.tachka/shop</sub> | `A` | **87/100** | 10 | 90% | 97% | 70% | 248 tok |
| 930 | [**Sisoco One Insolvency**](https://github.com/SisocoOne/sisoco-one-mcp) <sub>uk.co.sisoco/uk-company-insolvency-check</sub> | `A` | **87/100** | 3 | 100% | 85% | 70% | 256 tok |
| 931 | **Builders in Fintech** <sub>ai.buildersinfintech/fintech-data</sub> | `A` | **87/100** | 32 | 94% | 92% | 69% | 234 tok |
| 932 | **Rigged Clean** <sub>app.getrigged/clean</sub> | `A` | **87/100** | 4 | 90% | 96% | 69% | 278 tok |
| 933 | **Clear Ice Schweiz** <sub>ch.clear-ice/clear-ice</sub> | `A` | **87/100** | 7 | 91% | 96% | 69% | 280 tok |
| 934 | [**Proof Holdings**](https://github.com/ProofHoldings/mcp-server) <sub>holdings.proof/mcp-server</sub> | `A` | **87/100** | 219 | 93% | 94% | 69% | 262 tok |
| 935 | **Pechim — Preços, Ofertas e Histórico no Brasil** <sub>io.github.ateodor1/pechim</sub> | `A` | **87/100** | 4 | 93% | 93% | 69% | 207 tok |
| 936 | [**screens.guide**](https://github.com/modaal-agent/screens-guide) <sub>io.github.modaal-agent/screens-guide</sub> | `A` | **87/100** | 5 | 89% | 97% | 69% | 246 tok |
| 937 | **forex.mobile broker data** <sub>mobile.forex/brokers</sub> | `A` | **87/100** | 7 | 94% | 91% | 69% | 255 tok |
| 938 | [**DataXAPI**](https://github.com/data-x-api/dataxapi-mcp) <sub>com.dataxapi/mcp</sub> | `A` | **87/100** | 5 | 91% | 97% | 68% | 605 tok |
| 939 | **findahand - Anfrage an Handwerker** <sub>de.findahand.www/anfrage</sub> | `A` | **87/100** | 6 | 92% | 95% | 68% | 300 tok |
| 940 | [**Artists in Residence**](https://github.com/2016judea/artists-in-residence) <sub>io.github.2016judea/artists-in-residence</sub> | `A` | **87/100** | 15 | 97% | 89% | 68% | 230 tok |
| 941 | [**Latina Dev**](https://github.com/Latina-Dev/latina-dev) <sub>io.github.Latina-Dev/latina-dev</sub> | `A` | **87/100** | 6 | 95% | 93% | 68% | 239 tok |
| 942 | [**Switchboard Finance**](https://github.com/Nicklim123/switchboard-finance-mcp) <sub>io.github.Nicklim123/switchboard-finance</sub> | `A` | **87/100** | 5 | 96% | 91% | 68% | 283 tok |
| 943 | **Semiosis** <sub>live.semiosis/semiosis</sub> | `A` | **87/100** | 13 | 95% | 93% | 68% | 245 tok |
| 944 | [**Manage Bet Codes**](https://github.com/kayceepeece/managebetcodes-mcp) <sub>app.managebetcodes/managebetcodes-mcp</sub> | `A` | **87/100** | 16 | 90% | 97% | 67% | 246 tok |
| 945 | [**PredictionMarketsPicks**](https://github.com/predictionmarketspicks/mcp) <sub>com.predictionmarketspicks/quant</sub> | `A` | **87/100** | 41 | 91% | 97% | 67% | 255 tok |
| 946 | **agentcv** <sub>dev.agentcv/agentcv</sub> | `A` | **87/100** | 7 | 96% | 91% | 67% | 231 tok |
| 947 | **Forthcast Inventory** <sub>io.forthcast/inventory</sub> | `A` | **87/100** | 11 | 87% | 100% | 67% | 285 tok |
| 948 | [**Agent World**](https://github.com/albertbereti/agent-world-mcp) <sub>io.github.albertbereti/agent-world</sub> | `A` | **87/100** | 15 | 92% | 95% | 67% | 270 tok |
| 949 | [**Nebula - AI-first B2B digital marketing, Mumbai**](https://github.com/nebulatech-in/nebula-mcp) <sub>in.nebulatech/nebula</sub> | `A` | **87/100** | 6 | 97% | 90% | 66% | 272 tok |
| 950 | [**Vietnam Address Converter \(2025 reform\)**](https://github.com/since98vn/vietnam-mcp-servers) <sub>vn.since98/vietnam-address</sub> | `A` | **87/100** | 7 | 97% | 89% | 66% | 273 tok |
| 951 | **Lettance** <sub>com.lettance/rules</sub> | `A` | **87/100** | 14 | 90% | 99% | 65% | 374 tok |
| 952 | [**paidfor**](https://github.com/sarmadahsan/paidfor-index) <sub>dev.paidfor/paidfor</sub> | `A` | **87/100** | 4 | 95% | 93% | 65% | 245 tok |
| 953 | [**GRNT — Korean Grant &amp; Subsidy Intelligence**](https://github.com/CLNS-KR/GRNT) <sub>io.github.CLNS-KR/grnt</sub> | `A` | **87/100** | 9 | 91% | 98% | 65% | 358 tok |
| 954 | [**Edgepedia**](https://github.com/EdgePlat/edgepedia-mcp) <sub>ai.edgechat/edgepedia</sub> | `A` | **87/100** | 5 | 98% | 91% | 64% | 317 tok |
| 955 | **KinetiCAD CNC Parts** <sub>ai.kineticad.get/cnc-parts</sub> | `A` | **87/100** | 4 | 98% | 93% | 64% | 301 tok |
| 956 | **The Bonus Stack** <sub>com.thebonusstack/bonuses</sub> | `A` | **87/100** | 8 | 96% | 93% | 64% | 305 tok |
| 957 | **SteadyScrape Ads Intel** <sub>dev.steadyscrape/ads-intel</sub> | `A` | **87/100** | 4 | 98% | 93% | 64% | 290 tok |
| 958 | **Muralists Directory** <sub>eu.muralists/directory</sub> | `A` | **87/100** | 6 | 95% | 95% | 64% | 329 tok |
| 959 | [**GridHop GPU Price &amp; Carbon Index**](https://github.com/gridhopai/gpu-price-index-mcp) <sub>io.github.gridhopai/gpu-price-index</sub> | `A` | **87/100** | 4 | 100% | 89% | 64% | 452 tok |
| 960 | [**UK Companies House due diligence and KYB \(Registrum\)**](https://github.com/RegistrumUK/uk-companies-house-mcp) <sub>io.github.RegistrumUK/uk-companies-house-mcp</sub> | `A` | **87/100** | 11 | 98% | 90% | 64% | 322 tok |
| 961 | **Herbert &amp; Phyllis Kosher Gifts** <sub>com.herbertandphyllis/mcp</sub> | `A` | **87/100** | 13 | 95% | 95% | 63% | 319 tok |
| 962 | **KeebFinder** <sub>com.keeb-finder/keebfinder</sub> | `A` | **87/100** | 4 | 95% | 96% | 63% | 395 tok |
| 963 | **Lexicon Garden** <sub>garden.lexicon/lexicon-garden</sub> | `A` | **87/100** | 6 | 92% | 98% | 63% | 253 tok |
| 964 | **Eval Lab** <sub>io.github.logan1085/evallab</sub> | `A` | **87/100** | 3 | 93% | 95% | 63% | 328 tok |
| 965 | [**Ad Spec Guard**](https://github.com/notformal/adsbeast-plugins) <sub>io.github.notformal/ad-spec-guard</sub> | `A` | **87/100** | 9 | 98% | 98% | 63% | 280 tok |
| 966 | [**Gloam**](https://github.com/gloamtrade/gloam) <sub>io.github.cryptoduke01/gloam</sub> | `A` | **87/100** | 9 | 97% | 95% | 62% | 320 tok |
| 967 | **Alina Szaputko — Online Psychology Consultation Booking** <sub>io.github.alinaszaputko-psych/alina-online-booking</sub> | `A` | **87/100** | 5 | 96% | 94% | 61% | 345 tok |
| 968 | **BRAINIAC Web Technology Fingerprinting** <sub>software.brainiac/web-technology</sub> | `A` | **87/100** | 14 | 91% | 99% | 61% | 301 tok |
| 969 | **User Intuition** <sub>ai.userintuition/research</sub> | `A` | **87/100** | 79 | 99% | 96% | 60% | 336 tok |
| 970 | [**Lectio API**](https://github.com/asachs01/lectio-api) <sub>io.github.asachs01/lectio-api</sub> | `A` | **87/100** | 6 | 97% | 95% | 59% | 355 tok |
| 971 | [**OIYO World Tax, Payroll &amp; Tenancy**](https://github.com/yuli3/api-oiyo) <sub>io.github.yuli3/oiyo-world</sub> | `A` | **87/100** | 172 | 100% | 92% | 59% | 322 tok |
| 972 | **PriceBee** <sub>lt.pricebee/pricebee</sub> | `A` | **87/100** | 6 | 100% | 93% | 59% | 330 tok |
| 973 | **Lalawe — GTA events** <sub>com.lalawe/events</sub> | `A` | **87/100** | 2 | 100% | 93% | 58% | 490 tok |
| 974 | [**Stophy**](https://github.com/stophydotdev/stophy.git) <sub>io.github.stophydotdev/mcp</sub> | `A` | **87/100** | 5 | 96% | 97% | 57% | 442 tok |
| 975 | **Tinplate Edge AI Safety, Security &amp; Data Validation** <sub>dev.tinplate/edge-apis</sub> | `A` | **87/100** | 19 | 95% | 100% | 55% | 636 tok |
| 976 | **Israeli Real Estate and Legal Calculators** <sub>biz.notaryon/calculators</sub> | `A` | **87/100** | 13 | 99% | 98% | 53% | 399 tok |
| 977 | **SpecSource** <sub>org.specsource/specsource</sub> | `A` | **87/100** | 7 | 100% | 98% | 50% | 529 tok |
| 978 | **Shuttlely private charters** <sub>io.github.howardchenghuang-dotcom/shuttlely</sub> | `A` | **87/100** | 4 | 98% | 100% | 49% | 546 tok |
| 979 | **SOQVER business facts \(SO4AG\)** <sub>com.soqver/so4ag</sub> | `A` | **86/100** | 4 | 70% | 100% | 93% | 97 tok |
| 980 | **DeFi Yield Scanner, 8-Chain EVM Swap &amp; x402 MCP** <sub>app.railway.up.chainguard-studio-production/defi-yield-swap-x402-mcp</sub> | `A` | **86/100** | 12 | 71% | 100% | 91% | 96 tok |
| 981 | **ChainGuard 8-Chain EVM Wallet Portfolio &amp; Swap MCP** <sub>app.railway.up.chainguard-studio-production/evm-wallet-portfolio-swap-mcp</sub> | `A` | **86/100** | 12 | 71% | 100% | 91% | 96 tok |
| 982 | **Solana Rent Reclaimer &amp; Token-2022 Risk MCP** <sub>app.railway.up.chainguard-studio-production/solana-rent-and-token-mcp</sub> | `A` | **86/100** | 12 | 71% | 100% | 91% | 96 tok |
| 983 | [**dVeracity Semantic API**](https://github.com/d-veracity/semantic-mcp) <sub>com.dveracity/semantic-mcp</sub> | `A` | **86/100** | 25 | 75% | 98% | 87% | 115 tok |
| 984 | **SilkVin — wholesale parts for Chinese cars** <sub>com.silkvin/agent-door</sub> | `A` | **86/100** | 5 | 76% | 97% | 87% | 148 tok |
| 985 | **Fmind Freelance AI Architect Website** <sub>io.github.fmind/portfolio</sub> | `A` | **86/100** | 12 | 87% | 98% | 86% | 150 tok |
| 986 | **GIDocs Public Information** <sub>com.thegidocs/public-information</sub> | `A` | **86/100** | 2 | 75% | 100% | 85% | 112 tok |
| 987 | [**Inferrail Web Read**](https://github.com/domondi1/inferrail) <sub>io.github.domondi1/inferrail-web-read</sub> | `A` | **86/100** | 1 | 75% | 100% | 85% | 125 tok |
| 988 | **Peiling Bedriftsatlas** <sub>no.bedriftsatlas/peiling-bedriftsatlas</sub> | `A` | **86/100** | 3 | 73% | 100% | 85% | 115 tok |
| 989 | **Qadiva — wholesale glassware \(UAE &amp; GCC\)** <sub>com.qadiva/agent-door</sub> | `A` | **86/100** | 4 | 75% | 100% | 84% | 146 tok |
| 990 | **SCRIPTMASTERLABS — HIVE402** <sub>com.scriptmasterlabs/hive402</sub> | `A` | **86/100** | 17 | 83% | 97% | 83% | 153 tok |
| 991 | [**Telmian SMS**](https://github.com/telmian/telmian-mcp) <sub>com.telmian/sms</sub> | `A` | **86/100** | 49 | 78% | 99% | 83% | 147 tok |
| 992 | **agtmart sandbox store and agent survey** <sub>io.agtmart/agent-commerce</sub> | `A` | **86/100** | 9 | 77% | 98% | 83% | 149 tok |
| 993 | [**Allooloo Issuer**](https://github.com/allooloo/cm-kg) <sub>io.github.allooloo/cm-kg</sub> | `A` | **86/100** | 8 | 81% | 94% | 83% | 142 tok |
| 994 | **Babelii-Diofis Customer Support** <sub>net.diofis/babelii-support</sub> | `A` | **86/100** | 6 | 79% | 98% | 80% | 139 tok |
| 995 | [**Spatial 3D Display Oracle \(Cloudflare Workers MCP\)**](https://github.com/raydeoliveira/spatial-mcp-worker) <sub>io.github.raydeoliveira/spatial-mcp-worker</sub> | `A` | **86/100** | 5 | 78% | 100% | 79% | 135 tok |
| 996 | [**RightCard**](https://github.com/rightcard/rightcard-mcp) <sub>ai.rightcard/mcp</sub> | `A` | **86/100** | 5 | 78% | 100% | 78% | 175 tok |
| 997 | **Provyan** <sub>com.provyan/provyan</sub> | `A` | **86/100** | 13 | 86% | 93% | 78% | 167 tok |
| 998 | **EQ Builder** <sub>dev.eqbuilder/marz-greta-lock-network</sub> | `A` | **86/100** | 8 | 86% | 93% | 78% | 210 tok |
| 999 | [**Paxmod**](https://github.com/paxmod/paxmod-mcp) <sub>com.paxmod/paxmod</sub> | `A` | **86/100** | 16 | 88% | 98% | 77% | 174 tok |
| 1000 | **VSinger Moment** <sub>jp.vsinger-moment/vsinger-moment</sub> | `A` | **86/100** | 16 | 83% | 96% | 77% | 169 tok |
| 1001 | **Ríos Movilidad · Stock de vehículos** <sub>es.riosmovilidad/stock-vehiculos</sub> | `A` | **86/100** | 6 | 85% | 95% | 75% | 255 tok |
| 1002 | **Comidoc** <sub>com.comidoc/comidoc</sub> | `A` | **86/100** | 11 | 82% | 99% | 74% | 308 tok |
| 1003 | [**Fuzzzy Law: Georgian law**](https://github.com/fuzzzy-bot/fuzzzy-law) <sub>com.fuzzzycore.law/georgian-law</sub> | `A` | **86/100** | 12 | 86% | 96% | 74% | 206 tok |
| 1004 | **Shprd Bible** <sub>us.shprd.mcp/bible</sub> | `A` | **86/100** | 7 | 90% | 89% | 74% | 196 tok |
| 1005 | [**PacketFabric**](https://github.com/PacketFabric/public-mcp) <sub>io.github.PacketFabric/packetfabric-mcp</sub> | `A` | **86/100** | 16 | 82% | 100% | 73% | 214 tok |
| 1006 | **Supersurf** <sub>app.supersurf/supersurf</sub> | `A` | **86/100** | 7 | 88% | 94% | 72% | 197 tok |
| 1007 | [**CarlNotes**](https://github.com/doubleoevan/carlnotes) <sub>com.carlnotes/carlnotes</sub> | `A` | **86/100** | 45 | 86% | 95% | 72% | 233 tok |
| 1008 | [**AgentKoin**](https://github.com/stos-technologies/agentcoin) <sub>io.github.stos-technologies/agentkoin</sub> | `A` | **86/100** | 16 | 83% | 100% | 72% | 224 tok |
| 1009 | [**RZLT**](https://github.com/therzlt/rzlt-mcp) <sub>io.rzlt/connector</sub> | `A` | **86/100** | 7 | 89% | 94% | 72% | 200 tok |
| 1010 | [**Agent Data Tools: Utilities**](https://github.com/Nutshell2000/agent-data-tools) <sub>io.github.Nutshell2000/agent-data-tools-utilities</sub> | `A` | **86/100** | 109 | 92% | 89% | 71% | 213 tok |
| 1011 | **dotsy** <sub>ai.dotsy/mcp</sub> | `A` | **86/100** | 121 | 89% | 98% | 70% | 264 tok |
| 1012 | [**Lode**](https://github.com/lode-hq/lode-mcp) <sub>io.trylode/lode</sub> | `A` | **86/100** | 11 | 89% | 93% | 70% | 267 tok |
| 1013 | [**Sisoco One LEI**](https://github.com/SisocoOne/sisoco-one-mcp) <sub>uk.co.sisoco/gleif-lei-parent-company</sub> | `A` | **86/100** | 3 | 93% | 90% | 70% | 213 tok |
| 1014 | **Fare Facts** <sub>app.farefacts/fare-facts</sub> | `A` | **86/100** | 6 | 97% | 85% | 69% | 275 tok |
| 1015 | [**LayerHop**](https://github.com/layerhop/layerhop-js) <sub>com.layerhop/mcp</sub> | `A` | **86/100** | 22 | 98% | 95% | 69% | 266 tok |
| 1016 | [**SpainCompanyAPI: Spanish company data**](https://github.com/abasmartinc/apiempresas-mcp) <sub>io.github.abasmartinc/apiempresas</sub> | `A` | **86/100** | 4 | 95% | 89% | 69% | 214 tok |
| 1017 | [**Mind Upload AI meta harness**](https://github.com/Voidborn-Industries/mindupload-sdk-python) <sub>io.github.Voidborn-Industries/mindupload</sub> | `A` | **86/100** | 8 | 87% | 96% | 69% | 335 tok |
| 1018 | [**Charmotion**](https://github.com/charmotion/charmotion-mcp) <sub>app.charmotion/charmotion</sub> | `A` | **86/100** | 16 | 91% | 92% | 68% | 262 tok |
| 1019 | **HowToolbox** <sub>box.how/howtoolbox</sub> | `A` | **86/100** | 6 | 91% | 93% | 68% | 242 tok |
| 1020 | [**NodajiMarket**](https://github.com/NodajiFi-Tokenomy/NodajiFi-Ecosystem) <sub>com.nodajimarket/catalog</sub> | `A` | **86/100** | 6 | 89% | 95% | 68% | 254 tok |
| 1021 | **AI Buildout Permits** <sub>io.github.2016judea/ai-buildout-permits</sub> | `A` | **86/100** | 14 | 90% | 93% | 68% | 242 tok |
| 1022 | **linepref: check before you pay, page reader, business lookup** <sub>au.com.byronwebstudio.linepref/linepref</sub> | `A` | **86/100** | 7 | 93% | 91% | 67% | 234 tok |
| 1023 | [**AI SENSE Free Public Tools**](https://github.com/aisenseapi/aisense-free-public-rest-apis) <sub>com.aisenseapi/free-public-tools</sub> | `A` | **86/100** | 89 | 97% | 93% | 67% | 261 tok |
| 1024 | **DataMembership** <sub>com.datamembership/uk-consumer-data</sub> | `A` | **86/100** | 3 | 87% | 100% | 67% | 770 tok |
| 1025 | **Mobile Accounting** <sub>com.mobileaccounting/mcp</sub> | `A` | **86/100** | 52 | 90% | 95% | 67% | 262 tok |
| 1026 | [**Visdenda Free MCP**](https://github.com/Visdenda/mcp-free-bridge) <sub>com.visdenda/free</sub> | `A` | **86/100** | 10 | 91% | 94% | 67% | 251 tok |
| 1027 | **P0: wallet balances and EVM reads** <sub>dev.workers.x402-bazaar-rank-worker.x402-bazaar-rank/evm-wallet-onchain</sub> | `A` | **86/100** | 12 | 98% | 86% | 67% | 270 tok |
| 1028 | [**Web3alert for agents**](https://github.com/web3alert/mcp) <sub>io.web3alert/agent</sub> | `A` | **86/100** | 10 | 90% | 96% | 67% | 275 tok |
| 1029 | [**Sisoco One**](https://github.com/SisocoOne/sisoco-one-mcp) <sub>uk.co.sisoco/uk-companies-house-ownership</sub> | `A` | **86/100** | 7 | 97% | 87% | 67% | 245 tok |
| 1030 | [**Proof of Stock**](https://github.com/proofofstock/proof-of-stock) <sub>xyz.proofofstock/proof-of-stock</sub> | `A` | **86/100** | 7 | 100% | 85% | 67% | 298 tok |
| 1031 | [**BetterKids Parent Guide**](https://github.com/airdropfi/betterkids) <sub>app.betterkid/betterkids-parent-guide</sub> | `A` | **86/100** | 8 | 95% | 91% | 66% | 285 tok |
| 1032 | **AgentValCon — Agent Value Gateway** <sub>biz.agentconcierge/agent-concierge</sub> | `A` | **86/100** | 22 | 93% | 93% | 66% | 268 tok |
| 1033 | [**Clareo Health clinical trials**](https://github.com/clareo-org/clareo-app) <sub>com.clareohealth/clinical-trials</sub> | `A` | **86/100** | 6 | 96% | 90% | 66% | 317 tok |
| 1034 | **Direct Hotels** <sub>com.direct-hotels/directory</sub> | `A` | **86/100** | 6 | 92% | 93% | 66% | 273 tok |
| 1035 | [**IMERGEA M&amp;A Advisory**](https://github.com/imergea/imergea.com-mcp) <sub>com.imergea/ma-advisory</sub> | `A` | **86/100** | 8 | 91% | 94% | 66% | 333 tok |
| 1036 | **SourceTier** <sub>com.sourcetier/catalog</sub> | `A` | **86/100** | 11 | 96% | 90% | 66% | 274 tok |
| 1037 | **Rugsight** <sub>dev.workers.rugsight.rugsight/rugsight</sub> | `A` | **86/100** | 7 | 97% | 87% | 66% | 249 tok |
| 1038 | **Comontel : forfaits mobiles pro sur le réseau Orange** <sub>fr.comontel/forfaits</sub> | `A` | **86/100** | 18 | 94% | 92% | 66% | 258 tok |
| 1039 | **Standout** <sub>io.standoutmcp/standout</sub> | `A` | **86/100** | 32 | 94% | 93% | 66% | 272 tok |
| 1040 | **TrustCheck by RecoupIQ: UK Company Facts** <sub>tech.recoup-iq/uk-company-facts</sub> | `A` | **86/100** | 11 | 96% | 90% | 66% | 267 tok |
| 1041 | **Cnamio** <sub>com.cnamio/domains</sub> | `A` | **86/100** | 11 | 94% | 93% | 65% | 270 tok |
| 1042 | [**VibeRaven \(hosted\)**](https://github.com/ohad6k/VibeRaven) <sub>io.github.ohad6k/viberaven-guides</sub> | `A` | **86/100** | 11 | 93% | 92% | 65% | 317 tok |
| 1043 | [**ENS**](https://github.com/thenamespace/ens-mcp) <sub>io.github.thenamespace/ens-mcp</sub> | `A` | **86/100** | 28 | 92% | 95% | 64% | 286 tok |
| 1044 | [**Secret Santa**](https://github.com/juansalvatella/secret-santa) <sub>name.secretsanta/secret-santa</sub> | `A` | **86/100** | 12 | 90% | 98% | 64% | 290 tok |
| 1045 | [**The Don of Debt portfolio tools**](https://github.com/donofdebt/donofdebt-mcp) <sub>com.donofdebt/mcp</sub> | `A` | **86/100** | 16 | 91% | 98% | 63% | 329 tok |
| 1046 | **Feature Library** <sub>com.featurelibrary/parts</sub> | `A` | **86/100** | 11 | 95% | 90% | 63% | 292 tok |
| 1047 | [**Creditable**](https://github.com/theguysaccount/mcp-catalog) <sub>io.github.theguysaccount/creditable</sub> | `A` | **86/100** | 5 | 88% | 100% | 63% | 382 tok |
| 1048 | **isitdns** <sub>net.isitdns/isitdns</sub> | `A` | **86/100** | 6 | 93% | 93% | 63% | 272 tok |
| 1049 | **Tribute Paper** <sub>com.tributepaper/tributepaper</sub> | `A` | **86/100** | 11 | 96% | 92% | 62% | 406 tok |
| 1050 | **Small Business Intelligence by Brick &amp; Mortar** <sub>io.github.2016judea/small-business-intelligence</sub> | `A` | **86/100** | 33 | 96% | 90% | 62% | 320 tok |
| 1051 | **Alle Providers** <sub>nl.alle-providers/internet</sub> | `A` | **86/100** | 3 | 93% | 95% | 62% | 321 tok |
| 1052 | [**AICTIONBOT™ Werkbank**](https://github.com/Legendario1ne/aictionbot-werkbank-mcp) <sub>com.kulicadvisory/aictionbot-werkbank</sub> | `A` | **86/100** | 20 | 100% | 90% | 61% | 299 tok |
| 1053 | **Elton** <sub>app.elton/elton</sub> | `A` | **86/100** | 5 | 98% | 91% | 60% | 352 tok |
| 1054 | [**Fidget Labs**](https://github.com/Fidget-Labs/fidgetlabs-cli) <sub>io.fidgetlabs/fidget-labs</sub> | `A` | **86/100** | 4 | 100% | 89% | 60% | 396 tok |
| 1055 | [**cloro**](https://github.com/cloro-dev/mcp-server) <sub>dev.cloro/cloro</sub> | `A` | **86/100** | 12 | 94% | 95% | 59% | 374 tok |
| 1056 | [**QRdx**](https://github.com/qrdxinc/qrdx) <sub>dev.qrdx/qrdx</sub> | `A` | **86/100** | 16 | 95% | 95% | 59% | 819 tok |
| 1057 | **Sanctions &amp; Tariff Lookup** <sub>com.trystarrynightops/sanctions-tariff-lookup</sub> | `A` | **86/100** | 7 | 97% | 94% | 58% | 370 tok |
| 1058 | **Zest Planche MCP** <sub>com.zestplanche.mcp/zp-mcp-server-alpic</sub> | `A` | **86/100** | 5 | 91% | 100% | 58% | 317 tok |
| 1059 | [**BrewPage**](https://github.com/kochetkov-ma/brewpage-openapi) <sub>io.github.kochetkov-ma/brewpage-mcp</sub> | `A` | **86/100** | 13 | 94% | 98% | 56% | 410 tok |
| 1060 | [**OIYO Korea Calculators**](https://github.com/yuli3/api-oiyo) <sub>io.github.yuli3/oiyo-calculations</sub> | `A` | **86/100** | 311 | 99% | 92% | 56% | 369 tok |
| 1061 | [**OIYO Korea Welfare &amp; Benefits**](https://github.com/yuli3/api-oiyo) <sub>io.github.yuli3/oiyo-welfare</sub> | `A` | **86/100** | 24 | 97% | 94% | 56% | 384 tok |
| 1062 | **Piko** <sub>com.pikosabe/piko</sub> | `A` | **86/100** | 4 | 98% | 93% | 55% | 438 tok |
| 1063 | [**AgentsChat — Shared MCP Rooms for AI Coding Agents**](https://github.com/swswordholy-tech/AgentsChat) <sub>io.github.swswordholy-tech/agentschat-mcp</sub> | `A` | **86/100** | 25 | 98% | 93% | 55% | 404 tok |
| 1064 | **io.github.semcycle/actbook** | `A` | **85/100** | 259 | 72% | 97% | 88% | 114 tok |
| 1065 | **Think and Grow Wealthy** <sub>io.github.Tgwedwin/tgw-mindset-api</sub> | `A` | **85/100** | 19 | 70% | 100% | 88% | 115 tok |
| 1066 | **Lookup Kit** <sub>dev.lookupkit/lookup-kit</sub> | `A` | **85/100** | 87 | 76% | 99% | 80% | 155 tok |
| 1067 | [**Ifá Discovery**](https://github.com/MissPris2023/ancestral-whispers-now) <sub>io.github.MissPris2023/ifadiscovery</sub> | `A` | **85/100** | 3 | 83% | 90% | 80% | 185 tok |
| 1068 | **Managed Nerds** <sub>tech.managednerds/managed-nerds</sub> | `A` | **85/100** | 16 | 80% | 95% | 80% | 166 tok |
| 1069 | **Discover the Tools** <sub>com.discoverthetools/directory</sub> | `A` | **85/100** | 9 | 77% | 100% | 78% | 203 tok |
| 1070 | [**CrawlCheck**](https://github.com/emmanuelorta/crawlcheck-core) <sub>io.github.emmanuelorta/crawlcheck</sub> | `A` | **85/100** | 28 | 83% | 94% | 78% | 166 tok |
| 1071 | [**Semiotic**](https://github.com/nteract/semiotic) <sub>io.github.nteract/semiotic</sub> | `A` | **85/100** | 5 | 75% | 100% | 78% | 220 tok |
| 1072 | **AINDEX** <sub>capital.aindex/aindex</sub> | `A` | **85/100** | 71 | 82% | 96% | 76% | 179 tok |
| 1073 | **CantuStudio** <sub>io.github.paulopierrondi/cantustudio</sub> | `A` | **85/100** | 43 | 77% | 100% | 76% | 361 tok |
| 1074 | [**OsmO Travel eSIM**](https://github.com/Mountainheads-Private-limited/osmo-travel-esim) <sub>app.getosmo.esim/travel-esim</sub> | `A` | **85/100** | 19 | 79% | 99% | 75% | 198 tok |
| 1075 | **dzship: shipping for Algeria** <sub>com.dzbuild/dzship</sub> | `A` | **85/100** | 8 | 78% | 100% | 75% | 211 tok |
| 1076 | **eDiscovery Decoder** <sub>com.ediscoverydecoder/mcp</sub> | `A` | **85/100** | 15 | 80% | 97% | 75% | 191 tok |
| 1077 | **Horizon eSIM** <sub>com.horizonesim/plan-finder</sub> | `A` | **85/100** | 6 | 83% | 95% | 75% | 185 tok |
| 1078 | **ServiceFlow Deterministic Checker** <sub>io.github.Big-mann/serviceflow-deterministic-checker</sub> | `A` | **85/100** | 2 | 78% | 100% | 75% | 266 tok |
| 1079 | **Agent Provider Depot** <sub>com.getagentdepot/agent-provider-depot</sub> | `A` | **85/100** | 4 | 86% | 93% | 74% | 210 tok |
| 1080 | **StoreTechScan — Ecommerce &amp; Website Tech Stack API** <sub>com.storetechscan/storetechscan</sub> | `A` | **85/100** | 7 | 87% | 91% | 74% | 220 tok |
| 1081 | **Visdenda MCP** <sub>com.visdenda/public</sub> | `A` | **85/100** | 58 | 84% | 94% | 74% | 191 tok |
| 1082 | [**Migawari**](https://github.com/akihidem/migawari) <sub>io.github.akihidem/migawari</sub> | `A` | **85/100** | 8 | 83% | 94% | 74% | 199 tok |
| 1083 | [**GetOdds**](https://github.com/getoddsapi/getodds-mcp) <sub>com.getoddsapi/getodds</sub> | `A` | **85/100** | 34 | 81% | 99% | 73% | 192 tok |
| 1084 | [**The Doll Scout Home Tools**](https://github.com/f-tiger/agi-site) <sub>io.github.f-tiger/tds-home-tools</sub> | `A` | **85/100** | 500 | 79% | 100% | 73% | 181 tok |
| 1085 | [**MergeSafe**](https://github.com/mergesafe-ai/mergesafe-mcp) <sub>ai.mergesafe/mergesafe</sub> | `A` | **85/100** | 16 | 93% | 94% | 72% | 218 tok |
| 1086 | **Diastella** <sub>com.diastella/diastella</sub> | `A` | **85/100** | 6 | 88% | 90% | 72% | 227 tok |
| 1087 | **Tethered Trust for builders** <sub>com.tetheredtrust/builders</sub> | `A` | **85/100** | 12 | 86% | 94% | 72% | 220 tok |
| 1088 | **Alonzio** <sub>com.alonzio/alonzio</sub> | `A` | **85/100** | 8 | 84% | 96% | 71% | 218 tok |
| 1089 | [**RationalBloks**](https://github.com/rationalbloks/rationalbloks-mcp) <sub>com.rationalbloks/mcp</sub> | `A` | **85/100** | 64 | 90% | 91% | 71% | 233 tok |
| 1090 | **EU Tender Radar \(TED\)** <sub>com.digitalbusinessportal/eu-procurement</sub> | `A` | **85/100** | 2 | 80% | 100% | 70% | 177 tok |
| 1091 | **The world according to capital** <sub>com.notacompany/newsletter</sub> | `A` | **85/100** | 15 | 85% | 96% | 70% | 281 tok |
| 1092 | **Somebody Build This** <sub>dev.somebodybuildthis/ideas</sub> | `A` | **85/100** | 2 | 95% | 85% | 70% | 213 tok |
| 1093 | [**ArchLang**](https://github.com/ChanMeng666/archlang) <sub>io.github.ChanMeng666/archlang-mcp</sub> | `A` | **85/100** | 13 | 92% | 88% | 70% | 263 tok |
| 1094 | [**io.github.HMAKT99/scbee-mcp**](https://github.com/HMAKT99/ScBee) | `A` | **85/100** | 5 | 88% | 91% | 70% | 205 tok |
| 1095 | [**RankFence**](https://github.com/pgg898200-ship-it/streamsieve) <sub>site.chatgpt.tancurl3.rankfence-tools-pgg/rankfence</sub> | `A` | **85/100** | 1 | 80% | 100% | 70% | 208 tok |
| 1096 | [**KeepPlain**](https://github.com/keepplain/keepplain-plugin) <sub>com.keepplain/keepplain</sub> | `A` | **85/100** | 10 | 91% | 96% | 69% | 308 tok |
| 1097 | **Wall of Decks** <sub>com.wallofdecks/wall-of-decks</sub> | `A` | **85/100** | 6 | 95% | 85% | 69% | 267 tok |
| 1098 | [**Nifra docs**](https://github.com/nifrajs/nifra) <sub>io.github.nifrajs/nifra-docs</sub> | `A` | **85/100** | 7 | 93% | 87% | 69% | 208 tok |
| 1099 | [**Anaella**](https://github.com/dahoai/anaella-agent-plugin) <sub>com.anaella/mcp</sub> | `A` | **85/100** | 8 | 91% | 91% | 68% | 309 tok |
| 1100 | **Neural Roles: AI jobs** <sub>com.neuralroles/ai-jobs</sub> | `A` | **85/100** | 2 | 83% | 100% | 68% | 226 tok |
| 1101 | **Gridleak** <sub>app.gridleak/mcp</sub> | `A` | **85/100** | 12 | 93% | 89% | 67% | 252 tok |
| 1102 | **Extract JSON** <sub>io.github.mintfacts-x402/extract-json</sub> | `A` | **85/100** | 3 | 87% | 95% | 67% | 275 tok |
| 1103 | [**Spicrawl**](https://github.com/OfficialSpicrawl/mcp) <sub>io.github.OfficialSpicrawl/mcp</sub> | `A` | **85/100** | 27 | 95% | 93% | 67% | 408 tok |
| 1104 | **mireforma.net** <sub>net.mireforma/mireforma</sub> | `A` | **85/100** | 8 | 93% | 89% | 67% | 313 tok |
| 1105 | **Scriptura** <sub>si.scriptura/scriptura</sub> | `A` | **85/100** | 22 | 91% | 91% | 67% | 247 tok |
| 1106 | [**xsolana**](https://github.com/XGamesFun/solana-kit) <sub>io.github.XGamesFun/solana-kit</sub> | `A` | **85/100** | 11 | 93% | 90% | 66% | 265 tok |
| 1107 | [**Greencyclepedia**](https://github.com/Moses10119/greencyclepedia-mcp) <sub>com.greencyclepedia/mcp</sub> | `A` | **85/100** | 23 | 96% | 86% | 65% | 294 tok |
| 1108 | [**Gantlett Systems - AI Governance Seam Pilots &amp; Executive Briefs**](https://github.com/mgantlett/nomos) <sub>io.gantlett/seam-governance</sub> | `A` | **85/100** | 4 | 95% | 89% | 65% | 242 tok |
| 1109 | [**Islam West Africa Collection \(IWAC\)**](https://github.com/fmadore/iwac-mcp-server) <sub>io.github.fmadore/iwac-mcp-server</sub> | `A` | **85/100** | 39 | 87% | 96% | 65% | 294 tok |
| 1110 | [**Nomos - Deterministic Git &amp; AST Governance for AI Coding Agents**](https://github.com/mgantlett/nomos) <sub>ca.sophialabs/nomos</sub> | `A` | **85/100** | 7 | 96% | 87% | 64% | 263 tok |
| 1111 | **heistclips – stream clipping** <sub>com.heistclips/heistclips</sub> | `A` | **85/100** | 23 | 96% | 89% | 64% | 301 tok |
| 1112 | [**Jaybird Digital**](https://github.com/Jaybird-Digital/jaybird-digital-mcp) <sub>com.jaybirddigital/website</sub> | `A` | **85/100** | 12 | 97% | 88% | 64% | 330 tok |
| 1113 | **Safe-Send Check: crypto support triage, sanctions and scam screening** <sub>dev.workers.agent-arena-base.safe-send-check/safe-send-check</sub> | `A` | **85/100** | 11 | 93% | 90% | 64% | 310 tok |
| 1114 | [**Nomos - Deterministic Git &amp; AST Governance for AI Coding Agents**](https://github.com/mgantlett/nomos) <sub>io.github.mgantlett/nomos</sub> | `A` | **85/100** | 7 | 96% | 87% | 64% | 263 tok |
| 1115 | [**Pugi**](https://github.com/pugi-io/pugi-mcp) <sub>io.pugi/pugi</sub> | `A` | **85/100** | 16 | 97% | 95% | 64% | 358 tok |
| 1116 | **KiedySport.pl** <sub>pl.kiedysport/sport</sub> | `A` | **85/100** | 4 | 93% | 93% | 64% | 294 tok |
| 1117 | **palletdimensions.com freight reference** <sub>com.palletdimensions/freight-reference</sub> | `A` | **85/100** | 8 | 92% | 93% | 63% | 354 tok |
| 1118 | **io.github.anthonywlicausi/agentic-ai** | `A` | **85/100** | 8 | 91% | 94% | 63% | 277 tok |
| 1119 | **알잘 공공데이터** <sub>kr.aljal.k-data/public-data</sub> | `A` | **85/100** | 7 | 96% | 89% | 63% | 329 tok |
| 1120 | [**Kilotest**](https://github.com/jrpool/kilotest) <sub>io.github.jrpool/kilotest</sub> | `A` | **85/100** | 12 | 96% | 90% | 62% | 301 tok |
| 1121 | [**osc-bridge**](https://github.com/roomi-fields/osc-bridge) <sub>io.github.roomi-fields/osc-bridge</sub> | `A` | **85/100** | 29 | 92% | 93% | 62% | 303 tok |
| 1122 | [**finwire.pl - Polish financial data**](https://github.com/finwire-pl/api) <sub>pl.finwire/data</sub> | `A` | **85/100** | 102 | 98% | 87% | 62% | 304 tok |
| 1123 | **Playloop** <sub>com.tryplayloop/playloop</sub> | `A` | **85/100** | 8 | 92% | 94% | 61% | 1002 tok |
| 1124 | [**0xinsider**](https://github.com/0xinsider/agent-plugin) <sub>io.github.0xinsider/mcp</sub> | `A` | **85/100** | 80 | 96% | 91% | 61% | 347 tok |
| 1125 | [**Kaucim**](https://github.com/mingyan9989/kaucim-public-mcp) <sub>io.github.mingyan9989/kaucim-public-mcp</sub> | `A` | **85/100** | 10 | 88% | 97% | 61% | 385 tok |
| 1126 | **BuildBatch** <sub>uk.co.buildbatch/buildbatch</sub> | `A` | **85/100** | 4 | 93% | 93% | 61% | 2563 tok |
| 1127 | [**Pokter**](https://github.com/successaje/pokter) <sub>xyz.pokter/marketplace</sub> | `A` | **85/100** | 12 | 97% | 90% | 61% | 367 tok |
| 1128 | [**STRATA &amp; TrashPan B2A Public Data, JP KYB, GLEIF LEI, OFAC Sanctions, TCG &amp; Golf EV MCP**](https://github.com/andquemori/strata-b2a-mcp) <sub>com.andque/agent-data</sub> | `A` | **85/100** | 122 | 89% | 98% | 60% | 480 tok |
| 1129 | [**STRATA &amp; TrashPan B2A Public Data, JP KYB, GLEIF LEI, OFAC Sanctions, TCG &amp; Golf EV MCP**](https://github.com/andquemori/strata-b2a-mcp) <sub>com.andque/strata-b2a-mcp</sub> | `A` | **85/100** | 122 | 89% | 98% | 60% | 480 tok |
| 1130 | **Stayflex Hotel** <sub>com.stayflexhotel/day-use-hotels</sub> | `A` | **85/100** | 2 | 100% | 85% | 60% | 383 tok |
| 1131 | **CORDON** <sub>dev.blvkware/cordon</sub> | `A` | **85/100** | 2 | 100% | 85% | 60% | 324 tok |
| 1132 | [**Plugin Soko-kun**](https://github.com/AllegroMoltoV/plugin-soko-kun) <sub>io.github.AllegroMoltoV/plugin-soko-kun</sub> | `A` | **85/100** | 2 | 100% | 85% | 60% | 361 tok |
| 1133 | **Healthcare Exclusion Lookup** <sub>com.trystarrynightops/healthcare-exclusion-lookup</sub> | `A` | **85/100** | 4 | 95% | 93% | 59% | 351 tok |
| 1134 | **vulnerable.now** <sub>now.vulnerable/mcp</sub> | `A` | **85/100** | 11 | 93% | 96% | 59% | 330 tok |
| 1135 | **HiruAI Creative Cloud** <sub>com.hiruai/creative-cloud</sub> | `A` | **85/100** | 34 | 94% | 94% | 58% | 796 tok |
| 1136 | **Frontrunner Jobs** <sub>com.jobsfrontrunner/jobs</sub> | `A` | **85/100** | 2 | 95% | 93% | 58% | 376 tok |
| 1137 | **Time of Meeting** <sub>com.timeofmeeting/time-of-meeting</sub> | `A` | **85/100** | 17 | 98% | 90% | 58% | 337 tok |
| 1138 | **Kitchen Timer** <sub>com.tnyforge/kitchen-timer</sub> | `A` | **85/100** | 26 | 95% | 96% | 58% | 414 tok |
| 1139 | **RecallLens** <sub>com.trystarrynightops/recalllens</sub> | `A` | **85/100** | 5 | 100% | 88% | 58% | 363 tok |
| 1140 | **AgentSupply** <sub>dev.agentsupply/agentsupply</sub> | `A` | **85/100** | 39 | 94% | 94% | 58% | 401 tok |
| 1141 | [**Kuchi**](https://github.com/KalarisLabs/kuchi) <sub>io.github.KalarisLabs/kuchi</sub> | `A` | **85/100** | 14 | 99% | 90% | 55% | 462 tok |
| 1142 | [**AlgoVault — Crypto Quant Trade Calls**](https://github.com/AlgoVaultLabs/crypto-quant-signal-mcp) <sub>io.github.AlgoVaultFi/crypto-quant-signal-mcp</sub> | `A` | **85/100** | 11 | 99% | 92% | 54% | 428 tok |
| 1143 | **Growth Business Finance** <sub>com.growthbusinessfinance/mcp</sub> | `A` | **85/100** | 7 | 99% | 91% | 53% | 477 tok |
| 1144 | **Argento** <sub>com.profblu.argento/argento</sub> | `A` | **85/100** | 6 | 100% | 90% | 53% | 338 tok |
| 1145 | [**SocialTap**](https://github.com/SocialTapDev/socialtap-mcp) <sub>dev.socialtap/mcp</sub> | `A` | **85/100** | 13 | 98% | 93% | 53% | 466 tok |
| 1146 | [**Clipform**](https://github.com/clipform/mcp-server) <sub>io.github.Clipform/mcp-server</sub> | `A` | **85/100** | 33 | 98% | 94% | 53% | 560 tok |
| 1147 | **Meteoro Minerals** <sub>io.meteoro.www/minerals</sub> | `A` | **85/100** | 9 | 100% | 92% | 52% | 390 tok |
| 1148 | [**ISZ Shiwake AI \(Japanese tax &amp; accounting\)**](https://github.com/iszgroup/shiwake-ai-mcp) <sub>ai.shiwake/mcp</sub> | `A` | **85/100** | 9 | 99% | 93% | 50% | 505 tok |
| 1149 | **EasyCanDo** <sub>com.easycando/easycando</sub> | `A` | **85/100** | 4 | 95% | 96% | 50% | 592 tok |
| 1150 | [**Photo Sweat Shop Image Tools**](https://github.com/photo-sweat-shop/photosweat-mcp) <sub>shop.photosweat/remove-background</sub> | `A` | **85/100** | 2 | 100% | 93% | 50% | 403 tok |
| 1151 | [**GlanceDesk**](https://github.com/shamas72/glancedesk-mcp) <sub>com.glancedesk/tools</sub> | `A` | **85/100** | 8 | 99% | 94% | 49% | 649 tok |
| 1152 | [**Pacta, by Fractal Neurons**](https://github.com/Fractal-Neurons/pacta) <sub>io.github.Fractal-Neurons/pacta</sub> | `A` | **85/100** | 8 | 100% | 94% | 48% | 535 tok |
| 1153 | **AI Crawler Permission Check** <sub>ai.opencurrent/robots-ai-check</sub> | `A` | **84/100** | 2 | 70% | 100% | 85% | 104 tok |
| 1154 | **Phase Platforms** <sub>io.github.phasebro/phase</sub> | `A` | **84/100** | 7 | 70% | 100% | 85% | 130 tok |
| 1155 | [**ToolLoop**](https://github.com/carnation77/toolloop-data) <sub>io.github.carnation77/toolloop</sub> | `A` | **84/100** | 10 | 73% | 97% | 83% | 141 tok |
| 1156 | **ACQ** <sub>io.github.damri-labs/acq</sub> | `A` | **84/100** | 9 | 89% | 97% | 81% | 181 tok |
| 1157 | **The wall \(whatagentswant\)** <sub>ai.whatagentswant/wall</sub> | `A` | **84/100** | 3 | 77% | 95% | 80% | 160 tok |
| 1158 | [**Siren**](https://github.com/Hexahedral-Inc/siren-mcp) <sub>ai.mysiren/siren</sub> | `A` | **84/100** | 70 | 80% | 97% | 79% | 203 tok |
| 1159 | **Sirfus CAR** <sub>com.sirfus/car</sub> | `A` | **84/100** | 10 | 88% | 97% | 77% | 212 tok |
| 1160 | **AgenticGeoMate** <sub>io.github.PascalSun/agenticgeomate</sub> | `A` | **84/100** | 92 | 80% | 93% | 77% | 184 tok |
| 1161 | **sebbi.pro - the proof layer for AI** <sub>pro.sebbi/governance</sub> | `A` | **84/100** | 20 | 80% | 95% | 77% | 185 tok |
| 1162 | **Moqway** <sub>com.moqway/wholesale</sub> | `A` | **84/100** | 20 | 76% | 97% | 76% | 183 tok |
| 1163 | **Taipei Ledger** <sub>com.taipeiledger/ledger</sub> | `A` | **84/100** | 10 | 78% | 99% | 76% | 175 tok |
| 1164 | **JaCars classifieds** <sub>net.jacars/listings</sub> | `A` | **84/100** | 5 | 77% | 100% | 75% | 217 tok |
| 1165 | **PIN classifieds** <sub>tt.pin/listings</sub> | `A` | **84/100** | 5 | 77% | 100% | 75% | 217 tok |
| 1166 | [**Real Return Engine**](https://github.com/realreturnengine/realreturnengine-mcp-plugin) <sub>com.realreturnengine/real-return-engine</sub> | `A` | **84/100** | 4 | 85% | 89% | 74% | 167 tok |
| 1167 | [**Proving Lab**](https://github.com/Bubu89/full-page-pdf-snap) <sub>dev.provinglab/browser-citation-capture</sub> | `A` | **84/100** | 10 | 89% | 93% | 74% | 185 tok |
| 1168 | **P0: x402 service search** <sub>dev.workers.x402-bazaar-rank-worker.x402-bazaar-rank/x402-service-search</sub> | `A` | **84/100** | 7 | 87% | 89% | 74% | 196 tok |
| 1169 | **Kuchiyose** <sub>io.github.akihidem/kuchiyose</sub> | `A` | **84/100** | 22 | 87% | 90% | 73% | 205 tok |
| 1170 | [**GodPrompt MCP Server**](https://github.com/AKzar1el/god-prompt-mcp) <sub>io.github.AKzar1el/god-prompt-mcp</sub> | `A` | **84/100** | 22 | 77% | 99% | 73% | 216 tok |
| 1171 | **Katalis UK company checks** <sub>com.meetkatalis/katalis</sub> | `A` | **84/100** | 19 | 89% | 87% | 72% | 226 tok |
| 1172 | **QRavate QR codes** <sub>com.qravate/qr-codes</sub> | `A` | **84/100** | 16 | 79% | 97% | 72% | 275 tok |
| 1173 | [**AISeeWhy**](https://github.com/aiseewhy/check-action) <sub>com.aiseewhy/aiseewhy</sub> | `A` | **84/100** | 19 | 84% | 93% | 71% | 231 tok |
| 1174 | **The Mine by tkscm — Hawaiʻi economic data** <sub>com.tkscmlimited.mine/hawaii-data</sub> | `A` | **84/100** | 7 | 89% | 87% | 71% | 216 tok |
| 1175 | [**EchoCall**](https://github.com/ECHOCALL-LLC/echocall-mcp) <sub>de.echocall/echocall</sub> | `A` | **84/100** | 171 | 89% | 91% | 71% | 252 tok |
| 1176 | [**MyDramaDB Korean Drama Data**](https://github.com/MyDramaDB/mydramadb-mcp) <sub>io.github.MyDramaDB/mydramadb</sub> | `A` | **84/100** | 9 | 79% | 100% | 71% | 230 tok |
| 1177 | [**attest — verification for AI agent artifacts**](https://github.com/mrpkk/attest) <sub>io.github.mrpkk/attest</sub> | `A` | **84/100** | 2 | 85% | 93% | 70% | 218 tok |
| 1178 | [**io.github.robinlidberg-dot/cap-shield**](https://github.com/robinlidberg-dot/cap-shield-mcp) | `A` | **84/100** | 9 | 86% | 93% | 70% | 217 tok |
| 1179 | **io.github.ryuamarines/url-normalizer** | `A` | **84/100** | 1 | 78% | 100% | 70% | 180 tok |
| 1180 | **Remont — renovation planner** <sub>io.github.Vutik/remont</sub> | `A` | **84/100** | 30 | 81% | 97% | 70% | 292 tok |
| 1181 | [**OmniForge Launch Audit MCP**](https://github.com/zColdWater/mcp-launch-audit) <sub>io.github.zColdWater/mcp-launch-audit</sub> | `A` | **84/100** | 5 | 92% | 85% | 70% | 226 tok |
| 1182 | **Skill Harbor** <sub>com.theskillharbor/skill-harbor</sub> | `A` | **84/100** | 7 | 90% | 89% | 69% | 243 tok |
| 1183 | [**uniwire**](https://github.com/uniwire-dev/uniwire) <sub>io.github.uniwire-dev/uniwire</sub> | `A` | **84/100** | 14 | 85% | 94% | 69% | 245 tok |
| 1184 | [**Polarka Agent: a NORTH wallet for agents**](https://github.com/Polarka-monitor/polarka-agent) <sub>org.polarka/polarka-agent</sub> | `A` | **84/100** | 4 | 93% | 85% | 69% | 210 tok |
| 1185 | **VTC Taxi fares \(Belgium\)** <sub>be.vtctaxi/taxi-fares</sub> | `A` | **84/100** | 2 | 87% | 93% | 68% | 233 tok |
| 1186 | **Cycle DPP &amp; GS1 Checks** <sub>com.cycle-platform/cycle-verify</sub> | `A` | **84/100** | 17 | 87% | 91% | 68% | 235 tok |
| 1187 | **Nicolas Sitter Research** <sub>com.nicolassitter/research</sub> | `A` | **84/100** | 8 | 91% | 87% | 68% | 257 tok |
| 1188 | [**isGenAI**](https://github.com/vagabond11/isgenai-mcp) <sub>com.isgenai/checker</sub> | `A` | **84/100** | 6 | 90% | 90% | 67% | 255 tok |
| 1189 | **Appeal Draft – Twin Cities property tax appeal** <sub>io.github.2016judea/appeal-draft</sub> | `A` | **84/100** | 6 | 95% | 85% | 67% | 240 tok |
| 1190 | [**Omakase Box — Delegate Coding Tasks, Solve Bounties**](https://github.com/shouteck/omakase-box) <sub>io.github.shouteck/omakase-box</sub> | `A` | **84/100** | 3 | 85% | 95% | 67% | 291 tok |
| 1191 | [**Agentic Finance Graph**](https://github.com/AgenticFinanceGraph/agentic-finance-graph-mcp) <sub>com.agenticfinancegraph/agentic-finance-graph</sub> | `A` | **84/100** | 29 | 92% | 88% | 66% | 266 tok |
| 1192 | **Who Got Hacked** <sub>com.whogothacked/mcp</sub> | `A` | **84/100** | 6 | 92% | 88% | 66% | 241 tok |
| 1193 | [**Uptimepage**](https://github.com/uptimepage/uptimepage) <sub>dev.uptimepage/uptimepage</sub> | `A` | **84/100** | 42 | 88% | 94% | 66% | 416 tok |
| 1194 | [**Archestack**](https://github.com/archestack/mcp) <sub>io.github.archestack/mcp</sub> | `A` | **84/100** | 11 | 91% | 89% | 66% | 285 tok |
| 1195 | [**Stormap**](https://github.com/boriskendev/brainstorm-ai) <sub>io.github.boriskendev/stormap</sub> | `A` | **84/100** | 20 | 93% | 90% | 66% | 240 tok |
| 1196 | **VBScript to PowerShell Migration** <sub>io.github.lamtoueqali-eng/vbs-migrate-mcp</sub> | `A` | **84/100** | 8 | 93% | 87% | 66% | 236 tok |
| 1197 | [**Mind Polling**](https://github.com/news-community/mind-polling-public) <sub>com.mindpolling/mindpolling</sub> | `A` | **84/100** | 25 | 93% | 93% | 65% | 628 tok |
| 1198 | **OBM - Open Brazil Market** <sub>br.com.obm/api</sub> | `A` | **84/100** | 10 | 83% | 99% | 64% | 290 tok |
| 1199 | **Tethered Trust** <sub>com.tetheredtrust/tethered-trust</sub> | `A` | **84/100** | 23 | 89% | 92% | 64% | 289 tok |
| 1200 | [**TweetFeed**](https://github.com/0xDanielLopez/tweetfeed-mcp) <sub>io.github.0xDanielLopez/tweetfeed</sub> | `A` | **84/100** | 14 | 94% | 88% | 64% | 282 tok |
| 1201 | **com.makespdf/makespdf** | `A` | **84/100** | 12 | 92% | 91% | 63% | 304 tok |
| 1202 | [**Ophis MCP**](https://github.com/ophis-fi/ophis) <sub>fi.ophis/mcp</sub> | `A` | **84/100** | 13 | 96% | 92% | 63% | 333 tok |
| 1203 | [**Lviv Public Transport**](https://github.com/vbhjckfd/timetable-api-node) <sub>io.github.vbhjckfd/lviv-public-transport</sub> | `A` | **84/100** | 9 | 96% | 87% | 63% | 315 tok |
| 1204 | [**Lviv Public Transport**](https://github.com/vbhjckfd/timetable-api-node) <sub>io.github.vbhjckfd/timetable-api-node</sub> | `A` | **84/100** | 9 | 96% | 87% | 63% | 315 tok |
| 1205 | **Odile Gate** <sub>com.odilelabs/gate</sub> | `A` | **84/100** | 14 | 95% | 97% | 62% | 365 tok |
| 1206 | **sendstables USDC transfers** <sub>com.sendstables/usdc</sub> | `A` | **84/100** | 3 | 93% | 90% | 62% | 326 tok |
| 1207 | [**SpriteForge Editor**](https://github.com/OndrejKnizat/spriteforge-editor) <sub>tech.spriteforge/editor</sub> | `A` | **84/100** | 6 | 90% | 93% | 62% | 376 tok |
| 1208 | **dieAnalysten Adressshop** <sub>com.dieanalysten/adressshop</sub> | `A` | **84/100** | 6 | 87% | 98% | 60% | 471 tok |
| 1209 | **Düğün.com** <sub>com.dugun/wedding</sub> | `A` | **84/100** | 7 | 93% | 91% | 60% | 696 tok |
| 1210 | **Dongbang Interior · 동방인테리어** <sub>now.abis/dongbang-interior</sub> | `A` | **84/100** | 6 | 94% | 90% | 60% | 322 tok |
| 1211 | **Dojazdomat** <sub>io.github.MikolajSapek/dojazdomat</sub> | `A` | **84/100** | 10 | 89% | 97% | 59% | 367 tok |
| 1212 | **golfdata.online — verified golf clubs** <sub>online.golfdata/golf-clubs</sub> | `A` | **84/100** | 6 | 97% | 88% | 59% | 312 tok |
| 1213 | **What Property Calculators** <sub>uk.co.whatproperty/calculators</sub> | `A` | **84/100** | 4 | 93% | 93% | 59% | 558 tok |
| 1214 | **Roomproof** <sub>com.getroomproof/roomproof</sub> | `A` | **84/100** | 9 | 90% | 95% | 58% | 394 tok |
| 1215 | [**marketinque — launch plan &amp; backlink index**](https://github.com/zeshutmax/demand-gen) <sub>com.marketinque/launch-plan</sub> | `A` | **84/100** | 16 | 94% | 91% | 58% | 350 tok |
| 1216 | **SatsDNS** <sub>com.satsdns/satsdns</sub> | `A` | **84/100** | 30 | 94% | 90% | 58% | 401 tok |
| 1217 | **Virgo Villas Barbados** <sub>com.virgovillasbarbados/villa-search</sub> | `A` | **84/100** | 6 | 93% | 93% | 58% | 363 tok |
| 1218 | [**Minerals**](https://github.com/Mineralsdev/minerals) <sub>dev.minerals/minerals</sub> | `A` | **84/100** | 5 | 94% | 91% | 58% | 425 tok |
| 1219 | **Amaltash Investment &amp; Retirement Calculators** <sub>com.amaltash/calculators</sub> | `A` | **84/100** | 44 | 98% | 89% | 57% | 343 tok |
| 1220 | [**Ansvra**](https://github.com/tobhol-lab/ansvra-mcp) <sub>com.ansvra/mcp</sub> | `A` | **84/100** | 13 | 88% | 100% | 57% | 338 tok |
| 1221 | **Rauhnacht-Orakel** <sub>de.rauhnaechte-ritual/rauhnacht-orakel</sub> | `A` | **84/100** | 3 | 100% | 85% | 57% | 349 tok |
| 1222 | [**Web Validator by DigestSEO**](https://github.com/AKzar1el/mcp-web-validator) <sub>io.github.AKzar1el/mcp-web-validator</sub> | `A` | **84/100** | 27 | 92% | 94% | 57% | 741 tok |
| 1223 | [**Speedbot.dev — AI agent marketplace**](https://github.com/ulasarslan6262-ui/swarm-market) <sub>io.github.ulasarslan6262-ui/speedbot</sub> | `A` | **84/100** | 23 | 90% | 95% | 57% | 478 tok |
| 1224 | **Structomat** <sub>com.structomat/steel</sub> | `A` | **84/100** | 11 | 95% | 90% | 56% | 710 tok |
| 1225 | [**cuttingfloor**](https://github.com/Mvp2o-ai/cuttingfloor) <sub>io.github.Mvp2o-ai/cuttingfloor</sub> | `A` | **84/100** | 76 | 93% | 92% | 56% | 539 tok |
| 1226 | **ChatHome — Luxembourg Real Estate** <sub>lu.chathome/chathome</sub> | `A` | **84/100** | 21 | 91% | 96% | 56% | 364 tok |
| 1227 | **GrantCompass US** <sub>co.grantcompass/grantcompass-us</sub> | `A` | **84/100** | 3 | 97% | 90% | 55% | 488 tok |
| 1228 | [**OODS Foundry**](https://github.com/kneelinghorse/OODS-Foundry) <sub>com.oods-foundry/foundry</sub> | `A` | **84/100** | 9 | 98% | 93% | 50% | 610 tok |
| 1229 | [**serpgrab: Google Search, Maps and Jobs**](https://github.com/Fiery-Tools/serpgrab-mcp) <sub>com.serpgrab/google-search</sub> | `A` | **84/100** | 3 | 100% | 90% | 50% | 359 tok |
| 1230 | [**Chain Receipt**](https://github.com/CinianStudios/chain-receipt) <sub>io.github.CinianStudios/chain-receipt</sub> | `A` | **84/100** | 2 | 90% | 100% | 50% | 368 tok |
| 1231 | [**Chart-Output**](https://github.com/lavondev/chart-output-mcp) <sub>io.github.lavondev/chart-output-mcp</sub> | `A` | **84/100** | 1 | 90% | 100% | 50% | 405 tok |
| 1232 | **PageMD** <sub>com.manhourplan/pagemd</sub> | `A` | **83/100** | 6 | 90% | 98% | 83% | 152 tok |
| 1233 | **Schoolwise** <sub>ai.schoolwise/schoolwise</sub> | `A` | **83/100** | 4 | 70% | 100% | 81% | 140 tok |
| 1234 | **Council of AI GSPC \(free\)** <sub>ai.councilof/gspc-free</sub> | `A` | **83/100** | 49 | 83% | 86% | 80% | 183 tok |
| 1235 | [**NovAI Prices**](https://github.com/vvvvking/novai-prices-mcp) <sub>com.aiapi-pro/novai-prices</sub> | `A` | **83/100** | 3 | 80% | 90% | 80% | 146 tok |
| 1236 | **USAC Funding Data \(E-Rate, Rural Health Care, Lifeline\)** <sub>com.digitalbusinessportal/usac-funding</sub> | `A` | **83/100** | 5 | 74% | 97% | 79% | 162 tok |
| 1237 | [**Yardstick ATS**](https://github.com/yardstickinc/yardstick-mcp) <sub>team.yardstick/yardstick</sub> | `A` | **83/100** | 276 | 72% | 99% | 77% | 190 tok |
| 1238 | **Council of AI GSPC** <sub>ai.councilof/gspc</sub> | `A` | **83/100** | 54 | 84% | 86% | 76% | 222 tok |
| 1239 | [**XRPLME Country Data, Screening and Ownership**](https://github.com/DaimyoVegan/xrplme-mcp-server) <sub>io.github.DaimyoVegan/xrplme-paid</sub> | `A` | **83/100** | 11 | 81% | 92% | 75% | 209 tok |
| 1240 | **OMENZ agent tools** <sub>org.omenz.www/agent-tools</sub> | `A` | **83/100** | 129 | 86% | 90% | 74% | 195 tok |
| 1241 | **Bazaraki classifieds** <sub>com.bazaraki/listings</sub> | `A` | **83/100** | 8 | 78% | 98% | 71% | 262 tok |
| 1242 | [**ONAA**](https://github.com/actimod/onaa-protocol) <sub>io.github.actimod/onaa-registry</sub> | `A` | **83/100** | 56 | 80% | 94% | 71% | 269 tok |
| 1243 | **Unegui.mn classifieds** <sub>mn.unegui/listings</sub> | `A` | **83/100** | 8 | 78% | 98% | 71% | 261 tok |
| 1244 | **Somon.tj classifieds** <sub>tj.somon/listings</sub> | `A` | **83/100** | 8 | 78% | 98% | 71% | 262 tok |
| 1245 | **Moyan Audit — Agent Session Security Audit** <sub>cn.net.sixu-ai/moyan-audit</sub> | `A` | **83/100** | 2 | 90% | 85% | 70% | 223 tok |
| 1246 | **Fidem** <sub>com.fidemcheck/fidem</sub> | `A` | **83/100** | 1 | 90% | 85% | 70% | 169 tok |
| 1247 | **PDF Checkup** <sub>com.pdfcheckup/pdf-checkup</sub> | `A` | **83/100** | 1 | 90% | 85% | 70% | 237 tok |
| 1248 | [**LinkProof**](https://github.com/bunuzong-sudo/linkproof) <sub>dev.workers.bsptimber.linkproof/linkproof</sub> | `A` | **83/100** | 14 | 86% | 89% | 70% | 219 tok |
| 1249 | **Foundplay for game makers** <sub>io.foundplay/creators</sub> | `A` | **83/100** | 4 | 90% | 85% | 70% | 193 tok |
| 1250 | **Japan Data Tools** <sub>io.github.akihidem/japan-data-tools</sub> | `A` | **83/100** | 12 | 90% | 85% | 70% | 221 tok |
| 1251 | [**io.github.wygogogo19/robotbase-mcp**](https://github.com/wygogogo19/robotbase-mcp) | `A` | **83/100** | 72 | 89% | 88% | 70% | 222 tok |
| 1252 | **Wallet address risk verdict \(x402\)** <sub>work.agentexchange/crypto-address-risk</sub> | `A` | **83/100** | 1 | 90% | 85% | 70% | 178 tok |
| 1253 | **Wallet accumulating or distributing \(x402\)** <sub>work.agentexchange/smart-money-wallet-activity</sub> | `A` | **83/100** | 1 | 90% | 85% | 70% | 255 tok |
| 1254 | **PlaceProfile: find a restaurant, bar, cafe or hotel by its atmosphere \(free\)** <sub>net.placeprofile/placeprofile</sub> | `A` | **83/100** | 4 | 88% | 89% | 68% | 774 tok |
| 1255 | **P0 Agent Economy Index** <sub>dev.workers.x402-bazaar-rank-worker.x402-bazaar-rank/x402-bazaar-rank</sub> | `A` | **83/100** | 44 | 93% | 87% | 67% | 241 tok |
| 1256 | **GridIron Data** <sub>io.github.avansledright/gridiron-data</sub> | `A` | **83/100** | 25 | 81% | 96% | 66% | 271 tok |
| 1257 | **Fish and Chips by chippynear.me** <sub>me.chippynear/fish-and-chips</sub> | `A` | **83/100** | 6 | 90% | 88% | 66% | 275 tok |
| 1258 | **TransitRadar — UK trains and buses** <sub>uk.co.transitradar/transitradar</sub> | `A` | **83/100** | 16 | 90% | 89% | 66% | 229 tok |
| 1259 | **EuKreate Find Home** <sub>ai.eukollab/eukreate-find-home</sub> | `A` | **83/100** | 4 | 80% | 100% | 64% | 287 tok |
| 1260 | **aamio rendezvous** <sub>at.aamio/aamio</sub> | `A` | **83/100** | 11 | 98% | 90% | 64% | 321 tok |
| 1261 | [**AgentTrust XRPL**](https://github.com/eamwhite1/xrpl-referee) <sub>io.github.eamwhite1/xrpl-referee</sub> | `A` | **83/100** | 51 | 87% | 92% | 64% | 385 tok |
| 1262 | **Big Data Insights for Regional Inflow in Korea** <sub>io.github.KevinCapri/nowcast-mcp</sub> | `A` | **83/100** | 13 | 92% | 87% | 64% | 280 tok |
| 1263 | [**Agent Data Tools: Web, documents and search**](https://github.com/Nutshell2000/agent-data-tools) <sub>io.github.Nutshell2000/agent-data-tools-web</sub> | `A` | **83/100** | 30 | 94% | 85% | 64% | 276 tok |
| 1264 | [**Jobo Job Search**](https://github.com/JoboAI/jobo-mcp) <sub>world.jobo/job-search</sub> | `A` | **83/100** | 7 | 93% | 87% | 64% | 537 tok |
| 1265 | **Hedgr FX Risk &amp; Hedging** <sub>app.hedgr/hedgr</sub> | `A` | **83/100** | 27 | 91% | 88% | 63% | 307 tok |
| 1266 | [**BC Training Navigator — Grants &amp; PTIRU College Directory**](https://github.com/yueliao11/mcp-servers) <sub>org.bctrainingnavigator/bc-training</sub> | `A` | **83/100** | 3 | 93% | 85% | 63% | 278 tok |
| 1267 | **BlitzReels Video Editor** <sub>com.blitzreels/blitzreels</sub> | `A` | **83/100** | 151 | 81% | 99% | 62% | 381 tok |
| 1268 | **PlaceProfile evidence: verified atmosphere of a restaurant, bar, cafe or hotel \(paid\)** <sub>net.placeprofile/evidence</sub> | `A` | **83/100** | 6 | 92% | 88% | 62% | 675 tok |
| 1269 | **Venue atmosphere verification, Bitcoin timestamp: restaurants, bars, hotels \(PlaceProfile, paid\)** <sub>net.placeprofile/venue-atmosphere-verification-bitcoin</sub> | `A` | **83/100** | 6 | 92% | 88% | 62% | 675 tok |
| 1270 | **DwellDelta - Australian rent check and property indicators** <sub>au.com.dwelldelta/dwelldelta</sub> | `A` | **83/100** | 7 | 93% | 89% | 61% | 334 tok |
| 1271 | [**Reevol Source: supplier search**](https://github.com/reevol-ai/mcp) <sub>com.reevol.source/supplier-search</sub> | `A` | **83/100** | 14 | 91% | 90% | 61% | 297 tok |
| 1272 | **Runledge** <sub>io.github.Runledge/runledge</sub> | `A` | **83/100** | 19 | 83% | 99% | 61% | 394 tok |
| 1273 | **EuKreate Market Research** <sub>ai.eukollab/eukreate-market-research</sub> | `A` | **83/100** | 2 | 80% | 100% | 60% | 282 tok |
| 1274 | **Flexpa health tools** <sub>com.flexpa/registry</sub> | `A` | **83/100** | 2 | 95% | 85% | 60% | 312 tok |
| 1275 | [**IPOSignal**](https://github.com/Waltermelon-lang/iposignal-microtransactions) <sub>xyz.iposignal/iposignal</sub> | `A` | **83/100** | 10 | 93% | 88% | 60% | 281 tok |
| 1276 | **app.web.dealer-direct-mcp/dealer-direct-inventory** | `A` | **83/100** | 10 | 93% | 96% | 59% | 706 tok |
| 1277 | [**io.alterlab/mcp-server**](https://github.com/RapierCraft/alterlab-mcp-server) | `A` | **83/100** | 73 | 94% | 89% | 59% | 455 tok |
| 1278 | [**Marginalia Corpus**](https://github.com/2016judea/marginalia-corpus) <sub>io.github.2016judea/marginalia-corpus</sub> | `A` | **83/100** | 11 | 97% | 85% | 59% | 321 tok |
| 1279 | **Ampdat Control** <sub>com.ampdat/control</sub> | `A` | **83/100** | 5 | 94% | 88% | 58% | 290 tok |
| 1280 | [**Haven**](https://github.com/nonameuserd/haven-mcp) <sub>io.github.nonameuserd/haven-mcp</sub> | `A` | **83/100** | 20 | 96% | 89% | 58% | 554 tok |
| 1281 | [**MofCloud Pricing MCP**](https://github.com/mofcloud/cloud-pricing) <sub>com.mofcloud/pricing</sub> | `A` | **83/100** | 15 | 89% | 94% | 57% | 384 tok |
| 1282 | **Forthmatch 3PL Directory** <sub>io.forthmatch/3pl-directory</sub> | `A` | **83/100** | 3 | 99% | 85% | 57% | 420 tok |
| 1283 | **Das Landhaus Apartments Prägant** <sub>net.praegant/landhaus</sub> | `A` | **83/100** | 11 | 95% | 89% | 57% | 378 tok |
| 1284 | [**OpenAccountants**](https://github.com/openaccountants/openaccountants) <sub>io.github.openaccountants/openaccountants</sub> | `A` | **83/100** | 11 | 93% | 90% | 56% | 407 tok |
| 1285 | [**Spurvik**](https://github.com/spurvik/spurvik) <sub>io.github.spurvik/spurvik-mcp-server</sub> | `A` | **83/100** | 10 | 94% | 90% | 56% | 396 tok |
| 1286 | **Lone Pair** <sub>app.lonepair/lonepair</sub> | `A` | **83/100** | 5 | 98% | 88% | 54% | 396 tok |
| 1287 | **MERA Robotics** <sub>com.merarobotics/mera</sub> | `A` | **83/100** | 15 | 99% | 87% | 54% | 497 tok |
| 1288 | **GoThere Japan Transit &amp; Travel** <sub>online.gothere/japan-travel</sub> | `A` | **83/100** | 5 | 100% | 85% | 54% | 413 tok |
| 1289 | **BitTuitive** <sub>ai.bittuitive.api/bittuitive</sub> | `A` | **83/100** | 28 | 96% | 90% | 53% | 542 tok |
| 1290 | [**com.savvly/savvly**](https://github.com/Savvly/savvly-mcp) | `A` | **83/100** | 8 | 100% | 85% | 53% | 634 tok |
| 1291 | [**io.github.foxdavidson/property-mortgage-mcp**](https://github.com/foxdavidson/property-mortgage-mcp) | `A` | **83/100** | 15 | 99% | 88% | 52% | 471 tok |
| 1292 | **Horseback: zajęcia na Jurze** <sub>pl.horseback/horseback</sub> | `A` | **83/100** | 10 | 100% | 87% | 52% | 517 tok |
| 1293 | [**OpenStays Property Passports**](https://github.com/OSAINOW/openstays-mcp) <sub>ai.openstays/property-passports</sub> | `A` | **83/100** | 2 | 94% | 93% | 50% | 999 tok |
| 1294 | **Ted the Tax Guy** <sub>com.tedthetaxguy/ted</sub> | `A` | **83/100** | 5 | 100% | 88% | 50% | 437 tok |
| 1295 | **Dipperfield** <sub>com.dipperfield/dipperfield</sub> | `A` | **83/100** | 11 | 98% | 90% | 49% | 844 tok |
| 1296 | [**FOXIFY Agent Commerce**](https://github.com/speeedy10/agent-authority-check) <sub>pro.foxify/agent-commerce</sub> | `A` | **83/100** | 4 | 90% | 100% | 48% | 715 tok |
| 1297 | **Goliath Travel MCP** <sub>travel.goliath/goliath</sub> | `A` | **83/100** | 5 | 100% | 91% | 46% | 1063 tok |
| 1298 | [**RBAi Scholar**](https://github.com/Insightwithhari/rbai-scholar) <sub>io.github.Insightwithhari/rbai-scholar</sub> | `A` | **83/100** | 6 | 100% | 93% | 43% | 556 tok |
| 1299 | **AIxEnergy Map** <sub>io.aixenergy/map</sub> | `A` | **83/100** | 19 | 99% | 100% | 31% | 962 tok |
| 1300 | **Sweepless in Seattle** <sub>com.sweeplessinseattle/quote</sub> | `A` | **83/100** | 1 | 100% | 100% | 30% | 668 tok |
| 1301 | [**Brazil DANFSe &amp; Tax Reform RTC \(x402\)**](https://github.com/brunopompeo1/brazil-ai-fiscal-apis-x402) <sub>io.github.brunopompeo1/br-danfse-rtc-x402</sub> | `A` | **83/100** | 2 | 100% | 100% | 30% | 946 tok |
| 1302 | [**Essence — Telegram channels for AI**](https://github.com/aylinvia/essence-telegram-api-mcp) <sub>org.essence-ai/essence</sub> | `A` | **82/100** | 38 | 68% | 96% | 83% | 142 tok |
| 1303 | **Zapmatte Green Screen Remover** <sub>com.zapmatte/green-screen-remover</sub> | `A` | **82/100** | 6 | 86% | 100% | 82% | 182 tok |
| 1304 | **AgentWorld** <sub>me.agentworld/agentworld-mcp</sub> | `A` | **82/100** | 168 | 74% | 94% | 80% | 151 tok |
| 1305 | **Margrave** <sub>tools.valksor/margrave</sub> | `A` | **82/100** | 3 | 73% | 95% | 80% | 134 tok |
| 1306 | [**Liquidação de Sentença**](https://github.com/mcp-dir/liquidacao-de-sentenca-mcp) <sub>io.github.mcp-dir/liquidacao-de-sentenca-mcp</sub> | `A` | **82/100** | 10 | 77% | 94% | 72% | 244 tok |
| 1307 | [**Revisão de Contrato Bancário**](https://github.com/mcp-dir/revisao-bancaria-mcp) <sub>io.github.mcp-dir/revisao-bancaria-mcp</sub> | `A` | **82/100** | 10 | 77% | 94% | 72% | 244 tok |
| 1308 | **Custom Solutions** <sub>com.customsolutionsindy/custom-solutions</sub> | `A` | **82/100** | 20 | 89% | 89% | 69% | 285 tok |
| 1309 | **Regime Card** <sub>com.regimecard/market-regime</sub> | `A` | **82/100** | 10 | 86% | 87% | 69% | 224 tok |
| 1310 | [**Company &amp; Macro Data \(x402\)**](https://github.com/vstockma/x402-apis) <sub>io.github.vstockma/x402-apis</sub> | `A` | **82/100** | 6 | 90% | 85% | 67% | 253 tok |
| 1311 | **ASI.EXPRESS** <sub>express.asi/asi-express</sub> | `A` | **82/100** | 11 | 85% | 89% | 66% | 334 tok |
| 1312 | **Agent Weather** <sub>io.agentweather/agent-weather</sub> | `A` | **82/100** | 64 | 88% | 87% | 66% | 266 tok |
| 1313 | **Lordevo Shop: website checks for agents \(x402\)** <sub>com.lordevo/shop</sub> | `A` | **82/100** | 64 | 93% | 89% | 65% | 264 tok |
| 1314 | [**Signal Lab: free data and MCP server audits for AI agents**](https://github.com/quantumdatatechnologies/signal-lab-catalog) <sub>io.github.QDThead/signal-lab</sub> | `A` | **82/100** | 27 | 87% | 89% | 65% | 290 tok |
| 1315 | [**io.github.wygogogo19/robotbase-content**](https://github.com/wygogogo19/robotbase-mcp) | `A` | **82/100** | 35 | 89% | 87% | 65% | 259 tok |
| 1316 | **MOT Check** <sub>io.motcheck/mot</sub> | `A` | **82/100** | 4 | 90% | 85% | 65% | 280 tok |
| 1317 | **Vertfinder** <sub>run.vertfinder/vertfinder</sub> | `A` | **82/100** | 7 | 87% | 89% | 65% | 356 tok |
| 1318 | [**GC Airport Transfers**](https://github.com/neild1971-maker/gc-airport-transfers-mcp) <sub>com.gc-airporttransfers/booking</sub> | `A` | **82/100** | 4 | 88% | 89% | 64% | 332 tok |
| 1319 | **Addie – Australian Property Research** <sub>io.github.kashmirz/addie-property-research</sub> | `A` | **82/100** | 8 | 79% | 98% | 63% | 453 tok |
| 1320 | **Criptonlabs Agent APIs** <sub>com.criptonlabs/agent-apis</sub> | `A` | **82/100** | 35 | 89% | 88% | 62% | 325 tok |
| 1321 | **HALLUX** <sub>dev.blvkware/hallux</sub> | `A` | **82/100** | 6 | 85% | 93% | 62% | 290 tok |
| 1322 | **ubi.fun** <sub>fun.ubi/mcp</sub> | `A` | **82/100** | 25 | 96% | 91% | 62% | 360 tok |
| 1323 | [**Phishunt**](https://github.com/0xDanielLopez/phishunt-mcp) <sub>io.github.0xDanielLopez/phishunt</sub> | `A` | **82/100** | 11 | 90% | 88% | 62% | 341 tok |
| 1324 | [**io.github.wygogogo19/robotbase-dev**](https://github.com/wygogogo19/robotbase-dev) | `A` | **82/100** | 18 | 93% | 86% | 62% | 286 tok |
| 1325 | [**ComOS Federation Gateway**](https://github.com/ComOS-Federation/comos-mcp) <sub>com.comos-federation/gateway</sub> | `A` | **82/100** | 17 | 89% | 89% | 61% | 428 tok |
| 1326 | **Replo** <sub>io.github.replohq/replo</sub> | `A` | **82/100** | 135 | 87% | 92% | 61% | 436 tok |
| 1327 | [**Call Me**](https://github.com/radres/call-me) <sub>com.callmemcp/call-me</sub> | `A` | **82/100** | 9 | 85% | 93% | 60% | 392 tok |
| 1328 | **LoafLoaf Toronto Restaurants** <sub>com.loafloaf/toronto-restaurants</sub> | `A` | **82/100** | 4 | 86% | 93% | 60% | 396 tok |
| 1329 | [**OCRmyPDF by pagespool**](https://github.com/pagespool-com/pagespool) <sub>com.pagespool/ocrmypdf</sub> | `A` | **82/100** | 2 | 93% | 85% | 60% | 367 tok |
| 1330 | [**rundata.re · La Réunion 974 en direct**](https://github.com/rundata-re/rundata) <sub>re.rundata/temps-reel</sub> | `A` | **82/100** | 31 | 92% | 86% | 60% | 320 tok |
| 1331 | **BI LO 2026 Agent Hub** <sub>com.bilo2026/hub</sub> | `A` | **82/100** | 7 | 95% | 85% | 58% | 344 tok |
| 1332 | **Shieldbook – EU Cyber Resilience Act \(CRA\), SBOM** <sub>com.ppftec/shieldbook</sub> | `A` | **82/100** | 9 | 94% | 87% | 58% | 384 tok |
| 1333 | [**io.github.ShieldZCash/swap-mcp**](https://github.com/ShieldZCash/shieldz-swap-mcp) | `A` | **82/100** | 5 | 94% | 85% | 58% | 408 tok |
| 1334 | **x402 Data API \(Crypto, DeFi, SEC EDGAR, Search, Embeddings, Whisper, OCR\)** <sub>com.apix402data/x402-data-api</sub> | `A` | **82/100** | 14 | 96% | 85% | 57% | 329 tok |
| 1335 | **District Listings** <sub>com.district-hq/listings</sub> | `A` | **82/100** | 3 | 97% | 85% | 57% | 367 tok |
| 1336 | **JustConnectUs: companies hiring in Israel** <sub>com.justconnectus/public</sub> | `A` | **82/100** | 3 | 97% | 85% | 57% | 334 tok |
| 1337 | **mygn &amp; rundown.city – curated city events** <sub>de.mygn/events</sub> | `A` | **82/100** | 5 | 92% | 88% | 57% | 525 tok |
| 1338 | [**UrlChart**](https://github.com/gowinder/urlchart-mcp) <sub>io.github.gowinder/urlchart</sub> | `A` | **82/100** | 3 | 92% | 90% | 57% | 358 tok |
| 1339 | [**io.github.mzizi-dev/mzizi-mcp**](https://github.com/mzizi-dev/agent-tools) | `A` | **82/100** | 3 | 95% | 85% | 57% | 400 tok |
| 1340 | [**BotShelf Vampire: free prompts, skills and AI teams**](https://github.com/BotShelfVampire/botshelf-mcp) <sub>com.botshelfvampire/botshelf</sub> | `A` | **82/100** | 4 | 98% | 85% | 55% | 334 tok |
| 1341 | [**Clunkyard**](https://github.com/slepp/azimuth-arena) <sub>com.clunkyard/clunkyard</sub> | `A` | **82/100** | 11 | 91% | 92% | 55% | 441 tok |
| 1342 | **Georgia Commons** <sub>org.georgiacommons/georgia-commons</sub> | `A` | **82/100** | 6 | 93% | 90% | 55% | 729 tok |
| 1343 | [**DataAutomation**](https://github.com/DataAutomation/dataautomation-mcp) <sub>com.dataautomation/agent</sub> | `A` | **82/100** | 7 | 93% | 89% | 54% | 520 tok |
| 1344 | **Biuro HELP** <sub>io.github.ssemrau/biuro-help</sub> | `A` | **82/100** | 4 | 90% | 93% | 54% | 478 tok |
| 1345 | [**AgentSearch \(hosted, free\)**](https://github.com/agentsearchhq-coder/agentsearch-mcp) <sub>com.agentsearchhq/search</sub> | `A` | **82/100** | 6 | 98% | 85% | 53% | 318 tok |
| 1346 | [**Miami Black SUV**](https://github.com/GDACS-droid/miami-black-suv-mcp) <sub>com.blacksuvmiami/miami-black-suv</sub> | `A` | **82/100** | 3 | 93% | 90% | 53% | 953 tok |
| 1347 | **Tax Compass — Japan tax rules by date** <sub>com.cyclixagents/japan-tax-rules</sub> | `A` | **82/100** | 16 | 96% | 86% | 53% | 423 tok |
| 1348 | **AI Fusion One** <sub>com.theaiworldnetwork/aifusionone</sub> | `A` | **82/100** | 47 | 96% | 86% | 53% | 426 tok |
| 1349 | [**AgentSearch \(agentsearchhq.com\)**](https://github.com/agentsearchhq-coder/agentsearch-mcp) <sub>io.github.agentsearchhq-coder/agentsearch-mcp</sub> | `A` | **82/100** | 6 | 98% | 85% | 53% | 318 tok |
| 1350 | [**Spanish Top Tech Companies**](https://github.com/pugarte7/spanish-top-tech-companies) <sub>io.github.pugarte7/spanish-top-tech-companies</sub> | `A` | **82/100** | 9 | 93% | 90% | 52% | 450 tok |
| 1351 | [**Biohacking Kompakt**](https://github.com/phoeser/biohacking-kompakt) <sub>de.biohackingkompakt/biohacking-kompakt</sub> | `A` | **82/100** | 16 | 98% | 85% | 51% | 459 tok |
| 1352 | [**Achromat Machine Operational Memory**](https://github.com/achromat-ai/achromat-mcp-server) <sub>ai.achromat/mcp-server</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 536 tok |
| 1353 | [**gtinfetch – Agentic Commerce**](https://github.com/wefetch-ai/gtinfetch-agents) <sub>ai.gtinfetch/gtinfetch</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 528 tok |
| 1354 | **Auspice — Chinese Classics &amp; Tao** <sub>com.auspiceoracle/bazi</sub> | `A` | **82/100** | 6 | 100% | 85% | 50% | 471 tok |
| 1355 | **HiddenStrip** <sub>com.hiddenstrip/hiddenstrip</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 357 tok |
| 1356 | **RTL PDF** <sub>com.rtlpdf/arabic-pdf</sub> | `A` | **82/100** | 2 | 99% | 85% | 50% | 419 tok |
| 1357 | **WebKnox** <sub>com.webknox/webknox</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 417 tok |
| 1358 | **Keyfinder price lookup** <sub>gg.keyfinder/price-lookup</sub> | `A` | **82/100** | 2 | 100% | 85% | 50% | 422 tok |
| 1359 | [**Audio Plugin Soko-kun**](https://github.com/AllegroMoltoV/audio-plugin-soko-kun) <sub>io.github.AllegroMoltoV/audio-plugin-soko-kun</sub> | `A` | **82/100** | 2 | 100% | 85% | 50% | 441 tok |
| 1360 | [**LaunchCheck x402**](https://github.com/apolito53/launchcheck-x402) <sub>io.github.apolito53/launchcheck-x402</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 524 tok |
| 1361 | [**Zero Slop**](https://github.com/manavmishra/ZeroSlop) <sub>io.github.manavmishra/zero-slop</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 311 tok |
| 1362 | **Zapproof — x402 counterparty reputation** <sub>io.github.noareyenoar/x402-counterparty-reputation</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 487 tok |
| 1363 | **Oaki AI** <sub>io.oaki.www/oaki</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 533 tok |
| 1364 | **ISRC music copyright proof, Bitcoin timestamp \(ProofProfile, paid\)** <sub>it.proofprofile/isrc-music-copyright-proof-bitcoin</sub> | `A` | **82/100** | 3 | 100% | 85% | 50% | 416 tok |
| 1365 | **ProofProfile evidence \(paid proof, free name search\)** <sub>it.proofprofile/proofit</sub> | `A` | **82/100** | 3 | 100% | 85% | 50% | 416 tok |
| 1366 | **ProofProfile evidence \(free name search\)** <sub>it.proofprofile/proofit-free</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 385 tok |
| 1367 | [**io.github.heavyblotto/caelus-mcp**](https://github.com/heavyblotto/caelus) | `A` | **82/100** | 43 | 98% | 90% | 47% | 607 tok |
| 1368 | [**unesco-heritage-mcp-server**](https://github.com/cyanheads/unesco-heritage-mcp-server) <sub>io.github.cyanheads/unesco-heritage-mcp-server</sub> | `A` | **82/100** | 9 | 99% | 90% | 46% | 693 tok |
| 1369 | **오늘냥이 \(Oneul Nyangi\)** <sub>today.nyangi/oneul-nyangi</sub> | `A` | **82/100** | 10 | 98% | 91% | 44% | 558 tok |
| 1370 | **Better Llama — Chile, Colombia, Peru and Mexico data** <sub>com.betterllama/chile-data</sub> | `A` | **82/100** | 15 | 100% | 92% | 39% | 658 tok |
| 1371 | [**io.github.cyanheads/openfda-mcp-server**](https://github.com/cyanheads/openfda-mcp-server) | `A` | **82/100** | 14 | 100% | 91% | 39% | 724 tok |
| 1372 | [**PlaylistExchange**](https://github.com/PlaylistExchange/playlistexchange) <sub>io.github.PlaylistExchange/playlistexchange</sub> | `A` | **81/100** | 6 | 77% | 100% | 93% | 86 tok |
| 1373 | [**Allooloo Issuer News**](https://github.com/allooloo/allooloo-agents) <sub>io.github.allooloo/getissuernews</sub> | `A` | **81/100** | 8 | 62% | 100% | 87% | 111 tok |
| 1374 | **Babelii-Diofis** <sub>net.diofis/babelii</sub> | `A` | **81/100** | 10 | 78% | 91% | 72% | 262 tok |
| 1375 | **Divisi** <sub>africa.divisi/divisi</sub> | `A` | **81/100** | 47 | 76% | 95% | 71% | 233 tok |
| 1376 | [**Strategy Radar**](https://github.com/ANTEVO-CH/antevo-mcp) <sub>ch.antevo/strategy-radar</sub> | `A` | **81/100** | 2 | 85% | 85% | 70% | 189 tok |
| 1377 | **SCRIPTMASTERLABS — SwapGate** <sub>com.scriptmasterlabs/swapgate</sub> | `A` | **81/100** | 1 | 70% | 100% | 70% | 197 tok |
| 1378 | **Pipeline DAG Map** <sub>io.sslip.149-56-208-69/pipeline-dag-map</sub> | `A` | **81/100** | 1 | 70% | 100% | 70% | 190 tok |
| 1379 | **Andes Protocol - Chilean issuers \(CMF\)** <sub>com.andesprotocol/cmf</sub> | `A` | **81/100** | 7 | 86% | 85% | 67% | 259 tok |
| 1380 | **AstraNL** <sub>com.astranl/mcp</sub> | `A` | **81/100** | 41 | 87% | 90% | 67% | 285 tok |
| 1381 | **Fyug \(hosted\)** <sub>fm.fyug/mcp</sub> | `A` | **81/100** | 14 | 78% | 95% | 67% | 263 tok |
| 1382 | [**ai·rete·rag**](https://github.com/zaharajabeen13-create/ai-rete-rag-mcp) <sub>com.ai-rete-rag/ai-rete-rag-mcp</sub> | `A` | **81/100** | 10 | 84% | 90% | 66% | 339 tok |
| 1383 | [**Agentimus**](https://github.com/heera/agentimus) <sub>it.heera/agentimus</sub> | `A` | **81/100** | 66 | 88% | 89% | 66% | 330 tok |
| 1384 | [**ai.sendraven/mcp**](https://github.com/CommonNinja/sendraven-mcp-server) | `A` | **81/100** | 77 | 89% | 91% | 64% | 351 tok |
| 1385 | [**PropLine — Sports Betting Odds &amp; Prop Resolution**](https://github.com/proplineapi/propline-mcp) <sub>io.github.proplineapi/propline-mcp</sub> | `A` | **81/100** | 50 | 87% | 89% | 64% | 308 tok |
| 1386 | **Parclick** <sub>com.parclick/parking</sub> | `A` | **81/100** | 3 | 90% | 85% | 63% | 373 tok |
| 1387 | **OpenSouk** <sub>ai.opensouk/agent</sub> | `A` | **81/100** | 26 | 88% | 88% | 61% | 347 tok |
| 1388 | **HALPII Tax ID** <sub>com.halpii/latam-tax-api</sub> | `A` | **81/100** | 6 | 90% | 85% | 60% | 494 tok |
| 1389 | [**StoryShort**](https://github.com/airdropfi/storyshort-mcp) <sub>app.storyshort/storyshort</sub> | `A` | **81/100** | 34 | 91% | 89% | 59% | 423 tok |
| 1390 | [**vet402**](https://github.com/kzmttkc/vet402-plugin) <sub>com.vet402/vet402</sub> | `A` | **81/100** | 7 | 91% | 85% | 59% | 356 tok |
| 1391 | **Mitoyens, pesticides près de chez vous** <sub>fr.mitoyens/pesticides</sub> | `A` | **81/100** | 9 | 92% | 85% | 59% | 295 tok |
| 1392 | [**alalanet guard — check before you install**](https://github.com/alalanet/alalanet-agent) <sub>com.alalanet/guard</sub> | `A` | **81/100** | 7 | 90% | 87% | 58% | 347 tok |
| 1393 | [**TraceCheck**](https://github.com/TGS-checker/tracecheck-mcp) <sub>io.github.TGS-checker/tracecheck</sub> | `A` | **81/100** | 2 | 85% | 93% | 58% | 546 tok |
| 1394 | [**DeAI Artifact Gateway**](https://github.com/jake-zaiba/DeAI) <sub>io.github.jake-zaiba/deai-research</sub> | `A` | **81/100** | 13 | 88% | 91% | 57% | 424 tok |
| 1395 | **Homonia** <sub>net.homonia/homonia</sub> | `A` | **81/100** | 47 | 97% | 90% | 57% | 389 tok |
| 1396 | **Brief &amp; Proof** <sub>site.chatgpt.hklilinjie.brief-and-proof-lab/brief-and-proof-ppc-reporting</sub> | `A` | **81/100** | 3 | 80% | 100% | 57% | 327 tok |
| 1397 | **GetMovely** <sub>uk.co.getmovely/getmovely</sub> | `A` | **81/100** | 25 | 91% | 86% | 57% | 379 tok |
| 1398 | [**Compose Preview Catalogs**](https://github.com/yschimke/compose-preview-server) <sub>io.github.yschimke/compose-preview</sub> | `A` | **81/100** | 78 | 88% | 92% | 56% | 397 tok |
| 1399 | **Find MCP - Agentage MCP Directory** <sub>io.agentage/find-mcp</sub> | `A` | **81/100** | 3 | 90% | 90% | 55% | 399 tok |
| 1400 | [**Hermoso**](https://github.com/hermoso-ai/hermoso) <sub>io.github.hermoso-ai/hermoso</sub> | `A` | **81/100** | 216 | 93% | 89% | 55% | 617 tok |
| 1401 | [**issued.live**](https://github.com/tuxxin/mcp) <sub>live.issued/issued</sub> | `A` | **81/100** | 15 | 93% | 85% | 55% | 383 tok |
| 1402 | [**aicut**](https://github.com/aicut-pro/aicut-mcp) <sub>pro.aicut/aicut</sub> | `A` | **81/100** | 87 | 92% | 89% | 55% | 462 tok |
| 1403 | [**Agent Data Tools: Speech to text and text to speech**](https://github.com/Nutshell2000/agent-data-tools) <sub>io.github.Nutshell2000/agent-data-tools-voice</sub> | `A` | **81/100** | 10 | 95% | 85% | 54% | 355 tok |
| 1404 | **EuBinder – EU rules for online shops** <sub>com.ppftec/eubinder</sub> | `A` | **81/100** | 6 | 97% | 85% | 53% | 578 tok |
| 1405 | **Bookvia** <sub>de.bookvia/bookvia</sub> | `A` | **81/100** | 6 | 95% | 88% | 53% | 570 tok |
| 1406 | [**dev.pdfops/pdfops-mcp**](https://github.com/pdfops/pdfops-mcp) | `A` | **81/100** | 23 | 93% | 88% | 53% | 510 tok |
| 1407 | **Quantum Atlas Stripe X402 Agent Payment Hub** <sub>xyz.quantumatlas/x402-payment-hub</sub> | `A` | **81/100** | 15 | 97% | 85% | 52% | 404 tok |
| 1408 | **Polystate** <sub>io.polystate/mcp</sub> | `A` | **81/100** | 16 | 96% | 85% | 51% | 463 tok |
| 1409 | **Bee Wholesale - outils du revendeur** <sub>com.bee-wholesale/outils-revendeur</sub> | `A` | **81/100** | 3 | 97% | 85% | 50% | 404 tok |
| 1410 | [**Kineticist**](https://github.com/colinize/kineticist-mcp) <sub>com.kineticist/mcp-server</sub> | `A` | **81/100** | 10 | 92% | 90% | 50% | 458 tok |
| 1411 | [**DelegAIze Agent Check**](https://github.com/toasternet/delegaize-mcp) <sub>io.github.toasternet/delegaize-agenten-check</sub> | `A` | **81/100** | 2 | 98% | 85% | 50% | 435 tok |
| 1412 | **Travel Intelligence** <sub>io.github.2016judea/travel-intelligence</sub> | `A` | **81/100** | 4 | 94% | 89% | 49% | 560 tok |
| 1413 | [**Telehealth near me**](https://github.com/X1native-code/telehealthnearme-mcp) <sub>pro.telehealthnearme/telehealth-compare</sub> | `A` | **81/100** | 6 | 97% | 88% | 49% | 565 tok |
| 1414 | **DualSoft AAS &amp; PLC \(DS Studio\)** <sub>ai.dualsoft/aas</sub> | `A` | **81/100** | 10 | 97% | 87% | 48% | 482 tok |
| 1415 | [**Vietnam Payroll and Tax Calculator**](https://github.com/since98vn/vietnam-mcp-servers) <sub>vn.since98/vietnam-payroll</sub> | `A` | **81/100** | 9 | 98% | 88% | 45% | 526 tok |
| 1416 | **Agrodiler** <sub>com.agrodiler/catalog</sub> | `A` | **81/100** | 7 | 100% | 85% | 44% | 696 tok |
| 1417 | [**Miramo**](https://github.com/miramolabs/mcp) <sub>fr.miramo/mcp</sub> | `A` | **81/100** | 37 | 98% | 87% | 44% | 690 tok |
| 1418 | [**Ingravity Autonomous EVM Security &amp; DeFi Guard \(x402 v2\)**](https://github.com/DMS1979/ingravity-security) <sub>io.github.DMS1979/ingravity-security</sub> | `A` | **81/100** | 7 | 100% | 85% | 44% | 557 tok |
| 1419 | **Man of Many** <sub>com.manofmany/mcp</sub> | `A` | **80/100** | 12 | 76% | 91% | 73% | 195 tok |
| 1420 | [**Quidli Connect**](https://github.com/Quidli/connect-mcp) <sub>io.github.Quidli/connect-mcp</sub> | `A` | **80/100** | 14 | 86% | 97% | 73% | 269 tok |
| 1421 | [**SizeMyFile**](https://github.com/ankitsharma-tech/sizemyfile-agents) <sub>com.sizemyfile/tools</sub> | `A` | **80/100** | 72 | 71% | 96% | 72% | 220 tok |
| 1422 | [**MM Nutrition — Food Diary &amp; Nutrient Tracker**](https://github.com/MyselfHamza/mm-nutrition-mcp) <sub>io.github.MyselfHamza/mm-nutrition</sub> | `A` | **80/100** | 11 | 80% | 95% | 70% | 1502 tok |
| 1423 | [**Portugal \(public data\)**](https://github.com/ThiagoJacobLannes/portugal-mcp) <sub>io.github.ThiagoJacobLannes/portugal-mcp</sub> | `A` | **80/100** | 72 | 76% | 93% | 69% | 241 tok |
| 1424 | **askWheat** <sub>org.plantdatabases/askwheat</sub> | `A` | **80/100** | 76 | 80% | 89% | 69% | 239 tok |
| 1425 | [**io.github.t3ratech/market-pulse**](https://github.com/t3ratech/market-pulse-mcp) | `A` | **80/100** | 11 | 91% | 85% | 65% | 291 tok |
| 1426 | [**ScrapeMapsAPI**](https://github.com/scrapemapsapi/mcp-server) <sub>com.scrapemapsapi/scrapemapsapi</sub> | `A` | **80/100** | 4 | 83% | 89% | 64% | 266 tok |
| 1427 | **Park Graph** <sub>com.parkgraph/mcp</sub> | `A` | **80/100** | 9 | 97% | 88% | 63% | 334 tok |
| 1428 | [**Australian Economic Data \(ABS, RBA &amp; APRA\)**](https://github.com/AnthonyPuggs/ausecon-mcp-server) <sub>io.github.AnthonyPuggs/ausecon-mcp-server</sub> | `A` | **80/100** | 14 | 76% | 96% | 63% | 335 tok |
| 1429 | [**Modelglass**](https://github.com/Modelglass/modelglass-vscode) <sub>io.github.Modelglass/modelglass</sub> | `A` | **80/100** | 7 | 91% | 89% | 63% | 329 tok |
| 1430 | **Flipvo: licenses, entities, NPI, OFAC and OIG screens, carriers, OSHA, drive times** <sub>io.github.stea4lth/flipvo-agent-tools</sub> | `A` | **80/100** | 13 | 80% | 92% | 63% | 372 tok |
| 1431 | [**SeeStocks**](https://github.com/seestocks/mcp-server-guide) <sub>com.seestocks/price-comparison</sub> | `A` | **80/100** | 5 | 87% | 85% | 62% | 367 tok |
| 1432 | **DidRun** <sub>dev.didrun/run</sub> | `A` | **80/100** | 4 | 89% | 85% | 60% | 379 tok |
| 1433 | **Datacircle: GTM API prices and rate limits** <sub>dev.datacircle/datacircle</sub> | `A` | **80/100** | 2 | 90% | 85% | 58% | 686 tok |
| 1434 | [**DataPulse**](https://github.com/r3dz4r/datapulse-my) <sub>io.github.r3dz4r/datapulse-my</sub> | `A` | **80/100** | 19 | 91% | 85% | 58% | 318 tok |
| 1435 | [**GoldSeam**](https://github.com/AcademyOne-Inc/GoldSeam) <sub>com.ksaworks/goldseam</sub> | `A` | **80/100** | 115 | 91% | 88% | 56% | 452 tok |
| 1436 | [**CoinPaprika**](https://github.com/coinpaprika/coinpaprika-mcp) <sub>com.coinpaprika/coinpaprika</sub> | `A` | **80/100** | 31 | 84% | 94% | 55% | 348 tok |
| 1437 | **com.valksor/anglo** | `A` | **80/100** | 4 | 89% | 89% | 55% | 424 tok |
| 1438 | [**Remode - Fashion Finder, New &amp; Second-hand**](https://github.com/deviljin17/Remode) <sub>io.github.deviljin17/remode</sub> | `A` | **80/100** | 7 | 90% | 87% | 55% | 455 tok |
| 1439 | **R3** <sub>org.r3js/r3</sub> | `A` | **80/100** | 81 | 93% | 87% | 55% | 412 tok |
| 1440 | [**FateTell BaZi MCP**](https://github.com/RussGuo/fatetell-bazi-mcp) <sub>com.fatetell/mcp</sub> | `A` | **80/100** | 9 | 92% | 85% | 54% | 418 tok |
| 1441 | **Tip &amp; Overtime Deductions** <sub>io.github.2016judea/tip-overtime-w2</sub> | `A` | **80/100** | 11 | 94% | 85% | 54% | 433 tok |
| 1442 | [**Megido: niche, competitor and traffic research on sites with observed revenue**](https://github.com/megido-io/megido-mcp) <sub>io.megido/observed-revenue-market-research</sub> | `A` | **80/100** | 13 | 93% | 85% | 53% | 528 tok |
| 1443 | **MiniMindsLab MCP Tools** <sub>com.minimindslab.mcp/tools</sub> | `A` | **80/100** | 17 | 93% | 100% | 51% | 356 tok |
| 1444 | [**Ad-o-matic Free Mobile App Cross-Promotion**](https://github.com/ad-o-matic/ad-o-matic-sdk) <sub>com.ad-o-matic/adomatic</sub> | `A` | **80/100** | 4 | 95% | 85% | 50% | 495 tok |
| 1445 | **alephlo search \(no sign-in\)** <sub>com.alephlo/search</sub> | `A` | **80/100** | 3 | 91% | 90% | 50% | 644 tok |
| 1446 | **TF Rooms** <sub>com.tfrooms/tf-rooms</sub> | `A` | **80/100** | 8 | 94% | 85% | 50% | 426 tok |
| 1447 | **Israel Small Business Valuation \(esek-shave\)** <sub>il.co.esek-shave/valuation</sub> | `A` | **80/100** | 2 | 95% | 85% | 50% | 499 tok |
| 1448 | **My Star Letter: charts and compatibility** <sub>com.mystarletter/human-design-chart</sub> | `A` | **80/100** | 12 | 97% | 85% | 48% | 476 tok |
| 1449 | **Appeal the Denial** <sub>io.github.2016judea/appeal-the-denial</sub> | `A` | **80/100** | 10 | 95% | 87% | 48% | 402 tok |
| 1450 | [**FreightUtils MCP Server**](https://github.com/SoapyRED/freightutils-mcp) <sub>io.github.SoapyRED/freightutils</sub> | `A` | **80/100** | 29 | 98% | 85% | 47% | 720 tok |
| 1451 | [**Priorlight**](https://github.com/priorlight/priorlight-mcp) <sub>ai.priorlight/priorlight</sub> | `A` | **80/100** | 18 | 84% | 100% | 45% | 1572 tok |
| 1452 | [**OpenNodes**](https://github.com/opennodes-io/opennodes) <sub>io.github.opennodes-io/opennodes</sub> | `A` | **80/100** | 7 | 97% | 87% | 44% | 809 tok |
| 1453 | **postkamer.nl** <sub>nl.postkamer/postkamer</sub> | `A` | **80/100** | 4 | 85% | 100% | 44% | 547 tok |
| 1454 | [**Zalo Business Reference \(ZBS Template Message, OA\)**](https://github.com/since98vn/vietnam-mcp-servers) <sub>vn.since98/zalo-business-reference</sub> | `A` | **80/100** | 7 | 97% | 87% | 44% | 584 tok |
| 1455 | **Fitralo** <sub>com.fitralo/carriers</sub> | `A` | **80/100** | 3 | 100% | 85% | 43% | 562 tok |
| 1456 | [**Ariadne Nexus Provenance &amp; Underwriting MCP**](https://github.com/dotlink-ops/nexus-core) <sub>com.ariadnenexus/mcp-server</sub> | `A` | **80/100** | 7 | 100% | 85% | 41% | 594 tok |
| 1457 | **RideMyPark** <sub>com.ridemypark/rmp</sub> | `A` | **80/100** | 14 | 100% | 85% | 41% | 654 tok |
| 1458 | [**AlphaCitation reference lookup**](https://github.com/alphacitation/alphacitation-reference) <sub>com.alphacitation/reference</sub> | `A` | **80/100** | 4 | 100% | 85% | 40% | 3348 tok |
| 1459 | **Ripe** <sub>com.clawhard/ripe</sub> | `A` | **80/100** | 2 | 100% | 85% | 40% | 692 tok |
| 1460 | **FDA Device and Drug Shortage Data \(openFDA\)** <sub>com.digitalbusinessportal/fda-regulatory</sub> | `B` | **79/100** | 4 | 80% | 85% | 70% | 240 tok |
| 1461 | **LLPRO Campus** <sub>ai.llpro/campus</sub> | `B` | **79/100** | 15 | 92% | 98% | 67% | 249 tok |
| 1462 | **askPulse** <sub>org.plantdatabases/askpulse</sub> | `B` | **79/100** | 46 | 79% | 88% | 67% | 258 tok |
| 1463 | [**cogDepot**](https://github.com/cogdepot/mcp-server) <sub>io.github.cogdepot/cogdepot</sub> | `B` | **79/100** | 5 | 82% | 85% | 66% | 236 tok |
| 1464 | **askBrassica** <sub>org.plantdatabases/askbrassica</sub> | `B` | **79/100** | 52 | 79% | 88% | 66% | 262 tok |
| 1465 | **LadderKit** <sub>io.github.ladderkit/hub-kb</sub> | `B` | **79/100** | 2 | 75% | 93% | 65% | 467 tok |
| 1466 | **Marketgenius** <sub>app.marketgenius/mcp</sub> | `B` | **79/100** | 17 | 91% | 94% | 64% | 298 tok |
| 1467 | [**Google Research Blog — buy per-query in-session \(googleresearchwatch\)**](https://github.com/ee324/a2awire) <sub>com.a2awire/data-google-research-blog-ai-breakthrough</sub> | `B` | **79/100** | 31 | 78% | 93% | 64% | 411 tok |
| 1468 | **KidPaths Family Outings** <sub>com.kidpaths/family-outings</sub> | `B` | **79/100** | 4 | 75% | 96% | 60% | 336 tok |
| 1469 | [**WorldIP.io**](https://github.com/tuxxin/worldip-sdk) <sub>io.worldip/worldip</sub> | `B` | **79/100** | 2 | 85% | 85% | 60% | 259 tok |
| 1470 | **com.qconsultai/qconsul-booking** | `B` | **79/100** | 6 | 88% | 85% | 57% | 316 tok |
| 1471 | [**TWZRD Agent Intelligence**](https://github.com/twzrd-sol/twzrd-trust) <sub>xyz.twzrd.intel/twzrd-agent-intel</sub> | `B` | **79/100** | 22 | 87% | 90% | 56% | 388 tok |
| 1472 | **EverTables** <sub>com.evertables/evertables</sub> | `B` | **79/100** | 4 | 90% | 85% | 55% | 371 tok |
| 1473 | [**walletmcppass: Apple Wallet passes**](https://github.com/arshwaraich/wallet-mcp) <sub>com.walletmcppass/wallet-mcp</sub> | `B` | **79/100** | 3 | 84% | 90% | 55% | 682 tok |
| 1474 | **Engelberg Center Corpus** <sub>org.nyuengelberg/corpus</sub> | `B` | **79/100** | 4 | 90% | 85% | 55% | 445 tok |
| 1475 | [**OrcaLayer MCP**](https://github.com/orcalayer/orcalayer-mcp) <sub>io.github.orcalayer/orcalayer-mcp</sub> | `B` | **79/100** | 5 | 87% | 88% | 54% | 434 tok |
| 1476 | [**IA-QA Data &amp; Dev — the 17 tools of /mcp**](https://github.com/ia-qa-com/mcp) <sub>io.github.JcJamet/ia-qa-data</sub> | `B` | **79/100** | 17 | 92% | 85% | 51% | 440 tok |
| 1477 | [**IA-QA Eval &amp; RAG — the 17 tools of /mcp**](https://github.com/ia-qa-com/mcp) <sub>io.github.JcJamet/ia-qa-eval</sub> | `B` | **79/100** | 17 | 92% | 85% | 51% | 440 tok |
| 1478 | [**IA-QA Security — the 17 tools of /mcp**](https://github.com/ia-qa-com/mcp) <sub>io.github.JcJamet/ia-qa-security</sub> | `B` | **79/100** | 17 | 92% | 85% | 51% | 440 tok |
| 1479 | **Stock Expert AI Research** <sub>com.stockexpertai/research</sub> | `B` | **79/100** | 5 | 92% | 85% | 50% | 440 tok |
| 1480 | [**readfetch**](https://github.com/readfetch/mcp-x402-proxy) <sub>com.readfetch/mcp-x402-proxy</sub> | `B` | **79/100** | 15 | 93% | 86% | 49% | 579 tok |
| 1481 | [**nanoodle**](https://github.com/nanoodlecom/nanoodle-mcp) <sub>io.github.nanoodlecom/nanoodle-mcp</sub> | `B` | **79/100** | 15 | 97% | 85% | 45% | 549 tok |
| 1482 | **GrantCompass Canada** <sub>ca.grantcompass/grantcompass-canada</sub> | `B` | **79/100** | 3 | 97% | 85% | 43% | 747 tok |
| 1483 | **STRvest \(no account\)** <sub>com.strvest/strvest-public</sub> | `B` | **79/100** | 3 | 97% | 85% | 43% | 648 tok |
| 1484 | **Alauda Home Equity** <sub>io.github.detongz/alauda-home-equity</sub> | `B` | **79/100** | 7 | 99% | 85% | 41% | 621 tok |
| 1485 | **Herofab marketplace image rules** <sub>app.herofab/marketplace-image-rules</sub> | `B` | **79/100** | 3 | 100% | 85% | 37% | 608 tok |
| 1486 | [**SBA Deal Check \(SOP 50 10 8.1\)**](https://github.com/SohaibAli9/sba-deal-check) <sub>com.sbadealcheck/sba-deal-check</sub> | `B` | **79/100** | 3 | 90% | 95% | 37% | 1785 tok |
| 1487 | [**Apify External Business Intelligence MCP Server**](https://github.com/wonderpick/apify-b2b-ecom-automation-kit) <sub>io.github.wonderpick/apify-b2b-ecom-automation-kit</sub> | `B` | **79/100** | 9 | 100% | 85% | 37% | 751 tok |
| 1488 | **Commlo commute network** <sub>com.commlo/commute-network</sub> | `B` | **79/100** | 4 | 90% | 100% | 30% | 899 tok |
| 1489 | [**whenship**](https://github.com/HamedShams/whenship) <sub>io.github.HamedShams/whenship</sub> | `B` | **79/100** | 4 | 97% | 93% | 30% | 1385 tok |
| 1490 | **BRAINIAC WordPress Fleet Intelligence** <sub>software.brainiac/wordpress-fleet</sub> | `B` | **79/100** | 8 | 90% | 100% | 30% | 1345 tok |
| 1491 | **StatuteWire** <sub>com.statutewire/psv</sub> | `B` | **78/100** | 8 | 84% | 91% | 74% | 214 tok |
| 1492 | **Alama Wardrobe** <sub>uk.co.alama/wardrobe</sub> | `B` | **78/100** | 14 | 71% | 90% | 72% | 218 tok |
| 1493 | [**RuleFoundry**](https://github.com/adammpolak/rulefoundry-plugins) <sub>io.github.adammpolak/rulefoundry-extractions</sub> | `B` | **78/100** | 16 | 84% | 94% | 68% | 282 tok |
| 1494 | [**SwarmMemo**](https://github.com/Hugo0/swarmmemo) <sub>com.swarmmemo/bulletin</sub> | `B` | **78/100** | 22 | 91% | 88% | 59% | 359 tok |
| 1495 | [**FORUM**](https://github.com/forumtrust/forum-verify) <sub>ai.forumtrust/forum</sub> | `B` | **78/100** | 3 | 87% | 85% | 57% | 349 tok |
| 1496 | [**Stackin**](https://github.com/stackin-io/stackin-mcp-plugin) <sub>io.github.stackin-io/stackin</sub> | `B` | **78/100** | 42 | 76% | 94% | 57% | 448 tok |
| 1497 | **AstraNL Dutch contractor and counterparty check** <sub>com.astranl/counterparty-nl</sub> | `B` | **78/100** | 4 | 88% | 85% | 55% | 403 tok |
| 1498 | [**invowerk**](https://github.com/invowerk-dev/invowerk) <sub>dev.invowerk/xrechnung-e-invoice-validator</sub> | `B` | **78/100** | 6 | 87% | 85% | 53% | 406 tok |
| 1499 | [**Reevi: find buyers for exporters**](https://github.com/reevol-ai/mcp) <sub>ai.reevi/find-buyers</sub> | `B` | **78/100** | 1 | 90% | 85% | 50% | 417 tok |
| 1500 | **InternationalCall.co dialing** <sub>co.internationalcall/dialing</sub> | `B` | **78/100** | 3 | 90% | 85% | 50% | 343 tok |
| 1501 | [**alalanet — check before your agent installs, connects or pays**](https://github.com/alalanet/alalanet-agent) <sub>com.alalanet/check</sub> | `B` | **78/100** | 8 | 90% | 85% | 50% | 461 tok |
| 1502 | **MyPivots Daily Notes** <sub>com.mypivots/mypivots</sub> | `B` | **78/100** | 1 | 90% | 85% | 50% | 534 tok |
| 1503 | **Dividend Calculator &amp; DRIP Simulator — RendementBourse** <sub>com.rendementbourse/simulateurs</sub> | `B` | **78/100** | 1 | 90% | 85% | 50% | 370 tok |
| 1504 | [**io.github.onlsol/domain-discovery-remotify-mcp**](https://github.com/onlsol/domain-discovery.remotify.run) | `B` | **78/100** | 1 | 90% | 85% | 50% | 307 tok |
| 1505 | [**Merchant Domain Scam &amp; Rug-Pull Guard MCP**](https://github.com/RizkySugiharto/merchant-scam-guard-mcp) <sub>io.github.RizkySugiharto/merchant-scam-guard-mcp</sub> | `B` | **78/100** | 3 | 90% | 85% | 50% | 352 tok |
| 1506 | **Agent Verifier — Independent Number Verification** <sub>io.github.zenoix888/agent-verifier</sub> | `B` | **78/100** | 1 | 90% | 85% | 50% | 418 tok |
| 1507 | **ABIZ Universal Resolver** <sub>org.abizrecord/resolver</sub> | `B` | **78/100** | 1 | 90% | 85% | 50% | 385 tok |
| 1508 | [**Scoutee**](https://github.com/qchantel/scoutee-mcp) <sub>org.scoutee/scoutee</sub> | `B` | **78/100** | 3 | 90% | 85% | 50% | 435 tok |
| 1509 | **Fair Line: NFL bet pricing and angle backtests** <sub>io.github.2016judea/fair-line</sub> | `B` | **78/100** | 11 | 90% | 85% | 46% | 498 tok |
| 1510 | [**SnapFolda UCP MCP**](https://github.com/echochaofan/snapfolda-ucp-mcp) <sub>io.github.echochaofan/snapfolda-ucp-mcp</sub> | `B` | **78/100** | 14 | 89% | 87% | 46% | 1120 tok |
| 1511 | **app.sallim/korea-stay** | `B` | **78/100** | 4 | 86% | 93% | 45% | 488 tok |
| 1512 | [**Senzing**](https://github.com/Senzing/mcp) <sub>com.senzing/mcp</sub> | `B` | **78/100** | 13 | 92% | 86% | 45% | 804 tok |
| 1513 | **MCP Checkup** <sub>com.mcpcheckup/mcp</sub> | `B` | **78/100** | 6 | 95% | 85% | 43% | 614 tok |
| 1514 | **Aquedra Run** <sub>com.aquedra/run</sub> | `B` | **78/100** | 8 | 94% | 87% | 42% | 739 tok |
| 1515 | **AwesomeVideo: video captions &amp; subtitles** <sub>com.awesomevideoeditor/awesomevideo</sub> | `B` | **78/100** | 27 | 98% | 86% | 42% | 928 tok |
| 1516 | [**DogPolicies**](https://github.com/xultrax-web/dogpolicies-mcp) <sub>io.github.xultrax-web/dogpolicies-mcp</sub> | `B` | **78/100** | 18 | 100% | 85% | 41% | 698 tok |
| 1517 | [**Mahonia**](https://github.com/ryankiley/mahonia) <sub>app.mahonia/mahonia</sub> | `B` | **78/100** | 6 | 97% | 85% | 40% | 1267 tok |
| 1518 | **Sieve** <sub>com.clawhard/sieve</sub> | `B` | **78/100** | 2 | 95% | 85% | 40% | 763 tok |
| 1519 | [**FlickDirect Movie MCP Server**](https://github.com/nrose101/flickdirect-movie-mcp-server) <sub>com.flickdirect.connect/flickdirect-connect</sub> | `B` | **78/100** | 2 | 95% | 85% | 40% | 859 tok |
| 1520 | **Subsola** <sub>com.subsola/subsola</sub> | `B` | **78/100** | 2 | 95% | 85% | 40% | 640 tok |
| 1521 | [**io.github.snayyar00/webability**](https://github.com/snayyar00/webability-mcp) | `B` | **78/100** | 17 | 96% | 90% | 39% | 707 tok |
| 1522 | [**AINumbers Fintech Intelligence Suite**](https://github.com/PostOakLabs/ainumbers-mcp-apps) <sub>co.ainumbers/tools</sub> | `B` | **78/100** | 500 | 99% | 85% | 37% | 623 tok |
| 1523 | **SeekSat** <sub>com.seeksat/seeksat</sub> | `B` | **78/100** | 11 | 97% | 85% | 37% | 843 tok |
| 1524 | **Norman: Start a company** <sub>finance.norman/formation-planner</sub> | `B` | **78/100** | 3 | 98% | 85% | 37% | 604 tok |
| 1525 | [**Startup Valuation MCP Server**](https://github.com/simonmak-ascent/startup-valuation) <sub>com.ascent-partners/startup-valuation</sub> | `B` | **78/100** | 14 | 100% | 85% | 36% | 840 tok |
| 1526 | **FACTA** <sub>xyz.factahq/facta</sub> | `B` | **78/100** | 7 | 100% | 85% | 36% | 896 tok |
| 1527 | [**OptimToken: AI and Compute Economics**](https://github.com/OptimNow/ai-pricing-hub-mcp) <sub>io.github.OptimNow/ai-pricing-hub</sub> | `B` | **78/100** | 8 | 100% | 85% | 33% | 793 tok |
| 1528 | [**MCP.AI connector for XP \(unofficial\)**](https://github.com/mcp-dir/xp-mcp) <sub>io.github.mcp-dir/xp-mcp</sub> | `B` | **77/100** | 25 | 75% | 90% | 66% | 359 tok |
| 1529 | **Ground Truth Worldwide** <sub>ai.llpro.gt/ground-truth-worldwide</sub> | `B` | **77/100** | 5 | 89% | 97% | 65% | 249 tok |
| 1530 | [**EntryLib**](https://github.com/entrylib/portal) <sub>io.github.entrylib/entrylib</sub> | `B` | **77/100** | 10 | 76% | 88% | 63% | 360 tok |
| 1531 | **BrowserTones Guitar Sounds** <sub>com.browsertones/guitar-sounds</sub> | `B` | **77/100** | 9 | 77% | 92% | 57% | 1010 tok |
| 1532 | **Clawhard Studio** <sub>com.clawhard/studio</sub> | `B` | **77/100** | 40 | 93% | 87% | 53% | 430 tok |
| 1533 | [**DC Hub: Data Center &amp; Energy Intelligence**](https://github.com/azmartone67/dchub-mcp-server) <sub>cloud.dchub/mcp-server</sub> | `B` | **77/100** | 98 | 92% | 85% | 51% | 461 tok |
| 1534 | **Peskio** <sub>com.peskio/peskio</sub> | `B` | **77/100** | 6 | 97% | 88% | 47% | 520 tok |
| 1535 | [**Valuein — SEC EDGAR Fundamentals &amp; Smart-Money Data**](https://github.com/valuein/valuein) <sub>biz.valuein/mcp</sub> | `B` | **77/100** | 55 | 98% | 86% | 42% | 723 tok |
| 1536 | [**DexPaprika**](https://github.com/coinpaprika/dexpaprika-mcp) <sub>com.dexpaprika/dexpaprika</sub> | `B` | **77/100** | 20 | 96% | 86% | 42% | 694 tok |
| 1537 | [**VocalStack**](https://github.com/vocalstack/mcp) <sub>com.vocalstack/mcp</sub> | `B` | **77/100** | 15 | 93% | 85% | 42% | 732 tok |
| 1538 | **4words** <sub>land.aletheia/4words</sub> | `B` | **77/100** | 15 | 100% | 85% | 41% | 619 tok |
| 1539 | **Senaro Personal Finance** <sub>ai.senaro/personal-finance</sub> | `B` | **77/100** | 19 | 98% | 85% | 34% | 1967 tok |
| 1540 | [**io.github.cyanheads/openstreetmap-mcp-server**](https://github.com/cyanheads/openstreetmap-mcp-server) | `B` | **77/100** | 6 | 98% | 85% | 33% | 1172 tok |
| 1541 | **CarLoanMath** <sub>com.carloanmath/car-loan-math</sub> | `B` | **77/100** | 4 | 100% | 85% | 30% | 743 tok |
| 1542 | **Go2Trip** <sub>com.go2trip.mcp/go2trip</sub> | `B` | **77/100** | 1 | 100% | 85% | 30% | 686 tok |
| 1543 | **Foundplay** <sub>io.foundplay/foundplay</sub> | `B` | **77/100** | 1 | 100% | 85% | 30% | 796 tok |
| 1544 | [**BaziChart**](https://github.com/bazichart/bazichart-mcp) <sub>io.github.bazichart/bazichart-mcp</sub> | `B` | **77/100** | 2 | 100% | 85% | 30% | 621 tok |
| 1545 | [**CAROL RENT rental quotes**](https://github.com/ha3ap-ua/carol) <sub>rent.carol/car-rental</sub> | `B` | **77/100** | 2 | 100% | 85% | 30% | 759 tok |
| 1546 | [**Mizan calibration benchmark**](https://github.com/qants-labs/mizan-ledger) <sub>io.github.qants-labs/mizan</sub> | `B` | **76/100** | 10 | 89% | 93% | 70% | 233 tok |
| 1547 | **Illinois Business Signals** <sub>net.blackdialsolutions/illinois-business-signals</sub> | `B` | **76/100** | 5 | 79% | 88% | 56% | 423 tok |
| 1548 | [**AutoTuneMPC**](https://github.com/kaiden8/autotunempc-examples) <sub>com.autotunempc/autotunempc</sub> | `B` | **76/100** | 10 | 89% | 91% | 55% | 887 tok |
| 1549 | **Drawbridge Network Diagrams** <sub>com.fortiknight/drawbridge</sub> | `B` | **76/100** | 5 | 96% | 85% | 53% | 749 tok |
| 1550 | [**Brontide agent arena**](https://github.com/beeswaxpat/brontide-agent-kit) <sub>live.brontide/mech-arena</sub> | `B` | **76/100** | 11 | 95% | 95% | 52% | 729 tok |
| 1551 | [**Lectern**](https://github.com/Noah-Airmet/lectern) <sub>io.github.Noah-Airmet/lectern</sub> | `B` | **76/100** | 4 | 85% | 85% | 50% | 415 tok |
| 1552 | **MIDAS CIVIL NX tools \(MIDAS IT Europe\)** <sub>com.midasiteurope/civil-nx</sub> | `B` | **76/100** | 93 | 89% | 86% | 44% | 959 tok |
| 1553 | [**Persuasion Taxonomy**](https://github.com/Otha-Labs/persuasion-mcp) <sub>com.coppica/persuasion-taxonomy</sub> | `B` | **76/100** | 9 | 94% | 87% | 43% | 648 tok |
| 1554 | [**German Real Estate Depreciation &amp; Restnutzungsdauer**](https://github.com/Rundum-Immo/real-estate-appraisal-mcp) <sub>immo.rundum/real-estate-appraisal</sub> | `B` | **76/100** | 5 | 95% | 85% | 34% | 882 tok |
| 1555 | **AwardSecrets: book flights with points** <sub>com.awardsecrets/award-availability</sub> | `B` | **76/100** | 1 | 98% | 85% | 30% | 663 tok |
| 1556 | [**Curator Match**](https://github.com/whosman/curatormatch-mcp) <sub>io.github.whosman/curatormatch</sub> | `B` | **75/100** | 4 | 90% | 93% | 70% | 205 tok |
| 1557 | **Yarda** <sub>ai.yarda/yarda</sub> | `B` | **75/100** | 19 | 88% | 88% | 67% | 289 tok |
| 1558 | **FineRx** <sub>com.finerxfinder/finerx</sub> | `B` | **75/100** | 19 | 69% | 89% | 66% | 301 tok |
| 1559 | **SeedViews** <sub>com.seedviews/seedviews</sub> | `B` | **75/100** | 6 | 92% | 90% | 59% | 428 tok |
| 1560 | [**MoneyPeel reports**](https://github.com/HZC20030712/moneypeel-mcp) <sub>com.moneypeel/reports</sub> | `B` | **75/100** | 6 | 95% | 90% | 56% | 581 tok |
| 1561 | [**Ourway – Camino de Santiago**](https://github.com/contactoourway-art/ourway-mcp) <sub>travel.ourway/camino-de-santiago</sub> | `B` | **75/100** | 14 | 80% | 86% | 51% | 620 tok |
| 1562 | [**Replenwise**](https://github.com/replenwise/replenwise-mcp) <sub>app.replenwise/mcp</sub> | `B` | **75/100** | 2 | 82% | 85% | 50% | 501 tok |
| 1563 | **com.valksor/interslavic** | `B` | **75/100** | 3 | 83% | 85% | 50% | 477 tok |
| 1564 | [**Autoview**](https://github.com/autoview-com/mcp) <sub>com.autoview/mcp</sub> | `B` | **75/100** | 19 | 94% | 85% | 45% | 752 tok |
| 1565 | [**Customermates**](https://github.com/customermates/customermates) <sub>io.github.benjiwagner/customermates</sub> | `B` | **75/100** | 62 | 91% | 87% | 40% | 1606 tok |
| 1566 | [**emem, the verifiable memory protocol for the physical world**](https://github.com/Vortx-AI/emem) <sub>io.github.Vortx-AI/emem</sub> | `B` | **75/100** | 18 | 95% | 85% | 39% | 747 tok |
| 1567 | [**AI business value framework**](https://github.com/Craig-Horton/ai-bvf) <sub>io.github.Craig-Horton/aibvf-mcp</sub> | `B` | **75/100** | 13 | 96% | 85% | 38% | 1389 tok |
| 1568 | **Jylus** <sub>ai.jylus/context</sub> | `B` | **75/100** | 3 | 77% | 100% | 37% | 787 tok |
| 1569 | **SCRIPTMASTERLABS — Token Verdict** <sub>com.scriptmasterlabs/token-verdict</sub> | `B` | **74/100** | 11 | 93% | 89% | 74% | 189 tok |
| 1570 | **workman.rent — humans for real-world checks** <sub>rent.workman/workman</sub> | `B` | **74/100** | 5 | 88% | 88% | 69% | 200 tok |
| 1571 | **Jobo Developer** <sub>world.jobo/developer</sub> | `B` | **74/100** | 6 | 92% | 85% | 60% | 637 tok |
| 1572 | **N9T2 XRPL Agent Gateway** <sub>com.n9t2/xrpl-agent-gateway</sub> | `B` | **74/100** | 22 | 77% | 86% | 54% | 375 tok |
| 1573 | **Data Cleaner** <sub>com.data-cleaner/data-cleaner</sub> | `B` | **74/100** | 8 | 77% | 85% | 53% | 456 tok |
| 1574 | **Festiv** <sub>ai.festivai/festiv</sub> | `B` | **74/100** | 7 | 74% | 89% | 52% | 489 tok |
| 1575 | [**app.sallim/korea-realty**](https://github.com/sallim-app/korea-realty) | `B` | **74/100** | 57 | 81% | 88% | 45% | 627 tok |
| 1576 | **Tallyho** <sub>so.tallyho/tallyho</sub> | `B` | **74/100** | 4 | 87% | 85% | 40% | 838 tok |
| 1577 | [**EchelonGraph CVE &amp; Exposure**](https://github.com/echelongraph/echelongraph-mcp) <sub>io.echelongraph/echelongraph-mcp</sub> | `B` | **74/100** | 16 | 93% | 85% | 30% | 772 tok |
| 1578 | **Best Of Motivation** <sub>com.bestofmotivation/best-of-motivation</sub> | `B` | **73/100** | 9 | 87% | 90% | 72% | 189 tok |
| 1579 | [**PayStage — x402 payment safety and spend policy**](https://github.com/base-buzz/paystage) <sub>io.github.base-buzz/x402-payment-safety</sub> | `B` | **73/100** | 10 | 67% | 85% | 66% | 269 tok |
| 1580 | [**Meshive**](https://github.com/meshive/meshive-mcp) <sub>ai.meshive/meshive</sub> | `B` | **73/100** | 71 | 73% | 87% | 55% | 477 tok |
| 1581 | [**SocialBlade Creator Stats**](https://github.com/benthepythondev00/apify-web-data-mcp) <sub>io.github.benthepythondev00/socialblade-creator-stats</sub> | `B` | **73/100** | 5 | 74% | 85% | 54% | 499 tok |
| 1582 | [**Syracuse Company News**](https://github.com/1145-am/syracuse-mcp-server) <sub>io.github.1145-am/syracuse-mcp-server</sub> | `B` | **73/100** | 6 | 93% | 85% | 53% | 768 tok |
| 1583 | [**PG1 Sovereign Threat Intelligence**](https://github.com/Project-Gifted1/pg1-ai-agent) <sub>io.github.Project-Gifted1/pg1-threat-intel</sub> | `B` | **73/100** | 22 | 92% | 86% | 53% | 420 tok |
| 1584 | [**Gotenberg by pagespool**](https://github.com/pagespool-com/pagespool) <sub>com.pagespool/gotenberg</sub> | `B` | **73/100** | 2 | 78% | 85% | 50% | 345 tok |
| 1585 | [**Cloud FinOps Skill &amp; MCP**](https://github.com/OptimNow/cloud-finops-skills) <sub>io.github.OptimNow/cloud-finops</sub> | `B` | **73/100** | 7 | 77% | 85% | 50% | 573 tok |
| 1586 | **SIBIDZ** <sub>io.sibidz/sibidz</sub> | `B` | **73/100** | 14 | 68% | 96% | 48% | 1152 tok |
| 1587 | [**app.sallim/contract-compass**](https://github.com/sallim-app/contract-compass) | `B` | **73/100** | 11 | 89% | 85% | 34% | 958 tok |
| 1588 | [**Antevo Research**](https://github.com/ANTEVO-CH/antevo-mcp) <sub>ch.antevo/research</sub> | `B` | **73/100** | 1 | 90% | 85% | 30% | 894 tok |
| 1589 | [**AtomicViz Diagrams**](https://github.com/briandiloreto/AtomicViz) <sub>com.atomicviz/diagrams</sub> | `B` | **73/100** | 1 | 90% | 85% | 30% | 1005 tok |
| 1590 | **Countersign** <sub>ai.llpro.countersign/countersign</sub> | `B` | **72/100** | 7 | 92% | 94% | 61% | 285 tok |
| 1591 | **Glowjakt** <sub>se.glowjakt/glowjakt</sub> | `B` | **72/100** | 7 | 67% | 87% | 61% | 321 tok |
| 1592 | **Split the Tab** <sub>ai.splitthetab/split-the-tab</sub> | `B` | **72/100** | 6 | 85% | 90% | 57% | 407 tok |
| 1593 | **Certified Mail Sender** <sub>com.certifiedmailsender/certified-mail</sub> | `B` | **72/100** | 6 | 89% | 85% | 57% | 496 tok |
| 1594 | [**Stabledrop escrow payments**](https://github.com/conduit-ucpi/ap2service) <sub>me.stabledrop/escrow-payments</sub> | `B` | **72/100** | 6 | 86% | 90% | 56% | 667 tok |
| 1595 | **CraterView.ai** <sub>ai.craterview/mcp</sub> | `B` | **72/100** | 15 | 92% | 88% | 52% | 580 tok |
| 1596 | [**EPUBCheck by pagespool**](https://github.com/pagespool-com/pagespool) <sub>com.pagespool/epubcheck</sub> | `B` | **72/100** | 1 | 75% | 85% | 50% | 382 tok |
| 1597 | [**PlanningLedger**](https://github.com/ifor/planningledger-mcp) <sub>com.planningledger/planningledger</sub> | `B` | **72/100** | 14 | 80% | 85% | 41% | 999 tok |
| 1598 | **UncensoredLLM** <sub>ai.uncensoredllm/api</sub> | `B` | **71/100** | 15 | 96% | 96% | 68% | 251 tok |
| 1599 | **UplinkSwitch** <sub>ai.uplinkswitch/api</sub> | `B` | **71/100** | 15 | 96% | 96% | 68% | 252 tok |
| 1600 | **Open Agent Guide** <sub>com.openagentguide/catalog</sub> | `B` | **71/100** | 8 | 63% | 93% | 55% | 839 tok |
| 1601 | **EU Payments Law** <sub>eu.paymentslaw/legislation</sub> | `B` | **71/100** | 16 | 71% | 90% | 53% | 432 tok |
| 1602 | [**Workeey Quote Links**](https://github.com/yossigrunwald/workeey-quote-links) <sub>com.workeey/quote-links</sub> | `B` | **71/100** | 6 | 97% | 85% | 40% | 1126 tok |
| 1603 | [**TenderAPI — French &amp; EU public tenders**](https://github.com/IDNSIDNS/tenderapi-mcp) <sub>io.github.IDNSIDNS/tenderapi-mcp</sub> | `B` | **70/100** | 3 | 73% | 85% | 43% | 1128 tok |
| 1604 | [**io.github.Ikalus1988/misakanet**](https://github.com/Ikalus1988/MisakaNet) | `B` | **70/100** | 8 | 91% | 85% | 40% | 606 tok |
| 1605 | **Neumann** <sub>io.github.Kromatic-Innovation/neumann</sub> | `B` | **70/100** | 23 | 85% | 85% | 40% | 1103 tok |
| 1606 | **Regga** <sub>ai.regga/regga</sub> | `C` | **68/100** | 1 | 78% | 85% | 30% | 965 tok |
| 1607 | [**Pond**](https://github.com/Smitten/pond-skill) <sub>com.datingpond/pond</sub> | `C` | **67/100** | 12 | 94% | 88% | 47% | 696 tok |
| 1608 | [**AICraft Injection Process**](https://github.com/DreamwayChan/aicraft-mcp-server) <sub>io.github.DreamwayChan/injection-process</sub> | `C` | **65/100** | 3 | 87% | 90% | 53% | 1002 tok |
| 1609 | [**io.github.Kromatic-Innovation/fermi**](https://github.com/Kromatic-Innovation/fermi) | `C` | **62/100** | 7 | 74% | 85% | 41% | 769 tok |
| 1610 | [**Avenity Business Solutions**](https://github.com/DanKaten/avenity-agentic-audit) <sub>io.github.DanKaten/avenity-agentic-audit</sub> | `D` | **59/100** | 8 | 48% | 85% | 40% | 577 tok |
| 1611 | [**BGPKIT API**](https://github.com/bgpkit/bgpkit-api-workers) <sub>com.bgpkit/bgpkit-api</sub> | `D` | **54/100** | 9 | 90% | 0% | 73% | 199 tok |

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
