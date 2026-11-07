// main.js — orquesta Game + HostNetwork + Scene3D + Animator + UI del host (index.html).
// Modo prueba sin celulares: index.html?demo=1 (3 bots locales, juega solo, sin red).
import { GAME, CHARACTERS, THEME } from './config.js';
import { Game } from './game.js';
import { HostNetwork, MSG } from './network.js';
import { loadIceServers } from './ice.js';
import { resolvePeerClass } from './supabase_peer.js';
import { Scene3D } from './scene3d.js';
import { Animator } from './animations.js';
import { getChallengeForJump } from './cards.js';

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const DEMO = params.get('demo') === '1';
const charOf = (id) => CHARACTERS.find((c) => c.id === id);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Avatar circular: glifo de fallback; sustituido por el retrato si carga. */
function avatar(ch, cls = 'av') {
  const d = document.createElement('div');
  d.className = cls;
  d.style.setProperty('--c', ch.color);
  d.textContent = ch.glyph;
  const img = new Image();
  img.alt = '';
  img.onload = () => { d.textContent = ''; d.append(img); };
  img.src = ch.portrait;
  return d;
}

class HostApp {
  constructor() {
    this.game = new Game({ interactiveChallenges: true });
    this.net = null;
    this.s3 = null;
    this.anim = null;
    this.busy = false;
    this.pubState = this.game.state; // último estado difundido (los móviles no ven el turno siguiente hasta terminar la animación)
    this.names = new Map();          // playerId → nombre (conectados que aún no eligen rol)
    this.dropTimers = new Map();
    this.autoStart = null;
    this.autoplay = null;
    this.linkCards = null;
    this.lessonTimer = 0;
    this.roomCode = null;
    this.usedCardIds = new Set();
    this.currentChallenge = null;
    this.challengeTimer = null;
    this.botTimer = null;
  }

  async init() {
    this.bindUi();
    import('./link_cards.js').then((m) => { this.linkCards = m.LINK_CARDS; }).catch(() => {});

    try {
      this.s3 = new Scene3D($('scene'), { onProgress: (f) => { $('loader-bar').style.width = `${Math.round(f * 100)}%`; } });
      await this.s3.init();
    } catch (err) {
      console.error(err);
      document.querySelector('#loader h1').textContent = 'No se pudo iniciar WebGL';
      document.querySelector('#loader .eyebrow').textContent = String(err?.message || err);
      return;
    }
    this.anim = new Animator({ scene3d: this.s3 });
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    mq.addEventListener?.('change', (e) => this.anim.setReducedMotion(e.matches));
    this.s3.start();
    $('loader').classList.add('done');
    setTimeout(() => $('loader').remove(), 800);

    // Eventos del motor → escena
    this.game.on('playerAdded', (p) => this.s3.addToken(p.id, charOf(p.characterId), p.position));
    this.game.on('playerRemoved', (p) => this.s3.removeToken(p.id));

    if (DEMO) { await this.startDemo(); return; }

    $('net-status').textContent = 'Abriendo sala…';
    this.renderLobby();
    try {
      const { Peer, transport } = await resolvePeerClass();
      console.info('[net] transporte:', transport);
      this.net = new HostNetwork({ Peer, iceServers: transport === 'peerjs' ? await loadIceServers() : undefined });
      this.wireNet();
      this.roomCode = await this.net.open();
      this.showRoom(this.roomCode);
    } catch (err) {
      console.error(err);
      $('net-status').textContent = 'No se pudo abrir la sala (¿sin conexión al servidor de señalización?). Recarga la página para reintentar. Prueba sin celulares con ?demo=1.';
      $('room-code').textContent = 'ERR';
    }
  }

  // ── UI ──────────────────────────────────────────────────────────────────
  bindUi() {
    $('start-btn').addEventListener('click', () => this.tryStart());
    $('again-btn').addEventListener('click', () => { location.href = location.pathname + (DEMO ? '?demo=1' : ''); });
    window.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !$('lobby').hidden && this.game.canStart) this.tryStart(); });
  }

  showRoom(code) {
    $('room-code').textContent = code;
    $('hud-room').textContent = code;
    const url = new URL(`mobile.html?room=${code}`, location.href).href;
    $('join-url').textContent = url;
    $('net-status').textContent = 'Escanea el QR con tu celular o abre la dirección e ingresa el código.';
    const box = $('qr');
    try {
      const qr = globalThis.qrcode(0, 'M');
      qr.addData(url);
      qr.make();
      box.innerHTML = qr.createSvgTag({ cellSize: 4, margin: 0, scalable: true });
    } catch (err) {
      console.warn('QR no disponible', err);
      box.textContent = code;
    }
  }

  renderLobby() {
    const st = this.game.state;
    $('player-count').textContent = `${st.players.length}/${GAME.maxPlayers}`;
    const slots = $('slots');
    slots.replaceChildren();
    for (const p of st.players) {
      const ch = charOf(p.characterId);
      const el = document.createElement('div');
      el.className = `slot filled${p.ready ? ' ready' : ''}${p.connected ? '' : ' off'}`;
      el.style.setProperty('--c', ch.color);
      el.append(avatar(ch));
      const t = document.createElement('div');
      const nm = document.createElement('div'); nm.className = 'nm'; nm.textContent = p.name;
      const s = document.createElement('div'); s.className = 'st';
      s.textContent = !p.connected ? 'desconectado' : p.ready ? 'listo ✓' : ch.name;
      t.append(nm, s); el.append(t); slots.append(el);
    }
    for (const [id, name] of this.names) {
      if (st.players.some((p) => p.id === id)) continue;
      const el = document.createElement('div'); el.className = 'slot';
      el.innerHTML = '<div class="av">…</div><div><div class="nm"></div><div class="st">eligiendo rol</div></div>';
      el.querySelector('.nm').textContent = name;
      slots.append(el);
    }
    const free = GAME.maxPlayers - slots.children.length;
    for (let i = 0; i < Math.max(0, free); i++) {
      const el = document.createElement('div'); el.className = 'slot';
      el.innerHTML = '<div class="av">+</div><div class="st">esperando jugador</div>';
      slots.append(el);
    }
    const can = this.game.canStart;
    $('start-btn').disabled = !can;
    $('start-hint').textContent = can
      ? 'Todos listos: la partida inicia en unos segundos (o pulsa Iniciar).'
      : st.players.length < GAME.minPlayers ? `Se necesitan al menos ${GAME.minPlayers} jugadores.` : 'Esperando a que todos pulsen "Estoy listo".';
    clearTimeout(this.autoStart);
    if (can && !DEMO) this.autoStart = setTimeout(() => this.tryStart(), 4000);
  }

  renderHud(state = this.pubState) {
    const box = $('players');
    box.replaceChildren();
    for (const p of state.players) {
      const ch = charOf(p.characterId);
      const el = document.createElement('div');
      el.className = `pcard${p.id === state.turnPlayerId && state.phase === 'playing' ? ' turn' : ''}${p.connected ? '' : ' off'}`;
      el.style.setProperty('--c', ch.color);
      el.append(avatar(ch));
      const t = document.createElement('div');
      const nm = document.createElement('div'); nm.className = 'nm'; nm.textContent = p.name;
      const sub = document.createElement('div'); sub.className = 'sub'; sub.textContent = p.connected ? ch.name : 'desconectado (auto)';
      t.append(nm, sub);
      const pos = document.createElement('div'); pos.className = 'pos'; pos.textContent = String(p.position).padStart(2, '0');
      el.append(t, pos);
      box.append(el);
    }
    const tp = state.players.find((p) => p.id === state.turnPlayerId);
    $('turn-label').textContent = tp ? tp.name : '—';
    $('turn-label').style.color = tp ? tp.color : '';
    $('turn-n').textContent = String(state.turnNumber);
  }

  log(text, kind = '', label = null, color = null) {
    const li = document.createElement('li');
    if (kind) li.className = kind;
    if (color) li.style.setProperty('--c', color);
    li.append(document.createTextNode(text));
    if (label) {
      const b = document.createElement('b');
      b.className = kind === 'ladder' ? 'l' : 's';
      b.textContent = ` ${label}`;
      li.append(b);
    }
    const ol = $('log');
    ol.prepend(li);
    while (ol.children.length > 30) ol.lastChild.remove();
  }

  showLesson(jump) {
    const card = this.linkCards?.[`${jump.kind}-${jump.from}`];
    const el = $('lesson');
    clearTimeout(this.lessonTimer);
    if (!card) { el.hidden = true; return; }
    const color = jump.kind === 'ladder' ? 'var(--lime)' : 'var(--red)';
    el.style.setProperty('--c', color);
    el.replaceChildren();
    const eb = document.createElement('p'); eb.className = 'eyebrow'; eb.style.color = color;
    eb.textContent = jump.kind === 'ladder' ? 'Buena práctica · escalera' : 'Sesgo / error · serpiente';
    const h = document.createElement('h3'); h.textContent = card.title;
    const p = document.createElement('p'); p.textContent = card.lesson;
    const tip = document.createElement('p'); tip.className = 'tip'; tip.textContent = `› ${card.tip}`;
    el.append(eb, h, p, tip);
    el.hidden = false;
    this.lessonTimer = setTimeout(() => { el.hidden = true; }, 6500);
  }

  // ── Red ─────────────────────────────────────────────────────────────────
  wireNet() {
    const n = this.net;
    n.on('player-connect', ({ playerId, name }) => this.onConnect(playerId, name));
    n.on('player-disconnect', ({ playerId }) => this.onDisconnect(playerId));
    n.on('message', ({ playerId, msg }) => this.onMessage(playerId, msg));
    n.on('error', (e) => console.warn('[net]', e));
  }

  /** Estado visible para los móviles: el último publicado, salvo en lobby (en vivo). */
  snapshot() { return this.game.state.phase === 'lobby' && !this.busy ? this.game.state : this.pubState; }

  publish() {
    this.pubState = this.game.state;
    this.net?.broadcast({ t: MSG.STATE, state: this.pubState });
    if (this.pubState.phase === 'lobby') this.renderLobby(); else this.renderHud(this.pubState);
  }

  sendError(playerId, code, message) { this.net?.send(playerId, { t: MSG.ERROR, code, message }); }

  onConnect(playerId, name) {
    clearTimeout(this.dropTimers.get(playerId));
    const existing = this.game.state.players.find((p) => p.id === playerId);
    if (existing) {
      this.game.setConnected(playerId, true);
    } else if (this.game.state.phase !== 'lobby') {
      this.net.sendWelcome(playerId, this.pubState); // el móvil verá la fase y mostrará "en curso"
      this.sendError(playerId, 'in_progress', 'La partida ya comenzó');
      return;
    } else {
      this.names.set(playerId, name);
    }
    this.net.sendWelcome(playerId, this.snapshot());
    this.publish();
    this.maybeAutoplay();
  }

  onDisconnect(playerId) {
    this.names.delete(playerId);
    const p = this.game.state.players.find((x) => x.id === playerId);
    if (!p) { this.renderLobby(); return; }
    this.game.setConnected(playerId, false);
    if (this.game.state.phase === 'lobby') {
      // Margen de gracia para reconexión antes de liberar el rol
      this.dropTimers.set(playerId, setTimeout(() => {
        const cur = this.game.state.players.find((x) => x.id === playerId);
        if (cur && !cur.connected && this.game.state.phase === 'lobby') { this.game.removePlayer(playerId); this.publish(); }
      }, 20000));
    }
    this.publish();
    this.maybeAutoplay();
  }

  onMessage(playerId, msg) {
    try {
      switch (msg.t) {
        case MSG.PICK: return this.onPick(playerId, msg.characterId);
        case MSG.READY: {
          if (this.game.state.phase !== 'lobby') return;
          this.game.setReady(playerId, msg.ready);
          this.publish();
          return;
        }
        case MSG.ROLL: return this.onRoll(playerId);
        case MSG.ANSWER: return this.onAnswer(playerId, msg);
        default: return;
      }
    } catch (err) {
      this.sendError(playerId, err.code || 'error', err.message || 'Error');
    }
  }

  onPick(playerId, characterId) {
    if (this.game.state.phase !== 'lobby') throw Object.assign(new Error('La partida ya comenzó'), { code: 'not_in_lobby' });
    const cur = this.game.state.players.find((p) => p.id === playerId);
    const name = cur?.name ?? this.names.get(playerId) ?? 'Jugador';
    if (cur?.characterId === characterId) return;
    if (cur) this.game.removePlayer(playerId);
    try {
      this.game.addPlayer({ id: playerId, name, characterId });
    } catch (err) {
      if (cur) this.game.addPlayer({ id: playerId, name, characterId: cur.characterId }); // restaura
      throw err;
    }
    this.names.delete(playerId);
    this.publish();
  }

  async onRoll(playerId) {
    if (this.busy) { this.sendError(playerId, 'busy', 'Espera a que termine el turno'); return; }
    try { await this.doRoll(playerId); } catch (err) {
      this.busy = false;
      if (err?.code) this.sendError(playerId, err.code, err.message);
      else console.error(err);
    }
  }

  // ── Partida ─────────────────────────────────────────────────────────────
  tryStart() {
    clearTimeout(this.autoStart);
    if (!this.game.canStart) return;
    this.game.start();
    $('lobby').hidden = true;
    $('hud').hidden = false;
    this.log('Comienza la partida. ¡Suerte con el gradiente!');
    this.publish();
    this.maybeAutoplay();
  }

  /** Bots (demo) y jugadores desconectados juegan solos tras una pausa. */
  maybeAutoplay() {
    clearTimeout(this.autoplay);
    const st = this.game.state;
    if (st.phase !== 'playing' || this.busy) return;
    const tp = st.players.find((p) => p.id === st.turnPlayerId);
    if (!tp) return;
    const isBot = tp.id.startsWith('bot-');
    if (!isBot && tp.connected) return;
    this.autoplay = setTimeout(() => {
      const cur = this.game.state;
      const p = cur.players.find((x) => x.id === cur.turnPlayerId);
      if (!p || this.busy || cur.phase !== 'playing') return;
      if (!p.id.startsWith('bot-') && p.connected) return;
      this.onRoll(p.id);
    }, isBot ? 1100 : 3500);
  }

  async doRoll(playerId) {
    const before = this.game.state;
    const player = before.players.find((p) => p.id === playerId);
    const token = this.s3.tokens.get(playerId);
    const r = this.game.roll(playerId); // lanza GameError si no es el turno
    this.busy = true;
    clearTimeout(this.autoplay);
    clearTimeout(this.autoStart);
    const color = player.color;
    this.s3.clearHighlights();
    $('dice-num').textContent = '?';
    this.log(`${player.name} lanza el dado…`, '', null, color);
    if (token) this.anim.focusCamera({ x: this.s3._center.x + (token.position.x - this.s3._center.x) * 0.35, z: this.s3._center.z + (token.position.z - this.s3._center.z) * 0.35 }, { duration: 0.8 });

    try {
    await this.anim.rollDice(r.dice);
    $('dice-num').textContent = String(r.dice);
    this.net?.send(playerId, { t: MSG.ROLLED, result: r });
    this.log(`${player.name} sacó ${r.dice}`, '', null, color);

    if (r.forfeited) {
      this.log(`${player.name}: tres seises seguidos, pierde el turno`, '', null, color);
      await sleep(900);
    } else if (token) {
      if (r.path.length) await this.anim.moveAlongPath(token, r.path);
      if (r.bounced) this.log(`${player.name} rebota en la meta (tirada exacta)`, '', null, color);
      this.s3.highlightTile(r.landed, THEME.cyan);

      if (r.pendingChallenge) {
        await this.presentChallenge(player, token, r);
        return;
      }

      if (r.jump) {
        const lad = r.jump.kind === 'ladder';
        this.log(`${player.name} ${lad ? 'sube' : 'cae'} ${r.jump.from}→${r.jump.to}:`, lad ? 'ladder' : 'snake', r.jump.label);
        this.showLesson(r.jump);
        await sleep(this.anim.reduced ? 200 : 450);
        await this.anim.slideAlongJump(token, r.jump.from, r.jump.to, r.jump.kind);
      }

      if (r.bumped) {
        const victimToken = this.s3.tokens.get(r.bumped.playerId);
        this.log(`¡Casilla ocupada! ${player.name} desplaza a ${r.bumped.name} a la casilla 1`, 'snake', null, '#fb4a6b');
        if (victimToken) {
          await sleep(this.anim.reduced ? 100 : 250);
          await this.anim.hopToken(victimToken, victimToken.position.clone(), this.s3.tokenPosition(victimToken, 1), { height: 1.2, duration: 0.5 });
          victimToken.userData.tile = 1;
        }
      }
      if (r.won) {
        this.log(`${player.name} llega a la casilla 100: ¡despliegue ético!`, 'win', null, '#fbbf24');
        await this.anim.celebrate(token);
      } else if (r.extraTurn) {
        this.log(`${player.name} repite turno (sacó 6)`, '', null, color);
      }
    }
    } catch (err) {
      console.error('Animación fallida', err); // el estado lógico ya avanzó: seguimos
      if (token) token.position.copy(this.s3.tokenPosition(token, r.final));
    }

    this.busy = false;
    const st = this.game.state;
    this.s3.clearHighlights();
    this.publish();
    if (st.phase === 'finished') this.showVictory(st);
    else {
      const next = st.players.find((p) => p.id === st.turnPlayerId);
      if (next) this.anim.focusCamera(this.s3._center, { duration: 1.0 });
      this.maybeAutoplay();
    }
  }

  async presentChallenge(player, token, r) {
    const isLadder = r.jump.kind === 'ladder';
    const card = getChallengeForJump(r.jump.kind, r.jump.from, this.usedCardIds);
    this.usedCardIds.add(card.id);

    this.currentChallenge = {
      playerId: player.id,
      card,
      jump: r.jump,
      token,
      dice: r.dice,
      extraTurn: r.dice === 6,
      answered: false,
    };

    // 1. Mostrar en pantalla Host
    const modal = $('challenge-modal');
    modal.className = `challenge-modal glass ${isLadder ? 'ladder' : 'snake'}`;
    const badge = $('ch-host-badge');
    badge.className = `ch-host-badge ${isLadder ? 'ch-badge-ladder' : 'ch-badge-snake'}`;
    badge.textContent = isLadder
      ? `Escalera (${r.jump.label}) · ¡Sube si acierta!`
      : `Alerta de Serpiente (${r.jump.label}) · ¡Se salva si acierta!`;

    $('ch-host-title').textContent = card.title;
    $('ch-host-prompt').textContent = card.prompt;
    $('ch-host-feedback').hidden = true;

    const optContainer = $('ch-host-options');
    optContainer.replaceChildren();
    const letters = ['A', 'B', 'C', 'D'];
    card.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'ch-opt-btn';
      btn.dataset.idx = String(idx);

      const spanLetter = document.createElement('span');
      spanLetter.className = 'opt-letter';
      spanLetter.textContent = letters[idx];

      const spanText = document.createElement('span');
      spanText.textContent = optText;

      btn.append(spanLetter, spanText);
      btn.addEventListener('click', () => {
        if (this.currentChallenge && !this.currentChallenge.answered) {
          this.onAnswer(player.id, { cardId: card.id, selectedIndex: idx });
        }
      });
      optContainer.append(btn);
    });

    modal.hidden = false;

    // Timer de 30s en host
    let timeLeft = 30;
    $('ch-host-timer').textContent = `${timeLeft}s`;
    $('ch-host-timer-fill').style.width = '100%';
    clearInterval(this.challengeTimer);
    this.challengeTimer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(this.challengeTimer);
        $('ch-host-timer').textContent = '0s';
        $('ch-host-timer-fill').style.width = '0%';
        if (this.currentChallenge && !this.currentChallenge.answered) {
          this.onAnswer(player.id, { cardId: card.id, selectedIndex: -1 });
        }
      } else {
        $('ch-host-timer').textContent = `${timeLeft}s`;
        $('ch-host-timer-fill').style.width = `${(timeLeft / 30) * 100}%`;
      }
    }, 1000);

    this.log(`${player.name} enfrenta validación ética: ${card.title}`, isLadder ? 'ladder' : 'snake', r.jump.label, player.color);

    // 2. Enviar a cliente móvil
    this.net?.send(player.id, {
      t: MSG.CHALLENGE,
      playerId: player.id,
      jump: r.jump,
      card: {
        id: card.id,
        kind: card.kind,
        theme: card.theme,
        title: card.title,
        prompt: card.prompt,
        options: card.options,
      },
      timeoutMs: 30000,
    });

    this.publish();

    // 3. Si es un bot, responde automáticamente
    if (player.id.startsWith('bot-')) {
      clearTimeout(this.botTimer);
      this.botTimer = setTimeout(() => {
        if (!this.currentChallenge || this.currentChallenge.answered) return;
        const willBeCorrect = Math.random() < 0.75;
        let pick = card.correct;
        if (!willBeCorrect) {
          const wrongIndices = [0, 1, 2, 3].filter((i) => i !== card.correct);
          pick = wrongIndices[Math.floor(Math.random() * wrongIndices.length)];
        }
        this.onAnswer(player.id, { cardId: card.id, selectedIndex: pick });
      }, 2500);
    }
  }

  async onAnswer(playerId, msg) {
    if (!this.currentChallenge || this.currentChallenge.playerId !== playerId) return;
    if (this.currentChallenge.answered) return;
    this.currentChallenge.answered = true;
    clearInterval(this.challengeTimer);
    clearTimeout(this.botTimer);

    const { card, jump, token } = this.currentChallenge;
    const player = this.game.state.players.find((p) => p.id === playerId);
    const isLadder = jump.kind === 'ladder';
    const isCorrect = msg.selectedIndex === card.correct;

    const res = this.game.resolveChallenge(playerId, isCorrect);

    this.net?.broadcast({
      t: MSG.CHALLENGE_RESULT,
      playerId,
      cardId: card.id,
      correct: isCorrect,
      selectedIndex: msg.selectedIndex,
      correctIndex: card.correct,
      explanation: card.explanation,
      tip: card.tip,
      outcome: res.outcome,
      newPosition: res.final,
    });

    // Actualizar UI del modal en el Host
    const optButtons = $('ch-host-options').querySelectorAll('.ch-opt-btn');
    optButtons.forEach((b, idx) => {
      b.disabled = true;
      if (idx === card.correct) b.classList.add('correct');
      else if (idx === msg.selectedIndex && !isCorrect) b.classList.add('wrong');
    });

    const fb = $('ch-host-feedback');
    const resTitle = $('ch-host-res');
    if (isCorrect) {
      resTitle.className = 'ch-res-success';
      resTitle.textContent = isLadder
        ? '✓ ¡Validación ética superada! Sube la escalera.'
        : '✓ ¡Mitigación aplicada! Se salva de caer por la serpiente.';
    } else {
      resTitle.className = 'ch-res-fail';
      resTitle.textContent = isLadder
        ? '✕ Validación fallida: Se queda en la casilla.'
        : '✕ Falla de mitigación: Cae en la trampa algorítmica.';
    }
    $('ch-host-expl').textContent = card.explanation;
    $('ch-host-tip').textContent = card.tip ? `› ${card.tip}` : '';
    fb.hidden = false;

    if (isCorrect) {
      if (isLadder) this.log(`${player.name} superó la validación ética: sube ${jump.from}→${jump.to}`, 'ladder', jump.label, player.color);
      else this.log(`¡Mitigación exitosa! ${player.name} neutralizó el sesgo de la serpiente ${jump.from}`, 'win', jump.label, THEME.lime);
    } else {
      if (isLadder) this.log(`${player.name} falló la validación: no sube y se queda en casilla ${jump.from}`, 'snake', jump.label, player.color);
      else this.log(`${player.name} cayó en la trampa de sesgo: desciende ${jump.from}→${jump.to}`, 'snake', jump.label, player.color);
    }

    try {
      if (res.outcome === 'climb') {
        await sleep(this.anim.reduced ? 200 : 500);
        await this.anim.slideAlongJump(token, jump.from, jump.to, 'ladder');
      } else if (res.outcome === 'fall') {
        await sleep(this.anim.reduced ? 200 : 500);
        await this.anim.slideAlongJump(token, jump.from, jump.to, 'snake');
      } else if (res.outcome === 'saved') {
        this.s3.highlightTile(jump.from, THEME.lime);
        await sleep(800);
      } else if (res.outcome === 'stay') {
        this.s3.highlightTile(jump.from, THEME.amber);
        await sleep(800);
      }

      if (res.bumped) {
        const victimToken = this.s3.tokens.get(res.bumped.playerId);
        this.log(`¡Casilla ocupada! ${player.name} desplaza a ${res.bumped.name} a la casilla 1`, 'snake', null, '#fb4a6b');
        if (victimToken) {
          await sleep(this.anim.reduced ? 100 : 250);
          await this.anim.hopToken(victimToken, victimToken.position.clone(), this.s3.tokenPosition(victimToken, 1), { height: 1.2, duration: 0.5 });
          victimToken.userData.tile = 1;
        }
      }

      if (res.won) {
        this.log(`${player.name} llega a la casilla 100: ¡despliegue ético!`, 'win', null, '#fbbf24');
        await this.anim.celebrate(token);
      } else if (res.extraTurn) {
        this.log(`${player.name} repite turno (sacó 6)`, '', null, player.color);
      }
    } catch (err) {
      console.error('Error animando resultado de desafío', err);
      if (token) token.position.copy(this.s3.tokenPosition(token, res.final));
    }

    await sleep(2500);
    $('challenge-modal').hidden = true;

    this.busy = false;
    this.currentChallenge = null;
    const st = this.game.state;
    this.s3.clearHighlights();
    this.publish();

    if (st.phase === 'finished') {
      this.showVictory(st);
    } else {
      const next = st.players.find((p) => p.id === st.turnPlayerId);
      if (next) this.anim.focusCamera(this.s3._center, { duration: 1.0 });
      this.maybeAutoplay();
    }
  }

  showVictory(st) {
    const w = st.players.find((p) => p.id === st.winnerId);
    $('victory-title').textContent = w ? `¡${w.name} gana!` : 'Partida terminada';
    $('victory-sub').textContent = w ? `${charOf(w.characterId).name} desplegó su modelo de forma ética.` : '';
    $('victory').hidden = false;
    $('again-btn').focus();
  }

  // ── Demo ────────────────────────────────────────────────────────────────
  async startDemo() {
    const names = ['Bot Alfa', 'Bot Beta', 'Bot Gamma'];
    names.forEach((name, i) => {
      this.game.addPlayer({ id: `bot-${i + 1}`, name, characterId: CHARACTERS[i].id });
      this.game.setReady(`bot-${i + 1}`, true);
    });
    $('hud-room').textContent = 'DEMO';
    $('room-code').textContent = 'DEMO';
    await sleep(1200);
    this.tryStart();
  }
}

const app = new HostApp();
window.__app = app; // depuración desde la consola
app.init();
