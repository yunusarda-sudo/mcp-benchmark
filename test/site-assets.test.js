import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = path.join(ROOT, 'docs');
const read = (relativePath) => fs.readFileSync(path.join(DOCS, relativePath), 'utf8');

test('index.html no longer loads the Tailwind Play CDN', () => {
  assert.equal(read('index.html').includes('cdn.tailwindcss.com'), false);
});

test('index.html has no inline script blocks; every script is an external deferred file', () => {
  const html = read('index.html');
  const scriptTags = html.match(/<script\b[^>]*>/g) ?? [];
  assert.ok(scriptTags.length > 0, 'expected external script tags');
  for (const tag of scriptTags) {
    assert.match(tag, /\bsrc="[^"]+"/, `inline script tag found: ${tag}`);
    assert.match(tag, /\bdefer\b/, `script tag is not deferred: ${tag}`);
  }
});

test('docs/styles.css is committed, non-empty compiled Tailwind output', () => {
  const css = read('styles.css');
  assert.ok(css.length > 0, 'styles.css is empty');
  assert.ok(css.includes('.bg-emerald-500'), 'missing .bg-emerald-500');
  assert.ok(css.includes('.lg\\:col-span-7'), 'missing .lg\\:col-span-7');
  assert.ok(css.includes('.bg-\\[\\#070b14\\]'), 'missing arbitrary value class .bg-[#070b14]');
});

test('docs/styles.css includes the custom glass and glow rules and reduced-motion block', () => {
  const css = read('styles.css');
  assert.ok(css.includes('.glow-emerald'), 'missing .glow-emerald');
  assert.ok(css.includes('.glass'), 'missing .glass');
  assert.ok(css.includes('prefers-reduced-motion'), 'missing reduced-motion block');
});

test('docs/site.js parses as a valid classic script', () => {
  assert.doesNotThrow(() => new vm.Script(read('site.js'), { filename: 'site.js' }));
});

test('every docs script parses as a valid classic script', () => {
  for (const file of ['app.js', 'site.js']) {
    assert.doesNotThrow(() => new vm.Script(read(file), { filename: file }), `${file} failed to parse`);
  }
});
