import fs from 'node:fs';
import path from 'node:path';
import { benchmarkServerTools } from './analyzer.js';
export function loadRegistry(registryDir) {
    const dir = registryDir || path.resolve(process.cwd(), 'registry', 'servers');
    if (!fs.existsSync(dir)) {
        return { servers: {}, metadata: {} };
    }
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    const servers = {};
    const metadata = {};
    for (const file of files) {
        try {
            const content = fs.readFileSync(path.join(dir, file), 'utf8');
            const entry = JSON.parse(content);
            if (entry && entry.name && Array.isArray(entry.tools)) {
                servers[entry.name] = entry.tools;
                metadata[entry.name] = entry;
            }
        }
        catch {
            // Ignore invalid JSON files in directory
        }
    }
    return { servers, metadata };
}
export function benchmarkRegistry(registryDir) {
    const { servers } = loadRegistry(registryDir);
    const results = [];
    for (const [serverName, tools] of Object.entries(servers)) {
        results.push(benchmarkServerTools(serverName, tools));
    }
    // Sort descending by TQI overall score, then by token efficiency
    results.sort((a, b) => b.overallTQI - a.overallTQI || b.averageTokenEfficiency - a.averageTokenEfficiency);
    return results;
}
export function generateLeaderboardMarkdown(results, metadata) {
    const top25 = results.slice(0, 25);
    const remaining = results.slice(25);
    let md = '| Rank | MCP Server | Grade | TQI Score | Strictness | Density | Efficiency | Avg Tokens/Tool |\n';
    md += '|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|\n';
    top25.forEach((r, idx) => {
        const meta = metadata?.[r.serverName];
        const serverDisplay = meta?.repository
            ? `[**${r.serverName}**](${meta.repository})`
            : `**${r.serverName}**`;
        md += `| ${idx + 1} | ${serverDisplay} | \`${r.grade}\` | **${r.overallTQI}/100** | ${r.averageSchemaStrictness}% | ${r.averageSemanticDensity}% | ${r.averageTokenEfficiency}% | ${r.averageTokensPerTool} tok |\n`;
    });
    if (remaining.length > 0) {
        md += '\n<details>\n<summary><b>▶ Click to expand all ' + results.length + ' ranked MCP servers (Ranks 26–' + results.length + ')</b></summary>\n\n';
        md += '| Rank | MCP Server | Grade | TQI Score | Strictness | Density | Efficiency | Avg Tokens/Tool |\n';
        md += '|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|\n';
        remaining.forEach((r, idx) => {
            const meta = metadata?.[r.serverName];
            const serverDisplay = meta?.repository
                ? `[**${r.serverName}**](${meta.repository})`
                : `**${r.serverName}**`;
            md += `| ${idx + 26} | ${serverDisplay} | \`${r.grade}\` | **${r.overallTQI}/100** | ${r.averageSchemaStrictness}% | ${r.averageSemanticDensity}% | ${r.averageTokenEfficiency}% | ${r.averageTokensPerTool} tok |\n`;
        });
        md += '\n</details>\n';
    }
    return md;
}
export function updateReadmeLeaderboard(options = {}) {
    const readmePath = options.readmePath || path.resolve(process.cwd(), 'README.md');
    if (!fs.existsSync(readmePath)) {
        return { updated: false, count: 0 };
    }
    const { metadata } = loadRegistry(options.registryDir);
    const results = benchmarkRegistry(options.registryDir);
    if (results.length === 0) {
        return { updated: false, count: 0 };
    }
    const newTable = generateLeaderboardMarkdown(results, metadata);
    const content = fs.readFileSync(readmePath, 'utf8');
    // Replace content between leaderboard markers
    const startMarker = '<!-- LEADERBOARD_START -->';
    const endMarker = '<!-- LEADERBOARD_END -->';
    let newContent = content;
    if (content.includes(startMarker) && content.includes(endMarker)) {
        const before = content.substring(0, content.indexOf(startMarker) + startMarker.length);
        const after = content.substring(content.indexOf(endMarker));
        newContent = `${before}\n\n${newTable}\n\n${after}`;
    }
    else {
        // Fallback: replace existing top table under "## Official Ecosystem Benchmark Leaderboard"
        const heading = '## 🏆 Official Ecosystem Benchmark Leaderboard';
        if (content.includes(heading)) {
            const headingIdx = content.indexOf(heading);
            const nextSectionIdx = content.indexOf('### Ecosystem Breakdown by Category', headingIdx);
            if (nextSectionIdx > headingIdx) {
                const preamble = content.substring(headingIdx, content.indexOf('| Rank |', headingIdx));
                const after = content.substring(nextSectionIdx);
                newContent = `${content.substring(0, headingIdx)}${preamble}${startMarker}\n\n${newTable}\n\n${endMarker}\n\n${after}`;
            }
        }
    }
    if (newContent !== content) {
        fs.writeFileSync(readmePath, newContent, 'utf8');
        return { updated: true, count: results.length };
    }
    return { updated: false, count: results.length };
}
export function registerServer(entry, registryDir) {
    const dir = registryDir || path.resolve(process.cwd(), 'registry', 'servers');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const slug = entry.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const targetPath = path.join(dir, `${slug}.json`);
    const serverData = {
        $schema: '../schema.json',
        name: entry.name,
        category: entry.category,
        description: entry.description || `${entry.name} tools for AI agents.`,
        repository: entry.repository,
        maintainer: entry.maintainer || 'community',
        tools: entry.tools,
    };
    fs.writeFileSync(targetPath, JSON.stringify(serverData, null, 2) + '\n', 'utf8');
    return targetPath;
}
