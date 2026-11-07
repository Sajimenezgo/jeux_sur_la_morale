import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tileToXZ, tileToPosition, resolveJump, Game, GameError } from '../js/game.js';
import { BOARD, LADDERS, SNAKES, GAME, CHARACTERS } from '../js/config.js';

const PITCH = BOARD.tileSize + BOARD.gap;
const near = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} !~ ${b}`);

/** rng que produce los dados indicados en orden. */
const dice = (...vals) => {
  let i = 0;
  return () => (vals[i++] - 1) / 6 + 0.01;
};

function setup(rng, n = 2) {
  const g = new Game({ rng });
  const ids = ['scientist', 'mlengineer', 'statistician', 'analyst', 'engineer', 'auditor'];
  for (let i = 0; i < n; i++) {
    g.addPlayer({ id: `p${i}`, name: `P${i}`, characterId: ids[i] });
    g.setReady(`p${i}`, true);
  }
  g.start();
  return g;
}

// Coloca un jugador en una casilla (vía estado interno; solo para tests).
const place = (g, id, pos) => { g._players.find((p) => p.id === id).position = pos; };

test('serpentina: casillas 1,10,11,20,100', () => {
  const c = (n) => tileToXZ(n);
  near(c(1).x, -4.5 * PITCH);  near(c(1).z, 4.5 * PITCH);
  near(c(10).x, 4.5 * PITCH);  near(c(10).z, 4.5 * PITCH);
  near(c(11).x, 4.5 * PITCH);  near(c(11).z, 3.5 * PITCH);
  near(c(20).x, -4.5 * PITCH); near(c(20).z, 3.5 * PITCH);
  near(c(100).x, -4.5 * PITCH); near(c(100).z, -4.5 * PITCH);
  near(c(0).x, -5.5 * PITCH - 0.6); near(c(0).z, 4.5 * PITCH);
  assert.equal(tileToPosition(37).y, BOARD.tileHeight);
  assert.throws(() => tileToXZ(101), RangeError);
  assert.throws(() => tileToXZ(1.5), RangeError);
});

test('las 100 casillas son únicas y consecutivas son adyacentes', () => {
  const seen = new Set();
  for (let n = 1; n <= 100; n++) {
    const { x, z } = tileToXZ(n);
    seen.add(`${x.toFixed(4)},${z.toFixed(4)}`);
    if (n > 1) {
      const p = tileToXZ(n - 1);
      near(Math.hypot(x - p.x, z - p.z), PITCH);
    }
  }
  assert.equal(seen.size, 100);
});

test('resolveJump: escaleras y serpientes de config', () => {
  for (const l of LADDERS) assert.deepEqual(resolveJump(l.from), { to: l.to, kind: 'ladder', label: l.label });
  for (const s of SNAKES) assert.deepEqual(resolveJump(s.from), { to: s.to, kind: 'snake', label: s.label });
  assert.deepEqual(resolveJump(2), { to: 2, kind: null, label: null });
});

test('roll: escalera 4→25 desde casilla 0 con dado 4', () => {
  const g = setup(dice(4));
  const r = g.roll('p0');
  assert.deepEqual(r.path, [1, 2, 3, 4]);
  assert.equal(r.landed, 4);
  assert.deepEqual(r.jump, { from: 4, to: 25, kind: 'ladder', label: 'Limpieza de datos' });
  assert.equal(r.final, 25);
  assert.equal(g.state.players[0].position, 25);
});

test('roll: serpiente 27→5', () => {
  const g = setup(dice(2));
  place(g, 'p0', 25);
  const r = g.roll('p0');
  assert.equal(r.landed, 27);
  assert.equal(r.jump.kind, 'snake');
  assert.equal(r.final, 5);
});

test('rebote exacto en 100', () => {
  const g = setup(dice(5));
  place(g, 'p0', 98); // 98+5=103 → sube a 100 y rebota a 97
  const r = g.roll('p0');
  assert.equal(r.bounced, true);
  assert.deepEqual(r.path, [99, 100, 99, 98, 97]);
  assert.equal(r.landed, 97);
  assert.equal(r.won, false);
  assert.equal(g.state.players[0].position, 97);
});

test('rebote que cae en serpiente (99 → 41)', () => {
  const g = setup(dice(3));
  place(g, 'p0', 98); // 101 → 99 (serpiente)
  const r = g.roll('p0');
  assert.equal(r.landed, 99);
  assert.equal(r.final, 41);
});

test('victoria con tirada exacta', () => {
  const events = [];
  const g = setup(dice(3));
  g.on('won', (e) => events.push(e));
  place(g, 'p0', 97);
  const r = g.roll('p0');
  assert.equal(r.won, true);
  assert.equal(g.state.phase, 'finished');
  assert.equal(g.state.winnerId, 'p0');
  assert.equal(g.state.turnPlayerId, null);
  assert.deepEqual(events, [{ playerId: 'p0', forfeit: false }]);
  assert.throws(() => g.roll('p1'), (e) => e.code === 'not_playing');
});

test('6 da turno extra (máx 2); el tercero pierde el turno', () => {
  const g = setup(dice(6, 6, 6, 2));
  const r1 = g.roll('p0');
  assert.equal(r1.extraTurn, true);
  assert.equal(g.state.turnPlayerId, 'p0');
  const r2 = g.roll('p0');
  assert.equal(r2.extraTurn, true);
  assert.equal(g.state.turnPlayerId, 'p0');
  const r3 = g.roll('p0');
  assert.equal(r3.forfeited, true);
  assert.equal(r3.extraTurn, false);
  assert.deepEqual(r3.path, []);
  assert.equal(g.state.players[0].position, 12); // 6+6; el 3er 6 no mueve
  assert.equal(g.state.turnPlayerId, 'p1');
  // el contador se reinicia para el siguiente jugador y para p0 más tarde
  g.roll('p1');
  assert.equal(g.state.turnPlayerId, 'p0');
});

test('turnos rotan y se valida el turno', () => {
  const g = setup(dice(1, 1, 1), 3);
  assert.equal(g.state.turnPlayerId, 'p0');
  assert.throws(() => g.roll('p1'), (e) => e instanceof GameError && e.code === 'not_your_turn');
  assert.throws(() => g.roll('nadie'), (e) => e.code === 'unknown_player');
  g.roll('p0');
  assert.equal(g.state.turnPlayerId, 'p1');
  g.roll('p1');
  g.roll('p2');
  assert.equal(g.state.turnPlayerId, 'p0');
});

test('se saltan jugadores desconectados', () => {
  const g = setup(dice(1, 1), 3);
  g.setConnected('p1', false);
  g.roll('p0');
  assert.equal(g.state.turnPlayerId, 'p2');
});

test('eventos en orden y snapshot con version incremental', () => {
  const g = setup(dice(4));
  const seen = [];
  for (const e of ['rolled', 'moved', 'jumped', 'turn', 'won']) g.on(e, () => seen.push(e));
  const v0 = g.state.version;
  g.roll('p0');
  assert.deepEqual(seen, ['rolled', 'moved', 'jumped', 'turn']);
  assert.ok(g.state.version > v0);
  const s = g.state;
  assert.deepEqual(JSON.parse(JSON.stringify(s)), s);
  s.players[0].position = 99; // el snapshot es copia
  assert.notEqual(g.state.players[0].position, 99);
});

test('off() y unsubscribe; listener que lanza no rompe el motor', () => {
  const g = new Game();
  let n = 0;
  const fn = () => n++;
  g.on('playerAdded', fn);
  g.off('playerAdded', fn);
  const quiet = console.error; console.error = () => {};
  g.on('playerAdded', () => { throw new Error('x'); });
  g.addPlayer({ id: 'a', name: 'A', characterId: 'scientist' });
  console.error = quiet;
  assert.equal(n, 0);
  assert.equal(g.state.players.length, 1);
});

test('validaciones: duplicados, personaje repetido/inválido, lleno, inicio', () => {
  const g = new Game();
  g.addPlayer({ id: 'a', name: 'A', characterId: 'scientist' });
  assert.throws(() => g.addPlayer({ id: 'a', name: 'A2', characterId: 'analyst' }), (e) => e.code === 'duplicate_player');
  assert.throws(() => g.addPlayer({ id: 'b', name: 'B', characterId: 'scientist' }), (e) => e.code === 'character_taken');
  assert.throws(() => g.addPlayer({ id: 'b', name: 'B', characterId: 'zzz' }), (e) => e.code === 'invalid_character');
  assert.throws(() => g.addPlayer({ id: 'b', name: '  ', characterId: 'analyst' }), (e) => e.code === 'invalid_player');
  assert.equal(g.canStart, false);
  assert.throws(() => g.start(), (e) => e.code === 'cannot_start');
  assert.throws(() => g.setReady('zz', true), (e) => e.code === 'unknown_player');
  assert.throws(() => g.roll('a'), (e) => e.code === 'not_playing');

  const remainingChars = CHARACTERS.filter((c) => c.id !== 'scientist');
  remainingChars.forEach((c, i) => g.addPlayer({ id: `x${i}`, name: c.name, characterId: c.id }));
  assert.equal(g.state.players.length, GAME.maxPlayers);
  assert.throws(() => g.addPlayer({ id: 'extra', name: 'E', characterId: 'scientist' }), (e) => e.code === 'lobby_full');
});

test('no se puede añadir jugadores con la partida en curso; nombre truncado', () => {
  const g = setup(dice(1));
  assert.throws(() => g.addPlayer({ id: 'late', name: 'L', characterId: 'analyst' }), (e) => e.code === 'not_in_lobby');
  const g2 = new Game();
  const p = g2.addPlayer({ id: 'a', name: 'x'.repeat(40), characterId: 'scientist' });
  assert.equal(p.name.length, 16);
});

test('removePlayer: ajusta turno y gana por abandono', () => {
  const g = setup(dice(1, 1, 1), 3);
  g.removePlayer('p0'); // era su turno → pasa a p1
  assert.equal(g.state.turnPlayerId, 'p1');
  g.removePlayer('p2'); // queda 1 jugador
  assert.equal(g.state.phase, 'finished');
  assert.equal(g.state.winnerId, 'p1');
});

test('determinismo con rng inyectable', () => {
  const mk = () => { let s = 42; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); };
  const play = () => { const g = setup(mk()); const out = []; for (let i = 0; i < 20 && g.state.phase === 'playing'; i++) out.push(g.roll(g.state.turnPlayerId).dice); return out; };
  assert.deepEqual(play(), play());
});

test('interactiveChallenges: escalera 4→25 (acierto sube, fallo se queda en 4)', () => {
  // Caso acierto
  const gClimb = new Game({ rng: dice(4), interactiveChallenges: true });
  gClimb.addPlayer({ id: 'p0', name: 'A', characterId: 'scientist' });
  gClimb.addPlayer({ id: 'p1', name: 'B', characterId: 'engineer' });
  gClimb.setReady('p0', true);
  gClimb.setReady('p1', true);
  gClimb.start();

  const r = gClimb.roll('p0');
  assert.equal(r.pendingChallenge, true);
  assert.equal(gClimb.state.phase, 'challenge');
  assert.equal(gClimb.state.players[0].position, 4);

  const resClimb = gClimb.resolveChallenge('p0', true);
  assert.equal(resClimb.outcome, 'climb');
  assert.equal(resClimb.final, 25);
  assert.equal(gClimb.state.players[0].position, 25);
  assert.equal(gClimb.state.phase, 'playing');
  assert.equal(gClimb.state.turnPlayerId, 'p1');

  // Caso fallo
  const gStay = new Game({ rng: dice(4), interactiveChallenges: true });
  gStay.addPlayer({ id: 'p0', name: 'A', characterId: 'scientist' });
  gStay.addPlayer({ id: 'p1', name: 'B', characterId: 'engineer' });
  gStay.setReady('p0', true);
  gStay.setReady('p1', true);
  gStay.start();

  gStay.roll('p0');
  const resStay = gStay.resolveChallenge('p0', false);
  assert.equal(resStay.outcome, 'stay');
  assert.equal(resStay.final, 4);
  assert.equal(gStay.state.players[0].position, 4);
  assert.equal(gStay.state.turnPlayerId, 'p1');
});

test('interactiveChallenges: serpiente 27→5 (acierto se salva, fallo cae a 5)', () => {
  // Caso acierto (se salva)
  const gSaved = new Game({ rng: dice(2), interactiveChallenges: true });
  gSaved.addPlayer({ id: 'p0', name: 'A', characterId: 'scientist' });
  gSaved.addPlayer({ id: 'p1', name: 'B', characterId: 'engineer' });
  gSaved.setReady('p0', true);
  gSaved.setReady('p1', true);
  gSaved.start();
  place(gSaved, 'p0', 25);

  gSaved.roll('p0');
  assert.equal(gSaved.state.phase, 'challenge');
  const resSaved = gSaved.resolveChallenge('p0', true);
  assert.equal(resSaved.outcome, 'saved');
  assert.equal(resSaved.final, 27);
  assert.equal(gSaved.state.players[0].position, 27);

  // Caso fallo (cae)
  const gFall = new Game({ rng: dice(2), interactiveChallenges: true });
  gFall.addPlayer({ id: 'p0', name: 'A', characterId: 'scientist' });
  gFall.addPlayer({ id: 'p1', name: 'B', characterId: 'engineer' });
  gFall.setReady('p0', true);
  gFall.setReady('p1', true);
  gFall.start();
  place(gFall, 'p0', 25);

  gFall.roll('p0');
  const resFall = gFall.resolveChallenge('p0', false);
  assert.equal(resFall.outcome, 'fall');
  assert.equal(resFall.final, 5);
  assert.equal(gFall.state.players[0].position, 5);
});

test('regla de desplazamiento: ficha que llega a casilla ocupada envía la anterior a casilla 1', () => {
  const g = setup(dice(3, 3));
  place(g, 'p0', 5);
  place(g, 'p1', 2); // p1 tirará 3 y aterrizará en casilla 5 donde está p0

  // Turno de p0 (hace roll y avanza 5+3=8)
  g.roll('p0');
  assert.equal(g.state.players[0].position, 8);
  assert.equal(g.state.turnPlayerId, 'p1');

  // Ahora p1 está en 2, p0 está en 8.
  // Colocamos p0 en 5 y p1 en 2
  place(g, 'p0', 5);
  place(g, 'p1', 2);
  const r = g.roll('p1'); // 2 + 3 = 5 (ocupada por p0)

  assert.equal(r.landed, 5);
  assert.equal(r.final, 5);
  assert.equal(g.state.players[1].position, 5); // p1 ocupa la casilla 5
  assert.equal(g.state.players[0].position, 1); // p0 es desplazado y reinicia en 1
  assert.deepEqual(r.bumped, { playerId: 'p0', name: 'P0', from: 5, to: 1 });
});

test('regla de desplazamiento tras resolver desafío ético', () => {
  const g = new Game({ rng: dice(4), interactiveChallenges: true });
  g.addPlayer({ id: 'p0', name: 'A', characterId: 'scientist' });
  g.addPlayer({ id: 'p1', name: 'B', characterId: 'engineer' });
  g.setReady('p0', true);
  g.setReady('p1', true);
  g.start();

  // p1 está colocado en la casilla 25 (destino de la escalera 4->25)
  place(g, 'p1', 25);

  // p0 tira 4 desde 0 y cae en la escalera 4
  g.roll('p0');
  assert.equal(g.state.phase, 'challenge');

  // p0 supera la validación ética -> sube a 25 y desplaza a p1 a casilla 1
  const res = g.resolveChallenge('p0', true);
  assert.equal(res.outcome, 'climb');
  assert.equal(res.final, 25);
  assert.equal(g.state.players[0].position, 25);
  assert.equal(g.state.players[1].position, 1); // p1 reiniciado en casilla 1
  assert.deepEqual(res.bumped, { playerId: 'p1', name: 'B', from: 25, to: 1 });
});


