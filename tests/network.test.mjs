import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  HostNetwork, ClientNetwork, MSG, encode, decode, validate, sanitizeName, backoffDelay,
  getClientId, MAX_MESSAGE_BYTES,
} from '../js/network.js';
import { Game } from '../js/game.js';
import { GAME } from '../js/config.js';

// ── FakePeer en memoria (API mínima de PeerJS) ───────────────────────────────
class Em {
  constructor() { this.h = {}; }
  on(e, f) { (this.h[e] ??= []).push(f); return this; }
  off(e, f) { this.h[e] = (this.h[e] ?? []).filter((x) => x !== f); return this; }
  emit(e, ...a) { for (const f of [...(this.h[e] ?? [])]) f(...a); }
}
const defer = (fn) => setTimeout(fn, 0);

function makeFakePeer(net = new Map()) {
  let auto = 0;
  class FakeConn extends Em {
    constructor(peerId) { super(); this.peer = peerId; this.open = false; this.pair = null; this.sent = []; }
    send(data) { this.sent.push(data); const p = this.pair; defer(() => { if (p.open) p.emit('data', data); }); }
    close() {
      if (!this.open) return;
      this.open = false;
      const p = this.pair;
      this.emit('close');
      defer(() => { if (p.open) { p.open = false; p.emit('close'); } });
    }
  }
  class FakePeer extends Em {
    constructor(id) {
      super();
      this.id = typeof id === 'string' ? id : `anon-${++auto}`;
      this.destroyed = false; this.disconnected = false; this.conns = [];
      defer(() => {
        if (net.has(this.id)) { this.emit('error', Object.assign(new Error('taken'), { type: 'unavailable-id' })); return; }
        net.set(this.id, this);
        this.emit('open', this.id);
      });
    }
    connect(remoteId) {
      const local = new FakeConn(remoteId);
      defer(() => {
        const remote = net.get(remoteId);
        if (!remote || remote.destroyed) { this.emit('error', Object.assign(new Error('nope'), { type: 'peer-unavailable' })); return; }
        const rc = new FakeConn(this.id);
        local.pair = rc; rc.pair = local;
        this.conns.push(local); remote.conns.push(rc);
        remote.emit('connection', rc);
        local.open = rc.open = true;
        local.emit('open'); rc.emit('open');
      });
      return local;
    }
    destroy() {
      this.destroyed = true;
      for (const c of this.conns) c.close();
      if (net.get(this.id) === this) net.delete(this.id);
      this.emit('close');
    }
  }
  FakePeer.net = net;
  return FakePeer;
}

const wait = (ms = 15) => new Promise((r) => setTimeout(r, ms));
const collect = (em, evt) => { const a = []; em.on(evt, (x) => a.push(x)); return a; };
const memStorage = () => { const m = new Map(); return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v) }; };
const seqRandom = (...vals) => { let i = 0; return () => vals[Math.min(i++, vals.length - 1)]; };

async function room(extra = {}) {
  const Peer = makeFakePeer();
  const host = new HostNetwork({ Peer, ...extra });
  const code = await host.open();
  const mk = (name = 'Ana', o = {}) => new ClientNetwork({ Peer, storage: memStorage(), name, baseDelayMs: 1, maxDelayMs: 5, ...o });
  return { Peer, host, code, mk };
}

// ── codec ────────────────────────────────────────────────────────────────────
test('encode/decode/validate: roundtrip y rechazos', () => {
  const s = encode({ t: MSG.READY, ready: true });
  assert.deepEqual(decode(s), { t: 'ready', v: 1, ready: true });
  assert.equal(decode('no json'), null);
  assert.equal(decode(JSON.stringify({ t: 'ready', v: 2, ready: true })), null);
  assert.equal(decode(JSON.stringify({ t: 'ready', v: 1, ready: 'si' })), null);
  assert.equal(decode(JSON.stringify({ t: 'pick', v: 1, characterId: 'hacker' })), null);
  assert.equal(decode(JSON.stringify({ t: 'zzz', v: 1 })), null);
  assert.equal(decode(JSON.stringify({ t: '__proto__', v: 1 })), null);
  assert.equal(decode(42), null);
  assert.equal(decode(null), null);
  assert.equal(decode(JSON.stringify([1, 2])), null);
  assert.equal(validate({ t: 'roll', v: 1, extra: 'x' }).msg.extra, undefined);
  // Nuevos tipos de mensaje para opción 2: Desafíos éticos
  const ch = encode({
    t: MSG.CHALLENGE,
    playerId: 'p1',
    jump: { from: 4, to: 25, kind: 'ladder', label: 'Limpieza' },
    card: { id: 'c1', title: 'Test', prompt: 'Q', options: ['A', 'B', 'C', 'D'] },
    timeoutMs: 30000,
  });
  assert.equal(decode(ch).card.id, 'c1');
  const ans = encode({ t: MSG.ANSWER, cardId: 'c1', selectedIndex: 2 });
  assert.deepEqual(decode(ans), { t: 'answer', v: 1, cardId: 'c1', selectedIndex: 2 });
  const res = encode({
    t: MSG.CHALLENGE_RESULT,
    playerId: 'p1',
    cardId: 'c1',
    correct: true,
    selectedIndex: 2,
    correctIndex: 2,
    explanation: 'Expl',
    tip: 'Tip',
    outcome: 'climb',
    newPosition: 25,
  });
  assert.equal(decode(res).outcome, 'climb');
  assert.throws(() => encode({ t: 'pick' }));
  const big = JSON.stringify({ t: 'hello', v: 1, clientId: 'abcdefgh', name: 'x'.repeat(MAX_MESSAGE_BYTES) });
  assert.equal(decode(big), null);
  assert.ok(Object.isFrozen(MSG));
});

test('sanitizeName: sin HTML, máx 16, fallback', () => {
  assert.equal(sanitizeName('<img src=x onerror=alert(1)>'), 'img src=x onerro');
  assert.equal(sanitizeName('  a   b  '), 'a b');
  assert.equal(sanitizeName('x'.repeat(50)).length, 16);
  assert.equal(sanitizeName('<>'), 'Jugador');
  assert.equal(sanitizeName(undefined), 'Jugador');
});

test('backoffDelay crece exponencialmente con jitter y tope', () => {
  const lo = (a) => backoffDelay(a, { base: 100, max: 1000, random: () => 0 });
  const hi = (a) => backoffDelay(a, { base: 100, max: 1000, random: () => 1 });
  assert.equal(lo(1), 50); assert.equal(hi(1), 100);
  assert.equal(hi(3), 400);
  assert.equal(hi(10), 1000);
  assert.ok(lo(4) >= hi(2));
});

test('clientId: persiste en storage y cae a memoria si storage lanza', () => {
  const st = memStorage();
  assert.equal(getClientId({ storage: st }), getClientId({ storage: st }));
  const broken = { getItem() { throw new Error('denied'); }, setItem() { throw new Error('denied'); } };
  const c = new ClientNetwork({ Peer: makeFakePeer(), storage: broken });
  assert.match(c.clientId, /^[A-Za-z0-9_-]{8,64}$/);
  assert.doesNotThrow(() => getClientId({ storage: null }));
});

// ── host/cliente ─────────────────────────────────────────────────────────────
test('open(): código válido y reintento si el id está tomado', async () => {
  const Peer = makeFakePeer();
  const first = new HostNetwork({ Peer, random: () => 0 });
  assert.equal(await first.open(), 'AAAA');
  const second = new HostNetwork({ Peer, random: seqRandom(0, 0, 0, 0, 1 / 32, 1 / 32, 1 / 32, 1 / 32) });
  assert.equal(await second.open(), 'BBBB');
  assert.ok(Peer.net.has(`${GAME.peerPrefix}BBBB`));
  first.close(); second.close();
  assert.equal(Peer.net.size, 0);
});

test('hello → player-connect → welcome', async () => {
  const { host, code, mk } = await room();
  const connects = collect(host, 'player-connect');
  const c = mk('<b>Ana</b>');
  const msgs = collect(c, 'message');
  host.on('player-connect', ({ playerId }) => host.sendWelcome(playerId, { phase: 'lobby', players: [], version: 1 }));
  await c.join(code.toLowerCase());
  await wait();
  assert.equal(connects.length, 1);
  assert.equal(connects[0].playerId, c.clientId);
  assert.equal(connects[0].name, 'bAna/b');
  assert.equal(msgs[0].t, MSG.WELCOME);
  assert.equal(msgs[0].playerId, c.clientId);
  c.close(); host.close();
});

test('join a sala inexistente rechaza; código malformado rechaza', async () => {
  const { Peer, host, mk } = await room();
  const c = mk();
  await assert.rejects(c.join('ZZZZ'), (e) => e.code === 'room_not_found');
  await assert.rejects(mk().join('!!'), /inválido/);
  host.close();
  void Peer;
});

test('mensajes malformados se descartan; nada llega a "message"', async () => {
  const { host, code, mk } = await room();
  const got = collect(host, 'message');
  const c = mk();
  await c.join(code);
  await wait();
  const raw = c._conn;
  const before = host.dropped;
  raw.send('{{{ no json');
  raw.send(JSON.stringify({ t: 'pick', v: 1, characterId: 'nope' }));
  raw.send(JSON.stringify({ t: 'welcome', v: 1, playerId: 'x', state: {} })); // tipo solo-host
  raw.send(JSON.stringify({ t: 'ready', v: 1, ready: true, pad: 'x'.repeat(3000) }));
  raw.send(12345);
  await wait();
  assert.equal(got.length, 0);
  assert.equal(host.dropped - before, 5);
  c.send({ t: MSG.READY, ready: true });
  await wait();
  assert.equal(got.length, 1);
  assert.deepEqual(got[0].msg, { t: 'ready', v: 1, ready: true });
  c.close(); host.close();
});

test('mensajes antes de hello se descartan', async () => {
  const { Peer, host, code } = await room();
  const got = collect(host, 'message');
  const p = new Peer();
  await wait();
  const conn = p.connect(GAME.peerPrefix + code);
  await wait();
  conn.send(encode({ t: MSG.ROLL }));
  await wait();
  assert.equal(got.length, 0);
  assert.equal(host.dropped, 1);
  host.close();
});

test('roll fuera de turno: el host (con Game) responde error y no mueve', async () => {
  const { host, code, mk } = await room({ rollIntervalMs: 0 });
  const game = new Game({ rng: () => 0.5 });
  host.on('player-connect', ({ playerId, name }) => {
    const ids = ['scientist', 'analyst'];
    game.addPlayer({ id: playerId, name, characterId: ids[game.state.players.length] });
    game.setReady(playerId, true);
  });
  host.on('message', ({ playerId, msg }) => {
    if (msg.t !== MSG.ROLL) return;
    try { host.send(playerId, { t: MSG.ROLLED, result: game.roll(playerId) }); }
    catch (e) { host.send(playerId, { t: MSG.ERROR, code: e.code, message: e.message }); }
  });
  const a = mk('A'); const b = mk('B');
  const ma = collect(a, 'message'); const mb = collect(b, 'message');
  await a.join(code); await b.join(code);
  await wait();
  game.start();
  b.send({ t: MSG.ROLL }); // no es su turno
  await wait();
  assert.equal(mb.length, 1);
  assert.equal(mb[0].t, MSG.ERROR);
  assert.equal(mb[0].code, 'not_your_turn');
  assert.ok(game.state.players.every((p) => p.position === 0));
  a.send({ t: MSG.ROLL });
  await wait();
  assert.equal(ma[0].t, MSG.ROLLED);
  assert.equal(ma[0].result.dice, 4);
  a.close(); b.close(); host.close();
});

test('rate-limit de roll (1/400ms)', async () => {
  let t = 1000;
  const { host, code, mk } = await room({ now: () => t });
  const got = collect(host, 'message');
  const c = mk();
  const errs = collect(c, 'message');
  await c.join(code);
  await wait();
  c.send({ t: MSG.ROLL });
  c.send({ t: MSG.ROLL });
  await wait();
  assert.equal(got.length, 1);
  assert.equal(errs.filter((m) => m.t === MSG.ERROR && m.code === 'rate_limited').length, 1);
  t += 401;
  c.send({ t: MSG.ROLL });
  await wait();
  assert.equal(got.length, 2);
  c.close(); host.close();
});

test('ping → pong sin llegar a message; broadcast', async () => {
  const { host, code, mk } = await room();
  const hostMsgs = collect(host, 'message');
  const a = mk(); const b = mk('Bea');
  const ma = collect(a, 'message'); const mb = collect(b, 'message');
  await a.join(code); await b.join(code);
  await wait();
  a.send({ t: MSG.PING, ts: 7 });
  host.broadcast({ t: MSG.STATE, state: { version: 3 } });
  await wait();
  assert.equal(hostMsgs.length, 0);
  assert.ok(!ma.some((m) => m.t === MSG.PONG)); // pong consumido internamente
  assert.equal(ma[0].state.version, 3);
  assert.equal(mb[0].state.version, 3);
  a.close(); b.close(); host.close();
});

test('reconexión: mismo clientId, reconnecting y player-connect con reconnect:true', async () => {
  const { host, code, mk } = await room();
  const pc = collect(host, 'player-connect');
  const pd = collect(host, 'player-disconnect');
  const c = mk();
  const rec = collect(c, 'reconnecting');
  const opens = collect(c, 'open');
  await c.join(code);
  await wait();
  const id = c.clientId;
  host._sessions.get(id).conn.close(); // el host corta la conexión de datos
  await wait(60);
  assert.ok(rec.length >= 1);
  assert.equal(opens.length, 2);
  assert.equal(opens[1].reconnect, true);
  assert.equal(pc.length, 2);
  assert.equal(pc[1].reconnect, true);
  assert.equal(pc[1].playerId, id);
  assert.equal(pd.length, 1);
  assert.equal(c.send({ t: MSG.READY, ready: true }), true);
  c.close(); host.close();
});

test('cierre limpio: sin reconexión tras close(), host cae y cliente emite close', async () => {
  const { Peer, host, code, mk } = await room();
  const c = mk();
  const closes = collect(c, 'close');
  const rec = collect(c, 'reconnecting');
  await c.join(code);
  await wait();
  c.close();
  await wait(30);
  assert.equal(closes.length, 1);
  assert.equal(rec.length, 0);
  assert.equal(c.send({ t: MSG.PING, ts: 1 }), false);
  host.close();
  assert.equal(Peer.net.size, 0);
  host.close(); c.close(); // idempotente
});
