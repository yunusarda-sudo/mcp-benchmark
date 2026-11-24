import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';
import { estimateTokenEconomics } from '../dist/index.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const window = {};
vm.runInNewContext(fs.readFileSync(path.join(root, 'docs', 'app.js'), 'utf8'), { window });
const web = window.McpBenchmark;

const TOKEN_FIELDS = ['totalTokens', 'averageTokensPerTool', 'tokensPerTurn', 'tokensPer10TurnSession', 'tokensPer1000Sessions'];

function tokenFields(report) {
  return Object.fromEntries(TOKEN_FIELDS.map((key) => [key, report[key]]));
}

test('web cost projection uses the same token math as the CLI --cost report', () => {
  for (const args of [[1234, 7], [1234, 7, 1000, 15], [500, 3, 25000, 40], [0, 0, 1, 1]]) {
    assert.deepEqual(tokenFields(web.estimateTokenEconomics(...args)), tokenFields(estimateTokenEconomics(...args)), `args ${args}`);
  }
});

test('web cost projection counts tool schemas on every turn of every session', () => {
  const report = web.estimateTokenEconomics(1000, 4, 2000, 15);
  assert.equal(report.tokensPer10TurnSession, 15000);
  assert.equal(report.tokensPer1000Sessions, 30000000);
});
