import { McpConfigFile } from './types.js';
export interface DiscoveredConfig {
    source: string;
    path: string;
    serversCount: number;
    serverNames: string[];
    config: McpConfigFile;
}
export declare function findLocalMcpConfigs(cwd?: string): DiscoveredConfig[];
export declare function formatDiscoveryReport(configs: DiscoveredConfig[]): string;
