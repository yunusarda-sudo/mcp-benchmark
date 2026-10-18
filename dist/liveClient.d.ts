import { McpToolDefinition } from './types.js';
/**
 * Spawn a local MCP server over stdio, connect to it, and retrieve its live
 * tool definitions. The transport is always closed before returning, even when
 * the server fails to start or errors during the handshake.
 */
export declare function fetchToolsFromStdioServer(command: string, args?: string[]): Promise<McpToolDefinition[]>;
