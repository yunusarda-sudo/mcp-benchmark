export interface McpToolDefinition {
  name: string;
  description?: string;
  inputSchema?: {
    type?: string;
    properties?: Record<string, any>;
    required?: string[];
    [key: string]: any;
  };
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
}

export interface ToolCollision {
  toolA: string;
  toolB: string;
  similarityScore: number;
  reason: string;
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
  collisions?: ToolCollision[];
}
