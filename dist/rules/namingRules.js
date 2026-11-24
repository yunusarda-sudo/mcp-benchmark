export const emptyNameRule = {
    id: 'tool.empty-name',
    name: 'Disallow empty tool names',
    category: 'naming',
    defaultSeverity: 'critical',
    description: 'Ensures tool name is non-empty.',
    suggestion: 'Provide a clear, descriptive name for the tool.',
    check(ctx) {
        const toolName = (ctx.tool.name || '').trim();
        if (!toolName) {
            return [{
                    code: 'tool.empty-name',
                    severity: 'critical',
                    path: '/name',
                    message: 'Tool name is empty',
                    suggestion: 'Provide a clear, descriptive name for the tool.',
                }];
        }
        return [];
    },
};
export const nameLengthRule = {
    id: 'tool.name-length',
    name: 'Tool name length limit',
    category: 'naming',
    defaultSeverity: 'warning',
    description: 'Checks that tool name does not exceed 64 characters for broad LLM provider compatibility.',
    suggestion: 'Keep tool names under 64 characters for broad LLM provider compatibility.',
    check(ctx) {
        const toolName = (ctx.tool.name || '').trim();
        if (toolName && toolName.length > 64) {
            return [{
                    code: 'tool.name-length',
                    severity: 'warning',
                    path: '/name',
                    message: `Tool name "${toolName}" exceeds 64 characters (${toolName.length} chars)`,
                    suggestion: 'Keep tool names under 64 characters for broad LLM provider compatibility.',
                }];
        }
        return [];
    },
};
export const nameFormatRule = {
    id: 'tool.invalid-name-format',
    name: 'Standard tool name format',
    category: 'naming',
    defaultSeverity: 'warning',
    description: 'Checks that tool name contains only alphanumeric characters, underscores, hyphens, and dots.',
    suggestion: 'Use alphanumeric characters, underscores, hyphens, and dots in tool names.',
    check(ctx) {
        const toolName = (ctx.tool.name || '').trim();
        if (toolName && !/^[a-zA-Z0-9_.-]+$/.test(toolName)) {
            return [{
                    code: 'tool.invalid-name-format',
                    severity: 'warning',
                    path: '/name',
                    message: `Tool name "${toolName}" contains special characters outside [a-zA-Z0-9_.-]`,
                    suggestion: 'Use alphanumeric characters, underscores, hyphens, and dots in tool names.',
                }];
        }
        return [];
    },
};
export const namingRules = [emptyNameRule, nameLengthRule, nameFormatRule];
