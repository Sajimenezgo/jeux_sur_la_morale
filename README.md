# Gradient Ladders

Serpientes y escaleras en 3D sobre ciencia de datos y ética de IA. Una pantalla (host) muestra el tablero y los celulares funcionan como mandos vía WebRTC (PeerJS). Sitio 100% estático.

## Probar en local

```bash
python3 -m http.server 8080
```

- Pantalla: <http://localhost:8080/index.html> (QR + código de sala)
- Mando: <http://localhost:8080/mobile.html?room=ABCD> (desde otro dispositivo usa la IP de tu equipo; en localhost no-HTTPS algunos móviles limitan APIs como vibración/wake lock)
- Demo sin celulares: <http://localhost:8080/index.html?demo=1> (3 bots, juega solo, sin red)

## Cómo se juega

1. El host abre `index.html`; los jugadores escanean el QR o abren `mobile.html` e ingresan el código.
2. Cada jugador elige rol, pulsa "Estoy listo"; el host inicia (o arranca solo a los 4 s).
3. En tu turno pulsa **LANZAR DADO**. Escaleras = buenas prácticas, serpientes = sesgos y errores. Meta exacta en la casilla 100 (rebota si te pasas); un 6 repite turno (máx. 2 seguidos).

## Estructura

`index.html`/`mobile.html`, `css/style.css`, `js/` (config, game, network, scene3d, animations, main, mobile), `assets/`, `docs/ARCHITECTURE.md`. Dependencias por CDN con versión fija: three 0.160.0, gsap 3.12.5, peerjs 1.5.4, qrcode-generator 1.4.4.

## Despliegue

`.github/workflows/pages.yml` publica en GitHub Pages al hacer push a `main` (Settings → Pages → Source: GitHub Actions). Todas las rutas son relativas.
