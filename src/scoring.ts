import type { ServerBenchmarkResult } from './types.js';

export type Grade = ServerBenchmarkResult['grade'];

/** Grade cut-offs, highest first. Single source of truth for CLI, badge and reports. */
export const GRADE_THRESHOLDS: ReadonlyArray<readonly [Grade, number]> = [
  ['A+', 95],
  ['A', 88],
  ['B', 78],
  ['C', 65],
  ['D', 50],
];

export function gradeFromScore(score: number): Grade {
  for (const [grade, minimum] of GRADE_THRESHOLDS) {
    if (score >= minimum) return grade;
  }
  return 'F';
}

const BASE_TOKEN_BUDGET = 80;
const TOKENS_PER_PROPERTY = 40;
/** Absolute size that is always worth an info diagnostic regardless of schema richness. */
export const LARGE_DEFINITION_TOKENS = 600;
export const LARGE_DEFINITION_RATIO = 3;

/** Tokens a definition may use before efficiency drops: richer schemas get a larger budget. */
export function tokenBudget(propertyCount: number): number {
  return BASE_TOKEN_BUDGET + TOKENS_PER_PROPERTY * propertyCount;
}

export function tokenRatio(tokenCount: number, propertyCount: number): number {
  return tokenCount / tokenBudget(propertyCount);
}

export function tokenEfficiencyScore(tokenCount: number, propertyCount: number): number {
  const ratio = tokenRatio(tokenCount, propertyCount);
  if (ratio <= 1) return 100;
  if (ratio <= 1.5) return 85;
  if (ratio <= 2) return 70;
  if (ratio <= 3) return 50;
  return 30;
}

export function isLargeDefinition(tokenCount: number, propertyCount: number): boolean {
  return tokenRatio(tokenCount, propertyCount) > LARGE_DEFINITION_RATIO || tokenCount > LARGE_DEFINITION_TOKENS;
}
