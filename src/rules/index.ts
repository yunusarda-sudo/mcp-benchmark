export * from './types.js';
export * from './namingRules.js';
export * from './schemaRules.js';
export * from './semanticRules.js';
export * from './securityRules.js';
export * from './efficiencyRules.js';

import { RuleDefinition } from './types.js';
import { namingRules } from './namingRules.js';
import { schemaRules } from './schemaRules.js';
import { semanticRules } from './semanticRules.js';
import { securityRules } from './securityRules.js';
import { efficiencyRules } from './efficiencyRules.js';

export const ALL_RULES: RuleDefinition[] = [
  ...namingRules,
  ...schemaRules,
  ...semanticRules,
  ...securityRules,
  ...efficiencyRules,
];

export function getAllRules(): RuleDefinition[] {
  return [...ALL_RULES];
}

export function getRuleById(id: string): RuleDefinition | undefined {
  return ALL_RULES.find(r => r.id === id);
}

export function getRulesByCategory(category: string): RuleDefinition[] {
  return ALL_RULES.filter(r => r.category === category);
}
