import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { fetchToolsFromStdioServer } from '../dist/index.js';

const cli = fileURLToPath(new URL('../dist/cli.js', import.meta.url));
const sample = fileURLToPath(new URL('../examples/sample-mcp-tools.json', import.meta.url));
const fixture = fileURLToPath(new URL('../fixtures/paginated-mcp-server.mjs', import.meta.url));
const sampleTools = JSON.parse(readFileSync(sample, 'utf8')).tools;

function run(args, options) {
  const env = { ...process.env };
  delete env.GITHUB_STEP_SUMMARY;
  const result = spawnSync(process.execPath, [cli, ...args], {
    encoding: 'utf8',
    timeout: 30_000,
    env,
    ...options,
  });
  assert.ifError(result.error);
  return result;
}

function workspace(t) {
  const dir = mkdtempSync(path.join(tmpdir(), 'mcp-benchmark-test-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('reports the same tool scores from a bare array, tools object, and JSON-RPC result', (t) => {
  const dir = workspace(t);
  const exports = [sampleTools, { tools: sampleTools }, { jsonrpc: '2.0', id: 1, result: { tools: sampleTools } }];
  const file = path.join(dir, 'tools.json');
  const reports = exports.map(input => {
    writeFileSync(file, JSON.stringify(input));
    const result = run(['-f', file, '--json']);
    assert.equal(result.status, 0, result.stderr);
    assert.equal(JSON.parse(result.stdout)[0].toolsAnalyzed, sampleTools.length);
    return result.stdout;
  });
  assert.deepEqual(reports, [reports[0], reports[0], reports[0]]);
});

test('invalid options fail without scoring bundled fixtures', () => {
  for (const args of [
    ['--file'], ['--fiel', sample], ['--fail-under', 'abc'], ['--fail-under', '3.5'],
    ['--fail-under', '101'], ['--fail-under', '10points'], ['--file', sample, '--cmd', 'echo'],
  ]) {
    const result = run(args);
    assert.equal(result.status, 1, JSON.stringify(args));
    assert.equal(result.stdout, '');
    assert.match(result.stderr, /^Error:/);
  }
});

test('invalid and incomplete exports fail with a useful diagnostic', (t) => {
  const file = path.join(workspace(t), 'tools.json');
  for (const [input, message] of [
    [{ unrelated: [] }, /Expected a tool array/],
    [{ tools: [null] }, /Tool 1 must have a non-empty name/],
    [{ tools: [{ name: 'ping', description: 42 }] }, /description must be a string/],
    [{ tools: [{ name: 'ping', inputSchema: { required: [1] } }] }, /required must be an array of strings/],
    [{ jsonrpc: '2.0', id: 1, error: { code: -32601 } }, /successful tools\/list/],
    [{ jsonrpc: '2.0', id: 1, result: { tools: sampleTools, nextCursor: 'page-2' } }, /only one page/],
  ]) {
    writeFileSync(file, JSON.stringify(input));
    const result = run(['--file', file, '--json']);
    assert.equal(result.status, 1);
    assert.equal(result.stdout, '');
    assert.match(result.stderr, message);
  }
});

test('threshold is inclusive, and an exceeded threshold retains machine-readable output', () => {
  const report = run(['--file', sample, '--json']);
  assert.equal(report.status, 0, report.stderr);
  const [{ overallTQI }] = JSON.parse(report.stdout);
  assert.equal(run(['--file', sample, '--fail-under', String(overallTQI), '--json']).status, 0);
  const below = run(['--file', sample, '--fail-under', String(overallTQI + 1), '--json']);
  assert.equal(below.status, 1);
  assert.equal(below.stdout, report.stdout);
  assert.match(below.stderr, /below required threshold/);
});

test('live stdio scores all list pages and rejects a repeated cursor', async () => {
  const command = `"${process.execPath}" "${fixture}"`;
  const complete = run(['--cmd', command, '--json']);
  assert.equal(complete.status, 0, complete.stderr);
  const [report] = JSON.parse(complete.stdout);
  assert.deepEqual(report.tools.map(tool => tool.toolName), ['first_page', 'second_page']);

  const tools = await fetchToolsFromStdioServer(process.execPath, [fixture]);
  assert.equal(tools[0].outputSchema.properties.count.type, 'integer');

  const repeated = run(['--cmd', `${command} --repeat-cursor`, '--json']);
  assert.equal(repeated.status, 1);
  assert.match(repeated.stderr, /repeated tools\/list cursor/);
});

test('optional HTML path defaults to a standalone report in the working directory', (t) => {
  const cwd = workspace(t);
  const result = run(['--file', sample, '--html', '--json'], { cwd });
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout)[0].toolsAnalyzed, sampleTools.length);
  assert.match(readFileSync(path.join(cwd, 'mcp-benchmark-report.html'), 'utf8'), /^<!DOCTYPE html>/);
});

test('baseline gate fails for new critical findings and ignores existing ones', (t) => {
  const dir = workspace(t);
  const base = path.join(dir, 'base.json');
  const candidate = path.join(dir, 'candidate.json');
  const existing = { name: 'existing', description: '', inputSchema: { type: 'object' } };
  writeFileSync(base, JSON.stringify([existing]));
  writeFileSync(candidate, JSON.stringify([existing]));
  const args = ['--baseline', base, '--file', candidate, '--fail-on', 'critical', '--json'];
  const unchanged = run(args);
  assert.equal(unchanged.status, 0, unchanged.stderr);
  assert.equal(JSON.parse(unchanged.stdout).comparison.newDiagnostics.length, 0);
  assert.equal(run(['--file', candidate, '--fail-on', 'critical']).status, 1);

  writeFileSync(candidate, JSON.stringify([existing, { ...existing, name: 'new_tool' }]));
  const regressed = run(args);
  assert.equal(regressed.status, 1);
  assert.match(regressed.stderr, /1 new finding/);
  const { comparison, benchmark } = JSON.parse(regressed.stdout);
  assert.equal(benchmark[0].toolsAnalyzed, 2);
  assert.deepEqual(comparison.addedTools, ['new_tool']);
  assert.deepEqual(comparison.newDiagnostics.map(({ code, severity, path, toolName }) => ({ code, severity, path, toolName })), [
    { code: 'description.empty', severity: 'critical', path: '/description', toolName: 'new_tool' },
  ]);
});

test('baseline gate reports tool removal and new required inputs in HTML and JSON', (t) => {
  const dir = workspace(t);
  const base = path.join(dir, 'base.json');
  const candidate = path.join(dir, 'candidate.json');
  const html = path.join(dir, 'report.html');
  const book = {
    name: 'create_booking',
    description: 'Create a booking for the selected service.',
    inputSchema: { type: 'object', properties: { staffId: { type: 'string' } } },
  };
  writeFileSync(base, JSON.stringify([book, { ...book, name: 'get_customer' }]));
  writeFileSync(candidate, JSON.stringify([{ ...book, inputSchema: { ...book.inputSchema, required: ['staffId'] } }]));
  const result = run(['--baseline', base, '--file', candidate, '--fail-on', 'breaking', '--html', html, '--json']);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /2 breaking catalog change/);
  const { comparison } = JSON.parse(result.stdout);
  assert.deepEqual(comparison.breakingChanges, [
    { kind: 'required-input-added', toolName: 'create_booking', property: 'staffId' },
    { kind: 'tool-removed', toolName: 'get_customer' },
  ]);
  assert.deepEqual(comparison.changedTools, [{ toolName: 'create_booking', fields: ['inputSchema'] }]);
  assert.match(readFileSync(html, 'utf8'), /create_booking now requires staffId/);
});
