import { test } from 'node:test';
import assert from 'node:assert/strict';
import { makeSupabasePeer, loadSupabaseConfig, resolvePeerClass } from '../js/supabase_peer.js';
import { HostNetwork, ClientNetwork, MSG } from '../js/network.js';

// ── Cliente Supabase simulado: canales Broadcast + Presence en memoria ───────
const defer = (fn) => setTimeout(fn, 0);
function makeFakeSupabase() {
  const rooms = new Map();
  const client = {
    channel(name, { config }) {
      const room = rooms.get(name) ?? rooms.set(name, new Set()).get(name);
      const key = config.presence.key;
      const handlers = [];
      let meta = null, joined = false;
      const others = () => [...room].filter((c) => c !== ch);
      const fire = (c, type, event, arg) => { for (const h of c._handlers) if (h.type === type && h.event === event) h.cb(arg); };
      const ch = {
        _handlers: handlers, _key: key, get _meta() { return meta; },
        on(type, filter, cb) { handlers.push({ type, event: filter.event, cb }); return ch; },
        subscribe(cb) {
          defer(() => { room.add(ch); joined = true; cb('SUBSCRIBED'); defer(() => fire(ch, 'presence', 'sync')); });
          return ch;
        },
        async track(m) { meta = m; for (const c of room) defer(() => fire(c, 'presence', 'sync')); return 'ok'; },
        untrack() {
          meta = null;
          for (const c of others()) defer(() => { fire(c, 'presence', 'leave', { key }); fire(c, 'presence', 'sync'); });
        },
        presenceState() {
          const s = {};
          for (const c of room) if (c._meta) s[c._key] = [c._meta];
          return s;
        },
        async send({ event, payload }) {
          if (!joined) return 'error';
          for (const c of others()) defer(() => fire(c, 'broadcast', event, { payload }));
          return 'ok';
        },
      };
      return ch;
    },
    removeChannel(ch) { ch.untrack(); for (const room of rooms.values()) room.delete(ch); },
  };
  return client;
}

const wait = (ms = 30) => new Promise((r) => setTimeout(r, ms));
const collect = (em, evt) => { const a = []; em.on(evt, (x) => a.push(x)); return a; };
const memStorage = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };
const fast = { openRetryMs: 20, notFoundMs: 200, syncTimeoutMs: 50, joinTimeoutMs: 500 };

async function room() {
  const sb = makeFakeSupabase();
  const Peer = makeSupabasePeer({ client: sb, ...fast });
  const host = new HostNetwork({ Peer });
  const code = await host.open();
  const mk = (name = 'Ana', o = {}) => new ClientNetwork({ Peer, storage: memStorage(), name, baseDelayMs: 1, maxDelayMs: 5, ...o });
  return { sb, Peer, host, code, mk };
}

test('hello → player-connect → welcome sobre Realtime', async () => {
  const { host, code, mk } = await room();
  const connects = collect(host, 'player-connect');
  const c = mk('Ana');
  const msgs = collect(c, 'message');
  host.on('player-connect', ({ playerId }) => host.sendWelcome(playerId, { phase: 'lobby', players: [], version: 1 }));
  await c.join(code);
  await wait();
  assert.equal(connects.length, 1);
  assert.equal(connects[0].playerId, c.clientId);
  assert.equal(msgs[0].t, MSG.WELCOME);
  c.close(); host.close();
});

test('mensajes en ambos sentidos: roll del cliente llega al host; state del host al cliente', async () => {
  const { host, code, mk } = await room();
  const got = collect(host, 'message');
  host.on('player-connect', ({ playerId }) => host.sendWelcome(playerId, { phase: 'lobby', players: [], version: 1 }));
  const c = mk('Ana');
  const fromHost = collect(c, 'message');
  await c.join(code);
  await wait();
  c.send({ t: MSG.PICK, v: 1, characterId: 'scientist' });
  await wait();
  assert.ok(got.some((m) => m.msg.t === MSG.PICK && m.playerId === c.clientId));
  host.send(c.clientId, { t: MSG.STATE, v: 1, state: { phase: 'lobby', players: [], version: 2 } });
  await wait();
  assert.ok(fromHost.some((m) => m.t === MSG.STATE));
  c.close(); host.close();
});

test('sala inexistente → room_not_found; código ocupado → el host reintenta con otro', async () => {
  const { sb, Peer, host, mk } = await room();
  await assert.rejects(mk().join('ZZZZ'), (e) => e.code === 'room_not_found');
  // segundo host con el mismo generador de códigos: nunca debe obtener el código del primero
  const host2 = new HostNetwork({ Peer: makeSupabasePeer({ client: sb, ...fast }) });
  const code2 = await host2.open();
  assert.notEqual(code2, host.roomCode);
  host.close(); host2.close();
});

test('id duplicado emite unavailable-id', async () => {
  const sb = makeFakeSupabase();
  const Peer = makeSupabasePeer({ client: sb, ...fast });
  const a = new Peer('gradient-ladders-AAAA');
  await new Promise((r) => a.on('open', r));
  const b = new Peer('gradient-ladders-AAAA');
  const err = await new Promise((r) => b.on('error', r));
  assert.equal(err.type, 'unavailable-id');
  a.destroy(); b.destroy();
});

test('cerrar el host cierra al cliente; cerrar el cliente notifica al host', async () => {
  const { host, code, mk } = await room();
  const disc = collect(host, 'player-disconnect');
  const c = mk('Ana', { maxRetries: 0 });
  const closed = collect(c, 'close');
  await c.join(code);
  await wait();
  c.close();
  await wait(60);
  assert.equal(disc.length, 1);
  const c2 = mk('Beto', { maxRetries: 0 });
  const closed2 = collect(c2, 'close');
  await c2.join(code);
  await wait();
  host.close();
  await wait(80);
  assert.ok(closed2.length >= 1);
  void closed;
});

test('el reintento de "open" no duplica la conexión en el host', async () => {
  const { host, code, mk } = await room();
  const connects = collect(host, 'player-connect');
  const c = mk('Ana');
  await c.join(code);
  await wait(120); // varios ciclos de openRetryMs
  assert.equal(connects.length, 1);
  c.close(); host.close();
});

test('loadSupabaseConfig valida URL y clave', async () => {
  const ok = { ok: true, json: async () => ({ url: 'https://abc.supabase.co/', key: 'sb_publishable_xyz' }) };
  assert.deepEqual(await loadSupabaseConfig({ fetchFn: async () => ok }), { url: 'https://abc.supabase.co', key: 'sb_publishable_xyz' });
  for (const body of [{ url: 'http://evil.example', key: 'sb_publishable_x' }, { url: 'https://abc.supabase.co', key: 'sb_secret_x' }, {}, null]) {
    assert.equal(await loadSupabaseConfig({ fetchFn: async () => ({ ok: true, json: async () => body }) }), null);
  }
  assert.equal(await loadSupabaseConfig({ fetchFn: async () => ({ ok: false }) }), null);
  assert.equal(await loadSupabaseConfig({ fetchFn: async () => { throw new Error('x'); } }), null);
});

test('resolvePeerClass cae a PeerJS si no hay config, librería o se fuerza', async () => {
  const prev = globalThis.fetch;
  const FakePeerJS = function Peer() {};
  try {
    globalThis.fetch = async () => ({ ok: false });
    let r = await resolvePeerClass({ search: '', g: { Peer: FakePeerJS, supabase: { createClient: () => makeFakeSupabase() } } });
    assert.equal(r.transport, 'peerjs');
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ url: 'https://abc.supabase.co', key: 'sb_publishable_x' }) });
    r = await resolvePeerClass({ search: '', g: { Peer: FakePeerJS, supabase: { createClient: () => makeFakeSupabase() } } });
    assert.equal(r.transport, 'supabase');
    r = await resolvePeerClass({ search: '?transport=peerjs', g: { Peer: FakePeerJS, supabase: { createClient: () => makeFakeSupabase() } } });
    assert.equal(r.transport, 'peerjs');
    r = await resolvePeerClass({ search: '', g: { Peer: FakePeerJS } });
    assert.equal(r.transport, 'peerjs');
  } finally { globalThis.fetch = prev; }
});
