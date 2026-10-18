import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
/**
 * Spawn a local MCP server over stdio, connect to it, and retrieve its live
 * tool definitions. The transport is always closed before returning, even when
 * the server fails to start or errors during the handshake.
 */
export async function fetchToolsFromStdioServer(command, args = []) {
    const transport = new StdioClientTransport({ command, args });
    const client = new Client({ name: 'mcp-benchmark', version: '1.0.0' });
    try {
        await client.connect(transport);
        const response = await client.listTools();
        return response.tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            inputSchema: tool.inputSchema,
        }));
    }
    finally {
        await transport.close();
    }
}
