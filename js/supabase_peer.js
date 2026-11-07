// supabase_peer.js — transporte por Supabase Realtime (Broadcast + Presence) con la misma superficie que PeerJS.
//
// Por qué: WebRTC P2P no atraviesa el NAT simétrico de 4G/5G sin TURN. Aquí todo viaja por un canal de
// Realtime (WebSocket saliente, funciona en cualquier red). La pantalla sigue siendo la autoridad; el canal
// solo reenvía mensajes. `network.js` no cambia: recibe esta clase como `Peer`.
//
// Protocolo (evento Broadcast 'p', payload {k, from, to, d}):
//   open   cliente→host  "quiero conectar"  (se reintenta hasta recibir accept)
//   accept host→cliente  conexión abierta
//   data   ambos         d = cadena JSON de network.js
//   close  ambos         cierre limpio
// Presence: el host se anuncia con su id (detecta código ocupado) y los clientes también (detectar caídas).
// OJO: la presencia es eventualmente consistente; la existencia de la sala se decide por el apretón open/accept.

const EVT = 'p';
const defer = (fn) => setTimeout(fn, 0);
const rid = () => Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
const mkErr = (msg, type) => Object.assign(new Error(msg), { type });

class Emitter {
  constructor() { this._h = {}; }
  on(e, f) { (this._h[e] ??= []).push(f); return this; }
  off(e, f) { this._h[e] = (this._h[e] ?? []).filter((x) => x !== f); return this; }
  emit(e, ...a) { for (const f of [...(this._h[e] ?? [])]) { try { f(...a); } catch (err) { console.error('[supabase_peer]', err); } } }
}

/**
 * Crea la clase `Peer` respaldada por Supabase Realtime.
 * @param {{client?:object, createClient?:Function, url?:string, key?:string,
 *          openRetryMs?:number, notFoundMs?:number, syncTimeoutMs?:number, joinTimeoutMs?:number}} o
 *   Pasa `client` ya creado (tests) o `createClient`+`url`+`key` (navegador: `supabase.createClient`).
 * @returns {typeof Emitter} clase compatible con `new Peer(id, opts)`
 */
export function makeSupabasePeer({ client, createClient, url, key, openRetryMs = 1500, notFoundMs = 7000, syncTimeoutMs = 2500, joinTimeoutMs = 10000 } = {}) {
  if (!client && typeof createClient !== 'function') throw new Error('Supabase no está disponible (falta client o createClient/url/key)');
  // supabase-js admite UN canal por tópico y cliente: cada Peer crea el suyo (en la práctica, uno por página).
  // Con `client` inyectado (tests) se comparte.
  const makeClient = () => client ?? createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    realtime: { params: { eventsPerSecond: 40 } },
  });

  class Conn extends Emitter {
    constructor(owner, remoteId) {
      super();
      this.peer = remoteId; this.open = false; this._owner = owner; this._closed = false; this._retry = null; this._nf = null;
    }
    send(data) { if (this.open && !this._closed) this._owner._sendTo(this.peer, 'data', data); }
    close() {
      if (this._closed) return;
      if (this.open) this._owner._sendTo(this.peer, 'close');
      this._finish();
    }
    _finish() {
      if (this._closed) return;
      this._closed = true; this.open = false; clearTimeout(this._retry); clearTimeout(this._nf);
      if (this._owner._conns.get(this.peer) === this) this._owner._conns.delete(this.peer);
      this.emit('close');
    }
  }

  return class SupabasePeer extends Emitter {
    /** @param {string|undefined} id con id = host (sala); sin id = cliente anónimo */
    constructor(id) {
      super();
      this._isHost = typeof id === 'string';
      this.id = this._isHost ? id : `c-${rid()}`;
      this.destroyed = false; this.disconnected = false;
      this._sb = makeClient();
      this._conns = new Map(); this._ch = null; this._room = null; this._ready = false;
      defer(() => (this._isHost ? this._openHost() : this.emit('open', this.id)));
    }

    // ── API estilo PeerJS ─────────────────────────────────────────────────────
    connect(remoteId) {
      const conn = new Conn(this, remoteId);
      this._conns.set(remoteId, conn);
      this._startClient(remoteId, conn);
      return conn;
    }

    destroy() {
      if (this.destroyed) return;
      this.destroyed = true;
      for (const c of [...this._conns.values()]) c.close();
      const ch = this._ch; this._ch = null;
      if (ch) { try { ch.untrack?.(); } catch { /* ignore */ } try { this._sb.removeChannel(ch); } catch { /* ignore */ } }
      if (!client) { try { this._sb.removeAllChannels?.(); } catch { /* ignore */ } }
      this.emit('close');
    }

    async reconnect() {
      if (this.destroyed || !this._room) return;
      const old = this._ch; this._ch = null;
      if (old) { try { this._sb.removeChannel(old); } catch { /* ignore */ } }
      try {
        await this._join(this._room);
        await this._ch.track({ role: this._isHost ? 'host' : 'client', t: Date.now() });
        this.disconnected = false;
        this.emit('open', this.id);
      } catch (e) { this.emit('error', mkErr(e.message, 'network')); }
    }

    // ── Anfitrión ─────────────────────────────────────────────────────────────
    async _openHost() {
      try {
        await this._join(this.id);
        if (this.destroyed) return;
        if (Object.keys(this._ch.presenceState()).includes(this.id)) {
          this.emit('error', mkErr(`El id ${this.id} ya está en uso`, 'unavailable-id'));
          return;
        }
        await this._ch.track({ role: 'host', t: Date.now() });
        if (!this.destroyed) this.emit('open', this.id);
      } catch (e) { if (!this.destroyed) this.emit('error', mkErr(e.message, 'network')); }
    }

    // ── Cliente ───────────────────────────────────────────────────────────────
    async _startClient(hostId, conn) {
      try {
        if (!this._ch) {
          await this._join(hostId);
          await this._ch.track({ role: 'client', t: Date.now() });
        }
        if (this.destroyed || conn._closed) return;
        // La presencia es eventualmente consistente (puede tardar segundos): NO sirve para decidir que la sala
        // no existe. Se reintenta "open" y, si nadie responde "accept" a tiempo, se informa peer-unavailable.
        conn._nf = setTimeout(() => {
          if (!this.destroyed && !conn.open && !conn._closed) this.emit('error', mkErr(`No existe la sala ${hostId}`, 'peer-unavailable'));
        }, notFoundMs);
        const attempt = () => {
          if (this.destroyed || conn._closed || conn.open) return;
          this._sendTo(hostId, 'open');
          conn._retry = setTimeout(attempt, openRetryMs);
        };
        attempt();
      } catch (e) { if (!this.destroyed) this.emit('error', mkErr(e.message, 'network')); }
    }

    // ── Canal ─────────────────────────────────────────────────────────────────
    _join(room) {
      this._room = room;
      return new Promise((resolve, reject) => {
        const ch = this._sb.channel(`gl:${room}`, { config: { broadcast: { self: false, ack: false }, presence: { key: this.id } } });
        this._ch = ch;
        let subscribed = false, synced = false, done = false, syncTimer = null;
        const finish = (err) => {
          if (done) return;
          done = true; clearTimeout(syncTimer); clearTimeout(joinTimer);
          if (err) reject(err); else { this._ready = true; resolve(); }
        };
        const joinTimer = setTimeout(() => finish(mkErr('Tiempo agotado conectando con Realtime', 'network')), joinTimeoutMs);
        ch.on('broadcast', { event: EVT }, ({ payload }) => this._onMsg(payload));
        ch.on('presence', { event: 'sync' }, () => { synced = true; if (subscribed) finish(); });
        ch.on('presence', { event: 'leave' }, ({ key }) => this._onLeave(key));
        ch.subscribe((status) => {
          if (ch !== this._ch) return; // canal obsoleto
          if (status === 'SUBSCRIBED') {
            subscribed = true;
            if (!done) { if (synced) finish(); else syncTimer = setTimeout(finish, syncTimeoutMs); }
            else if (this.disconnected) { // Realtime reconectó solo: re-anunciarse
              this.disconnected = false;
              ch.track({ role: this._isHost ? 'host' : 'client', t: Date.now() }).catch(() => {});
            }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (!done) finish(mkErr(`Realtime: ${status}`, 'network'));
            else if (!this.destroyed && !this.disconnected) { this.disconnected = true; this.emit('disconnected'); }
          }
        });
      });
    }

    _sendTo(to, k, d) {
      const ch = this._ch;
      if (!ch || this.destroyed) return;
      Promise.resolve(ch.send({ type: 'broadcast', event: EVT, payload: { k, from: this.id, to, d } })).catch(() => {});
    }

    _onMsg(m) {
      if (!m || typeof m !== 'object' || m.to !== this.id || typeof m.from !== 'string') return;
      const conn = this._conns.get(m.from);
      switch (m.k) {
        case 'open': { // solo anfitrión
          if (!this._isHost) return;
          if (conn && !conn._closed) { if (conn.open) this._sendTo(m.from, 'accept'); return; } // reintento del cliente
          const c = new Conn(this, m.from);
          this._conns.set(m.from, c);
          this.emit('connection', c);
          c.open = true;
          this._sendTo(m.from, 'accept');
          c.emit('open');
          return;
        }
        case 'accept':
          if (conn && !conn.open && !conn._closed) { conn.open = true; clearTimeout(conn._retry); clearTimeout(conn._nf); conn.emit('open'); }
          return;
        case 'data':
          if (conn?.open) conn.emit('data', m.d);
          return;
        case 'close':
          conn?._finish();
          return;
        default:
      }
    }

    _onLeave(key) { this._conns.get(key)?._finish(); }
  };
}

/**
 * Lee config/supabase.json ({url, key}). Devuelve null si falta o es inválido.
 * @param {{url?:string, fetchFn?:typeof fetch, timeoutMs?:number}} [o]
 */
export async function loadSupabaseConfig({ url = 'config/supabase.json', fetchFn = globalThis.fetch, timeoutMs = 3000 } = {}) {
  if (typeof fetchFn !== 'function') return null;
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctl ? setTimeout(() => ctl.abort(), timeoutMs) : null;
  try {
    const res = await fetchFn(url, { cache: 'no-cache', signal: ctl?.signal });
    if (!res.ok) return null;
    const cfg = await res.json();
    if (typeof cfg?.url !== 'string' || !/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(cfg.url)) return null;
    if (typeof cfg?.key !== 'string' || !/^(sb_publishable_|eyJ)/.test(cfg.key)) return null;
    return { url: cfg.url.replace(/\/$/, ''), key: cfg.key };
  } catch { return null; } finally { if (timer) clearTimeout(timer); }
}

/**
 * Elige el transporte: Supabase Realtime si hay config + librería; si no, PeerJS (WebRTC).
 * `?transport=peerjs` fuerza PeerJS (diagnóstico).
 * @returns {Promise<{Peer:Function|undefined, transport:'supabase'|'peerjs'}>}
 */
export async function resolvePeerClass({ search = globalThis.location?.search ?? '', g = globalThis } = {}) {
  const forced = new URLSearchParams(search).get('transport');
  if (forced !== 'peerjs') {
    const cfg = await loadSupabaseConfig();
    const create = g.supabase?.createClient;
    if (cfg && typeof create === 'function') {
      return { Peer: makeSupabasePeer({ createClient: create, url: cfg.url, key: cfg.key }), transport: 'supabase' };
    }
  }
  return { Peer: g.Peer, transport: 'peerjs' };
}
