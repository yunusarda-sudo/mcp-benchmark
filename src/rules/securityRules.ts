import { RuleDefinition, RuleContext } from './types.js';
import { ToolDiagnostic } from '../types.js';

// Context that marks a phrase as something being described, detected or guarded
// against rather than directed at the model (scanners, filters, threat intel).
const DETECTION_CONTEXT = String.raw`(?:detect(?:s|ing|ion)?|catch(?:es|ing)?|flag(?:s|ging)?|scan(?:s|ning)?|block(?:s|ing)?|protect(?:s|ing)?\s+against|guard(?:s|ing)?\s+against|prevent(?:s|ing)?|identif(?:y|ies|ying)|look(?:s|ing)?\s+for|prompt[- ]injection|jailbreak|hijack)`;

// A leading negation turns a directive into a safety rule ("never send keys to ...").
const NEGATION_BEFORE = String.raw`(?<!\b(?:never|not|n['’]t|than|cannot|without)\s+(?:\w+\s+){0,2})`;

const SECRET_NOUN = String.raw`(?<![\w-])(?:secrets?|credentials?|passwords?|(?:(?:api|access|auth|private|ssh)[ _-]?)?(?:keys?|tokens?)|env(?:ironment)?(?:\s+(?:vars?|variables|secrets?))?|\.env)(?![\w-])`;
const SECRET_GAP = String.raw`[^\n.;()]{0,80}?`;
const EXTERNAL_DESTINATION = String.raw`(?:to|at|into|via)\s+(?:https?:\/\/|(?:an?\s+|the\s+|some\s+)?(?:external|remote|third[- ]party|attacker|unknown|untrusted|outside)\b|[\w-]+(?:\.[\w-]+)*\.(?:com|net|org|io|xyz|ru|cn|top|tk)\b)`;

const SECRET_DISCLOSURE_SOURCE = String.raw`${NEGATION_BEFORE}\b(?:(?:exfiltrate|leak|forward|transmit|email|upload|send|post|share|copy|steal|harvest)\b${SECRET_GAP}${SECRET_NOUN}${SECRET_GAP}\b${EXTERNAL_DESTINATION}|exfiltrate\b${SECRET_GAP}${SECRET_NOUN})`;

const SILENT_ADVERB = String.raw`(?:silently|quietly|secretly|covertly|stealthily)`;
// "quietly" is too common as a plain adverb to count after a distant verb.
const STEALTH_ADVERB = String.raw`(?:silently|secretly|covertly|stealthily)`;
const SILENT_EXECUTION_SOURCE = [
  String.raw`${NEGATION_BEFORE}\b${SILENT_ADVERB}\s+(?:execute|run|send|post|upload|delete|remove|call|invoke|exfiltrate|forward|transmit|install|download|write|modify|change|submit|email|copy|read|trigger|perform|apply)\b`,
  String.raw`${NEGATION_BEFORE}\b(?:send|upload|exfiltrate|forward|transmit|execute|install|delete)\b(?:[^\n.]|\.(?!\s)){0,60}\b${STEALTH_ADVERB}\b`,
  String.raw`\b(?:do|run|act|proceed|continue|execute)\s+(?:it\s+|this\s+|that\s+)?${SILENT_ADVERB}\b`,
  String.raw`\bwithout\s+(?:notifying|telling|informing|alerting|warning)\s+(?:the\s+|your\s+)?(?:user|human|owner)\b`,
  String.raw`\bwithout\s+(?:the\s+)?user(?:['’]s)?\s+(?:knowledge|consent|awareness)\b`,
].join('|');

const HIDDEN_ACTION_SOURCE = String.raw`\b(?:do\s+not|don['’]t|never)\s+(?:notify|tell|inform|warn|alert)\s+(?:the\s+|your\s+)?(?:user|human)\b(?=\s*(?:[.,;:!)]|$|\b(?:or|and)\b|\babout\s+(?:this|it|that|these|the\s+(?:action|call|request|change|data|operation|step|result))|\bthat\s+(?:you|this|the\s+(?:tool|action|call))\b))`;

export const PROMPT_INJECTION_PATTERNS = [
  {
    code: 'description.prompt-override',
    regex: new RegExp(
      String.raw`(?<!\b${DETECTION_CONTEXT}\b[^.\n]{0,40})\b(?:ignore|override|bypass)\s+(?:all\s+)?(?:(?:previous|prior|system|chat|base)\s+)*(?:instructions|prompts|rules|context)`,
      'i',
    ),
    severity: 'critical' as const,
    title: 'Prompt injection / system prompt override directive detected in tool description',
    penalty: 45,
  },
  {
    code: 'description.possible-secret-disclosure',
    regex: new RegExp(SECRET_DISCLOSURE_SOURCE, 'i'),
    severity: 'critical' as const,
    title: 'Potential data exfiltration directive detected in tool description',
    penalty: 45,
  },
  {
    code: 'description.hidden-action',
    regex: new RegExp(HIDDEN_ACTION_SOURCE, 'i'),
    severity: 'high' as const,
    title: 'Covert stealth directive (hiding actions from user) detected in tool description',
    penalty: 25,
  },
  {
    code: 'description.silent-execution',
    regex: new RegExp(SILENT_EXECUTION_SOURCE, 'i'),
    severity: 'high' as const,
    title: 'Silent execution directive detected in tool description',
    penalty: 25,
  },
];

export const promptInjectionRule: RuleDefinition = {
  id: 'security.prompt-hygiene',
  name: 'Security and Prompt Injection Hygiene',
  category: 'security',
  defaultSeverity: 'critical',
  description: 'Detects jailbreak attempts, prompt overrides, secret exfiltration, and stealth directives in tool and parameter descriptions.',
  suggestion: 'Review the description and keep only the intended tool contract.',
  check(ctx: RuleContext): ToolDiagnostic[] {
    const diagnostics: ToolDiagnostic[] = [];
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
      if (!propDesc) continue;
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
