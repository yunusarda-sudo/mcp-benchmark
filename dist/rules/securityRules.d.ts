import { RuleDefinition } from './types.js';
export declare const PROMPT_INJECTION_PATTERNS: ({
    code: string;
    regex: RegExp;
    severity: "critical";
    title: string;
    penalty: number;
} | {
    code: string;
    regex: RegExp;
    severity: "high";
    title: string;
    penalty: number;
})[];
export declare const promptInjectionRule: RuleDefinition;
export declare const securityRules: RuleDefinition[];
