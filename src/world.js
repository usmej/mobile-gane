import * as THREE from 'three';
import { CONFIG } from './config.js';
import { makeRng } from './levels.js';

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

    // Floating scenery: chunky shapes in accent colors on both sides
    const rng = makeRng(levelData.level * 31 + 5);
    const shapes = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.TorusGeometry(0.9, 0.35, 8, 16),
      new THREE.BoxGeometry(1.4, 1.4, 1.4),
      new THREE.ConeGeometry(0.9, 1.8, 6),
      new THREE.OctahedronGeometry(1, 0),
    ];
    const colors = [theme.accent, theme.edge, theme.trackAlt, theme.track];
    for (let z = 0; z > -total - 20; z -= 7) {
      for (const s of [-1, 1]) {
        if (rng() < 0.35) continue;
        const mat = new THREE.MeshStandardMaterial({ color: rng.pick(colors), roughness: 0.5, flatShading: true });
        const m = new THREE.Mesh(rng.pick(shapes), mat);
        const sz = rng.range(0.8, 2.6);
        m.scale.setScalar(sz);
        m.position.set(s * rng.range(W + 3, W + 14), rng.range(-3, 6), z + rng.range(-3, 3));
        m.userData.spin = rng.range(-1, 1);
        m.userData.bob = rng.range(0, Math.PI * 2);
        m.userData.baseY = m.position.y;
        this.group.add(m);
        this.decor.push(m);
      }
    }
  }

  update(dt, time, playerZ) {
    for (const m of this.decor) {
      m.rotation.y += m.userData.spin * dt;
      m.rotation.x += m.userData.spin * 0.5 * dt;
      m.position.y = m.userData.baseY + Math.sin(time * 1.5 + m.userData.bob) * 0.5;
    }
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

function makeTrackTexture(theme) {
  return canvasTex((ctx) => {
    ctx.fillStyle = theme.track;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = theme.trackAlt;
    switch (theme.pattern) {
      case 'stripes':
        ctx.fillRect(0, 0, 128, 40);
        break;
      case 'checker':
        ctx.fillRect(0, 0, 64, 64); ctx.fillRect(64, 64, 64, 64);
        break;
      case 'dots':
        for (const [x, y] of [[32, 32], [96, 96], [96, 32], [32, 96]]) {
          ctx.beginPath(); ctx.arc(x, y, 14, 0, Math.PI * 2); ctx.fill();
        }
        break;
      default:
        ctx.fillRect(60, 0, 8, 128);
    }
  });
}
