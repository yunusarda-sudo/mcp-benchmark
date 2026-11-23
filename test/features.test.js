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
  generateSvgBadge,
  loadToolsFromConfig,
  benchmarkServerTools,
  estimateTokenEconomics,
  formatTokenEconomicsMarkdown,
  formatPrComment,
  compareToolCatalogs,
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

test('fixToolDefinition migrates boolean required: true and removes required: false', () => {
  const toolWithBooleanRequired = {
    name: 'update_user',
    description: 'Update user settings',
    inputSchema: {
      type: 'object',
      properties: {
        userId: { type: 'string', description: 'User ID', required: true },
        email: { type: 'string', description: 'Email address', required: false },
        name: { type: 'string', description: 'User name' },
      },
    },
  };

  const report = analyzeToolDefinition(toolWithBooleanRequired);
  assert.ok(report.diagnostics.some(d => d.code === 'schema.property-boolean-required' && d.path === '/inputSchema/properties/userId/required'));
  assert.ok(report.diagnostics.some(d => d.code === 'schema.property-boolean-required' && d.path === '/inputSchema/properties/email/required'));

  const { fixedTool, changes } = fixToolDefinition(toolWithBooleanRequired);
  assert.deepEqual(fixedTool.inputSchema?.required, ['userId']);
  assert.equal(fixedTool.inputSchema?.properties?.userId?.required, undefined);
  assert.equal(fixedTool.inputSchema?.properties?.email?.required, undefined);
  assert.ok(changes.some(c => c.action === 'migrate-boolean-required'));
  assert.ok(changes.some(c => c.action === 'remove-boolean-required'));
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

test('analyzeToolDefinition flags invalid regex pattern, empty enum, and invalid default type', () => {
  const tool = {
    name: 'test_advanced_schema',
    description: 'Test patterns, enums and defaults.',
    inputSchema: {
      type: 'object',
      properties: {
        regex_field: {
          type: 'string',
          pattern: '[unclosed(regex',
        },
        enum_field: {
          type: 'string',
          enum: [],
        },
        default_field: {
          type: 'string',
          default: 12345, // invalid type mismatch!
        },
        polymorphic_field: {
          oneOf: [
            { type: 'string', description: 'String format' },
            { type: 'number', description: 'Number format' },
          ],
          description: 'Polymorphic argument',
        },
      },
    },
  };

  const report = analyzeToolDefinition(tool);
  const codes = (report.diagnostics ?? []).map(d => d.code);
  assert.ok(codes.includes('schema.invalid-pattern'), 'Should flag invalid regex pattern');
  assert.ok(codes.includes('schema.empty-enum'), 'Should flag empty enum array');
  assert.ok(codes.includes('schema.invalid-default'), 'Should flag default value type mismatch');
  // polymorphic_field has oneOf with valid types, so parameter-types warning should NOT complain about polymorphic_field
  const untypedWarning = (report.diagnostics ?? []).find(d => d.code === 'schema.parameter-types');
  assert.equal(untypedWarning, undefined, 'oneOf property should be recognized as typed');
});

test('fixToolDefinition removes empty enums and fixes array missing items', () => {
  const tool = {
    name: 'enum_array_tool',
    description: 'Fix empty enum and array without items.',
    inputSchema: {
      type: 'object',
      properties: {
        tags: { type: 'array' },
        mode: { type: 'string', enum: [] },
      },
    },
  };

  const { fixedTool, changes } = fixToolDefinition(tool);
  assert.equal(fixedTool.inputSchema?.properties?.mode.enum, undefined);
  assert.deepEqual(fixedTool.inputSchema?.properties?.tags.items, { type: 'string' });
  assert.ok(changes.some(c => c.action === 'remove-empty-enum'));
  assert.ok(changes.some(c => c.action === 'add-array-items'));
});

test('generateSvgBadge creates crisp SVG with correct score and grade coloring', () => {
  const svgPass = generateSvgBadge(95, 'A+');
  assert.match(svgPass, /^<svg/);
  assert.match(svgPass, /A\+ \(95\/100\)/);
  assert.match(svgPass, /#4c1/); // green

  const svgWarn = generateSvgBadge(65, 'C');
  assert.match(svgWarn, /C \(65\/100\)/);
  assert.match(svgWarn, /#dfb317/); // yellow
});

test('cli --badge exports SVG quality badge to file', async () => {
  const { spawnSync } = await import('node:child_process');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-badge-test-'));
  const badgeFile = path.join(tmpDir, 'test-badge.svg');
  const sample = path.resolve('examples/sample-mcp-tools.json');

  try {
    const cliPath = path.resolve('dist/cli.js');
    const result = spawnSync(process.execPath, [cliPath, '-f', sample, '--badge', badgeFile, '--json'], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(badgeFile), 'SVG badge file should exist');
    const badgeContent = fs.readFileSync(badgeFile, 'utf8');
    assert.match(badgeContent, /^<svg/);
    assert.match(badgeContent, /MCP Quality/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

test('CLI --ecosystem benchmarks every sourced entry of the given registry directory', async () => {
  const { spawnSync } = await import('node:child_process');
  const cliPath = path.resolve('dist/cli.js');

  const result = spawnSync(process.execPath, [cliPath, '--ecosystem', '--registry-dir', 'fixtures/registry-sample', '--json'], {
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });

  assert.equal(result.status, 0, result.stderr);
  const benchmarkResults = JSON.parse(result.stdout);
  assert.deepEqual(benchmarkResults.map(r => r.serverName).sort(), ['Notes Manual MCP', 'io.example/weather']);
  assert.ok(benchmarkResults.every(r => r.overallTQI >= 0 && r.overallTQI <= 100));
});

test('CLI --ecosystem fails clearly when the registry directory has no sourced entries', async () => {
  const { spawnSync } = await import('node:child_process');
  const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-empty-registry-'));
  try {
    const result = spawnSync(process.execPath, [path.resolve('dist/cli.js'), '--ecosystem', '--registry-dir', emptyDir, '--json'], {
      encoding: 'utf8',
    });

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /No registry entries with source provenance/);
  } finally {
    fs.rmSync(emptyDir, { recursive: true, force: true });
  }
});

test('estimateTokenEconomics computes correct multi-turn projections and costs', () => {
  const report = estimateTokenEconomics(500, 5, 1000, 15);
  assert.equal(report.totalTokens, 500);
  assert.equal(report.averageTokensPerTool, 100);
  assert.equal(report.tokensPer10TurnSession, 7500);
  assert.equal(report.tokensPer1000Sessions, 7500000);
  assert.equal(report.monthlyCostEstimates.claudeSonnet, 22.5); // 7.5M * $3
  assert.equal(report.monthlyCostEstimates.gpt4o, 18.75);       // 7.5M * $2.5

  const markdown = formatTokenEconomicsMarkdown(report);
  assert.match(markdown, /Token Economics/);
  assert.match(markdown, /\$22\.50/);
});

test('formatPrComment generates structured markdown table comparing baseline and candidate', () => {
  const baseTool = { name: 'calc', description: 'Calculate numbers.', inputSchema: { type: 'object' } };
  const candTool = { name: 'calc', description: 'Calculate numbers accurately.', inputSchema: { type: 'object' } };
  const comparison = compareToolCatalogs([baseTool], [candTool]);

  const baseResult = benchmarkServerTools('baseline', [baseTool]);
  const candResult = benchmarkServerTools('candidate', [candTool]);

  const prComment = formatPrComment(comparison, candResult, baseResult);
  assert.match(prComment, /PR Summary/);
  assert.match(prComment, /Overall TQI Score/);
  assert.match(prComment, /0 ✅/); // No breaking changes
});

test('cli supports --cost and --pr-comment flags', async () => {
  const { spawnSync } = await import('node:child_process');
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mcp-pr-test-'));
  const commentFile = path.join(tmpDir, 'pr-comment.md');
  const base = path.resolve('examples/pr-base.json');
  const cand = path.resolve('examples/pr-candidate.json');

  try {
    const cliPath = path.resolve('dist/cli.js');
    const result = spawnSync(process.execPath, [
      cliPath,
      '--baseline', base,
      '--file', cand,
      '--cost',
      '--pr-comment', commentFile,
    ], {
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /Token Economics/);
    assert.ok(fs.existsSync(commentFile), 'PR comment file should be written');

    const commentContent = fs.readFileSync(commentFile, 'utf8');
    assert.match(commentContent, /Breaking Changes Detected/);
    assert.match(commentContent, /create_booking/);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
