import { McpToolDefinition, ServerBenchmarkResult, ToolAnalysisReport } from './types.js';
export declare function estimateTokenCount(text: string): number;
export declare function analyzeToolDefinition(tool: McpToolDefinition): ToolAnalysisReport;
export declare function benchmarkServerTools(serverName: string, tools: McpToolDefinition[]): ServerBenchmarkResult;
