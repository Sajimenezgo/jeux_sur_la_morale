# Gradient Ladders — Guía de identidad

**Concepto.** Serpientes y Escaleras como *descenso del gradiente*: las escaleras son buenas prácticas
(validación cruzada, XAI, auditoría de equidad) y las serpientes son errores y sesgos (data leakage,
overfitting, p-hacking, sesgo algorítmico). Cada casilla enlazada trae una tarjeta pedagógica
(`js/link_cards.js`, redactada con Gemini vía `agy` y validada con script).

**Lema.** *Desciende el gradiente. Evita el sesgo.*

**Estética.** "Dashboard analítico en 3D": vacío azul noche, paneles de vidrio oscuro, trazos de neón finos,
rejillas, ejes y sparklines como ornamento, números tabulares en mono.

## Color
| Rol | Token | Hex |
|---|---|---|
| Fondo | `bg` | `#070b16` |
| Panel | `bgPanel` | `#0f1730` |
| Primario / señal | `cyan` | `#22d3ee` |
| Modelo / acento | `magenta` | `#e879f9` |
| Dado / alerta | `amber` | `#fbbf24` |
| Escalera / éxito | `lime` | `#a3e635` |
| Serpiente / error | `red` | `#fb4a6b` |
| Texto | `text` / `textDim` | `#e6edf7` / `#8aa0c8` |
Fuente de verdad: `js/config.js → THEME`. Contraste texto/fondo ≥ 12:1.

## Tipografía
Space Grotesk (títulos, UI) · JetBrains Mono (números, etiquetas, código). Google Fonts.

## Personajes (roles de ciencia de datos)
Data Scientist `Σ` cian · ML Engineer red neuronal magenta · Estadístico/a campana ámbar ·
Data Analyst barras lima · Data Engineer pipeline naranja · AI Ethicist balanza violeta.
Silueta e ícono distintos además del color (accesible para daltonismo).

## Uso del logo
Marca sola (`logo_mark.svg`) ≥ 32 px; lockup horizontal (`logo.svg`) ≥ 160 px de ancho; sobre fondos oscuros.
Área de respeto = alto de un peldaño ×2. No recolorear la curva magenta ni la escalera lima.

## Movimiento
Entradas 0.4–0.6 s `power2.out`; saltos de ficha parabólicos 0.45 s con squash & stretch;
el brillo (glow) es el único efecto permitido. Respetar `prefers-reduced-motion`.
