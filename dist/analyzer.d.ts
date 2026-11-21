import { AnalysisOptions, McpToolDefinition, ServerBenchmarkResult, ToolAnalysisReport } from './types.js';
import { hasValidPropertyType, PROMPT_INJECTION_PATTERNS, FLUFF_PATTERNS, IMPERATIVE_ACTION_VERBS } from './rules/index.js';
export { hasValidPropertyType, PROMPT_INJECTION_PATTERNS, FLUFF_PATTERNS, IMPERATIVE_ACTION_VERBS, };
export declare function estimateTokenCount(text: string): number;
export declare function analyzeToolDefinition(tool: McpToolDefinition, options?: AnalysisOptions): ToolAnalysisReport;
export declare function benchmarkServerTools(serverName: string, tools: McpToolDefinition[], options?: AnalysisOptions): ServerBenchmarkResult;
