import { isDeepStrictEqual } from 'node:util';
import { analyzeToolDefinition } from './analyzer.js';
const FIELDS = ['description', 'inputSchema', 'outputSchema'];
function indexCatalog(tools, label) {
    const byName = new Map();
    for (const tool of tools) {
        if (byName.has(tool.name))
            throw new Error(`Duplicate tool name in ${label}: ${tool.name}`);
        byName.set(tool.name, tool);
    }
    return byName;
}
function diagnosticKey(diagnostic) {
    return JSON.stringify([diagnostic.code, diagnostic.path, diagnostic.severity]);
}
function normalizedValue(tool, field) {
    if (field !== 'inputSchema' || !tool.inputSchema)
        return tool[field];
    const { required, ...schema } = tool.inputSchema;
    if (!Array.isArray(required) && required !== undefined)
        return tool.inputSchema;
    return required?.length ? { ...schema, required: [...new Set(required)].sort() } : schema;
}
function requiredNames(tool) {
    const required = tool.inputSchema?.required;
    return Array.isArray(required) ? required.filter(name => typeof name === 'string') : [];
}
export function compareToolCatalogs(baseline, candidate, options) {
    const before = indexCatalog(baseline, 'baseline');
    const after = indexCatalog(candidate, 'candidate');
    const comparison = {
        addedTools: [],
        removedTools: [],
        changedTools: [],
        breakingChanges: [],
        newDiagnostics: [],
        resolvedDiagnostics: [],
    };
    for (const toolName of [...new Set([...before.keys(), ...after.keys()])].sort()) {
        const previous = before.get(toolName);
        const current = after.get(toolName);
        if (!previous)
            comparison.addedTools.push(toolName);
        if (!current) {
            comparison.removedTools.push(toolName);
            comparison.breakingChanges.push({ kind: 'tool-removed', toolName });
        }
        if (previous && current) {
            const fields = FIELDS.filter(field => !isDeepStrictEqual(normalizedValue(previous, field), normalizedValue(current, field)));
            if (fields.length)
                comparison.changedTools.push({ toolName, fields });
            const previousRequired = new Set(requiredNames(previous));
            for (const property of [...new Set(requiredNames(current))].sort()) {
                if (!previousRequired.has(property)) {
                    comparison.breakingChanges.push({ kind: 'required-input-added', toolName, property });
                }
            }
        }
        const oldFindings = previous ? analyzeToolDefinition(previous, options).diagnostics ?? [] : [];
        const newFindings = current ? analyzeToolDefinition(current, options).diagnostics ?? [] : [];
        const oldKeys = new Set(oldFindings.map(diagnosticKey));
        const newKeys = new Set(newFindings.map(diagnosticKey));
        comparison.newDiagnostics.push(...newFindings.filter(finding => !oldKeys.has(diagnosticKey(finding))).map(finding => ({ toolName, ...finding })));
        comparison.resolvedDiagnostics.push(...oldFindings.filter(finding => !newKeys.has(diagnosticKey(finding))).map(finding => ({ toolName, ...finding })));
    }
    return comparison;
}
