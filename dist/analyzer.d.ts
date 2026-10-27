import { McpToolDefinition, ServerBenchmarkResult, ToolAnalysisReport } from './types.js';
export declare const PROMPT_INJECTION_PATTERNS: {
    regex: RegExp;
    severity: string;
    title: string;
}[];
export declare function estimateTokenCount(text: string): number;
export declare function analyzeToolDefinition(tool: McpToolDefinition): ToolAnalysisReport;
export declare function benchmarkServerTools(serverName: string, tools: McpToolDefinition[]): ServerBenchmarkResult;
