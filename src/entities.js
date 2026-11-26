import * as THREE from 'three';
import { CONFIG } from './config.js';
import { makeLabel, makeTextTexture, FONT } from './labels.js';
import { isGoodOp } from './levels.js';
import { makeBossMesh } from './bosses.js';

const GOOD = '#1FA2FF';
const BAD = '#FF3B5C';
const INK = '#1B1420';
const CREAM = '#FFF4E0';

// Shared geometries/materials (created once, reused across levels)
const G = {};
function shared() {
  if (G.ready) return G;
  G.coin = new THREE.CylinderGeometry(0.42, 0.42, 0.12, 20);
  G.coinMat = new THREE.MeshStandardMaterial({ color: 0xffd23f, metalness: 0.1, roughness: 0.5 });
  G.gem = new THREE.OctahedronGeometry(0.5, 0);
  G.gemMat = new THREE.MeshStandardMaterial({ color: 0xb04bff, metalness: 0.1, roughness: 0.5, flatShading: true });
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
    this.textures = [];
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
          const WH = 2.4;
          const wallTex = makeTextTexture(512, Math.max(64, Math.round(512 * WH / it.width)), (ctx, w, h) => {
            ctx.fillStyle = '#8a8fa8';
            ctx.fillRect(0, 0, w, h);
            ctx.fillStyle = INK;
            ctx.fillRect(0, 0, w, 8); ctx.fillRect(0, h - 8, w, 8); ctx.fillRect(0, 0, 8, h); ctx.fillRect(w - 8, 0, 8, h);
            const ph = h * 0.62;
            const pw = Math.min(w * 0.8, ph * 2.4);
            ctx.fillStyle = INK;
            ctx.fillRect((w - pw) / 2 - 6, (h - ph) / 2 - 6, pw + 12, ph + 12);
            ctx.fillStyle = '#FFD23F';
            ctx.fillRect((w - pw) / 2, (h - ph) / 2, pw, ph);
            ctx.fillStyle = INK;
            ctx.font = `${Math.floor(ph * 0.72)}px ${FONT}`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(String(it.value), w / 2, h / 2 + ph * 0.04);
          });
          this.textures.push(wallTex);
          const side = new THREE.MeshStandardMaterial({ color: 0x8a8fa8, roughness: 0.8, flatShading: true });
          const face = new THREE.MeshStandardMaterial({ map: wallTex, roughness: 0.8 });
          const box = new THREE.Mesh(new THREE.BoxGeometry(it.width, WH, 0.6), [side, side, side, side, face, side]);
          box.position.y = WH / 2;
          box.castShadow = true;
          g.add(box);
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
    const postW = 0.3, headH = 1.05, H = 3.1; // tall header so the number reads on a phone
    for (const [side, gate] of [[-1, it.left], [1, it.right]]) {
      const good = isGoodOp(gate.op);
      const color = good ? GOOD : BAD;
      const solid = new THREE.MeshStandardMaterial({ color, roughness: 0.6, flatShading: true });
      const cx = side * W / 2;
      const panel = new THREE.Mesh(
        new THREE.BoxGeometry(W - postW, H - headH, 0.1),
        new THREE.MeshStandardMaterial({ color, transparent: true, opacity: 0.18, depthWrite: false })
      );
      panel.position.set(cx, (H - headH) / 2, 0);
      panel.userData.side = side;
      for (const px of [cx - W / 2 + postW / 2, cx + W / 2 - postW / 2]) {
        const post = new THREE.Mesh(new THREE.BoxGeometry(postW, H, 0.3), solid);
        post.position.set(px, H / 2, 0);
        post.castShadow = true;
        g.add(post);
      }
      const txt = `${gate.op}${gate.value}`;
      const tex = makeTextTexture(384, 134, (ctx, w, h) => {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = INK;
        ctx.fillRect(0, h - 8, w, 8);
        ctx.fillStyle = CREAM;
        ctx.font = `${txt.length > 3 ? 92 : 112}px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.lineWidth = 10;
        ctx.strokeStyle = INK;
        ctx.strokeText(txt, w / 2, h / 2 - 3);
        ctx.fillText(txt, w / 2, h / 2 - 3);
      });
      this.textures.push(tex);
      const face = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.6 });
      const header = new THREE.Mesh(new THREE.BoxGeometry(W, headH, 0.4), [solid, solid, solid, solid, face, solid]);
      header.position.set(cx, H - headH / 2, 0);
      header.castShadow = true;
      g.add(panel, header);
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
    const lab = makeLabel(hp, { color: CREAM, bg: '#FF3B5C', height: 1.4 });
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
    (this.textures || []).forEach((t) => t.dispose());
    this.textures = [];
    this.group.traverse((o) => {
      if (o.isMesh && !Object.values(G).includes(o.geometry)) {
        o.geometry.dispose();
        const ms = Array.isArray(o.material) ? o.material : [o.material];
        ms.forEach((m) => { if (!Object.values(G).includes(m)) m.dispose(); });
      }
    });
    this.group.clear();
    this.items = [];
    this.boss = null;
  }
}
