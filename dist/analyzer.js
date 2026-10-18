import { detectToolCollisions } from './collisionDetector.js';
const IMPERATIVE_ACTION_VERBS = new Set([
    'get', 'list', 'create', 'update', 'delete', 'read', 'write',
    'fetch', 'search', 'find', 'execute', 'run', 'send', 'query',
    'check', 'inspect', 'generate', 'transform', 'validate', 'resolve',
    'connect', 'publish', 'download', 'upload', 'remove', 'add',
]);
const FLUFF_PATTERNS = [
    /this tool allows (you )?to/i,
    /used for (the )?purpose of/i,
    /a simple (utility|tool|helper) to/i,
    /please note that/i,
    /basically/i,
    /you can use this tool to/i,
];
export function estimateTokenCount(text) {
    if (!text)
        return 0;
    // Standard heuristic: ~4 characters per token for English text/JSON
    return Math.ceil(text.length / 4);
}
export function analyzeToolDefinition(tool) {
    const findings = [];
    const schema = tool.inputSchema || {};
    const properties = schema.properties || {};
    const propKeys = Object.keys(properties);
    const required = schema.required || [];
    const rawJson = JSON.stringify(tool);
    const tokenCount = estimateTokenCount(rawJson);
    // 1. Schema Strictness Evaluation (0 - 100)
    let schemaScore = 0;
    if (schema.type === 'object') {
        schemaScore += 20;
    }
    else {
        findings.push('inputSchema missing root type: "object"');
    }
    if (propKeys.length > 0) {
        schemaScore += 10;
        // Check property typing
        let typedCount = 0;
        let describedPropsCount = 0;
        let enumConstrainedCount = 0;
        for (const key of propKeys) {
            const prop = properties[key];
            if (prop && prop.type && ['string', 'number', 'integer', 'boolean', 'array', 'object'].includes(prop.type)) {
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
        if (typeRatio < 1.0) {
            findings.push(`${propKeys.length - typedCount} parameters lack explicit JSON primitive types`);
        }
        const descRatio = describedPropsCount / propKeys.length;
        schemaScore += Math.round(descRatio * 20);
        if (descRatio < 0.8) {
            findings.push('Multiple input parameters lack descriptions');
        }
        if (Array.isArray(required)) {
            schemaScore += 10;
        }
        else {
            findings.push('inputSchema is missing required array');
        }
        if (enumConstrainedCount > 0) {
            schemaScore += 10;
        }
    }
    else {
        // Parameterless tool
        schemaScore += 60;
    }
    // 2. Semantic Density Evaluation (0 - 100)
    let semanticScore = 0;
    const desc = (tool.description || '').trim();
    if (desc.length === 0) {
        findings.push('CRITICAL: Tool description is empty');
    }
    else {
        // Length adequacy (ideal: 25 - 350 chars)
        if (desc.length >= 25 && desc.length <= 400) {
            semanticScore += 35;
        }
        else if (desc.length > 400) {
            semanticScore += 20;
            findings.push('Tool description is overly verbose (>400 chars), increasing token overhead');
        }
        else {
            semanticScore += 15;
            findings.push('Tool description is too brief (<25 chars) to guide accurate model selection');
        }
        // Imperative verb check
        const firstWord = desc.split(/[\s,.:;]/)[0]?.toLowerCase();
        if (firstWord && IMPERATIVE_ACTION_VERBS.has(firstWord)) {
            semanticScore += 35;
        }
        else {
            semanticScore += 15;
            findings.push(`Description does not start with an imperative action verb (starts with "${firstWord}")`);
        }
        // Fluff penalty
        let hasFluff = false;
        for (const pattern of FLUFF_PATTERNS) {
            if (pattern.test(desc)) {
                hasFluff = true;
                findings.push('Description contains conversational filler phrases');
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
    }
    else if (tokenCount <= 160) {
        tokenScore = 85;
    }
    else if (tokenCount <= 300) {
        tokenScore = 70;
    }
    else if (tokenCount <= 600) {
        tokenScore = 50;
    }
    else {
        tokenScore = 30;
        findings.push(`Heavy context token footprint (${tokenCount} tokens)`);
    }
    // Weighted Tool Quality Index (TQI)
    const overallScore = Math.round(schemaScore * 0.40 +
        semanticScore * 0.35 +
        tokenScore * 0.25);
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
        findings,
    };
}
export function benchmarkServerTools(serverName, tools) {
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
            collisions: [],
        };
    }
    const toolReports = tools.map(analyzeToolDefinition);
    const totalTokens = toolReports.reduce((acc, t) => acc + t.tokenCount, 0);
    const avgStrictness = Math.round(toolReports.reduce((acc, t) => acc + t.metrics.schemaStrictness, 0) / tools.length);
    const avgDensity = Math.round(toolReports.reduce((acc, t) => acc + t.metrics.semanticDensity, 0) / tools.length);
    const avgEfficiency = Math.round(toolReports.reduce((acc, t) => acc + t.metrics.tokenEfficiency, 0) / tools.length);
    const overallTQI = Math.round(toolReports.reduce((acc, t) => acc + t.metrics.overallScore, 0) / tools.length);
    let grade = 'F';
    if (overallTQI >= 90)
        grade = 'A+';
    else if (overallTQI >= 80)
        grade = 'A';
    else if (overallTQI >= 70)
        grade = 'B';
    else if (overallTQI >= 60)
        grade = 'C';
    else if (overallTQI >= 50)
        grade = 'D';
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
        collisions: detectToolCollisions(tools),
    };
}
