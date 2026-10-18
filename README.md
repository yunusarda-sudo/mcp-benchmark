# 📊 MCP Benchmark (`mcp-benchmark`)

<div align="center">

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Model Context Protocol](https://img.shields.io/badge/MCP-Standard-6C5CE7?style=flat-square)](https://modelcontextprotocol.io/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)

**Deterministic quantitative quality benchmark and linter for Model Context Protocol (MCP) tool definitions.**

*Catch ambiguous descriptions, loose JSON schemas, and context token bloat before deploying agents to production.*

</div>

---

## 🎯 Why Tool Quality Matters

Autonomous AI agents (Claude, GPT, Ollama) fail most frequently at **tool selection** and **parameter compilation**:
- **Ambiguous Descriptions:** Tools with vague or conversational descriptions trigger tool selection hallucinations.
- **Loose Schemas:** Missing `type`, missing `enum` constraints, or omitted parameter descriptions force LLMs to guess input shapes.
- **Token Bloat:** Overly verbose schemas silently consume precious context window tokens on every single model turn.

`mcp-benchmark` provides a deterministic scoring formula — the **Tool Quality Index (TQI)** — to audit and grade MCP servers from `A+` (90–100) to `F` (<50).

---

## ⚡ Quickstart

No installation required. Run the reference benchmark suite immediately:

```bash
npx mcp-benchmark
```

### Lint Your Own MCP Server or Tool Definitions

Pass any JSON file containing an array of tool definitions or `{ "tools": [...] }`:

```bash
npx mcp-benchmark --file path/to/my-mcp-tools.json
```

Output results as machine-readable JSON:

```bash
npx mcp-benchmark -f tools.json --json
```

Use as a strict CI/CD gate (exits with code `1` if any tool scores below threshold):

```bash
npx mcp-benchmark -f tools.json --fail-under 85
```

---

## 🏆 Live Leaderboard (Reference Implementations)

| Rank | MCP Server | Grade | TQI Score | Schema Strictness | Semantic Density | Token Efficiency | Avg Tokens/Tool |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | **Postgres MCP (Official)** | `A+` | **96/100** | 90% | 100% | 100% | 68 tok |
| 2 | **Filesystem MCP (Official)** | `A+` | **95/100** | 90% | 100% | 95% | 73 tok |
| 3 | **Cremind MCP** | `A+` | **92/100** | 90% | 100% | 85% | 86 tok |
| 4 | **Taskade MCP** | `A+` | **91/100** | 95% | 90% | 85% | 110 tok |
| 5 | **Unoptimized Baseline** | `D` | **55/100** | 30% | 50% | 100% | 48 tok |

---

## 📐 Scoring Methodology (Tool Quality Index - TQI)

The Tool Quality Index evaluates three orthogonal dimensions:

```
TQI = (0.40 × Schema Strictness) + (0.35 × Semantic Density) + (0.25 × Token Efficiency)
```

### 1. Schema Strictness (40% Weight)
- Root type must be explicitly declared as `object`.
- 100% of parameters must specify valid JSON schema primitive types (`string`, `number`, `integer`, `boolean`, `array`, `object`).
- Parameter descriptions must be present on all arguments.
- High-value constraints (`enum`, `pattern`, `minimum`, `maximum`) are rewarded.

### 2. Semantic Density (35% Weight)
- **Imperative Action Verbs:** Tool descriptions should lead with action verbs (`read`, `query`, `create`, `search`, `validate`).
- **Optimal Character Bounds:** Ideal description length is 25 to 400 characters (detailed enough to prevent ambiguity, concise enough to avoid bloat).
- **Fluff Detection:** Penalizes conversational filler phrases (*"This tool allows you to...", "Basically used for..."*).

### 3. Context Token Footprint Efficiency (25% Weight)
- Efficient schemas (under 160 tokens) preserve agent context memory.
- Heavy schemas (>300 tokens) receive progressive efficiency penalties.

---

## 🤖 GitHub Actions CI/CD Integration

Prevent degraded tool schemas from reaching your `main` branch:

```yaml
name: Lint MCP Tools
on: [push, pull_request]

jobs:
  audit-tools:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Run MCP Benchmark Audit
        run: npx mcp-benchmark --file ./src/tools.json --fail-under 80
```

---

## 💻 Programmatic Usage (TypeScript / Node.js)

```typescript
import { analyzeToolDefinition, benchmarkServerTools } from 'mcp-benchmark';

const report = analyzeToolDefinition({
  name: 'search_database',
  description: 'Search customer records by verified email address.',
  inputSchema: {
    type: 'object',
    required: ['email'],
    properties: {
      email: { type: 'string', description: 'Customer email address.' },
    },
  },
});

console.log(`TQI Score: ${report.metrics.overallScore}/100`);
console.log(`Findings:`, report.findings);
```

---

## 🤝 Contributing

Contributions are warmly welcomed! Please read our [CONTRIBUTING.md](CONTRIBUTING.md) to get started.

1. Fork the repository
2. Create your topic branch (`git checkout -b feat/my-new-rule`)
3. Verify test suite (`npm test`)
4. Open a Pull Request

---

## 📄 License

MIT License © 2026 Yunus Arda Güney ([@yunusarda-sudo](https://github.com/yunusarda-sudo))
