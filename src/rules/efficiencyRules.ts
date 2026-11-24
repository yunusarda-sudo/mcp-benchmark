import { RuleDefinition, RuleContext } from './types.js';
import { ToolDiagnostic } from '../types.js';
import { isLargeDefinition } from '../scoring.js';

export const contextFootprintRule: RuleDefinition = {
  id: 'efficiency.context-footprint',
  name: 'Context Token Footprint',
  category: 'efficiency',
  defaultSeverity: 'info',
  description: 'Flags tools whose definition exceeds 3x its schema-size token budget (80 + 40 per property) or 600 absolute context tokens.',
  suggestion: 'Review long descriptions and redundant schema metadata.',
  check(ctx: RuleContext): ToolDiagnostic[] {
    if (isLargeDefinition(ctx.tokenCount, ctx.propKeys.length)) {
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
