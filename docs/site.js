    // Single source of truth for the version shown on the page and written to SARIF.
    const SITE_VERSION = '1.4.0';
    const REPO_URL = 'https://github.com/yunusarda-sudo/mcp-benchmark';
    const FOCUS_RING = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500';
    const TAB_ACTIVE_DESKTOP = `tab-btn whitespace-nowrap px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all bg-emerald-500 text-white shadow-sm ${FOCUS_RING}`;
    const TAB_IDLE_DESKTOP = `tab-btn whitespace-nowrap px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all text-slate-400 hover:text-white ${FOCUS_RING}`;
    const TAB_ACTIVE_MOBILE = `flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap bg-emerald-500 text-white ${FOCUS_RING}`;
    const TAB_IDLE_MOBILE = `flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold text-center whitespace-nowrap text-slate-400 hover:text-white ${FOCUS_RING}`;

    // Small DOM helper: every piece of dynamic text goes through textContent.
    function el(tag, className, text) {
      const node = document.createElement(tag);
      if (className) node.className = className;
      if (text !== undefined && text !== null) node.textContent = String(text);
      return node;
    }

    // Toast Notification System
    function showToast(message, type = 'success') {
      const container = document.getElementById('toast-container');
      let bg = 'bg-emerald-500 text-white border-emerald-400';
      if (type === 'error') bg = 'bg-rose-500 text-white border-rose-400';
      if (type === 'info') bg = 'bg-cyan-500 text-white border-cyan-400';

      const toast = el('div', `pointer-events-auto px-4 py-2.5 rounded-xl shadow-2xl text-xs font-semibold flex items-center gap-2 border transition-all duration-300 transform translate-y-2 opacity-0 ${bg}`);
      toast.append(el('span', '', type === 'error' ? '⚠️' : '✨'), el('span', '', message));
      container.appendChild(toast);

      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      });

      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 3200);
    }

    async function copyText(text) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        showToast('Could not copy to clipboard: ' + (err && err.message ? err.message : 'permission denied'), 'error');
        return false;
      }
    }

    async function copyCliCommand() {
      const ok = await copyText('npx mcp-benchmark -f tools.json --cost');
      if (!ok) return;
      const label = document.getElementById('copy-cli-text');
      label.textContent = 'Copied!';
      showToast('CLI command copied to clipboard!');
      setTimeout(() => { label.textContent = 'Copy'; }, 2000);
    }

    // Tab Switching
    function switchTab(tab) {
      ['auditor', 'leaderboard', 'rules'].forEach(t => {
        const desktopBtn = document.getElementById(`nav-${t}`);
        const mobileBtn = document.getElementById(`mobile-nav-${t}`);
        const content = document.getElementById(`tab-${t}-content`);
        const active = t === tab;

        if (desktopBtn) {
          desktopBtn.className = active ? TAB_ACTIVE_DESKTOP : TAB_IDLE_DESKTOP;
          desktopBtn.setAttribute('aria-selected', String(active));
          desktopBtn.tabIndex = active ? 0 : -1;
        }
        if (mobileBtn) {
          mobileBtn.className = active ? TAB_ACTIVE_MOBILE : TAB_IDLE_MOBILE;
          mobileBtn.setAttribute('aria-selected', String(active));
          mobileBtn.tabIndex = active ? 0 : -1;
        }
        content.classList.toggle('hidden', !active);
      });
      if (tab === 'leaderboard') renderLeaderboard(document.getElementById('leaderboard-search').value);
      if (tab === 'rules') renderRules();
    }

    // Auditor State
    const jsonInput = document.getElementById('json-input');
    const presetChips = document.getElementById('preset-chips');
    const sourceStatus = document.getElementById('audit-source-status');
    const jsonError = document.getElementById('json-error');
    const editorDrawer = document.getElementById('editor-drawer');
    const onlyIssuesToggle = document.getElementById('only-issues');
    const btnAutoFix = document.getElementById('btn-autofix');
    const btnFormat = document.getElementById('btn-format');
    const btnClear = document.getElementById('btn-clear');
    const btnCopyBadge = document.getElementById('btn-copy-badge');
    const btnExportSarif = document.getElementById('btn-export-sarif');
    const modelCostSelector = document.getElementById('model-cost-selector');

    let currentAuditResult = null;

    // Descriptive preset names; grade and TQI are computed from the engine at init.
    const PRESET_LABELS = {
      betterstack: 'BetterStack MCP',
      postgres: 'PostgreSQL Database',
      github: 'GitHub VCS Tools',
      sample_fluffy: 'Fluffy Descriptions & Loose Schema',
      malicious: 'Prompt Injection & Secret Leak',
    };

    const AUTO_AUDIT_DELAY_MS = 350;
    const MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
    let currentSource = { label: 'Your JSON', kind: 'pasted' };
    let autoAuditTimer = null;

    function presetScore(name) {
      try {
        const lib = window.McpBenchmark;
        return lib.benchmarkServer(lib.extractTools(lib.PRESETS[name]));
      } catch (err) {
        console.warn('Could not score preset', name, err);
        return null;
      }
    }

    function renderPresetChips() {
      presetChips.replaceChildren(...Object.entries(PRESET_LABELS).map(([name, label]) => {
        const result = presetScore(name);
        const chip = el('button', 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 transition');
        chip.type = 'button';
        chip.dataset.preset = name;
        chip.append(el('span', '', label));
        if (result) chip.append(el('span', `font-bold ${gradeTextClass(result.grade)}`, result.grade));
        chip.addEventListener('click', () => loadPreset(name));
        return chip;
      }));
    }

    function setSource(label, kind) {
      currentSource = { label, kind };
    }

    function renderSourceStatus(toolCount) {
      const kindLabel = { example: 'Example', registry: 'Registry', file: 'File', pasted: 'Pasted' }[currentSource.kind] || '';
      sourceStatus.replaceChildren(
        el('span', 'text-slate-500', 'Auditing '),
        el('strong', 'text-white font-semibold', currentSource.label),
        el('span', 'ml-2 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] uppercase tracking-wide text-slate-400', kindLabel),
      );
      document.getElementById('char-count').textContent = `${toolCount} tool${toolCount === 1 ? '' : 's'}`;
    }

    function loadJsonText(text, label, kind) {
      jsonInput.value = text;
      setSource(label, kind);
      editorDrawer.open = false;
      runAudit();
    }

    function loadPreset(name) {
      const preset = window.McpBenchmark.PRESETS[name];
      if (preset) loadJsonText(JSON.stringify(preset, null, 2), PRESET_LABELS[name] || name, 'example');
    }

    function runAudit() {
      const text = jsonInput.value.trim();
      if (!text) {
        jsonError.textContent = '';
        resetScorecard();
        sourceStatus.textContent = 'Nothing to audit yet. Search the registry, upload a file or paste JSON.';
        document.getElementById('char-count').textContent = '0 tools';
        return;
      }
      try {
        const tools = window.McpBenchmark.extractTools(JSON.parse(text));
        const result = window.McpBenchmark.benchmarkServer(tools);
        jsonError.textContent = '';
        currentAuditResult = result;
        renderScorecard(result);
        renderSourceStatus(tools.length);
      } catch (err) {
        jsonError.textContent = err.message;
        sourceStatus.replaceChildren(el('span', 'text-rose-400', `Can't read this JSON: ${err.message}`));
        if (!editorDrawer.open) editorDrawer.open = true;
      }
    }

    function scheduleAutoAudit() {
      clearTimeout(autoAuditTimer);
      autoAuditTimer = setTimeout(runAudit, AUTO_AUDIT_DELAY_MS);
    }

    function resetScorecard() {
      currentAuditResult = null;
      document.getElementById('score-grade').textContent = '—';
      document.getElementById('score-grade').className = 'text-3xl font-black text-slate-500';
      document.getElementById('score-tqi').textContent = '— / 100';
      document.getElementById('gauge-circle').style.strokeDashoffset = 264;
      [['strictness'], ['density'], ['efficiency']].forEach(([k]) => {
        document.getElementById(`metric-${k}`).textContent = '—';
        document.getElementById(`bar-${k}`).style.width = '0%';
      });
      document.getElementById('token-total').textContent = '—';
      updateCostEstimate();
      document.getElementById('findings-count').textContent = '0 issues';
      document.getElementById('findings-list').replaceChildren();
      btnAutoFix.disabled = true;
    }

    function buildFindingItem(f) {
      let badgeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      if (f.severity === 'critical') badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      if (f.severity === 'high') badgeColor = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      if (f.severity === 'info') badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

      const item = el('div', 'p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1');
      const head = el('div', 'flex items-center justify-between gap-2');
      head.append(
        el('span', 'font-mono text-slate-200 font-bold', f.code),
        el('span', `px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeColor}`, f.severity)
      );
      item.append(
        head,
        el('p', 'text-slate-400', f.message),
        el('p', 'text-emerald-400/90 font-medium text-[11px]', `💡 ${f.suggestion}`)
      );
      return item;
    }

    function gradeTextClass(grade) {
      if (grade === 'A+' || grade === 'A') return 'text-emerald-400';
      if (grade === 'B') return 'text-cyan-400';
      if (grade === 'C') return 'text-yellow-400';
      return 'text-rose-400';
    }

    function gradeBarClass(grade) {
      if (grade === 'A+' || grade === 'A') return 'bg-emerald-500';
      if (grade === 'B') return 'bg-cyan-500';
      if (grade === 'C') return 'bg-yellow-500';
      return 'bg-rose-500';
    }

    const MAX_ISSUES_SHOWN_OPEN = 6;
    const SEVERITY_ORDER = ['critical', 'high', 'warning', 'info'];

    function buildAuditToolRow(tool, index) {
      const lib = window.McpBenchmark;
      const score = tool.metrics.overallScore;
      const grade = lib.gradeFromScore(score);
      const issues = tool.diagnostics || [];

      const row = el('details', 'tool-row group rounded-xl border border-slate-800 bg-slate-950/60 open:bg-slate-950/90');
      // Rows are sorted worst-first: always expand the worst one, others only when short.
      row.open = issues.length > 0 && (index === 0 || issues.length <= MAX_ISSUES_SHOWN_OPEN);
      const summary = el('summary', 'cursor-pointer list-none grid grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,1fr)_9rem_5rem_6rem] items-center gap-x-4 gap-y-1 px-3 py-2.5 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500');
      const name = el('span', 'font-mono text-sm text-slate-100 truncate', tool.toolName);
      name.title = tool.toolName;
      const scoreCell = el('span', 'flex items-center gap-2');
      const track = el('span', 'hidden sm:block flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden');
      const fill = el('span', `block h-full rounded-full ${gradeBarClass(grade)}`);
      fill.style.width = `${score}%`;
      track.append(fill);
      scoreCell.append(el('span', `font-bold text-sm ${gradeTextClass(grade)}`, grade), el('span', 'text-xs text-slate-400 font-mono', String(score)), track);
      const issueText = issues.length === 0 ? 'No issues' : `${issues.length} issue${issues.length === 1 ? '' : 's'}`;
      summary.append(
        name,
        scoreCell,
        el('span', 'hidden sm:block text-xs text-slate-500 font-mono text-right', `${tool.tokenCount} tok`),
        el('span', `col-span-2 sm:col-span-1 text-xs sm:text-right ${issues.length ? 'text-amber-300' : 'text-emerald-400/80'}`, issueText),
      );
      row.append(summary);
      if (issues.length) {
        const body = el('div', 'px-3 pb-3 space-y-2');
        const rank = d => SEVERITY_ORDER.indexOf(d.severity) === -1 ? SEVERITY_ORDER.length : SEVERITY_ORDER.indexOf(d.severity);
        [...issues].sort((a, b) => rank(a) - rank(b)).forEach(d => body.appendChild(buildFindingItem(d)));
        row.append(body);
      }
      return row;
    }

    function renderToolBreakdown(result) {
      const findingsList = document.getElementById('findings-list');
      const totalIssues = result.tools.reduce((n, t) => n + (t.diagnostics || []).length, 0);
      document.getElementById('findings-count').textContent = `${totalIssues} issue${totalIssues === 1 ? '' : 's'}`;
      btnAutoFix.disabled = totalIssues === 0;

      const sorted = [...result.tools].sort((a, b) =>
        (b.diagnostics || []).length - (a.diagnostics || []).length || a.metrics.overallScore - b.metrics.overallScore);
      const visible = onlyIssuesToggle.checked ? sorted.filter(t => (t.diagnostics || []).length) : sorted;

      if (totalIssues === 0) {
        const ok = el('div', 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs');
        ok.textContent = `✅ All ${result.tools.length} tool definition(s) pass every check.`;
        findingsList.replaceChildren(ok, ...visible.map(buildAuditToolRow));
        return;
      }
      findingsList.replaceChildren(...visible.map(buildAuditToolRow));
    }

    function renderScorecard(result) {
      document.getElementById('score-grade').textContent = result.grade;
      document.getElementById('score-tqi').textContent = `${result.overallTQI} / 100`;

      // Gauge Circle
      const circle = document.getElementById('gauge-circle');
      const maxOffset = 264;
      const progress = result.overallTQI / 100;
      circle.style.strokeDashoffset = maxOffset - (maxOffset * progress);

      // Grade color
      let strokeColor = '#10b981';
      if (result.grade === 'B') strokeColor = '#06b6d4';
      else if (result.grade === 'C') strokeColor = '#eab308';
      else if (result.grade === 'D' || result.grade === 'F') strokeColor = '#f43f5e';
      document.getElementById('score-grade').className = `text-3xl font-black ${gradeTextClass(result.grade)}`;
      circle.style.stroke = strokeColor;

      // Bars
      document.getElementById('metric-strictness').textContent = `${result.averageSchemaStrictness}%`;
      document.getElementById('bar-strictness').style.width = `${result.averageSchemaStrictness}%`;

      document.getElementById('metric-density').textContent = `${result.averageSemanticDensity}%`;
      document.getElementById('bar-density').style.width = `${result.averageSemanticDensity}%`;

      document.getElementById('metric-efficiency').textContent = `${result.averageTokenEfficiency}%`;
      document.getElementById('bar-efficiency').style.width = `${result.averageTokenEfficiency}%`;

      document.getElementById('token-total').textContent = `${result.totalTokens} tok (${result.averageTokensPerTool} tok/tool)`;

      updateCostEstimate();

      renderToolBreakdown(result);
    }

    // Official Anthropic list prices, USD per 1M tokens, checked against
    // https://platform.claude.com/docs/en/about-claude/pricing on PRICES_CHECKED_ON.
    // cacheWrite = 5-minute cache write, cacheRead = cache hit. Haiku uses its <=100k-token prompt tier.
    const PRICES_CHECKED_ON = '2026-11-24';
    const PRICES_SOURCE_URL = 'https://platform.claude.com/docs/en/about-claude/pricing';
    const MODEL_PRICES = [
      { id: 'claude-fable-5-2', label: 'Claude Fable 5.2', input: 8.0, cacheWrite: 10.0, cacheRead: 0.20 },
      { id: 'claude-opus-5-5', label: 'Claude Opus 5.5', input: 4.0, cacheWrite: 5.0, cacheRead: 0.20 },
      { id: 'claude-sonnet-5-5', label: 'Claude Sonnet 5.5', input: 2.0, cacheWrite: 2.5, cacheRead: 0.10 },
      { id: 'claude-haiku-5-5', label: 'Claude Haiku 5.5', input: 0.10, cacheWrite: 0.125, cacheRead: 0.01 },
    ];
    const DEFAULT_MODEL_ID = 'claude-sonnet-5-5';
    const CUSTOM_MODEL_ID = 'custom';
    const costCustomRateInput = document.getElementById('cost-custom-rate');

    function populateModelSelector() {
      const option = (value, text) => { const o = el('option', null, text); o.value = value; return o; };
      const group = el('optgroup');
      group.label = `Claude (list price, checked ${PRICES_CHECKED_ON})`;
      MODEL_PRICES.forEach(m => group.appendChild(option(m.id, `${m.label} · $${m.input.toFixed(2)}/M`)));
      modelCostSelector.replaceChildren(group, option(CUSTOM_MODEL_ID, 'Other provider · custom $/M'));
      modelCostSelector.value = DEFAULT_MODEL_ID;
      const source = document.getElementById('cost-price-source');
      const link = el('a', 'underline hover:text-slate-300', 'Anthropic pricing');
      link.href = PRICES_SOURCE_URL;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      source.replaceChildren('Prices: ', link, `, checked ${PRICES_CHECKED_ON}.`);
    }

    function selectedPricing() {
      if (modelCostSelector.value === CUSTOM_MODEL_ID) {
        const rate = Number(costCustomRateInput.value);
        return { input: Number.isFinite(rate) && rate >= 0 ? rate : 0, cacheWrite: null, cacheRead: null };
      }
      return MODEL_PRICES.find(m => m.id === modelCostSelector.value) || MODEL_PRICES[0];
    }

    const costSessionsInput = document.getElementById('cost-sessions');
    const costTurnsInput = document.getElementById('cost-turns');
    const COST_FIELD_IDS = ['cost-projection', 'cost-per-session', 'cost-cached', 'cost-tokens-turn', 'cost-tokens-session', 'cost-tokens-month'];
    const tokenFormat = new Intl.NumberFormat('en-US');
    const compactFormat = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });

    function readPositiveInt(input, fallback, max) {
      const value = Math.floor(Number(input.value));
      return Number.isFinite(value) && value >= 1 ? Math.min(value, max) : fallback;
    }

    function formatUsd(amount) {
      if (amount === 0) return '$0.00';
      if (amount < 0.01) return '<$0.01';
      return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    function updateCostEstimate() {
      if (!currentAuditResult) {
        COST_FIELD_IDS.forEach(id => { document.getElementById(id).textContent = '—'; });
        return;
      }
      const pricing = selectedPricing();
      const sessions = readPositiveInt(costSessionsInput, 1000, 100000000);
      const turns = readPositiveInt(costTurnsInput, 15, 1000);
      const report = window.McpBenchmark.estimateTokenEconomics(
        currentAuditResult.totalTokens, currentAuditResult.toolsAnalyzed, sessions, turns);
      const monthlyTokens = report.tokensPer1000Sessions;
      const perMillion = tokens => tokens / 1000000;
      const sessionCost = perMillion(report.tokensPer10TurnSession) * pricing.input;

      document.getElementById('cost-tokens-turn').textContent = tokenFormat.format(report.tokensPerTurn);
      document.getElementById('cost-tokens-session').textContent = tokenFormat.format(report.tokensPer10TurnSession);
      document.getElementById('cost-tokens-month').textContent = compactFormat.format(monthlyTokens);
      document.getElementById('cost-projection').textContent = formatUsd(perMillion(monthlyTokens) * pricing.input);
      const cachedOut = document.getElementById('cost-cached');
      if (pricing.cacheWrite === null) {
        cachedOut.textContent = 'Caching: enter provider rates';
      } else {
        const cachedSession = perMillion(report.tokensPerTurn) * (pricing.cacheWrite + (turns - 1) * pricing.cacheRead);
        cachedOut.textContent = `${formatUsd(cachedSession * sessions)} / mo with caching`;
      }
      document.getElementById('cost-per-session').textContent = `${formatUsd(sessionCost)} / session`;
    }

    populateModelSelector();
    modelCostSelector.addEventListener('change', () => {
      costCustomRateInput.classList.toggle('hidden', modelCostSelector.value !== CUSTOM_MODEL_ID);
      updateCostEstimate();
    });
    costCustomRateInput.addEventListener('input', updateCostEstimate);
    costSessionsInput.addEventListener('input', updateCostEstimate);
    costTurnsInput.addEventListener('input', updateCostEstimate);

    // Auto-Fix
    btnAutoFix.addEventListener('click', () => {
      try {
        const raw = JSON.parse(jsonInput.value);
        const tools = window.McpBenchmark.extractTools(raw);
        const { fixedTools, changeCount } = window.McpBenchmark.autoFixTools(tools);
        const fixedRaw = window.McpBenchmark.replaceTools(raw, fixedTools);
        jsonInput.value = JSON.stringify(fixedRaw, null, 2);
        runAudit();
        showToast(changeCount ? `✨ Repaired ${changeCount} schema issue(s). Remaining findings need a human edit.` : 'Nothing auto-fixable here; the remaining findings need a human edit.', changeCount ? 'success' : 'info');
      } catch (e) {
        showToast('Invalid JSON: ' + e.message, 'error');
      }
    });

    // Format
    btnFormat.addEventListener('click', () => {
      try {
        const raw = JSON.parse(jsonInput.value);
        jsonInput.value = JSON.stringify(raw, null, 2);
        showToast('JSON formatted successfully!');
      } catch (e) {
        showToast('Cannot format: invalid JSON syntax', 'error');
      }
    });

    // Clear
    btnClear.addEventListener('click', () => {
      jsonInput.value = '';
      setSource('Your JSON', 'pasted');
      runAudit();
      jsonInput.focus();
    });

    function badgeColorForGrade(grade) {
      switch (grade) {
        case 'A+':
        case 'A': return '10b981';
        case 'B': return '06b6d4';
        case 'C': return 'eab308';
        case 'D': return 'f97316';
        default: return 'f43f5e';
      }
    }

    // Copy Badge
    btnCopyBadge.addEventListener('click', async () => {
      if (!currentAuditResult) { showToast('Run an audit first', 'info'); return; }
      const grade = currentAuditResult.grade;
      const tqi = currentAuditResult.overallTQI;
      const badgeMd = `[![MCP Quality](https://img.shields.io/badge/MCP%20Quality-${encodeURIComponent(grade)}%20(${tqi}%2F100)-${badgeColorForGrade(grade)}?style=flat)](${REPO_URL})`;
      if (await copyText(badgeMd)) showToast('Markdown Badge copied to clipboard!');
    });

    function sarifLevel(severity) {
      if (severity === 'critical' || severity === 'high') return 'error';
      if (severity === 'info') return 'note';
      return 'warning';
    }

    function buildSarif(result) {
      const rules = new Map();
      const results = [];
      result.tools.forEach(t => {
        (t.diagnostics || []).forEach(d => {
          if (!rules.has(d.code)) {
            rules.set(d.code, { id: d.code, shortDescription: { text: d.message } });
          }
          results.push({
            ruleId: d.code,
            level: sarifLevel(d.severity),
            message: { text: `[${t.toolName}] ${d.message}` },
            locations: [{
              logicalLocations: [{ name: t.toolName, fullyQualifiedName: `${t.toolName}${d.path || ''}` }]
            }]
          });
        });
      });
      return {
        $schema: 'https://raw.githubusercontent.com/oasis-tcs/sarif-spec/master/Schemata/sarif-schema-2.1.0.json',
        version: '2.1.0',
        runs: [{
          tool: { driver: { name: 'mcp-benchmark', version: SITE_VERSION, informationUri: REPO_URL, rules: [...rules.values()] } },
          results
        }]
      };
    }

    // Export SARIF
    btnExportSarif.addEventListener('click', () => {
      if (!currentAuditResult) { showToast('Run an audit first', 'info'); return; }
      const sarif = buildSarif(currentAuditResult);
      const blob = new Blob([JSON.stringify(sarif, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'mcp-benchmark.sarif';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast('SARIF report downloaded!');
    });

    jsonInput.addEventListener('input', () => {
      if (currentSource.kind !== 'pasted') setSource('Your JSON', 'pasted');
      scheduleAutoAudit();
    });
    onlyIssuesToggle.addEventListener('change', () => { if (currentAuditResult) renderToolBreakdown(currentAuditResult); });
    document.getElementById('btn-paste').addEventListener('click', () => {
      editorDrawer.open = true;
      jsonInput.select();
      jsonInput.focus();
    });

    // Upload + drag and drop
    const fileInput = document.getElementById('file-input');
    const auditSource = document.getElementById('audit-source');
    const dropOverlay = document.getElementById('drop-overlay');

    async function loadFile(file) {
      if (!file) return;
      if (file.size > MAX_UPLOAD_BYTES) {
        showToast(`${file.name} is larger than 2 MB.`, 'error');
        return;
      }
      try {
        loadJsonText(await file.text(), file.name, 'file');
      } catch (err) {
        showToast(`Could not read ${file.name}: ${err.message}`, 'error');
      }
    }

    document.getElementById('btn-upload').addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => { loadFile(fileInput.files[0]); fileInput.value = ''; });
    let dragDepth = 0;
    auditSource.addEventListener('dragenter', (e) => { e.preventDefault(); dragDepth += 1; dropOverlay.classList.remove('hidden'); });
    auditSource.addEventListener('dragover', (e) => e.preventDefault());
    auditSource.addEventListener('dragleave', () => { dragDepth = Math.max(0, dragDepth - 1); if (!dragDepth) dropOverlay.classList.add('hidden'); });
    auditSource.addEventListener('drop', (e) => {
      e.preventDefault();
      dragDepth = 0;
      dropOverlay.classList.add('hidden');
      loadFile(e.dataTransfer.files[0]);
    });

    // Registry search (combobox)
    const auditSearch = document.getElementById('audit-search');
    const auditResults = document.getElementById('audit-search-results');
    const MAX_SEARCH_RESULTS = 8;
    let searchMatches = [];
    let activeMatch = -1;

    function findServers(query) {
      const q = query.trim().toLowerCase();
      if (!q) return [];
      const list = window.ECOSYSTEM_DATA || [];
      const scored = [];
      for (const server of list) {
        const name = `${server.title || ''} ${server.name}`.toLowerCase();
        const toolHit = (server.tools || []).some(t => String(t.name || t).toLowerCase().includes(q));
        if (name.includes(q)) scored.push([name.startsWith(q) ? 0 : 1, server]);
        else if (toolHit) scored.push([2, server]);
      }
      return scored.sort((a, b) => a[0] - b[0] || b[1].tqi - a[1].tqi).slice(0, MAX_SEARCH_RESULTS).map(([, s]) => s);
    }

    function closeSearchResults() {
      auditResults.classList.add('hidden');
      auditSearch.setAttribute('aria-expanded', 'false');
      auditSearch.removeAttribute('aria-activedescendant');
      activeMatch = -1;
    }

    function highlightMatch(index) {
      activeMatch = index;
      [...auditResults.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === index)));
      const active = auditResults.children[index];
      if (active) {
        auditSearch.setAttribute('aria-activedescendant', active.id);
        active.scrollIntoView({ block: 'nearest' });
      }
    }

    function chooseServer(server) {
      closeSearchResults();
      auditSearch.value = '';
      loadServerToAuditor(server);
    }

    function renderSearchResults() {
      searchMatches = findServers(auditSearch.value);
      if (!auditSearch.value.trim()) { closeSearchResults(); return; }
      if (!searchMatches.length) {
        auditResults.replaceChildren(el('li', 'px-3 py-2 text-xs text-slate-400', 'No registry server matches. Try a tool name, or upload your own JSON.'));
      } else {
        auditResults.replaceChildren(...searchMatches.map((server, i) => {
          const li = el('li', 'flex items-center justify-between gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-slate-800 hover:bg-slate-800');
          li.id = `audit-match-${i}`;
          li.setAttribute('role', 'option');
          li.setAttribute('aria-selected', 'false');
          const left = el('span', 'min-w-0');
          left.append(el('span', 'block text-slate-100 truncate', server.title || server.name), el('span', 'block text-[11px] text-slate-500 font-mono truncate', `${server.name} · ${server.toolsCount} tools`));
          li.append(left, el('span', `shrink-0 font-bold ${gradeTextClass(server.grade)}`, `${server.grade} · ${server.tqi}`));
          li.addEventListener('mousedown', (e) => { e.preventDefault(); chooseServer(server); });
          return li;
        }));
      }
      auditResults.classList.remove('hidden');
      auditSearch.setAttribute('aria-expanded', 'true');
      activeMatch = -1;
    }

    auditSearch.addEventListener('input', renderSearchResults);
    auditSearch.addEventListener('blur', () => setTimeout(closeSearchResults, 100));
    auditSearch.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' && searchMatches.length) { e.preventDefault(); highlightMatch((activeMatch + 1) % searchMatches.length); }
      else if (e.key === 'ArrowUp' && searchMatches.length) { e.preventDefault(); highlightMatch((activeMatch - 1 + searchMatches.length) % searchMatches.length); }
      else if (e.key === 'Enter' && searchMatches.length) { e.preventDefault(); chooseServer(searchMatches[Math.max(activeMatch, 0)]); }
      else if (e.key === 'Escape') { closeSearchResults(); }
    });

    // Leaderboard State & Pagination
    let activeCategory = 'all';
    let currentSortColumn = 'rank';
    let currentSortAsc = true;
    let currentPage = 1;
    const PAGE_SIZE = 50;
    const LEADERBOARD_COLUMNS = 10;

    const PILL_IDLE = `cat-pill px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition cursor-pointer whitespace-nowrap text-xs ${FOCUS_RING}`;
    const PILL_ACTIVE = `cat-pill px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold shadow-md transition cursor-pointer whitespace-nowrap text-xs ${FOCUS_RING}`;

    const CATEGORY_META = {
      'AI, LLMs & Agents': { icon: '🤖', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20' },
      'Developer Tools & DevOps': { icon: '🛠️', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20' },
      'Databases & Storage': { icon: '🗄️', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' },
      'Vector DBs & AI Search': { icon: '⚡', badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20 hover:bg-teal-500/20' },
      'Finance, Crypto & Web3': { icon: '💰', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20' },
      'Security & Identity': { icon: '🛡️', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20' },
      'Web Scraping & Automation': { icon: '🕸️', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20' },
      'Observability & Analytics': { icon: '📊', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20' },
      'Communication & Alerting': { icon: '💬', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/20' },
      'Productivity & Notes': { icon: '📝', badge: 'bg-lime-500/10 text-lime-400 border-lime-500/20 hover:bg-lime-500/20' },
      'E-Commerce & Retail': { icon: '🛍️', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20' },
      'Design, UI & 3D Media': { icon: '🎨', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20 hover:bg-pink-500/20' },
      'Healthcare & Wellness': { icon: '🏥', badge: 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' },
      'Jobs, Career & Learning': { icon: '💼', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20' },
      'Travel, Maps & Navigation': { icon: '🗺️', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20' },
      'Social, Media & Knowledge': { icon: '🌐', badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20 hover:bg-fuchsia-500/20' },
      'Other': { icon: '📦', badge: 'bg-slate-500/10 text-slate-400 border-slate-500/20 hover:bg-slate-500/20' },
    };

    function currentSearchText() {
      return document.getElementById('leaderboard-search').value;
    }

    function selectCategory(cat) {
      activeCategory = cat;
      currentPage = 1;
      const select = document.getElementById('category-select');
      if (select) select.value = cat;

      const container = document.getElementById('category-filters');
      if (container) {
        container.querySelectorAll('.cat-pill').forEach(b => {
          const isTarget = b.getAttribute('data-cat') === cat;
          b.className = isTarget ? PILL_ACTIVE : PILL_IDLE;
          b.setAttribute('aria-pressed', String(isTarget));
        });
      }
      renderLeaderboard(currentSearchText());
    }

    function renderLeaderboardHeader() {
      const list = window.ECOSYSTEM_DATA || [];
      const sync = window.ECOSYSTEM_SYNC && window.ECOSYSTEM_SYNC.lastSync;
      const summary = document.getElementById('leaderboard-summary');
      summary.replaceChildren();
      summary.append(`Evaluating ${list.length} remote servers with live `, el('code', '', 'tools/list'), ' data from the official MCP Registry.');
      if (sync) summary.append(` · last synced ${String(sync).slice(0, 10)}`);

      const countText = String(list.length);
      document.getElementById('header-server-count').textContent = countText;
      document.getElementById('mobile-lb-count').textContent = countText;
    }

    function renderLeaderboardSummary() {
      const list = window.ECOSYSTEM_DATA || [];
      const counts = new Map();
      list.forEach(item => counts.set(item.category, (counts.get(item.category) || 0) + 1));

      // 1. Populate Dropdown Selector
      const select = document.getElementById('category-select');
      if (select) {
        select.replaceChildren();
        const allOpt = document.createElement('option');
        allOpt.value = 'all';
        allOpt.textContent = `📂 All Categories (${list.length})`;
        select.appendChild(allOpt);

        [...counts.entries()].sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
          const opt = document.createElement('option');
          opt.value = cat;
          const meta = CATEGORY_META[cat] || { icon: '📁' };
          opt.textContent = `${meta.icon} ${cat} (${count})`;
          if (cat === activeCategory) opt.selected = true;
          select.appendChild(opt);
        });

        select.onchange = (e) => selectCategory(e.target.value);
      }

      // 2. Populate Pill Filter Bar
      const container = document.getElementById('category-filters');
      container.replaceChildren();

      [['all', list.length], ...[...counts.entries()].sort((a, b) => b[1] - a[1])].forEach(([cat, count]) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('data-cat', cat);
        btn.setAttribute('aria-pressed', String(cat === activeCategory));
        btn.className = cat === activeCategory ? PILL_ACTIVE : PILL_IDLE;
        const meta = CATEGORY_META[cat];
        const icon = meta ? `${meta.icon} ` : (cat === 'all' ? '📂 ' : '');
        btn.textContent = `${icon}${cat === 'all' ? 'All' : cat} (${count})`;
        btn.addEventListener('click', () => selectCategory(cat));
        container.appendChild(btn);
      });
    }

    function sortLeaderboard(col) {
      if (currentSortColumn === col) {
        currentSortAsc = !currentSortAsc;
      } else {
        currentSortColumn = col;
        currentSortAsc = (col === 'name' || col === 'category') ? true : false;
      }
      renderLeaderboard(currentSearchText());
    }

    function updateSortIndicators() {
      document.querySelectorAll('th[data-sort]').forEach(th => {
        const isActive = th.getAttribute('data-sort') === currentSortColumn;
        th.setAttribute('aria-sort', isActive ? (currentSortAsc ? 'ascending' : 'descending') : 'none');
      });
    }

    function buildLeaderboardRow(r) {
      let badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      if (r.grade === 'B') badgeColor = 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      if (r.grade === 'C') badgeColor = 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      if (r.grade === 'D' || r.grade === 'F') badgeColor = 'text-rose-400 bg-rose-500/10 border-rose-500/20';

      const row = el('tr', 'hover:bg-slate-800/40 transition border-b border-slate-800/40');

      row.appendChild(el('td', 'py-3 px-3 text-center font-bold text-slate-400', r.rank));

      // Server Info
      const nameCell = el('td', 'py-3 px-4 font-sans');
      const titleBtn = el('button', `font-bold text-white block text-xs text-left hover:text-emerald-400 cursor-pointer rounded ${FOCUS_RING}`, r.title || r.name);
      titleBtn.type = 'button';
      titleBtn.addEventListener('click', () => openServerModal(r));
      nameCell.append(titleBtn, el('span', 'block text-[11px] text-slate-500 font-normal', `${r.name} · ${r.toolsCount} tools`));
      row.appendChild(nameCell);

      // Category pill button
      const catTd = el('td', 'py-3 px-3 text-center font-sans');
      const catMeta = CATEGORY_META[r.category] || CATEGORY_META['Other'];
      const catBtn = el('button', `inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium border transition cursor-pointer ${catMeta.badge} ${FOCUS_RING}`);
      catBtn.type = 'button';
      catBtn.append(el('span', '', catMeta.icon), ' ', el('span', '', r.category || 'Other'));
      catBtn.title = `Filter by ${r.category || 'Other'}`;
      catBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        selectCategory(r.category || 'Other');
      });
      catTd.appendChild(catBtn);
      row.appendChild(catTd);

      // Grade
      const gradeCell = el('td', 'py-3 px-3 text-center');
      gradeCell.appendChild(el('span', `px-2 py-0.5 rounded text-xs font-bold border ${badgeColor}`, r.grade));
      row.appendChild(gradeCell);

      // Scores
      row.appendChild(el('td', 'py-3 px-3 text-center font-bold text-white', `${r.tqi}/100`));
      row.appendChild(el('td', 'py-3 px-3 text-center text-slate-300', `${r.strictness}%`));
      row.appendChild(el('td', 'py-3 px-3 text-center text-slate-300', `${r.density}%`));
      row.appendChild(el('td', 'py-3 px-3 text-center text-slate-300', `${r.efficiency}%`));
      row.appendChild(el('td', 'py-3 px-3 text-center text-cyan-400 font-semibold', `${r.tokensPerTool} tok`));

      // Actions
      const actionCell = el('td', 'py-3 px-4 text-right font-sans');
      const button = el('button', `px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold border border-slate-700 transition ${FOCUS_RING}`, 'Inspect');
      button.type = 'button';
      button.addEventListener('click', () => openServerModal(r));
      actionCell.appendChild(button);
      row.appendChild(actionCell);

      return row;
    }

    function renderLeaderboard(filterText = '') {
      const tbody = document.getElementById('leaderboard-body');
      tbody.replaceChildren();

      const list = (window.ECOSYSTEM_DATA || []).map((item, idx) => ({ ...item, rank: idx + 1 }));
      const query = filterText.toLowerCase().trim();

      let filtered = list.filter(item => {
        const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
        const toolNames = (item.tools || []).map(t => t.name).join(' ');
        const haystack = `${item.name} ${item.title || ''} ${item.category} ${item.slug} ${toolNames}`.toLowerCase();
        return matchesCategory && (!query || haystack.includes(query));
      });

      // Sorting
      filtered.sort((a, b) => {
        let valA = a[currentSortColumn];
        let valB = b[currentSortColumn];
        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return currentSortAsc ? -1 : 1;
        if (valA > valB) return currentSortAsc ? 1 : -1;
        return 0;
      });
      updateSortIndicators();

      const totalItems = filtered.length;
      const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
      if (currentPage > totalPages) currentPage = totalPages;
      if (currentPage < 1) currentPage = 1;

      document.getElementById('filtered-server-count').textContent = `Showing ${totalItems} servers`;
      document.getElementById('page-info').textContent = totalItems === 0
        ? 'No servers to show'
        : `Showing ${Math.min((currentPage - 1) * PAGE_SIZE + 1, totalItems)} - ${Math.min(currentPage * PAGE_SIZE, totalItems)} of ${totalItems} servers`;

      if (totalItems === 0) {
        const emptyRow = el('tr');
        const emptyCell = el('td', 'py-10 px-4 text-center text-slate-400 font-sans', 'No servers match your filters.');
        emptyCell.colSpan = LEADERBOARD_COLUMNS;
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
      } else {
        const startIdx = (currentPage - 1) * PAGE_SIZE;
        filtered.slice(startIdx, startIdx + PAGE_SIZE).forEach(r => tbody.appendChild(buildLeaderboardRow(r)));
      }

      renderPaginationControls(totalPages);
    }

    function renderPaginationControls(totalPages) {
      const prevBtn = document.getElementById('btn-prev-page');
      const nextBtn = document.getElementById('btn-next-page');
      const container = document.getElementById('page-buttons');
      container.replaceChildren();

      prevBtn.disabled = currentPage <= 1;
      nextBtn.disabled = currentPage >= totalPages;

      prevBtn.onclick = () => { if (currentPage > 1) { currentPage--; renderLeaderboard(currentSearchText()); } };
      nextBtn.onclick = () => { if (currentPage < totalPages) { currentPage++; renderLeaderboard(currentSearchText()); } };

      const maxButtons = 5;
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxButtons - 1);
      if (end - start < maxButtons - 1) start = Math.max(1, end - maxButtons + 1);

      for (let p = start; p <= end; p++) {
        const btn = el('button', `w-7 h-7 rounded-lg text-xs font-semibold ${FOCUS_RING} ${p === currentPage ? 'bg-emerald-500 text-white font-bold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`, p);
        btn.type = 'button';
        btn.setAttribute('aria-label', `Page ${p}`);
        if (p === currentPage) btn.setAttribute('aria-current', 'page');
        btn.onclick = () => { currentPage = p; renderLeaderboard(currentSearchText()); };
        container.appendChild(btn);
      }
    }

    // Modal Inspection
    let activeModalServer = null;
    let modalOpener = null;
    const serverModal = document.getElementById('server-modal');

    function isModalOpen() {
      return !serverModal.classList.contains('hidden');
    }

    function safeHttpsUrl(value) {
      try {
        const u = new URL(String(value));
        return u.protocol === 'https:' ? u.href : null;
      } catch (err) {
        return null;
      }
    }

    function buildToolRow(t) {
      const item = el('div', 'p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono');
      const left = el('div');
      left.append(
        el('span', 'font-bold text-white block', t.name),
        el('span', 'text-[10px] text-slate-500 font-sans', `Individual Tool Score: ${t.score || '90'}/100`)
      );
      item.append(left, el('span', 'px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[11px] font-semibold', `${t.tokens} tok`));
      return item;
    }

    function openServerModal(server) {
      activeModalServer = server;
      modalOpener = document.activeElement;
      document.getElementById('modal-server-title').textContent = server.title || server.name;
      document.getElementById('modal-server-name').textContent = `${server.name} · ${server.category}`;
      document.getElementById('modal-server-grade').textContent = server.grade;
      document.getElementById('modal-tqi').textContent = `${server.tqi}/100`;
      document.getElementById('modal-strictness').textContent = `${server.strictness}%`;
      document.getElementById('modal-density').textContent = `${server.density}%`;
      document.getElementById('modal-tokens').textContent = `${server.tokensPerTool} tok/tool`;

      const repoLink = document.getElementById('modal-repo-link');
      const safeRepo = server.repository ? safeHttpsUrl(server.repository) : null;
      if (safeRepo) {
        repoLink.href = safeRepo;
        repoLink.classList.remove('hidden');
      } else {
        repoLink.removeAttribute('href');
        repoLink.classList.add('hidden');
      }

      const toolsList = document.getElementById('modal-tools-list');
      toolsList.replaceChildren();
      const tools = server.tools || [];
      document.getElementById('modal-tools-count').textContent = `${tools.length} tool(s)`;
      tools.forEach(t => toolsList.appendChild(buildToolRow(t)));

      document.getElementById('modal-btn-audit').onclick = () => {
        closeServerModal(false);
        loadServerToAuditor(server);
      };

      serverModal.classList.remove('hidden');
      document.getElementById('modal-close-btn').focus();
    }

    function closeServerModal(restoreFocus = true) {
      serverModal.classList.add('hidden');
      if (restoreFocus && modalOpener && typeof modalOpener.focus === 'function' && document.contains(modalOpener)) {
        modalOpener.focus();
      }
      modalOpener = null;
    }

    function trapModalFocus(e) {
      const focusable = Array.from(serverModal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'))
        .filter(n => n.offsetParent !== null);
      if (focusable.length === 0) { e.preventDefault(); return; }
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && (document.activeElement === first || !serverModal.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !serverModal.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    }

    async function loadServerToAuditor(server) {
      sourceStatus.textContent = `Loading ${server.title || server.name} from the registry…`;
      try {
        const url = `https://raw.githubusercontent.com/yunusarda-sudo/mcp-benchmark/main/registry/servers/${encodeURIComponent(server.slug)}.json`;
        const options = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? { signal: AbortSignal.timeout(10000) } : {};
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data || !Array.isArray(data.tools)) throw new Error('response has no tools array');
        switchTab('auditor');
        loadJsonText(JSON.stringify(data.tools, null, 2), server.title || server.name, 'registry');
        showToast(`⚡ Successfully loaded ${data.tools.length} tool(s) from ${server.name}!`);
      } catch (err) {
        const reason = err && err.name === 'TimeoutError' ? 'request timed out' : (err && err.message ? err.message : 'unknown error');
        showToast(`Could not load full tool definitions for ${server.name}: ${reason}`, 'error');
      }
    }

    // Leaderboard Search Input
    const searchInput = document.getElementById('leaderboard-search');
    const clearSearchBtn = document.getElementById('btn-clear-search');
    let searchDebounce = null;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchDebounce);
      clearSearchBtn.classList.toggle('hidden', !e.target.value);
      searchDebounce = setTimeout(() => {
        currentPage = 1;
        renderLeaderboard(e.target.value);
      }, 150);
    });

    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      currentPage = 1;
      renderLeaderboard();
    });

    // Close modal on escape or backdrop click; keep Tab inside while open
    serverModal.addEventListener('click', (e) => {
      if (e.target.id === 'server-modal') closeServerModal();
    });
    window.addEventListener('keydown', (e) => {
      if (!isModalOpen()) return;
      if (e.key === 'Escape') closeServerModal();
      else if (e.key === 'Tab') trapModalFocus(e);
    });

    // Rules Catalog
    const RULES_LIST = window.McpBenchmark.RULES || [];

    function renderRules() {
      const container = document.getElementById('rules-container');
      container.replaceChildren();
      RULES_LIST.forEach(rule => {
        let badgeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
        if (rule.severity === 'critical') badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
        if (rule.severity === 'info') badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
        if (rule.severity === 'high') badgeColor = 'bg-orange-500/10 text-orange-400 border-orange-500/20';

        const card = el('div', 'p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 glass shadow-lg');
        const head = el('div', 'flex items-center justify-between gap-2');
        head.append(
          el('code', 'font-mono font-bold text-emerald-400 text-xs', rule.id),
          el('span', `px-2 py-0.5 rounded text-[10px] uppercase font-bold border ${badgeColor}`, rule.severity)
        );
        card.append(
          head,
          el('p', 'text-slate-300 text-xs leading-relaxed', rule.desc),
          el('div', 'text-[10px] text-slate-500 uppercase tracking-wider font-semibold font-mono', `Domain: ${rule.category}`)
        );
        container.appendChild(card);
      });
    }

    function applyDynamicCounts() {
      document.getElementById('site-version-pill').textContent = `v${SITE_VERSION}`;
      document.getElementById('site-version-npm').textContent = `v${SITE_VERSION}`;
      const rulesCount = String(RULES_LIST.length);
      document.querySelectorAll('[data-rules-count]').forEach(n => { n.textContent = rulesCount; });
    }

    // Init Page
    document.querySelectorAll('[data-goto]').forEach(btn => btn.addEventListener('click', () => switchTab(btn.getAttribute('data-goto'))));
    document.querySelectorAll('th[data-sort] button').forEach(btn => {
      btn.addEventListener('click', () => sortLeaderboard(btn.closest('th').getAttribute('data-sort')));
    });
    applyDynamicCounts();
    renderLeaderboardHeader();
    renderLeaderboardSummary();
    renderLeaderboard();
    renderPresetChips();
    loadPreset('betterstack');
