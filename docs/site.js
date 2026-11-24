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
    const presetSelector = document.getElementById('preset-selector');
    const btnAudit = document.getElementById('btn-audit');
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

    function labelPresetOptions() {
      Array.from(presetSelector.options).forEach(opt => {
        const base = PRESET_LABELS[opt.value] || opt.value;
        opt.textContent = base;
        try {
          const lib = window.McpBenchmark;
          const result = lib.benchmarkServer(lib.extractTools(lib.PRESETS[opt.value]));
          opt.textContent = `${base} (${result.grade} · ${result.overallTQI})`;
        } catch (err) {
          console.warn('Could not score preset', opt.value, err);
        }
      });
    }

    function loadPreset(name) {
      const preset = window.McpBenchmark.PRESETS[name];
      if (preset) {
        jsonInput.value = JSON.stringify(preset, null, 2);
        runAudit();
      }
    }

    function runAudit() {
      try {
        const text = jsonInput.value.trim();
        if (!text) {
          showToast('Editor is empty. Paste a tool schema or select a preset.', 'info');
          return;
        }
        const raw = JSON.parse(text);
        const tools = window.McpBenchmark.extractTools(raw);
        const result = window.McpBenchmark.benchmarkServer(tools);
        currentAuditResult = result;
        renderScorecard(result);
        document.getElementById('char-count').textContent = `${tools.length} tool(s) evaluated`;
      } catch (err) {
        showToast(err.message, 'error');
      }
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
      document.getElementById('cost-projection').textContent = '—';
      document.getElementById('findings-count').textContent = '0 findings';
      document.getElementById('findings-list').replaceChildren();
    }

    function buildFindingItem(f) {
      let badgeColor = 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      if (f.severity === 'critical') badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      if (f.severity === 'high') badgeColor = 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      if (f.severity === 'info') badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';

      const item = el('div', 'p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs space-y-1');
      const head = el('div', 'flex items-center justify-between gap-2');
      head.append(
        el('span', 'font-mono text-slate-200 font-bold', `[${f.toolName}] ${f.code}`),
        el('span', `px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${badgeColor}`, f.severity)
      );
      item.append(
        head,
        el('p', 'text-slate-400', f.message),
        el('p', 'text-emerald-400/90 font-medium text-[11px]', `💡 ${f.suggestion}`)
      );
      return item;
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
      let colorClass = 'text-emerald-400';
      let strokeColor = '#10b981';
      if (result.grade === 'B') { colorClass = 'text-cyan-400'; strokeColor = '#06b6d4'; }
      else if (result.grade === 'C') { colorClass = 'text-yellow-400'; strokeColor = '#eab308'; }
      else if (result.grade === 'D' || result.grade === 'F') { colorClass = 'text-rose-400'; strokeColor = '#f43f5e'; }
      document.getElementById('score-grade').className = `text-3xl font-black ${colorClass}`;
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

      // Diagnostics list
      const findingsList = document.getElementById('findings-list');
      findingsList.replaceChildren();

      const allFindings = result.tools.flatMap(t => (t.diagnostics || []).map(d => ({ ...d, toolName: t.toolName })));
      document.getElementById('findings-count').textContent = `${allFindings.length} issue(s)`;

      if (allFindings.length === 0) {
        const ok = el('div', 'p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2');
        ok.append(el('span', '', '✅'), el('span', '', 'Zero diagnostics! All tool definitions meet production strictness standards.'));
        findingsList.appendChild(ok);
      } else {
        allFindings.forEach(f => findingsList.appendChild(buildFindingItem(f)));
      }
    }

    function updateCostEstimate() {
      const out = document.getElementById('cost-projection');
      if (!currentAuditResult) { out.textContent = '—'; return; }
      const ratePerMillion = parseFloat(modelCostSelector.value);
      const cost = ((currentAuditResult.totalTokens * 1000) / 1000000) * ratePerMillion;
      out.textContent = `$${cost.toFixed(3)}`;
    }

    modelCostSelector.addEventListener('change', updateCostEstimate);

    // Auto-Fix
    btnAutoFix.addEventListener('click', () => {
      try {
        const raw = JSON.parse(jsonInput.value);
        const tools = window.McpBenchmark.extractTools(raw);
        const { fixedTools, changeCount } = window.McpBenchmark.autoFixTools(tools);
        const fixedRaw = window.McpBenchmark.replaceTools(raw, fixedTools);
        jsonInput.value = JSON.stringify(fixedRaw, null, 2);
        runAudit();
        showToast(`✨ Automatically repaired ${changeCount} schema issue(s)!`);
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
      document.getElementById('char-count').textContent = '0 tools loaded';
      resetScorecard();
      showToast('Editor cleared', 'info');
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

    presetSelector.addEventListener('change', (e) => loadPreset(e.target.value));
    btnAudit.addEventListener('click', runAudit);

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
      showToast(`Loading ${server.name} tools...`, 'info');
      try {
        const url = `https://raw.githubusercontent.com/yunusarda-sudo/mcp-benchmark/main/registry/servers/${encodeURIComponent(server.slug)}.json`;
        const options = typeof AbortSignal !== 'undefined' && AbortSignal.timeout ? { signal: AbortSignal.timeout(10000) } : {};
        const res = await fetch(url, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!data || !Array.isArray(data.tools)) throw new Error('response has no tools array');
        jsonInput.value = JSON.stringify(data.tools, null, 2);
        switchTab('auditor');
        runAudit();
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
    labelPresetOptions();
    loadPreset('betterstack');
