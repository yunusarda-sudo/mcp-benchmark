import { ServerBenchmarkResult, ToolAnalysisReport, ToolCollision } from './types.js';

function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function gradeClass(grade: ServerBenchmarkResult['grade']): string {
  switch (grade) {
    case 'A+':
    case 'A':
      return 'grade-pass';
    case 'B':
      return 'grade-good';
    case 'C':
      return 'grade-warn';
    default:
      return 'grade-bad';
  }
}

function bar(label: string, value: number): string {
  const clamped = Math.min(100, Math.max(0, Math.round(value)));
  return `
        <div class="metric">
          <div class="metric-head"><span>${escapeHtml(label)}</span><span class="metric-value">${clamped}</span></div>
          <div class="bar"><div class="bar-fill" style="width: ${clamped}%"></div></div>
        </div>`;
}

function toolCard(tool: ToolAnalysisReport): string {
  const findings =
    tool.findings.length > 0
      ? `<ul class="findings">${tool.findings
          .map((f) => `<li>${escapeHtml(f)}</li>`)
          .join('')}</ul>`
      : '<p class="findings-clean">Optimal schema strictness, imperative density, and boundary guards.</p>';

  return `
        <details class="tool-card">
          <summary>
            <span class="tool-name">${escapeHtml(tool.toolName)}</span>
            <span class="tool-meta">
              <span class="score-pill">${tool.metrics.overallScore}</span>
              <span class="chip">${tool.tokenCount} tok</span>
              <span class="chip">${tool.propertiesCount} props</span>
              ${tool.findings.length > 0 ? `<span class="chip chip-warn">${tool.findings.length} findings</span>` : ''}
            </span>
          </summary>
          <div class="tool-body">
            <div class="metrics">
              ${bar('Schema Strictness', tool.metrics.schemaStrictness)}
              ${bar('Semantic Density', tool.metrics.semanticDensity)}
              ${bar('Token Efficiency', tool.metrics.tokenEfficiency)}
            </div>
            <div class="diagnostics">
              <h4>Diagnostics</h4>
              ${findings}
            </div>
          </div>
        </details>`;
}

function serverCard(result: ServerBenchmarkResult, rank: number): string {
  const tools =
    result.tools.length > 0
      ? result.tools.map(toolCard).join('')
      : '<p class="findings-clean">No tools were analyzed for this server.</p>';

  return `
      <details class="server-card">
        <summary>
          <span class="rank">#${rank}</span>
          <span class="server-name">${escapeHtml(result.serverName)}</span>
          <span class="server-meta">
            <span class="grade ${gradeClass(result.grade)}">${escapeHtml(result.grade)}</span>
            <span class="tqi">${result.overallTQI}/100</span>
            <span class="chip">${result.toolsAnalyzed} tools</span>
          </span>
        </summary>
        <div class="server-body">
          ${tools}
        </div>
      </details>`;
}

function summaryBanner(results: ServerBenchmarkResult[]): string {
  const servers = results.length;
  const totalTools = results.reduce((sum, r) => sum + r.toolsAnalyzed, 0);
  const totalTokens = results.reduce((sum, r) => sum + r.totalTokens, 0);
  const avgTqi =
    servers > 0 ? Math.round(results.reduce((sum, r) => sum + r.overallTQI, 0) / servers) : 0;
  const top = results.reduce<ServerBenchmarkResult | null>(
    (best, r) => (best === null || r.overallTQI > best.overallTQI ? r : best),
    null
  );

  return `
    <header class="banner">
      <h1>MCP Tool Quality Benchmark</h1>
      <p class="subtitle">Deterministic Tool Quality Index (TQI) report across ${servers} MCP server${servers === 1 ? '' : 's'}.</p>
      <div class="stats">
        <div class="stat"><span class="stat-value">${servers}</span><span class="stat-label">Servers</span></div>
        <div class="stat"><span class="stat-value">${totalTools}</span><span class="stat-label">Tools Analyzed</span></div>
        <div class="stat"><span class="stat-value">${avgTqi}</span><span class="stat-label">Average TQI</span></div>
        <div class="stat"><span class="stat-value">${totalTokens.toLocaleString('en-US')}</span><span class="stat-label">Context Tokens</span></div>
        <div class="stat"><span class="stat-value">${top ? escapeHtml(top.grade) : '—'}</span><span class="stat-label">${top ? escapeHtml(top.serverName) : 'Top Performer'}</span></div>
      </div>
    </header>`;
}

function collisionsBanner(results: ServerBenchmarkResult[]): string {
  const entries: Array<{ server: string; collision: ToolCollision }> = [];
  for (const result of results) {
    for (const collision of result.collisions ?? []) {
      entries.push({ server: result.serverName, collision });
    }
  }
  if (entries.length === 0) return '';

  const items = entries
    .map(
      ({ server, collision }) => `
          <li class="collision-item">
            <div class="collision-pair">
              <code>${escapeHtml(collision.toolA)}</code>
              <span class="collision-arrow">↔</span>
              <code>${escapeHtml(collision.toolB)}</code>
              <span class="chip chip-warn">${collision.similarityScore}</span>
            </div>
            <p class="collision-reason">${escapeHtml(collision.reason)}</p>
            <p class="collision-server">${escapeHtml(server)}</p>
          </li>`
    )
    .join('');

  return `
    <section class="panel collisions-banner">
      <h2>⚔️ Tool Collisions Detected (${entries.length})</h2>
      <p class="collisions-hint">These tool pairs overlap semantically and may confuse model tool selection.</p>
      <ul class="collision-list">${items}</ul>
    </section>`;
}

function leaderboardTable(results: ServerBenchmarkResult[]): string {
  const rows =
    results.length > 0
      ? results
          .map(
            (r, idx) => `
          <tr>
            <td class="col-rank">#${idx + 1}</td>
            <td class="col-server">${escapeHtml(r.serverName)}</td>
            <td><span class="grade ${gradeClass(r.grade)}">${escapeHtml(r.grade)}</span></td>
            <td class="col-tqi"><strong>${r.overallTQI}</strong><span class="dim">/100</span></td>
            <td>${r.averageSchemaStrictness}%</td>
            <td>${r.averageSemanticDensity}%</td>
            <td>${r.averageTokenEfficiency}%</td>
            <td>${r.averageTokensPerTool}</td>
          </tr>`
          )
          .join('')
      : '<tr><td colspan="8" class="empty">No benchmark results provided.</td></tr>';

  return `
    <section class="panel">
      <h2>Leaderboard</h2>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Rank</th><th>MCP Server</th><th>Grade</th><th>TQI</th>
              <th>Schema</th><th>Semantic</th><th>Tokens</th><th>Avg Tok/Tool</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </section>`;
}

function diagnosticsSection(results: ServerBenchmarkResult[]): string {
  const cards = results.map((r, idx) => serverCard(r, idx + 1)).join('');
  const body = results.length > 0 ? cards : '<p class="empty">No tool-level diagnostics available.</p>';
  return `
    <section class="panel">
      <div class="panel-head">
        <h2>Tool-level Diagnostics</h2>
        <div class="toolbar">
          <button type="button" data-action="expand">Expand all</button>
          <button type="button" data-action="collapse">Collapse all</button>
        </div>
      </div>
      <div class="accordion">${body}</div>
    </section>`;
}

const STYLES = `
:root {
  --bg: #f5f6f8;
  --surface: #ffffff;
  --surface-2: #f1f3f6;
  --text: #14171c;
  --muted: #5c6673;
  --border: #e3e6ea;
  --accent: #6c5ce7;
  --accent-soft: #ece9ff;
  --pass: #15803d;
  --good: #2563eb;
  --warn: #b45309;
  --bad: #dc2626;
  --shadow: 0 1px 2px rgba(16,24,40,.06), 0 10px 30px rgba(16,24,40,.07);
  --radius: 14px;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0b0d11;
    --surface: #14171d;
    --surface-2: #1b1f27;
    --text: #e7eaee;
    --muted: #9aa3b2;
    --border: #262b34;
    --accent: #8b7bf0;
    --accent-soft: #221f3a;
    --pass: #34d399;
    --good: #60a5fa;
    --warn: #fbbf24;
    --bad: #f87171;
    --shadow: 0 1px 2px rgba(0,0,0,.45), 0 14px 36px rgba(0,0,0,.4);
  }
}
* { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 15px;
  line-height: 1.55;
}
main { max-width: 1080px; margin: 0 auto; padding: 32px 20px 64px; }
.banner {
  background:
    radial-gradient(1200px 400px at 100% -20%, var(--accent-soft), transparent 60%),
    var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  box-shadow: var(--shadow);
}
.banner h1 { margin: 0 0 6px; font-size: 28px; letter-spacing: -0.02em; }
.subtitle { margin: 0 0 24px; color: var(--muted); }
.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}
.stat {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.stat-value { font-size: 24px; font-weight: 700; letter-spacing: -0.02em; }
.stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.panel {
  margin-top: 28px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: var(--shadow);
}
.panel h2 { margin: 0 0 16px; font-size: 18px; letter-spacing: -0.01em; }
.panel-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.toolbar { display: flex; gap: 8px; margin-bottom: 16px; }
.toolbar button {
  font: inherit;
  font-size: 13px;
  color: var(--text);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 9px;
  padding: 6px 12px;
  cursor: pointer;
  transition: border-color .15s ease, color .15s ease;
}
.toolbar button:hover { border-color: var(--accent); color: var(--accent); }
.table-wrap { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 720px; }
th, td { padding: 11px 12px; text-align: left; border-bottom: 1px solid var(--border); }
th { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted); font-weight: 600; }
tbody tr:last-child td { border-bottom: none; }
tbody tr:hover { background: var(--surface-2); }
.col-rank { color: var(--muted); }
.col-server { font-weight: 600; }
.col-tqi { font-variant-numeric: tabular-nums; }
.dim { color: var(--muted); font-weight: 400; font-size: 12px; }
.grade {
  display: inline-block;
  padding: 2px 9px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 12px;
  border: 1px solid transparent;
}
.grade-pass { color: var(--pass); background: color-mix(in srgb, var(--pass) 14%, transparent); border-color: color-mix(in srgb, var(--pass) 35%, transparent); }
.grade-good { color: var(--good); background: color-mix(in srgb, var(--good) 14%, transparent); border-color: color-mix(in srgb, var(--good) 35%, transparent); }
.grade-warn { color: var(--warn); background: color-mix(in srgb, var(--warn) 16%, transparent); border-color: color-mix(in srgb, var(--warn) 38%, transparent); }
.grade-bad { color: var(--bad); background: color-mix(in srgb, var(--bad) 14%, transparent); border-color: color-mix(in srgb, var(--bad) 35%, transparent); }
.accordion { display: flex; flex-direction: column; gap: 10px; }
details.server-card { border: 1px solid var(--border); border-radius: 12px; background: var(--surface-2); overflow: hidden; }
details.server-card > summary {
  list-style: none;
  cursor: pointer;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
details.server-card > summary::-webkit-details-marker { display: none; }
details.server-card > summary::before {
  content: "▸";
  color: var(--muted);
  font-size: 12px;
  transition: transform .15s ease;
}
details.server-card[open] > summary::before { transform: rotate(90deg); }
.rank { color: var(--muted); font-variant-numeric: tabular-nums; }
.server-name { font-weight: 600; }
.server-meta { margin-left: auto; display: flex; align-items: center; gap: 8px; }
.tqi { font-variant-numeric: tabular-nums; font-weight: 700; }
.chip {
  font-size: 12px;
  color: var(--muted);
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 2px 8px;
  white-space: nowrap;
}
.chip-warn { color: var(--warn); border-color: color-mix(in srgb, var(--warn) 40%, transparent); }
.server-body { padding: 4px 16px 16px; display: flex; flex-direction: column; gap: 8px; }
details.tool-card { border: 1px solid var(--border); border-radius: 10px; background: var(--surface); }
details.tool-card > summary {
  list-style: none;
  cursor: pointer;
  padding: 11px 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}
details.tool-card > summary::-webkit-details-marker { display: none; }
details.tool-card > summary::before {
  content: "▸";
  color: var(--muted);
  font-size: 11px;
  transition: transform .15s ease;
}
details.tool-card[open] > summary::before { transform: rotate(90deg); }
.tool-name { font-weight: 600; font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13.5px; }
.tool-meta { margin-left: auto; display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.score-pill {
  font-weight: 700;
  font-size: 12px;
  padding: 2px 9px;
  border-radius: 999px;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid color-mix(in srgb, var(--accent) 35%, transparent);
  font-variant-numeric: tabular-nums;
}
.tool-body { padding: 4px 16px 16px; border-top: 1px solid var(--border); }
.metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; margin: 14px 0 18px; }
.metric-head { display: flex; justify-content: space-between; font-size: 12.5px; color: var(--muted); margin-bottom: 6px; }
.metric-value { font-weight: 700; color: var(--text); font-variant-numeric: tabular-nums; }
.bar { height: 8px; border-radius: 999px; background: var(--surface-2); overflow: hidden; }
.bar-fill {
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #4ade80));
}
.diagnostics h4 { margin: 0 0 8px; font-size: 12px; text-transform: uppercase; letter-spacing: 0.06em; color: var(--muted); }
.findings { margin: 0; padding-left: 20px; display: flex; flex-direction: column; gap: 5px; }
.findings li { color: var(--text); }
.findings li::marker { color: var(--warn); }
.findings-clean { margin: 0; color: var(--pass); font-size: 14px; }
.empty { color: var(--muted); text-align: center; padding: 20px; }
.collisions-banner { border-color: color-mix(in srgb, var(--warn) 45%, var(--border)); }
.collisions-banner h2 { color: var(--warn); }
.collisions-hint { margin: 0 0 14px; color: var(--muted); font-size: 13.5px; }
.collision-list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 10px; }
.collision-item {
  border: 1px solid color-mix(in srgb, var(--warn) 30%, var(--border));
  border-radius: 10px;
  padding: 12px 14px;
  background: color-mix(in srgb, var(--warn) 6%, var(--surface));
}
.collision-pair { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.collision-pair code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 13px; font-weight: 600; }
.collision-arrow { color: var(--warn); font-weight: 700; }
.collision-reason { margin: 6px 0 0; color: var(--text); font-size: 13.5px; }
.collision-server { margin: 4px 0 0; color: var(--muted); font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; }
footer { margin-top: 28px; text-align: center; color: var(--muted); font-size: 12.5px; }
`;

function scriptTag(): string {
  return `<script>
(function () {
  function setAll(open) {
    document.querySelectorAll('details.server-card, details.tool-card').forEach(function (el) {
      el.open = open;
    });
  }
  document.addEventListener('click', function (event) {
    var target = event.target;
    if (!target || !target.getAttribute) return;
    var action = target.getAttribute('data-action');
    if (action === 'expand') setAll(true);
    if (action === 'collapse') setAll(false);
  });
})();
</script>`;
}

export function generateHtmlReport(results: ServerBenchmarkResult[]): string {
  const title = 'MCP Tool Quality Benchmark Report';
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${title}</title>
<style>${STYLES}</style>
</head>
<body>
<main>
${summaryBanner(results)}
${collisionsBanner(results)}
${leaderboardTable(results)}
${diagnosticsSection(results)}
<footer>Generated by mcp-benchmark · Tool Quality Index (TQI) = 0.40 × Schema + 0.35 × Semantic + 0.25 × Token Efficiency</footer>
</main>
${scriptTag()}
</body>
</html>
`;
}
