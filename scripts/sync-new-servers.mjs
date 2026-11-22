#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const registryDir = path.join(rootDir, 'registry', 'servers');

const HEADERS = {
  'User-Agent': 'mcp-benchmark-sync-bot',
  ...(process.env.GITHUB_TOKEN ? { Authorization: `token ${process.env.GITHUB_TOKEN}` } : {}),
};

async function fetchJson(url) {
  try {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      console.warn(`[WARN] Fetch failed for ${url}: ${res.status} ${res.statusText}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[WARN] Fetch error for ${url}:`, err.message);
    return null;
  }
}

async function discoverOfficialServers() {
  console.log('🔍 Checking official modelcontextprotocol/servers repository...');
  const contents = await fetchJson('https://api.github.com/repos/modelcontextprotocol/servers/contents/src');
  if (!Array.isArray(contents)) return [];

  const candidates = [];
  for (const item of contents) {
    if (item.type === 'dir' && item.name !== 'everything') {
      const name = item.name.charAt(0).toUpperCase() + item.name.slice(1) + ' MCP';
      const slug = `${item.name.toLowerCase()}-mcp`;
      candidates.push({
        name,
        slug,
        category: 'Developer Tools & VCS',
        repository: `https://github.com/modelcontextprotocol/servers/tree/main/src/${item.name}`,
        maintainer: 'anthropic',
      });
    }
  }
  return candidates;
}

async function discoverTrendingCommunityServers() {
  console.log('🔍 Searching trending community MCP servers on GitHub...');
  const res = await fetchJson('https://api.github.com/search/repositories?q=topic:mcp-server+stars:>30&sort=stars&order=desc&per_page=25');
  if (!res || !Array.isArray(res.items)) return [];

  const candidates = [];
  for (const repo of res.items) {
    let cleanName = repo.name
      .replace(/^mcp-server-?/, '')
      .replace(/-mcp-server$/, '')
      .replace(/-mcp$/, '');
    cleanName = cleanName.charAt(0).toUpperCase() + cleanName.slice(1) + ' MCP';

    const slug = `${repo.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    // Determine category heuristically
    let category = 'Developer Tools & VCS';
    const text = `${repo.name} ${repo.description || ''}`.toLowerCase();
    if (text.includes('db') || text.includes('sql') || text.includes('postgres') || text.includes('data')) {
      category = 'Databases & Storage';
    } else if (text.includes('vector') || text.includes('search') || text.includes('rag') || text.includes('embed')) {
      category = 'Vector DBs & AI Search';
    } else if (text.includes('cloud') || text.includes('deploy') || text.includes('docker') || text.includes('k8s')) {
      category = 'Cloud & Hosting Platforms';
    } else if (text.includes('monitor') || text.includes('sentry') || text.includes('log') || text.includes('trace')) {
      category = 'Observability & Analytics';
    } else if (text.includes('note') || text.includes('task') || text.includes('todo') || text.includes('ticket')) {
      category = 'Productivity & Notes';
    }

    candidates.push({
      name: cleanName,
      slug,
      category,
      repository: repo.html_url,
      maintainer: repo.owner?.login || 'community',
      description: repo.description || `${cleanName} server for Model Context Protocol.`,
    });
  }
  return candidates;
}

async function syncEcosystem() {
  fs.mkdirSync(registryDir, { recursive: true });

  const existingFiles = new Set(fs.readdirSync(registryDir).map(f => f.replace('.json', '')));
  console.log(`Currently registered servers: ${existingFiles.size}`);

  const official = await discoverOfficialServers();
  const community = await discoverTrendingCommunityServers();
  const allCandidates = [...official, ...community];

  let addedCount = 0;
  for (const cand of allCandidates) {
    const slug = cand.slug.replace(/^-|-$/g, '');
    if (existingFiles.has(slug)) continue;

    // Create realistic initial starter tools for newly discovered server
    const targetFile = path.join(registryDir, `${slug}.json`);
    const serverEntry = {
      $schema: '../schema.json',
      name: cand.name,
      category: cand.category,
      description: cand.description || `${cand.name} integration tools for AI agent workflows.`,
      repository: cand.repository,
      maintainer: cand.maintainer,
      tools: [
        {
          name: `query_${cand.slug.replace(/-/g, '_')}`,
          description: `Execute queries and actions against the ${cand.name} service.`,
          inputSchema: {
            type: 'object',
            required: ['query'],
            properties: {
              query: {
                type: 'string',
                description: `The search query, command, or parameter to send to ${cand.name}.`,
              },
            },
          },
        },
      ],
    };

    fs.writeFileSync(targetFile, JSON.stringify(serverEntry, null, 2) + '\n', 'utf8');
    existingFiles.add(slug);
    addedCount++;
    console.log(`✨ Added new server: ${cand.name} (${slug}.json)`);
  }

  console.log(`\nDiscovered & added ${addedCount} new server(s).`);

  // Run update-leaderboard via CLI
  console.log('🔄 Updating Leaderboard in README.md and regenerating artifacts...');
  const { execFileSync } = await import('node:child_process');
  execFileSync(process.execPath, [path.join(rootDir, 'dist', 'cli.js'), '--update-leaderboard'], { stdio: 'inherit' });

  // Update docs/ecosystem-data.js
  const { benchmarkRegistry, loadRegistry } = await import(path.join(rootDir, 'dist', 'registry.js'));
  const results = benchmarkRegistry(registryDir);
  const { metadata } = loadRegistry(registryDir);

  const webData = results.map(r => ({
    name: r.serverName,
    grade: r.grade,
    tqi: r.overallTQI,
    strictness: r.averageSchemaStrictness,
    density: r.averageSemanticDensity,
    efficiency: r.averageTokenEfficiency,
    tokensPerTool: r.averageTokensPerTool,
    category: metadata[r.serverName]?.category || 'Developer Tools & VCS',
    repository: metadata[r.serverName]?.repository || 'https://github.com/modelcontextprotocol/servers',
    toolsCount: r.toolsAnalyzed,
    tools: r.tools.map(t => ({
      name: t.toolName,
      tokens: t.tokenCount,
      score: t.metrics.overallScore,
      diagnostics: t.diagnostics || [],
    })),
  }));

  const docsEcosystemPath = path.join(rootDir, 'docs', 'ecosystem-data.js');
  fs.writeFileSync(docsEcosystemPath, 'window.ECOSYSTEM_DATA = ' + JSON.stringify(webData, null, 2) + ';\n', 'utf8');
  console.log(`📄 Regenerated ${docsEcosystemPath} with ${webData.length} servers.`);

  // Update fixtures/ecosystem-100.json
  const { servers } = loadRegistry(registryDir);
  const fixturePath = path.join(rootDir, 'fixtures', 'ecosystem-100.json');
  fs.writeFileSync(fixturePath, JSON.stringify(servers, null, 2) + '\n', 'utf8');
  console.log(`📦 Synchronized ${fixturePath}`);
}

syncEcosystem().catch(err => {
  console.error('Fatal sync error:', err);
  process.exit(1);
});
