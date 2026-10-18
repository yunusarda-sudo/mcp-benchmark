import test from 'node:test';
import assert from 'node:assert/strict';
import {
  analyzeToolDefinition,
  benchmarkServerTools,
  generateHtmlReport,
  fetchToolsFromStdioServer,
} from '../dist/index.js';

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

test('generateHtmlReport renders a self-contained HTML document', () => {
  const results = [
    benchmarkServerTools('Alpha Server', [
      {
        name: 'read_file',
        description: 'Read the complete contents of a file from the local file system using UTF-8 encoding.',
        inputSchema: {
          type: 'object',
          required: ['path'],
          properties: {
            path: { type: 'string', description: 'The absolute path to the file to read.' },
          },
        },
      },
    ]),
  ];

  const html = generateHtmlReport(results);

  assert.equal(typeof html, 'string');
  assert.match(html, /^<!DOCTYPE html>/);
  assert.match(html, /<\/html>\s*$/);
  assert.match(html, /Alpha Server/);
  assert.match(html, /read_file/);
});

test('fetchToolsFromStdioServer connects to a live stdio server and returns its tools', async () => {
  const path = await import('node:path');
  const fixture = path.resolve('fixtures/echo-mcp-server.mjs');

  const tools = await fetchToolsFromStdioServer('node', [fixture]);

  assert.ok(Array.isArray(tools), 'Expected an array of tool definitions');
  assert.equal(tools.length, 2);
  assert.deepEqual(
    tools.map((t) => t.name).sort(),
    ['ping', 'read_file']
  );

  const readFile = tools.find((t) => t.name === 'read_file');
  assert.ok(readFile, 'Expected read_file tool');
  assert.equal(readFile.inputSchema.type, 'object');
  assert.ok(readFile.inputSchema.properties.path, 'Expected path property to be preserved');
  assert.equal(typeof readFile.description, 'string');
});

test('fetchToolsFromStdioServer rejects when the server command cannot be spawned', async () => {
  await assert.rejects(
    () => fetchToolsFromStdioServer('definitely-not-a-real-binary-xyz', []),
    (err) => {
      assert.ok(err instanceof Error);
      return true;
    }
  );
});
