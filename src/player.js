import * as THREE from 'three';
import { CONFIG, massToScale } from './config.js';
import { makeLabel } from './labels.js';
import { makeRoosterMaterials } from './skins.js';
import { makeCharacterSkinMesh } from './bosses.js';

// The gloop blob. Owns its mesh, mass label, steering and jelly wobble.
export class Player {
  constructor(scene, material) {
    this.group = new THREE.Group();
    const geo = new THREE.SphereGeometry(1, 40, 28);
    this.body = new THREE.Mesh(geo, material);
    this.body.castShadow = true;
    this.body.position.y = 1;

    // googly eyes for personality
    const white = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    const black = new THREE.MeshBasicMaterial({ color: 0x111111 });
    this.eyes = new THREE.Group();
    for (const s of [-1, 1]) {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 12), white);
      eye.position.set(s * 0.34, 0.3, -0.85);
      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 8), black);
      pupil.position.set(0, 0, -0.2);
      eye.add(pupil);
      this.eyes.add(eye);
    }
    this.eyes.rotation.y = Math.PI; // googly eyes look back at the camera
    this.body.add(this.eyes);
    this.blobGeo = geo;
    this.rooster = null;  // built lazily by setSkin
    this.isRooster = false;
    this.characterSkins = new Map();
    this.currentCharacterSkin = null;

    this.label = makeLabel('10', { color: '#ffffff', height: 0.9 });
    this.group.add(this.body, this.label);
    scene.add(this.group);

    this.reset();
  }

  reset() {
    this.mass = CONFIG.startMass;
    this.x = 0;
    this.targetX = 0;
    this.d = 0;
    this.y = 0;               // raised by the bonus stairs
    this.scale = massToScale(this.mass);
    this.squash = 0;      // impulse for wobble
    this.time = 0;
    this.group.position.set(0, 0, 0);
    this.label.setText(this.mass);
  }

  setMaterial(mat) { this.body.material = mat; }

  // Swap cosmetics while keeping the existing gameplay scale, radius and wobble.
  setSkin(skin, material) {
    const rooster = !!skin && skin.shape === 'rooster';
    if (rooster) {
      if (!this.rooster) this._buildRooster();
      this._applyRoosterColors(skin);
      this.body.geometry = this.roosterGeo;
      this.body.material = makeRoosterMaterials(skin);
    } else {
      this.body.geometry = this.blobGeo;
      this.body.material = material;
    }
    if (this.currentCharacterSkin) this.currentCharacterSkin.removeFromParent();
    this.currentCharacterSkin = skin?.shape === 'boss' || skin?.shape === 'character'
      ? this._getCharacterSkin(skin.id) : null;
    if (this.currentCharacterSkin) this.body.add(this.currentCharacterSkin);
    this.isRooster = rooster;
    this.body.geometry.setDrawRange(0, this.currentCharacterSkin ? 0 : Infinity);
    this.eyes.visible = !rooster && !this.currentCharacterSkin;
    if (this.rooster) this.rooster.visible = rooster;
  }

  _getCharacterSkin(id) {
    if (this.characterSkins.has(id)) return this.characterSkins.get(id);
    const { group, body } = makeCharacterSkinMesh(id);
    const core = new THREE.Box3().setFromObject(body).getSize(new THREE.Vector3());
    const scale = 2 / Math.max(core.x, core.y);
    const floor = new THREE.Box3().setFromObject(group).min.y;
    group.scale.setScalar(scale);
    group.position.y = -1 - floor * scale;
    group.userData.top = new THREE.Box3().setFromObject(group).max.y + 1;
    this.characterSkins.set(id, group);
    return group;
  }

  _buildRooster() {
    // Egg profile (bottom -> top): widest low, round chest, narrower head. y in -0.72..1.1.
    const Y0 = -0.72, H = 1.82, R0 = 0.9;
    const eggR = (y) => R0 * Math.sin(Math.PI * Math.pow(THREE.MathUtils.clamp((y - Y0) / H, 0, 1), 0.85));
    const prof = [];
    for (let i = 0; i <= 28; i++) { const y = Y0 + H * i / 28; prof.push(new THREE.Vector2(Math.max(eggR(y), 0.001), y)); }
    this.roosterGeo = new THREE.LatheGeometry(prof, 24);
    const std = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.7, metalness: 0 });
    // tintable part materials; _applyRoosterColors recolors them for the golden skin
    const M = this.roosterMats = {
      comb: std(0xff3b5c), beak: std(0xffb300), wing: std(0xeed3a6), leg: std(0xffb300),
      tailA: std(0xff3b5c), tailB: std(0xff8a1f), tailC: std(0x1f7a4a),
    };
    this.roosterDefaults = {};
    for (const k in M) this.roosterDefaults[k] = M[k].color.clone();
    const ink = new THREE.MeshBasicMaterial({ color: 0x1b1420 });
    const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const g = new THREE.Group();
    // Face is built directly on the +Z side (toward the camera).
    // z of the body surface at local x,y, so flat face parts sit just in front of it.
    const surf = (x, y) => Math.sqrt(Math.max(0.05, Math.pow(eggR(y), 2) - x * x)) + 0.03;
    const disc = (r, mat, x, y, dz) => {
      const m = new THREE.Mesh(new THREE.CircleGeometry(r, 18), mat);
      m.position.set(x, y, surf(x, y) + dz); g.add(m); return m;
    };
    for (const s of [-1, 1]) {
      disc(0.27, ink, s * 0.28, 0.5, 0);
      disc(0.22, white, s * 0.28, 0.5, 0.02);
      disc(0.11, ink, s * 0.28 + s * 0.02, 0.47, 0.04);
      disc(0.04, white, s * 0.28 + s * 0.06, 0.52, 0.05);
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.04), ink);
      brow.position.set(s * 0.32, 0.86, surf(s * 0.32, 0.86));
      brow.rotation.z = s * 0.3;   // inner ends low: cocky
      g.add(brow);
    }
    // head parts that bob with the rhythm: comb, beak, wattle
    const head = new THREE.Group();
    const comb = new THREE.Group();
    for (const [y, z, r] of [[1.12, 0.3, 0.27], [1.3, 0.08, 0.32], [1.32, -0.17, 0.32], [1.14, -0.38, 0.26]]) {
      const c = new THREE.Mesh(new THREE.SphereGeometry(r, 12, 10), M.comb);
      c.position.set(0, y, z); c.scale.set(0.6, 1, 1); comb.add(c);
    }
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.23, 0.6, 12), M.beak);
    beak.rotation.x = Math.PI / 2;
    beak.position.set(0, 0.12, surf(0, 0.12) + 0.2);
    const wattle = new THREE.Mesh(new THREE.SphereGeometry(0.2, 10, 8), M.comb);
    wattle.scale.set(0.8, 1.4, 0.7);
    wattle.position.set(0, -0.3, surf(0, -0.3) + 0.04);
    head.add(comb, beak, wattle);
    g.add(head);
    this.roosterHead = head;
    // wings: rounded teardrops tucked at the sides (down and back), flap out on the beat
    this.wingPivots = [];
    for (const s of [-1, 1]) {
      const pv = new THREE.Group();
      pv.position.set(s * 0.7, 0.45, -0.05);
      pv.rotation.x = 0.3;
      const wing = new THREE.Mesh(new THREE.SphereGeometry(0.3, 14, 10), M.wing);
      wing.scale.set(0.3, 1.45, 0.85);
      wing.position.set(s * 0.1, -0.42, 0);
      pv.add(wing);
      pv.userData.side = s;
      g.add(pv);
      this.wingPivots.push(pv);
    }
    // tall arched tail fan rising behind and above the shoulders
    const tail = new THREE.Group();
    tail.position.set(0, 0.2, -0.62);
    tail.rotation.x = -0.15;
    const cols = [M.tailC, M.tailA, M.tailB, M.tailB, M.tailA, M.tailC];
    cols.forEach((mat, i) => {
      const pv = new THREE.Group();
      const k = i - 2.5;
      pv.rotation.z = k * 0.4;
      const f = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), mat);
      f.scale.set(0.6, 2.9, 0.22);
      f.position.y = 0.95 - Math.abs(k) * 0.08;
      pv.add(f); tail.add(pv);
    });
    g.add(tail);
    // thin legs and 3-toe feet, clearly visible under the egg
    for (const s of [-1, 1]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.45, 6), M.leg);
      leg.position.set(s * 0.3, -0.78, 0.15);
      g.add(leg);
      for (const a of [-0.5, 0, 0.5]) {
        const toe = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.34), M.leg);
        toe.position.set(s * 0.3 + Math.sin(a) * 0.15, -0.97, 0.15 + Math.cos(a) * 0.15);
        toe.rotation.y = a;
        g.add(toe);
      }
    }
    this.rooster = g;
    g.visible = false;
    this.body.add(g);
  }

  // Gold tint for the paid skin; otherwise restore the cartoon rooster colors.
  _applyRoosterColors(skin) {
    const M = this.roosterMats;
    const gold = !!skin?.tint;
    for (const k in M) {
      const m = M[k];
      m.color.copy(this.roosterDefaults[k]);
      m.metalness = 0; m.roughness = 0.7; m.emissive.set(0x000000); m.emissiveIntensity = 0;
      if (gold) {
        m.color.set(k === 'tailC' || k === 'tailB' ? (skin.color2 || skin.tint) : skin.tint);
        m.metalness = 0.55; m.roughness = 0.3; m.emissive.set(skin.tint); m.emissiveIntensity = 0.18;
      }
    }
  }

  // Wings flap and the head bobs, ~2 beats/s. Returns beat amount 0..1 for the hop.
  _animateRooster() {
    const w = (this.time * 2) % 1;
    const d = w < 0.5 ? Math.pow(Math.sin(w * 2 * Math.PI), 0.6) : 0;
    for (const pv of this.wingPivots) pv.rotation.z = pv.userData.side * (0.1 + d * 0.55);
    this.roosterHead.position.y = -d * 0.08;
    this.roosterHead.rotation.x = d * 0.12;
    return d;
  }

  setMass(m) {
    const prev = this.mass;
    this.mass = Math.max(0, Math.round(m));
    this.label.setText(this.mass);
    if (this.mass !== prev) this.squash = this.mass > prev ? 1 : -1;
  }

  steer(dxPixels) {
    const lim = CONFIG.trackHalfWidth - 0.4;
    this.targetX = THREE.MathUtils.clamp(this.targetX + dxPixels * CONFIG.steerPerPixel, -lim, lim);
  }

  update(dt) {
    this.time += dt;
    const k = 1 - Math.exp(-CONFIG.steerSmoothing * dt);
    const lastX = this.x;
    this.x += (this.targetX - this.x) * k;
    const vx = (this.x - lastX) / Math.max(dt, 1e-4);

    const target = massToScale(this.mass);
    this.scale += (target - this.scale) * (1 - Math.exp(-6 * dt));

    // jelly wobble
    this.squash *= Math.exp(-5 * dt);
    const wob = Math.sin(this.time * 18) * 0.06 + Math.sin(this.time * 9) * 0.04 + this.squash * Math.sin(this.time * 25) * 0.18;
    const s = this.scale;
    this.body.scale.set(s * (1 + wob), s * (1 - wob), s * (1 + wob * 0.5));
    this.body.position.y = s * (1 - wob);
    if (this.isRooster) {
      const beat = this._animateRooster();
      this.body.position.y += beat * 0.06 * s; // tiny hop on each flap
    }
    this.body.rotation.z = THREE.MathUtils.clamp(-vx * 0.03, -0.35, 0.35);

    this.group.position.set(this.x, this.y, -this.d);
    const coreTop = this.currentCharacterSkin?.userData.top ?? 2;
    this.label.position.set(0, s * Math.max(coreTop, this.isRooster ? 2.9 : 2) + 0.9, 0);
    const ls = 0.9 + s * 0.25;
    this.label.scale.set(ls * 2, ls, 1);
  }

  get radius() { return this.scale; }

  // Core body size (largest of width/height, no accessories) at the settled scale.
  // Blob sphere: diameter 2. Rooster: 1.64 wide x 2.0 tall -> 2.0. Used to size the boss fairly.
  get coreSize() { return this.scale * (this.isRooster ? 2.0 : 2); }
  get position() { return this.group.position; }
}
