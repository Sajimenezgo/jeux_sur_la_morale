# Conectar móviles en 4G/5G: servidor TURN

WebRTC conecta móvil y pantalla **directamente**. En la misma red Wi-Fi basta con STUN. Un móvil con datos
móviles (4G/5G) suele estar tras un NAT simétrico y la conexión directa falla: la app muestra
*"No se pudo conectar: Tiempo de conexión agotado"*. La solución es un relevo **TURN**.

> No uses los TURN "públicos gratuitos" que circulan en tutoriales: `openrelay.metered.ca` ahora resuelve a
> `192.0.2.1` (sumidero) y `*.turn.peerjs.com` ya no resuelve (comprobado el 2026-11-06).

## Opción A — Metered (plan gratuito, ~20 GB/mes)
1. Crea cuenta en metered.ca → *TURN Server* → crea credenciales (usuario/clave estáticos).
2. Pon en `config/ice.json`:
```json
[
  { "urls": ["turn:global.relay.metered.ca:80", "turn:global.relay.metered.ca:443",
             "turns:global.relay.metered.ca:443?transport=tcp"],
    "username": "TU_USUARIO", "credential": "TU_CLAVE" }
]
```
## Opción B — Cloudflare Realtime TURN (1 TB/mes gratis)
Crea una *TURN key* en el dashboard y usa `turn.cloudflare.com:3478` / `:443` con las credenciales generadas.
Las credenciales de larga duración funcionan en un `ice.json` estático; las efímeras requieren un Worker.

## Opción C — coturn propio
Un VPS pequeño con coturn (UDP 3478 + TLS 443) y `static-auth-secret`.

## Seguridad y coste
`config/ice.json` se publica con el sitio: **cualquiera puede ver esas credenciales** y gastar tu cuota.
Es aceptable para un juego de clase con plan gratuito (rota la clave si se abusa). Para evitarlo, genera
credenciales efímeras desde un Worker y cámbialas por un `fetch` en `js/ice.js`.

## Prueba rápida
Sin TURN, comprueba que funciona con el móvil en el **mismo Wi-Fi** que la pantalla. Con TURN configurado,
desactiva el Wi-Fi del móvil y prueba con datos móviles.
