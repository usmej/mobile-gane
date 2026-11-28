// Small rendered portraits of the characters for the shop cards.
// Built with the real Player builder so they match the in-game models; rendered once per skin
// with one shared offscreen renderer, then cached as PNG data URLs.
import * as THREE from 'three';
import { Player } from './player.js';

const SIZE = 192;
const cache = new Map();
let renderer = null;
let rendererFailed = false;

function getRenderer() {
  if (renderer || rendererFailed) return renderer;
  try {
    const canvas = document.createElement('canvas');
    canvas.width = SIZE; canvas.height = SIZE;
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.setSize(SIZE, SIZE, false);
    renderer.setClearColor(0x000000, 0);
  } catch (e) { renderer = null; rendererFailed = true; }
  return renderer;
}

function render(skin) {
  const r = getRenderer();
  if (!r) return null;
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x9a8fb0, 1.6));
  const sun = new THREE.DirectionalLight(0xffffff, 2.2);
  sun.position.set(3, 6, 8);
  scene.add(sun);

  const baseMat = new THREE.MeshStandardMaterial({ color: skin.color || '#ffffff' });
  const player = new Player(scene, baseMat);
  player.setSkin(skin, baseMat);
  player.label.removeFromParent();
  player.eyes.removeFromParent();
  const shared = skin.shape === 'rooster' ? player.body.material : null;   // cached rooster materials: keep
  const subject = player.currentCharacterSkin || player.body;
  scene.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(subject);
  const center = box.getCenter(new THREE.Vector3());
  const radius = box.getSize(new THREE.Vector3()).length() / 2 || 1;

  const cam = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  const dist = radius / Math.sin(THREE.MathUtils.degToRad(cam.fov / 2)) * 1.02;
  cam.position.copy(center).add(new THREE.Vector3(0.55, 0.3, 1).normalize().multiplyScalar(dist));
  cam.lookAt(center);

  let url = null;
  try {
    r.render(scene, cam);
    url = r.domElement.toDataURL('image/png');
  } catch (e) { url = null; }

  const mats = new Set();
  scene.traverse((o) => {
    if (o.geometry) o.geometry.dispose();
    const m = o.material;
    if (m) (Array.isArray(m) ? m : [m]).forEach((x) => mats.add(x));
  });
  const keep = new Set(Array.isArray(shared) ? shared : shared ? [shared] : []);
  mats.forEach((m) => {
    if (keep.has(m)) return;
    if (m.map && m.map.dispose) m.map.dispose();
    m.dispose();
  });
  return url;
}

export function getPortrait(skin) {
  if (!skin) return null;
  if (cache.has(skin.id)) return cache.get(skin.id);
  let url = null;
  try { url = render(skin); } catch (e) { url = null; }
  if (url) cache.set(skin.id, url);
  return url;
}
