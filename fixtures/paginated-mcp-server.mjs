import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const server = new Server(
  { name: 'paginated-fixture', version: '1.0.0' },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, ({ params }) => {
  if (params?.cursor === undefined) {
    return { tools: [{ name: 'first_page', inputSchema: { type: 'object' }, outputSchema: { type: 'object', properties: { count: { type: 'integer' } } } }], nextCursor: 'page-2' };
  }
  return {
    tools: [{ name: 'second_page', inputSchema: { type: 'object' } }],
    ...(process.argv.includes('--repeat-cursor') ? { nextCursor: 'page-2' } : {}),
  };
});

await server.connect(new StdioServerTransport());
