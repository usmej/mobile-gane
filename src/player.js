import * as THREE from 'three';
import { CONFIG, massToScale } from './config.js';
import { makeLabel } from './labels.js';

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
    this.body.add(this.eyes);

    this.label = makeLabel('10', { bg: 'rgba(20,10,40,0.55)', height: 0.9 });
    this.group.add(this.body, this.label);
    scene.add(this.group);

    this.reset();
  }

  reset() {
    this.mass = CONFIG.startMass;
    this.x = 0;
    this.targetX = 0;
    this.d = 0;
    this.scale = massToScale(this.mass);
    this.squash = 0;      // impulse for wobble
    this.time = 0;
    this.group.position.set(0, 0, 0);
    this.label.setText(this.mass);
  }

  setMaterial(mat) { this.body.material = mat; }

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
    this.body.rotation.z = THREE.MathUtils.clamp(-vx * 0.03, -0.35, 0.35);

    this.group.position.set(this.x, 0, -this.d);
    this.label.position.set(0, s * 2 + 0.9, 0);
    const ls = 0.9 + s * 0.25;
    this.label.scale.set(ls * 2, ls, 1);
  }

  get radius() { return this.scale; }
  get position() { return this.group.position; }
}
