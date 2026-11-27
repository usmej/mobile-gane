import * as THREE from 'three';
import { CONFIG } from './config.js';
import { makeTextTexture, FONT } from './labels.js';

// Bonus stairs after the boss: x1 -> x10. Leftover mass pays for each step.
const INK = '#1B1420';

export class Finale {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.active = false;
  }

  build(levelData) {
    this.dispose();
    const W = CONFIG.trackHalfWidth;
    const theme = levelData.theme || {};
    const cols = [theme.track || '#8a8fa8', theme.trackAlt || '#b9bdd0'];
    this.startD = levelData.boss.d + CONFIG.finaleGap;
    this.steps = [];
    const rise = CONFIG.finaleStepRise;
    const depth = CONFIG.finaleStepDepth;
    for (let i = 0; i < CONFIG.finaleSteps; i++) {
      const h = (i + 1) * rise;
      const color = i >= 7 ? '#FFD23F' : cols[i % 2];
      const box = new THREE.Mesh(
        new THREE.BoxGeometry(W * 2, h, depth),
        new THREE.MeshStandardMaterial({ color, roughness: 0.85, flatShading: true })
      );
      const d = this.startD + i * depth;
      box.position.set(0, h / 2, -d - depth / 2);
      box.receiveShadow = true;
      // number painted on the exposed riser (+Z face)
      const label = `x${i + 1}`;
      const tex = makeTextTexture(1024, 96, (ctx, w, hh) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, hh);
        ctx.fillStyle = INK;
        ctx.fillRect(0, hh - 6, w, 6);
        ctx.font = `76px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, w / 2, hh / 2 - 2);
      });
      const riser = new THREE.Mesh(
        new THREE.PlaneGeometry(W * 2, rise),
        new THREE.MeshStandardMaterial({ map: tex, roughness: 0.85 })
      );
      riser.position.set(0, h - rise / 2, -d + 0.01);
      this.group.add(box, riser);
      this.steps.push({ d, h, color, box });
    }
  }

  /** Begin the climb. Returns the multiplier the player will reach. */
  start(player, bossHp) {
    this.active = true;
    this.player = player;
    this.stepCost = Math.max(CONFIG.finaleMinStepCost, Math.ceil(bossHp * CONFIG.finaleStepCostRatio));
    this.target = Math.min(this.steps.length, CONFIG.maxMultiplier, 1 + Math.floor(player.mass / this.stepCost));
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
      const paidSteps = on - Math.max(1, this.current);
      if (paidSteps > 0) p.setMass(p.mass - paidSteps * this.stepCost);
      this.current = on;
      stepped = on;
    }
    if (p.d >= goalD) {
      // Cash in any remainder without awarding a rung the player could not afford.
      if (p.mass > 0) p.setMass(0);
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
    this.group.traverse((o) => { if (o.isMesh) { o.geometry.dispose(); o.material.map?.dispose(); o.material.dispose(); } });
    this.group.clear();
    this.steps = [];
  }
}
