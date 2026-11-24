import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeToolDefinition, fixToolDefinition } from '../dist/index.js';

function tool(inputSchema) {
  return { name: 'weather_lookup', description: 'Look up current weather conditions for a city.', inputSchema };
}

test('prunes required names without a property on an open schema and records the change', () => {
  const { fixedTool, changes } = fixToolDefinition(tool({
    type: 'object',
    properties: { city: { type: 'string', description: 'City.' } },
    required: ['city', 'country'],
  }));
  assert.deepEqual(fixedTool.inputSchema.required, ['city']);
  assert.ok(changes.some((c) => c.action === 'prune-required' && c.detail.includes('country')));
});

test('keeps undefined required names when additionalProperties is false', () => {
  const { fixedTool, changes } = fixToolDefinition(tool({
    type: 'object',
    properties: { city: { type: 'string', description: 'City.' } },
    required: ['city', 'country'],
    additionalProperties: false,
  }));
  assert.deepEqual(fixedTool.inputSchema.required, ['city', 'country']);
  assert.ok(!changes.some((c) => c.action === 'prune-required'));
});

test('infers property type from non-empty enum values', () => {
  const { fixedTool, changes } = fixToolDefinition(tool({
    type: 'object',
    properties: {
      unit: { enum: ['c', 'f'] },
      level: { enum: [1, 2, 3] },
      ratio: { enum: [0.5, 1] },
      flag: { enum: [true, false] },
      mixed: { enum: ['a', 1] },
    },
  }));
  const props = fixedTool.inputSchema.properties;
  assert.equal(props.unit.type, 'string');
  assert.equal(props.level.type, 'integer');
  assert.equal(props.ratio.type, 'number');
  assert.equal(props.flag.type, 'boolean');
  assert.deepEqual(props.mixed.type, ['string', 'integer']);
  assert.equal(changes.filter((c) => c.action === 'infer-type-from-enum').length, 5);
});

test('sets type string after removing an empty enum from an untyped property', () => {
  const { fixedTool } = fixToolDefinition(tool({ type: 'object', properties: { units: { enum: [] } } }));
  assert.deepEqual(fixedTool.inputSchema.properties.units, { type: 'string' });
});

test('leaves untyped properties without enum, and composed properties, untouched without crashing', () => {
  const input = tool({
    type: 'object',
    properties: {
      city: { description: 'City name' },
      either: { oneOf: [{ type: 'string' }, { type: 'number' }], enum: [] },
      nothing: null,
    },
  });
  const { fixedTool } = fixToolDefinition(input);
  assert.deepEqual(fixedTool.inputSchema.properties.city, { description: 'City name' });
  assert.equal(fixedTool.inputSchema.properties.either.type, undefined);
  assert.equal(fixedTool.inputSchema.properties.nothing, null);
});

test('fixing the sample_fluffy shape clears the targeted schema diagnostics', () => {
  const fluffy = {
    name: 'weather-lookup',
    description: 'This tool allows you to check current weather conditions for any city.',
    inputSchema: {
      properties: {
        city: { description: 'City name', required: true },
        units: { enum: [] },
        tags: { type: 'array' },
      },
      required: ['city', 'country'],
    },
  };
  const targeted = new Set([
    'schema.required-without-property', 'schema.root-type', 'schema.empty-enum',
    'schema.array-without-items', 'schema.property-boolean-required',
  ]);
  assert.ok(analyzeToolDefinition(fluffy).diagnostics.some((d) => targeted.has(d.code)));
  const { fixedTool } = fixToolDefinition(fluffy);
  const remaining = analyzeToolDefinition(fixedTool).diagnostics.filter((d) => targeted.has(d.code));
  assert.deepEqual(remaining, []);
});
