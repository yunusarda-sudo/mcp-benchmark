export interface McpToolDefinition {
  name: string;
  description?: string;
  outputSchema?: Record<string, unknown>;
  inputSchema?: {
    type?: string;
    properties?: Record<string, any>;
    required?: string[];
    [key: string]: any;
  };
}

export type DiagnosticSeverity = 'info' | 'warning' | 'high' | 'critical';

export interface ToolDiagnostic {
  code: string;
  severity: DiagnosticSeverity;
  path: string;
  message: string;
  suggestion: string;
}

export interface AnalysisOptions {
  englishStyle?: boolean;
}

export interface MetricBreakdown {
  schemaStrictness: number;    // 0-100
  semanticDensity: number;     // 0-100
  tokenEfficiency: number;     // 0-100
  overallScore: number;        // 0-100 (Tool Quality Index - TQI)
}

export interface ToolAnalysisReport {
  toolName: string;
  tokenCount: number;
  propertiesCount: number;
  requiredCount: number;
  hasEnumConstraints: boolean;
  hasDescriptionsForParams: boolean;
  metrics: MetricBreakdown;
  findings: string[];
  /** Stable rule IDs and JSON Pointers. Older persisted reports may omit this field. */
  diagnostics?: ToolDiagnostic[];
}

export interface ServerBenchmarkResult {
  serverName: string;
  toolsAnalyzed: number;
  totalTokens: number;
  averageTokensPerTool: number;
  averageSchemaStrictness: number;
  averageSemanticDensity: number;
  averageTokenEfficiency: number;
  overallTQI: number;
  grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F';
  tools: ToolAnalysisReport[];
}

export interface McpServerConfigEntry {
  command?: string;
  args?: string[];
  env?: Record<string, string>;
  url?: string;
  headers?: Record<string, string>;
}

export interface McpConfigFile {
  mcpServers?: Record<string, McpServerConfigEntry>;
  servers?: Record<string, McpServerConfigEntry>;
}

export interface FixChange {
  toolName: string;
  action: string;
  detail: string;
}

export interface FixResult {
  tools: McpToolDefinition[];
  changes: FixChange[];
}
