---
name: mcp-benchmark
description: Lint and score Model Context Protocol (MCP) tool definitions with mcp-benchmark. Use when building, reviewing or debugging an MCP server, when asked whether a server's tools are well described, to check tool schemas before release, to estimate how many context tokens a server's tools cost, or to add an MCP quality gate to CI.
---

# MCP tool-definition audit

`mcp-benchmark` scores each tool's schema strictness, description quality and token footprint, then rolls them up into a 0-100 Tool Quality Index (TQI) with a letter grade and concrete findings. It is deterministic: the same input always gives the same score, so results can be compared across commits.

Run it with npx. No install or API key is needed:

```bash
npx --yes github:yunusarda-sudo/mcp-benchmark <options>
```

## Pick the input

| The user has | Run |
| --- | --- |
| A JSON file with `{"tools": [...]}` (the shape of a `tools/list` result) | `-f tools.json` |
| A local stdio server they trust | `--cmd "node dist/index.js"` |
| A remote HTTP+SSE endpoint | `-u https://host/sse` |
| A client config (Claude Desktop, Cursor, VS Code) | `-c path/to/mcp.json` |

If the server only exists as source code, build `tools.json` from its tool registrations (name, description, inputSchema) and lint the file. Do not start the server just to read its tools.

`--cmd` executes the given command and `-c` launches every server in the config. Only use them on code the user trusts, and say so before running. Never paste tokens into `-H` yourself; ask the user to supply them.

## Steps

1. Run with `--json` so you can read the result precisely:
   `npx --yes github:yunusarda-sudo/mcp-benchmark -f tools.json --json`
2. Report the overall TQI and grade, then the lowest-scoring tools with their `findings`. Quote the rule and the location it points at.
3. Propose concrete rewrites for the weakest tools: a description that states what the tool does, when to use it, and what it returns; a description for every parameter; `required`, `enum`, `minimum`/`maximum` and `pattern` where the values are known.
4. Apply the edits to the server's source, not only to the JSON copy. `--fix --write` can clean the JSON file automatically, but review its changes before keeping them.
5. Re-run and show the before/after score.

## Useful options

- `--cost`: estimated context tokens and API cost of loading the tools.
- `--baseline before.json -f after.json --fail-on breaking`: catch removed tools, renamed parameters and new required fields.
- `--fail-under 80`: exit 1 when the TQI is below the threshold.
- `--sarif`, `--html`, `--badge`, `--pr-comment`: report files for code scanning, sharing, READMEs and pull requests.
- `--rules`: list every rule with its explanation.

## Add it to CI

```yaml
- uses: yunusarda-sudo/mcp-benchmark@v1
  with:
    file: tools.json
    fail-under: 80
    sarif: mcp-benchmark.sarif
```
