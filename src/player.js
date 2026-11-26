import * as THREE from 'three';
import { CONFIG, massToScale } from './config.js';
import { makeLabel } from './labels.js';
import { makeDrumMaterials } from './skins.js';

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
    this.drum = null;     // built lazily by setSkin
    this.isDrum = false;

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

  // Swap between the blob sphere and the wooden drum mascot. `material` is used for blobs.
  setSkin(skin, material) {
    const drum = !!skin && skin.shape === 'drum';
    if (drum) {
      if (!this.drum) this._buildDrum();
      this.body.geometry = this.drumGeo;
      this.body.material = makeDrumMaterials(skin);
    } else {
      this.body.geometry = this.blobGeo;
      this.body.material = material;
    }
    this.isDrum = drum;
    this.eyes.visible = !drum;
    if (this.drum) this.drum.visible = drum;
  }

  _buildDrum() {
    this.drumGeo = new THREE.CylinderGeometry(0.95, 0.95, 1.5, 20);
    const ink = new THREE.MeshBasicMaterial({ color: 0x1b1420 });
    const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const cream = new THREE.MeshStandardMaterial({ color: 0xfff4e0, roughness: 0.8 });
    const g = new THREE.Group();
    // Face is built on the -Z side, then the whole face group is turned 180° so it
    // looks back at the camera (the camera follows from behind; a face on the far
    // side would never be seen).
    const face = new THREE.Group();
    face.rotation.y = Math.PI;
    g.add(face);
    const disc = (r, mat, x, y, z) => {
      const m = new THREE.Mesh(new THREE.CircleGeometry(r, 16), mat);
      m.position.set(x, y, z); m.rotation.y = Math.PI; face.add(m); return m;
    };
    for (const s of [-1, 1]) {
      disc(0.27, ink, s * 0.32, 0.18, -0.93);
      disc(0.22, white, s * 0.32, 0.18, -0.95);
      disc(0.11, ink, s * 0.32 - s * 0.02, 0.16, -0.97);
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.09, 0.04), ink);
      brow.position.set(s * 0.34, 0.5, -0.9);
      brow.rotation.z = s * 0.4;
      face.add(brow);
    }
    const mouth = new THREE.Mesh(new THREE.CircleGeometry(0.2, 14, Math.PI, Math.PI), ink);
    mouth.position.set(0, -0.12, -0.93); mouth.rotation.y = Math.PI; face.add(mouth);
    // drumsticks
    this.sticks = [];
    for (const s of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.position.set(s * 0.8, 0.75, 0.05);
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 8), cream);
      stick.position.y = 0.4;
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 10, 8), ink);
      tip.position.y = 0.8;
      pivot.add(stick, tip);
      g.add(pivot);
      this.sticks.push({ pivot, s });
    }
    this.drum = g;
    g.visible = false;
    this.body.add(g);
  }

  _animateDrum() {
    const t = this.time;
    this.sticks.forEach((st, i) => {
      const w = (t * 2 + i * 0.5) % 1;                  // 2 hits/s per stick, 4 taps/s total
      const d = w < 0.5 ? Math.pow(Math.sin(w * 2 * Math.PI), 0.6) : 0;
      st.pivot.rotation.z = st.s * (0.45 + d * 0.95);
    });
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
    if (this.isDrum) {
      this._animateDrum();
      this.body.position.y += Math.abs(Math.sin(this.time * 4 * Math.PI)) * 0.05 * s; // hop on each tap
    }
    this.body.rotation.z = THREE.MathUtils.clamp(-vx * 0.03, -0.35, 0.35);

    this.group.position.set(this.x, this.y, -this.d);
    this.label.position.set(0, s * 2 + 0.9, 0);
    const ls = 0.9 + s * 0.25;
    this.label.scale.set(ls * 2, ls, 1);
  }

  get radius() { return this.scale; }

  // Core body size (largest of width/height, no accessories) at the settled scale.
  // Blob sphere: diameter 2. Drum: 1.9 wide x 1.5 tall -> 1.9. Used to size the boss fairly.
  get coreSize() { return this.scale * (this.isDrum ? 1.9 : 2); }
  get position() { return this.group.position; }
}
