const FLUFF_REPLACEMENTS = [
    { pattern: /^this tool allows (you )?to\s+/i, replacement: '' },
    { pattern: /^you can use this tool to\s+/i, replacement: '' },
    { pattern: /^a simple (utility|tool|helper) to\s+/i, replacement: '' },
    { pattern: /^used for (the )?purpose of\s+/i, replacement: '' },
    { pattern: /\bplease note that\s+/gi, replacement: '' },
    { pattern: /\bbasically\s+/gi, replacement: '' },
];
function capitalizeFirstLetter(str) {
    if (!str)
        return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
}
/**
 * Automatically cleans up common quality issues in an MCP tool definition:
 * - Ensures inputSchema has type: "object" and defined properties
 * - Removes non-existent properties from required
 * - Cleans up conversational fluff and filler phrases from descriptions
 */
export function fixToolDefinition(tool) {
    const changes = [];
    const fixed = JSON.parse(JSON.stringify(tool));
    const toolName = fixed.name || 'unnamed_tool';
    // 1. Fix inputSchema structure
    if (!fixed.inputSchema || typeof fixed.inputSchema !== 'object') {
        fixed.inputSchema = { type: 'object', properties: {} };
        changes.push({
            toolName,
            action: 'add-input-schema',
            detail: 'Created missing inputSchema with type: "object" and empty properties',
        });
    }
    else {
        if (fixed.inputSchema.type !== 'object') {
            fixed.inputSchema.type = 'object';
            changes.push({
                toolName,
                action: 'set-root-type',
                detail: 'Set inputSchema.type to "object"',
            });
        }
        if (!fixed.inputSchema.properties || typeof fixed.inputSchema.properties !== 'object') {
            fixed.inputSchema.properties = {};
            changes.push({
                toolName,
                action: 'add-properties',
                detail: 'Initialized missing inputSchema.properties object',
            });
        }
    }
    const props = fixed.inputSchema.properties ?? {};
    // 2. Fix empty enums and missing array items
    for (const [propName, propVal] of Object.entries(props)) {
        if (propVal && typeof propVal === 'object') {
            if (Array.isArray(propVal.enum) && propVal.enum.length === 0) {
                delete propVal.enum;
                changes.push({
                    toolName,
                    action: 'remove-empty-enum',
                    detail: `Removed empty enum array from property "${propName}"`,
                });
            }
            if (propVal.type === 'array' && !propVal.items) {
                propVal.items = { type: 'string' };
                changes.push({
                    toolName,
                    action: 'add-array-items',
                    detail: `Added default { type: "string" } items schema to array property "${propName}"`,
                });
            }
        }
    }
    // 3. Fix required fields
    if (Array.isArray(fixed.inputSchema.required)) {
        const rawRequired = fixed.inputSchema.required;
        const deduplicated = [...new Set(rawRequired)].filter(key => typeof key === 'string');
        const existingRequired = deduplicated.filter(key => Object.hasOwn(props, key));
        const removedKeys = deduplicated.filter(key => !Object.hasOwn(props, key));
        if (removedKeys.length > 0) {
            changes.push({
                toolName,
                action: 'prune-required',
                detail: `Removed non-existent required fields: ${removedKeys.join(', ')}`,
            });
        }
        if (deduplicated.length !== rawRequired.length) {
            changes.push({
                toolName,
                action: 'deduplicate-required',
                detail: 'Removed duplicate property names in inputSchema.required',
            });
        }
        if (existingRequired.length > 0) {
            fixed.inputSchema.required = existingRequired;
        }
        else {
            delete fixed.inputSchema.required;
        }
    }
    // 3. Fix description fluff
    if (fixed.description && typeof fixed.description === 'string') {
        let desc = fixed.description.trim();
        const originalDesc = desc;
        for (const { pattern, replacement } of FLUFF_REPLACEMENTS) {
            desc = desc.replace(pattern, replacement);
        }
        desc = capitalizeFirstLetter(desc.trim());
        if (desc !== originalDesc) {
            fixed.description = desc;
            changes.push({
                toolName,
                action: 'clean-fluff-description',
                detail: `Cleaned conversational fluff from description: "${originalDesc.slice(0, 40)}..." -> "${desc.slice(0, 40)}..."`,
            });
        }
    }
    return { fixedTool: fixed, changes };
}
/**
 * Fix an entire list of tool definitions and return the cleaned definitions and change log.
 */
export function fixToolCatalog(tools) {
    const fixedTools = [];
    const allChanges = [];
    for (const tool of tools) {
        const { fixedTool, changes } = fixToolDefinition(tool);
        fixedTools.push(fixedTool);
        allChanges.push(...changes);
    }
    return { tools: fixedTools, changes: allChanges };
}
