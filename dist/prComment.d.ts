import { CatalogComparison } from './compare.js';
import { ServerBenchmarkResult } from './types.js';
/**
 * Formats a clean, high-signal GitHub Pull Request comment markdown
 * comparing candidate changes against baseline.
 */
export declare function formatPrComment(comparison: CatalogComparison, candidateBenchmark: ServerBenchmarkResult, baselineBenchmark?: ServerBenchmarkResult): string;
