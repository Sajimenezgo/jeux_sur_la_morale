// mobile.js — UI del mando (mobile.html): unirse → rol → listo → lanzar dado.
import { CHARACTERS, GAME } from './config.js';
import { ClientNetwork, MSG, sanitizeName } from './network.js';
import { loadIceServers } from './ice.js';
import { resolvePeerClass } from './supabase_peer.js';

const $ = (id) => document.getElementById(id);
const charOf = (id) => CHARACTERS.find((c) => c.id === id);
const SCREENS = ['s-join', 's-pick', 's-ready', 's-play', 's-end'];
const vibrate = (p) => { try { navigator.vibrate?.(p); } catch { /* sin soporte */ } };
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};

function avatar(ch) {
  const d = document.createElement('div');
  d.className = 'av';
  d.style.setProperty('--c', ch.color);
  d.textContent = ch.glyph;
  const img = new Image();
  img.alt = '';
  img.onload = () => { d.textContent = ''; d.append(img); };
  img.src = ch.portrait;
  return d;
}

const app = {
  net: null,
  myId: null,
  state: null,
  repicking: false,
  rollLocked: false,
  lockTimer: 0,
  wasMyTurn: false,
  resultTimer: 0,
  wakeLock: null,

  init() {
    const room = (new URLSearchParams(location.search).get('room') || '').toUpperCase().slice(0, GAME.roomCodeLength);
    $('in-room').value = room;
    $('in-name').value = store.get('gl.name') || '';
    $('s-join').addEventListener('submit', (e) => { e.preventDefault(); this.join(); });
    $('ready-btn').addEventListener('click', () => this.toggleReady());
    $('change-btn').addEventListener('click', () => {
      this.repicking = true;
      this.net?.send({ t: MSG.READY, ready: false });
      this.render();
    });
    $('roll-btn').addEventListener('click', () => this.roll());
    document.addEventListener('visibilitychange', () => { if (!document.hidden) this.requestWakeLock(); });
    this.buildChars();
    this.show('s-join');
    this.setConn('off', 'Sin conexión');
    (room ? $('in-name') : $('in-room')).focus();
  },

  show(id) {
    for (const s of SCREENS) $(s).hidden = s !== id;
  },

  setConn(kind, text) {
    $('conn').className = `conn ${kind === 'ok' ? 'ok' : kind === 'wait' ? 'wait' : ''}`;
    $('conn-text').textContent = text;
  },

  async join() {
    const name = sanitizeName($('in-name').value);
    const code = $('in-room').value.trim().toUpperCase();
    $('join-err').textContent = '';
    if (!code) { $('join-err').textContent = 'Ingresa el código de sala.'; return; }
    store.set('gl.name', name);
    $('join-btn').disabled = true;
    this.setConn('wait', 'Conectando…');
    const { Peer, transport } = await resolvePeerClass();
    console.info('[net] transporte:', transport);
    const net = this.net = new ClientNetwork({ Peer, name, iceServers: transport === 'peerjs' ? await loadIceServers() : undefined });
    net.on('message', (m) => this.onMessage(m));
    net.on('open', ({ reconnect }) => { this.setConn('ok', 'Conectado'); if (reconnect) vibrate(80); });
    net.on('reconnecting', ({ attempt }) => this.setConn('wait', `Reconectando (${attempt})…`));
    net.on('close', () => this.setConn('off', 'Desconectado'));
    net.on('error', (e) => console.warn('[net]', e));
    try {
      await net.join(code, { name });
      this.requestWakeLock();
    } catch (err) {
      this.net = null;
      this.setConn('off', 'Sin conexión');
      $('join-err').textContent = err?.code === 'room_not_found' || err?.type === 'peer-unavailable'
        ? 'No se encontró esa sala. Revisa el código.'
        : err?.code === 'timeout'
          ? 'No se pudo conectar: tiempo agotado. Si usas datos móviles, conéctate al mismo Wi-Fi que la pantalla (o configura un servidor TURN).'
          : `No se pudo conectar: ${err?.message || 'error de red'}`;
    } finally {
      $('join-btn').disabled = false;
    }
  },

  async requestWakeLock() {
    try { if (navigator.wakeLock && !document.hidden) this.wakeLock = await navigator.wakeLock.request('screen'); } catch { /* ignore */ }
  },

  onMessage(m) {
    switch (m.t) {
      case MSG.WELCOME: this.myId = m.playerId; this.setState(m.state); break;
      case MSG.STATE: this.setState(m.state); break;
      case MSG.ROLLED: this.onRolled(m.result); break;
      case MSG.ERROR: this.onError(m); break;
      default: break;
    }
  },

  onError(m) {
    if (m.code === 'rate_limited') return;
    this.unlock();
    const text = m.message || 'Error';
    if (!$('s-pick').hidden) $('pick-err').textContent = text;
    else $('play-status').textContent = text;
    if (m.code === 'character_taken') this.repicking = true;
    this.render();
  },

  setState(state) {
    this.state = state;
    this.unlock();
    this.render();
  },

  get me() { return this.state?.players.find((p) => p.id === this.myId) ?? null; },

  buildChars() {
    const grid = $('chars');
    grid.replaceChildren();
    for (const ch of CHARACTERS) {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'char'; b.dataset.id = ch.id;
      b.style.setProperty('--c', ch.color);
      const name = document.createElement('b'); name.textContent = ch.name;
      const sm = document.createElement('small'); sm.textContent = ch.blurb;
      b.append(avatar(ch), name, sm);
      b.addEventListener('click', () => this.pick(ch.id));
      grid.append(b);
    }
  },

  pick(id) {
    $('pick-err').textContent = '';
    const me = this.me;
    this.repicking = false;
    vibrate(20);
    if (me?.characterId !== id) this.net?.send({ t: MSG.PICK, characterId: id });
    else this.render();
  },

  toggleReady() {
    const me = this.me;
    if (!me) return;
    vibrate(20);
    this.net?.send({ t: MSG.READY, ready: !me.ready });
  },

  roll() {
    if (this.rollLocked) return;
    this.rollLocked = true;
    $('roll-btn').disabled = true;
    vibrate(40);
    this.net?.send({ t: MSG.ROLL });
    $('play-status').textContent = 'Lanzando…';
    this.lockTimer = setTimeout(() => this.unlock(), 12000); // red de seguridad
  },

  unlock() {
    clearTimeout(this.lockTimer);
    this.rollLocked = false;
  },

  onRolled(r) {
    vibrate([60, 40, 120]);
    const big = $('result-big');
    big.textContent = String(r.dice);
    big.hidden = false;
    const j = r.jump;
    $('play-status').textContent = r.forfeited ? 'Tres seises seguidos: pierdes el turno.'
      : j ? (j.kind === 'ladder' ? `¡Escalera! ${j.label}` : `¡Serpiente! ${j.label}`)
        : r.extraTurn ? '¡Un 6! Repites turno.' : 'Mira la pantalla…';
    clearTimeout(this.resultTimer);
    this.resultTimer = setTimeout(() => { big.hidden = true; }, 4000);
  },

  meCard(el) {
    const me = this.me;
    el.replaceChildren();
    if (!me) return;
    const ch = charOf(me.characterId);
    el.style.setProperty('--c', ch.color);
    const t = document.createElement('div');
    const n = document.createElement('b'); n.textContent = me.name;
    const s = document.createElement('div'); s.className = 'dim mono'; s.style.fontSize = '0.75rem';
    s.textContent = `${ch.name} · casilla ${me.position}`;
    t.append(n, s);
    el.append(avatar(ch), t);
  },

  render() {
    const st = this.state;
    if (!st) return;
    const me = this.me;
    if (st.phase === 'lobby') {
      if (!me || this.repicking) {
        for (const b of $('chars').children) {
          const owner = st.players.find((p) => p.characterId === b.dataset.id);
          b.classList.toggle('taken', !!owner && owner.id !== this.myId);
          b.classList.toggle('sel', !!owner && owner.id === this.myId);
        }
        this.show('s-pick');
      } else {
        this.meCard($('me-card'));
        $('ready-title').textContent = me.ready ? 'Todo listo' : '¿Listo para jugar?';
        $('ready-btn').textContent = me.ready ? 'CANCELAR LISTO' : 'ESTOY LISTO';
        const others = st.players.length;
        $('ready-status').textContent = me.ready
          ? `Esperando al resto (${others}/${GAME.maxPlayers} en sala)…` : 'Pulsa cuando quieras empezar.';
        this.show('s-ready');
      }
      return;
    }
    if (st.phase === 'playing' && me) {
      this.meCard($('me-card2'));
      const mine = st.turnPlayerId === me.id;
      const btn = $('roll-btn');
      btn.disabled = !mine || this.rollLocked;
      if (mine && !this.wasMyTurn) vibrate([200, 80, 200]);
      this.wasMyTurn = mine;
      const tp = st.players.find((p) => p.id === st.turnPlayerId);
      if (mine) $('play-status').textContent = '¡Es tu turno!';
      else if (!$('result-big').hidden) { /* conserva el mensaje del resultado */ } else $('play-status').textContent = tp ? `Turno de ${tp.name}…` : '';
      this.show('s-play');
      return;
    }
    // finished o espectador
    const w = st.players.find((p) => p.id === st.winnerId);
    const won = !!me && st.winnerId === me.id;
    $('end-title').textContent = st.phase === 'finished' ? (won ? '¡Ganaste!' : `Gana ${w?.name ?? '—'}`) : 'Partida en curso';
    $('end-sub').textContent = st.phase === 'finished' ? 'Mira la pantalla principal para iniciar otra partida.' : 'Espera a la próxima partida.';
    if (won) vibrate([100, 50, 100, 50, 300]);
    this.show('s-end');
  },
};

app.init();
