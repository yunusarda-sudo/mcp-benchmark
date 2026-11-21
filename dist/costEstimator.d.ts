export interface TokenEconomicsReport {
    totalTokens: number;
    averageTokensPerTool: number;
    tokensPerTurn: number;
    tokensPer10TurnSession: number;
    tokensPer1000Sessions: number;
    monthlyCostEstimates: {
        claudeSonnet: number;
        gpt4o: number;
        geminiPro: number;
    };
}
/**
 * Calculates the context token overhead and financial impact of injecting
 * this tool catalog across multi-turn agent conversations.
 */
export declare function estimateTokenEconomics(totalTokens: number, toolCount: number, sessionCount?: number, turnsPerSession?: number): TokenEconomicsReport;
export declare function formatTokenEconomicsMarkdown(report: TokenEconomicsReport): string;
