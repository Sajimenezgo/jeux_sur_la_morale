// mobile.js — UI del mando (mobile.html): unirse → rol → listo → lanzar dado.
import { CHARACTERS, GAME } from './config.js';
import { ClientNetwork, MSG, sanitizeName } from './network.js';
import { loadIceServers } from './ice.js';
import { resolvePeerClass } from './supabase_peer.js';

const $ = (id) => document.getElementById(id);
const charOf = (id) => CHARACTERS.find((c) => c.id === id);
const SCREENS = ['s-join', 's-pick', 's-ready', 's-play', 's-challenge', 's-end'];
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
  currentChallenge: null,
  challengeTimer: null,
  autoDismissChallenge: null,

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
      case MSG.CHALLENGE: this.onChallenge(m); break;
      case MSG.CHALLENGE_RESULT: this.onChallengeResult(m); break;
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
    const bumpMsg = r.bumped ? (r.bumped.playerId === this.myId ? ` ¡${r.playerId === this.myId ? 'Te' : 'Fueron'} desplazado a la casilla 1!` : ` ¡${r.bumped.name} fue desplazado a la casilla 1!`) : '';
    $('play-status').textContent = r.forfeited ? 'Tres seises seguidos: pierdes el turno.'
      : j ? (j.kind === 'ladder' ? `¡Escalera! ${j.label}` : `¡Serpiente! ${j.label}`)
        : r.bumped ? `¡Casilla ocupada!${bumpMsg}`
        : r.extraTurn ? '¡Un 6! Repites turno.' : 'Mira la pantalla…';
    clearTimeout(this.resultTimer);
    this.resultTimer = setTimeout(() => { big.hidden = true; }, 4000);
  },

  onChallenge(m) {
    this.currentChallenge = m;
    this.currentChallenge.answered = false;
    vibrate([80, 40, 80, 40, 150]);
    this.meCard($('me-card3'));

    const isMe = m.playerId === this.myId;
    const isLadder = m.jump.kind === 'ladder';
    const box = document.querySelector('.challenge-box');
    if (box) box.className = `challenge-box glass ${isLadder ? 'ladder' : 'snake'}`;

    const badge = $('ch-badge');
    badge.className = `challenge-badge ${isLadder ? 'ch-badge-ladder' : 'ch-badge-snake'}`;
    badge.textContent = isLadder
      ? `Escalera (${m.jump.label}) · ${isMe ? '¡Subes si aciertan!' : 'Validación grupal'}`
      : `Alerta Serpiente (${m.jump.label}) · ${isMe ? '¡Te salvas si aciertan!' : 'Validación grupal'}`;

    const sub = $('ch-voting-sub');
    if (sub) {
      sub.textContent = isMe
        ? 'Tu ficha está en juego · Vota tu respuesta'
        : `Votación grupal · Ficha en juego: ${m.playerName || 'Compañero'}`;
    }

    const voteStatus = $('ch-vote-status');
    if (voteStatus) {
      voteStatus.hidden = true;
      voteStatus.textContent = '';
    }

    $('ch-title').textContent = m.card.title;
    $('ch-prompt').textContent = m.card.prompt;

    const optContainer = $('ch-options');
    optContainer.replaceChildren();

    const letters = ['A', 'B', 'C', 'D'];
    m.card.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ch-opt-btn';
      btn.dataset.idx = String(idx);

      const spanLetter = document.createElement('span');
      spanLetter.className = 'opt-letter';
      spanLetter.textContent = letters[idx];

      const spanText = document.createElement('span');
      spanText.className = 'opt-text';
      spanText.textContent = optText;

      const badgeVote = document.createElement('span');
      badgeVote.className = 'opt-votes-badge';
      badgeVote.id = `mob-vote-${idx}`;
      badgeVote.hidden = true;

      btn.append(spanLetter, spanText, badgeVote);
      btn.addEventListener('click', () => this.sendAnswer(m.card.id, idx));
      optContainer.append(btn);
    });

    $('ch-feedback').hidden = true;
    optContainer.hidden = false;

    // Timer regresivo
    clearInterval(this.challengeTimer);
    let timeLeft = Math.floor((m.timeoutMs || 30000) / 1000);
    $('ch-timer-num').textContent = `${timeLeft}s`;
    $('ch-timer-fill').style.width = '100%';

    const totalSeconds = timeLeft;
    this.challengeTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(this.challengeTimer);
        $('ch-timer-num').textContent = '0s';
        $('ch-timer-fill').style.width = '0%';
      } else {
        $('ch-timer-num').textContent = `${timeLeft}s`;
        $('ch-timer-fill').style.width = `${(timeLeft / totalSeconds) * 100}%`;
      }
    }, 1000);

    this.show('s-challenge');
  },

  sendAnswer(cardId, selectedIndex) {
    if (!this.currentChallenge || this.currentChallenge.answered) return;
    this.currentChallenge.answered = true;

    const buttons = $('ch-options').querySelectorAll('.ch-opt-btn');
    buttons.forEach((b, idx) => {
      b.disabled = true;
      if (idx === selectedIndex) b.classList.add('selected');
    });

    const voteStatus = $('ch-vote-status');
    if (voteStatus) {
      voteStatus.textContent = '✓ Voto registrado. Esperando el consenso de los demás jugadores...';
      voteStatus.hidden = false;
    }

    this.net?.send({
      t: MSG.ANSWER,
      cardId,
      selectedIndex,
    });
  },

  onChallengeResult(m) {
    clearInterval(this.challengeTimer);
    const isMe = m.playerId === this.myId;
    vibrate(isMe ? (m.correct ? [100, 50, 150] : [250, 100, 250]) : (m.correct ? [80, 40, 80] : [150]));

    const buttons = $('ch-options').querySelectorAll('.ch-opt-btn');
    buttons.forEach((b, idx) => {
      b.disabled = true;
      if (idx === m.correctIndex) b.classList.add('correct');
      else if (idx === m.selectedIndex && !m.correct) b.classList.add('wrong');
      const badge = $(`mob-vote-${idx}`);
      if (badge && Array.isArray(m.votesSummary)) {
        const count = m.votesSummary[idx] || 0;
        badge.textContent = `${count} ${count === 1 ? 'voto' : 'votos'}`;
        if (idx === m.selectedIndex && m.totalVotes > 0) badge.classList.add('winning');
        badge.hidden = false;
      }
    });

    const voteStatus = $('ch-vote-status');
    if (voteStatus) voteStatus.hidden = true;

    const isLadder = this.currentChallenge?.jump?.kind === 'ladder';
    const resHeader = $('ch-result-header');
    const letters = ['A', 'B', 'C', 'D'];
    const winningLetter = m.selectedIndex >= 0 ? `Opción ${letters[m.selectedIndex]}` : 'Ninguna';
    const voteDesc = m.totalVotes > 0 ? `Mayoría: ${winningLetter}` : 'Sin votos';

    if (isMe) {
      if (m.correct) {
        resHeader.className = 'ch-res-success';
        resHeader.textContent = isLadder
          ? `✓ ¡Consenso acertado (${voteDesc})! Subes la escalera.`
          : `✓ ¡Consenso acertado (${voteDesc})! Te salvaste de la serpiente.`;
      } else {
        resHeader.className = 'ch-res-fail';
        resHeader.textContent = isLadder
          ? `✕ Consenso fallido (${voteDesc}): Pierdes el ascenso.`
          : `✕ Consenso fallido (${voteDesc}): Pierdes posiciones y caes.`;
      }
    } else {
      const pName = m.playerName || 'Tu compañero';
      if (m.correct) {
        resHeader.className = 'ch-res-success';
        resHeader.textContent = isLadder
          ? `✓ ¡Consenso acertado (${voteDesc})! ${pName} sube la escalera.`
          : `✓ ¡Consenso acertado (${voteDesc})! ${pName} se salva de la serpiente.`;
      } else {
        resHeader.className = 'ch-res-fail';
        resHeader.textContent = isLadder
          ? `✕ Consenso fallido (${voteDesc}): ${pName} pierde el ascenso.`
          : `✕ Consenso fallido (${voteDesc}): ${pName} pierde posiciones y cae.`;
      }
    }

    $('ch-explanation').textContent = m.explanation;
    $('ch-tip').textContent = m.tip ? `› ${m.tip}` : '';
    $('ch-feedback').hidden = false;

    $('ch-continue-btn').onclick = () => {
      clearTimeout(this.autoDismissChallenge);
      this.currentChallenge = null;
      this.show('s-play');
    };

    clearTimeout(this.autoDismissChallenge);
    this.autoDismissChallenge = setTimeout(() => {
      if (this.currentChallenge) {
        this.currentChallenge = null;
        this.show('s-play');
      }
    }, 5500);
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
    if (st.phase === 'challenge' && me) {
      if (st.pendingChallenge?.playerId === me.id) {
        // El jugador activo está en el reto
        if (!$('s-challenge').hidden) return;
      } else {
        this.meCard($('me-card2'));
        const btn = $('roll-btn');
        btn.disabled = true;
        const tp = st.players.find((p) => p.id === st.pendingChallenge?.playerId);
        $('play-status').textContent = tp ? `${tp.name} está en validación ética…` : 'Validación ética en curso…';
        this.show('s-play');
        return;
      }
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
