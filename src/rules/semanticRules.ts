import { RuleDefinition, RuleContext } from './types.js';
import { ToolDiagnostic } from '../types.js';

export const IMPERATIVE_ACTION_VERBS = new Set([
  'get', 'list', 'create', 'update', 'delete', 'read', 'write',
  'fetch', 'search', 'find', 'execute', 'run', 'send', 'query',
  'check', 'inspect', 'generate', 'transform', 'validate', 'resolve',
  'connect', 'publish', 'download', 'upload', 'remove', 'add',
]);

export const FLUFF_PATTERNS = [
  /this tool allows (you )?to/i,
  /used for (the )?purpose of/i,
  /a simple (utility|tool|helper) to/i,
  /please note that/i,
  /basically/i,
  /you can use this tool to/i,
];

export const emptyDescriptionRule: RuleDefinition = {
  id: 'description.empty',
  name: 'Require non-empty description',
  category: 'semantic',
  defaultSeverity: 'critical',
  description: 'Ensures tools have a non-empty description explaining what they do.',
  suggestion: 'State what the tool does and when it should be used.',
  check(ctx: RuleContext): ToolDiagnostic[] {
    if (ctx.desc.length === 0) {
      return [{
        code: 'description.empty',
        severity: 'critical',
        path: '/description',
        message: 'Tool description is empty',
        suggestion: 'State what the tool does and when it should be used.',
      }];
    }
    return [];
  },
};

export const descriptionLengthRule: RuleDefinition = {
  id: 'description.length',
  name: 'Optimal description length',
  category: 'semantic',
  defaultSeverity: 'info',
  description: 'Checks that description is sufficiently descriptive (>=25 chars) and concise (<=400 chars).',
  suggestion: 'Keep description between 25 and 400 characters for optimal model tool-selection.',
  check(ctx: RuleContext): ToolDiagnostic[] {
    if (ctx.desc.length === 0) return [];
    if (ctx.desc.length < 25) {
      return [{
        code: 'description.short',
        severity: 'info',
        path: '/description',
        message: 'Tool description is too brief (<25 chars) to guide accurate model selection',
        suggestion: 'Add context about when the tool should be selected.',
      }];
    }
    if (ctx.desc.length > 400) {
      return [{
        code: 'description.long',
        severity: 'info',
        path: '/description',
        message: 'Tool description is overly verbose (>400 chars), increasing token overhead',
        suggestion: 'Keep the purpose and key constraints, and remove repeated wording.',
      }];
    }
    return [];
  },
};

export const fillerPhraseRule: RuleDefinition = {
  id: 'description.filler',
  name: 'Disallow conversational filler',
  category: 'semantic',
  defaultSeverity: 'info',
  description: 'Flags conversational filler phrases that waste context tokens.',
  suggestion: 'Start with the action and omit conversational filler.',
  check(ctx: RuleContext): ToolDiagnostic[] {
    if (ctx.desc.length === 0) return [];
    for (const pattern of FLUFF_PATTERNS) {
      if (pattern.test(ctx.desc)) {
        return [{
          code: 'description.filler',
          severity: 'info',
          path: '/description',
          message: 'Description contains conversational filler phrases',
          suggestion: 'Start with the action and omit conversational filler.',
        }];
      }
    }
    return [];
  },
};

export const englishActionVerbRule: RuleDefinition = {
  id: 'description.english-action-verb',
  name: 'Lead with imperative action verb',
  category: 'semantic',
  defaultSeverity: 'info',
  description: 'Advisory check for descriptions in English to begin with an imperative action verb.',
  suggestion: 'Consider leading with a concrete verb such as List or Read.',
  check(ctx: RuleContext): ToolDiagnostic[] {
    if (!ctx.options?.englishStyle || ctx.desc.length === 0) return [];
    const firstWord = ctx.desc.split(/[\s,.:;]/)[0]?.toLowerCase();
    if (firstWord && !IMPERATIVE_ACTION_VERBS.has(firstWord)) {
      return [{
        code: 'description.english-action-verb',
        severity: 'info',
        path: '/description',
        message: 'English description does not start with a recognized action verb',
        suggestion: 'Consider leading with a concrete verb such as List or Read.',
      }];
    }
    return [];
  },
};

export const semanticRules = [
  emptyDescriptionRule,
  descriptionLengthRule,
  fillerPhraseRule,
  englishActionVerbRule,
];
