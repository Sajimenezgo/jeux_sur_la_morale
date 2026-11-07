// scene3d.js — render del tablero "plano de datos" con Three.js r160.
// Todas las texturas tienen FALLBACK procedural (CanvasTexture) si el PNG no carga.
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { THEME, BOARD, LADDERS, SNAKES, ASSETS, DICE_ATLAS, CHARACTERS } from './config.js';
import { tileToPosition } from './game.js';

const PITCH = BOARD.tileSize + BOARD.gap;
const hex = (n) => `#${n.toString(16).padStart(6, '0')}`;
const TAU = Math.PI * 2;

/**
 * Normales locales del cubo del dado (BoxGeometry: +x,-x,+y,-y,+z,-z) y valor de cada cara.
 * Opuestas suman 7: 3|4, 1|6, 2|5. Para mostrar `v` arriba: q = setFromUnitVectors(FACE_NORMAL[v], +Y).
 */
export const DICE_FACE_ORDER = [3, 4, 1, 6, 2, 5];
export const DICE_FACE_NORMAL = {
  3: new THREE.Vector3(1, 0, 0), 4: new THREE.Vector3(-1, 0, 0),
  1: new THREE.Vector3(0, 1, 0), 6: new THREE.Vector3(0, -1, 0),
  2: new THREE.Vector3(0, 0, 1), 5: new THREE.Vector3(0, 0, -1),
};

function makeCanvas(w, h) {
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  return c;
}

function canvasTex(canvas, { srgb = true, repeat = false } = {}) {
  const t = new THREE.CanvasTexture(canvas);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

// ── Fallbacks procedurales ───────────────────────────────────────────────────
function fbTile(alt) {
  const c = makeCanvas(256, 256), g = c.getContext('2d');
  g.fillStyle = alt ? '#13204a' : '#0f1a3a';
  g.fillRect(0, 0, 256, 256);
  g.strokeStyle = alt ? 'rgba(34,211,238,0.25)' : 'rgba(34,211,238,0.16)';
  g.lineWidth = 2;
  for (let i = 0; i <= 256; i += 32) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke();
    g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke();
  }
  g.strokeStyle = 'rgba(34,211,238,0.6)'; g.lineWidth = 6; g.strokeRect(3, 3, 250, 250);
  return canvasTex(c);
}
function fbBase() {
  const c = makeCanvas(256, 256), g = c.getContext('2d');
  g.fillStyle = '#0a1128'; g.fillRect(0, 0, 256, 256);
  g.strokeStyle = 'rgba(27,42,82,0.9)'; g.lineWidth = 1;
  for (let i = 0; i <= 256; i += 16) {
    g.beginPath(); g.moveTo(i, 0); g.lineTo(i, 256); g.stroke();
    g.beginPath(); g.moveTo(0, i); g.lineTo(256, i); g.stroke();
  }
  return canvasTex(c, { repeat: true });
}
function fbBackground() {
  const c = makeCanvas(512, 512), g = c.getContext('2d');
  g.fillStyle = '#070b16'; g.fillRect(0, 0, 512, 512);
  g.strokeStyle = 'rgba(27,42,82,0.8)'; g.lineWidth = 1;
  for (let i = 0; i <= 512; i += 32) {
    g.beginPath(); g.moveTo(i + 0.5, 0); g.lineTo(i + 0.5, 512); g.stroke();
    g.beginPath(); g.moveTo(0, i + 0.5); g.lineTo(512, i + 0.5); g.stroke();
  }
  return canvasTex(c, { repeat: true });
}
function fbDiceAtlas() {
  const cw = 170, W = cw * DICE_ATLAS.cols, H = cw * DICE_ATLAS.rows;
  const c = makeCanvas(W, H), g = c.getContext('2d');
  const pips = {
    1: [[0.5, 0.5]], 2: [[0.25, 0.25], [0.75, 0.75]], 3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
    5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
    6: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.5], [0.75, 0.5], [0.25, 0.75], [0.75, 0.75]],
  };
  for (const [v, [col, row]] of Object.entries(DICE_ATLAS.faces)) {
    const x = col * cw, y = row * cw;
    g.fillStyle = '#10193a'; g.fillRect(x, y, cw, cw);
    g.strokeStyle = hex(THEME.amber); g.lineWidth = 6; g.strokeRect(x + 4, y + 4, cw - 8, cw - 8);
    g.fillStyle = hex(THEME.amber);
    for (const [px, py] of pips[v]) { g.beginPath(); g.arc(x + px * cw, y + py * cw, cw * 0.075, 0, TAU); g.fill(); }
  }
  return canvasTex(c);
}
function fbToken(character) {
  const c = makeCanvas(256, 256), g = c.getContext('2d');
  const grad = g.createRadialGradient(128, 110, 20, 128, 128, 120);
  grad.addColorStop(0, '#1b2a52'); grad.addColorStop(1, '#0b1330');
  g.fillStyle = grad; g.beginPath(); g.arc(128, 128, 118, 0, TAU); g.fill();
  g.strokeStyle = character.color; g.lineWidth = 12; g.beginPath(); g.arc(128, 128, 112, 0, TAU); g.stroke();
  g.fillStyle = character.color; g.font = `700 120px ${THEME.fontMono}`;
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(character.glyph, 128, 136);
  return canvasTex(c);
}

function radialGlowTex() {
  const c = makeCanvas(128, 128), g = c.getContext('2d');
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, 'rgba(0,0,0,0.55)'); grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad; g.fillRect(0, 0, 128, 128);
  return canvasTex(c, { srgb: false });
}

function stripeTex(base, dark) {
  const c = makeCanvas(64, 16), g = c.getContext('2d');
  g.fillStyle = base; g.fillRect(0, 0, 64, 16);
  g.fillStyle = dark; g.fillRect(0, 0, 32, 16);
  g.fillStyle = 'rgba(255,255,255,0.18)'; g.fillRect(0, 6, 64, 3);
  const t = canvasTex(c, { repeat: true });
  t.repeat.set(16, 1);
  return t;
}

/** Escena 3D del juego. */
export class Scene3D {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {{onProgress?: (f:number)=>void}} [opts]
   */
  constructor(canvas, { onProgress } = {}) {
    this.canvas = canvas;
    this.onProgress = onProgress || (() => {});
    this.tokens = new Map();
    this.dice = null;
    this.diceRest = new THREE.Vector3(7.3, 0.55, 0.5);
    this.linkCurves = new Map();
    this.camera = null; this.renderer = null; this.scene = null; this.controls = null;
    this._listeners = new Map();
    this._highlights = [];
    this._disposables = [];
    this._texCache = new Map();
    this._running = false;
    this._raf = 0;
    this._clock = new THREE.Clock();
    this._time = 0;
    this._center = new THREE.Vector3(1.0, 0, 0.2);
    this._onResize = () => this.resize();
    this._onVis = () => { if (document.hidden) this._cancel(); else if (this._running) this._schedule(); };
  }

  // ── emisor mínimo ──
  on(evt, fn) { if (!this._listeners.has(evt)) this._listeners.set(evt, new Set()); this._listeners.get(evt).add(fn); return () => this.off(evt, fn); }
  off(evt, fn) { this._listeners.get(evt)?.delete(fn); }
  _emit(evt, ...a) { for (const fn of this._listeners.get(evt) ?? []) fn(...a); }

  _track(obj) { this._disposables.push(obj); return obj; }

  /** Carga una textura; devuelve null si falla (el llamador usa fallback). */
  _loadTexture(url, { srgb = true } = {}) {
    if (this._texCache.has(url)) return this._texCache.get(url);
    const p = new Promise((resolve) => {
      new THREE.TextureLoader().load(url, (t) => {
        if (srgb) t.colorSpace = THREE.SRGBColorSpace;
        t.anisotropy = Math.min(8, this.renderer?.capabilities.getMaxAnisotropy() ?? 1);
        resolve(this._track(t));
      }, undefined, () => resolve(null));
    });
    this._texCache.set(url, p);
    return p;
  }

  /** Inicializa renderer, escena, texturas y tablero. */
  async init() {
    const w = this.canvas.clientWidth || window.innerWidth, h = this.canvas.clientHeight || window.innerHeight;
    const renderer = this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(w, h, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const scene = this.scene = new THREE.Scene();
    scene.background = new THREE.Color(THEME.bg);
    scene.fog = new THREE.FogExp2(THEME.bg, 0.017);

    this.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 200);
    this.camera.position.set(this._center.x, 11, 11.5);
    const controls = this.controls = new OrbitControls(this.camera, this.canvas);
    controls.target.copy(this._center);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = 1.2;
    controls.minAzimuthAngle = -0.9;
    controls.maxAzimuthAngle = 0.9;
    controls.minDistance = 8;
    controls.maxDistance = 28;
    controls.rotateSpeed = 0.6;

    this._buildLights();

    // Carga de texturas con progreso
    const jobs = [
      ['tile', ASSETS.boardTile], ['normal', ASSETS.boardNormal, false], ['alt', ASSETS.boardTileAlt],
      ['base', ASSETS.boardBase], ['dice', ASSETS.diceAtlas], ['bg', ASSETS.background],
    ];
    let done = 0;
    const tex = {};
    await Promise.all(jobs.map(async ([key, url, srgb]) => {
      tex[key] = await this._loadTexture(url, { srgb: srgb !== false });
      this.onProgress(++done / jobs.length);
    }));
    this.tex = {
      tile: tex.tile || this._track(fbTile(false)),
      alt: tex.alt || tex.tile || this._track(fbTile(true)),
      normal: tex.normal || null,
      base: tex.base || this._track(fbBase()),
      dice: tex.dice || this._track(fbDiceAtlas()),
      bg: tex.bg || this._track(fbBackground()),
    };

    this._buildGround();
    this._buildBoard();
    this._buildDice();
    this._buildStarfield();
    this.drawLinks();

    window.addEventListener('resize', this._onResize);
    document.addEventListener('visibilitychange', this._onVis);
    this.resize();
    this.renderer.render(this.scene, this.camera);
  }

  _buildLights() {
    const { scene } = this;
    scene.add(new THREE.HemisphereLight(0x5b78c8, 0x0a1024, 0.9));
    const key = new THREE.DirectionalLight(0xdff7ff, 2.6);
    key.position.set(6, 13, 7);
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    const s = 10;
    Object.assign(key.shadow.camera, { left: -s, right: s, top: s, bottom: -s, near: 1, far: 40 });
    key.shadow.bias = -0.0004; key.shadow.normalBias = 0.03; key.shadow.radius = 3;
    scene.add(key);
    const rim = new THREE.DirectionalLight(THEME.magenta, 1.6);
    rim.position.set(-9, 5, -8);
    scene.add(rim);
    const cyan = new THREE.PointLight(THEME.cyan, 18, 22, 1.6);
    cyan.position.set(0, 3.2, 0);
    scene.add(cyan);
    this.lights = { key, rim, cyan };
  }

  _buildGround() {
    const bg = this.tex.bg;
    bg.wrapS = bg.wrapT = THREE.RepeatWrapping;
    bg.repeat.set(24, 24);
    const geo = this._track(new THREE.PlaneGeometry(120, 120));
    const mat = this._track(new THREE.MeshStandardMaterial({ map: bg, roughness: 0.95, metalness: 0, color: 0x9fb2d8 }));
    const ground = new THREE.Mesh(geo, mat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.42;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  _buildBoard() {
    const group = this.board = new THREE.Group();
    const span = BOARD.size * PITCH + 0.5;

    // Base: losa del tablero
    const baseTex = this.tex.base;
    baseTex.wrapS = baseTex.wrapT = THREE.RepeatWrapping;
    baseTex.repeat.set(4, 4);
    const baseGeo = this._track(new THREE.BoxGeometry(span, 0.5, span));
    const baseMat = this._track(new THREE.MeshStandardMaterial({ map: baseTex, roughness: 0.8, metalness: 0.2 }));
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -0.2;
    base.castShadow = true; base.receiveShadow = true;
    group.add(base);

    // Marco luminoso
    const frameGeo = this._track(new THREE.EdgesGeometry(baseGeo));
    const frame = new THREE.LineSegments(frameGeo, this._track(new THREE.LineBasicMaterial({ color: THEME.cyan, transparent: true, opacity: 0.8 })));
    frame.position.copy(base.position);
    group.add(frame);

    // 100 bloques con geometría compartida; 2 materiales (tablero ajedrezado) + variantes de color
    const tileGeo = this._track(new THREE.BoxGeometry(BOARD.tileSize, BOARD.tileHeight + 0.2, BOARD.tileSize));
    const mkMat = (map, color) => this._track(new THREE.MeshStandardMaterial({
      map, color, roughness: 0.55, metalness: 0.25,
      normalMap: this.tex.normal || null, normalScale: new THREE.Vector2(0.6, 0.6),
      emissive: color, emissiveIntensity: 0.0,
    }));
    const ladderFrom = new Set(LADDERS.map((l) => l.from));
    const snakeFrom = new Set(SNAKES.map((s) => s.from));
    const matA = mkMat(this.tex.tile, 0xffffff);
    const matB = mkMat(this.tex.alt, 0xffffff);
    const matL = mkMat(this.tex.tile, 0xcdf59a);
    const matS = mkMat(this.tex.alt, 0xffb3c4);
    const matG = mkMat(this.tex.tile, 0xffe18a);
    matL.emissive.set(THEME.lime); matL.emissiveIntensity = 0.12;
    matS.emissive.set(THEME.red); matS.emissiveIntensity = 0.12;
    matG.emissive.set(THEME.amber); matG.emissiveIntensity = 0.25;

    this.tileMeshes = [];
    for (let n = 1; n <= BOARD.tiles; n++) {
      const p = tileToPosition(n);
      const special = ladderFrom.has(n) ? matL : snakeFrom.has(n) ? matS : n === BOARD.tiles ? matG : null;
      const row = Math.floor((n - 1) / BOARD.size), col = (n - 1) % BOARD.size;
      const mesh = new THREE.Mesh(tileGeo, special || ((row + col) % 2 === 0 ? matA : matB));
      mesh.position.set(p.x, p.y - (BOARD.tileHeight + 0.2) / 2, p.z);
      mesh.castShadow = true; mesh.receiveShadow = true;
      group.add(mesh);
      this.tileMeshes[n] = mesh;

      const color = ladderFrom.has(n) ? hex(THEME.lime) : snakeFrom.has(n) ? hex(THEME.red) : n === BOARD.tiles ? hex(THEME.amber) : '#9fd9ff';
      group.add(this._numberLabel(n, color, p));
    }

    // Etiqueta de inicio (casilla 0)
    const p0 = tileToPosition(0);
    const startPad = new THREE.Mesh(
      this._track(new THREE.CylinderGeometry(0.5, 0.55, 0.12, 32)),
      this._track(new THREE.MeshStandardMaterial({ color: 0x0f1730, emissive: THEME.cyan, emissiveIntensity: 0.25, roughness: 0.5, metalness: 0.4 })),
    );
    startPad.position.set(p0.x, p0.y - 0.1, p0.z);
    startPad.receiveShadow = true;
    group.add(startPad);
    group.add(this._textPlane('INICIO', hex(THEME.cyan), 1.1, 0.34, { x: p0.x, y: p0.y + 0.015, z: p0.z + 0.78 }));
    group.add(this._textPlane('META · 100', hex(THEME.amber), 1.4, 0.3, { x: tileToPosition(100).x, y: p0.y + 0.015, z: tileToPosition(100).z - 0.85 }));

    this.scene.add(group);
  }

  _numberLabel(n, color, p) {
    const c = makeCanvas(128, 128), g = c.getContext('2d');
    g.fillStyle = color;
    g.font = `600 34px ${THEME.fontMono}`;
    g.textAlign = 'left'; g.textBaseline = 'top';
    g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 4;
    g.fillText(String(n).padStart(2, '0'), 10, 8);
    const tex = canvasTex(c);
    const mat = this._track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false }));
    this._track(tex);
    if (!Scene3D._labelGeo) Scene3D._labelGeo = new THREE.PlaneGeometry(BOARD.tileSize, BOARD.tileSize);
    const m = new THREE.Mesh(Scene3D._labelGeo, mat);
    m.rotation.x = -Math.PI / 2;
    m.position.set(p.x, p.y + 0.006, p.z);
    return m;
  }

  _textPlane(text, color, w, h, pos) {
    const c = makeCanvas(256, Math.round(256 * h / w)), g = c.getContext('2d');
    g.fillStyle = color; g.font = `700 ${Math.round(c.height * 0.62)}px ${THEME.fontMono}`;
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, c.width / 2, c.height / 2);
    const tex = this._track(canvasTex(c));
    const m = new THREE.Mesh(this._track(new THREE.PlaneGeometry(w, h)), this._track(new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false })));
    m.rotation.x = -Math.PI / 2;
    m.position.set(pos.x, pos.y, pos.z);
    return m;
  }

  _buildDice() {
    const geo = this._track(new THREE.BoxGeometry(0.95, 0.95, 0.95));
    // Remapea UV de cada cara a su celda del atlas
    const uv = geo.attributes.uv;
    DICE_FACE_ORDER.forEach((value, f) => {
      const [col, row] = DICE_ATLAS.faces[value];
      const u0 = col / DICE_ATLAS.cols, u1 = (col + 1) / DICE_ATLAS.cols;
      const v1 = 1 - row / DICE_ATLAS.rows, v0 = 1 - (row + 1) / DICE_ATLAS.rows;
      const e = 0.004; // evita sangrado entre celdas
      const quad = [[u0 + e, v1 - e], [u1 - e, v1 - e], [u0 + e, v0 + e], [u1 - e, v0 + e]];
      for (let i = 0; i < 4; i++) uv.setXY(f * 4 + i, quad[i][0], quad[i][1]);
    });
    uv.needsUpdate = true;
    const mat = this._track(new THREE.MeshStandardMaterial({
      map: this.tex.dice, roughness: 0.35, metalness: 0.3,
      emissive: THEME.amber, emissiveMap: this.tex.dice, emissiveIntensity: 0.35,
    }));
    const dice = this.dice = new THREE.Mesh(geo, mat);
    dice.castShadow = true;
    dice.position.copy(this.diceRest);
    dice.userData.value = 1;
    this.setDiceValue(1);
    this.scene.add(dice);

    // Pad luminoso bajo el dado
    const ring = new THREE.Mesh(
      this._track(new THREE.RingGeometry(0.85, 0.95, 48)),
      this._track(new THREE.MeshBasicMaterial({ color: THEME.amber, transparent: true, opacity: 0.55, side: THREE.DoubleSide })),
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(this.diceRest.x, -0.4, this.diceRest.z);
    this.scene.add(ring);
  }

  /** Orienta el dado mostrando `value` arriba (con giro yaw opcional). */
  setDiceValue(value, yaw = 0.4) {
    const q = new THREE.Quaternion().setFromUnitVectors(DICE_FACE_NORMAL[value], new THREE.Vector3(0, 1, 0));
    const qy = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), yaw);
    this.dice.quaternion.copy(qy.multiply(q));
    this.dice.userData.value = value;
  }

  _buildStarfield() {
    const n = 220, pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 50;
      pos[i * 3 + 1] = 1 + Math.random() * 12;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    const geo = this._track(new THREE.BufferGeometry());
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.points = new THREE.Points(geo, this._track(new THREE.PointsMaterial({ color: THEME.cyan, size: 0.06, transparent: true, opacity: 0.55, depthWrite: false })));
    this.scene.add(this.points);
  }

  // ── Tokens ────────────────────────────────────────────────────────────────
  /** Desplazamiento de la ficha dentro de la casilla (evita solaparse). */
  _slotOffset(index) {
    const slots = [
      [-0.22, -0.22], [0.22, -0.22], [-0.22, 0.22], [0.22, 0.22],
      [0, -0.24], [0, 0.24], [-0.24, 0], [0.24, 0],
      [0, 0], [-0.12, -0.12], [0.12, -0.12], [-0.12, 0.12],
      [0.12, 0.12], [-0.12, 0.22], [0.12, -0.22],
    ];
    const [x, z] = slots[index % slots.length];
    return new THREE.Vector3(x, 0, z);
  }

  /** Posición mundo de la ficha de `token` sobre la casilla `n` (incluye offset de slot). */
  tokenPosition(token, n) {
    const p = tileToPosition(n);
    return new THREE.Vector3(p.x, p.y, p.z).add(token.userData.offset);
  }

  /**
   * Crea la ficha de un jugador.
   * @param {string} playerId @param {object} character entrada de CHARACTERS @param {number} tile
   */
  addToken(playerId, character, tile = 0) {
    if (this.tokens.has(playerId)) this.removeToken(playerId);
    const color = new THREE.Color(character.color);
    const group = new THREE.Group();
    group.userData = { playerId, tile, color: character.color, offset: this._slotOffset(this.tokens.size) };

    const body = new THREE.Mesh(
      this._track(new THREE.CylinderGeometry(0.2, 0.26, 0.12, 24)),
      this._track(new THREE.MeshStandardMaterial({ color: 0x0b1330, emissive: color, emissiveIntensity: 0.35, roughness: 0.4, metalness: 0.5 })),
    );
    body.position.y = 0.06; body.castShadow = true;
    group.add(body);

    const ring = new THREE.Mesh(
      this._track(new THREE.TorusGeometry(0.27, 0.028, 8, 36)),
      this._track(new THREE.MeshBasicMaterial({ color, toneMapped: false })),
    );
    ring.rotation.x = Math.PI / 2; ring.position.y = 0.05;
    group.add(ring);

    const stem = new THREE.Mesh(
      this._track(new THREE.CylinderGeometry(0.018, 0.018, 0.3, 6)),
      this._track(new THREE.MeshBasicMaterial({ color, toneMapped: false })),
    );
    stem.position.y = 0.27;
    group.add(stem);

    const spriteMat = new THREE.SpriteMaterial({ map: this._tokenFallback(character), transparent: true, depthWrite: false });
    const sprite = new THREE.Sprite(spriteMat);
    sprite.scale.set(0.62, 0.62, 1);
    sprite.position.y = 0.66;
    group.add(sprite);
    this._track(spriteMat);
    this._loadTexture(character.token).then((t) => {
      if (t && this.tokens.get(playerId) === group) { spriteMat.map = t; spriteMat.needsUpdate = true; }
    });

    const shadow = new THREE.Mesh(
      this._track(new THREE.PlaneGeometry(0.9, 0.9)),
      this._track(new THREE.MeshBasicMaterial({ map: this._glow || (this._glow = this._track(radialGlowTex())), transparent: true, depthWrite: false })),
    );
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.004;
    group.userData.shadow = shadow;
    group.add(shadow);

    group.userData.ring = ring;
    group.position.copy(this.tokenPosition(group, tile));
    this.scene.add(group);
    this.tokens.set(playerId, group);
    return group;
  }

  _tokenFallback(character) {
    this._tokFb ??= new Map();
    if (!this._tokFb.has(character.id)) this._tokFb.set(character.id, this._track(fbToken(character)));
    return this._tokFb.get(character.id);
  }

  removeToken(playerId) {
    const t = this.tokens.get(playerId);
    if (!t) return;
    this.scene.remove(t);
    this.tokens.delete(playerId);
    // Reasigna slots para mantener separación
    let i = 0;
    for (const tok of this.tokens.values()) { tok.userData.offset = this._slotOffset(i++); tok.position.copy(this.tokenPosition(tok, tok.userData.tile)); }
  }

  // ── Resaltado de casillas ────────────────────────────────────────────────
  highlightTile(n, color = THEME.cyan) {
    const p = tileToPosition(n);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9, side: THREE.DoubleSide, toneMapped: false, depthWrite: false });
    const ring = new THREE.Mesh(this._ringGeo ??= this._track(new THREE.RingGeometry(0.62, 0.72, 4, 1, Math.PI / 4)), mat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(p.x, p.y + 0.02, p.z);
    ring.userData.phase = Math.random() * TAU;
    this.scene.add(ring);
    this._highlights.push(ring);
    return ring;
  }

  clearHighlights() {
    for (const r of this._highlights) { this.scene.remove(r); r.material.dispose(); }
    this._highlights.length = 0;
  }

  // ── Escaleras y serpientes ───────────────────────────────────────────────
  /** Curva (CatmullRom) que sigue una ficha al saltar de `from` a `to`. */
  getLinkCurve(from, to) { return this.linkCurves.get(`${from}-${to}`)?.curve ?? null; }

  /** Dibuja escaleras (rieles + peldaños) y serpientes (tubos ondulantes). Idempotente. */
  drawLinks() {
    if (this.links) {
      this.scene.remove(this.links);
      this.links.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material && o.userData.ownMat) o.material.dispose(); });
    }
    this.linkCurves.clear();
    const group = this.links = new THREE.Group();
    const up = new THREE.Vector3(0, 1, 0);
    const lift = BOARD.tileHeight;

    const limeMat = this._limeMat ??= this._track(new THREE.MeshStandardMaterial({ color: THEME.lime, emissive: THEME.lime, emissiveIntensity: 0.9, roughness: 0.3, metalness: 0.3 }));
    const rungMat = this._rungMat ??= this._track(new THREE.MeshStandardMaterial({ color: 0xe9ffc2, emissive: THEME.lime, emissiveIntensity: 0.5, roughness: 0.4 }));

    // Escaleras
    let rungCount = 0;
    const rungs = [];
    for (const l of LADDERS) {
      const a = tileToPosition(l.from), b = tileToPosition(l.to);
      const A = new THREE.Vector3(a.x, lift + 0.05, a.z), B = new THREE.Vector3(b.x, lift + 0.05, b.z);
      const mid = A.clone().lerp(B, 0.5); mid.y += 0.55;
      const curve = new THREE.CatmullRomCurve3([A, A.clone().lerp(B, 0.25).setY(lift + 0.4), mid, A.clone().lerp(B, 0.75).setY(lift + 0.4), B]);
      this.linkCurves.set(`${l.from}-${l.to}`, { curve, kind: 'ladder' });
      const SEG = 48;
      const sideOf = (t) => new THREE.Vector3().crossVectors(up, curve.getTangentAt(t)).setY(0).normalize();
      for (const sgn of [-1, 1]) {
        const pts = [];
        for (let i = 0; i <= SEG; i++) { const t = i / SEG; pts.push(curve.getPointAt(t).add(sideOf(t).multiplyScalar(0.15 * sgn))); }
        const rail = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), SEG, 0.032, 6, false), limeMat);
        rail.castShadow = true;
        group.add(rail);
      }
      const len = curve.getLength();
      const count = Math.max(4, Math.floor(len / 0.4));
      for (let i = 0; i <= count; i++) {
        const t = i / count, p = curve.getPointAt(t), T = curve.getTangentAt(t), S = sideOf(t);
        const U = new THREE.Vector3().crossVectors(T, S).normalize();
        rungs.push(new THREE.Matrix4().makeBasis(S, U, T).setPosition(p));
      }
      rungCount += count + 1;
    }
    const rungGeo = new THREE.BoxGeometry(0.34, 0.035, 0.05);
    const rungMesh = new THREE.InstancedMesh(rungGeo, rungMat, rungCount);
    rungs.forEach((m, i) => rungMesh.setMatrixAt(i, m));
    rungMesh.castShadow = true;
    group.add(rungMesh);

    // Serpientes
    SNAKES.forEach((s, idx) => {
      const a = tileToPosition(s.from), b = tileToPosition(s.to);
      const A = new THREE.Vector3(a.x, lift, a.z), B = new THREE.Vector3(b.x, lift, b.z);
      const dir = B.clone().sub(A), len = dir.length();
      const side = new THREE.Vector3().crossVectors(up, dir).setY(0).normalize();
      const waves = Math.max(2, Math.round(len / 1.8));
      const pts = [];
      const N = 40;
      for (let i = 0; i <= N; i++) {
        const t = i / N;
        const env = Math.sin(Math.PI * t) * 0.55 + 0.08;
        const lateral = Math.sin(t * Math.PI * waves * 1.0 + idx) * env;
        const p = A.clone().lerp(B, t).add(side.clone().multiplyScalar(lateral));
        p.y = lift + 0.16 + Math.sin(t * Math.PI * waves * 2 + idx) * 0.04 + Math.sin(Math.PI * t) * 0.1;
        pts.push(p);
      }
      const curve = new THREE.CatmullRomCurve3(pts);
      this.linkCurves.set(`${s.from}-${s.to}`, { curve, kind: 'snake' });
      const radial = 10, tub = 80;
      const geo = new THREE.TubeGeometry(curve, tub, 0.13, radial, false);
      // Estrecha hacia la cola
      const posAttr = geo.attributes.position;
      for (let i = 0; i <= tub; i++) {
        const c = curve.getPointAt(i / tub);
        const k = i / tub;
        const scale = k < 0.12 ? 0.85 + 0.15 * (k / 0.12) : 1 - 0.7 * ((k - 0.12) / 0.88);
        for (let j = 0; j <= radial; j++) {
          const vi = i * (radial + 1) + j;
          const v = new THREE.Vector3().fromBufferAttribute(posAttr, vi).sub(c).multiplyScalar(scale).add(c);
          posAttr.setXYZ(vi, v.x, v.y, v.z);
        }
      }
      posAttr.needsUpdate = true;
      const col = idx % 2 === 0 ? THEME.magenta : THEME.red;
      const stripe = this._track(stripeTex(hex(col), hex(col === THEME.magenta ? 0x9a3ab0 : 0xb02a48)));
      const mat = this._track(new THREE.MeshStandardMaterial({ map: stripe, color: 0xffffff, emissive: col, emissiveIntensity: 0.25, roughness: 0.45, metalness: 0.2 }));
      const body = new THREE.Mesh(geo, mat);
      body.castShadow = true;
      group.add(body);

      // Cabeza y ojos en `from`
      const tan = curve.getTangentAt(0);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.2, 16, 12), mat);
      head.scale.set(1, 0.8, 1.25);
      head.position.copy(curve.getPointAt(0)).add(tan.clone().multiplyScalar(-0.05));
      head.lookAt(head.position.clone().sub(tan));
      head.castShadow = true;
      group.add(head);
      const eyeMat = this._eyeMat ??= this._track(new THREE.MeshBasicMaterial({ color: THEME.amber, toneMapped: false }));
      for (const sgn of [-1, 1]) {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 6), eyeMat);
        eye.position.copy(head.position).add(new THREE.Vector3().crossVectors(up, tan).normalize().multiplyScalar(0.11 * sgn)).add(new THREE.Vector3(0, 0.1, 0)).add(tan.clone().multiplyScalar(-0.1));
        group.add(eye);
      }
    });

    // Los materiales/geometrías creados aquí se liberan al re-dibujar o en dispose()
    group.traverse((o) => { if (o.geometry) this._disposables.push(o.geometry); });
    this.scene.add(group);
  }

  // ── Cámara / resize / loop ───────────────────────────────────────────────
  /** Distancia de encuadre según aspecto (más lejos en pantallas verticales). */
  _fitDistance(aspect) {
    const base = 17.5;
    return aspect >= 1.45 ? base : base * Math.min(1.9, 1.45 / Math.max(aspect, 0.4));
  }

  resize() {
    if (!this.renderer) return;
    const w = this.canvas.clientWidth || window.innerWidth, h = this.canvas.clientHeight || window.innerHeight;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    const dist = this._fitDistance(w / h);
    const dir = this.camera.position.clone().sub(this.controls.target);
    if (dir.length() > 0) {
      this.controls.maxDistance = Math.max(28, dist * 1.4);
      if (!this._fitted || this._lastAspect !== w / h) {
        dir.setLength(dist);
        this.camera.position.copy(this.controls.target).add(dir);
        this._fitted = true;
      }
    }
    this._lastAspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._clock.getDelta();
    if (!document.hidden) this._schedule();
  }

  stop() { this._running = false; this._cancel(); }

  _schedule() { if (!this._raf) this._raf = requestAnimationFrame(() => this._tick()); }
  _cancel() { if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; } }

  _tick() {
    this._raf = 0;
    if (!this._running || document.hidden) return;
    const dt = Math.min(this._clock.getDelta(), 0.1);
    this._time += dt;
    // Animaciones ambientales
    for (const r of this._highlights) r.material.opacity = 0.5 + 0.4 * Math.sin(this._time * 5 + r.userData.phase);
    if (this.points) this.points.rotation.y += dt * 0.01;
    this.controls.update();
    this._emit('frame', dt, this._time);
    this.renderer.render(this.scene, this.camera);
    this._schedule();
  }

  /** Libera todo. */
  dispose() {
    this.stop();
    window.removeEventListener('resize', this._onResize);
    document.removeEventListener('visibilitychange', this._onVis);
    this.clearHighlights();
    this.controls?.dispose();
    for (const d of this._disposables) { try { d.dispose?.(); } catch { /* noop */ } }
    this._disposables.length = 0;
    this.scene?.traverse((o) => { if (o.geometry) o.geometry.dispose(); });
    this.renderer?.dispose();
    this._listeners.clear();
    this.tokens.clear();
  }
}
