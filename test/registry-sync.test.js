import { test } from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import path from 'node:path';
import {
  LIMITS,
  HttpStatusError,
  assertPublicHost,
  buildServerEntry,
  checkRemoteUrl,
  classifyFailure,
  extractRpcResponse,
  guessCategory,
  isBlockedAddress,
  isLatestActive,
  isValidRegistryName,
  orderCandidates,
  nextBacklogCursor,
  namesOverOperatorCap,
  operatorOf,
  publishedAtOf,
  parseSseMessages,
  postJson,
  probeServer,
  selectRemote,
  serverFilePath,
  slugify,
  validateTool,
  validateTools,
} from '../scripts/lib/registry-sync.mjs';

const schema = { type: 'object', properties: {} };

// --- tool validation -------------------------------------------------------

test('validateTool keeps only name, description and inputSchema', () => {
  const tool = validateTool({ name: 'get_x', description: 'Get x.', inputSchema: schema, annotations: { a: 1 }, extra: 'drop me' });

  assert.deepEqual(tool, { name: 'get_x', description: 'Get x.', inputSchema: schema });
});

test('validateTools drops invalid tools and duplicate names', () => {
  const input = [
    { name: 'ok', inputSchema: schema },
    { name: '', inputSchema: schema },
    { name: 'x'.repeat(LIMITS.maxToolNameLength + 1), inputSchema: schema },
    { name: 'bad_desc', description: 42, inputSchema: schema },
    { name: 'long_desc', description: 'd'.repeat(LIMITS.maxToolDescriptionLength + 1), inputSchema: schema },
    { name: 'no_schema' },
    { name: 'array_schema', inputSchema: [] },
    { name: 'null_schema', inputSchema: null },
    'not-an-object',
    null,
    { name: 'ok', inputSchema: schema },
  ];

  const { tools, dropped } = validateTools(input);

  assert.deepEqual(tools.map(t => t.name), ['ok']);
  assert.equal(dropped, 10);
});

test('validateTools caps the number of tools', () => {
  const input = Array.from({ length: LIMITS.maxTools + 25 }, (_, i) => ({ name: `tool_${i}`, inputSchema: schema }));

  const { tools, truncated } = validateTools(input);

  assert.equal(tools.length, LIMITS.maxTools);
  assert.equal(truncated, true);
});

test('validateTools rejects oversized input schemas and non-array input', () => {
  const huge = { type: 'object', description: 'x'.repeat(LIMITS.maxInputSchemaBytes) };

  assert.equal(validateTools([{ name: 'huge', inputSchema: huge }]).tools.length, 0);
  assert.equal(validateTools({ tools: [] }).tools.length, 0);
});

// --- response parsing ------------------------------------------------------

test('extractRpcResponse reads a plain JSON body', () => {
  const body = JSON.stringify({ jsonrpc: '2.0', id: 2, result: { tools: [{ name: 'a' }] } });

  assert.deepEqual(extractRpcResponse('application/json; charset=utf-8', body, 2), { tools: [{ name: 'a' }] });
});

test('extractRpcResponse reads the matching message from an SSE stream', () => {
  const body = [
    'event: message',
    'data: {"jsonrpc":"2.0","method":"notifications/progress","params":{}}',
    '',
    ': keep-alive comment',
    '',
    'event: message',
    'data: {"jsonrpc":"2.0","id":2,',
    'data: "result":{"tools":[{"name":"b"}]}}',
    '',
  ].join('\r\n');

  assert.deepEqual(extractRpcResponse('text/event-stream', body, 2), { tools: [{ name: 'b' }] });
});

test('parseSseMessages skips non-JSON data blocks', () => {
  assert.deepEqual(parseSseMessages('data: ping\n\ndata: {"id":1}\n\n'), [{ id: 1 }]);
});

test('extractRpcResponse throws on JSON-RPC errors, missing ids and invalid JSON', () => {
  const error = JSON.stringify({ jsonrpc: '2.0', id: 1, error: { code: -32601, message: 'nope' } });

  assert.throws(() => extractRpcResponse('application/json', error, 1), /JSON-RPC error: nope/);
  assert.throws(() => extractRpcResponse('application/json', '{"id":9,"result":{}}', 1), /No JSON-RPC response/);
  assert.throws(() => extractRpcResponse('application/json', '<html>', 1), /not valid JSON/);
});

// --- SSRF guard ------------------------------------------------------------

test('isBlockedAddress rejects private, loopback, link-local and reserved addresses', () => {
  for (const address of ['127.0.0.1', '10.1.2.3', '172.16.0.1', '192.168.1.1', '169.254.169.254', '100.64.0.1', '0.0.0.0', '224.0.0.1', '::1', '::', 'fe80::1', 'fd00::1', '::ffff:127.0.0.1', '::ffff:7f00:1', '2001:db8::1', 'not-an-ip']) {
    assert.equal(isBlockedAddress(address), true, address);
  }
});

test('isBlockedAddress allows public addresses', () => {
  for (const address of ['1.1.1.1', '8.8.8.8', '2606:4700:4700::1111']) {
    assert.equal(isBlockedAddress(address), false, address);
  }
});

test('checkRemoteUrl rejects http, private literals, credentials, odd ports and templates', () => {
  const cases = {
    'http://example.com/mcp': 'not-https',
    'https://127.0.0.1/mcp': 'private-address',
    'https://10.0.0.5/mcp': 'private-address',
    'https://169.254.169.254/latest/meta-data': 'private-address',
    'https://[::1]/mcp': 'private-address',
    'https://localhost/mcp': 'private-host',
    'https://user:pass@example.com/mcp': 'credentials-in-url',
    'https://example.com:8443/mcp': 'non-standard-port',
    'https://{tenant}.example.com/mcp': 'templated-url',
    'not a url': 'invalid-url',
  };
  for (const [url, reason] of Object.entries(cases)) {
    assert.deepEqual(checkRemoteUrl(url), { ok: false, reason }, url);
  }
  assert.equal(checkRemoteUrl('https://mcp.example.com/mcp').ok, true);
});

test('assertPublicHost rejects hostnames that resolve to private addresses', async () => {
  const lookup = async host => (host === 'rebind.example' ? [{ address: '8.8.8.8', family: 4 }, { address: '10.0.0.1', family: 4 }] : [{ address: '1.1.1.1', family: 4 }]);

  await assert.rejects(assertPublicHost('rebind.example', lookup), { code: 'ESSRF' });
  await assert.rejects(assertPublicHost('127.0.0.1', lookup), { code: 'ESSRF' });
  await assertPublicHost('public.example', lookup);
});

test('postJson refuses non-https and private URLs before any network access', async () => {
  await assert.rejects(postJson('http://example.com/mcp', {}), /Rejected URL \(not-https\)/);
  await assert.rejects(postJson('https://127.0.0.1/mcp', {}), /Rejected URL \(private-address\)/);
});

test('postJson fails when DNS resolves to a blocked address at connect time', async () => {
  const lookup = (hostname, options, callback) => {
    const err = new Error('blocked');
    err.code = 'ESSRF';
    callback(err);
  };

  await assert.rejects(postJson('https://mcp.example.com/mcp', {}, {}, { lookup }), { code: 'ESSRF' });
});

// --- registry selection ----------------------------------------------------

test('selectRemote picks an auth-free https streamable-http remote', () => {
  const server = {
    remotes: [
      { type: 'sse', url: 'https://a.example.com/sse' },
      { type: 'streamable-http', url: 'https://b.example.com/mcp', headers: [{ name: 'Authorization', isRequired: true }] },
      { type: 'streamable-http', url: 'https://{tenant}.example.com/mcp' },
      { type: 'streamable-http', url: 'http://c.example.com/mcp' },
      { type: 'streamable-http', url: 'https://d.example.com/mcp', headers: [{ name: 'X-Optional', isRequired: false }] },
    ],
  };

  assert.equal(selectRemote(server), 'https://d.example.com/mcp');
  assert.equal(selectRemote({ remotes: [{ type: 'streamable-http', url: 'https://10.0.0.1/mcp' }] }), undefined);
  assert.equal(selectRemote({ packages: [{}] }), undefined);
});

test('isLatestActive requires isLatest and status active', () => {
  const meta = extra => ({ _meta: { 'io.modelcontextprotocol.registry/official': { isLatest: true, status: 'active', ...extra } } });

  assert.equal(isLatestActive(meta({})), true);
  assert.equal(isLatestActive(meta({ isLatest: false })), false);
  assert.equal(isLatestActive(meta({ status: 'deprecated' })), false);
  assert.equal(isLatestActive({}), false);
});

// --- slugs and file paths --------------------------------------------------

test('slugify keeps only safe characters', () => {
  assert.equal(slugify('io.github.Acme/Weather_MCP'), 'io-github-acme-weather-mcp');
  assert.equal(slugify('../../etc/passwd'), 'etc-passwd');
  assert.equal(slugify('..'), undefined);
  assert.equal(slugify(42), undefined);
  assert.ok(slugify(`a/${'b'.repeat(300)}`).length <= LIMITS.maxSlugLength);
});

test('serverFilePath rejects unsafe slugs and stays inside the directory', () => {
  const dir = path.resolve('registry', 'servers');

  assert.equal(serverFilePath(dir, 'io-example-weather'), path.join(dir, 'io-example-weather.json'));
  assert.throws(() => serverFilePath(dir, '../escape'), /Unsafe slug/);
  assert.throws(() => serverFilePath(dir, 'a/b'), /Unsafe slug/);
  assert.throws(() => serverFilePath(dir, ''), /Unsafe slug/);
});

test('isValidRegistryName accepts namespace/name and rejects path tricks', () => {
  assert.equal(isValidRegistryName('io.github.acme/weather'), true);
  assert.equal(isValidRegistryName('../etc/passwd'), false);
  assert.equal(isValidRegistryName('noslash'), false);
});

// --- provenance ------------------------------------------------------------

test('buildServerEntry writes a source provenance block with a tools hash', () => {
  const tools = [{ name: 'get_forecast', description: 'Forecast.', inputSchema: schema }];
  const server = {
    name: 'io.example/weather',
    title: 'Weather\u0000 <b>',
    description: 'Daily weather forecasts.',
    version: '1.2.3',
    repository: { url: 'https://github.com/example/weather', source: 'github' },
  };

  const entry = buildServerEntry({ server, remoteUrl: 'https://weather.example.com/mcp', tools, fetchedAt: '2026-11-22T00:00:00.000Z', publishedAt: '2026-11-01T00:00:00Z' });

  assert.deepEqual(entry.source, {
    type: 'registry',
    registry: 'registry.modelcontextprotocol.io',
    name: 'io.example/weather',
    version: '1.2.3',
    remoteUrl: 'https://weather.example.com/mcp',
    publishedAt: '2026-11-01T00:00:00Z',
    fetchedAt: '2026-11-22T00:00:00.000Z',
    toolsSha256: crypto.createHash('sha256').update(JSON.stringify(tools)).digest('hex'),
  });
  assert.equal(entry.title, 'Weather <b>');
  assert.equal(entry.repository, 'https://github.com/example/weather');
  assert.equal(entry.category, 'Social, Media & Knowledge');
  assert.deepEqual(entry.tools, tools);
});

test('buildServerEntry drops non-https repository URLs', () => {
  const entry = buildServerEntry({
    server: { name: 'io.example/x', version: '1', repository: { url: 'javascript:alert(1)' } },
    remoteUrl: 'https://x.example.com/mcp',
    tools: [{ name: 't', inputSchema: schema }],
    fetchedAt: '2026-11-22T00:00:00.000Z',
  });

  assert.equal(entry.repository, undefined);
});

test('guessCategory falls back to Other', () => {
  assert.equal(guessCategory('io.example/zzz', 'Zzz'), 'Other');
  assert.equal(guessCategory('postgres helper'), 'Databases & Storage');
});

// --- probe flow (fake transport, no network) -------------------------------

function fakeTransport(responses) {
  const calls = [];
  const post = async (url, payload, headers = {}) => {
    calls.push({ url, payload, headers });
    const next = responses.shift();
    if (!next) throw new Error('unexpected request');
    return next;
  };
  return { post, calls };
}

const rpc = (id, result) => ({ status: 200, headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id, result }) });

test('probeServer echoes the session id and follows nextCursor', async () => {
  const { post, calls } = fakeTransport([
    { ...rpc(1, { protocolVersion: '2025-06-18', capabilities: {} }), headers: { 'content-type': 'application/json', 'mcp-session-id': 'sess-1' } },
    { status: 202, headers: {}, body: '' },
    { status: 200, headers: { 'content-type': 'text/event-stream' }, body: `data: ${JSON.stringify({ jsonrpc: '2.0', id: 2, result: { tools: [{ name: 'a' }], nextCursor: 'p2' } })}\n\n` },
    rpc(3, { tools: [{ name: 'b' }] }),
  ]);

  const tools = await probeServer('https://x.example.com/mcp', { post });

  assert.deepEqual(tools.map(t => t.name), ['a', 'b']);
  assert.equal(calls[0].payload.method, 'initialize');
  assert.equal(calls[0].payload.params.protocolVersion, '2025-06-18');
  assert.equal(calls[0].payload.params.clientInfo.name, 'mcp-benchmark-sync');
  assert.equal(calls[1].payload.method, 'notifications/initialized');
  assert.equal(calls[1].headers['Mcp-Session-Id'], 'sess-1');
  assert.deepEqual(calls[3].payload.params, { cursor: 'p2' });
  assert.equal(calls[3].headers['Mcp-Session-Id'], 'sess-1');
});

test('probeServer reports 401 as authRequired', async () => {
  const { post } = fakeTransport([{ status: 401, headers: {}, body: '' }]);

  const error = await probeServer('https://x.example.com/mcp', { post }).catch(err => err);

  assert.ok(error instanceof HttpStatusError);
  assert.equal(classifyFailure(error), 'authRequired');
  assert.equal(classifyFailure(new Error('timeout')), 'failed');
});

const cand = (name, publishedAt, { version = '1', operator = `${name}.example`, remoteUrl = `https://mcp.${name}.example/mcp` } = {}) => ({
  server: { name: `io.x/${name}`, version },
  remoteUrl,
  publishedAt,
  operator,
});
const names = list => list.map(x => x.server.name.slice(5));

test('orderCandidates probes changed servers first, then never-listed ones newest first', () => {
  const known = new Map([
    ['io.x/changed', { version: '1', remoteUrl: 'https://mcp.changed.example/mcp' }],
    ['io.x/same', { version: '1', remoteUrl: 'https://mcp.same.example/mcp' }],
  ]);
  const candidates = [
    cand('same', '2026-11-01T00:00:00Z'),
    cand('old', '2025-01-01T00:00:00Z'),
    cand('changed', '2024-01-01T00:00:00Z', { version: '2' }),
    cand('newest', '2026-11-20T00:00:00Z'),
    cand('middle', '2026-06-01T00:00:00Z'),
  ];

  assert.deepEqual(names(orderCandidates(candidates, { known })), ['changed', 'newest', 'middle', 'old', 'same']);
});

test('orderCandidates puts releases since the last run before the backlog and skips the covered window', () => {
  const candidates = [
    cand('covered', '2026-05-01T00:00:00Z'), // newer than the cursor, older than lastRun: already probed
    cand('backlog-new', '2026-03-01T00:00:00Z'),
    cand('released', '2026-11-21T00:00:00Z'),
    cand('backlog-old', '2025-03-01T00:00:00Z'),
  ];
  const options = { known: new Map(), lastRun: '2026-11-15T00:00:00Z', backlogCursor: '2026-04-01T00:00:00Z\u0000io.x/zzz' };

  assert.deepEqual(names(orderCandidates(candidates, options)), ['released', 'backlog-new', 'backlog-old']);
});

test('nextBacklogCursor returns the oldest backlog key that was probed', () => {
  const probed = [cand('released', '2026-11-21T00:00:00Z'), cand('b', '2026-03-01T00:00:00Z'), cand('c', '2026-02-01T00:00:00Z')];

  const cursor = nextBacklogCursor(probed, { known: new Map(), lastRun: '2026-11-15T00:00:00Z' });

  assert.equal(cursor, '2026-02-01T00:00:00Z\u0000io.x/c');
});

test('orderCandidates limits how many candidates one operator can use', () => {
  const candidates = ['a', 'b', 'c', 'd'].map((n, i) => cand(n, `2026-0${i + 1}-01T00:00:00Z`, { operator: 'bulk.example' }));
  candidates.push(cand('solo', '2020-01-01T00:00:00Z'));

  const ordered = orderCandidates(candidates, { known: new Map(), maxProbesPerOperator: 2 });

  assert.deepEqual(names(ordered), ['d', 'c', 'solo']);
});

test('namesOverOperatorCap keeps the most recently published servers of each operator', () => {
  const entries = [
    { name: 'io.x/a', operator: 'bulk.example', publishedAt: '2026-01-01T00:00:00Z' },
    { name: 'io.x/b', operator: 'bulk.example', publishedAt: '2026-03-01T00:00:00Z' },
    { name: 'io.x/c', operator: 'bulk.example', publishedAt: '2026-02-01T00:00:00Z' },
    { name: 'io.x/d', operator: 'bulk.example' },
    { name: 'io.x/solo', operator: 'solo.example', publishedAt: '2020-01-01T00:00:00Z' },
  ];

  assert.deepEqual(namesOverOperatorCap(entries, 2), ['io.x/a', 'io.x/d']);
  assert.deepEqual(namesOverOperatorCap(entries, 10), []);
});

test('operatorOf groups by registrable domain and separates shared-hosting tenants', () => {
  assert.equal(operatorOf('https://a.mcp.agentapigate.ai/mcp'), 'agentapigate.ai');
  assert.equal(operatorOf('https://b.agentapigate.ai/x'), 'agentapigate.ai');
  assert.equal(operatorOf('https://api.example.co.uk/mcp'), 'example.co.uk');
  assert.equal(operatorOf('https://one.workers.dev/mcp'), 'one.workers.dev');
  assert.equal(operatorOf('https://foo.bar.workers.dev/mcp'), 'bar.workers.dev');
  assert.notEqual(operatorOf('https://alice.vercel.app'), operatorOf('https://bob.vercel.app'));
});

test('publishedAtOf prefers publishedAt and falls back to updatedAt', () => {
  const item = meta => ({ _meta: { 'io.modelcontextprotocol.registry/official': meta } });

  assert.equal(publishedAtOf(item({ publishedAt: '2026-01-01T00:00:00Z', updatedAt: '2026-02-01T00:00:00Z' })), '2026-01-01T00:00:00Z');
  assert.equal(publishedAtOf(item({ updatedAt: '2026-02-01T00:00:00Z' })), '2026-02-01T00:00:00Z');
  assert.equal(publishedAtOf(item({ publishedAt: 'garbage' })), '');
  assert.equal(publishedAtOf({}), '');
});
