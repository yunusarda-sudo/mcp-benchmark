# MCP Benchmark

[![CI](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml/badge.svg)](https://github.com/yunusarda-sudo/mcp-benchmark/actions/workflows/ci.yml)
[![MCP Registry Servers](https://img.shields.io/badge/MCP_Registry-200_Servers-blueviolet)](registry/servers/)
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
**200 servers · 2293 tools · last sync 2026-11-22.**
Last run: 70024 registry entries scanned, 41897 auth-free remote candidates, 200 returned tools, 179 required authentication, 21 failed (probe cap reached).
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
| 1 | **Tipline: unofficial GTA 6 guide** <sub>ae.brainy.tipline/gta6</sub> | `A+` | **95/100** | 4 | 95% | 100% | 89% | 113 tok |
| 2 | **ai.aqta/seal** | `A+` | **94/100** | 10 | 90% | 100% | 91% | 104 tok |
| 3 | **AI-Portal Enterprise GenAI Briefing** <sub>ai.ai-portal/ai-portal</sub> | `A+` | **94/100** | 4 | 95% | 100% | 85% | 116 tok |
| 4 | **Bolt Claw documentation** <sub>ai.boltclaw/docs</sub> | `A+` | **94/100** | 2 | 95% | 100% | 85% | 117 tok |
| 5 | **MRK Dubai Property** <sub>ae.mrk/dubai-property</sub> | `A+` | **94/100** | 22 | 95% | 100% | 82% | 144 tok |
| 6 | **Advisors AI — Route a Store Need to a Service** <sub>ai.advisorsai/service-navigator</sub> | `A+` | **94/100** | 5 | 100% | 100% | 73% | 166 tok |
| 7 | **AgentAPIHub — Walmart, Shopee, TikTok Shop, Shopify &amp; WooCommerce Catalog MCP** <sub>ai.agentapigate/amazon-product-walmart-shopify-ecommerce-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 8 | **ai.agentapigate/bluesky-substack-social-newsletter-scraper-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 9 | **ai.agentapigate/customs-bill-of-lading-import-export-trade-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 10 | **ai.agentapigate/douyin-xiaohongshu-rednote-social-scraper-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 11 | **ai.agentapigate/facebook-meta-google-tiktok-ads-library-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 12 | **ai.agentapigate/github-huggingface-arxiv-papers-repos-search-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 13 | **AgentAPIHub — Google Maps Places, Trustpilot, Yelp, G2 Reviews &amp; US Realty MCP** <sub>ai.agentapigate/google-maps-places-business-app-reviews-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 14 | **AgentAPIHub — Unified AI Agent Data &amp; Action API Hub \(75+ Tools, MCP &amp; x402\)** <sub>ai.agentapigate/google-serp-web-scraping-domain-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 15 | **ai.agentapigate/google-trends-seo-keywords-serp-search-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 16 | **AgentAPIHub — LinkedIn B2B Profiles, Company KYB &amp; 5-ATS Live Job Postings MCP** <sub>ai.agentapigate/job-postings-company-ats-career-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 17 | **AgentAPIHub — SEC EDGAR Filings, XBRL Facts, DEXScreener &amp; DefiLlama DeFi MCP** <sub>ai.agentapigate/linkedin-company-b2b-business-profile-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 18 | **ai.agentapigate/polymarket-odds-prediction-market-events-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 19 | **AgentAPIHub — YouTube Transcripts, TikTok, Instagram, Reddit &amp; Hacker News MCP** <sub>ai.agentapigate/reddit-hacker-news-forum-posts-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 20 | **AgentAPIHub — Domain RDAP/WHOIS/DNS/SSL, Shodan CVEs, arXiv &amp; ClinicalTrials MCP** <sub>ai.agentapigate/sec-edgar-crypto-real-estate-pinterest-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 21 | **ai.agentapigate/stocks-crypto-ohlcv-quote-market-data-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 22 | **ai.agentapigate/telegram-discord-twitch-kick-medium-pinterest-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 23 | **ai.agentapigate/threads-instagram-truthsocial-linkedin-posts-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 24 | **AgentAPIHub — Google SERP, News, Trends &amp; Clean Web-to-Markdown MCP** <sub>ai.agentapigate/tiktok-instagram-short-video-creator-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 25 | **AgentAPIHub — Real-Time X \(Twitter\) Search, Tweets, Threads &amp; Profiles MCP** <sub>ai.agentapigate/twitter-x-tweets-trending-topics-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |

<details>
<summary><b>▶ Click to expand all 200 ranked MCP servers (Ranks 26–200)</b></summary>

| Rank | MCP Server | Grade | TQI Score | Tools | Strictness | Density | Efficiency | Avg Tokens/Tool |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 26 | **AgentAPIHub — Zero-Signup x402 Base USDC Data &amp; Search MCP Hub** <sub>ai.agentapigate/youtube-transcript-video-subtitles-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 27 | **AgentAPIHub — Walmart, Shopee, TikTok Shop, Shopify &amp; WooCommerce Catalog MCP** <sub>ai.agentapihub/amazon-product-walmart-shopify-ecommerce-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 28 | **ai.agentapihub/bluesky-substack-social-newsletter-scraper-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 29 | **ai.agentapihub/customs-bill-of-lading-import-export-trade-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 30 | **ai.agentapihub/douyin-xiaohongshu-rednote-social-scraper-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 31 | **ai.agentapihub/facebook-meta-google-tiktok-ads-library-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 32 | **ai.agentapihub/github-huggingface-arxiv-papers-repos-search-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 33 | **AgentAPIHub — Google Maps Places, Trustpilot, Yelp, G2 Reviews &amp; US Realty MCP** <sub>ai.agentapihub/google-maps-places-business-app-reviews-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 34 | **AgentAPIHub — Unified AI Agent Data &amp; Action API Hub \(75+ Tools, MCP &amp; x402\)** <sub>ai.agentapihub/google-serp-web-scraping-domain-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 35 | **ai.agentapihub/google-trends-seo-keywords-serp-search-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 36 | **AgentAPIHub — LinkedIn B2B Profiles, Company KYB &amp; 5-ATS Live Job Postings MCP** <sub>ai.agentapihub/job-postings-company-ats-career-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 37 | **AgentAPIHub — SEC EDGAR Filings, XBRL Facts, DEXScreener &amp; DefiLlama DeFi MCP** <sub>ai.agentapihub/linkedin-company-b2b-business-profile-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 38 | **ai.agentapihub/polymarket-odds-prediction-market-events-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 39 | **AgentAPIHub — YouTube Transcripts, TikTok, Instagram, Reddit &amp; Hacker News MCP** <sub>ai.agentapihub/reddit-hacker-news-forum-posts-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 40 | **AgentAPIHub — Domain RDAP/WHOIS/DNS/SSL, Shodan CVEs, arXiv &amp; ClinicalTrials MCP** <sub>ai.agentapihub/sec-edgar-crypto-real-estate-pinterest-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 41 | **ai.agentapihub/stocks-crypto-ohlcv-quote-market-data-api-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 42 | **ai.agentapihub/telegram-discord-twitch-kick-medium-pinterest-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 43 | **ai.agentapihub/threads-instagram-truthsocial-linkedin-posts-mcp** | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 44 | **AgentAPIHub — Google SERP, News, Trends &amp; Clean Web-to-Markdown MCP** <sub>ai.agentapihub/tiktok-instagram-short-video-creator-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 45 | **AgentAPIHub — Real-Time X \(Twitter\) Search, Tweets, Threads &amp; Profiles MCP** <sub>ai.agentapihub/twitter-x-tweets-trending-topics-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 46 | **AgentAPIHub — Zero-Signup x402 Base USDC Data &amp; Search MCP Hub** <sub>ai.agentapihub/youtube-transcript-video-subtitles-search-mcp</sub> | `A+` | **93/100** | 4 | 86% | 100% | 93% | 82 tok |
| 47 | **BeevR** <sub>ai.beevr/beevr</sub> | `A+` | **93/100** | 8 | 90% | 100% | 89% | 86 tok |
| 48 | [**ac.tandem/docs-mcp**](https://github.com/frumu-ai/tandem) | `A+` | **93/100** | 13 | 94% | 100% | 84% | 124 tok |
| 49 | **One-Page Readiness Check — 10 Signals, Arabic or English** <sub>ai.advisorsai/store-readiness</sub> | `A+` | **93/100** | 1 | 100% | 100% | 70% | 186 tok |
| 50 | **hood. — .hood name service** <sub>ag.hood/name-service</sub> | `A+` | **92/100** | 5 | 80% | 100% | 100% | 66 tok |
| 51 | **AFMR Discovery** <sub>ai.afmr/discovery</sub> | `A+` | **92/100** | 4 | 83% | 100% | 96% | 80 tok |
| 52 | **agent-bev Library** <sub>ai.agent-bev/library</sub> | `A+` | **92/100** | 2 | 85% | 100% | 93% | 90 tok |
| 53 | **Autoblogging.ai** <sub>ai.autoblogging/autoblogging</sub> | `A+` | **92/100** | 6 | 88% | 100% | 88% | 101 tok |
| 54 | **Mizan** <sub>ac.mizan/registry</sub> | `A+` | **92/100** | 5 | 88% | 100% | 85% | 132 tok |
| 55 | **Almost Impossible** <sub>agency.almostimpossible/site</sub> | `A+` | **92/100** | 6 | 90% | 100% | 85% | 126 tok |
| 56 | **4ai – premium .ai domains for sale** <sub>ai.4ai/domains</sub> | `A+` | **92/100** | 10 | 89% | 100% | 85% | 117 tok |
| 57 | [**A2UI Atomic Catalog docs**](https://github.com/a2uicatalog/a2ui) <sub>ai.a2uicatalog/docs</sub> | `A+` | **92/100** | 2 | 90% | 100% | 85% | 124 tok |
| 58 | **AI Photo Animator** <sub>ai.aiphotoanimator/photo-animator</sub> | `A+` | **92/100** | 10 | 89% | 100% | 84% | 132 tok |
| 59 | [**Getlead**](https://github.com/Adgrowofficial/getlead-mcp) <sub>ad.getle/leads</sub> | `A+` | **92/100** | 35 | 93% | 99% | 81% | 159 tok |
| 60 | **AIS Gateway — the campus front desk for AIS MCP buildings** <sub>ai.aislabs/gateway</sub> | `A+` | **91/100** | 3 | 80% | 100% | 95% | 77 tok |
| 61 | [**ai.blast-radius/blast-radius**](https://github.com/kipmcc/blast-radius-live) | `A+` | **91/100** | 9 | 88% | 98% | 88% | 109 tok |
| 62 | **APEX Runner Crypto Signals** <sub>ai.apexrunner/signals</sub> | `A+` | **91/100** | 52 | 88% | 98% | 87% | 102 tok |
| 63 | **Bring Your AI** <sub>ai.bringyour/bringyour</sub> | `A+` | **91/100** | 7 | 87% | 100% | 83% | 125 tok |
| 64 | **Events.Aero** <sub>aero.events/events</sub> | `A+` | **91/100** | 5 | 90% | 100% | 81% | 184 tok |
| 65 | [**agent-bev**](https://github.com/agent-bev/bev-door) <sub>ai.agent-bev/bev-door</sub> | `A+` | **91/100** | 9 | 90% | 100% | 81% | 129 tok |
| 66 | **Alcock Arena** <sub>ai.alcock/arena</sub> | `A+` | **91/100** | 9 | 91% | 100% | 80% | 147 tok |
| 67 | [**Analytics Legends — SAP AI &amp; Analytics MCP Server**](https://github.com/analyticslegends/analytics-legends-mcp) <sub>ai.analyticslegends/sap-analytics</sub> | `A+` | **91/100** | 25 | 90% | 100% | 80% | 154 tok |
| 68 | **BliniBot Agent Lounge** <sub>ai.blinibot/agent-lounge</sub> | `A+` | **91/100** | 16 | 91% | 100% | 79% | 162 tok |
| 69 | **ai.artidrop/artidrop** | `A+` | **91/100** | 4 | 95% | 96% | 76% | 191 tok |
| 70 | **Aldro: small-business tax** <sub>ai.aldro/tax</sub> | `A+` | **91/100** | 8 | 99% | 98% | 68% | 250 tok |
| 71 | [**Atako**](https://github.com/aiybiz/atako-mcp) <sub>ai.atako/mcp</sub> | `A+` | **91/100** | 4 | 98% | 100% | 65% | 278 tok |
| 72 | **Alexey Sound — sound recordist, Dubai** <sub>ae.alexeysound/alexey-sound</sub> | `A+` | **90/100** | 3 | 80% | 100% | 90% | 115 tok |
| 73 | [**BenchGecko**](https://github.com/BenchGecko/datasets) <sub>ai.benchgecko/benchgecko</sub> | `A+` | **90/100** | 9 | 83% | 98% | 90% | 99 tok |
| 74 | **AIS CVE Priorities — daily exploit-ranked patch list for AI agents** <sub>ai.aislabs/cve</sub> | `A+` | **90/100** | 4 | 83% | 100% | 89% | 89 tok |
| 75 | **Third Hemisphere AI Authority Index** <sub>agency.thirdhemisphere/ai-authority-index</sub> | `A+` | **90/100** | 12 | 86% | 100% | 83% | 124 tok |
| 76 | [**AgentRoam**](https://github.com/adiny/nomad-crypto-travel) <sub>ai.agentroam/agentroam</sub> | `A+` | **90/100** | 11 | 87% | 100% | 82% | 155 tok |
| 77 | [**agency.goji/goji**](https://github.com/goji-agency/goji-mcp) | `A+` | **90/100** | 9 | 89% | 100% | 79% | 150 tok |
| 78 | **Atom Industries** <sub>ai.atomindustries/agent-channel</sub> | `A+` | **90/100** | 7 | 89% | 100% | 79% | 274 tok |
| 79 | **Atom Technologies** <sub>ai.atomtechnologies/agent-channel</sub> | `A+` | **90/100** | 7 | 89% | 100% | 79% | 274 tok |
| 80 | **Pantheon** <sub>ad.pantheon/mcp</sub> | `A+` | **90/100** | 38 | 94% | 98% | 78% | 184 tok |
| 81 | [**Bankrolled.ai Agent Hub**](https://github.com/Bankrolled/bankrolled-ai-mcp) <sub>ai.bankrolled/agent-hub</sub> | `A+` | **90/100** | 5 | 90% | 97% | 78% | 167 tok |
| 82 | [**bitHuman docs**](https://gitlab.com/projects/87208064) <sub>ai.bithuman/docs</sub> | `A+` | **90/100** | 2 | 95% | 93% | 78% | 209 tok |
| 83 | [**asms**](https://github.com/asms-ai/asms-mcp) <sub>ai.asms/asms</sub> | `A+` | **90/100** | 14 | 91% | 98% | 77% | 171 tok |
| 84 | **Avlira Back Office** <sub>ai.avlira/back-office</sub> | `A+` | **90/100** | 28 | 89% | 99% | 77% | 168 tok |
| 85 | **AwardCast Federal Contracts** <sub>ai.awardcast/federal-contracts</sub> | `A+` | **90/100** | 8 | 93% | 98% | 76% | 167 tok |
| 86 | **Inside Ads** <sub>ad.inside/inside-ads</sub> | `A+` | **90/100** | 3 | 90% | 100% | 75% | 209 tok |
| 87 | **tide** <sub>ad.tide/mcp</sub> | `A+` | **90/100** | 38 | 93% | 97% | 75% | 197 tok |
| 88 | **BugTape demo** <sub>ai.bugtape/bugtape-demo</sub> | `A+` | **90/100** | 14 | 94% | 97% | 75% | 210 tok |
| 89 | [**ai.adoraads/beauty**](https://github.com/DIGIBIZ360-COM/adoraads) | `A+` | **90/100** | 6 | 93% | 98% | 72% | 202 tok |
| 90 | [**Contractor Licence Changes**](https://github.com/modelcontextprotocol/registry) <sub>agency.ottobot/contractor-license-changes</sub> | `A+` | **90/100** | 2 | 100% | 93% | 70% | 278 tok |
| 91 | **amigurumi.ai** <sub>ai.amigurumi/patterns</sub> | `A+` | **90/100** | 3 | 99% | 100% | 62% | 326 tok |
| 92 | [**Agentic Terminal Directory**](https://github.com/observer-protocol/at-directory) <sub>ai.agenticterminal/directory</sub> | `A` | **89/100** | 6 | 78% | 100% | 90% | 91 tok |
| 93 | **ai.aivonic/mcp** | `A` | **89/100** | 5 | 86% | 100% | 79% | 120 tok |
| 94 | **BidBetter collector-car values** <sub>ai.bidbetter/collector-car-values</sub> | `A` | **89/100** | 2 | 85% | 100% | 78% | 130 tok |
| 95 | **28/28 Agent Service Desk: Fix &amp; Verify** <sub>ai.28in28/agent-service-desk</sub> | `A` | **89/100** | 3 | 93% | 95% | 75% | 171 tok |
| 96 | **Bot Appétit** <sub>ai.botappetit/bot-appetit</sub> | `A` | **89/100** | 14 | 91% | 95% | 75% | 192 tok |
| 97 | **ASRM \(AI Search Rank Monitor\)** <sub>ai.asrm/asrm</sub> | `A` | **89/100** | 4 | 93% | 96% | 74% | 164 tok |
| 98 | [**b/cited**](https://github.com/cmunkres/bcited-cf) <sub>ai.bcited/bcited</sub> | `A` | **89/100** | 6 | 93% | 95% | 74% | 187 tok |
| 99 | **Atmy air quality** <sub>ai.atmy/air-quality</sub> | `A` | **89/100** | 12 | 92% | 99% | 72% | 234 tok |
| 100 | **Arclan MCP Registry** <sub>ai.arclan/registry</sub> | `A` | **89/100** | 6 | 92% | 98% | 71% | 254 tok |
| 101 | [**bevGTIN**](https://github.com/agent-bev/bevgtin) <sub>ai.agent-bev/bevgtin</sub> | `A` | **89/100** | 1 | 90% | 100% | 70% | 211 tok |
| 102 | [**ai.agentberg/agentberg**](https://github.com/Agentberg/agentberg) | `A` | **89/100** | 11 | 93% | 97% | 70% | 232 tok |
| 103 | **ai.askmiles/catalog** | `A` | **89/100** | 5 | 94% | 97% | 68% | 254 tok |
| 104 | **AirboxShip Shipping \(public\)** <sub>ai.airboxship/shipping-public</sub> | `A` | **89/100** | 3 | 93% | 100% | 63% | 293 tok |
| 105 | **BeachClubs.ae** <sub>ae.beachclubs/mcp</sub> | `A` | **89/100** | 4 | 95% | 100% | 60% | 336 tok |
| 106 | **Discond** <sub>ae.discond/discond</sub> | `A` | **89/100** | 9 | 100% | 98% | 56% | 364 tok |
| 107 | **AIS Agent Flight Recorder — dead-man alerts &amp; resume for AI agents** <sub>ai.aislabs/recorder</sub> | `A` | **88/100** | 5 | 80% | 97% | 88% | 131 tok |
| 108 | **Bureau public reader** <sub>agency.thebureauoflostcontext/bureau-public</sub> | `A` | **88/100** | 5 | 80% | 100% | 85% | 110 tok |
| 109 | **ai.artemisgtm/gtm-engineer** | `A` | **88/100** | 5 | 86% | 94% | 85% | 119 tok |
| 110 | [**BumbleBox**](https://github.com/BumbleBox/bumblebox-mcp) <sub>ai.bumblebox/mail</sub> | `A` | **88/100** | 18 | 84% | 98% | 81% | 149 tok |
| 111 | **AIM SHIELD** <sub>ai.aim-shield/mcp</sub> | `A` | **88/100** | 10 | 88% | 96% | 79% | 163 tok |
| 112 | **GENOSYS UAE** <sub>ae.genosys/genosys</sub> | `A` | **88/100** | 11 | 85% | 100% | 74% | 211 tok |
| 113 | **Bezal — Local Business Intelligence for AI Agents** <sub>ai.bezal/local-commerce</sub> | `A` | **88/100** | 9 | 96% | 92% | 73% | 216 tok |
| 114 | **Plant Guide: Dubai gardening research** <sub>ae.plantguide/dubai-gardening</sub> | `A` | **88/100** | 15 | 93% | 96% | 69% | 284 tok |
| 115 | [**ai.bitroad/bitroad**](https://github.com/bitroadai/bitroad-mcp) | `A` | **88/100** | 93 | 95% | 95% | 66% | 365 tok |
| 116 | **Acubic** <sub>ai.acubic/acubic</sub> | `A` | **88/100** | 24 | 97% | 96% | 63% | 456 tok |
| 117 | **Agent Ready Report** <sub>ai.agenticplug/agent-ready-report</sub> | `A` | **88/100** | 2 | 100% | 93% | 60% | 332 tok |
| 118 | **Bordet AI** <sub>ai.bordet/bordet</sub> | `A` | **87/100** | 11 | 76% | 100% | 88% | 109 tok |
| 119 | [**ARC: agent checkout reachability**](https://github.com/abab7575/arc-mcp) <sub>ai.arcreport/mcp</sub> | `A` | **87/100** | 19 | 88% | 94% | 77% | 183 tok |
| 120 | [**Axad**](https://github.com/axad-ai/plugins) <sub>ai.axad/language-tutor</sub> | `A` | **87/100** | 23 | 84% | 99% | 77% | 441 tok |
| 121 | [**BorealHost**](https://github.com/alainsvrd/borealhost-mcp) <sub>ai.borealhost/mcp</sub> | `A` | **87/100** | 184 | 89% | 94% | 76% | 193 tok |
| 122 | [**Business Contact Finder**](https://github.com/modelcontextprotocol/registry) <sub>agency.ottobot/business-contact-finder</sub> | `A` | **87/100** | 1 | 100% | 85% | 70% | 194 tok |
| 123 | **Builders in Fintech** <sub>ai.buildersinfintech/fintech-data</sub> | `A` | **87/100** | 32 | 94% | 92% | 69% | 234 tok |
| 124 | [**Licensed House Painters**](https://github.com/modelcontextprotocol/registry) <sub>agency.ottobot/licensed-house-painters</sub> | `A` | **87/100** | 3 | 97% | 90% | 68% | 258 tok |
| 125 | **bluerate: Find a Mortgage Loan Officer** <sub>ai.bluerate/loan-officers</sub> | `A` | **87/100** | 3 | 97% | 90% | 68% | 286 tok |
| 126 | **Best AI Search Agency AEO Report** <sub>ai.aeoengine/best-ai-search-agency-aeo-report</sub> | `A` | **87/100** | 4 | 94% | 96% | 64% | 332 tok |
| 127 | **JustIdea Agency** <sub>agency.justidea/justidea-agency</sub> | `A` | **87/100** | 8 | 98% | 93% | 61% | 379 tok |
| 128 | **Moha: hire in the UAE** <sub>ae.employerofrecord/moha</sub> | `A` | **87/100** | 5 | 92% | 100% | 60% | 365 tok |
| 129 | **AppGoat** <sub>ai.appgoat/mcp</sub> | `A` | **87/100** | 26 | 99% | 94% | 58% | 383 tok |
| 130 | **ai.bidclub/bidclub** | `A` | **87/100** | 6 | 97% | 98% | 56% | 412 tok |
| 131 | **Agentic Engineering Periodic System** <sub>academy.ase/periodic-system</sub> | `A` | **86/100** | 4 | 73% | 100% | 89% | 95 tok |
| 132 | [**AiVikings.ai**](https://github.com/AIvikings/aivikings-mcp) <sub>ai.aivikings/registrar</sub> | `A` | **86/100** | 38 | 82% | 96% | 80% | 160 tok |
| 133 | **Agent Puzzle Bounty — cooperative k-of-n decode challenge** <sub>ai.brevium/agent-puzzle-bounty</sub> | `A` | **86/100** | 15 | 87% | 94% | 75% | 196 tok |
| 134 | **Agenlify AI Agent Directory** <sub>ai.agenlify/catalog</sub> | `A` | **86/100** | 3 | 82% | 100% | 73% | 185 tok |
| 135 | **Augenix** <sub>ai.augenix/build</sub> | `A` | **86/100** | 3 | 90% | 95% | 68% | 236 tok |
| 136 | **bitHuman** <sub>ai.bithuman/characters</sub> | `A` | **86/100** | 3 | 93% | 90% | 68% | 268 tok |
| 137 | **Arcangel Trademark Search** <sub>ai.arcangel/trademark-search</sub> | `A` | **86/100** | 9 | 89% | 98% | 63% | 447 tok |
| 138 | **Brainz** <sub>ai.brownmatter/brainz</sub> | `A` | **86/100** | 18 | 94% | 93% | 63% | 362 tok |
| 139 | [**aChurch.ai**](https://github.com/a-church-ai/church) <sub>ai.achurch/church</sub> | `A` | **86/100** | 10 | 96% | 94% | 61% | 363 tok |
| 140 | **groTAX by Grovisor** <sub>ae.grovisor/grotax</sub> | `A` | **86/100** | 8 | 91% | 100% | 58% | 481 tok |
| 141 | **Assistable** <sub>ai.assistable/assistable</sub> | `A` | **85/100** | 16 | 78% | 97% | 80% | 275 tok |
| 142 | [**BetterPost**](https://github.com/betterpost/betterpost-plugin) <sub>ai.betterpost/server</sub> | `A` | **85/100** | 23 | 83% | 98% | 76% | 197 tok |
| 143 | [**Singapore new launches**](https://github.com/danielkoh/property-bluebed-mcp) <sub>ai.bluebed.property/new-launches</sub> | `A` | **85/100** | 11 | 85% | 92% | 76% | 211 tok |
| 144 | **APIR Agent Verification** <sub>ai.apir/verify</sub> | `A` | **85/100** | 3 | 87% | 90% | 75% | 208 tok |
| 145 | **Agentboard** <sub>ai.agentboard/agentboard</sub> | `A` | **85/100** | 38 | 84% | 96% | 74% | 223 tok |
| 146 | **AgenticCart: AI readiness checks for online stores** <sub>ai.agenticcart/agenticcart</sub> | `A` | **85/100** | 5 | 90% | 88% | 73% | 190 tok |
| 147 | **GroundRules - US Law Text** <sub>ai.agentlookups/groundrules</sub> | `A` | **85/100** | 4 | 86% | 93% | 73% | 234 tok |
| 148 | **agent-cronjob** <sub>ai.agentasy/cronjob</sub> | `A` | **85/100** | 15 | 88% | 99% | 71% | 234 tok |
| 149 | **AgentCV** <sub>ai.agentcv/registry</sub> | `A` | **85/100** | 6 | 88% | 93% | 71% | 241 tok |
| 150 | **Excellent Reference \(free\)** <sub>ai.beexcellent/reference</sub> | `A` | **85/100** | 5 | 92% | 91% | 66% | 229 tok |
| 151 | [**ai.bizmoon/regulatory**](https://github.com/uofuonye/bizmoon-plugins) | `A` | **85/100** | 5 | 94% | 91% | 64% | 267 tok |
| 152 | **AlpiX** <sub>ai.alpic.alpix/Alpix</sub> | `A` | **85/100** | 3 | 93% | 95% | 57% | 474 tok |
| 153 | **AgentsRank** <sub>ai.agentsrank/agentsrank</sub> | `A` | **84/100** | 20 | 76% | 99% | 78% | 193 tok |
| 154 | **AutoPoster AI** <sub>ai.autoposter/autoposter</sub> | `A` | **84/100** | 16 | 91% | 97% | 76% | 230 tok |
| 155 | [**Alpha Bazaar Arena**](https://github.com/alphabazaar/skills) <sub>ai.alphabazaar/arena</sub> | `A` | **84/100** | 24 | 85% | 96% | 73% | 210 tok |
| 156 | **1Court Directory** <sub>ai.1court.state/court-directory</sub> | `A` | **84/100** | 11 | 88% | 90% | 68% | 271 tok |
| 157 | **Spoon Scout - Food Contaminant Lookup** <sub>ai.agentlookups/spoon-scout</sub> | `A` | **84/100** | 6 | 90% | 90% | 68% | 281 tok |
| 158 | [**ARVX**](https://github.com/centricai/arvx-mcp) <sub>ai.arvx/arvx</sub> | `A` | **84/100** | 3 | 83% | 100% | 62% | 481 tok |
| 159 | [**AGILEX Docs**](https://github.com/wgjsg/agilex-docs-mcp) <sub>ai.agilex.service/docs</sub> | `A` | **84/100** | 5 | 96% | 88% | 61% | 321 tok |
| 160 | **Projectory** <sub>ae.projectory/mcp</sub> | `A` | **84/100** | 6 | 95% | 90% | 59% | 388 tok |
| 161 | [**Buhalteris.ai**](https://github.com/KalnuErelis/mb-buhalteris-ai) <sub>ai.buhalteris/mcp</sub> | `A` | **84/100** | 7 | 100% | 87% | 56% | 402 tok |
| 162 | **Augmap** <sub>ai.augmap/maps</sub> | `A` | **84/100** | 10 | 90% | 98% | 55% | 688 tok |
| 163 | **Brainy Prices — UAE Cost of Living** <sub>ae.brainy/grocery-prices</sub> | `A` | **83/100** | 26 | 72% | 100% | 78% | 161 tok |
| 164 | [**Dubai Data — Dubai real estate statistics**](https://github.com/datadubai/dubai-real-estate-dld) <sub>ae.datadubai/dubai-real-estate</sub> | `A` | **83/100** | 6 | 82% | 90% | 78% | 175 tok |
| 165 | [**Apex AI Academy**](https://github.com/ApexAI-Academy/sample-agents) <sub>academy.apexai/apex-ai-academy</sub> | `A` | **83/100** | 30 | 92% | 94% | 69% | 261 tok |
| 166 | [**A2UI Atomic Catalog**](https://github.com/a2uicatalog/a2ui) <sub>ai.a2uicatalog/catalog</sub> | `A` | **83/100** | 40 | 91% | 91% | 65% | 312 tok |
| 167 | [**Ahel**](https://github.com/ahel-technologies/ahel) <sub>ai.ahel/ahel</sub> | `A` | **83/100** | 11 | 90% | 92% | 58% | 405 tok |
| 168 | **BitTuitive** <sub>ai.bittuitive.api/bittuitive</sub> | `A` | **83/100** | 28 | 96% | 90% | 53% | 542 tok |
| 169 | **zoll.agency** <sub>agency.zoll/ausfuhr</sub> | `A` | **83/100** | 8 | 98% | 93% | 47% | 936 tok |
| 170 | **BaseEdge Labs Catalog** <sub>ai.baseedgelabs/catalog</sub> | `A` | **82/100** | 4 | 88% | 85% | 69% | 220 tok |
| 171 | **Booqer** <sub>ai.booqer/booqer</sub> | `A` | **82/100** | 9 | 90% | 92% | 67% | 328 tok |
| 172 | **Bot Office** <sub>ai.aibotoffice/bot-office</sub> | `A` | **82/100** | 24 | 95% | 89% | 64% | 348 tok |
| 173 | **AutEng Docs — Agent Document Workspace &amp; Publishing** <sub>ai.auteng/docs</sub> | `A` | **82/100** | 6 | 89% | 88% | 63% | 278 tok |
| 174 | **BotInfo — Advanced Robot Market Data** <sub>ai.botinfo/robot-market-data</sub> | `A` | **82/100** | 6 | 92% | 85% | 63% | 243 tok |
| 175 | [**Ankra Docs**](https://github.com/ankraio/cursor-plugin) <sub>ai.ankra/docs</sub> | `A` | **82/100** | 3 | 90% | 90% | 57% | 423 tok |
| 176 | [**Agent Blueprint**](https://github.com/agent-blueprint/agent-blueprint-website) <sub>ai.agentblueprint/agent-blueprint</sub> | `A` | **82/100** | 4 | 93% | 89% | 55% | 390 tok |
| 177 | [**Aviado AI**](https://github.com/kipmcc/aviado-mcp) <sub>ai.aviado/health</sub> | `A` | **82/100** | 11 | 97% | 85% | 54% | 376 tok |
| 178 | [**Achromat Machine Operational Memory**](https://github.com/achromat-ai/achromat-mcp-server) <sub>ai.achromat/mcp-server</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 536 tok |
| 179 | **Arabic Name Calligraphy** <sub>ai.arabickeyboard/name-calligraphy</sub> | `A` | **82/100** | 1 | 100% | 85% | 50% | 329 tok |
| 180 | [**Orbit**](https://github.com/postmanlabs/orbit-mcp-server) <sub>ai.buildwithorbit/orbit</sub> | `A` | **82/100** | 2 | 100% | 85% | 50% | 490 tok |
| 181 | **Divisi** <sub>africa.divisi/divisi</sub> | `A` | **81/100** | 47 | 76% | 95% | 71% | 233 tok |
| 182 | **AFG: agents hire agents \(test money\)** <sub>ai.afg/afg</sub> | `A` | **81/100** | 18 | 79% | 95% | 63% | 352 tok |
| 183 | **BUMIT** <sub>ai.bumit/verify-business</sub> | `A` | **81/100** | 3 | 93% | 85% | 57% | 442 tok |
| 184 | **AirShelf Catalog** <sub>ai.airshelf/catalog</sub> | `A` | **81/100** | 8 | 94% | 87% | 52% | 540 tok |
| 185 | **GroundTruth - Environmental Records** <sub>ai.agentlookups/groundtruth</sub> | `A` | **81/100** | 4 | 100% | 85% | 45% | 469 tok |
| 186 | [**ai.atdev/supershopping**](https://github.com/alex-hoyeol-choi/headless-commerce) | `B` | **79/100** | 8 | 60% | 100% | 79% | 141 tok |
| 187 | **AthenaHQ** <sub>ai.athenahq/mcp</sub> | `B` | **79/100** | 132 | 83% | 92% | 54% | 587 tok |
| 188 | [**ai.autonomad/travel**](https://github.com/autonomad-ai/autonomad) | `B` | **79/100** | 14 | 92% | 87% | 48% | 606 tok |
| 189 | [**BetSlip Doctor**](https://github.com/opspot-ai/betslipdoctor-mcp) <sub>ai.betslipdoctor/mcp</sub> | `B` | **78/100** | 106 | 79% | 93% | 65% | 369 tok |
| 190 | **ARC \(arcreport.ai\): can an agent reach checkout?** <sub>ai.arcreport/ask</sub> | `B` | **78/100** | 7 | 94% | 85% | 44% | 496 tok |
| 191 | **AQL PropertyCheck — check one exact address \(Gold Coast &amp; Brisbane\)** <sub>ai.alphaquantlabs/propertycheck</sub> | `B` | **78/100** | 2 | 95% | 85% | 40% | 639 tok |
| 192 | [**BaziChart**](https://github.com/bazichart/bazichart-mcp) <sub>ai.bazichart/bazichart-mcp</sub> | `B` | **77/100** | 2 | 100% | 85% | 30% | 621 tok |
| 193 | **B4 Index** <sub>ai.benroberts/b4-index</sub> | `B` | **77/100** | 5 | 100% | 85% | 30% | 1018 tok |
| 194 | **Agentic Fabrication Network \(AFN\)** <sub>ai.agenticfabricationnetwork/ufp</sub> | `B` | **76/100** | 23 | 92% | 87% | 47% | 1486 tok |
| 195 | [**BeliefState**](https://github.com/Antcolombo/beliefstate-agent-integrations) <sub>ai.beliefstate/investor-research</sub> | `B` | **76/100** | 23 | 88% | 88% | 41% | 719 tok |
| 196 | **AgentsIndex** <sub>ai.agentsindex/mcp</sub> | `B` | **75/100** | 11 | 88% | 95% | 76% | 186 tok |
| 197 | **CounterScript - Drug Price Benchmarks** <sub>ai.agentlookups/counterscript</sub> | `B` | **73/100** | 1 | 90% | 85% | 30% | 1808 tok |
| 198 | **ai.agentlookups/overassessed** | `B` | **73/100** | 1 | 90% | 85% | 30% | 1871 tok |
| 199 | **Plumbline - Contractor License Checks** <sub>ai.agentlookups/plumbline</sub> | `B` | **73/100** | 1 | 90% | 85% | 30% | 1151 tok |
| 200 | [**Agentgates Compute**](https://github.com/agentgates-ai/agentgates) <sub>ai.agentgates/compute</sub> | `C` | **66/100** | 3 | 90% | 85% | 62% | 428 tok |

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
