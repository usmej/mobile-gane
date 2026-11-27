import * as THREE from 'three';

const MAX_PARTICLES = 250;
const PARTICLE_LIFE = 0.7;
const MAX_TEXTS = 3;
const TEXT_LIFE = 0.9;
const TEXT_RISE_PX = 60;
const SHAKE_TIME = 0.3;
const GRAVITY = 14;

export class FX {
  constructor(scene, camera, overlayEl) {
    this.scene = scene;
    this.camera = camera;
    this.overlayEl = overlayEl;
    this.shakeOffset = new THREE.Vector3();

    this._geo = new THREE.IcosahedronGeometry(0.12, 0);
    this._mats = new Map();
    this._active = [];
    this._free = [];
    this._texts = [];
    this._shakeIntensity = 0;
    this._shakeTime = 0;
    this._tmp = new THREE.Vector3();
  }

  _material(color) {
    let m = this._mats.get(color);
    if (!m) {
      m = new THREE.MeshBasicMaterial({ color: new THREE.Color(color) });
      this._mats.set(color, m);
    }
    return m;
  }

  _acquire() {
    if (this._free.length) return this._free.pop();
    if (this._active.length + this._free.length >= MAX_PARTICLES && this._active.length >= MAX_PARTICLES) {
      // Recycle the oldest live particle.
      return this._active.shift();
    }
    const mesh = new THREE.Mesh(this._geo, this._mats.values().next().value || new THREE.MeshBasicMaterial());
    mesh.frustumCulled = false;
    return { mesh, vel: new THREE.Vector3(), life: 0, base: 1, spin: new THREE.Vector3() };
  }

  burst(position, color = '#ffffff', count = 16) {
    const mat = this._material(color);
    for (let i = 0; i < count; i++) {
      const p = this._acquire();
      p.mesh.material = mat;
      p.mesh.position.copy(position);
      p.base = 0.6 + Math.random() * 0.9;
      p.mesh.scale.setScalar(p.base);
      p.mesh.rotation.set(Math.random() * 6, Math.random() * 6, Math.random() * 6);
      const a = Math.random() * Math.PI * 2;
      const s = 2 + Math.random() * 4;
      p.vel.set(Math.cos(a) * s, 3 + Math.random() * 4, Math.sin(a) * s);
      p.spin.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5);
      p.life = PARTICLE_LIFE * (0.8 + Math.random() * 0.4);
      p.max = p.life;
      p.mesh.visible = true;
      if (!p.mesh.parent) this.scene.add(p.mesh);
      this._active.push(p);
    }
  }

  popText(text, position, color = '#fff', size = 1) {
    if (!this.overlayEl) return;
    while (this._texts.length >= MAX_TEXTS) this._removeText(this._texts.shift());

    const el = document.createElement('div');
    el.className = 'pop-text';
    const px = 28 * size;
    if (typeof text === 'string' && text.startsWith('÷')) {
      const h = px * 0.8;
      const NS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(NS, 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('width', h);
      svg.setAttribute('height', h);
      svg.style.cssText = 'display:inline-block;vertical-align:middle;margin-right:0.12em;overflow:visible';
      const add = (tag, attrs) => {
        const n = document.createElementNS(NS, tag);
        for (const k in attrs) n.setAttribute(k, attrs[k]);
        n.setAttribute('fill', '#FFF4E0');
        n.setAttribute('stroke', '#1B1420');
        n.setAttribute('stroke-width', '2');
        n.setAttribute('stroke-linejoin', 'round');
        svg.appendChild(n);
      };
      add('rect', { x: 3, y: 9.6, width: 18, height: 4.8, rx: 1 });
      add('circle', { cx: 12, cy: 3.6, r: 3.6 });
      add('circle', { cx: 12, cy: 20.4, r: 3.6 });
      el.appendChild(svg);
      el.appendChild(document.createTextNode(text.slice(1)));
    } else {
      el.textContent = text;
    }
    const s = el.style;
    s.position = 'absolute';
    s.left = '0';
    s.top = '0';
    s.pointerEvents = 'none';
    s.whiteSpace = 'nowrap';
    s.font = `400 ${px}px 'Bungee', 'Arial Black', sans-serif`;
    s.color = color;
    s.webkitTextStroke = `${Math.max(4, px * 0.16)}px #1B1420`;
    s.paintOrder = 'stroke fill';
    s.textShadow = '0 3px 0 #1B1420';
    s.willChange = 'transform, opacity';
    s.opacity = '0';
    this.overlayEl.appendChild(el);

    const t = {
      el,
      anchor: typeof position === 'function' ? position : position.clone(),
      age: 0,
      rot: -3, // fixed subtle tilt
      x: -9999,
      y: -9999,
      visible: false,
    };
    this._texts.push(t);
    this._placeText(t);
  }

  shake(intensity = 0.3) {
    if (intensity >= this._shakeIntensity * (this._shakeTime / SHAKE_TIME)) {
      this._shakeIntensity = intensity;
    }
    this._shakeTime = SHAKE_TIME;
  }

  _removeText(t) {
    if (t.el.parentNode) t.el.parentNode.removeChild(t.el);
  }

  _placeText(t) {
    const w = this.overlayEl.clientWidth;
    const h = this.overlayEl.clientHeight;
    if (typeof t.anchor === 'function') t.anchor(this._tmp);
    else this._tmp.copy(t.anchor);
    const v = this._tmp.project(this.camera);
    t.visible = v.z < 1 && v.z > -1;
    t.x = (v.x * 0.5 + 0.5) * w;
    t.y = (-v.y * 0.5 + 0.5) * h;

    const k = Math.min(t.age / TEXT_LIFE, 1);
    const rise = TEXT_RISE_PX * (1 - Math.pow(1 - k, 2));
    let scale;
    // single stamp-in: 1.4 -> 1 with ease-out, no overshoot
    if (k < 0.2) {
      const u = k / 0.2;
      scale = 1.4 - 0.4 * (1 - Math.pow(1 - u, 3));
    } else {
      scale = 1;
    }
    const opacity = k < 0.6 ? 1 : Math.max(0, 1 - (k - 0.6) / 0.4);
    const s = t.el.style;
    s.transform = `translate(${t.x.toFixed(1)}px, ${(t.y - rise).toFixed(1)}px) translate(-50%, -50%) rotate(${t.rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
    s.opacity = t.visible ? String(opacity) : '0';
  }

  update(dt) {
    // Particles
    for (let i = this._active.length - 1; i >= 0; i--) {
      const p = this._active[i];
      p.life -= dt;
      if (p.life <= 0) {
        p.mesh.visible = false;
        if (p.mesh.parent) p.mesh.parent.remove(p.mesh);
        this._active.splice(i, 1);
        this._free.push(p);
        continue;
      }
      p.vel.y -= GRAVITY * dt;
      p.mesh.position.addScaledVector(p.vel, dt);
      p.mesh.rotation.x += p.spin.x * dt;
      p.mesh.rotation.y += p.spin.y * dt;
      p.mesh.scale.setScalar(Math.max(0.001, p.base * (p.life / p.max)));
    }

    // Texts
    if (this._texts.length) {
      for (let i = this._texts.length - 1; i >= 0; i--) {
        const t = this._texts[i];
        t.age += dt;
        if (t.age >= TEXT_LIFE) {
          this._removeText(t);
          this._texts.splice(i, 1);
        } else {
          this._placeText(t);
        }
      }
    }

    // Shake
    if (this._shakeTime > 0) {
      this._shakeTime = Math.max(0, this._shakeTime - dt);
      const k = this._shakeTime / SHAKE_TIME;
      const m = this._shakeIntensity * k;
      this.shakeOffset.set(
        (Math.random() * 2 - 1) * m,
        (Math.random() * 2 - 1) * m,
        (Math.random() * 2 - 1) * m * 0.5
      );
      if (this._shakeTime === 0) {
        this._shakeIntensity = 0;
        this.shakeOffset.set(0, 0, 0);
      }
    } else if (this.shakeOffset.lengthSq() > 0) {
      this.shakeOffset.set(0, 0, 0);
    }
  }

  clear() {
    for (const p of this._active) {
      p.mesh.visible = false;
      if (p.mesh.parent) p.mesh.parent.remove(p.mesh);
      this._free.push(p);
    }
    this._active.length = 0;
    for (const t of this._texts) this._removeText(t);
    this._texts.length = 0;
    this._shakeIntensity = 0;
    this._shakeTime = 0;
    this.shakeOffset.set(0, 0, 0);
  }
}
