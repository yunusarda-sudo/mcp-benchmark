const FLUFF_REPLACEMENTS = [
    { pattern: /^this tool allows (you )?to\s+/i, replacement: '' },
    { pattern: /^you can use this tool to\s+/i, replacement: '' },
    { pattern: /^a simple (utility|tool|helper) to\s+/i, replacement: '' },
    { pattern: /^used for (the )?purpose of\s+/i, replacement: '' },
    { pattern: /\bplease note that\s+/gi, replacement: '' },
    { pattern: /\bbasically\s+/gi, replacement: '' },
];
function jsonTypeOf(value) {
    if (value === null)
        return 'null';
    if (Array.isArray(value))
        return 'array';
    if (typeof value === 'number')
        return Number.isInteger(value) ? 'integer' : 'number';
    if (typeof value === 'boolean')
        return 'boolean';
    if (typeof value === 'object')
        return 'object';
    return 'string';
}
/** Infers the JSON Schema type(s) described by enum values; one type, or a list when mixed. */
export function inferTypeFromEnum(values) {
    const types = new Set(values.map(jsonTypeOf));
    if (types.has('integer') && types.has('number'))
        types.delete('integer');
    const list = [...types];
    return list.length === 1 ? list[0] : list;
}
function hasCompositionType(prop) {
    return (Array.isArray(prop.oneOf) && prop.oneOf.length > 0) || (Array.isArray(prop.anyOf) && prop.anyOf.length > 0);
}
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
    // 2. Fix empty enums, missing array items, and boolean required properties
    for (const [propName, propVal] of Object.entries(props)) {
        if (propVal && typeof propVal === 'object') {
            if (typeof propVal.required === 'boolean') {
                const isReq = propVal.required;
                delete propVal.required;
                if (isReq) {
                    if (!Array.isArray(fixed.inputSchema.required)) {
                        fixed.inputSchema.required = [];
                    }
                    if (!fixed.inputSchema.required.includes(propName)) {
                        fixed.inputSchema.required.push(propName);
                    }
                    changes.push({
                        toolName,
                        action: 'migrate-boolean-required',
                        detail: `Migrated invalid boolean "required: true" on property "${propName}" to inputSchema.required array`,
                    });
                }
                else {
                    changes.push({
                        toolName,
                        action: 'remove-boolean-required',
                        detail: `Removed invalid boolean "required: false" from property "${propName}"`,
                    });
                }
            }
            let removedEmptyEnum = false;
            if (Array.isArray(propVal.enum) && propVal.enum.length === 0) {
                delete propVal.enum;
                removedEmptyEnum = true;
                changes.push({
                    toolName,
                    action: 'remove-empty-enum',
                    detail: `Removed empty enum array from property "${propName}"`,
                });
            }
            if (propVal.type === undefined && !hasCompositionType(propVal)) {
                if (Array.isArray(propVal.enum) && propVal.enum.length > 0) {
                    propVal.type = inferTypeFromEnum(propVal.enum);
                    changes.push({
                        toolName,
                        action: 'infer-type-from-enum',
                        detail: `Inferred type ${JSON.stringify(propVal.type)} for property "${propName}" from its enum values`,
                    });
                }
                else if (removedEmptyEnum) {
                    propVal.type = 'string';
                    changes.push({
                        toolName,
                        action: 'default-type-string',
                        detail: `Set type "string" on property "${propName}" after removing its empty enum`,
                    });
                }
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
        // A closed schema (additionalProperties: false) cannot be satisfied without the property, so
        // pruning would hide a real contract bug; only open schemas get their dangling names removed.
        const closed = fixed.inputSchema.additionalProperties === false;
        const isPrunable = (key) => !Object.hasOwn(props, key) && !closed;
        const existingRequired = deduplicated.filter(key => !isPrunable(key));
        const removedKeys = deduplicated.filter(isPrunable);
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
