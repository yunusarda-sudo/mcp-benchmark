import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
async function listAllTools(client) {
    const tools = [];
    const seenCursors = new Set();
    let cursor;
    do {
        const page = await client.listTools(cursor === undefined ? undefined : { cursor });
        for (const tool of page.tools) {
            tools.push(tool);
        }
        cursor = page.nextCursor;
        if (cursor !== undefined) {
            if (seenCursors.has(cursor))
                throw new Error('MCP server returned a repeated tools/list cursor.');
            seenCursors.add(cursor);
        }
    } while (cursor !== undefined);
    return tools;
}
/**
 * Spawn a local MCP server over stdio, connect to it, and retrieve its live
 * tool definitions. The transport is always closed before returning, even when
 * the server fails to start or errors during the handshake.
 */
export async function fetchToolsFromStdioServer(command, args = []) {
    const transport = new StdioClientTransport({ command, args });
    const client = new Client({ name: 'mcp-benchmark', version: '1.1.0' });
    try {
        await client.connect(transport);
        return await listAllTools(client);
    }
    finally {
        await transport.close();
    }
}
/**
 * Connect to a remote MCP server over Server-Sent Events (SSE) / HTTP,
 * retrieve its live tool definitions, and cleanly close the connection.
 */
export async function fetchToolsFromSseServer(url, headers) {
    const endpoint = typeof url === 'string' ? new URL(url) : url;
    const transport = new SSEClientTransport(endpoint, {
        requestInit: headers ? { headers } : undefined,
    });
    const client = new Client({ name: 'mcp-benchmark', version: '1.1.0' });
    try {
        await client.connect(transport);
        return await listAllTools(client);
    }
    finally {
        await transport.close();
    }
}
