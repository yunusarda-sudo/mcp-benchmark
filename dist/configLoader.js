import fs from 'node:fs';
import path from 'node:path';
/**
 * Loads and audits all MCP servers defined in a client configuration file
 * (e.g., claude_desktop_config.json, mcp.json).
 */
export async function loadToolsFromConfig(configPath) {
    const resolved = path.resolve(configPath);
    let parsed;
    try {
        const content = fs.readFileSync(resolved, 'utf8');
        parsed = JSON.parse(content);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to read configuration file at ${resolved}: ${message}`);
    }
    const servers = parsed.mcpServers || parsed.servers;
    if (!servers || typeof servers !== 'object' || Array.isArray(servers)) {
        throw new Error(`Invalid MCP configuration at ${resolved}: expected "mcpServers" or "servers" object.`);
    }
    const results = [];
    for (const [serverName, entry] of Object.entries(servers)) {
        if (!entry || typeof entry !== 'object') {
            results.push({ serverName, tools: [], error: 'Invalid server configuration entry.' });
            continue;
        }
        try {
            if (entry.command) {
                const { fetchToolsFromStdioServer } = await import('./liveClient.js');
                const tools = await fetchToolsFromStdioServer(entry.command, entry.args ?? []);
                results.push({ serverName, tools });
            }
            else if (entry.url) {
                const { fetchToolsFromSseServer } = await import('./liveClient.js');
                const tools = await fetchToolsFromSseServer(entry.url, entry.headers);
                results.push({ serverName, tools });
            }
            else {
                results.push({ serverName, tools: [], error: 'Server entry must specify either "command" or "url".' });
            }
        }
        catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            results.push({ serverName, tools: [], error: message });
        }
    }
    return results;
}
