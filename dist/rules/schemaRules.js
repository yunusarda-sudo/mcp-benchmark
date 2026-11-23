export function hasValidPropertyType(prop) {
    if (!prop || typeof prop !== 'object')
        return false;
    if (prop.type && ['string', 'number', 'integer', 'boolean', 'array', 'object'].includes(prop.type)) {
        return true;
    }
    if (Array.isArray(prop.type) && prop.type.length > 0) {
        return prop.type.every((t) => ['string', 'number', 'integer', 'boolean', 'array', 'object', 'null'].includes(t));
    }
    if (Array.isArray(prop.oneOf) && prop.oneOf.length > 0) {
        return prop.oneOf.every(hasValidPropertyType);
    }
    if (Array.isArray(prop.anyOf) && prop.anyOf.length > 0) {
        return prop.anyOf.every(hasValidPropertyType);
    }
    return false;
}
export const rootTypeRule = {
    id: 'schema.root-type',
    name: 'Require root type "object"',
    category: 'schema',
    defaultSeverity: 'warning',
    description: 'Ensures tool inputSchema specifies type: "object".',
    suggestion: 'Declare an object schema when the tool accepts named arguments.',
    check(ctx) {
        const schema = ctx.tool.inputSchema || {};
        if (schema.type !== 'object') {
            return [{
                    code: 'schema.root-type',
                    severity: 'warning',
                    path: '/inputSchema/type',
                    message: 'inputSchema missing root type: "object"',
                    suggestion: 'Declare an object schema when the tool accepts named arguments.',
                }];
        }
        return [];
    },
};
export const requiredFieldsRule = {
    id: 'schema.required-fields',
    name: 'Valid required property array',
    category: 'schema',
    defaultSeverity: 'critical',
    description: 'Validates inputSchema.required is an array of strings and references declared properties.',
    suggestion: 'Describe the field in properties or review whether it belongs in required.',
    check(ctx) {
        const diagnostics = [];
        const schema = ctx.tool.inputSchema || {};
        if (!ctx.validRequired) {
            diagnostics.push({
                code: 'schema.invalid-required',
                severity: 'critical',
                path: '/inputSchema/required',
                message: 'inputSchema.required must be an array of strings',
                suggestion: 'List required property names as strings.',
            });
            return diagnostics;
        }
        for (const key of new Set(ctx.required)) {
            if (typeof key !== 'string' || Object.hasOwn(ctx.properties, key))
                continue;
            const closed = schema.additionalProperties === false && Object.keys(schema.patternProperties ?? {}).length === 0;
            const propertyPath = key.replace(/~/g, '~0').replace(/\//g, '~1');
            diagnostics.push({
                code: 'schema.required-without-property',
                severity: closed ? 'critical' : 'warning',
                path: `/inputSchema/properties/${propertyPath}`,
                message: `Required field "${key}" has no explicit property definition`,
                suggestion: 'Describe the field in properties or review whether it belongs in required.',
            });
        }
        return diagnostics;
    },
};
export const propertyDetailsRule = {
    id: 'schema.property-details',
    name: 'Detailed property checks',
    category: 'schema',
    defaultSeverity: 'warning',
    description: 'Validates parameter types, array items, enums, regex patterns, defaults, and nested schemas.',
    suggestion: 'Ensure complete and correct parameter specifications.',
    check(ctx) {
        const diagnostics = [];
        let typedCount = 0;
        let describedPropsCount = 0;
        for (const key of ctx.propKeys) {
            const prop = ctx.properties[key];
            const propertyPath = key.replace(/~/g, '~0').replace(/\//g, '~1');
            if (hasValidPropertyType(prop))
                typedCount++;
            if (prop && (prop.description || prop.title))
                describedPropsCount++;
            // Boolean required in property definition
            if (prop && typeof prop.required === 'boolean') {
                diagnostics.push({
                    code: 'schema.property-boolean-required',
                    severity: 'warning',
                    path: `/inputSchema/properties/${propertyPath}/required`,
                    message: `Property "${key}" defines boolean "required: ${prop.required}" instead of being listed in the parent object's "required" array`,
                    suggestion: prop.required
                        ? `Move "${key}" into inputSchema.required and remove "required: true" from the property.`
                        : `Remove "required: false" from the property (properties are optional by default).`,
                });
            }
            // Array without items
            if (prop && prop.type === 'array' && !prop.items) {
                diagnostics.push({
                    code: 'schema.array-without-items',
                    severity: 'warning',
                    path: `/inputSchema/properties/${propertyPath}/items`,
                    message: `Array parameter "${key}" lacks an "items" schema definition`,
                    suggestion: 'Specify the type or schema of array items using an "items" property.',
                });
            }
            // Empty enum
            if (prop && Array.isArray(prop.enum) && prop.enum.length === 0) {
                diagnostics.push({
                    code: 'schema.empty-enum',
                    severity: 'critical',
                    path: `/inputSchema/properties/${propertyPath}/enum`,
                    message: `Property "${key}" defines an empty enum array`,
                    suggestion: 'Provide allowed values for the enum or remove the empty enum constraint.',
                });
            }
            // Regex pattern validity
            if (prop && typeof prop.pattern === 'string') {
                try {
                    new RegExp(prop.pattern);
                }
                catch {
                    diagnostics.push({
                        code: 'schema.invalid-pattern',
                        severity: 'critical',
                        path: `/inputSchema/properties/${propertyPath}/pattern`,
                        message: `Property "${key}" defines an invalid regular expression pattern: "${prop.pattern}"`,
                        suggestion: 'Correct the regex syntax to avoid client runtime evaluation crashes.',
                    });
                }
            }
            // Default value matches type
            if (prop && prop.default !== undefined && typeof prop.type === 'string') {
                const defaultType = typeof prop.default;
                const expectedType = prop.type === 'integer' ? 'number' : prop.type;
                if (prop.type === 'array' && !Array.isArray(prop.default)) {
                    diagnostics.push({
                        code: 'schema.invalid-default',
                        severity: 'warning',
                        path: `/inputSchema/properties/${propertyPath}/default`,
                        message: `Default value for "${key}" is not an array`,
                        suggestion: 'Ensure default matches the declared array type.',
                    });
                }
                else if (prop.type !== 'array' && prop.type !== 'object' && defaultType !== expectedType) {
                    diagnostics.push({
                        code: 'schema.invalid-default',
                        severity: 'warning',
                        path: `/inputSchema/properties/${propertyPath}/default`,
                        message: `Default value type (${defaultType}) for "${key}" does not match declared schema type (${prop.type})`,
                        suggestion: 'Ensure default value matches the declared property type.',
                    });
                }
            }
            // Nested object inspection
            if (prop && prop.type === 'object' && prop.properties && typeof prop.properties === 'object') {
                const nestedKeys = Object.keys(prop.properties);
                for (const nKey of nestedKeys) {
                    const nestedProp = prop.properties[nKey];
                    const nestedPath = `${propertyPath}/properties/${nKey.replace(/~/g, '~0').replace(/\//g, '~1')}`;
                    if (!hasValidPropertyType(nestedProp)) {
                        diagnostics.push({
                            code: 'schema.nested-parameter-types',
                            severity: 'warning',
                            path: `/inputSchema/properties/${nestedPath}`,
                            message: `Nested property "${key}.${nKey}" lacks an explicit JSON primitive type`,
                            suggestion: 'Add an explicit type to the nested property.',
                        });
                    }
                    if (!nestedProp || (!nestedProp.description && !nestedProp.title)) {
                        diagnostics.push({
                            code: 'schema.nested-parameter-descriptions',
                            severity: 'info',
                            path: `/inputSchema/properties/${nestedPath}`,
                            message: `Nested property "${key}.${nKey}" lacks a description`,
                            suggestion: 'Explain the accepted values and constraints for this nested field.',
                        });
                    }
                }
            }
        }
        if (ctx.propKeys.length > 0) {
            const typeRatio = typedCount / ctx.propKeys.length;
            if (typeRatio < 1.0) {
                diagnostics.push({
                    code: 'schema.parameter-types',
                    severity: 'warning',
                    path: '/inputSchema/properties',
                    message: `${ctx.propKeys.length - typedCount} parameters lack explicit JSON primitive types`,
                    suggestion: 'Add types to parameters or document the schema composition when intentional.',
                });
            }
            const descRatio = describedPropsCount / ctx.propKeys.length;
            if (descRatio < 0.8) {
                diagnostics.push({
                    code: 'schema.parameter-descriptions',
                    severity: 'warning',
                    path: '/inputSchema/properties',
                    message: 'Multiple input parameters lack descriptions',
                    suggestion: 'Explain the accepted values and units for each parameter.',
                });
            }
        }
        return diagnostics;
    },
};
export const outputSchemaRule = {
    id: 'schema.output',
    name: 'Output schema validation',
    category: 'schema',
    defaultSeverity: 'warning',
    description: 'Ensures outputSchema is an object and specifies type: "object".',
    suggestion: 'Declare an object schema for structured tool outputs.',
    check(ctx) {
        const diagnostics = [];
        if (ctx.tool.outputSchema !== undefined) {
            if (typeof ctx.tool.outputSchema !== 'object' || ctx.tool.outputSchema === null) {
                diagnostics.push({
                    code: 'schema.output-invalid',
                    severity: 'critical',
                    path: '/outputSchema',
                    message: 'outputSchema must be an object',
                    suggestion: 'Provide a valid JSON schema object for outputSchema.',
                });
            }
            else {
                const outSchema = ctx.tool.outputSchema;
                if (outSchema.type && outSchema.type !== 'object') {
                    diagnostics.push({
                        code: 'schema.output-root-type',
                        severity: 'warning',
                        path: '/outputSchema/type',
                        message: 'outputSchema should specify type: "object"',
                        suggestion: 'Declare an object schema for structured tool outputs.',
                    });
                }
            }
        }
        return diagnostics;
    },
};
export const schemaRules = [
    rootTypeRule,
    requiredFieldsRule,
    propertyDetailsRule,
    outputSchemaRule,
];
