import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { McpConfigFile } from './types.js';

export interface DiscoveredConfig {
  source: string;
  path: string;
  serversCount: number;
  serverNames: string[];
  config: McpConfigFile;
}

export function findLocalMcpConfigs(cwd: string = process.cwd()): DiscoveredConfig[] {
  const candidates: { source: string; path: string }[] = [];

  // 1. Current working directory & parent directories
  const localNames = ['mcp.json', 'claude_desktop_config.json', '.cursor/mcp.json', '.vscode/mcp.json'];
  for (const name of localNames) {
    const p = path.resolve(cwd, name);
    if (fs.existsSync(p)) {
      candidates.push({ source: `Local Project (${name})`, path: p });
    }
  }

  // 2. Claude Desktop Standard Config
  const home = os.homedir();
  if (process.platform === 'darwin') {
    const macClaude = path.join(home, 'Library', 'Application Support', 'Claude', 'claude_desktop_config.json');
    if (fs.existsSync(macClaude)) candidates.push({ source: 'Claude Desktop (macOS)', path: macClaude });
  } else if (process.platform === 'win32') {
    const appData = process.env.APPDATA || path.join(home, 'AppData', 'Roaming');
    const winClaude = path.join(appData, 'Claude', 'claude_desktop_config.json');
    if (fs.existsSync(winClaude)) candidates.push({ source: 'Claude Desktop (Windows)', path: winClaude });
  } else {
    const linuxClaude = path.join(home, '.config', 'Claude', 'claude_desktop_config.json');
    if (fs.existsSync(linuxClaude)) candidates.push({ source: 'Claude Desktop (Linux)', path: linuxClaude });
  }

  // 3. User home .mcp or .claude or Cursor
  const homeMcp = path.join(home, '.mcp.json');
  if (fs.existsSync(homeMcp)) candidates.push({ source: 'User Home (~/.mcp.json)', path: homeMcp });

  const homeCursor = path.join(home, '.cursor', 'mcp.json');
  if (fs.existsSync(homeCursor)) candidates.push({ source: 'Cursor Global (~/.cursor/mcp.json)', path: homeCursor });

  const discovered: DiscoveredConfig[] = [];
  for (const cand of candidates) {
    try {
      const content = fs.readFileSync(cand.path, 'utf8');
      const parsed = JSON.parse(content) as McpConfigFile;
      const serversObj = parsed.mcpServers || parsed.servers || {};
      const serverNames = Object.keys(serversObj);
      discovered.push({
        source: cand.source,
        path: cand.path,
        serversCount: serverNames.length,
        serverNames,
        config: parsed,
      });
    } catch {
      // Ignore unparseable configs
    }
  }

  return discovered;
}

export function formatDiscoveryReport(configs: DiscoveredConfig[]): string {
  if (configs.length === 0) {
    return `🔍 No active MCP client configuration files found in default locations.
To benchmark an MCP server, specify:
  mcp-benchmark --cmd "npx -y @modelcontextprotocol/server-filesystem /path"
  mcp-benchmark --file my-tools.json
  mcp-benchmark --config /path/to/claude_desktop_config.json
`;
  }

  let out = `✨ Discovered ${configs.length} MCP configuration file(s) on your machine:\n\n`;
  for (const cfg of configs) {
    out += `📁 **${cfg.source}**\n`;
    out += `   Path: \`${cfg.path}\`\n`;
    out += `   Configured servers (${cfg.serversCount}): ${cfg.serverNames.map(s => `\`${s}\``).join(', ') || 'None'}\n\n`;
  }

  out += `Run benchmark on any discovered config:\n`;
  for (const cfg of configs) {
    out += `  mcp-benchmark --config "${cfg.path}"\n`;
  }
  return out;
}
