import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  escapeHtml,
  escapeMarkdown,
  renderLeaderboardFile,
  renderLeaderboardSummaryMarkdown,
  renderNewReleasesMarkdown,
  replaceBetween,
  safeHttpsUrl,
  selectNewReleases,
} from '../scripts/lib/ecosystem-artifacts.mjs';

function row(name, publishedAt, extra = {}) {
  return {
    name,
    title: name,
    slug: name.replace(/[^a-z0-9]+/g, '-'),
    grade: 'A',
    tqi: 85,
    strictness: 80,
    density: 90,
    efficiency: 85,
    tokensPerTool: 60,
    toolsCount: 2,
    repository: null,
    sourceType: 'registry',
    publishedAt,
    ...extra,
  };
}

// --- new-releases selection --------------------------------------------------

test('selectNewReleases orders by publishedAt, newest first', () => {
  const rows = [row('a', '2026-11-20T10:00:00Z'), row('b', '2026-11-22T09:00:00Z'), row('c', '2026-11-21T23:59:59.5Z')];

  assert.deepEqual(selectNewReleases(rows).map(r => r.name), ['b', 'c', 'a']);
});

test('selectNewReleases keeps input order for equal publish times', () => {
  const same = '2026-11-22T12:00:00Z';
  const rows = [row('zeta', same), row('alpha', same), row('mid', same)];

  assert.deepEqual(selectNewReleases(rows).map(r => r.name), ['zeta', 'alpha', 'mid']);
});

test('selectNewReleases compares instants, not strings, across fractional precision', () => {
  const rows = [row('short', '2026-11-22T12:45:44Z'), row('long', '2026-11-22T12:45:44.684225Z')];

  assert.deepEqual(selectNewReleases(rows).map(r => r.name), ['long', 'short']);
});

test('selectNewReleases limits the result to N rows', () => {
  const rows = Array.from({ length: 25 }, (_, i) => row(`s${i}`, `2026-11-${String(i + 1).padStart(2, '0')}T00:00:00Z`));

  const picked = selectNewReleases(rows, 10);

  assert.equal(picked.length, 10);
  assert.equal(picked[0].name, 's24');
  assert.equal(picked[9].name, 's15');
  assert.deepEqual(selectNewReleases(rows, 0), []);
});

test('selectNewReleases skips rows without a valid publish date', () => {
  const rows = [row('manual', null, { sourceType: 'manual' }), row('bad', 'yesterday'), row('ok', '2026-11-01T00:00:00Z')];

  assert.deepEqual(selectNewReleases(rows).map(r => r.name), ['ok']);
});

test('selectNewReleases does not mutate its input', () => {
  const rows = [row('a', '2026-11-20T00:00:00Z'), row('b', '2026-11-22T00:00:00Z')];
  const before = rows.map(r => r.name);

  selectNewReleases(rows);

  assert.deepEqual(rows.map(r => r.name), before);
});

// --- escaping ----------------------------------------------------------------

test('escapeMarkdown neutralizes HTML, links, emphasis and table pipes', () => {
  const out = escapeMarkdown('<img src=x onerror=alert(1)> [click](javascript:x) **bold** a|b');

  assert.ok(!out.includes('<'), 'no raw angle brackets');
  assert.ok(out.includes('&lt;img'));
  assert.ok(out.includes('\\[click\\]\\(javascript:x\\)'));
  assert.ok(out.includes('\\*\\*bold\\*\\*'));
  assert.ok(out.includes('a\\|b'));
});

test('escapeMarkdown collapses newlines and control characters so a cell cannot break the table', () => {
  assert.equal(escapeMarkdown('line one\n| --- |\r\nline\u0000two'), 'line one \\| --- \\| line two');
});

test('escapeHtml escapes text and attribute metacharacters', () => {
  assert.equal(escapeHtml(`<a href="x" onclick='y'>&</a>`), '&lt;a href=&quot;x&quot; onclick=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
});

test('safeHttpsUrl accepts https only and percent-encodes Markdown-breaking characters', () => {
  assert.equal(safeHttpsUrl('javascript:alert(1)'), null);
  assert.equal(safeHttpsUrl('http://example.com'), null);
  assert.equal(safeHttpsUrl('data:text/html,hi'), null);
  assert.equal(safeHttpsUrl('https://user:pw@example.com/'), null);
  assert.equal(safeHttpsUrl('not a url'), null);
  assert.equal(safeHttpsUrl('https://example.com/a(b)'), 'https://example.com/a%28b%29');
});

test('rendered tables escape untrusted names and drop unsafe repository links', () => {
  const hostile = row('io.evil/x', '2026-11-22T00:00:00Z', {
    title: '<script>alert(1)</script> | [x](javascript:y)',
    repository: 'javascript:alert(1)',
    slug: '../../etc/passwd',
  });

  for (const md of [renderNewReleasesMarkdown([hostile]), renderLeaderboardSummaryMarkdown([hostile]), renderLeaderboardFile([hostile], '')]) {
    assert.ok(!md.includes('<script>'));
    assert.ok(!md.includes('](javascript:'));
    assert.ok(!md.includes('etc/passwd'));
    const lines = md.split('\n');
    const headerRow = lines.find(line => line.startsWith('| ') && line.includes('Server'));
    const dataRow = lines.find(line => line.includes('io.evil/x'));
    const separators = line => line.replaceAll('\\|', '').split('|').length;
    // Escaped pipes in the hostile title must not add cells.
    assert.equal(separators(dataRow), separators(headerRow));
  }
});

test('rendered rows link https repositories and the stored registry entry', () => {
  const r = row('com.example/srv', '2026-11-22T08:00:00Z', { title: 'Example', repository: 'https://github.com/example/srv' });

  const md = renderNewReleasesMarkdown([r]);

  assert.ok(md.includes('| 2026-11-22 | [**Example**](https://github.com/example/srv) · `com.example/srv` |'));
  assert.ok(md.includes('[json](registry/servers/com-example-srv.json)'));
});

test('leaderboard summary keeps input order and respects the limit', () => {
  const rows = Array.from({ length: 20 }, (_, i) => row(`s${i}`, null));

  const lines = renderLeaderboardSummaryMarkdown(rows, { limit: 15 }).split('\n');

  assert.equal(lines.length, 2 + 15);
  assert.ok(lines[2].startsWith('| 1 | **s0**'));
  assert.ok(lines[16].startsWith('| 15 | **s14**'));
});

test('empty inputs render an explicit placeholder', () => {
  assert.match(renderNewReleasesMarkdown([]), /No registry servers/);
  assert.match(renderLeaderboardSummaryMarkdown([]), /No servers/);
});

test('replaceBetween swaps marker content and leaves content without markers unchanged', () => {
  const doc = 'a\n<!-- S -->\nold\n<!-- E -->\nb';

  assert.equal(replaceBetween(doc, '<!-- S -->', '<!-- E -->', 'new'), 'a\n<!-- S -->\nnew\n<!-- E -->\nb');
  assert.equal(replaceBetween('no markers', '<!-- S -->', '<!-- E -->', 'new'), 'no markers');
});
