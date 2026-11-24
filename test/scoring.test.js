import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeToolDefinition,
  benchmarkServerTools,
  gradeFromScore,
  tokenBudget,
  tokenEfficiencyScore,
} from '../dist/index.js';

test('gradeFromScore uses A+>=95, A>=88, B>=78, C>=65, D>=50, else F', () => {
  const cases = [
    [100, 'A+'], [95, 'A+'], [94, 'A'], [88, 'A'], [87, 'B'], [78, 'B'],
    [77, 'C'], [65, 'C'], [64, 'D'], [50, 'D'], [49, 'F'], [0, 'F'],
  ];
  for (const [score, grade] of cases) assert.equal(gradeFromScore(score), grade, `score ${score}`);
});

test('benchmarkServerTools grades through the shared thresholds', () => {
  const tool = { name: 'ping', description: 'Check that the service is reachable.', inputSchema: { type: 'object', properties: {} } };
  const result = benchmarkServerTools('s', [tool]);
  assert.equal(result.grade, gradeFromScore(result.overallTQI));
});

test('zero-property tools no longer receive full strictness for free', () => {
  const base = { name: 'ping', description: 'Check that the service is reachable.' };
  const typed = analyzeToolDefinition({ ...base, inputSchema: { type: 'object', properties: {} } });
  const closed = analyzeToolDefinition({ ...base, inputSchema: { type: 'object', properties: {}, additionalProperties: false } });
  const untyped = analyzeToolDefinition({ ...base, inputSchema: { properties: {} } });
  const missing = analyzeToolDefinition({ ...base });
  assert.equal(typed.metrics.schemaStrictness, 50);
  assert.equal(closed.metrics.schemaStrictness, 60);
  assert.equal(untyped.metrics.schemaStrictness, 30);
  assert.equal(missing.metrics.schemaStrictness, 30);
});

test('token budget grows with property count and maps ratio to the efficiency tiers', () => {
  assert.equal(tokenBudget(0), 80);
  assert.equal(tokenBudget(5), 280);
  const cases = [
    [80, 0, 100], [81, 0, 85], [120, 0, 85], [121, 0, 70], [160, 0, 70], [161, 0, 50], [240, 0, 50], [241, 0, 30],
    [280, 5, 100], [420, 5, 85], [560, 5, 70], [840, 5, 50], [841, 5, 30],
  ];
  for (const [tokens, props, expected] of cases) {
    assert.equal(tokenEfficiencyScore(tokens, props), expected, `${tokens} tokens / ${props} props`);
  }
});

function toolWithProperties(count, descriptionPadding = '') {
  const properties = {};
  for (let i = 0; i < count; i += 1) properties[`p${i}`] = { type: 'string', description: 'Parameter value.' };
  return {
    name: 'rich_tool',
    description: `Create a record from the supplied fields. ${descriptionPadding}`.trim(),
    inputSchema: { type: 'object', properties },
  };
}

test('rich schemas are not penalised for token size that their properties explain', () => {
  const report = analyzeToolDefinition(toolWithProperties(12));
  assert.ok(report.tokenCount > 160, `fixture should exceed the old 160 token tier, got ${report.tokenCount}`);
  assert.equal(report.metrics.tokenEfficiency, 100);
});

test('large-definition fires above 3x budget or above 600 absolute tokens', () => {
  const codes = (tool) => analyzeToolDefinition(tool).diagnostics.map((d) => d.code);
  assert.ok(!codes(toolWithProperties(2)).includes('catalog.large-definition'));
  const bloated = toolWithProperties(1, 'Extra context. '.repeat(120));
  assert.ok(codes(bloated).includes('catalog.large-definition'), 'ratio above 3 should fire');
  const hugeButRich = toolWithProperties(60, 'Detail. '.repeat(10));
  const report = analyzeToolDefinition(hugeButRich);
  assert.ok(report.tokenCount > 600);
  assert.ok(report.diagnostics.some((d) => d.code === 'catalog.large-definition'), 'absolute 600 token cap should still fire');
});
