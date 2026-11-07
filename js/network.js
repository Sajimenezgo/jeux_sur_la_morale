// network.js — capa PeerJS (WebRTC). El HOST es la autoridad; los móviles son clientes.
// Sin DOM. `Peer` es inyectable (tests usan un FakePeer en memoria).
import { GAME, CHARACTERS } from './config.js';

export const PROTOCOL_VERSION = 1;
/** Tope de tamaño para mensajes entrantes del cliente (bytes UTF-8). */
export const MAX_MESSAGE_BYTES = 2048;
/** Tope más holgado para mensajes que el cliente recibe del host (snapshots). */
export const MAX_HOST_MESSAGE_BYTES = 32768;
export const MAX_NAME_LENGTH = 16;
export const ROLL_MIN_INTERVAL_MS = 400;

/** Tipos de mensaje. */
export const MSG = Object.freeze({
  HELLO: 'hello', PICK: 'pick', READY: 'ready', ROLL: 'roll', PING: 'ping',
  WELCOME: 'welcome', STATE: 'state', ROLLED: 'rolled', ERROR: 'error', PONG: 'pong',
  CHALLENGE: 'challenge', ANSWER: 'answer', CHALLENGE_RESULT: 'challenge_result',
});

/**
 * STUN públicos por defecto (sobreescribibles con `iceServers`).
 * Los STUN solo bastan cuando ambos dispositivos están en la misma red o tras NAT "amigables".
 * Un móvil en 4G/5G (NAT simétrico del operador) necesita un relevo TURN: ver `js/ice.js`,
 * `config/ice.json` y docs/TURN.md. (No se incluyen TURN públicos: los de Open Relay y PeerJS
 * ya no responden, se comprobó con DNS.)
 */
export const DEFAULT_ICE_SERVERS = Object.freeze([
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun.cloudflare.com:3478' },
]);

const CLIENT_ID_RE = /^[A-Za-z0-9_-]{8,64}$/;
const ROOM_RE = new RegExp(`^[${GAME.roomCodeAlphabet}]{${GAME.roomCodeLength}}$`);
const isObj = (x) => x !== null && typeof x === 'object' && !Array.isArray(x);
const byteLength = (s) => new TextEncoder().encode(s).length;

/**
 * Sanea un nombre: sin HTML/control, espacios colapsados, máx 16 chars. Vacío → 'Jugador'.
 * @param {unknown} raw
 * @returns {string}
 */
export function sanitizeName(raw) {
  const s = String(raw ?? '')
    .replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u2028-\u202e<>&"'`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return Array.from(s).slice(0, MAX_NAME_LENGTH).join('').trim() || 'Jugador';
}

// Esquema por tipo: devuelve el payload limpio o undefined si es inválido.
const SCHEMAS = {
  [MSG.HELLO]: (m) => (typeof m.clientId === 'string' && CLIENT_ID_RE.test(m.clientId) && typeof m.name === 'string'
    ? { clientId: m.clientId, name: sanitizeName(m.name) } : undefined),
  [MSG.PICK]: (m) => (typeof m.characterId === 'string' && CHARACTERS.some((c) => c.id === m.characterId)
    ? { characterId: m.characterId } : undefined),
  [MSG.READY]: (m) => (typeof m.ready === 'boolean' ? { ready: m.ready } : undefined),
  [MSG.ROLL]: () => ({}),
  [MSG.PING]: (m) => (Number.isFinite(m.ts) ? { ts: m.ts } : undefined),
  [MSG.PONG]: (m) => (Number.isFinite(m.ts) ? { ts: m.ts } : undefined),
  [MSG.WELCOME]: (m) => (typeof m.playerId === 'string' && m.playerId && isObj(m.state)
    ? { playerId: m.playerId, state: m.state } : undefined),
  [MSG.STATE]: (m) => (isObj(m.state) ? { state: m.state } : undefined),
  [MSG.ROLLED]: (m) => (isObj(m.result) ? { result: m.result } : undefined),
  [MSG.ERROR]: (m) => (typeof m.code === 'string' && typeof m.message === 'string'
    ? { code: m.code.slice(0, 64), message: m.message.slice(0, 200) } : undefined),
  [MSG.CHALLENGE]: (m) => (isObj(m.card) && isObj(m.jump) && typeof m.playerId === 'string'
    ? { playerId: m.playerId, card: m.card, jump: m.jump, timeoutMs: Number(m.timeoutMs) || 30000 } : undefined),
  [MSG.ANSWER]: (m) => (typeof m.cardId === 'string' && Number.isInteger(m.selectedIndex) && m.selectedIndex >= 0 && m.selectedIndex <= 3
    ? { cardId: m.cardId, selectedIndex: m.selectedIndex } : undefined),
  [MSG.CHALLENGE_RESULT]: (m) => (typeof m.playerId === 'string' && typeof m.cardId === 'string' && typeof m.correct === 'boolean' && typeof m.outcome === 'string'
    ? {
        playerId: m.playerId,
        cardId: m.cardId,
        correct: m.correct,
        selectedIndex: Number.isInteger(m.selectedIndex) ? m.selectedIndex : -1,
        correctIndex: Number.isInteger(m.correctIndex) ? m.correctIndex : 0,
        explanation: String(m.explanation ?? '').slice(0, 500),
        tip: String(m.tip ?? '').slice(0, 300),
        outcome: m.outcome,
        newPosition: Number(m.newPosition) || 0,
      } : undefined),
};

/**
 * Valida estrictamente un mensaje ya parseado. Descarta campos desconocidos y sanea nombres.
 * @param {unknown} msg
 * @returns {{ok:true, msg:object}|{ok:false, error:string}}
 */
export function validate(msg) {
  if (!isObj(msg)) return { ok: false, error: 'no es un objeto' };
  if (msg.v !== PROTOCOL_VERSION) return { ok: false, error: 'versión de protocolo inválida' };
  if (typeof msg.t !== 'string' || !Object.prototype.hasOwnProperty.call(SCHEMAS, msg.t)) {
    return { ok: false, error: 'tipo desconocido' };
  }
  const payload = SCHEMAS[msg.t](msg);
  if (!payload) return { ok: false, error: `payload inválido para '${msg.t}'` };
  return { ok: true, msg: { t: msg.t, v: PROTOCOL_VERSION, ...payload } };
}

/**
 * Serializa un mensaje (añade `v`).
 * @param {{t:string}} msg
 * @returns {string}
 * @throws {Error} si el mensaje no es válido según el esquema
 */
export function encode(msg) {
  const res = validate({ v: PROTOCOL_VERSION, ...msg });
  if (!res.ok) throw new Error(`Mensaje inválido: ${res.error}`);
  return JSON.stringify(res.msg);
}

/**
 * Decodifica y valida datos entrantes (string u objeto). Devuelve null si hay que descartarlo.
 * @param {unknown} raw
 * @param {{maxBytes?: number}} [opts]
 * @returns {object|null}
 */
export function decode(raw, { maxBytes = MAX_MESSAGE_BYTES } = {}) {
  let str;
  if (typeof raw === 'string') str = raw;
  else if (isObj(raw)) {
    try { str = JSON.stringify(raw); } catch { return null; }
  } else return null;
  if (byteLength(str) > maxBytes) return null;
  let parsed;
  try { parsed = JSON.parse(str); } catch { return null; }
  const res = validate(parsed);
  return res.ok ? res.msg : null;
}

/**
 * Retardo de reconexión: backoff exponencial con "equal jitter".
 * @param {number} attempt 1-based
 * @param {{base?:number, max?:number, random?:()=>number}} [o]
 */
export function backoffDelay(attempt, { base = 500, max = 15000, random = Math.random } = {}) {
  const exp = Math.min(max, base * 2 ** Math.max(0, attempt - 1));
  return Math.round(exp / 2 + random() * (exp / 2));
}

/**
 * Genera/recupera un clientId persistente en sessionStorage (fallback en memoria).
 * @param {{storage?: Storage|null, random?: () => number}} [o]
 */
export function getClientId({ storage, random = Math.random } = {}) {
  const KEY = 'gradient-ladders.clientId';
  let store = storage;
  if (store === undefined) {
    try { store = globalThis.sessionStorage ?? null; } catch { store = null; }
  }
  try {
    const found = store?.getItem(KEY);
    if (found && CLIENT_ID_RE.test(found)) return found;
  } catch { /* storage bloqueado */ }
  let id;
  try { id = globalThis.crypto?.randomUUID?.(); } catch { /* ignore */ }
  if (!id) {
    id = Array.from({ length: 24 }, () => Math.floor(random() * 16).toString(16)).join('');
  }
  try { store?.setItem(KEY, id); } catch { /* fallback en memoria: el id vive en la instancia */ }
  return id;
}

class Emitter {
  constructor() { this._h = new Map(); }
  /** @param {string} evt @param {Function} fn @returns {() => void} */
  on(evt, fn) {
    if (!this._h.has(evt)) this._h.set(evt, new Set());
    this._h.get(evt).add(fn);
    return () => this.off(evt, fn);
  }
  off(evt, fn) { this._h.get(evt)?.delete(fn); }
  _emit(evt, payload) {
    for (const fn of [...(this._h.get(evt) ?? [])]) {
      try { fn(payload); } catch (err) { console.error(`[net] handler '${evt}' falló:`, err); }
    }
  }
}

function makePeerOptions({ iceServers, peerOptions }) {
  const o = peerOptions ?? {};
  return { debug: 0, ...o, config: { iceServers: iceServers ?? DEFAULT_ICE_SERVERS, ...(o.config ?? {}) } };
}

function unref(timer) { timer?.unref?.(); return timer; }

/**
 * Red del lado HOST (index.html). Crea el Peer `peerPrefix + CODE` y acepta mandos.
 * Eventos: 'player-connect' {playerId,name,reconnect}, 'player-disconnect' {playerId},
 * 'message' {playerId,msg} (pick/ready/roll), 'error' (Error).
 * Mensajes inválidos se descartan (contador `dropped`). El host responde `pong` solo.
 * El `playerId` es el `clientId` del móvil (estable entre reconexiones).
 */
export class HostNetwork extends Emitter {
  /**
   * @param {{Peer?:Function, peerOptions?:object, iceServers?:object[], random?:()=>number,
   *   now?:()=>number, maxCodeAttempts?:number, rollIntervalMs?:number,
   *   heartbeatMs?:number, timeoutMs?:number}} [o]
   */
  constructor({ Peer = globalThis.Peer, peerOptions, iceServers, random = Math.random, now = () => Date.now(),
    maxCodeAttempts = 10, rollIntervalMs = ROLL_MIN_INTERVAL_MS, heartbeatMs = 5000, timeoutMs = 20000 } = {}) {
    super();
    this._Peer = Peer;
    this._opts = makePeerOptions({ iceServers, peerOptions });
    this._random = random;
    this._now = now;
    this._maxCodeAttempts = maxCodeAttempts;
    this._rollInterval = rollIntervalMs;
    this._heartbeatMs = heartbeatMs;
    this._timeoutMs = timeoutMs;
    this._peer = null;
    this._sessions = new Map(); // playerId → {conn, name, lastRoll, lastSeen}
    this._closed = false;
    this._known = new Set(); // clientIds vistos (para marcar reconexiones)
    this._timers = new Set();
    this.roomCode = null;
    /** Mensajes descartados por inválidos / sobredimensionados / sin hello. */
    this.dropped = 0;
  }

  /** Genera un código de sala aleatorio. */
  _newCode() {
    const a = GAME.roomCodeAlphabet;
    let c = '';
    for (let i = 0; i < GAME.roomCodeLength; i++) c += a[Math.min(a.length - 1, Math.floor(this._random() * a.length))];
    return c;
  }

  /**
   * Abre la sala. Reintenta con otro código si el id está tomado.
   * @returns {Promise<string>} código de sala
   */
  async open() {
    if (typeof this._Peer !== 'function') throw new Error('PeerJS no está disponible (global Peer)');
    for (let i = 0; i < this._maxCodeAttempts; i++) {
      const code = this._newCode();
      try {
        await this._tryOpen(code);
        this.roomCode = code;
        return code;
      } catch (err) {
        if (err?.type !== 'unavailable-id') throw err;
      }
    }
    throw new Error('No se pudo reservar un código de sala');
  }

  _tryOpen(code) {
    return new Promise((resolve, reject) => {
      const peer = new this._Peer(GAME.peerPrefix + code, this._opts);
      let opened = false;
      peer.on('open', () => {
        opened = true;
        this._peer = peer;
        this._wirePeer(peer);
        this._startHeartbeat();
        resolve();
      });
      peer.on('error', (err) => {
        if (!opened) { try { peer.destroy(); } catch { /* ya destruido */ } reject(err); }
        else this._emit('error', err);
      });
    });
  }

  _wirePeer(peer) {
    peer.on('connection', (conn) => this._onConnection(conn));
    peer.on('disconnected', () => {
      // Se perdió la señalización (no las conexiones de datos): reintentar.
      let attempt = 0;
      const retry = () => {
        if (this._closed || peer.destroyed || !peer.disconnected) return;
        attempt++;
        try { peer.reconnect(); } catch (e) { this._emit('error', e); }
        this._later(retry, backoffDelay(attempt, { random: this._random }));
      };
      this._later(retry, backoffDelay(1, { random: this._random }));
    });
  }

  _later(fn, ms) {
    const t = unref(setTimeout(() => { this._timers.delete(t); fn(); }, ms));
    this._timers.add(t);
  }

  _startHeartbeat() {
    const t = unref(setInterval(() => {
      const t0 = this._now();
      for (const s of this._sessions.values()) {
        if (t0 - s.lastSeen > this._timeoutMs) { try { s.conn.close(); } catch { /* ignore */ } }
      }
    }, this._heartbeatMs));
    this._timers.add(t);
  }

  _onConnection(conn) {
    const ctx = { playerId: null };
    conn.on('data', (raw) => this._onData(conn, ctx, raw));
    conn.on('close', () => this._onClose(conn, ctx));
    conn.on('error', (err) => this._emit('error', err));
  }

  _onData(conn, ctx, raw) {
    const msg = decode(raw);
    if (!msg) { this.dropped++; return; }
    if (ctx.playerId === null) {
      if (msg.t !== MSG.HELLO) { this.dropped++; return; } // hay que presentarse primero
      this._onHello(conn, ctx, msg);
      return;
    }
    const session = this._sessions.get(ctx.playerId);
    if (!session || session.conn !== conn) { this.dropped++; return; }
    session.lastSeen = this._now();
    switch (msg.t) {
      case MSG.PING: this._sendTo(conn, { t: MSG.PONG, ts: msg.ts }); break;
      case MSG.ROLL: {
        const now = this._now();
        if (now - session.lastRoll < this._rollInterval) {
          this._sendTo(conn, { t: MSG.ERROR, code: 'rate_limited', message: 'Demasiado rápido' });
          return;
        }
        session.lastRoll = now;
        this._emit('message', { playerId: ctx.playerId, msg });
        break;
      }
      case MSG.PICK: case MSG.READY: case MSG.ANSWER:
        this._emit('message', { playerId: ctx.playerId, msg });
        break;
      default: this.dropped++; // hello repetido o tipos exclusivos del host
    }
  }

  _onHello(conn, ctx, msg) {
    const playerId = msg.clientId;
    const prev = this._sessions.get(playerId);
    ctx.playerId = playerId;
    if (prev && prev.conn !== conn) {
      this._sessions.delete(playerId); // reemplaza la conexión vieja sin emitir disconnect
      try { prev.conn.close(); } catch { /* ignore */ }
    }
    this._sessions.set(playerId, { conn, name: msg.name, lastRoll: -Infinity, lastSeen: this._now() });
    const reconnect = this._known.has(playerId);
    this._known.add(playerId);
    this._emit('player-connect', { playerId, name: msg.name, reconnect });
  }

  _onClose(conn, ctx) {
    if (ctx.playerId === null) return;
    const s = this._sessions.get(ctx.playerId);
    if (s && s.conn === conn) {
      this._sessions.delete(ctx.playerId);
      this._emit('player-disconnect', { playerId: ctx.playerId });
    }
  }

  _sendTo(conn, msg) {
    try {
      if (conn.open === false) return false;
      conn.send(encode(msg));
      return true;
    } catch (err) { this._emit('error', err); return false; }
  }

  /** Atajo: envía `welcome` con el snapshot. @param {string} playerId @param {object} state */
  sendWelcome(playerId, state) {
    return this.send(playerId, { t: MSG.WELCOME, playerId, state });
  }

  /** @param {string} playerId @param {{t:string}} msg @returns {boolean} */
  send(playerId, msg) {
    const s = this._sessions.get(playerId);
    return s ? this._sendTo(s.conn, msg) : false;
  }

  /** @param {{t:string}} msg */
  broadcast(msg) {
    for (const s of this._sessions.values()) this._sendTo(s.conn, msg);
  }

  /** @returns {string[]} ids de jugadores conectados */
  get connectedIds() { return [...this._sessions.keys()]; }

  /** Cierre limpio: conexiones, timers y peer. */
  close() {
    if (this._closed) return;
    this._closed = true;
    for (const t of this._timers) { clearTimeout(t); clearInterval(t); }
    this._timers.clear();
    for (const s of this._sessions.values()) { try { s.conn.close(); } catch { /* ignore */ } }
    this._sessions.clear();
    try { this._peer?.destroy(); } catch { /* ignore */ }
    this._peer = null;
  }
}

/**
 * Red del lado CONTROLADOR (mobile.html). Reconecta con backoff exponencial + jitter
 * usando el mismo clientId (sessionStorage). Eventos: 'open' {reconnect}, 'close' {reason},
 * 'message' (msg validado), 'error' (Error), 'reconnecting' {attempt, delay}.
 */
export class ClientNetwork extends Emitter {
  /**
   * @param {{Peer?:Function, peerOptions?:object, iceServers?:object[], storage?:Storage|null,
   *   name?:string, random?:()=>number, baseDelayMs?:number, maxDelayMs?:number,
   *   maxRetries?:number, connectTimeoutMs?:number, heartbeatMs?:number, timeoutMs?:number}} [o]
   */
  constructor({ Peer = globalThis.Peer, peerOptions, iceServers, storage, name = 'Jugador', random = Math.random,
    baseDelayMs = 500, maxDelayMs = 15000, maxRetries = 12, connectTimeoutMs = 20000,
    heartbeatMs = 5000, timeoutMs = 15000 } = {}) {
    super();
    this._Peer = Peer;
    this._opts = makePeerOptions({ iceServers, peerOptions });
    this._random = random;
    this._backoff = { base: baseDelayMs, max: maxDelayMs, random };
    this._maxRetries = maxRetries;
    this._connectTimeout = connectTimeoutMs;
    this._heartbeatMs = heartbeatMs;
    this._timeoutMs = timeoutMs;
    this.clientId = getClientId({ storage, random });
    this.name = sanitizeName(name);
    this.roomCode = null;
    this._peer = null;
    this._conn = null;
    this._closed = false;
    this._everOpen = false;
    this._timers = new Set();
    this._reconnecting = false;
    this._lastSeen = 0;
  }

  /** @returns {boolean} */
  get connected() { return !!this._conn && this._conn.open !== false && this._everOpen && !this._reconnecting; }

  /**
   * Se une a una sala. Resuelve al primer `open`; rechaza si la sala no existe.
   * Después de la primera conexión, las caídas se reintentan solas.
   * @param {string} roomCode
   * @param {{name?: string}} [o]
   */
  async join(roomCode, { name } = {}) {
    if (typeof this._Peer !== 'function') throw new Error('PeerJS no está disponible (global Peer)');
    const code = String(roomCode ?? '').trim().toUpperCase();
    if (!ROOM_RE.test(code)) throw new Error('Código de sala inválido');
    if (name !== undefined) this.name = sanitizeName(name);
    this.roomCode = code;
    this._closed = false;
    try {
      await this._connectOnce();
    } catch (err) {
      this.close();
      throw err;
    }
    this._everOpen = true;
    this._emit('open', { reconnect: false });
  }

  /** Un intento de conexión: asegura peer y abre el DataConnection. */
  async _connectOnce() {
    const peer = await this._ensurePeer();
    return new Promise((resolve, reject) => {
      const conn = peer.connect(GAME.peerPrefix + this.roomCode, { reliable: true, serialization: 'json' });
      let settled = false;
      const done = (err) => {
        if (settled) return;
        settled = true;
        clearTimeout(timer);
        peer.off?.('error', onPeerError);
        if (err) { try { conn.close(); } catch { /* ignore */ } reject(err); }
        else resolve();
      };
      const timer = setTimeout(() => done(Object.assign(new Error('Tiempo de conexión agotado'), { code: 'timeout' })), this._connectTimeout);
      unref(timer);
      const onPeerError = (e) => {
        if (e?.type === 'peer-unavailable') done(Object.assign(new Error('Sala no encontrada'), { code: 'room_not_found', type: e.type }));
      };
      peer.on('error', onPeerError);
      conn.on('open', () => {
        if (settled || this._closed) { try { conn.close(); } catch { /* ignore */ } return; }
        this._conn = conn;
        this._lastSeen = Date.now();
        this._wireConn(conn);
        this._send({ t: MSG.HELLO, clientId: this.clientId, name: this.name });
        this._startHeartbeat();
        done();
      });
      conn.on('error', (e) => done(e instanceof Error ? e : new Error(String(e?.message ?? e))));
      conn.on('close', () => done(new Error('Conexión cerrada antes de abrir')));
    });
  }

  _ensurePeer() {
    if (this._peer && !this._peer.destroyed && !this._peer.disconnected) return Promise.resolve(this._peer);
    if (this._peer && !this._peer.destroyed) { try { this._peer.destroy(); } catch { /* ignore */ } }
    return new Promise((resolve, reject) => {
      const peer = new this._Peer(undefined, this._opts);
      this._peer = peer;
      const timer = unref(setTimeout(() => reject(new Error('Tiempo agotado conectando al servidor de señalización')), this._connectTimeout));
      peer.on('open', () => { clearTimeout(timer); resolve(peer); });
      peer.on('error', (e) => {
        clearTimeout(timer);
        if (this._conn || this._everOpen) this._emit('error', e);
        reject(e instanceof Error ? e : Object.assign(new Error(e?.message ?? String(e)), { type: e?.type }));
      });
    });
  }

  _wireConn(conn) {
    conn.on('data', (raw) => {
      if (conn !== this._conn) return;
      const msg = decode(raw, { maxBytes: MAX_HOST_MESSAGE_BYTES });
      if (!msg) return;
      this._lastSeen = Date.now();
      if (msg.t === MSG.PONG) return;
      this._emit('message', msg);
    });
    conn.on('close', () => { if (conn === this._conn) this._onDrop('conexión cerrada'); });
    conn.on('error', (e) => { if (conn === this._conn) this._emit('error', e); });
  }

  _startHeartbeat() {
    this._stopHeartbeat();
    this._hb = unref(setInterval(() => {
      if (Date.now() - this._lastSeen > this._timeoutMs) {
        const c = this._conn;
        try { c?.close(); } catch { /* ignore */ }
        if (c && c === this._conn) this._onDrop('heartbeat agotado');
        return;
      }
      this._send({ t: MSG.PING, ts: Date.now() });
    }, this._heartbeatMs));
  }

  _stopHeartbeat() { if (this._hb) { clearInterval(this._hb); this._hb = null; } }

  _onDrop() {
    if (this._closed || this._reconnecting) return;
    this._conn = null;
    this._stopHeartbeat();
    this._reconnecting = true;
    this._reconnectLoop();
  }

  async _reconnectLoop() {
    for (let attempt = 1; attempt <= this._maxRetries && !this._closed; attempt++) {
      const delay = backoffDelay(attempt, this._backoff);
      this._emit('reconnecting', { attempt, delay });
      await new Promise((r) => { const t = unref(setTimeout(() => { this._timers.delete(t); r(); }, delay)); this._timers.add(t); });
      if (this._closed) return;
      try {
        await this._connectOnce();
        this._reconnecting = false;
        this._emit('open', { reconnect: true });
        return;
      } catch (err) {
        if (err?.code === 'room_not_found') break; // la sala ya no existe
      }
    }
    this._reconnecting = false;
    if (!this._closed) {
      this._emit('error', new Error('No se pudo reconectar con la sala'));
      this.close('reconexión fallida');
    }
  }

  _send(msg) {
    try {
      if (!this._conn || this._conn.open === false) return false;
      this._conn.send(encode(msg));
      return true;
    } catch (err) { this._emit('error', err); return false; }
  }

  /** @param {{t:string}} msg @returns {boolean} false si no hay conexión abierta */
  send(msg) { return this._send(msg); }

  /** Cierre limpio (no reconecta). */
  close(reason = 'cerrado') {
    if (this._closed) return;
    this._closed = true;
    this._stopHeartbeat();
    for (const t of this._timers) clearTimeout(t);
    this._timers.clear();
    try { this._conn?.close(); } catch { /* ignore */ }
    try { this._peer?.destroy(); } catch { /* ignore */ }
    this._conn = null;
    this._peer = null;
    this._emit('close', { reason });
  }
}
