import * as THREE from 'three';

const POOL = 120;
const SPACING = 0.9;
const TRAIL_LIFE = 1.6;
const SPLAT_LIFE = 2.0;
const TRAIL_OPACITY = 0.32;

export class Trail {
  constructor(scene) {
    this.scene = scene;
    this.geo = new THREE.CircleGeometry(1, 12);
    this.baseColor = new THREE.Color('#44cc66');
    this.color = this.baseColor.clone().multiplyScalar(0.75);
    this.items = [];
    this.next = 0;
    this.lastD = null;
    this._c = new THREE.Color();
    for (let i = 0; i < POOL; i++) {
      const mat = new THREE.MeshBasicMaterial({ color: this.color, transparent: true, opacity: 0, depthWrite: false });
      const mesh = new THREE.Mesh(this.geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.visible = false;
      mesh.renderOrder = 1;
      scene.add(mesh);
      this.items.push({ mesh, age: 0, life: 1, peak: 0, active: false });
    }
  }

  setColor(hex) {
    this.baseColor.set(hex);
    this.color.copy(this.baseColor).multiplyScalar(0.75);
  }

  _spawn(x, z, sx, sz, rot, color, life, peak) {
    const it = this.items[this.next];
    this.next = (this.next + 1) % POOL;
    const m = it.mesh;
    m.position.set(x, 0.02, z);
    // rotation order XYZ: x lays flat, z spins the ellipse around ground normal
    m.rotation.z = rot;
    m.scale.set(sx, sz, 1);
    m.material.color.copy(color);
    m.material.opacity = peak;
    m.visible = true;
    it.age = 0; it.life = life; it.peak = peak; it.active = true;
  }

  update(dt, player, running) {
    if (running && player) {
      const d = player.d;
      if (this.lastD === null || d < this.lastD - 5) this.lastD = d;
      let guard = 4;
      while (d - this.lastD >= SPACING && guard-- > 0) {
        this.lastD += SPACING;
        const s = player.scale || 1;
        const r = Math.random;
        const w = s * (0.5 + r() * 0.2);
        this._spawn(player.x + (r() - 0.5) * 0.15 * s, -this.lastD, w, w * (0.55 + r() * 0.3), (r() - 0.5) * 0.6, this.color, TRAIL_LIFE, TRAIL_OPACITY);
      }
      if (guard < 0) this.lastD = d;
    } else {
      this.lastD = null;
    }
    for (let i = 0; i < POOL; i++) {
      const it = this.items[i];
      if (!it.active) continue;
      it.age += dt;
      if (it.age >= it.life) {
        it.active = false; it.mesh.visible = false; continue;
      }
      it.mesh.material.opacity = it.peak * (1 - it.age / it.life);
    }
  }

  splat(position, color, size = 1) {
    const c = this._c.set(color === undefined ? this.color : color);
    const n = 5 + ((Math.random() * 4) | 0);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const dist = (0.2 + Math.random() * 0.9) * size;
      const w = (0.1 + Math.random() * 0.22) * size;
      this._spawn(position.x + Math.cos(a) * dist, position.z + Math.sin(a) * dist,
        w, w * (0.6 + Math.random() * 0.4), Math.random() * Math.PI, c, SPLAT_LIFE, 0.6);
    }
  }

  clear() {
    for (const it of this.items) { it.active = false; it.mesh.visible = false; }
    this.lastD = null;
  }
}
