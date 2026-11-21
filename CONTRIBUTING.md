# Contributing to MCP Benchmark

Welcome! We are excited to collaborate with the AI and Model Context Protocol (MCP) community to build the definitive, transparent, and reproducible quality standard for LLM tool interfaces.

Whether you want to **list your MCP server on the Official Leaderboard**, **author a new linter or security check**, or **improve automated fixers**, this guide will help you get started quickly.

---

## 🌟 1. Submit Your MCP Server to the Official Leaderboard

We maintain a living leaderboard of 100+ standard and community MCP servers. Listing your server helps users find your tools, verifies schema health, and provides a crisp TQI grade badge for your repository.

### Option A: Quick Pull Request (Recommended)
1. Create a JSON definition for your server in `registry/servers/<slug>.json` conforming to [`registry/schema.json`](registry/schema.json):
   ```json
   {
     "$schema": "../schema.json",
     "name": "Supabase MCP",
     "category": "Databases & Storage",
     "description": "Supabase database and management tools for AI agents.",
     "repository": "https://github.com/supabase/mcp-server-supabase",
     "maintainer": "@your-github-username",
     "tools": [
       {
         "name": "query_database",
         "description": "Execute a parameterized SQL query against the connected project.",
         "inputSchema": {
           "type": "object",
           "required": ["sql"],
           "properties": {
             "sql": {
               "type": "string",
               "description": "The read-only SELECT query to run."
             }
           }
         }
       }
     ]
   }
   ```
2. Run the update script to re-score and refresh the README:
   ```bash
   npm run update-leaderboard
   ```
3. Open a Pull Request! Our automated GitHub Action will validate your schema, verify your TQI score, and preview your badge.

### Option B: Using the CLI
If you already have your tool definitions exported locally:
```bash
node dist/cli.js --submit my-tools.json \
  --name "My Awesome MCP" \
  --category "Productivity & Notes" \
  --repo "https://github.com/my-org/my-awesome-mcp"
```

---

## 📐 2. Add a New Benchmark or Linter Rule

All rules in `mcp-benchmark` are modular and pluggable under [`src/rules/`](src/rules/). You can view all currently registered rules at any time:
```bash
npm run rules
# or: node dist/cli.js --rules
```

### Rule Categories
- **`naming`**: Tool naming conventions, length restrictions, characters (`src/rules/namingRules.ts`).
- **`schema`**: JSON Schema correctness, required fields, array items, enums, defaults (`src/rules/schemaRules.ts`).
- **`semantic`**: Description adequacy, action verbs, filler phrases (`src/rules/semanticRules.ts`).
- **`security`**: Prompt injection defense, covert instructions, exfiltration patterns (`src/rules/securityRules.ts`).
- **`efficiency`**: Token footprint, oversized schemas, redundant properties (`src/rules/efficiencyRules.ts`).

### Authoring a New Rule
1. Open the relevant file in `src/rules/` (e.g. `src/rules/schemaRules.ts`) or create a new one.
2. Implement the `RuleDefinition` interface:
   ```typescript
   import { RuleDefinition, RuleContext } from './types.js';
   import { ToolDiagnostic } from '../types.js';

   export const myNewRule: RuleDefinition = {
     id: 'schema.disallow-redundant-keys',
     name: 'Avoid duplicate required keys',
     category: 'schema',
     defaultSeverity: 'warning',
     description: 'Checks that inputSchema.required does not contain duplicate entries.',
     suggestion: 'Deduplicate property names in required array.',
     check(ctx: RuleContext): ToolDiagnostic[] {
       // Inspect ctx.tool, ctx.properties, ctx.desc, etc.
       return [];
     },
   };
   ```
3. Export the rule in `ALL_RULES` in `src/rules/index.ts`.
4. Add a test in `test/features.test.js` or `test/community.test.js`.
5. Run tests:
   ```bash
   npm run build && npm test
   ```

---

## 🔧 3. Improve Automated Fixers

The automated fixer (`src/fixer.ts`) powers `--fix` and `--write`, allowing developers to automatically clean conversational fluff, fix missing root types, and repair broken schemas with a single command:
```bash
node dist/cli.js -f my-tools.json --fix --write
```
To contribute a new fix:
- Open [`src/fixer.ts`](src/fixer.ts).
- Add or improve logic inside `fixToolDefinition()`.
- Record changes in the `changes` array with `action` and `detail`.
- Add test coverage in `test/features.test.js`.

---

## 💻 Local Development Workflow

```bash
# 1. Install dependencies
npm ci

# 2. Build TypeScript
npm run build

# 3. Run test suite (Node built-in test runner)
npm test

# 4. Discover local MCP setups on your machine
npm run discover

# 5. Lint a sample file
node dist/cli.js --file examples/sample-mcp-tools.json
```

### Pre-commit Checklist
- [x] Code adheres to TypeScript strict configuration.
- [x] `npm run build` compiles with zero errors.
- [x] `npm test` passes 100%.
- [x] Changes to `dist/` are included in your commit (CI verifies `git diff --exit-code -- dist`).
- [x] PR adheres to conventional or clear commit messages.
