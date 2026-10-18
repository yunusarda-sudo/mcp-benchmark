import { McpToolDefinition, ToolCollision } from './types.js';
export declare function tokenize(text: string): string[];
export declare function detectToolCollisions(tools: McpToolDefinition[]): ToolCollision[];
