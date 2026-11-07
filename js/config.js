// config.js — ÚNICA fuente de verdad: identidad visual, personajes, tablero, assets.
// ES module sin dependencias. Lo importan game.js, network.js, scene3d.js, animations.js y las UIs.

export const GAME = Object.freeze({
  name: 'Gradient Ladders',
  tagline: 'Desciende el gradiente. Evita el sesgo.',
  version: '0.1.0',
  maxPlayers: 15,
  minPlayers: 2,
  peerPrefix: 'gradient-ladders-', // peerId = prefix + ROOM CODE (4 chars)
  roomCodeAlphabet: 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  roomCodeLength: 4,
});

// ── Tokens de diseño (reflejados como CSS vars en css/style.css) ──────────────
export const THEME = Object.freeze({
  bg:        0x070b16, // void
  bgPanel:   0x0f1730, // panel
  grid:      0x1b2a52, // líneas de rejilla
  cyan:      0x22d3ee, // señal / primario
  magenta:   0xe879f9, // modelo / acento
  amber:     0xfbbf24, // alerta / dado
  lime:      0xa3e635, // éxito / escalera
  red:       0xfb4a6b, // error / serpiente
  violet:    0x8b5cf6,
  orange:    0xfb923c,
  text:      0xe6edf7,
  textDim:   0x8aa0c8,
  fontDisplay: "'Space Grotesk', system-ui, sans-serif",
  fontMono:    "'JetBrains Mono', ui-monospace, monospace",
});

// ── Personajes seleccionables (roles de ciencia de datos) ────────────────────
// token: ficha circular con transparencia (PNG/SVG) en assets/tokens/
export const CHARACTERS = Object.freeze([
  { id: 'scientist', name: 'Data Scientist',  glyph: 'Σ',  color: '#22d3ee', blurb: 'Hipótesis primero, modelos después.' },
  { id: 'mlengineer', name: 'ML Engineer',    glyph: '◉',  color: '#e879f9', blurb: 'Si no está en producción, no existe.' },
  { id: 'statistician', name: 'Estadístico/a', glyph: 'μ',  color: '#fbbf24', blurb: 'Correlación no es causalidad.' },
  { id: 'analyst', name: 'Data Analyst',      glyph: '▮',  color: '#a3e635', blurb: 'Un buen gráfico vale mil filas.' },
  { id: 'engineer', name: 'Data Engineer',    glyph: '⇶',  color: '#fb923c', blurb: 'El pipeline nunca duerme.' },
  { id: 'auditor', name: 'AI Ethicist',       glyph: '⚖',  color: '#8b5cf6', blurb: 'Audita antes de desplegar.' },
  { id: 'prompt_eng', name: 'Prompt Engineer', glyph: '✦', color: '#38bdf8', blurb: 'Contexto, pocos ejemplos y temperatura.' },
  { id: 'nlp_spec', name: 'NLP Specialist',    glyph: '¶', color: '#c084fc', blurb: 'Semántica densa, embeddings y atención.' },
  { id: 'cv_spec', name: 'Vision Specialist',  glyph: '◎', color: '#34d399', blurb: 'Convoluciones, píxeles y segmentación.' },
  { id: 'rl_agent', name: 'RL Researcher',     glyph: '⚡', color: '#f43f5e', blurb: 'Recompensas alineadas, políticas óptimas.' },
  { id: 'gov_officer', name: 'Governance Lead', glyph: '🏛', color: '#a855f7', blurb: 'Cumplimiento normativo y sandboxes.' },
  { id: 'security_sec', name: 'AI Red Teamer', glyph: '🛡', color: '#e11d48', blurb: 'Jailbreaks, inyecciones y robustez.' },
  { id: 'bio_informatic', name: 'Health AI Lead', glyph: '✚', color: '#10b981', blurb: 'Marcadores clínicos y validación local.' },
  { id: 'climate_ai', name: 'Green AI Architect', glyph: '☘', color: '#4ade80', blurb: 'Huella de carbono y modelos eficientes.' },
  { id: 'eval_psych', name: 'Psychometrician', glyph: 'Ψ', color: '#f59e0b', blurb: 'Evaluación ciega, fiabilidad y validez.' },
].map((c) => Object.freeze({
  ...c,
  token: `assets/tokens/token_${c.id}.png`,
  portrait: `assets/tokens/portrait_${c.id}.svg`,
})));

// ── Tablero 10×10, numeración serpentina (boustrophedon) ─────────────────────
// Casilla 1 abajo-izquierda; las filas impares (0,2,..) van →, las pares ←.
export const BOARD = Object.freeze({
  size: 10,
  tiles: 100,
  tileSize: 1.0,   // arista del bloque en unidades Three
  gap: 0.12,       // separación entre bloques
  tileHeight: 0.28,
  // pitch = tileSize + gap ; el tablero se centra en el origen (0,0,0)
});

// Ladders (suben, "buenas prácticas") y snakes (bajan, "sesgos / errores")
// from → to. Casilla 100 = despliegue ético en producción (meta).
export const LADDERS = Object.freeze([
  { from: 4,  to: 25, label: 'Limpieza de datos' },
  { from: 13, to: 46, label: 'Validación cruzada' },
  { from: 33, to: 49, label: 'Feature engineering' },
  { from: 42, to: 63, label: 'Explicabilidad (XAI)' },
  { from: 50, to: 69, label: 'Revisión por pares' },
  { from: 62, to: 81, label: 'Datos representativos' },
  { from: 74, to: 92, label: 'Auditoría de equidad' },
]);

export const SNAKES = Object.freeze([
  { from: 27, to: 5,  label: 'Fuga de datos (data leakage)' },
  { from: 40, to: 3,  label: 'Sobreajuste (overfitting)' },
  { from: 43, to: 18, label: 'Sesgo de muestreo' },
  { from: 54, to: 31, label: 'p-hacking' },
  { from: 66, to: 45, label: 'Correlación espuria' },
  { from: 76, to: 58, label: 'Sesgo algorítmico' },
  { from: 89, to: 53, label: 'Caja negra sin auditar' },
  { from: 99, to: 41, label: 'Despliegue sin consentimiento' },
]);

// ── Assets (rutas relativas a la raíz del sitio, compatibles con GitHub Pages)
export const ASSETS = Object.freeze({
  boardTile:   'assets/textures/board_tile_albedo.png',
  boardNormal: 'assets/textures/board_tile_normal.png',
  boardTileAlt:'assets/textures/board_tile_alt_albedo.png',
  boardBase:   'assets/textures/board_base_albedo.png',
  diceAtlas:   'assets/textures/dice_atlas.png', // 3×2, caras 1..6 (ver docs/ARCHITECTURE.md)
  logo:        'assets/brand/logo.svg',
  logoMark:    'assets/brand/logo_mark.svg',
  background:  'assets/brand/bg_grid.png',
});

// Mapa UV del atlas del dado: 3 columnas × 2 filas. Cara n → {col,row} (row 0 = arriba)
export const DICE_ATLAS = Object.freeze({
  cols: 3, rows: 2,
  faces: { 1: [0, 0], 2: [1, 0], 3: [2, 0], 4: [0, 1], 5: [1, 1], 6: [2, 1] },
});
