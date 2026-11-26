import * as THREE from 'three';
import { CONFIG } from './config.js';

const GROUND_Y = -8;

// Builds the track, sky, fog and scenery for one level. Call dispose() before building the next.
export class World {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    scene.add(this.group);

    this.hemi = new THREE.HemisphereLight(0xffffff, 0x444466, 1.1);
    this.sun = new THREE.DirectionalLight(0xffffff, 1.6);
    this.sun.position.set(6, 14, 6);
    this.sun.castShadow = true;
    this.sun.shadow.mapSize.set(1024, 1024);
    const sc = this.sun.shadow.camera;
    sc.left = -12; sc.right = 12; sc.top = 20; sc.bottom = -20; sc.near = 1; sc.far = 60;
    scene.add(this.hemi, this.sun, this.sun.target);
    this.decor = [];
  }

  build(levelData) {
    this.dispose();
    const { theme, length } = levelData;
    const total = length + CONFIG.bossArena;
    const W = CONFIG.trackHalfWidth;

    this.scene.background = new THREE.Color(theme.sky);
    this.scene.fog = new THREE.Fog(theme.fog, 35, 110);
    this.hemi.color.set(0xffffff);
    this.hemi.groundColor.set(theme.accent);

    // Track with themed pattern texture
    const tex = makeTrackTexture(theme);
    tex.repeat.set(1, total / 8);
    const trackMat = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.75 });
    const track = new THREE.Mesh(new THREE.BoxGeometry(W * 2, 0.6, total + 30), trackMat);
    track.position.set(0, -0.3, -(total / 2) + 15);
    track.receiveShadow = true;
    this.group.add(track);

    // Rails
    const railMat = new THREE.MeshStandardMaterial({ color: theme.edge, roughness: 0.4 });
    for (const s of [-1, 1]) {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.5, total + 30), railMat);
      rail.position.set(s * (W + 0.17), 0.1, track.position.z);
      rail.castShadow = true;
      this.group.add(rail);
    }

    // Finish line
    const fin = makeCheckerTexture('#ffffff', '#111111');
    fin.repeat.set(6, 1);
    const finish = new THREE.Mesh(new THREE.PlaneGeometry(W * 2, 1.4), new THREE.MeshBasicMaterial({ map: fin }));
    finish.rotation.x = -Math.PI / 2;
    finish.position.set(0, 0.02, -length);
    this.group.add(finish);

    // Ground far below, in a darkened fog color
    const groundCol = new THREE.Color(theme.fog).multiplyScalar(0.75);
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(500, total + 500), new THREE.MeshBasicMaterial({ color: groundCol }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, GROUND_Y, -total / 2 + 15);
    this.group.add(ground);

    // Square pylons under the track every 12 units
    const pylonMat = new THREE.MeshStandardMaterial({ color: theme.edge, roughness: 0.8, flatShading: true });
    const pylonGeo = new THREE.BoxGeometry(1, -0.6 - GROUND_Y, 1);
    for (let z = 6; z > -total - 20; z -= 12) {
      for (const s of [-1, 1]) {
        const p = new THREE.Mesh(pylonGeo, pylonMat);
        p.position.set(s * (W - 0.8), (-0.6 + GROUND_Y) / 2, z);
        this.group.add(p);
      }
    }

    // Grounded props on a fixed rhythm: alternate sides every 10 units at W + 4
    const kinds = propKinds(theme);
    const mats = {
      a: new THREE.MeshStandardMaterial({ color: theme.accent, roughness: 0.7, flatShading: true }),
      e: new THREE.MeshStandardMaterial({ color: theme.edge, roughness: 0.7, flatShading: true }),
      t: new THREE.MeshStandardMaterial({ color: theme.trackAlt, roughness: 0.7, flatShading: true }),
      c: new THREE.MeshStandardMaterial({ color: '#FFF4E0', roughness: 0.7, flatShading: true }),
    };
    let i = 0;
    for (let z = 0; z > -total - 20; z -= 10, i++) {
      const side = i % 2 ? 1 : -1;
      const kind = kinds[Math.floor(i / 2) % kinds.length];
      const prop = buildProp(kind, mats, this.decor, i);
      prop.position.set(side * (W + 4), GROUND_Y, z);
      this.group.add(prop);
    }
  }

  update(dt, time, playerZ) {
    for (const m of this.decor) m.rotation.z = Math.sin(time * 0.3 + m.userData.ph) * 0.08; // slow lollipop sway
    // keep the shadow camera following the player
    this.sun.position.set(6, 14, playerZ + 6);
    this.sun.target.position.set(0, 0, playerZ - 6);
  }

  dispose() {
    this.group.traverse((o) => {
      if (o.isMesh) {
        o.geometry.dispose();
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        mats.forEach((m) => { m.map?.dispose(); m.dispose(); });
      }
    });
    this.group.clear();
    this.decor = [];
  }
}

function canvasTex(draw) {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  draw(c.getContext('2d'));
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 4;
  return t;
}

function makeCheckerTexture(a, b) {
  return canvasTex((ctx) => {
    ctx.fillStyle = a; ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = b; ctx.fillRect(0, 0, 64, 64); ctx.fillRect(64, 64, 64, 64);
  });
}

function propKinds(theme) {
  switch (theme.id) {
    case 'toxic-slime': case 'goblin-swamp': return ['barrel', 'pipe'];
    case 'lava-drip': case 'neon-grid': return ['basalt', 'pipe'];
    default: return ['lollipop', 'gumdrop'];
  }
}

function buildProp(kind, m, decor, idx) {
  const g = new THREE.Group();
  const add = (geo, mat, x, y, z) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); g.add(o); return o; };
  switch (kind) {
    case 'lollipop': {
      add(new THREE.CylinderGeometry(0.28, 0.28, 10, 6), m.c, 0, 5, 0);
      const head = new THREE.Group();
      head.position.y = 10.4;
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.7, 1.7, 0.5, 10), m.a);
      disc.rotation.x = Math.PI / 2;
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.62, 10), m.c);
      core.rotation.x = Math.PI / 2;
      head.add(disc, core);
      head.userData.ph = idx * 1.7;
      g.add(head);
      decor.push(head);
      break;
    }
    case 'gumdrop':
      add(new THREE.ConeGeometry(2.2, 9, 7), m.a, 0, 4.5, 0);
      add(new THREE.SphereGeometry(0.7, 6, 4), m.a, 0, 9.1, 0);
      break;
    case 'barrel':
      add(new THREE.CylinderGeometry(1.5, 1.5, 6, 8), m.a, 0, 3, 0);
      for (const y of [1.2, 4.8]) add(new THREE.CylinderGeometry(1.58, 1.58, 0.35, 8), m.e, 0, y, 0);
      add(new THREE.CylinderGeometry(1.2, 1.2, 4, 8), m.a, 0, 8, 0);
      add(new THREE.CylinderGeometry(1.28, 1.28, 0.35, 8), m.e, 0, 6.4, 0);
      break;
    case 'pipe':
      add(new THREE.CylinderGeometry(0.9, 0.9, 9, 8), m.e, 0, 4.5, 0);
      add(new THREE.CylinderGeometry(1.25, 1.25, 0.7, 8), m.a, 0, 9.2, 0);
      add(new THREE.CylinderGeometry(1.1, 1.1, 0.5, 8), m.t, 0, 1.2, 0);
      break;
    case 'basalt':
      for (const [x, z, r, h, mt] of [[0, 0, 1.4, 11, m.e], [-1.9, 1.0, 1.1, 8, m.a], [1.7, 0.8, 1.2, 6, m.e]]) {
        add(new THREE.CylinderGeometry(r, r * 1.05, h, 6), mt, x, h / 2, z);
      }
      break;
  }
  g.traverse((o) => { if (o.isMesh) o.castShadow = false; });
  return g;
}

function makeTrackTexture(theme) {
  const S = 512;
  const c = document.createElement('canvas');
  c.width = c.height = S;
  const ctx = c.getContext('2d');
  ctx.fillStyle = theme.track;
  ctx.fillRect(0, 0, S, S);
  // subtle seam at each tile boundary
  ctx.fillStyle = 'rgba(27,20,32,0.12)';
  ctx.fillRect(0, 0, S, 6);
  // forward-pointing chevrons (canvas top = forward)
  ctx.strokeStyle = theme.trackAlt;
  ctx.globalAlpha = 0.35;
  ctx.lineWidth = 22;
  ctx.lineJoin = 'miter';
  ctx.lineCap = 'butt';
  for (const y of [150, 400]) {
    ctx.beginPath();
    ctx.moveTo(S / 2 - 90, y + 60); ctx.lineTo(S / 2, y); ctx.lineTo(S / 2 + 90, y + 60);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  // lane edge stripes near both sides
  ctx.fillStyle = theme.trackAlt;
  ctx.fillRect(30, 0, 18, S);
  ctx.fillRect(S - 48, 0, 18, S);
  ctx.fillStyle = 'rgba(27,20,32,0.25)';
  ctx.fillRect(48, 0, 4, S);
  ctx.fillRect(S - 52, 0, 4, S);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}
