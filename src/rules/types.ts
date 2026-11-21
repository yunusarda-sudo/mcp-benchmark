import { McpToolDefinition, ToolDiagnostic, DiagnosticSeverity, AnalysisOptions } from '../types.js';

export interface RuleContext {
  tool: McpToolDefinition;
  options?: AnalysisOptions;
  properties: Record<string, any>;
  propKeys: string[];
  required: string[];
  validRequired: boolean;
  desc: string;
  tokenCount: number;
}

export interface RuleDefinition {
  id: string;
  name: string;
  category: 'schema' | 'security' | 'semantic' | 'naming' | 'efficiency';
  defaultSeverity: DiagnosticSeverity;
  description: string;
  suggestion: string;
  check(context: RuleContext): ToolDiagnostic[];
}
