// ice.js — carga y valida servidores ICE (STUN/TURN) desde config/ice.json.
// Sin dependencias del DOM: testeable en Node. Si el archivo falta o es inválido se usan solo los STUN por defecto.
import { DEFAULT_ICE_SERVERS } from './network.js';

const URL_RE = /^(stun|stuns|turn|turns):[^\s]+$/i;

/**
 * Valida una lista de servidores ICE; descarta entradas mal formadas.
 * Un TURN (turn:/turns:) exige username y credential.
 * @param {unknown} list
 * @returns {{urls:string|string[], username?:string, credential?:string}[]}
 */
export function sanitizeIceServers(list) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const s of list.slice(0, 12)) {
    if (!s || typeof s !== 'object') continue;
    const urls = [].concat(s.urls ?? []).filter((u) => typeof u === 'string' && URL_RE.test(u));
    if (!urls.length) continue;
    const needsAuth = urls.some((u) => /^turns?:/i.test(u));
    if (needsAuth && !(typeof s.username === 'string' && typeof s.credential === 'string' && s.username && s.credential)) continue;
    const entry = { urls: urls.length === 1 ? urls[0] : urls };
    if (needsAuth) { entry.username = s.username; entry.credential = s.credential; }
    out.push(entry);
  }
  return out;
}

/**
 * Devuelve STUN por defecto + los servidores de `config/ice.json` (si existen y son válidos).
 * @param {{url?:string, fetchFn?:typeof fetch, timeoutMs?:number}} [o]
 * @returns {Promise<object[]>}
 */
export async function loadIceServers({ url = 'config/ice.json', fetchFn = globalThis.fetch, timeoutMs = 3000 } = {}) {
  const base = [...DEFAULT_ICE_SERVERS];
  if (typeof fetchFn !== 'function') return base;
  const ctl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctl ? setTimeout(() => ctl.abort(), timeoutMs) : null;
  try {
    const res = await fetchFn(url, { cache: 'no-cache', signal: ctl?.signal });
    if (!res.ok) return base;
    const extra = sanitizeIceServers(await res.json());
    return [...extra, ...base]; // TURN primero: el navegador prueba todos los candidatos igualmente
  } catch {
    return base;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
