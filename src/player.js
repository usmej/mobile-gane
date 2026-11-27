import * as THREE from 'three';
import { CONFIG, massToScale } from './config.js';
import { makeLabel } from './labels.js';
import { makeLogMaterials } from './skins.js';

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
    this.log = null;      // built lazily by setSkin
    this.isLog = false;

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

  // Swap between the blob sphere and the living-log hero. `material` is used for blobs.
  setSkin(skin, material) {
    const log = !!skin && skin.shape === 'log';
    if (log) {
      if (!this.log) this._buildLog();
      this.body.geometry = this.logGeo;
      this.body.material = makeLogMaterials(skin);
    } else {
      this.body.geometry = this.blobGeo;
      this.body.material = material;
    }
    this.isLog = log;
    this.eyes.visible = !log;
    if (this.log) this.log.visible = log;
  }

  _buildLog() {
    this.logGeo = new THREE.CylinderGeometry(0.75, 0.82, 2.0, 14);
    const ink = new THREE.MeshBasicMaterial({ color: 0x1b1420 });
    const white = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const bark = new THREE.MeshStandardMaterial({ color: 0xa0662e, roughness: 0.85 });
    const wood = new THREE.MeshStandardMaterial({ color: 0xd8a86a, roughness: 0.7 });
    const g = new THREE.Group();
    // Face is built on the -Z side, then the whole face group is turned 180 degrees so it
    // looks back at the camera (the camera follows from behind).
    const face = new THREE.Group();
    face.rotation.y = Math.PI;
    g.add(face);
    // z of the log surface (facing -Z) at local x,y, so flat face parts sit just in front of it.
    const surf = (x, y) => -(Math.sqrt(Math.max(0.05, Math.pow(0.785 - 0.035 * y, 2) - x * x)) + 0.03);
    const disc = (r, mat, x, y, dz) => {
      const m = new THREE.Mesh(new THREE.CircleGeometry(r, 18), mat);
      m.position.set(x, y, surf(x, y) - dz); m.rotation.y = Math.PI; face.add(m); return m;
    };
    for (const s of [-1, 1]) {
      disc(0.27, ink, s * 0.3, 0.55, 0);
      disc(0.22, white, s * 0.3, 0.55, 0.02);
      disc(0.11, ink, s * 0.3 - s * 0.02, 0.52, 0.04);
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.1, 0.04), ink);
      brow.position.set(s * 0.34, 0.9, surf(s * 0.34, 0.9));
      brow.rotation.z = s * 0.45;   // inner ends low: angry
      face.add(brow);
    }
    const mouth = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.09, 0.04), ink);
    mouth.position.set(0, 0.12, surf(0, 0.12)); face.add(mouth);
    // arms
    for (const s of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 8), bark);
      arm.position.set(s * 0.95, -0.12, 0);
      arm.rotation.z = -s * 1.2;
      const hand = new THREE.Mesh(new THREE.SphereGeometry(0.15, 10, 8), bark);
      hand.position.set(s * 1.12, -0.04, 0);
      g.add(arm, hand);
    }
    // bat held upright in the right hand, pivoting at the grip
    const pivot = new THREE.Group();
    pivot.position.set(1.12, -0.04, 0);
    const bat = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.07, 1.5, 10), wood);
    bat.position.y = 0.55;
    const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.085, 0.3, 10), ink);
    grip.position.y = -0.05;
    const knob = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 6), wood);
    knob.position.y = -0.22;
    pivot.add(bat, grip, knob);
    g.add(pivot);
    this.batPivot = pivot;
    this.log = g;
    g.visible = false;
    this.body.add(g);
  }

  // Bat taps down toward the ground and back, ~2 taps/s. Returns tap amount 0..1 for the hop.
  _animateLog() {
    const w = (this.time * 2) % 1;
    const d = w < 0.5 ? Math.pow(Math.sin(w * 2 * Math.PI), 0.6) : 0;
    this.batPivot.rotation.x = -d * 1.35;   // tip swings forward (-Z) and down
    this.batPivot.rotation.z = -0.12;       // slight outward lean
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
    if (this.isLog) {
      const tap = this._animateLog();
      this.body.position.y += tap * 0.06 * s; // tiny hop on each tap
    }
    this.body.rotation.z = THREE.MathUtils.clamp(-vx * 0.03, -0.35, 0.35);

    this.group.position.set(this.x, this.y, -this.d);
    this.label.position.set(0, s * 2 + 0.9, 0);
    const ls = 0.9 + s * 0.25;
    this.label.scale.set(ls * 2, ls, 1);
  }

  get radius() { return this.scale; }

  // Core body size (largest of width/height, no accessories) at the settled scale.
  // Blob sphere: diameter 2. Log: 1.64 wide x 2.0 tall -> 2.0. Used to size the boss fairly.
  get coreSize() { return this.scale * (this.isLog ? 2.0 : 2); }
  get position() { return this.group.position; }
}
