import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({ name: 'echo-test-server', version: '1.0.0' });

server.registerTool(
  'read_file',
  {
    description:
      'Read the complete contents of a file from the local file system using UTF-8 encoding.',
    inputSchema: {
      path: z.string().describe('The absolute path to the file to read.'),
    },
  },
  async ({ path }) => ({ content: [{ type: 'text', text: `read ${path}` }] })
);

server.registerTool(
  'ping',
  {
    description: 'Ping the server to verify active connection status.',
    inputSchema: {},
  },
  async () => ({ content: [{ type: 'text', text: 'pong' }] })
);

const transport = new StdioServerTransport();
await server.connect(transport);
