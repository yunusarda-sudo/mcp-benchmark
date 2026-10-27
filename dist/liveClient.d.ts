import { McpToolDefinition } from './types.js';
/**
 * Spawn a local MCP server over stdio, connect to it, and retrieve its live
 * tool definitions. The transport is always closed before returning, even when
 * the server fails to start or errors during the handshake.
 */
export declare function fetchToolsFromStdioServer(command: string, args?: string[]): Promise<McpToolDefinition[]>;
/**
 * Connect to a remote MCP server over Server-Sent Events (SSE) / HTTP,
 * retrieve its live tool definitions, and cleanly close the connection.
 */
export declare function fetchToolsFromSseServer(url: string | URL, headers?: Record<string, string>): Promise<McpToolDefinition[]>;
