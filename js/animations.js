// animations.js — coreografía GSAP sobre la escena Three.js.
import * as THREE from 'three';
import gsap from 'gsap';
import { THEME } from './config.js';
import { tileToPosition } from './game.js';
import { DICE_FACE_NORMAL } from './scene3d.js';

const UP = new THREE.Vector3(0, 1, 0);
const TAU = Math.PI * 2;

/** Orquesta animaciones de fichas, dado y cámara. Todos los métodos async devuelven Promise. */
export class Animator {
  /** @param {{scene3d: import('./scene3d.js').Scene3D}} opts */
  constructor({ scene3d }) {
    this.s3 = scene3d;
    this.reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._fx = new Set();
  }

  /** @param {boolean} v */
  setReducedMotion(v) { this.reduced = !!v; }

  _toVec(p) { return p instanceof THREE.Vector3 ? p.clone() : new THREE.Vector3(p.x, p.y ?? 0, p.z); }

  /**
   * Salto parabólico de `fromPos` a `toPos` con squash & stretch.
   * @returns {Promise<void>} resuelve al aterrizar (el rebote de aterrizaje continúa solo).
   */
  hopToken(token, fromPos, toPos, { height = 0.9, duration = 0.45 } = {}) {
    const a = this._toVec(fromPos), b = this._toVec(toPos);
    gsap.killTweensOf(token.scale);
    if (this.reduced) {
      return new Promise((res) => {
        gsap.to(token.position, { x: b.x, y: b.y, z: b.z, duration: 0.12, ease: 'none', onComplete: res });
      });
    }
    return new Promise((resolve) => {
      const k = { t: 0 };
      const tl = gsap.timeline({ onComplete: resolve });
      tl.to(token.scale, { x: 1.14, y: 0.78, z: 1.14, duration: 0.07, ease: 'power1.out' }); // anticipación
      tl.to(token.scale, { x: 0.88, y: 1.2, z: 0.88, duration: 0.09, ease: 'power1.out' }, '>');
      tl.to(k, {
        t: 1, duration, ease: 'none',
        onUpdate: () => {
          const t = k.t;
          token.position.set(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t + 4 * height * t * (1 - t), a.z + (b.z - a.z) * t);
        },
      }, '<');
      tl.add(() => {
        token.position.copy(b);
        gsap.fromTo(token.scale, { x: 1.2, y: 0.7, z: 1.2 }, { x: 1, y: 1, z: 1, duration: 0.35, ease: 'elastic.out(1,0.45)' });
      });
    });
  }

  /** Salta casilla a casilla por `tiles` (casillas pisadas, sin la de origen). */
  async moveAlongPath(token, tiles) {
    let cur = token.userData.tile ?? 0;
    for (const n of tiles) {
      if (n === cur) continue;
      await this.hopToken(token, token.position.clone(), this.s3.tokenPosition(token, n), { height: 0.8, duration: 0.34 });
      cur = n;
      token.userData.tile = n;
    }
  }

  /** Escalera (ascenso suave) o serpiente (deslizamiento ondulante) de `from` a `to`. */
  slideAlongJump(token, from, to, kind) {
    const curve = this.s3.getLinkCurve(from, to);
    const start = this.s3.tokenPosition(token, from), end = this.s3.tokenPosition(token, to);
    const off = token.userData.offset;
    const ladder = kind === 'ladder';
    const dur = this.reduced ? 0.25 : ladder ? 1.3 : 1.7;
    gsap.killTweensOf(token.scale);
    return new Promise((resolve) => {
      const k = { t: 0 };
      const finish = () => {
        token.position.copy(end);
        token.rotation.set(0, 0, 0);
        token.scale.set(1, 1, 1);
        token.userData.tile = to;
        resolve();
      };
      gsap.to(k, {
        t: 1, duration: dur, ease: this.reduced ? 'none' : ladder ? 'power2.inOut' : 'power2.in',
        onUpdate: () => {
          if (curve) {
            const p = curve.getPointAt(Math.min(1, k.t));
            token.position.set(p.x + off.x * (1 - k.t), p.y + 0.0, p.z + off.z * (1 - k.t));
          } else {
            token.position.lerpVectors(start, end, k.t);
          }
          if (this.reduced) return;
          if (ladder) {
            token.scale.set(1, 1 + 0.08 * Math.sin(k.t * Math.PI), 1);
          } else {
            token.rotation.z = Math.sin(k.t * Math.PI * 10) * 0.35 * (1 - k.t * 0.4);
            token.scale.set(0.85 + 0.1 * Math.sin(k.t * 30), 1.15, 0.85);
          }
        },
        onComplete: () => {
          finish();
          if (!this.reduced) gsap.fromTo(token.scale, { x: 1.25, y: 0.7, z: 1.25 }, { x: 1, y: 1, z: 1, duration: 0.4, ease: 'elastic.out(1,0.5)' });
        },
      });
    });
  }

  /**
   * Lanza el dado 3D y lo asienta mostrando `value` arriba. Resuelve tras una breve pausa.
   * El giro final es spin(eje, ángulo→0) · qFinal: converge exactamente a la orientación objetivo.
   */
  rollDice(value) {
    const dice = this.s3.dice, rest = this.s3.diceRest;
    const qFinal = new THREE.Quaternion().setFromUnitVectors(DICE_FACE_NORMAL[value], UP)
      .premultiply(new THREE.Quaternion().setFromAxisAngle(UP, Math.random() * TAU));
    gsap.killTweensOf(dice.position); gsap.killTweensOf(dice.scale);
    dice.userData.value = value;
    if (this.reduced) {
      dice.position.copy(rest);
      dice.quaternion.copy(qFinal);
      return new Promise((res) => {
        gsap.fromTo(dice.scale, { x: 0.6, y: 0.6, z: 0.6 }, { x: 1, y: 1, z: 1, duration: 0.2, onComplete: () => setTimeout(res, 300) });
      });
    }
    const axis = new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.6 + 0.3, Math.random() - 0.5).normalize();
    const spins = 3 + Math.random() * 2; // vueltas totales
    const from = new THREE.Vector3(rest.x - 2.2, 4.8, rest.z + 3.2);
    const k = { s: 0, bounce: 0 };
    const qSpin = new THREE.Quaternion();
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onComplete: () => { dice.position.copy(rest); dice.quaternion.copy(qFinal); setTimeout(resolve, 380); } });
      // Giro continuo con desaceleración
      tl.to(k, {
        s: 1, duration: 1.45, ease: 'power3.out',
        onUpdate: () => {
          qSpin.setFromAxisAngle(axis, (1 - k.s) * spins * TAU);
          dice.quaternion.copy(qSpin).multiply(qFinal);
          dice.position.x = from.x + (rest.x - from.x) * Math.min(1, k.s * 1.15);
          dice.position.z = from.z + (rest.z - from.z) * Math.min(1, k.s * 1.15);
        },
      }, 0);
      // Altura: caída + rebotes decrecientes
      dice.position.y = from.y;
      const y0 = rest.y;
      const ty = gsap.timeline();
      ty.to(dice.position, { y: y0, duration: 0.42, ease: 'power2.in' })
        .to(dice.position, { y: y0 + 1.35, duration: 0.24, ease: 'power2.out' })
        .to(dice.position, { y: y0, duration: 0.24, ease: 'power2.in' })
        .to(dice.position, { y: y0 + 0.5, duration: 0.15, ease: 'power2.out' })
        .to(dice.position, { y: y0, duration: 0.15, ease: 'power2.in' })
        .to(dice.position, { y: y0 + 0.16, duration: 0.09, ease: 'power2.out' })
        .to(dice.position, { y: y0, duration: 0.09, ease: 'power2.in' });
      tl.add(ty, 0);
      // Destello al asentar
      tl.fromTo(dice.scale, { x: 1.18, y: 0.82, z: 1.18 }, { x: 1, y: 1, z: 1, duration: 0.3, ease: 'elastic.out(1,0.5)' }, '>-0.05');
    });
  }

  /**
   * Mueve la cámara para mirar `target` ({x,y,z} o número de casilla), conservando el offset.
   * @param {number|{x:number,y?:number,z:number}} target
   */
  focusCamera(target, { duration = 0.9 } = {}) {
    const { camera, controls } = this.s3;
    let t = typeof target === 'number' ? tileToPosition(target) : target;
    t = new THREE.Vector3(t.x, 0, t.z);
    const delta = t.clone().sub(controls.target);
    const camTo = camera.position.clone().add(delta);
    if (this.reduced) {
      controls.target.copy(t); camera.position.copy(camTo); controls.update();
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      const from = { t: 0 }, c0 = controls.target.clone(), p0 = camera.position.clone();
      gsap.to(from, {
        t: 1, duration, ease: 'power2.inOut', onComplete: resolve,
        onUpdate: () => {
          controls.target.lerpVectors(c0, t, from.t);
          camera.position.lerpVectors(p0, camTo, from.t);
        },
      });
    });
  }

  /** Celebración: giro + salto + ráfaga de partículas. */
  celebrate(token) {
    const scene = this.s3.scene;
    const base = token.position.clone();
    if (this.reduced) {
      return new Promise((res) => gsap.fromTo(token.scale, { x: 1.4, y: 1.4, z: 1.4 }, { x: 1, y: 1, z: 1, duration: 0.5, onComplete: res }));
    }
    const N = 160;
    const pos = new Float32Array(N * 3), vel = [], col = new Float32Array(N * 3);
    const palette = [THEME.cyan, THEME.magenta, THEME.amber, THEME.lime].map((c) => new THREE.Color(c));
    for (let i = 0; i < N; i++) {
      pos.set([base.x, base.y + 0.6, base.z], i * 3);
      const a = Math.random() * TAU, u = Math.random(), sp = 1.5 + Math.random() * 3.5;
      vel.push(new THREE.Vector3(Math.cos(a) * sp * (0.3 + u), 2.5 + Math.random() * 4, Math.sin(a) * sp * (0.3 + u)));
      const c = palette[i % palette.length];
      col.set([c.r, c.g, c.b], i * 3);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    scene.add(pts);
    return new Promise((resolve) => {
      const k = { t: 0 };
      let last = 0;
      const tl = gsap.timeline({
        onComplete: () => {
          scene.remove(pts); geo.dispose(); mat.dispose();
          token.rotation.set(0, 0, 0); token.position.copy(base);
          resolve();
        },
      });
      tl.to(k, {
        t: 2.4, duration: 2.4, ease: 'none',
        onUpdate: () => {
          const dt = k.t - last; last = k.t;
          for (let i = 0; i < N; i++) {
            vel[i].y -= 9 * dt;
            pos[i * 3] += vel[i].x * dt; pos[i * 3 + 1] = Math.max(0.3, pos[i * 3 + 1] + vel[i].y * dt); pos[i * 3 + 2] += vel[i].z * dt;
          }
          geo.attributes.position.needsUpdate = true;
          mat.opacity = Math.max(0, 1 - Math.max(0, k.t - 1.4) / 1.0);
        },
      }, 0);
      tl.to(token.rotation, { y: TAU * 3, duration: 1.8, ease: 'power2.inOut' }, 0);
      tl.to(token.position, { y: base.y + 1.2, duration: 0.5, ease: 'power2.out', yoyo: true, repeat: 3 }, 0);
    });
  }
}
