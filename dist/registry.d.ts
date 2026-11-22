import { McpToolDefinition, ServerBenchmarkResult } from './types.js';
/** Provenance of tools fetched live from a remote server listed in the MCP Registry. */
export interface RegistrySource {
    type: 'registry';
    registry: string;
    name: string;
    version: string;
    remoteUrl: string;
    fetchedAt: string;
    toolsSha256: string;
}
/** Provenance of a community entry submitted by hand (not verified against a live server). */
export interface ManualSource {
    type: 'manual';
    submittedAt: string;
}
export type EntrySource = RegistrySource | ManualSource;
export interface RegistryServerEntry {
    $schema?: string;
    name: string;
    title?: string;
    category: string;
    description?: string;
    repository?: string;
    maintainer?: string;
    tools: McpToolDefinition[];
    source: EntrySource;
}
/** registry/servers inside the installed package (independent of the working directory). */
export declare const PACKAGE_REGISTRY_DIR: string;
export declare function loadRegistry(registryDir?: string): {
    servers: Record<string, McpToolDefinition[]>;
    metadata: Record<string, RegistryServerEntry>;
};
export declare function benchmarkRegistry(registryDir?: string): ServerBenchmarkResult[];
/** Escapes untrusted text for a GitHub Markdown table cell (no HTML, links, or pipes). */
export declare function escapeMarkdownCell(value: string): string;
export declare function generateLeaderboardMarkdown(results: ServerBenchmarkResult[], metadata?: Record<string, RegistryServerEntry>): string;
export declare function updateReadmeLeaderboard(options?: {
    readmePath?: string;
    registryDir?: string;
}): {
    updated: boolean;
    count: number;
};
export declare function registerServer(entry: Omit<RegistryServerEntry, 'source'>, registryDir?: string): string;
