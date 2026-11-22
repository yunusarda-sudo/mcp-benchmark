import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import {
  getAllRules,
  getRuleById,
  getRulesByCategory,
  loadRegistry,
  benchmarkRegistry,
  registerServer,
  generateLeaderboardMarkdown,
  findLocalMcpConfigs,
  formatDiscoveryReport,
} from '../dist/index.js';

test('Rule engine exports all rules and filters by category and id', () => {
  const allRules = getAllRules();
  assert.ok(allRules.length >= 10, 'Expected at least 10 pluggable rules');

  const emptyName = getRuleById('tool.empty-name');
  assert.ok(emptyName);
  assert.equal(emptyName.category, 'naming');
  assert.equal(emptyName.defaultSeverity, 'critical');

  const schemaRules = getRulesByCategory('schema');
  assert.ok(schemaRules.length >= 4);

  const securityRules = getRulesByCategory('security');
  assert.ok(securityRules.length >= 1);
});

const SAMPLE_REGISTRY = path.join(process.cwd(), 'fixtures', 'registry-sample');

test('loadRegistry keeps entries with source provenance and skips unsourced ones', () => {
  const { servers, metadata } = loadRegistry(SAMPLE_REGISTRY);

  assert.deepEqual(Object.keys(servers).sort(), ['Notes Manual MCP', 'io.example/weather']);
  assert.equal(metadata['io.example/weather'].source.type, 'registry');
  assert.equal(metadata['Notes Manual MCP'].source.type, 'manual');
});

test('benchmarkRegistry ranks every loaded entry in descending TQI order', () => {
  const results = benchmarkRegistry(SAMPLE_REGISTRY);

  assert.equal(results.length, 2);
  assert.ok(results[0].overallTQI >= results[1].overallTQI);
});

test('generateLeaderboardMarkdown escapes untrusted names and marks manual entries', () => {
  const results = benchmarkRegistry(SAMPLE_REGISTRY);
  const { metadata } = loadRegistry(SAMPLE_REGISTRY);
  const hostile = { ...metadata['io.example/weather'], title: 'Evil <img src=x onerror=alert(1)> | [link](javascript:x)' };

  const md = generateLeaderboardMarkdown(results, { ...metadata, 'io.example/weather': hostile });

  assert.ok(!md.includes('<img'), 'raw HTML must be escaped');
  assert.ok(md.includes('&lt;img'));
  assert.ok(md.includes('\\|'), 'pipes must be escaped so the table row stays intact');
  assert.ok(md.includes('\\[link\\]'), 'link syntax must be escaped');
  assert.match(md, /Notes Manual MCP.*manual entry/);
});

test('registerServer creates new server entry in target registry', () => {
  const tempDir = path.join(process.cwd(), 'fixtures', 'temp-registry');
  fs.mkdirSync(tempDir, { recursive: true });

  try {
    const filePath = registerServer(
      {
        name: 'Acme Custom MCP',
        category: 'Developer Tools & VCS',
        description: 'Custom tools for testing registry',
        repository: 'https://github.com/acme/mcp',
        maintainer: '@acme-team',
        tools: [
          {
            name: 'custom_ping',
            description: 'Ping the remote Acme API server.',
            inputSchema: { type: 'object', properties: {} },
          },
        ],
      },
      tempDir
    );

    assert.ok(fs.existsSync(filePath));
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    assert.equal(content.name, 'Acme Custom MCP');
    assert.equal(content.category, 'Developer Tools & VCS');
    assert.equal(content.tools.length, 1);
    assert.equal(content.source.type, 'manual');
    assert.ok(!Number.isNaN(Date.parse(content.source.submittedAt)));
    assert.equal(path.basename(filePath), 'manual-acme-custom-mcp.json');
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }
});

test('Wizard discovers local MCP configs and formats report', () => {
  const configs = findLocalMcpConfigs();
  assert.ok(Array.isArray(configs));

  const report = formatDiscoveryReport(configs);
  assert.ok(report.includes('MCP configuration file') || report.includes('No active MCP client configuration'));
});

test('CLI supports --rules and --discover', () => {
  const cliPath = path.resolve('dist/cli.js');

  const rulesOutput = execFileSync(process.execPath, [cliPath, '--rules'], { encoding: 'utf8' });
  assert.ok(rulesOutput.includes('Model Context Protocol (MCP) Benchmark & Linter Rules'));
  assert.ok(rulesOutput.includes('tool.empty-name'));
  assert.ok(rulesOutput.includes('security.prompt-hygiene'));

  const discoverOutput = execFileSync(process.execPath, [cliPath, '--discover'], { encoding: 'utf8' });
  assert.ok(discoverOutput.includes('MCP configuration file') || discoverOutput.includes('No active MCP client'));
});
