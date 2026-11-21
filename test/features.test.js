import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  analyzeToolDefinition,
  fixToolDefinition,
  fixToolCatalog,
  generateSarifReport,
  loadToolsFromConfig,
  benchmarkServerTools,
} from '../dist/index.js';

test('analyzeToolDefinition flags array without items and nested properties lacking types', () => {
  const tool = {
    name: 'test_nested',
    description: 'Test nested structures and arrays.',
    inputSchema: {
      type: 'object',
      properties: {
        tags: {
          type: 'array',
          // missing items!
        },
        user: {
          type: 'object',
          properties: {
            id: {
              // missing type!
            },
            role: {
              type: 'string',
              // missing description
            },
          },
        },
      },
    },
  };

  const report = analyzeToolDefinition(tool);
  const codes = (report.diagnostics ?? []).map(d => d.code);
  assert.ok(codes.includes('schema.array-without-items'), 'Should detect array missing items');
  assert.ok(codes.includes('schema.nested-parameter-types'), 'Should detect nested property missing type');
  assert.ok(codes.includes('schema.nested-parameter-descriptions'), 'Should detect nested property missing description');
});

test('analyzeToolDefinition validates tool name constraints and outputSchema', () => {
  const longNameTool = {
    name: 'this_is_an_extremely_long_tool_name_that_exceeds_sixty_four_characters_limit_and_will_fail',
    description: 'A tool with a long name.',
  };
  const report = analyzeToolDefinition(longNameTool);
  const codes = (report.diagnostics ?? []).map(d => d.code);
  assert.ok(codes.includes('tool.name-length'));

  const invalidCharsTool = {
    name: 'invalid tool name!@#',
    description: 'A tool with spaces and symbols.',
    outputSchema: 'not an object',
  };
  const report2 = analyzeToolDefinition(invalidCharsTool);
  const codes2 = (report2.diagnostics ?? []).map(d => d.code);
  assert.ok(codes2.includes('tool.invalid-name-format'));
  assert.ok(codes2.includes('schema.output-invalid'));
});

test('fixToolDefinition cleans conversational fluff and fixes invalid required and root type', () => {
  const badTool = {
    name: 'fetch_data',
    description: 'This tool allows you to basically fetch data, please note that it works quickly.',
    inputSchema: {
      // missing type: 'object'
      required: ['missing_field', 'existing_field', 'existing_field'],
      properties: {
        existing_field: { type: 'string', description: 'Some field' },
      },
    },
  };

  const { fixedTool, changes } = fixToolDefinition(badTool);
  assert.equal(fixedTool.inputSchema?.type, 'object');
  assert.deepEqual(fixedTool.inputSchema?.required, ['existing_field']);
  assert.equal(fixedTool.description, 'Fetch data, it works quickly.');
  assert.ok(changes.some(c => c.action === 'clean-fluff-description'));
  assert.ok(changes.some(c => c.action === 'prune-required'));
  assert.ok(changes.some(c => c.action === 'deduplicate-required'));
  assert.ok(changes.some(c => c.action === 'set-root-type'));
});

test('generateSarifReport outputs valid SARIF 2.1.0 format with error and warning levels', () => {
  const results = [
    benchmarkServerTools('Sarif Server', [
      {
        name: 'sample_tool',
        description: 'This tool allows you to basically do something.',
        inputSchema: {
          properties: {
            field: {},
          },
        },
      },
    ]),
  ];

  const sarifString = generateSarifReport(results, 'fixtures/tools.json');
  const sarif = JSON.parse(sarifString);

  assert.equal(sarif.version, '2.1.0');
  assert.ok(Array.isArray(sarif.runs));
  assert.equal(sarif.runs[0].tool.driver.name, 'mcp-benchmark');
  assert.ok(sarif.runs[0].results.length > 0);
  assert.equal(sarif.runs[0].results[0].locations[0].physicalLocation.artifactLocation.uri, 'fixtures/tools.json');
});

test('loadToolsFromConfig loads stdio server tools from a config file', async () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-cfg-'));
  const echoServerFixture = path.resolve('fixtures/echo-mcp-server.mjs');
  const configContent = {
    mcpServers: {
      echoServer: {
        command: process.execPath,
        args: [echoServerFixture],
      },
    },
  };
  const configPath = path.join(tmpDir, 'test-config.json');
  fs.writeFileSync(configPath, JSON.stringify(configContent), 'utf8');

  try {
    const loaded = await loadToolsFromConfig(configPath);
    assert.equal(loaded.length, 1);
    assert.equal(loaded[0].serverName, 'echoServer');
    assert.ok(Array.isArray(loaded[0].tools));
    assert.ok(loaded[0].tools.length > 0);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('cli --file with --fix and --write cleans file on disk and --sarif exports file', async () => {
  const { spawnSync } = await import('node:child_process');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-cli-test-'));
  const testFile = path.join(tmpDir, 'tools.json');
  const sarifFile = path.join(tmpDir, 'report.sarif');

  const initialTools = [
    {
      name: 'broken_tool',
      description: 'This tool allows you to read files.',
      inputSchema: {
        required: ['missing_param'],
        properties: {},
      },
    },
  ];
  fs.writeFileSync(testFile, JSON.stringify(initialTools), 'utf8');

  try {
    const cliPath = path.resolve('dist/cli.js');
    const result = spawnSync(process.execPath, [cliPath, '-f', testFile, '--fix', '--write', '--sarif', sarifFile, '--json'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(sarifFile), 'SARIF file should be generated');

    const sarifContent = JSON.parse(fs.readFileSync(sarifFile, 'utf8'));
    assert.equal(sarifContent.version, '2.1.0');

    const updatedToolsContent = JSON.parse(fs.readFileSync(testFile, 'utf8'));
    const updatedTools = updatedToolsContent.tools;
    assert.equal(updatedTools[0].description, 'Read files.');
    assert.equal(updatedTools[0].inputSchema.type, 'object');
    assert.equal(updatedTools[0].inputSchema.required, undefined);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
