import * as THREE from 'three';
import { CONFIG } from './config.js';
import { makeLabel } from './labels.js';
import { isGoodOp } from './levels.js';
import { makeBossMesh } from './bosses.js';

const GOOD = '#2fa8ff';
const BAD = '#ff3b5c';

// Shared geometries/materials (created once, reused across levels)
const G = {};
function shared() {
  if (G.ready) return G;
  G.coin = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 20);
  G.coinMat = new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.6, roughness: 0.25, emissive: 0x553300, emissiveIntensity: 0.4 });
  G.gem = new THREE.OctahedronGeometry(0.5, 0);
  G.gemMat = new THREE.MeshStandardMaterial({ color: 0xb04bff, metalness: 0.3, roughness: 0.1, emissive: 0x5a00aa, emissiveIntensity: 0.7, flatShading: true });
  G.broc = new THREE.IcosahedronGeometry(0.42, 1);
  G.brocMat = new THREE.MeshStandardMaterial({ color: 0x3fd64f, roughness: 0.6, flatShading: true });
  G.stem = new THREE.CylinderGeometry(0.12, 0.16, 0.5, 8);
  G.stemMat = new THREE.MeshStandardMaterial({ color: 0x9be37a });
  G.bun = new THREE.SphereGeometry(0.45, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
  G.bunMat = new THREE.MeshStandardMaterial({ color: 0xd98a3a, roughness: 0.6 });
  G.patty = new THREE.CylinderGeometry(0.47, 0.47, 0.16, 16);
  G.pattyMat = new THREE.MeshStandardMaterial({ color: 0x5a2d14, roughness: 0.8 });
  G.saw = new THREE.CylinderGeometry(0.9, 0.9, 0.18, 12);
  G.sawMat = new THREE.MeshStandardMaterial({ color: 0xc9d1d9, metalness: 0.9, roughness: 0.25 });
  G.tooth = new THREE.ConeGeometry(0.16, 0.4, 4);
  G.wallMat = new THREE.MeshStandardMaterial({ color: 0x8a8fa8, roughness: 0.5 });
  G.ready = true;
  return G;
}

export class Entities {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);
    this.items = [];
    this.labels = [];
    this.boss = null;
  }

  build(levelData) {
    this.dispose();
    shared();
    const W = CONFIG.trackHalfWidth;
    for (const it of levelData.items) {
      const e = { ...it, used: false, obj: null, cooldown: 0, phase: Math.random() * Math.PI * 2 };
      const z = -it.d;
      switch (it.type) {
        case 'gate': e.obj = this.makeGatePair(it, z, W); break;
        case 'coin': {
          const m = new THREE.Mesh(G.coin, G.coinMat);
          m.rotation.x = Math.PI / 2;
          m.position.set(it.x, 0.9, z);
          m.castShadow = true;
          e.obj = m; break;
        }
        case 'gem': {
          const m = new THREE.Mesh(G.gem, G.gemMat);
          m.position.set(it.x, 1.1, z);
          e.obj = m; break;
        }
        case 'food': e.obj = it.good ? this.makeBroccoli() : this.makeBurger(); e.obj.position.set(it.x, 0, z); break;
        case 'saw': {
          const g = new THREE.Group();
          const blade = new THREE.Mesh(G.saw, G.sawMat);
          blade.rotation.x = Math.PI / 2;
          for (let i = 0; i < 10; i++) {
            const t = new THREE.Mesh(G.tooth, G.sawMat);
            const a = (i / 10) * Math.PI * 2;
            t.position.set(Math.cos(a) * 1.0, Math.sin(a) * 1.0, 0);
            t.rotation.z = a - Math.PI / 2;
            blade.add(t);
          }
          blade.rotation.set(0, 0, 0);
          blade.castShadow = true;
          g.add(blade);
          g.position.set(0, 0.9, z);
          g.userData.blade = blade;
          e.obj = g; break;
        }
        case 'wall': {
          const g = new THREE.Group();
          const box = new THREE.Mesh(new THREE.BoxGeometry(it.width, 2.4, 0.6), G.wallMat);
          box.position.y = 1.2;
          box.castShadow = true;
          g.add(box);
          const lab = makeLabel(it.value, { color: '#ffe14d', height: 1.1 });
          lab.position.set(0, 1.3, 0.4);
          g.add(lab);
          this.labels.push(lab);
          g.position.set(it.x, 0, z);
          e.obj = g; break;
        }
      }
      if (e.obj) this.group.add(e.obj);
      this.items.push(e);
    }
    this.buildBoss(levelData);
  }

  makeGatePair(it, z, W) {
    const g = new THREE.Group();
    for (const [side, gate] of [[-1, it.left], [1, it.right]]) {
      const good = isGoodOp(gate.op);
      const color = good ? GOOD : BAD;
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(W - 0.15, 2.6, 0.15),
        new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.45, emissive: color, emissiveIntensity: 0.35 })
      );
      panel.position.set(side * W / 2, 1.3, 0);
      const frame = new THREE.Mesh(new THREE.BoxGeometry(W, 0.25, 0.3), new THREE.MeshStandardMaterial({ color }));
      frame.position.set(side * W / 2, 2.7, 0);
      const lab = makeLabel(`${gate.op}${gate.value}`, { height: 1.2 });
      lab.position.set(side * W / 2, 1.5, 0.2);
      this.labels.push(lab);
      panel.userData.side = side;
      g.add(panel, frame, lab);
    }
    g.position.z = z;
    return g;
  }

  makeBroccoli() {
    const g = new THREE.Group();
    const stem = new THREE.Mesh(G.stem, G.stemMat);
    stem.position.y = 0.35;
    g.add(stem);
    for (const [x, y, zz] of [[0, 0.8, 0], [-0.25, 0.65, 0.1], [0.25, 0.65, -0.1]]) {
      const b = new THREE.Mesh(G.broc, G.brocMat);
      b.position.set(x, y, zz);
      b.castShadow = true;
      g.add(b);
    }
    return g;
  }

  makeBurger() {
    const g = new THREE.Group();
    const bottom = new THREE.Mesh(G.patty, G.bunMat); bottom.position.y = 0.2;
    const patty = new THREE.Mesh(G.patty, G.pattyMat); patty.position.y = 0.36;
    const top = new THREE.Mesh(G.bun, G.bunMat); top.position.y = 0.44;
    top.castShadow = true;
    g.add(bottom, patty, top);
    return g;
  }

  buildBoss(levelData) {
    const hp = levelData.boss.hp;
    const size = 1.4 + Math.cbrt(hp) * 0.28;
    const { group: g, body, height } = makeBossMesh(levelData.level || 1, size);
    const lab = makeLabel(hp, { color: '#ff4d6d', bg: 'rgba(0,0,0,0.6)', height: 1.4 });
    lab.position.set(0, (height || size * 2) + 1.4, 0);
    this.labels.push(lab);
    g.add(lab);
    g.position.set(0, 0, -levelData.boss.d);
    this.group.add(g);
    this.boss = { group: g, body, label: lab, hp, size, d: levelData.boss.d, dead: false };
  }

  /** Advance animation + collisions. Returns an array of events for main.js to apply. */
  update(dt, time, player, prevD) {
    const events = [];
    const r = player.radius;
    const px = player.x;
    const pd = player.d;

    for (const e of this.items) {
      if (!e.obj) continue;
      const near = Math.abs(e.d - pd) < 60;
      e.obj.visible = !e.used || e.type === 'gate' || e.type === 'wall';

      if (e.type === 'coin' && !e.used) e.obj.rotation.z = time * 4;
      if (e.type === 'gem' && !e.used) { e.obj.rotation.y = time * 2; e.obj.position.y = 1.1 + Math.sin(time * 3) * 0.2; }
      if (e.type === 'saw') {
        e.obj.position.x = Math.sin(time * e.speed + e.phase) * e.amp;
        e.obj.userData.blade.rotation.z -= dt * 12;
        e.cooldown -= dt;
      }
      if (e.type === 'gate' && e.used) {
        e.obj.scale.y = Math.max(0.01, e.obj.scale.y - dt * 4);
      }
      if (!near || e.used) continue;

      const dx = Math.abs((e.type === 'saw' ? e.obj.position.x : e.x ?? 0) - px);
      const dd = Math.abs(e.d - pd);
      const pos = player.position.clone().setY(r * 2);

      switch (e.type) {
        case 'gate':
          if (prevD < e.d && pd >= e.d) {
            e.used = true;
            const gate = px < 0 ? e.left : e.right;
            events.push({ type: 'gate', op: gate.op, value: gate.value, good: isGoodOp(gate.op), pos });
          }
          break;
        case 'coin':
        case 'gem':
        case 'food':
          if (dd < r * 0.8 + CONFIG.pickupRadius * 0.6 && dx < r * 0.9 + CONFIG.pickupRadius * 0.5) {
            e.used = true;
            events.push({ type: e.type, good: e.good, value: e.value, pos: e.obj.position.clone().setY(1.5) });
          }
          break;
        case 'saw':
          if (e.cooldown <= 0 && dd < r * 0.7 + 0.5 && dx < r * 0.8 + 0.8) {
            e.cooldown = CONFIG.sawDamageCooldown;
            events.push({ type: 'saw', damage: e.damage, pos });
          }
          break;
        case 'wall':
          if (prevD < e.d - r * 0.5 && pd >= e.d - r * 0.5 && dx < e.width / 2 + r * 0.6) {
            e.used = true;
            events.push({ type: 'wall', value: e.value, pos, wall: e });
          }
          break;
      }
    }

    if (this.boss && !this.boss.dead) {
      const b = this.boss;
      const s = 1 + Math.sin(time * 4) * 0.04;
      b.body.scale.set(s, 1 / s, s);
    }
    return events;
  }

  smashWall(wall) {
    wall.obj.visible = false;
  }

  dispose() {
    this.labels.forEach((l) => l.disposeLabel());
    this.labels = [];
    this.group.traverse((o) => {
      if (o.isMesh && !Object.values(G).includes(o.geometry)) {
        o.geometry.dispose();
        if (!Object.values(G).includes(o.material)) o.material.dispose();
      }
    });
    this.group.clear();
    this.items = [];
    this.boss = null;
  }
}
