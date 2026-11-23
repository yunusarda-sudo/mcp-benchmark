export const PROMPT_INJECTION_PATTERNS = [
    {
        code: 'description.prompt-override',
        regex: /(ignore|override|bypass)\s+(all\s+)?((previous|prior|system|chat|base)\s+)*(instructions|prompts|rules|context)/i,
        severity: 'critical',
        title: 'Prompt injection / system prompt override directive detected in tool description',
        penalty: 45,
    },
    {
        code: 'description.possible-secret-disclosure',
        regex: /(exfiltrate|send|upload|post)\s+.*?(keys?|secrets?|tokens?|credentials?|passwords?|env)\s+.*?to/i,
        severity: 'critical',
        title: 'Potential data exfiltration directive detected in tool description',
        penalty: 45,
    },
    {
        code: 'description.hidden-action',
        regex: /do\s+not\s+(notify|tell|inform|warn)\s+(the\s+)?user/i,
        severity: 'high',
        title: 'Covert stealth directive (hiding actions from user) detected in tool description',
        penalty: 25,
    },
    {
        code: 'description.silent-execution',
        regex: /\bsilently\b|\bwithout\s+(notifying|asking|prompting)\b/i,
        severity: 'high',
        title: 'Silent execution directive detected in tool description',
        penalty: 25,
    },
];
export const promptInjectionRule = {
    id: 'security.prompt-hygiene',
    name: 'Security and Prompt Injection Hygiene',
    category: 'security',
    defaultSeverity: 'critical',
    description: 'Detects jailbreak attempts, prompt overrides, secret exfiltration, and stealth directives in tool and parameter descriptions.',
    suggestion: 'Review the description and keep only the intended tool contract.',
    check(ctx) {
        const diagnostics = [];
        for (const pattern of PROMPT_INJECTION_PATTERNS) {
            if (pattern.regex.test(ctx.desc)) {
                diagnostics.push({
                    code: pattern.code,
                    severity: pattern.severity,
                    path: '/description',
                    message: pattern.title,
                    suggestion: 'Review the description and keep only the intended tool contract.',
                });
            }
        }
        for (const key of ctx.propKeys) {
            const prop = ctx.properties[key];
            const propDesc = typeof prop?.description === 'string' ? prop.description : '';
            if (!propDesc)
                continue;
            const propertyPath = key.replace(/~/g, '~0').replace(/\//g, '~1');
            for (const pattern of PROMPT_INJECTION_PATTERNS) {
                if (pattern.regex.test(propDesc)) {
                    diagnostics.push({
                        code: pattern.code,
                        severity: pattern.severity,
                        path: `/inputSchema/properties/${propertyPath}/description`,
                        message: `${pattern.title} (in parameter "${key}")`,
                        suggestion: 'Review the parameter description and keep only the intended tool contract.',
                    });
                }
            }
        }
        return diagnostics;
    },
};
export const securityRules = [promptInjectionRule];
