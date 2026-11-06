import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeIceServers, loadIceServers } from '../js/ice.js';
import { DEFAULT_ICE_SERVERS } from '../js/network.js';

test('sanitizeIceServers: acepta STUN y TURN con credenciales; descarta lo inválido', () => {
  const out = sanitizeIceServers([
    { urls: 'stun:stun.example.org:3478' },
    { urls: ['turn:t.example.org:3478', 'turns:t.example.org:443?transport=tcp'], username: 'u', credential: 'c' },
    { urls: 'turn:sin-credenciales.example.org:3478' },
    { urls: 'http://no-es-ice' },
    'basura', null, { urls: 123 },
  ]);
  assert.equal(out.length, 2);
  assert.deepEqual(out[1].urls, ['turn:t.example.org:3478', 'turns:t.example.org:443?transport=tcp']);
  assert.equal(out[1].username, 'u');
  assert.deepEqual(sanitizeIceServers('x'), []);
});

test('loadIceServers: añade los de ice.json delante de los STUN por defecto', async () => {
  const fetchFn = async () => ({ ok: true, json: async () => [{ urls: 'turn:t.example.org:3478', username: 'u', credential: 'c' }] });
  const out = await loadIceServers({ fetchFn });
  assert.equal(out.length, DEFAULT_ICE_SERVERS.length + 1);
  assert.match(out[0].urls, /^turn:/);
});

test('loadIceServers: cae a STUN por defecto si falta el archivo, falla la red o el JSON es inválido', async () => {
  for (const fetchFn of [
    async () => ({ ok: false }),
    async () => { throw new Error('offline'); },
    async () => ({ ok: true, json: async () => { throw new Error('json'); } }),
    async () => ({ ok: true, json: async () => ({ no: 'lista' }) }),
  ]) {
    assert.deepEqual(await loadIceServers({ fetchFn }), [...DEFAULT_ICE_SERVERS]);
  }
});
