import { DiagnosticSeverity, ServerBenchmarkResult } from './types.js';

function severityToSarifLevel(severity: DiagnosticSeverity): 'error' | 'warning' | 'note' {
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

export function generateSarifReport(
  results: ServerBenchmarkResult[],
  sourceUri: string = 'mcp-tools.json'
): string {
  const rulesMap = new Map<string, { id: string; name: string; shortDescription: { text: string }; helpUri?: string }>();
  const sarifResults: Array<{
    ruleId: string;
    level: 'error' | 'warning' | 'note';
    message: { text: string };
    locations: Array<{
      physicalLocation: {
        artifactLocation: { uri: string };
      };
      logicalLocations?: Array<{
        name: string;
        kind: string;
      }>;
    }>;
  }> = [];

  for (const server of results) {
    for (const tool of server.tools) {
      if (!tool.diagnostics) continue;
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
