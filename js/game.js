// game.js — motor lógico puro (sin DOM, sin Three.js). Testeable en Node.
import { GAME, CHARACTERS, BOARD, LADDERS, SNAKES } from './config.js';

const PITCH = BOARD.tileSize + BOARD.gap;
const MAX_NAME = 16;
const MAX_CONSECUTIVE_EXTRA = 2; // 6 → turno extra, máx. 2 seguidos; el 3er 6 pierde el turno

/** Mapa casilla de origen → salto (escalera o serpiente). */
const JUMPS = new Map([
  ...LADDERS.map((l) => [l.from, { to: l.to, kind: 'ladder', label: l.label }]),
  ...SNAKES.map((s) => [s.from, { to: s.to, kind: 'snake', label: s.label }]),
]);

/** Error del motor con un `code` estable para que la red lo traduzca. */
export class GameError extends Error {
  /** @param {string} code @param {string} message */
  constructor(code, message) {
    super(message);
    this.name = 'GameError';
    this.code = code;
  }
}

function assertTile(n) {
  if (!Number.isInteger(n) || n < 0 || n > BOARD.tiles) {
    throw new RangeError(`Casilla inválida: ${n} (se esperaba entero 0..${BOARD.tiles})`);
  }
}

/**
 * Posición en el plano XZ de la casilla `n` (0 = fuera del tablero).
 * Numeración serpentina: fila 0 (abajo) va →, la siguiente ←, etc.
 * @param {number} n entero 0..100
 * @returns {{x:number, z:number}}
 */
export function tileToXZ(n) {
  assertTile(n);
  if (n === 0) return { x: -5.5 * PITCH - 0.6, z: 4.5 * PITCH };
  const i = n - 1;
  const row = Math.floor(i / BOARD.size);
  const colInRow = i % BOARD.size;
  const col = row % 2 === 0 ? colInRow : BOARD.size - 1 - colInRow;
  return { x: (col - 4.5) * PITCH, z: (4.5 - row) * PITCH };
}

/**
 * Posición 3D de pisada (y = parte superior del bloque).
 * @param {number} n entero 0..100
 * @returns {{x:number, y:number, z:number}}
 */
export function tileToPosition(n) {
  const { x, z } = tileToXZ(n);
  return { x, y: BOARD.tileHeight, z };
}

/**
 * Resuelve escalera/serpiente al caer en `n`.
 * @param {number} n
 * @returns {{to:number, kind:'ladder'|'snake'|null, label:string|null}}
 */
export function resolveJump(n) {
  const j = JUMPS.get(n);
  return j ? { to: j.to, kind: j.kind, label: j.label } : { to: n, kind: null, label: null };
}

/**
 * Motor de juego. Reglas:
 *  - Meta exacta en 100: si `from + dado > 100` la ficha avanza hasta 100 y rebota:
 *    `target = 100 - (from + dado - 100)`. Si cae exacto en 100, gana.
 *  - Un 6 da turno extra (máx. 2 seguidos); el 3er 6 consecutivo no mueve y pierde el turno.
 *  - Los jugadores marcados como desconectados se saltan al rotar el turno.
 *
 * Eventos: 'playerAdded','playerRemoved','started','rolled','moved','jumped','turn','won'.
 */
export class Game {
  /** @param {{rng?: () => number}} [opts] rng debe devolver [0,1). */
  constructor({ rng = Math.random } = {}) {
    this._rng = rng;
    this._players = [];
    this._phase = 'lobby';
    this._turnIndex = 0;
    this._turnNumber = 0;
    this._sixes = 0;
    this._lastRoll = null;
    this._winnerId = null;
    this._version = 0;
    this._listeners = new Map();
  }

  /**
   * Añade un jugador (solo en lobby).
   * @param {{id:string, name:string, characterId:string}} p
   * @returns {object} el jugador creado (copia pública)
   * @throws {GameError} lleno, duplicado, personaje tomado/inválido, partida iniciada
   */
  addPlayer({ id, name, characterId } = {}) {
    if (this._phase !== 'lobby') throw new GameError('not_in_lobby', 'La partida ya comenzó');
    if (typeof id !== 'string' || !id || id.length > 64) throw new GameError('invalid_player', 'id de jugador inválido');
    if (typeof name !== 'string' || !name.trim()) throw new GameError('invalid_player', 'Nombre inválido');
    const character = CHARACTERS.find((c) => c.id === characterId);
    if (!character) throw new GameError('invalid_character', `Personaje inexistente: ${characterId}`);
    if (this._players.some((p) => p.id === id)) throw new GameError('duplicate_player', `Jugador duplicado: ${id}`);
    if (this._players.length >= GAME.maxPlayers) throw new GameError('lobby_full', 'La sala está llena');
    if (this._players.some((p) => p.characterId === characterId)) {
      throw new GameError('character_taken', `Personaje ya elegido: ${characterId}`);
    }
    const player = {
      id, name: name.trim().slice(0, MAX_NAME), characterId,
      color: character.color, position: 0, ready: false, connected: true,
    };
    this._players.push(player);
    this._version++;
    this._emit('playerAdded', this._pub(player));
    return this._pub(player);
  }

  /**
   * Quita un jugador. En partida, si queda un solo jugador gana por abandono.
   * @param {string} id
   * @returns {boolean} true si existía
   */
  removePlayer(id) {
    const idx = this._players.findIndex((p) => p.id === id);
    if (idx < 0) return false;
    const [removed] = this._players.splice(idx, 1);
    this._version++;
    this._emit('playerRemoved', this._pub(removed));
    if (this._phase !== 'playing') return true;

    if (this._players.length < 2) {
      this._phase = 'finished';
      this._winnerId = this._players[0]?.id ?? null;
      this._version++;
      if (this._winnerId) this._emit('won', { playerId: this._winnerId, forfeit: true });
      return true;
    }
    if (idx < this._turnIndex) {
      this._turnIndex--;
    } else if (idx === this._turnIndex) {
      this._turnIndex = (idx - 1 + this._players.length) % this._players.length; // _advance avanzará a idx
      this._sixes = 0;
      this._advance(false);
    }
    return true;
  }

  /** @param {string} id @param {boolean} ready */
  setReady(id, ready) {
    const p = this._get(id);
    if (this._phase !== 'lobby') throw new GameError('not_in_lobby', 'La partida ya comenzó');
    p.ready = !!ready;
    this._version++;
  }

  /** Marca conexión; los desconectados se saltan en el turno. @param {string} id @param {boolean} connected */
  setConnected(id, connected) {
    this._get(id).connected = !!connected;
    this._version++;
  }

  /** true si hay ≥ minPlayers, todos listos y estamos en lobby. */
  get canStart() {
    return this._phase === 'lobby'
      && this._players.length >= GAME.minPlayers
      && this._players.every((p) => p.ready);
  }

  /** Inicia la partida; turno del primer jugador. @throws {GameError} */
  start() {
    if (!this.canStart) throw new GameError('cannot_start', 'No se puede iniciar: faltan jugadores o no todos están listos');
    this._phase = 'playing';
    this._turnIndex = 0;
    this._turnNumber = 1;
    this._sixes = 0;
    this._version++;
    this._emit('started', this.state);
    this._emit('turn', { playerId: this._players[0].id, turnNumber: 1, extra: false });
  }

  /**
   * Tira el dado para `playerId`.
   * @param {string} playerId
   * @returns {{playerId:string, dice:number, from:number, path:number[], landed:number,
   *   jump:{from:number,to:number,kind:string,label:string}|null, final:number,
   *   extraTurn:boolean, won:boolean, bounced:boolean, forfeited:boolean}}
   * @throws {GameError} si no es la fase o el turno
   */
  roll(playerId) {
    if (this._phase !== 'playing') throw new GameError('not_playing', 'La partida no está en curso');
    const player = this._players[this._turnIndex];
    if (!this._players.some((p) => p.id === playerId)) throw new GameError('unknown_player', `Jugador desconocido: ${playerId}`);
    if (player.id !== playerId) throw new GameError('not_your_turn', 'No es tu turno');

    const dice = Math.min(6, Math.max(1, Math.floor(this._rng() * 6) + 1));
    const from = player.position;
    this._sixes = dice === 6 ? this._sixes + 1 : 0;

    const result = {
      playerId, dice, from, path: [], landed: from, jump: null, final: from,
      extraTurn: false, won: false, bounced: false, forfeited: false,
    };

    if (this._sixes > MAX_CONSECUTIVE_EXTRA) {
      result.forfeited = true; // tercer 6: no se mueve y pierde el turno
    } else {
      const raw = from + dice;
      const last = BOARD.tiles;
      if (raw <= last) {
        for (let n = from + 1; n <= raw; n++) result.path.push(n);
        result.landed = raw;
      } else {
        for (let n = from + 1; n <= last; n++) result.path.push(n);
        const target = last - (raw - last);
        for (let n = last - 1; n >= target; n--) result.path.push(n);
        result.landed = target;
        result.bounced = true;
      }
      const j = resolveJump(result.landed);
      if (j.kind) result.jump = { from: result.landed, to: j.to, kind: j.kind, label: j.label };
      result.final = j.to;
      result.won = result.final === last;
      result.extraTurn = dice === 6 && !result.won;
    }

    player.position = result.final;
    this._lastRoll = { ...result, path: [...result.path] };
    this._version++;

    if (result.won) {
      this._phase = 'finished';
      this._winnerId = playerId;
    }

    this._emit('rolled', result);
    if (result.path.length) this._emit('moved', { playerId, from, path: result.path, to: result.landed });
    if (result.jump) this._emit('jumped', { playerId, ...result.jump });
    if (result.won) {
      this._emit('won', { playerId, forfeit: false });
    } else {
      this._advance(result.extraTurn);
    }
    return result;
  }

  /** Snapshot serializable (copia profunda). `version` crece con cada cambio. */
  get state() {
    const turnPlayer = this._phase === 'playing' ? this._players[this._turnIndex] : null;
    return {
      phase: this._phase,
      players: this._players.map((p) => this._pub(p)),
      turnPlayerId: turnPlayer ? turnPlayer.id : null,
      turnNumber: this._turnNumber,
      lastRoll: this._lastRoll ? { ...this._lastRoll, path: [...this._lastRoll.path] } : null,
      winnerId: this._winnerId,
      version: this._version,
    };
  }

  /** @param {string} evt @param {Function} fn @returns {() => void} función para desuscribir */
  on(evt, fn) {
    if (!this._listeners.has(evt)) this._listeners.set(evt, new Set());
    this._listeners.get(evt).add(fn);
    return () => this.off(evt, fn);
  }

  /** @param {string} evt @param {Function} fn */
  off(evt, fn) {
    this._listeners.get(evt)?.delete(fn);
  }

  // ── internos ──────────────────────────────────────────────────────────────
  _get(id) {
    const p = this._players.find((x) => x.id === id);
    if (!p) throw new GameError('unknown_player', `Jugador desconocido: ${id}`);
    return p;
  }

  _pub(p) {
    return { id: p.id, name: p.name, characterId: p.characterId, color: p.color, position: p.position, ready: p.ready, connected: p.connected };
  }

  _advance(extra) {
    if (!extra) {
      const n = this._players.length;
      let next = this._turnIndex;
      for (let i = 1; i <= n; i++) {
        const c = (this._turnIndex + i) % n;
        if (this._players[c].connected || i === n) { next = c; break; }
      }
      this._turnIndex = next;
      this._sixes = 0;
    }
    this._turnNumber++;
    this._version++;
    this._emit('turn', { playerId: this._players[this._turnIndex].id, turnNumber: this._turnNumber, extra });
  }

  _emit(evt, payload) {
    for (const fn of [...(this._listeners.get(evt) ?? [])]) {
      try { fn(payload); } catch (err) { console.error(`[Game] listener de '${evt}' falló:`, err); }
    }
  }
}
