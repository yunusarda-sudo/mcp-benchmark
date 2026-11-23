// Pure and network helpers for scripts/sync-registry.mjs.
// Everything that comes back from the MCP Registry or from a remote MCP server
// is untrusted input: it is validated here before it is written to disk.
import crypto from 'node:crypto';
import dns from 'node:dns';
import https from 'node:https';
import net from 'node:net';
import path from 'node:path';

export const REGISTRY_HOST = 'registry.modelcontextprotocol.io';
export const REGISTRY_BASE_URL = `https://${REGISTRY_HOST}/v0/servers`;
export const OFFICIAL_META_KEY = 'io.modelcontextprotocol.registry/official';
export const PROTOCOL_VERSION = '2025-06-18';
export const USER_AGENT = 'mcp-benchmark-sync (+https://github.com/yunusarda-sudo/mcp-benchmark)';
export const CLIENT_INFO = { name: 'mcp-benchmark-sync', version: '1.0.0' };

export const LIMITS = Object.freeze({
  requestTimeoutMs: 15_000,
  maxResponseBytes: 2 * 1024 * 1024,
  maxTools: 500,
  maxToolNameLength: 128,
  maxToolDescriptionLength: 8000,
  maxInputSchemaBytes: 64 * 1024,
  maxToolListPages: 20,
  maxTitleLength: 100,
  maxServerDescriptionLength: 500,
  maxSlugLength: 100,
  maxUrlLength: 2048,
});

// ---------------------------------------------------------------------------
// SSRF guard
// ---------------------------------------------------------------------------

// Separate lists: a BlockList treats IPv4 as IPv4-mapped IPv6, so mixing the
// ::ffff:0:0/96 rule into one list would block every IPv4 address.
const blockedIpv4 = new net.BlockList();
const blockedIpv6 = new net.BlockList();
for (const [subnet, prefix] of [
  ['0.0.0.0', 8], // "this" network
  ['10.0.0.0', 8], // private
  ['100.64.0.0', 10], // carrier-grade NAT
  ['127.0.0.0', 8], // loopback
  ['169.254.0.0', 16], // link-local, cloud metadata (169.254.169.254)
  ['172.16.0.0', 12], // private
  ['192.0.0.0', 24], // IETF protocol assignments
  ['192.0.2.0', 24], // TEST-NET-1
  ['192.88.99.0', 24], // 6to4 relay anycast
  ['192.168.0.0', 16], // private
  ['198.18.0.0', 15], // benchmarking
  ['198.51.100.0', 24], // TEST-NET-2
  ['203.0.113.0', 24], // TEST-NET-3
  ['224.0.0.0', 4], // multicast
  ['240.0.0.0', 4], // reserved + broadcast
]) {
  blockedIpv4.addSubnet(subnet, prefix, 'ipv4');
}
for (const [subnet, prefix] of [
  ['::', 128], // unspecified
  ['::1', 128], // loopback
  ['::', 96], // IPv4-compatible (deprecated)
  ['::ffff:0:0', 96], // IPv4-mapped
  ['64:ff9b::', 96], // NAT64
  ['64:ff9b:1::', 48], // local-use NAT64
  ['100::', 64], // discard-only
  ['2001::', 23], // IETF protocol assignments (incl. Teredo)
  ['2001:db8::', 32], // documentation
  ['2002::', 16], // 6to4
  ['fc00::', 7], // unique local
  ['fe80::', 10], // link-local
  ['fec0::', 10], // site-local (deprecated)
  ['ff00::', 8], // multicast
]) {
  blockedIpv6.addSubnet(subnet, prefix, 'ipv6');
}

/** True when an IP literal is private, loopback, link-local, or otherwise reserved. */
export function isBlockedAddress(address) {
  const family = net.isIP(address);
  if (family === 4) return blockedIpv4.check(address, 'ipv4');
  if (family === 6) return blockedIpv6.check(address, 'ipv6');
  return true; // not an IP literal: refuse rather than guess
}

/**
 * Validates a remote URL taken from the registry. Returns the parsed URL or a
 * reason string. DNS is checked separately (see assertPublicHost / safeLookup).
 */
export function checkRemoteUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || rawUrl.length === 0 || rawUrl.length > LIMITS.maxUrlLength) {
    return { ok: false, reason: 'invalid-url' };
  }
  if (rawUrl.includes('{') || rawUrl.includes('}')) return { ok: false, reason: 'templated-url' };
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    return { ok: false, reason: 'invalid-url' };
  }
  if (url.protocol !== 'https:') return { ok: false, reason: 'not-https' };
  if (url.username || url.password) return { ok: false, reason: 'credentials-in-url' };
  if (url.port && url.port !== '443') return { ok: false, reason: 'non-standard-port' };
  const host = url.hostname.replace(/^\[|\]$/g, '');
  if (!host || host === 'localhost' || host.endsWith('.localhost') || host.endsWith('.local') || host.endsWith('.internal')) {
    return { ok: false, reason: 'private-host' };
  }
  if (net.isIP(host) && isBlockedAddress(host)) return { ok: false, reason: 'private-address' };
  return { ok: true, url };
}

/**
 * dns.lookup-compatible function that refuses to hand a blocked address to the
 * socket. Because it runs at connect time it also covers DNS rebinding between
 * the pre-check and the request.
 */
export function safeLookup(hostname, options, callback) {
  const cb = typeof options === 'function' ? options : callback;
  const opts = typeof options === 'function' ? {} : options;
  dns.lookup(hostname, { ...opts, all: true }, (err, addresses) => {
    if (err) return cb(err);
    const list = Array.isArray(addresses) ? addresses : [{ address: addresses, family: net.isIP(addresses) }];
    if (list.length === 0 || list.some(a => isBlockedAddress(a.address))) {
      const blocked = new Error(`Refusing to connect to ${hostname}: resolves to a non-public address`);
      blocked.code = 'ESSRF';
      return cb(blocked);
    }
    if (opts.all) return cb(null, list);
    return cb(null, list[0].address, list[0].family);
  });
}

/** Resolves a hostname up front and rejects it when any address is non-public. */
export async function assertPublicHost(hostname, lookup = dns.promises.lookup) {
  const host = hostname.replace(/^\[|\]$/g, '');
  if (net.isIP(host)) {
    if (isBlockedAddress(host)) throw ssrfError(host);
    return;
  }
  const addresses = await lookup(host, { all: true });
  if (addresses.length === 0 || addresses.some(a => isBlockedAddress(a.address))) throw ssrfError(host);
}

function ssrfError(host) {
  const err = new Error(`Refusing to connect to ${host}: non-public address`);
  err.code = 'ESSRF';
  return err;
}

// ---------------------------------------------------------------------------
// Registry entry selection
// ---------------------------------------------------------------------------

/** Picks the first auth-free, non-templated https streamable-http remote, or undefined. */
export function selectRemote(server) {
  const remotes = Array.isArray(server?.remotes) ? server.remotes : [];
  for (const remote of remotes) {
    if (!remote || remote.type !== 'streamable-http') continue;
    const headers = Array.isArray(remote.headers) ? remote.headers : [];
    if (headers.some(h => h && h.isRequired === true)) continue;
    const checked = checkRemoteUrl(remote.url);
    if (checked.ok) return checked.url.toString();
  }
  return undefined;
}

/** Returns the official registry metadata of an item, or undefined. */
export function officialMeta(item) {
  const meta = item?._meta?.[OFFICIAL_META_KEY];
  return meta && typeof meta === 'object' ? meta : undefined;
}

export function isLatestActive(item) {
  const meta = officialMeta(item);
  return meta?.isLatest === true && meta?.status === 'active';
}

// ---------------------------------------------------------------------------
// Text, slug, and category helpers
// ---------------------------------------------------------------------------

/** Strips control characters, collapses whitespace, and truncates. */
export function cleanText(value, maxLength) {
  if (typeof value !== 'string') return undefined;
  const cleaned = value.replace(/[\u0000-\u001f\u007f-\u009f\u2028\u2029]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!cleaned) return undefined;
  return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength - 1)}…` : cleaned;
}

/**
 * Builds a filesystem-safe slug from a registry name (e.g. "io.github.acme/weather").
 * Only [a-z0-9-] survive, so the slug can never contain path separators or "..".
 */
export function slugify(registryName) {
  if (typeof registryName !== 'string') return undefined;
  const slug = registryName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, LIMITS.maxSlugLength)
    .replace(/-+$/g, '');
  return slug.length > 0 ? slug : undefined;
}

/** Resolves <dir>/<slug>.json and throws if the result escapes dir. */
export function serverFilePath(dir, slug) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug ?? '')) throw new Error(`Unsafe slug: ${slug}`);
  const base = path.resolve(dir);
  const target = path.resolve(base, `${slug}.json`);
  if (path.dirname(target) !== base) throw new Error(`Slug escapes registry directory: ${slug}`);
  return target;
}

export const CATEGORY_KEYWORDS = [
  ['AI, LLMs & Agents', ['agent', 'llm', 'prompt', 'model', 'gpt', 'claude', 'chatbot', 'assistant', 'reasoning', 'openai', 'gemini', 'anthropic', 'copilot']],
  ['Databases & Storage', ['database', 'postgres', 'mysql', 'sqlite', 'mongo', 'redis', 'sql', 'storage', 'bucket', 'supabase', 'dynamo']],
  ['Vector DBs & AI Search', ['vector', 'embedding', 'rag', 'semantic search', 'pinecone', 'qdrant', 'chroma', 'weaviate']],
  ['Developer Tools & DevOps', ['github', 'gitlab', 'git ', 'compiler', 'cli', 'lint', 'debug', 'sdk', 'vcs', 'docker', 'k8s', 'kubernetes', 'terminal', 'bash', 'deploy', 'serverless', 'aws', 'azure', 'gcp']],
  ['Finance, Crypto & Web3', ['payment', 'finance', 'invoice', 'billing', 'stock', 'crypto', 'trading', 'bank', 'wallet', 'btc', 'eth', 'token', 'defi', 'forex', 'nft', 'blockchain', 'solana', 'xrpl']],
  ['E-Commerce & Retail', ['shop', 'store', 'coupon', 'product', 'price', 'retail', 'order', 'cart', 'ecommerce', 'voucher', 'catalog', 'shipping', 'parcel', 'inventory']],
  ['Web Scraping & Automation', ['scrap', 'crawl', 'browser', 'automation', 'fetch', 'web page', 'puppeteer', 'playwright', 'scrape']],
  ['Communication & Alerting', ['slack', 'email', 'chat', 'message', 'sms', 'notification', 'discord', 'telegram', 'webhook', 'alert']],
  ['Productivity & Notes', ['note', 'task', 'todo', 'calendar', 'project management', 'docs', 'document', 'wiki', 'crm', 'jira', 'notion', 'linear', 'sheet', 'spreadsheet', 'trello']],
  ['Healthcare & Wellness', ['health', 'medical', 'clinic', 'pharma', 'drug', 'herb', 'bio', 'doctor', 'patient', 'wellness', 'fitness', 'nutrition', 'psych', 'hospital']],
  ['Design, UI & 3D Media', ['design', 'ui', 'ux', 'component', '3d', 'model', 'color', 'font', 'svg', 'icon', 'image', 'photo', 'canvas', 'graphic', 'render', 'figma']],
  ['Jobs, Career & Learning', ['job', 'career', 'resume', 'hire', 'interview', 'examination', 'education', 'course', 'school', 'student', 'learn', 'teach', 'academy', 'training']],
  ['Travel, Maps & Navigation', ['travel', 'flight', 'hotel', 'airport', 'map', 'geo', 'location', 'booking', 'tour', 'transit', 'city', 'atlas', 'route']],
  ['Security & Identity', ['security', 'vulnerab', 'identity', 'auth', 'threat', 'secret', 'scam', 'audit', 'verify', 'fraud', 'privacy', 'firewall']],
  ['Observability & Analytics', ['monitor', 'observability', 'analytics', 'logging', 'logs', 'metrics', 'tracing', 'sentry', 'uptime', 'telemetry', 'seo']],
  ['Social, Media & Knowledge', ['news', 'video', 'music', 'social', 'weather', 'forecast', 'knowledge', 'research', 'paper', 'podcast', 'youtube', 'reddit', 'content']],
];

/** Keyword heuristic over name/title/description; falls back to "Other". */
export function guessCategory(...texts) {
  const haystack = ` ${texts.filter(t => typeof t === 'string').join(' ').toLowerCase()} `;
  for (const [category, keywords] of CATEGORY_KEYWORDS) {
    if (keywords.some(k => haystack.includes(k))) return category;
  }
  return 'Other';
}

/** Returns an https repository URL from the registry entry, or undefined. */
export function repositoryUrl(server) {
  const raw = server?.repository?.url;
  if (typeof raw !== 'string' || raw.length > 300) return undefined;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password) return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

// ---------------------------------------------------------------------------
// Tool validation
// ---------------------------------------------------------------------------

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Validates one untrusted tool and returns {name, description?, inputSchema} or undefined. */
export function validateTool(tool) {
  if (!isPlainObject(tool)) return undefined;
  const { name, description, inputSchema } = tool;
  if (typeof name !== 'string' || name.length === 0 || name.length > LIMITS.maxToolNameLength) return undefined;
  if (description !== undefined && (typeof description !== 'string' || description.length > LIMITS.maxToolDescriptionLength)) {
    return undefined;
  }
  if (!isPlainObject(inputSchema)) return undefined;
  if (Buffer.byteLength(JSON.stringify(inputSchema), 'utf8') > LIMITS.maxInputSchemaBytes) return undefined;
  return description === undefined ? { name, inputSchema } : { name, description, inputSchema };
}

/**
 * Validates an untrusted tools array: invalid tools and duplicate names are
 * dropped and at most LIMITS.maxTools are kept.
 */
export function validateTools(tools) {
  if (!Array.isArray(tools)) return { tools: [], dropped: 0, truncated: false };
  const valid = [];
  const seen = new Set();
  let dropped = 0;
  for (const raw of tools) {
    if (valid.length >= LIMITS.maxTools) break;
    const tool = validateTool(raw);
    if (!tool || seen.has(tool.name)) {
      dropped += 1;
      continue;
    }
    seen.add(tool.name);
    valid.push(tool);
  }
  return { tools: valid, dropped, truncated: tools.length - dropped > valid.length };
}

export function toolsSha256(tools) {
  return crypto.createHash('sha256').update(JSON.stringify(tools)).digest('hex');
}

// ---------------------------------------------------------------------------
// MCP response parsing
// ---------------------------------------------------------------------------

/** Extracts JSON-RPC messages from a text/event-stream body. */
export function parseSseMessages(body) {
  const messages = [];
  for (const block of body.replace(/\r\n?/g, '\n').split(/\n\n+/)) {
    const data = block
      .split('\n')
      .filter(line => line.startsWith('data:'))
      .map(line => line.slice(5).replace(/^ /, ''))
      .join('\n');
    if (!data) continue;
    try {
      messages.push(JSON.parse(data));
    } catch {
      // Not JSON (e.g. a keep-alive payload): skip it.
    }
  }
  return messages;
}

/**
 * Returns the JSON-RPC response with the given id from a JSON or SSE body.
 * Throws when it is missing or is a JSON-RPC error.
 */
export function extractRpcResponse(contentType, body, id) {
  const type = (contentType || '').toLowerCase();
  let messages;
  if (type.includes('text/event-stream')) {
    messages = parseSseMessages(body);
  } else {
    let parsed;
    try {
      parsed = JSON.parse(body);
    } catch {
      throw new Error('Response is not valid JSON');
    }
    messages = Array.isArray(parsed) ? parsed : [parsed];
  }
  const match = messages.find(m => isPlainObject(m) && m.id === id);
  if (!match) throw new Error(`No JSON-RPC response with id ${id}`);
  if (match.error !== undefined) {
    const message = isPlainObject(match.error) && typeof match.error.message === 'string' ? match.error.message : 'unknown';
    throw new Error(`JSON-RPC error: ${message.slice(0, 200)}`);
  }
  if (!isPlainObject(match.result)) throw new Error('JSON-RPC response has no result object');
  return match.result;
}

// ---------------------------------------------------------------------------
// HTTP transport (SSRF-guarded)
// ---------------------------------------------------------------------------

export class HttpStatusError extends Error {
  constructor(status) {
    super(`HTTP ${status}`);
    this.name = 'HttpStatusError';
    this.status = status;
  }
}

/**
 * POSTs JSON to an https URL with the SSRF-guarded lookup, no redirects, a
 * timeout, and a response size cap. Resolves {status, headers, body}.
 */
export function postJson(rawUrl, payload, headers = {}, { lookup = safeLookup } = {}) {
  const checked = checkRemoteUrl(rawUrl);
  if (!checked.ok) return Promise.reject(new Error(`Rejected URL (${checked.reason})`));
  const body = JSON.stringify(payload);
  return new Promise((resolve, reject) => {
    const req = https.request(
      checked.url,
      {
        method: 'POST',
        lookup,
        signal: AbortSignal.timeout(LIMITS.requestTimeoutMs),
        headers: {
          'User-Agent': USER_AGENT,
          'Content-Type': 'application/json',
          Accept: 'application/json, text/event-stream',
          'Content-Length': Buffer.byteLength(body),
          ...headers,
        },
      },
      res => {
        const status = res.statusCode ?? 0;
        if (status >= 300 && status < 400) {
          res.resume();
          return reject(new HttpStatusError(status)); // redirects are never followed
        }
        const chunks = [];
        let size = 0;
        res.on('data', chunk => {
          size += chunk.length;
          if (size > LIMITS.maxResponseBytes) {
            req.destroy(new Error('Response exceeds size cap'));
            return;
          }
          chunks.push(chunk);
        });
        res.on('end', () => resolve({ status, headers: res.headers, body: Buffer.concat(chunks).toString('utf8') }));
        res.on('error', reject);
      }
    );
    req.on('error', reject);
    req.end(body);
  });
}

/**
 * Runs initialize → notifications/initialized → tools/list (following
 * nextCursor) against a streamable-http endpoint and returns raw tools.
 */
export async function probeServer(remoteUrl, { post = postJson } = {}) {
  const init = await post(remoteUrl, {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: { protocolVersion: PROTOCOL_VERSION, capabilities: {}, clientInfo: CLIENT_INFO },
  });
  if (init.status !== 200) throw new HttpStatusError(init.status);
  const initResult = extractRpcResponse(init.headers['content-type'], init.body, 1);

  const sessionId = init.headers['mcp-session-id'];
  const negotiated = typeof initResult.protocolVersion === 'string' ? initResult.protocolVersion : PROTOCOL_VERSION;
  const sessionHeaders = {
    'MCP-Protocol-Version': negotiated.slice(0, 32),
    ...(typeof sessionId === 'string' && /^[\x21-\x7e]{1,256}$/.test(sessionId) ? { 'Mcp-Session-Id': sessionId } : {}),
  };

  const notified = await post(remoteUrl, { jsonrpc: '2.0', method: 'notifications/initialized' }, sessionHeaders);
  if (notified.status >= 400) throw new HttpStatusError(notified.status);

  const tools = [];
  let cursor;
  for (let page = 0; page < LIMITS.maxToolListPages; page += 1) {
    const id = 2 + page;
    const res = await post(
      remoteUrl,
      { jsonrpc: '2.0', id, method: 'tools/list', ...(cursor ? { params: { cursor } } : {}) },
      sessionHeaders
    );
    if (res.status !== 200) throw new HttpStatusError(res.status);
    const result = extractRpcResponse(res.headers['content-type'], res.body, id);
    if (Array.isArray(result.tools)) tools.push(...result.tools);
    if (tools.length > LIMITS.maxTools) break;
    cursor = typeof result.nextCursor === 'string' && result.nextCursor ? result.nextCursor : undefined;
    if (!cursor) break;
  }
  return tools;
}

/** Classifies a probe failure for the sync-state counters. */
export function classifyFailure(error) {
  if (error instanceof HttpStatusError && (error.status === 401 || error.status === 403)) return 'authRequired';
  return 'failed';
}

// ---------------------------------------------------------------------------
// Registry entry file
// ---------------------------------------------------------------------------

/** Builds the registry/servers/<slug>.json document for a successfully probed server. */
export function buildServerEntry({ server, remoteUrl, tools, fetchedAt, publishedAt }) {
  const name = server.name;
  const title = cleanText(server.title, LIMITS.maxTitleLength);
  const description = cleanText(server.description, LIMITS.maxServerDescriptionLength);
  const repository = repositoryUrl(server);
  return {
    $schema: '../schema.json',
    name,
    ...(title ? { title } : {}),
    category: guessCategory(name, title, description),
    ...(description ? { description } : {}),
    ...(repository ? { repository } : {}),
    tools,
    source: {
      type: 'registry',
      registry: REGISTRY_HOST,
      name,
      version: typeof server.version === 'string' ? server.version.slice(0, 100) : 'unknown',
      remoteUrl,
      ...(publishedAt ? { publishedAt } : {}),
      fetchedAt,
      toolsSha256: toolsSha256(tools),
    },
  };
}

/** Valid registry server names look like "reverse.dns/name". */
export function isValidRegistryName(name) {
  return typeof name === 'string' && name.length > 0 && name.length <= 200 && /^[A-Za-z0-9][A-Za-z0-9._-]*\/[A-Za-z0-9._-]+$/.test(name);
}

// Multi-tenant hosting suffixes: each subdomain belongs to a different operator.
const SHARED_HOST_SUFFIXES = [
  'workers.dev', 'pages.dev', 'vercel.app', 'netlify.app', 'onrender.com', 'fly.dev', 'herokuapp.com',
  'railway.app', 'up.railway.app', 'github.io', 'run.app', 'a.run.app', 'azurewebsites.net', 'azurecontainerapps.io',
  'deno.dev', 'deno.net', 'supabase.co', 'modal.run', 'ngrok.app', 'ngrok-free.app', 'replit.app', 'smithery.ai',
  'glitch.me', 'web.app', 'firebaseapp.com', 'cloudfunctions.net', 'amazonaws.com', 'on-aws.com', 'lambda-url.us-east-1.on.aws',
];
const TWO_LEVEL_TLDS = new Set(['co.uk', 'org.uk', 'ac.uk', 'com.au', 'net.au', 'co.jp', 'co.kr', 'com.br', 'com.cn', 'co.in', 'com.tr', 'co.nz', 'com.mx', 'co.za']);

/**
 * Approximates the operator of a remote: the registrable domain of its host
 * (eTLD+1), treating shared hosting suffixes as public so tenants differ.
 */
export function operatorOf(remoteUrl) {
  let host;
  try {
    host = new URL(remoteUrl).hostname.toLowerCase().replace(/\.$/, '');
  } catch {
    return 'invalid';
  }
  if (net.isIP(host.replace(/^\[|\]$/g, ''))) return host;
  const labels = host.split('.');
  const suffix = SHARED_HOST_SUFFIXES.filter(x => host === x || host.endsWith(`.${x}`)).sort((x, y) => y.length - x.length)[0];
  if (suffix) {
    const suffixLabels = suffix.split('.').length;
    return labels.length > suffixLabels ? labels.slice(-(suffixLabels + 1)).join('.') : host;
  }
  const keep = TWO_LEVEL_TLDS.has(labels.slice(-2).join('.')) ? 3 : 2;
  return labels.slice(-keep).join('.');
}

/** Publish time of a registry item (publishedAt, falling back to updatedAt), or ''. */
export function publishedAtOf(item) {
  const meta = officialMeta(item);
  const value = typeof meta?.publishedAt === 'string' ? meta.publishedAt : typeof meta?.updatedAt === 'string' ? meta.updatedAt : '';
  return Number.isNaN(Date.parse(value)) ? '' : value;
}

/** Sort key: newer first, then by name for stable ties. */
function recencyKey(candidate) {
  return `${candidate.publishedAt}\u0000${candidate.server.name}`;
}
const newestFirst = (a, b) => (recencyKey(a) < recencyKey(b) ? 1 : recencyKey(a) > recencyKey(b) ? -1 : 0);

/**
 * Orders probe candidates for a capped run, newest first by publishedAt:
 *   1. known servers whose version or URL changed,
 *   2. never-listed servers published since the previous run (`lastRun`),
 *   3. the never-listed backlog older than `backlogCursor` (a recencyKey from
 *      the previous capped run; candidates between the cursor and lastRun were
 *      already probed and are skipped),
 *   4. known unchanged servers.
 * At most `maxProbesPerOperator` candidates per operator are kept so one
 * operator cannot use up the probe budget.
 */
export function orderCandidates(candidates, { known, lastRun, backlogCursor, maxProbesPerOperator = Infinity }) {
  const changed = [];
  const recent = [];
  const backlog = [];
  const unchanged = [];
  for (const candidate of candidates) {
    const source = known.get(candidate.server.name);
    if (source) {
      const isChanged = source.version !== candidate.server.version || source.remoteUrl !== candidate.remoteUrl;
      (isChanged ? changed : unchanged).push(candidate);
    } else if (lastRun && candidate.publishedAt > lastRun) {
      recent.push(candidate);
    } else if (!backlogCursor || recencyKey(candidate) < backlogCursor) {
      backlog.push(candidate);
    }
  }
  const ordered = [changed, recent, backlog, unchanged].flatMap(group => [...group].sort(newestFirst));
  const perOperator = new Map();
  return ordered.filter(candidate => {
    const count = perOperator.get(candidate.operator) ?? 0;
    if (count >= maxProbesPerOperator) return false;
    perOperator.set(candidate.operator, count + 1);
    return true;
  });
}

/** The backlog cursor to store after probing `probed` (the oldest backlog key probed). */
export function nextBacklogCursor(probed, { known, lastRun }) {
  const backlogKeys = probed
    .filter(c => !known.has(c.server.name) && !(lastRun && c.publishedAt > lastRun))
    .map(recencyKey)
    .sort();
  return backlogKeys[0];
}

/**
 * Returns the registry names to drop so each operator keeps at most `cap`
 * listed servers (the most recently published are kept).
 * `entries` is an array of { name, operator, publishedAt }.
 */
export function namesOverOperatorCap(entries, cap) {
  const groups = new Map();
  for (const entry of entries) groups.set(entry.operator, [...(groups.get(entry.operator) ?? []), entry]);
  const drop = [];
  for (const group of groups.values()) {
    const sorted = [...group].sort((a, b) => newestFirst({ publishedAt: a.publishedAt ?? '', server: { name: a.name } }, { publishedAt: b.publishedAt ?? '', server: { name: b.name } }));
    drop.push(...sorted.slice(cap).map(e => e.name));
  }
  return drop.sort();
}

/** Runs async fn over items with at most `limit` in flight. */
export async function mapWithConcurrency(items, limit, fn) {
  const results = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next;
      next += 1;
      results[index] = await fn(items[index], index);
    }
  });
  await Promise.all(workers);
  return results;
}
