# Contributing to MCP Benchmark

Issues and pull requests are welcome. Include the command you ran, your Node version, and a small sanitized fixture that reproduces the problem. Remove credentials, customer data, and private endpoints from fixtures and reports.

## Develop locally

```bash
npm ci
npm run build
npm test
node dist/cli.js --file examples/sample-mcp-tools.json --json
```

Edit the TypeScript in `src/` and run the build again. The repository tracks the generated `dist/` files for distribution. Include regenerated files when source changes affect the build. CI verifies that `dist/` matches the source and runs the tests on Node 18, 20, and 22.

## Propose a scoring change

Use small fixtures with clear expected behavior. Explain which signal changes, why the existing score is misleading, and how the bundled examples score before and after. Prefer separate examples for cases that should pass and cases that should produce a finding. Keep test inputs local so contributors can run them without credentials or a hosted MCP server.
