export const contextFootprintRule = {
    id: 'efficiency.context-footprint',
    name: 'Context Token Footprint',
    category: 'efficiency',
    defaultSeverity: 'info',
    description: 'Flags tools whose raw definition consumes more than 600 context tokens.',
    suggestion: 'Review long descriptions and redundant schema metadata.',
    check(ctx) {
        if (ctx.tokenCount > 600) {
            return [{
                    code: 'catalog.large-definition',
                    severity: 'info',
                    path: '',
                    message: `Heavy context token footprint (${ctx.tokenCount} tokens)`,
                    suggestion: 'Review long descriptions and redundant schema metadata.',
                }];
        }
        return [];
    },
};
export const efficiencyRules = [contextFootprintRule];
