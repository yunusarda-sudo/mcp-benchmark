import { McpToolDefinition, ServerBenchmarkResult } from './types.js';
export interface RegistryServerEntry {
    $schema?: string;
    name: string;
    category: string;
    description?: string;
    repository?: string;
    maintainer?: string;
    tools: McpToolDefinition[];
}
export declare function loadRegistry(registryDir?: string): {
    servers: Record<string, McpToolDefinition[]>;
    metadata: Record<string, RegistryServerEntry>;
};
export declare function benchmarkRegistry(registryDir?: string): ServerBenchmarkResult[];
export declare function generateLeaderboardMarkdown(results: ServerBenchmarkResult[], metadata?: Record<string, RegistryServerEntry>): string;
export declare function updateReadmeLeaderboard(options?: {
    readmePath?: string;
    registryDir?: string;
}): {
    updated: boolean;
    count: number;
};
export declare function registerServer(entry: RegistryServerEntry, registryDir?: string): string;
