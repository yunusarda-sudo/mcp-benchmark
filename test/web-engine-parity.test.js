import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import {
  benchmarkServerTools,
  analyzeToolDefinition,
  fixToolCatalog,
  PROMPT_INJECTION_PATTERNS,
} from '../dist/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const registryDir = path.join(root, 'registry', 'servers');

function loadWebEngine() {
  const window = {};
  vm.runInNewContext(fs.readFileSync(path.join(root, 'docs', 'app.js'), 'utf8'), { window });
  return window.McpBenchmark;
}

// Objects built inside the vm carry another realm's prototypes; compare as plain JSON.
const plain = (value) => JSON.parse(JSON.stringify(value));

const web = loadWebEngine();
const registryServers = fs
  .readdirSync(registryDir)
  .filter((file) => file.endsWith('.json'))
  .sort()
  .map((file) => ({ file, tools: JSON.parse(fs.readFileSync(path.join(registryDir, file), 'utf8')).tools ?? [] }));
const presetServers = Object.entries(web.PRESETS).map(([file, tools]) => ({ file: `preset:${file}`, tools: plain(tools) }));
const allServers = [...registryServers, ...presetServers];

function summarize(result) {
  return {
    overallTQI: result.overallTQI,
    grade: result.grade,
    toolsAnalyzed: result.toolsAnalyzed,
    totalTokens: result.totalTokens,
    averageTokensPerTool: result.averageTokensPerTool,
    averageSchemaStrictness: result.averageSchemaStrictness,
    averageSemanticDensity: result.averageSemanticDensity,
    averageTokenEfficiency: result.averageTokenEfficiency,
    tools: result.tools.map((t) => ({
      toolName: t.toolName,
      tokenCount: t.tokenCount,
      propertiesCount: t.propertiesCount,
      metrics: t.metrics,
      diagnostics: t.diagnostics,
    })),
  };
}

test('web engine matches the CLI engine for every registry server and preset', () => {
  assert.ok(registryServers.length > 100, 'registry should be loaded');
  const mismatches = [];
  for (const { file, tools } of allServers) {
    const cli = summarize(benchmarkServerTools(file, tools));
    const browser = plain(summarize(web.benchmarkServer(plain(tools))));
    if (JSON.stringify(browser) !== JSON.stringify(cli)) {
      mismatches.push(`${file}: cli ${cli.overallTQI}/${cli.grade}, web ${browser.overallTQI}/${browser.grade}`);
    }
  }
  assert.deepEqual(mismatches, []);
});

test('web engine honours the englishStyle option like the CLI', () => {
  const tools = [{ name: 'weather', description: 'Weather for a city, quickly.', inputSchema: { type: 'object', properties: {} } }];
  const cli = analyzeToolDefinition(tools[0], { englishStyle: true }).diagnostics.map((d) => d.code);
  const browser = web.analyzeToolDefinition(plain(tools[0]), { englishStyle: true }).diagnostics.map((d) => d.code);
  assert.ok(cli.includes('description.english-action-verb'));
  assert.deepEqual(plain(browser), cli);
});

test('web security patterns are the same expressions as the CLI patterns', () => {
  const cliPatterns = PROMPT_INJECTION_PATTERNS.map((p) => [p.code, p.regex.source, p.regex.flags, p.penalty, p.severity]);
  const webPatterns = [...web.PROMPT_INJECTION_PATTERNS].map((p) => [p.code, p.regex.source, p.regex.flags, p.penalty, p.severity]);
  assert.deepEqual(webPatterns, cliPatterns);
});

test('web auto-fix produces the same tools and change log as the CLI fixer', () => {
  const mismatches = [];
  for (const { file, tools } of allServers) {
    const cli = fixToolCatalog(tools);
    const browser = plain(web.autoFixTools(plain(tools)));
    const same = JSON.stringify(browser.fixedTools) === JSON.stringify(cli.tools)
      && JSON.stringify(browser.changes) === JSON.stringify(cli.changes)
      && browser.changeCount === cli.changes.length;
    if (!same) mismatches.push(file);
  }
  assert.deepEqual(mismatches, []);
});

test('replaceTools puts fixed tools back into the original wrapper shape', () => {
  const tool = { name: 'a', description: 'Does a thing for the caller.', inputSchema: { type: 'object' } };
  const fixed = [{ ...tool, description: 'Fixed.' }];
  const cases = {
    array: [[tool], fixed],
    tools: [{ tools: [tool], nextCursor: 'c' }, { tools: fixed, nextCursor: 'c' }],
    result: [{ jsonrpc: '2.0', id: 1, result: { tools: [tool], extra: true } }, { jsonrpc: '2.0', id: 1, result: { tools: fixed, extra: true } }],
    single: [tool, fixed[0]],
  };
  for (const [label, [raw, expected]] of Object.entries(cases)) {
    assert.deepEqual(plain(web.replaceTools(raw, fixed)), expected, label);
    assert.deepEqual(plain(web.extractTools(web.replaceTools(raw, fixed))), fixed, `${label} round-trips`);
  }
  assert.throws(() => web.replaceTools({ nothing: true }, fixed));
});

test('sample_fluffy preset re-audits clean of the repairable schema diagnostics after auto-fix', () => {
  const targeted = new Set([
    'schema.required-without-property', 'schema.root-type', 'schema.empty-enum',
    'schema.array-without-items', 'schema.property-boolean-required',
  ]);
  const { fixedTools } = web.autoFixTools(plain(web.PRESETS.sample_fluffy));
  const audit = plain(web.benchmarkServer(plain(fixedTools)));
  const remaining = audit.tools.flatMap((t) => t.diagnostics).filter((d) => targeted.has(d.code));
  assert.deepEqual(remaining, []);
});
