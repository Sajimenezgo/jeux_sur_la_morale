# Pipeline de arte — recetas exactas (PhotoCraft · VectorCraft · EffectCraft)

Los assets no vienen de un generador texto→imagen sino de **recetas procedurales reproducibles** en las
tres apps de la suite (todas vía MCP). Cada receta lista el comando y los parámetros exactos. Salida de las apps:
`~/Documents/ArtCraft/` → copiada a `assets/`. Fuentes editables en `design/source/`.

Paleta: void `#070b16` · panel `#0f1730` · cian `#22d3ee` · magenta `#e879f9` · ámbar `#fbbf24` · lima `#a3e635` · naranja `#fb923c` · violeta `#8b5cf6`.

## 1. Bloques del tablero — PhotoCraft (1024², `assets/textures/`)
| Archivo | Receta |
|---|---|
| `board_tile_albedo.png` | `doc_new 1024×1024 #0f1730` → `filter.render.clouds {seed:7, foreground:#1a2a55, background:#0b1328}` → `filter.noise.addNoise {amount:4, gaussian, mono, seed:3}` → `shape.create roundedRect [24,24,976,976] r40 stroke #22d3ee 6px/90%` + `[64,64,896,896] r24 stroke 2px/35%` → marcas de esquina (cian arriba-izq, magenta abajo-der) + mini-gráfico (ejes cian, línea lima) en la esquina inferior izquierda. **El centro queda libre** para el número de casilla (se dibuja en 3D). |
| `board_tile_alt_albedo.png` | `tools/make_normal.py`: mezcla 22 % hacia `#1a2a55` y +12 % de brillo (ajedrezado sutil). |
| `board_tile_normal.png` | `tools/make_normal.py`: altura = luminancia con blur gaussiano 1.6, Sobel ×5, convención OpenGL (+Y). Los bordes cian quedan como cresta. |
| `board_base_albedo.png` | `clouds {seed:11, #101b3a/#050912}` + `addNoise 3` + rejilla 10×10 (22 subpaths, trazo cian 2px/22 %, margen 64) + marco `roundedRect [20,20,984,984] r36 trazo 8px/85 %`. |

## 2. Dado desplegado — PhotoCraft (`assets/textures/dice_atlas.png`, 1536×1024)
`doc_new 1536×1024 #0f1730` → `clouds {seed:21, #1d2f60/#0c1530}` → 6 marcos `roundedRect` 476² r56 (trazo cian 8px/90 %) en celdas de 512 → pips `ellipse` Ø92 ámbar `#fbbf24`; la cara 1 lleva un pip magenta Ø140 (cara "de marca").
Disposición **3 col × 2 filas**, fila 0 arriba: `[1,2,3]` / `[4,5,6]` (ver `DICE_ATLAS` en `js/config.js`).

## 3. Fichas de personaje — VectorCraft (`assets/tokens/`, 488² RGBA)
Artboard 1536×1024 (celdas 512). Cada ficha: halo `ellipse` Ø488 color/16 % · disco `#0b1328` Ø432 con trazo de 12 px del color · anillo interior Ø372 trazo 3 px/45 % · ícono vectorial:
| id | color | ícono |
|---|---|---|
| `scientist` | `#22d3ee` | Σ (polilínea, trazo 22 round) |
| `mlengineer` | `#e879f9` | red neuronal 2-3-1 (9 aristas, 6 nodos) |
| `statistician` | `#fbbf24` | campana de Gauss + media punteada |
| `analyst` | `#a3e635` | 3 barras redondeadas + eje |
| `engineer` | `#fb923c` | nodo de pipeline/DAG con 4 conexiones |
| `auditor` | `#8b5cf6` | balanza de la justicia |
Export: artboard completo PNG@1x + SVG → `tools/split_tokens.py` recorta `token_<id>.png` (alfa) y `portrait_<id>.svg` (viewBox por celda).

## 4. Identidad — VectorCraft + EffectCraft (`assets/brand/`)
- `logo_mark.svg/png`: rounded-square 240² trazo cian; **escalera** lima (rieles) con peldaños cian; **curva de descenso del gradiente** magenta (`M68 1190 C130 1170 150 1340 252 1336`) que termina en el mínimo (punto blanco). Es a la vez serpiente y descenso.
- `logo.svg/png`: marca + "GRADIENT" (blanco) / "LADDERS" (cian) + lema en mono. Texto exportado **como contornos**. ⚠️ Space Grotesk no está instalada en esta máquina: se usó el fallback *Source Sans 3*. Pendiente: instalar Space Grotesk y re-exportar.
- `bg_grid.png` (PhotoCraft, 1920×1080): `clouds {seed:4, #0e1a3a/#070b16}` + rejilla cada 120 px (trazo cian 1.5px/10 %) + viñeta radial (`opacityStops [0,0],[.55,0],[1,.92]`).
- `brand_poster.png` + `design/source/brand_reveal.ecproj` (EffectCraft, 1920×1080, 30 fps, 3 s): fondo + logo con `opacity 0→100 (0–1.2 s)`, `scale 82→100 % (0–1.6 s)`, efecto **Glow**. Sirve de pantalla de carga/OG image.

## 5. Prompts de texto→imagen (opcional, para iterar con ArtCraft generativo)
Si se desea sustituir las texturas procedurales por arte generado, estos prompts mantienen la identidad:
1. *"Seamless top-down tile texture, dark navy circuit-board panel, subtle cloudy noise, thin cyan neon border with rounded corners, tiny data-plot ticks in corners, empty center, flat orthographic, 1024×1024, no text"*
2. *"Unfolded dice net atlas, 3×2 grid of square faces, dark navy glass faces with cyan neon rounded borders, amber pips (face 1 single large magenta pip), flat, 1536×1024, no text"*
3. *"Circular game token, dark navy disc with neon <color> ring and soft outer glow, minimal line icon of <role icon> centered, transparent background, 512×512"*
