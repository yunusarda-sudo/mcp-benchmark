import { AnalysisOptions, McpToolDefinition, ServerBenchmarkResult, ToolAnalysisReport, ToolDiagnostic } from './types.js';
import {
  ALL_RULES,
  RuleContext,
  hasValidPropertyType,
  PROMPT_INJECTION_PATTERNS,
  FLUFF_PATTERNS,
  IMPERATIVE_ACTION_VERBS,
} from './rules/index.js';

export {
  hasValidPropertyType,
  PROMPT_INJECTION_PATTERNS,
  FLUFF_PATTERNS,
  IMPERATIVE_ACTION_VERBS,
};

export function estimateTokenCount(text: string): number {
  if (!text) return 0;
  // Standard heuristic: ~4 characters per token for English text/JSON
  return Math.ceil(text.length / 4);
}

export function analyzeToolDefinition(tool: McpToolDefinition, options: AnalysisOptions = {}): ToolAnalysisReport {
  const schema = tool.inputSchema || {};
  const properties = schema.properties || {};
  const propKeys = Object.keys(properties);
  const required = Array.isArray(schema.required) ? schema.required : [];
  const validRequired = schema.required === undefined
    || (Array.isArray(schema.required) && schema.required.every(key => typeof key === 'string'));
  const desc = (tool.description || '').trim();
  const rawJson = JSON.stringify(tool);
  const tokenCount = estimateTokenCount(rawJson);

  const context: RuleContext = {
    tool,
    options,
    properties,
    propKeys,
    required,
    validRequired,
    desc,
    tokenCount,
  };

  // Run all pluggable rules to gather diagnostics
  const diagnostics: ToolDiagnostic[] = [];
  for (const rule of ALL_RULES) {
    const findings = rule.check(context);
    diagnostics.push(...findings);
  }

  // 1. Schema Strictness Evaluation (0 - 100)
  let schemaScore = 0;
  if (schema.type === 'object') {
    schemaScore += 20;
  }

  if (propKeys.length > 0) {
    schemaScore += 10;
    
    let typedCount = 0;
    let describedPropsCount = 0;
    let enumConstrainedCount = 0;

    for (const key of propKeys) {
      const prop = properties[key];
      if (hasValidPropertyType(prop)) {
        typedCount++;
      }
      if (prop && (prop.description || prop.title)) {
        describedPropsCount++;
      }
      if (prop && (Array.isArray(prop.enum) || prop.pattern || prop.minimum !== undefined || prop.maximum !== undefined)) {
        enumConstrainedCount++;
      }
    }

    const typeRatio = typedCount / propKeys.length;
    schemaScore += Math.round(typeRatio * 30);

    const descRatio = describedPropsCount / propKeys.length;
    schemaScore += Math.round(descRatio * 20);

    if (validRequired) schemaScore += 10;

    if (enumConstrainedCount > 0) {
      schemaScore += 10;
    }
  } else {
    // Parameterless tool
    schemaScore += 60;
  }

  // 2. Semantic Density Evaluation (0 - 100)
  let semanticScore = 0;
  if (desc.length > 0) {
    semanticScore = 35;
    if (desc.length >= 25 && desc.length <= 400) {
      semanticScore += 35;
    } else if (desc.length > 400) {
      semanticScore += 20;
    } else {
      semanticScore += 15;
    }

    let hasFluff = false;
    for (const pattern of FLUFF_PATTERNS) {
      if (pattern.test(desc)) {
        hasFluff = true;
        break;
      }
    }
    if (!hasFluff) {
      semanticScore += 30;
    }
  }

  // 3. Context Token Footprint Efficiency (0 - 100)
  let tokenScore = 0;
  if (tokenCount <= 80) {
    tokenScore = 100;
  } else if (tokenCount <= 160) {
    tokenScore = 85;
  } else if (tokenCount <= 300) {
    tokenScore = 70;
  } else if (tokenCount <= 600) {
    tokenScore = 50;
  } else {
    tokenScore = 30;
  }

  // 4. Security & Prompt-Injection Hygiene
  let securityPenalty = 0;
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.regex.test(desc)) {
      securityPenalty += pattern.penalty;
    }
    for (const key of propKeys) {
      const prop = properties[key];
      if (prop && typeof prop.description === 'string' && pattern.regex.test(prop.description)) {
        securityPenalty += pattern.penalty;
      }
    }
  }

  // Weighted Tool Quality Index (TQI)
  const rawScore = Math.round(
    schemaScore * 0.40 +
    semanticScore * 0.35 +
    tokenScore * 0.25
  );
  const overallScore = Math.max(0, rawScore - securityPenalty);

  return {
    toolName: tool.name,
    tokenCount,
    propertiesCount: propKeys.length,
    requiredCount: required.length,
    hasEnumConstraints: propKeys.some((k) => properties[k]?.enum),
    hasDescriptionsForParams: propKeys.every((k) => properties[k]?.description),
    metrics: {
      schemaStrictness: Math.min(100, Math.max(0, schemaScore)),
      semanticDensity: Math.min(100, Math.max(0, semanticScore)),
      tokenEfficiency: Math.min(100, Math.max(0, tokenScore)),
      overallScore: Math.min(100, Math.max(0, overallScore)),
    },
    findings: diagnostics.map(diagnostic => (
      diagnostic.severity === 'critical' || diagnostic.severity === 'high'
        ? `${diagnostic.severity.toUpperCase()}: ${diagnostic.message}`
        : diagnostic.message
    )),
    diagnostics,
  };
}

export function benchmarkServerTools(serverName: string, tools: McpToolDefinition[], options?: AnalysisOptions): ServerBenchmarkResult {
  if (tools.length === 0) {
    return {
      serverName,
      toolsAnalyzed: 0,
      totalTokens: 0,
      averageTokensPerTool: 0,
      averageSchemaStrictness: 0,
      averageSemanticDensity: 0,
      averageTokenEfficiency: 0,
      overallTQI: 0,
      grade: 'F',
      tools: [],
    };
  }

  const toolReports = tools.map(tool => analyzeToolDefinition(tool, options));
  const totalTokens = toolReports.reduce((acc, t) => acc + t.tokenCount, 0);
  const avgStrictness = Math.round(toolReports.reduce((acc, t) => acc + t.metrics.schemaStrictness, 0) / tools.length);
  const avgDensity = Math.round(toolReports.reduce((acc, t) => acc + t.metrics.semanticDensity, 0) / tools.length);
  const avgEfficiency = Math.round(toolReports.reduce((acc, t) => acc + t.metrics.tokenEfficiency, 0) / tools.length);
  const overallTQI = Math.round(toolReports.reduce((acc, t) => acc + t.metrics.overallScore, 0) / tools.length);

  let grade: ServerBenchmarkResult['grade'] = 'F';
  if (overallTQI >= 90) grade = 'A+';
  else if (overallTQI >= 80) grade = 'A';
  else if (overallTQI >= 70) grade = 'B';
  else if (overallTQI >= 60) grade = 'C';
  else if (overallTQI >= 50) grade = 'D';

  return {
    serverName,
    toolsAnalyzed: tools.length,
    totalTokens,
    averageTokensPerTool: Math.round(totalTokens / tools.length),
    averageSchemaStrictness: avgStrictness,
    averageSemanticDensity: avgDensity,
    averageTokenEfficiency: avgEfficiency,
    overallTQI,
    grade,
    tools: toolReports,
  };
}
