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
export const PROMPT_INJECTION_PATTERNS = [
    {
        code: 'description.prompt-override',
        regex: /(ignore|override|bypass)\s+(all\s+)?((previous|prior|system|chat|base)\s+)*(instructions|prompts|rules|context)/i,
        severity: 'CRITICAL',
        title: 'Prompt injection / system prompt override directive detected in tool description',
    },
    {
        code: 'description.possible-secret-disclosure',
        regex: /(exfiltrate|send|upload|post)\s+.*?(keys?|secrets?|tokens?|credentials?|passwords?|env)\s+.*?to/i,
        severity: 'CRITICAL',
        title: 'Potential data exfiltration directive detected in tool description',
    },
    {
        code: 'description.hidden-action',
        regex: /do\s+not\s+(notify|tell|inform|warn)\s+(the\s+)?user/i,
        severity: 'HIGH',
        title: 'Covert stealth directive (hiding actions from user) detected in tool description',
    },
    {
        code: 'description.silent-execution',
        regex: /\bsilently\b|\bwithout\s+(notifying|asking|prompting)\b/i,
        severity: 'HIGH',
        title: 'Silent execution directive detected in tool description',
    },
];
export function estimateTokenCount(text) {
    if (!text)
        return 0;
    // Standard heuristic: ~4 characters per token for English text/JSON
    return Math.ceil(text.length / 4);
}
export function analyzeToolDefinition(tool, options = {}) {
    const diagnostics = [];
    const report = (code, severity, path, message, suggestion) => diagnostics.push({ code, severity, path, message, suggestion });
    // Tool name validation
    const toolName = (tool.name || '').trim();
    if (!toolName) {
        report('tool.empty-name', 'critical', '/name', 'Tool name is empty', 'Provide a clear, descriptive name for the tool.');
    }
    else {
        if (toolName.length > 64) {
            report('tool.name-length', 'warning', '/name', `Tool name "${toolName}" exceeds 64 characters (${toolName.length} chars)`, 'Keep tool names under 64 characters for broad LLM provider compatibility.');
        }
        if (!/^[a-zA-Z0-9_.-]+$/.test(toolName)) {
            report('tool.invalid-name-format', 'warning', '/name', `Tool name "${toolName}" contains special characters outside [a-zA-Z0-9_.-]`, 'Use alphanumeric characters, underscores, and hyphens in tool names.');
        }
    }
    const schema = tool.inputSchema || {};
    const properties = schema.properties || {};
    const propKeys = Object.keys(properties);
    const required = Array.isArray(schema.required) ? schema.required : [];
    const validRequired = schema.required === undefined
        || (Array.isArray(schema.required) && schema.required.every(key => typeof key === 'string'));
    if (!validRequired) {
        report('schema.invalid-required', 'critical', '/inputSchema/required', 'inputSchema.required must be an array of strings', 'List required property names as strings.');
    }
    for (const key of new Set(required)) {
        if (typeof key !== 'string' || Object.hasOwn(properties, key))
            continue;
        const closed = schema.additionalProperties === false && Object.keys(schema.patternProperties ?? {}).length === 0;
        const propertyPath = key.replace(/~/g, '~0').replace(/\//g, '~1');
        report('schema.required-without-property', closed ? 'critical' : 'warning', `/inputSchema/properties/${propertyPath}`, `Required field "${key}" has no explicit property definition`, 'Describe the field in properties or review whether it belongs in required.');
    }
    // Deep inspection for array items and nested object properties
    for (const key of propKeys) {
        const prop = properties[key];
        const propertyPath = key.replace(/~/g, '~0').replace(/\//g, '~1');
        if (prop && prop.type === 'array' && !prop.items) {
            report('schema.array-without-items', 'warning', `/inputSchema/properties/${propertyPath}/items`, `Array parameter "${key}" lacks an "items" schema definition`, 'Specify the type or schema of array items using an "items" property.');
        }
        if (prop && prop.type === 'object' && prop.properties && typeof prop.properties === 'object') {
            const nestedKeys = Object.keys(prop.properties);
            for (const nKey of nestedKeys) {
                const nestedProp = prop.properties[nKey];
                const nestedPath = `${propertyPath}/properties/${nKey.replace(/~/g, '~0').replace(/\//g, '~1')}`;
                if (!nestedProp || !nestedProp.type) {
                    report('schema.nested-parameter-types', 'warning', `/inputSchema/properties/${nestedPath}`, `Nested property "${key}.${nKey}" lacks an explicit JSON primitive type`, 'Add an explicit type to the nested property.');
                }
                if (!nestedProp || (!nestedProp.description && !nestedProp.title)) {
                    report('schema.nested-parameter-descriptions', 'info', `/inputSchema/properties/${nestedPath}`, `Nested property "${key}.${nKey}" lacks a description`, 'Explain the accepted values and constraints for this nested field.');
                }
            }
        }
    }
    // Output schema validation
    if (tool.outputSchema !== undefined) {
        if (typeof tool.outputSchema !== 'object' || tool.outputSchema === null) {
            report('schema.output-invalid', 'critical', '/outputSchema', 'outputSchema must be an object', 'Provide a valid JSON schema object for outputSchema.');
        }
        else {
            const outSchema = tool.outputSchema;
            if (outSchema.type && outSchema.type !== 'object') {
                report('schema.output-root-type', 'warning', '/outputSchema/type', 'outputSchema should specify type: "object"', 'Declare an object schema for structured tool outputs.');
            }
        }
    }
    const rawJson = JSON.stringify(tool);
    const tokenCount = estimateTokenCount(rawJson);
    // 1. Schema Strictness Evaluation (0 - 100)
    let schemaScore = 0;
    if (schema.type === 'object') {
        schemaScore += 20;
    }
    else {
        report('schema.root-type', 'warning', '/inputSchema/type', 'inputSchema missing root type: "object"', 'Declare an object schema when the tool accepts named arguments.');
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
            report('schema.parameter-types', 'warning', '/inputSchema/properties', `${propKeys.length - typedCount} parameters lack explicit JSON primitive types`, 'Add types to parameters or document the schema composition when intentional.');
        }
        const descRatio = describedPropsCount / propKeys.length;
        schemaScore += Math.round(descRatio * 20);
        if (descRatio < 0.8) {
            report('schema.parameter-descriptions', 'warning', '/inputSchema/properties', 'Multiple input parameters lack descriptions', 'Explain the accepted values and units for each parameter.');
        }
        if (validRequired)
            schemaScore += 10;
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
        report('description.empty', 'critical', '/description', 'Tool description is empty', 'State what the tool does and when it should be used.');
    }
    else {
        semanticScore = 35;
        // Length adequacy (ideal: 25–400 characters)
        if (desc.length >= 25 && desc.length <= 400) {
            semanticScore += 35;
        }
        else if (desc.length > 400) {
            semanticScore += 20;
            report('description.long', 'info', '/description', 'Tool description is overly verbose (>400 chars), increasing token overhead', 'Keep the purpose and key constraints, and remove repeated wording.');
        }
        else {
            semanticScore += 15;
            report('description.short', 'info', '/description', 'Tool description is too brief (<25 chars) to guide accurate model selection', 'Add context about when the tool should be selected.');
        }
        const firstWord = desc.split(/[\s,.:;]/)[0]?.toLowerCase();
        if (options.englishStyle && firstWord && !IMPERATIVE_ACTION_VERBS.has(firstWord)) {
            report('description.english-action-verb', 'info', '/description', 'English description does not start with a recognized action verb', 'Consider leading with a concrete verb such as List or Read.');
        }
        // Fluff penalty
        let hasFluff = false;
        for (const pattern of FLUFF_PATTERNS) {
            if (pattern.test(desc)) {
                hasFluff = true;
                report('description.filler', 'info', '/description', 'Description contains conversational filler phrases', 'Start with the action and omit conversational filler.');
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
        report('catalog.large-definition', 'info', '', `Heavy context token footprint (${tokenCount} tokens)`, 'Review long descriptions and redundant schema metadata.');
    }
    // 4. Security & Prompt-Injection Hygiene
    let securityPenalty = 0;
    for (const pattern of PROMPT_INJECTION_PATTERNS) {
        if (pattern.regex.test(desc)) {
            report(pattern.code, pattern.severity === 'CRITICAL' ? 'critical' : 'high', '/description', pattern.title, 'Review the description and keep only the intended tool contract.');
            securityPenalty += pattern.severity === 'CRITICAL' ? 45 : 25;
        }
    }
    // Weighted Tool Quality Index (TQI)
    const rawScore = Math.round(schemaScore * 0.40 +
        semanticScore * 0.35 +
        tokenScore * 0.25);
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
        findings: diagnostics.map(diagnostic => (diagnostic.severity === 'critical' || diagnostic.severity === 'high'
            ? `${diagnostic.severity.toUpperCase()}: ${diagnostic.message}`
            : diagnostic.message)),
        diagnostics,
    };
}
export function benchmarkServerTools(serverName, tools, options) {
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
    };
}
