import { McpToolDefinition, ToolCollision } from './types.js';

const JACCARD_THRESHOLD = 0.60;

const STOPWORDS = new Set([
  'a', 'an', 'the', 'to', 'of', 'for', 'and', 'or', 'with', 'from',
  'in', 'on', 'at', 'by', 'is', 'are', 'be', 'as', 'it', 'its',
  'this', 'that', 'these', 'those',
]);

const VERB_SYNONYM_GROUPS: ReadonlyArray<ReadonlySet<string>> = [
  new Set(['get', 'fetch', 'retrieve', 'read', 'find', 'lookup', 'query', 'search', 'list']),
  new Set(['create', 'add', 'make', 'insert', 'new', 'post', 'write']),
  new Set(['update', 'modify', 'edit', 'patch', 'set', 'change']),
  new Set(['delete', 'remove', 'destroy', 'drop', 'purge']),
  new Set(['execute', 'run', 'invoke', 'call', 'perform']),
];

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

// Deterministically split identifiers and prose into normalized tokens.
export function tokenize(text: string): string[] {
  if (!text) return [];
  return text
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .toLowerCase()
    .split(' ')
    .filter((token) => token.length > 0 && !STOPWORDS.has(token));
}

function jaccard(a: string[], b: string[]): number {
  const setA = new Set(a);
  const setB = new Set(b);
  if (setA.size === 0 && setB.size === 0) return 0;

  let intersection = 0;
  for (const token of setA) {
    if (setB.has(token)) intersection++;
  }
  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

interface Clash {
  score: number;
  reason: string;
}

function detectVerbNounClash(nameA: string, nameB: string): Clash | null {
  const segmentsA = tokenize(nameA);
  const segmentsB = tokenize(nameB);
  if (segmentsA.length === 0 || segmentsB.length === 0) return null;

  const verbA = segmentsA[0];
  const verbB = segmentsB[0];
  const nounA = segmentsA.slice(1).join('_');
  const nounB = segmentsB.slice(1).join('_');
  if (!nounA || !nounB || nounA !== nounB) return null;

  if (verbA === verbB) {
    return {
      score: 0.9,
      reason: `Redundant tool name: "${nameA}" and "${nameB}" share the verb "${verbA}" and resource "${nounA}"`,
    };
  }

  const groupA = VERB_SYNONYM_GROUPS.find((group) => group.has(verbA));
  const groupB = VERB_SYNONYM_GROUPS.find((group) => group.has(verbB));
  if (groupA && groupA === groupB) {
    return {
      score: 0.85,
      reason: `Conflicting name semantics: "${verbA}" and "${verbB}" are synonym verbs acting on the same resource "${nounA}"`,
    };
  }

  return null;
}

function compareTools(a: McpToolDefinition, b: McpToolDefinition): Clash | null {
  if (a.name === b.name) {
    return { score: 1, reason: `Exact tool name conflict: both tools are named "${a.name}"` };
  }

  const similarity = jaccard(
    tokenize(`${a.name} ${a.description ?? ''}`),
    tokenize(`${b.name} ${b.description ?? ''}`)
  );
  if (similarity > JACCARD_THRESHOLD) {
    return {
      score: round2(similarity),
      reason: `High lexical overlap (Jaccard ${round2(similarity)}) between tool names/descriptions`,
    };
  }

  return detectVerbNounClash(a.name, b.name);
}

export function detectToolCollisions(tools: McpToolDefinition[]): ToolCollision[] {
  const collisions: ToolCollision[] = [];

  for (let i = 0; i < tools.length; i++) {
    for (let j = i + 1; j < tools.length; j++) {
      const clash = compareTools(tools[i], tools[j]);
      if (clash) {
        collisions.push({
          toolA: tools[i].name,
          toolB: tools[j].name,
          similarityScore: clash.score,
          reason: clash.reason,
        });
      }
    }
  }

  collisions.sort((x, y) => {
    if (y.similarityScore !== x.similarityScore) return y.similarityScore - x.similarityScore;
    if (x.toolA !== y.toolA) return x.toolA < y.toolA ? -1 : 1;
    if (x.toolB !== y.toolB) return x.toolB < y.toolB ? -1 : 1;
    return 0;
  });

  return collisions;
}
