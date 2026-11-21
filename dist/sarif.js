function severityToSarifLevel(severity) {
    switch (severity) {
        case 'critical':
        case 'high':
            return 'error';
        case 'warning':
            return 'warning';
        case 'info':
        default:
            return 'note';
    }
}
export function generateSarifReport(results, sourceUri = 'mcp-tools.json') {
    const rulesMap = new Map();
    const sarifResults = [];
    for (const server of results) {
        for (const tool of server.tools) {
            if (!tool.diagnostics)
                continue;
            for (const diag of tool.diagnostics) {
                if (!rulesMap.has(diag.code)) {
                    rulesMap.set(diag.code, {
                        id: diag.code,
                        name: diag.code.replace(/[.-]/g, '_'),
                        shortDescription: { text: diag.message },
                    });
                }
                sarifResults.push({
                    ruleId: diag.code,
                    level: severityToSarifLevel(diag.severity),
                    message: {
                        text: `[${tool.toolName}] ${diag.message}. Suggestion: ${diag.suggestion}`,
                    },
                    locations: [
                        {
                            physicalLocation: {
                                artifactLocation: {
                                    uri: sourceUri,
                                },
                            },
                            logicalLocations: [
                                {
                                    name: `${server.serverName}/${tool.toolName}${diag.path ? ' ' + diag.path : ''}`,
                                    kind: 'function',
                                },
                            ],
                        },
                    ],
                });
            }
        }
    }
    const sarif = {
        $schema: 'https://json.schemastore.org/sarif-2.1.0.json',
        version: '2.1.0',
        runs: [
            {
                tool: {
                    driver: {
                        name: 'mcp-benchmark',
                        version: '1.2.0',
                        informationUri: 'https://github.com/yunusarda-sudo/mcp-benchmark',
                        rules: Array.from(rulesMap.values()),
                    },
                },
                results: sarifResults,
            },
        ],
    };
    return JSON.stringify(sarif, null, 2);
}
