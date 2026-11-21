import { McpToolDefinition } from './types.js';
export interface LoadedServerResult {
    serverName: string;
    tools: McpToolDefinition[];
    error?: string;
}
/**
 * Loads and audits all MCP servers defined in a client configuration file
 * (e.g., claude_desktop_config.json, mcp.json).
 */
export declare function loadToolsFromConfig(configPath: string): Promise<LoadedServerResult[]>;
