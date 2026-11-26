import * as THREE from 'three';
import { CONFIG } from './config.js';
import { makeLabel } from './labels.js';

// Bonus stairs after the boss: x1 → x10. Leftover mass pays for each step.
const STEP_COLORS = ['#ff4d6d', '#ff8a3d', '#ffd23f', '#9be15d', '#2fd4a7', '#2fa8ff', '#6c63ff', '#b04bff', '#ff5ec4', '#ffffff'];

export class Finale {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.labels = [];
    this.active = false;
  }

  build(levelData) {
    this.dispose();
    const W = CONFIG.trackHalfWidth;
    this.startD = levelData.boss.d + CONFIG.finaleGap;
    this.steps = [];
    for (let i = 0; i < CONFIG.finaleSteps; i++) {
      const h = (i + 1) * CONFIG.finaleStepRise;
      const color = STEP_COLORS[i % STEP_COLORS.length];
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(W * 2, h, CONFIG.finaleStepDepth),
        new THREE.MeshStandardMaterial({ color, roughness: 0.45, emissive: color, emissiveIntensity: 0.12 })
      );
      const d = this.startD + i * CONFIG.finaleStepDepth;
      box.position.set(0, h / 2, -d - CONFIG.finaleStepDepth / 2);
      box.receiveShadow = true;
      const lab = makeLabel(`x${i + 1}`, { color: '#ffffff', height: 1.1 });
      lab.position.set(0, h + 0.05, -d - 0.3);
      lab.material.depthTest = false;
      this.labels.push(lab);
      this.group.add(box, lab);
      this.steps.push({ d, h, color, box });
    }
  }

  /** Begin the climb. Returns the multiplier the player will reach. */
  start(player, bossHp) {
    this.active = true;
    this.player = player;
    this.stepCost = Math.max(CONFIG.finaleMinStepCost, Math.ceil(bossHp * CONFIG.finaleStepCostRatio));
    this.massLeft = Math.max(0, player.mass - bossHp);
    this.target = Math.min(CONFIG.finaleSteps, 1 + Math.floor(this.massLeft / this.stepCost));
    this.current = 0;
    this.t = 0;
    player.targetX = 0;
    return this.target;
  }

  /** Advance the climb. Returns { stepped: n | null, done: bool }. */
  update(dt) {
    if (!this.active) return { stepped: null, done: false };
    const p = this.player;
    const goalStep = this.steps[this.target - 1];
    const goalD = goalStep.d + CONFIG.finaleStepDepth / 2;
    p.d = Math.min(goalD, p.d + CONFIG.finaleSpeed * dt);

    // which step are we on?
    let on = 0;
    for (let i = 0; i < this.steps.length; i++) if (p.d >= this.steps[i].d) on = i + 1;
    const targetY = on > 0 ? this.steps[on - 1].h : 0;
    p.y += (targetY - p.y) * (1 - Math.exp(-14 * dt));

    let stepped = null;
    if (on > this.current) {
      this.current = on;
      stepped = on;
      // each step after the first eats mass, so the blob visibly shrinks while it climbs
      if (on > 1) p.setMass(Math.max(1, p.mass - this.stepCost));
    }
    if (p.d >= goalD) {
      this.t += dt;
      if (this.t > 0.5) { this.active = false; return { stepped, done: true }; }
    }
    return { stepped, done: false };
  }

  stepPosition(n) {
    const s = this.steps[n - 1];
    return new THREE.Vector3(0, s.h + 1.5, -s.d - 1);
  }

  dispose() {
    this.active = false;
    this.labels.forEach((l) => l.disposeLabel());
    this.labels = [];
    this.group.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.dispose(); } });
    this.group.clear();
    this.steps = [];
  }
}
