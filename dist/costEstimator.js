/**
 * Calculates the context token overhead and financial impact of injecting
 * this tool catalog across multi-turn agent conversations.
 */
export function estimateTokenEconomics(totalTokens, toolCount, sessionCount = 1000, turnsPerSession = 15) {
    const avg = toolCount > 0 ? Math.round(totalTokens / toolCount) : 0;
    const tokensPerSession = totalTokens * turnsPerSession;
    const tokensTotal = tokensPerSession * sessionCount;
    // Costs per 1,000,000 tokens
    const costSonnet = (tokensTotal / 1_000_000) * 3.0;
    const costGpt4o = (tokensTotal / 1_000_000) * 2.5;
    const costGeminiPro = (tokensTotal / 1_000_000) * 2.0;
    return {
        totalTokens,
        averageTokensPerTool: avg,
        tokensPerTurn: totalTokens,
        tokensPer10TurnSession: tokensPerSession,
        tokensPer1000Sessions: tokensTotal,
        monthlyCostEstimates: {
            claudeSonnet: Number(costSonnet.toFixed(2)),
            gpt4o: Number(costGpt4o.toFixed(2)),
            geminiPro: Number(costGeminiPro.toFixed(2)),
        },
    };
}
export function formatTokenEconomicsMarkdown(report) {
    let md = '### 💰 Context Window Token Economics\n\n';
    md += `* **Catalog Size:** ${report.totalTokens} tokens per model turn (~${report.averageTokensPerTool} tok/tool)\n`;
    md += `* **15-Turn Agent Session:** ${report.tokensPer10TurnSession.toLocaleString()} tokens consumed by tool schemas alone\n`;
    md += `* **At 1,000 sessions/month:** ${report.tokensPer1000Sessions.toLocaleString()} tokens injected into LLM context\n\n`;
    md += '| LLM Provider | Estimated Schema Cost / 1k Sessions |\n';
    md += '|:---|:---:|\n';
    md += `| **Anthropic Claude 3.5 Sonnet** ($3/M) | $${report.monthlyCostEstimates.claudeSonnet.toFixed(2)} |\n`;
    md += `| **OpenAI GPT-4o** ($2.50/M) | $${report.monthlyCostEstimates.gpt4o.toFixed(2)} |\n`;
    md += `| **Google Gemini 1.5 Pro** ($2/M) | $${report.monthlyCostEstimates.geminiPro.toFixed(2)} |\n`;
    return md;
}
