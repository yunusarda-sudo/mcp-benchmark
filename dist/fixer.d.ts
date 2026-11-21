import { FixChange, FixResult, McpToolDefinition } from './types.js';
/**
 * Automatically cleans up common quality issues in an MCP tool definition:
 * - Ensures inputSchema has type: "object" and defined properties
 * - Removes non-existent properties from required
 * - Cleans up conversational fluff and filler phrases from descriptions
 */
export declare function fixToolDefinition(tool: McpToolDefinition): {
    fixedTool: McpToolDefinition;
    changes: FixChange[];
};
/**
 * Fix an entire list of tool definitions and return the cleaned definitions and change log.
 */
export declare function fixToolCatalog(tools: McpToolDefinition[]): FixResult;
