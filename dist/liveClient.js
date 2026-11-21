import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
function withTimeout(promise, timeoutMs, operation) {
    let timer;
    const timeoutPromise = new Promise((_, reject) => {
        timer = setTimeout(() => {
            reject(new Error(`MCP server operation timed out after ${timeoutMs}ms while ${operation}.`));
        }, timeoutMs);
    });
    return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}
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
export async function fetchToolsFromStdioServer(command, args = [], timeoutMs = 20000) {
    const transport = new StdioClientTransport({ command, args });
    const client = new Client({ name: 'mcp-benchmark', version: '1.2.0' });
    try {
        return await withTimeout((async () => {
            await client.connect(transport);
            return await listAllTools(client);
        })(), timeoutMs, `executing stdio command "${command}"`);
    }
    finally {
        await transport.close();
    }
}
/**
 * Connect to a remote MCP server over Server-Sent Events (SSE) / HTTP,
 * retrieve its live tool definitions, and cleanly close the connection.
 */
export async function fetchToolsFromSseServer(url, headers, timeoutMs = 20000) {
    const endpoint = typeof url === 'string' ? new URL(url) : url;
    const transport = new SSEClientTransport(endpoint, {
        requestInit: headers ? { headers } : undefined,
    });
    const client = new Client({ name: 'mcp-benchmark', version: '1.2.0' });
    try {
        return await withTimeout((async () => {
            await client.connect(transport);
            return await listAllTools(client);
        })(), timeoutMs, `connecting to SSE endpoint "${endpoint.href}"`);
    }
    finally {
        await transport.close();
    }
}
