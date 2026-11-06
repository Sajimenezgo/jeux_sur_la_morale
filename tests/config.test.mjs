import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { LADDERS, SNAKES, BOARD, CHARACTERS, ASSETS, GAME, DICE_ATLAS } from '../js/config.js';
import { LINK_CARDS } from '../js/link_cards.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

test('escaleras suben y serpientes bajan, dentro del tablero', () => {
  for (const l of LADDERS) assert.ok(l.to > l.from, `escalera ${l.from}→${l.to}`);
  for (const s of SNAKES) assert.ok(s.to < s.from, `serpiente ${s.from}→${s.to}`);
  for (const x of [...LADDERS, ...SNAKES]) {
    assert.ok(x.from >= 2 && x.from <= BOARD.tiles - 1 && x.to >= 1 && x.to <= BOARD.tiles);
  }
});

test('ninguna casilla es origen de dos enlaces ni destino de uno que sea origen (sin cadenas)', () => {
  const all = [...LADDERS, ...SNAKES];
  const froms = all.map((x) => x.from);
  assert.equal(new Set(froms).size, froms.length, 'orígenes duplicados');
  for (const x of all) assert.ok(!froms.includes(x.to), `${x.from}→${x.to} encadena con otro enlace`);
});

test('personajes: ids únicos y colores hex válidos', () => {
  const ids = CHARACTERS.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
  assert.ok(CHARACTERS.length >= GAME.maxPlayers);
  for (const c of CHARACTERS) assert.match(c.color, /^#[0-9a-f]{6}$/i);
});

test('todos los assets referenciados existen en disco', () => {
  const paths = [...Object.values(ASSETS), ...CHARACTERS.flatMap((c) => [c.token, c.portrait])];
  const missing = paths.filter((p) => !fs.existsSync(path.join(root, p)));
  assert.deepEqual(missing, []);
});

test('atlas del dado: 6 caras distintas dentro de la rejilla', () => {
  const cells = Object.values(DICE_ATLAS.faces).map((f) => f.join(','));
  assert.equal(new Set(cells).size, 6);
  for (const [c, r] of Object.values(DICE_ATLAS.faces)) assert.ok(c < DICE_ATLAS.cols && r < DICE_ATLAS.rows);
});

test('cada enlace tiene tarjeta educativa completa y dentro de los límites', () => {
  for (const [kind, list] of [['ladder', LADDERS], ['snake', SNAKES]]) {
    for (const x of list) {
      const card = LINK_CARDS[`${kind}-${x.from}`];
      assert.ok(card, `falta tarjeta ${kind}-${x.from}`);
      assert.ok(card.title && card.lesson.length <= 140 && card.tip.length <= 100);
    }
  }
});
