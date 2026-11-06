# Gradient Ladders — Arquitectura y contratos

Juego 3D multijugador tipo Serpientes y Escaleras con temática de ciencia de datos y ética de IA.
Sitio 100% estático (GitHub Pages). Pantalla principal (`index.html`, "HOST") + celulares como mandos (`mobile.html`, "CONTROLLER") vía PeerJS/WebRTC.

## Reglas generales
- ES modules nativos, sin bundler. Dependencias por **importmap** desde CDN con versión fija:
  - `three` → `https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js`, `three/addons/` → `https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/`
  - `gsap` → `https://cdn.jsdelivr.net/npm/gsap@3.12.5/index.js` (módulo ESM)
  - PeerJS → `<script src="https://cdn.jsdelivr.net/npm/peerjs@1.5.4/dist/peerjs.min.js">` (global `Peer`)
- Rutas relativas (sin `/` inicial) para funcionar bajo `https://user.github.io/repo/`.
- Todo texto de UI en **español**. Código y comentarios en español/inglés técnico, JSDoc en funciones públicas.
- `js/config.js` es la fuente de verdad (THEME, CHARACTERS, BOARD, LADDERS, SNAKES, ASSETS, DICE_ATLAS, GAME). **No duplicar** esos datos; importarlos.
- `game.js` y `network.js` NO importan Three.js ni tocan el DOM salvo lo indicado (testeable en Node).
- Accesibilidad: `prefers-reduced-motion`, contraste AA, botones ≥ 48px en móvil, `touch-action: manipulation`.
- Rendimiento: `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, sombras 2048², `InstancedMesh` o geometría compartida para los 100 bloques, dispose de recursos, pausa del loop si `document.hidden`.

## Coordenadas del tablero (game.js, fuente única)
- `pitch = BOARD.tileSize + BOARD.gap`. Tablero centrado en origen. Plano XZ, Y hacia arriba.
- Casilla `n` (1..100): `i = n-1; row = floor(i/10); colInRow = i%10; col = row%2===0 ? colInRow : 9-colInRow`.
- `x = (col - 4.5) * pitch`, `z = (4.5 - row) * pitch` (casilla 1 en esquina cercana-izquierda, la 100 arriba; `-z` es el fondo).
- `y` = parte superior del bloque = `BOARD.tileHeight`.
- Casilla 0 = "fuera del tablero" (inicio): posicionada en `x=-5.5*pitch - 0.6, z = 4.5*pitch` (junto a la casilla 1).

## game.js (motor lógico, puro)
```js
export function tileToXZ(n)            // → {x, z}   (n 0..100)
export function tileToPosition(n)      // → {x, y, z} (y = altura de pisada)
export function resolveJump(n)         // → {to, kind: 'ladder'|'snake'|null, label|null}
export class Game {
  constructor({ rng = Math.random } = {})
  addPlayer({ id, name, characterId })       // → player | throws si lleno/duplicado/personaje tomado
  removePlayer(id)
  setReady(id, bool); get canStart()
  start()                                    // fase 'playing', turno del primer jugador
  roll(playerId)                             // valida turno → resultado (ver abajo); throws si no es su turno
  get state()                                // snapshot serializable (ver abajo)
  on(evt, fn) / off(evt, fn)                 // eventos: 'playerAdded','playerRemoved','started','rolled','moved','jumped','turn','won'
}
```
- Fase: `'lobby' | 'playing' | 'finished'`.
- Regla de meta: se necesita tirada **exacta** a 100; si se pasa, rebota (`target = 100 - (n+d-100)`) — documentar y testear.
- Un 6 da turno extra (máx. 2 seguidos; el 3º 6 pierde el turno).
- `roll()` devuelve y emite: `{ playerId, dice, from, path:[n,...] /*casillas pisadas, incl. rebote*/, landed, jump: {from,to,kind,label}|null, final, extraTurn, won }`.
- `state` snapshot: `{ phase, players:[{id,name,characterId,color,position,ready,connected}], turnPlayerId, turnNumber, lastRoll, winnerId, version }`.
- Puro y determinista con `rng` inyectable. Tests en `tests/game.test.mjs` (Node `node:test`): serpentina, escaleras, snakes, rebote, 6 extra, victoria, turnos, validaciones.

## network.js (PeerJS)
Topología: el HOST es la autoridad y crea el `Peer` con id `GAME.peerPrefix + CODE`. Los móviles se conectan con `peer.connect(hostId, {reliable:true})`.
```js
export class HostNetwork {   // en index.html
  constructor({ Peer = globalThis.Peer, peerOptions })
  async open()                       // → roomCode (reintenta con otro código si 'unavailable-id')
  broadcast(msg) / send(playerId, msg)
  on('player-connect'|'player-disconnect'|'message'|'error', fn)
  close()
}
export class ClientNetwork { // en mobile.html
  constructor({ Peer, peerOptions })
  async join(roomCode)               // reconexión automática con backoff, mismo clientId (sessionStorage)
  send(msg)
  on('open'|'close'|'message'|'error'|'reconnecting', fn)
  close()
}
export const MSG   // constantes de tipo, congeladas
export function encode/decode/validate(msg)  // validación estricta de esquema; descartar mensajes inválidos
```
Protocolo (JSON, campo `t` + `v:1`):
| Dir | `t` | Payload |
|---|---|---|
| C→H | `hello` | `{clientId, name}` |
| C→H | `pick` | `{characterId}` |
| C→H | `ready` | `{ready:bool}` |
| C→H | `roll` | `{}` |
| C→H | `ping` | `{ts}` |
| H→C | `welcome` | `{playerId, state}` |
| H→C | `state` | `{state}` (snapshot completo tras cada cambio) |
| H→C | `rolled` | `{result}` (resultado de `Game.roll`) |
| H→C | `error` | `{code, message}` |
| H→C | `pong` | `{ts}` |
Seguridad: el host nunca confía en el cliente (valida turno y esquema); límite de tamaño de mensaje (2 KB); rate-limit de `roll` (1/400 ms); nombres saneados (máx 16 chars, sin HTML).

## animations.js (GSAP + Three.js)
```js
export class Animator {
  constructor({ scene3d })                       // usa scene3d.tokens, scene3d.dice, scene3d.camera
  hopToken(token, fromPos, toPos, { height = 0.9, duration = 0.45 })        // parábola con gsap (x,z lineales, y = arco)
  moveAlongPath(token, tiles:number[]) → Promise  // encadena saltos casilla a casilla + squash&stretch
  slideAlongJump(token, from, to, kind) → Promise // escalera: ascenso suave con arco; serpiente: deslizamiento ondulante
  rollDice(value) → Promise                       // lanza el dado 3D (giros aleatorios) y asienta mostrando `value` hacia arriba
  focusCamera(target, {duration}) → Promise
  celebrate(token) → Promise                      // partículas + giro
  setReducedMotion(bool)
}
```
El dado es un `BoxGeometry` con atlas `ASSETS.diceAtlas` (UV por cara según `DICE_ATLAS`). Orientación final del cubo mapea `value` a la cara superior (tabla de quaterniones documentada).

## scene3d.js (render)
```js
export class Scene3D {
  constructor(canvas, { onProgress })
  async init()                  // carga texturas (TextureLoader + anisotropy), construye tablero, luces, sombras
  addToken(playerId, character, tile) / removeToken(playerId) / tokens: Map
  dice                          // Mesh del dado
  highlightTile(n, color) / clearHighlights()
  drawLinks()                   // escaleras (rieles+peldaños) y serpientes (tubo/curva) desde LADDERS/SNAKES con CatmullRom/TubeGeometry
  resize(); start(); stop(); dispose()
  camera, renderer, scene
  on('frame', fn)               // hook por frame (dt)
}
```
- Cámara perspectiva ~45° con OrbitControls limitado (sin pan, polar/azimut acotados, damping).
- Luces: Hemisphere/ambient tenue azul, DirectionalLight cian-blanca con sombras PCFSoft, rim light magenta. Fondo: gradiente/`ASSETS.background`, niebla leve (`FogExp2`) del color `THEME.bg`.
- Tokens: `CylinderGeometry` fino + `Sprite`/plano con `CHARACTERS[i].token` (PNG con alfa) como cara, anillo emisivo de color del personaje, sombra de contacto.
- Etiquetas de número de casilla (CanvasTexture o sprites) en fuente `THEME.fontMono`.

## UI
- `index.html` (HOST): pantalla de lobby (QR + código de sala + lista de jugadores/personajes), luego HUD de partida (turno, último tiro, log de eventos con la etiqueta de la serpiente/escalera), pantalla de victoria. QR con librería `qrcode-generator` CDN o generado a mano; URL de unión: `mobile.html?room=CODE` relativa al sitio.
- `mobile.html` (CONTROLLER): flujo `unirse (nombre) → elegir personaje (grid 2×3 con portrait) → listo → botón gigante "LANZAR DADO" cuando es su turno`, vibración (`navigator.vibrate`) al turno/resultado, estado de conexión.
- `js/main.js` conecta Game + HostNetwork + Scene3D + Animator + UI del host. `js/mobile.js` la UI del control.
- `css/style.css`: tokens como CSS custom properties espejando `THEME`, tipografía Space Grotesk + JetBrains Mono (Google Fonts), canvas 100vw×100dvh, `overflow:hidden`, estilo "dashboard analítico" (paneles de vidrio oscuro, bordes cian 1px, rejilla sutil, números tabulares).

## Estructura de archivos
```
index.html  mobile.html
css/style.css
js/{config,game,network,animations,scene3d,main,mobile}.js
assets/{textures,tokens,brand,ui}/
tests/game.test.mjs   tests/network.test.mjs
docs/{ARCHITECTURE.md,ART_PROMPTS.md,BRAND.md}
.github/workflows/pages.yml
```
