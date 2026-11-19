import { AnalysisOptions, McpToolDefinition, ToolDiagnostic } from './types.js';
declare const FIELDS: readonly ["description", "inputSchema", "outputSchema"];
type ToolField = (typeof FIELDS)[number];
export interface CatalogDiagnostic extends ToolDiagnostic {
    toolName: string;
}
export type BreakingChange = {
    kind: 'tool-removed';
    toolName: string;
} | {
    kind: 'required-input-added';
    toolName: string;
    property: string;
};
export interface CatalogComparison {
    addedTools: string[];
    removedTools: string[];
    changedTools: {
        toolName: string;
        fields: ToolField[];
    }[];
    breakingChanges: BreakingChange[];
    newDiagnostics: CatalogDiagnostic[];
    resolvedDiagnostics: CatalogDiagnostic[];
}
export declare function compareToolCatalogs(baseline: McpToolDefinition[], candidate: McpToolDefinition[], options?: AnalysisOptions): CatalogComparison;
export {};
