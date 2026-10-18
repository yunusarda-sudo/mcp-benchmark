import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeToolDefinition, benchmarkServerTools } from '../dist/index.js';

test('analyzeToolDefinition scores clean schema with Grade A', () => {
  const tool = {
    name: 'read_file',
    description: 'Read the complete contents of a file from the local file system using UTF-8 encoding.',
    inputSchema: {
      type: 'object',
      required: ['path'],
      properties: {
        path: { type: 'string', description: 'The absolute path to the file to read.' },
      },
    },
  };

  const report = analyzeToolDefinition(tool);
  assert.equal(report.toolName, 'read_file');
  assert.ok(report.metrics.overallScore >= 90, `Expected score >= 90, got ${report.metrics.overallScore}`);
  assert.equal(report.findings.length, 0);
});

test('analyzeToolDefinition penalizes ambiguous fluff descriptions and missing types', () => {
  const poorTool = {
    name: 'do_action',
    description: 'This tool allows you to basically do whatever action you need.',
    inputSchema: {
      properties: {
        data: { description: 'The payload' },
      },
    },
  };

  const report = analyzeToolDefinition(poorTool);
  assert.ok(report.metrics.overallScore < 70, `Expected score < 70, got ${report.metrics.overallScore}`);
  assert.ok(report.findings.length > 0, 'Expected diagnostic findings');
});

test('benchmarkServerTools aggregates scores and computes grade', () => {
  const result = benchmarkServerTools('Test Server', [
    {
      name: 'ping',
      description: 'Ping the server to verify active connection status.',
      inputSchema: { type: 'object', properties: {} },
    },
  ]);

  assert.equal(result.serverName, 'Test Server');
  assert.equal(result.toolsAnalyzed, 1);
  assert.ok(['A+', 'A', 'B'].includes(result.grade));
});

test('examples/sample-mcp-tools.json parses and produces expected scores', async () => {
  const fs = await import('node:fs/promises');
  const path = await import('node:path');
  const content = await fs.readFile(path.resolve('examples/sample-mcp-tools.json'), 'utf8');
  const data = JSON.parse(content);
  assert.ok(Array.isArray(data.tools), 'Expected tools array');
  assert.equal(data.tools.length, 3);

  const result = benchmarkServerTools('Sample Server', data.tools);
  assert.equal(result.toolsAnalyzed, 3);
  assert.equal(result.grade, 'B');
  assert.ok(result.overallTQI >= 65 && result.overallTQI <= 75);
});
