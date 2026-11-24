import type { ServerBenchmarkResult } from './types.js';
export type Grade = ServerBenchmarkResult['grade'];
/** Grade cut-offs, highest first. Single source of truth for CLI, badge and reports. */
export declare const GRADE_THRESHOLDS: ReadonlyArray<readonly [Grade, number]>;
export declare function gradeFromScore(score: number): Grade;
/** Absolute size that is always worth an info diagnostic regardless of schema richness. */
export declare const LARGE_DEFINITION_TOKENS = 600;
export declare const LARGE_DEFINITION_RATIO = 3;
/** Tokens a definition may use before efficiency drops: richer schemas get a larger budget. */
export declare function tokenBudget(propertyCount: number): number;
export declare function tokenRatio(tokenCount: number, propertyCount: number): number;
export declare function tokenEfficiencyScore(tokenCount: number, propertyCount: number): number;
export declare function isLargeDefinition(tokenCount: number, propertyCount: number): boolean;
