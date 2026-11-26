import * as THREE from 'three';
import { CONFIG, speedForLevel } from './config.js';
import { generateLevel, applyOp } from './levels.js';
import { World } from './world.js';
import { Player } from './player.js';
import { Entities } from './entities.js';
import { FX } from './fx.js';
import { UI } from './ui.js';
import { audio } from './audio.js';
import { SKINS, getSkin, makeSkinMaterial } from './skins.js';
import { loadSave, writeSave } from './save.js';
import { pickMeme } from './memes.js';
import { Finale } from './finale.js';
import { AutoQuality } from './quality.js';

// ---------- setup ----------
const save = loadSave();
const host = document.getElementById('game');
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
host.appendChild(renderer.domElement);
const quality = new AutoQuality(renderer);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 300);
const world = new World(scene);
const entities = new Entities(scene);
const player = new Player(scene, makeSkinMaterial(getSkin(save.skin)));
const fx = new FX(scene, camera, document.getElementById('fx'));
const finale = new Finale(scene);
audio.setEnabled(save.sound);

let state = 'menu';   // menu | playing | boss | finale | ending | result
let finaleMult = 1;
let level = null;
let runCoins = 0;
let runGems = 0;
let endTimer = 0;
let endResult = null;
let time = 0;

const ui = new UI(document.getElementById('ui'), {
  onPlay: () => { audio.unlock(); audio.play('click'); startRun(); },
  onNext: () => { audio.play('click'); loadLevel(); showMenu(); },
  onRetry: () => { audio.play('click'); loadLevel(); startRun(); },
  onOpenShop: () => { audio.unlock(); audio.play('click'); ui.showShop(save, SKINS); },
  onCloseShop: () => { audio.play('click'); showMenu(); },
  onBuySkin: (id) => buySkin(id),
  onEquipSkin: (id) => equipSkin(id),
  onToggleSound: (on) => {
    audio.unlock();
    save.sound = typeof on === 'boolean' ? on : !save.sound;
    audio.setEnabled(save.sound);
    writeSave(save);
  },
});

// ---------- flow ----------
function loadLevel() {
  level = generateLevel(save.level);
  world.build(level);
  entities.build(level);
  finale.build(level);
  player.reset();
  player.group.visible = true;
  fx.clear();
  runCoins = 0;
  runGems = 0;
}

function showMenu() {
  state = 'menu';
  player.label.visible = false;
  ui.showMenu(save);
}

function startRun() {
  if (state === 'result') loadLevel();
  state = 'playing';
  player.label.visible = true;
  ui.showHUD(save);
  audio.startMusic(save.level);
  fx.popText(pickMeme('start') || 'GO!', player.position.clone().setY(3), '#fff', 1.3);
}

// Boss beaten: blow it up, then climb the bonus stairs.
function defeatBoss() {
  const b = entities.boss;
  b.dead = true;
  b.group.visible = false;
  fx.burst(b.group.position.clone().setY(b.size), '#e0245e', 60);
  fx.burst(b.group.position.clone().setY(b.size * 1.5), '#ffd23f', 40);
  fx.popText(pickMeme('win') || 'W', b.group.position.clone().setY(b.size * 2), '#7CFF6B', 1.8);
  fx.shake(0.6);
  audio.play('smash');
  finaleMult = finale.start(player, b.hp);
  state = 'finale';
}

function finishRun(won) {
  state = 'ending';
  audio.stopMusic();
  endTimer = won ? 1.0 : 1.2;
  if (won) {
    const mult = Math.min(CONFIG.maxMultiplier, finaleMult);
    const coinsEarned = (runCoins + CONFIG.winBaseCoins + save.level * CONFIG.winCoinsPerLevel) * mult;
    const gemsEarned = runGems + (save.level % CONFIG.gemEveryNLevels === 0 ? 2 : 0);
    endResult = { won, level: save.level, coinsEarned, gemsEarned, multiplier: mult };
    save.coins += coinsEarned;
    save.gems += gemsEarned;
    save.level += 1;
    save.best = Math.max(save.best, save.level);
    fx.burst(player.position.clone().setY(player.y + 2), '#ffd23f', 50);
    audio.play('win');
  } else {
    // keep what you picked up — losing shouldn't feel like a total L
    save.coins += runCoins;
    save.gems += runGems;
    endResult = { won, level: save.level, reason: lossReason };
    player.group.visible = false;
    fx.burst(player.position.clone().setY(1), getSkin(save.skin).color, 50);
    fx.popText(pickMeme('lose') || 'L', player.position.clone().setY(2.5), '#ff4d6d', 1.8);
    fx.shake(0.5);
    audio.play('lose');
  }
  writeSave(save);
}

let lossReason = '';
function lose(reason) {
  if (state !== 'playing' && state !== 'boss') return;
  lossReason = reason;
  finishRun(false);
}

function buySkin(id) {
  const skin = getSkin(id);
  if (save.ownedSkins.includes(id)) return equipSkin(id);
  const wallet = skin.currency === 'gems' ? 'gems' : 'coins';
  if (save[wallet] < skin.price) { ui.toast('Not enough ' + wallet + ' 💀'); return; }
  save[wallet] -= skin.price;
  save.ownedSkins.push(id);
  audio.play('buy');
  ui.toast(`${skin.name} unlocked! SHEESH`);
  equipSkin(id);
}

function equipSkin(id) {
  if (!save.ownedSkins.includes(id)) return;
  save.skin = id;
  player.setMaterial(makeSkinMaterial(getSkin(id)));
  writeSave(save);
  audio.play('click');
  ui.showShop(save, SKINS);
}

// ---------- input: drag anywhere to steer ----------
let dragging = false;
let lastX = 0;
window.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; });
window.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  const dx = e.clientX - lastX;
  lastX = e.clientX;
  if (state === 'playing') player.steer(dx * (390 / Math.max(320, Math.min(window.innerWidth, 700))));
});
const endDrag = () => { dragging = false; };
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);
window.addEventListener('keydown', (e) => {
  if (state !== 'playing') return;
  if (e.key === 'ArrowLeft' || e.key === 'a') player.steer(-40);
  if (e.key === 'ArrowRight' || e.key === 'd') player.steer(40);
});

// ---------- events from entities ----------
function handleEvent(ev) {
  switch (ev.type) {
    case 'gate': {
      const before = player.mass;
      player.setMass(applyOp(before, ev.op, ev.value));
      fx.popText(`${ev.op}${ev.value}  ${pickMeme(ev.good ? 'gateGood' : 'gateBad')}`, ev.pos, ev.good ? '#5be3ff' : '#ff4d6d', 1.1);
      fx.burst(ev.pos, ev.good ? '#2fa8ff' : '#ff3b5c', 20);
      audio.play(ev.good ? 'gateGood' : 'gateBad');
      if (!ev.good) fx.shake(0.25);
      if (player.mass <= 0) lose('Divided into nothing 💀');
      break;
    }
    case 'food':
      player.setMass(player.mass + (ev.good ? ev.value : -ev.value));
      fx.popText(`${ev.good ? '+' : '-'}${ev.value} ${pickMeme(ev.good ? 'foodGood' : 'foodBad')}`, ev.pos, ev.good ? '#7CFF6B' : '#ff9f43', 0.8);
      fx.burst(ev.pos, ev.good ? '#3fd64f' : '#8a4b1e', 10);
      audio.play(ev.good ? 'foodGood' : 'foodBad');
      if (player.mass <= 0) lose('Ate too much junk 🍔');
      break;
    case 'coin':
      runCoins += 1;
      audio.play('coin');
      fx.burst(ev.pos, '#ffd23f', 6);
      break;
    case 'gem':
      runGems += 1;
      audio.play('gem');
      fx.burst(ev.pos, '#b04bff', 18);
      fx.popText('💎 ' + (pickMeme('coin') || 'GEM'), ev.pos, '#e3b3ff', 1);
      break;
    case 'saw':
      player.setMass(player.mass - ev.damage);
      fx.popText(`-${ev.damage} ${pickMeme('hit')}`, ev.pos, '#ff4d6d', 1);
      fx.burst(ev.pos, getSkin(save.skin).color, 14);
      fx.shake(0.35);
      audio.play('hit');
      if (player.mass <= 0) lose('Got sawed 🪚');
      break;
    case 'wall':
      if (player.mass > ev.value) {
        player.setMass(player.mass - ev.value);
        entities.smashWall(ev.wall);
        fx.burst(ev.pos, '#8a8fa8', 30);
        fx.popText(`SMASH -${ev.value}`, ev.pos, '#ffe14d', 1.2);
        fx.shake(0.45);
        audio.play('smash');
      } else {
        player.setMass(0);
        audio.play('hit');
        lose(`Too small for the ${ev.value} wall 🧱`);
      }
      break;
  }
}

// ---------- loop ----------
const camPos = new THREE.Vector3(0, 7, 10);
const camLook = new THREE.Vector3();

function resize() {
  const w = window.innerWidth, h = window.innerHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  // wider FOV on tall phone screens so the track fits
  camera.fov = w / h < 0.7 ? 68 : 58;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  time += dt;

  const prevD = player.d;
  if (state === 'playing' || state === 'boss') {
    const speed = speedForLevel(save.level);
    player.d += speed * dt * (state === 'boss' ? 0.75 : 1);
    if (state === 'playing' && player.d >= level.length) {
      state = 'boss';
      player.targetX = 0;
      audio.play('boss');
      fx.popText(pickMeme('boss') || 'BOSS', entities.boss.group.position.clone().setY(entities.boss.size * 2.6), '#ff4d6d', 1.5);
    }
    if (state === 'boss') {
      player.targetX = 0;
      const b = entities.boss;
      if (player.d >= b.d - b.size - player.radius * 0.6) {
        player.d = b.d - b.size - player.radius * 0.6;
        if (player.mass >= b.hp) defeatBoss();
        else lose(`Boss had ${b.hp}, you had ${player.mass} 😭`);
      }
    }
  }

  if (state === 'finale') {
    const { stepped, done } = finale.update(dt);
    if (stepped) {
      const pos = finale.stepPosition(stepped);
      fx.popText(`x${stepped}`, pos, stepped >= 7 ? '#ffd23f' : '#ffffff', 1 + stepped * 0.06);
      fx.burst(pos, finale.steps[stepped - 1].color, 12);
      audio.play(stepped === finaleMult ? 'gem' : 'coin');
    }
    if (done) finishRun(true);
  }

  player.update(dt);
  const events = entities.update(dt, time, player, prevD);
  if (state === 'playing' || state === 'boss') {
    for (const ev of events) {
      handleEvent(ev);
      if (state !== 'playing' && state !== 'boss') break;
    }
    ui.updateHUD({
      level: save.level,
      mass: player.mass,
      coins: save.coins + runCoins,
      gems: save.gems + runGems,
      progress: Math.min(1, player.d / level.length),
    });
  }

  if (state === 'ending') {
    endTimer -= dt;
    if (endTimer <= 0) {
      state = 'result';
      if (endResult.won) ui.showWin(endResult);
      else ui.showLose(endResult);
    }
  }

  // camera follow
  const s = player.scale;
  const pz = player.position.z;
  if (state === 'menu') {
    camPos.set(Math.sin(time * 0.4) * 2.5, 3.2 + s, pz + 7 + s);
    camLook.set(0, 1 + s * 0.5, pz);
  } else {
    const py = player.y;
    camPos.lerp(new THREE.Vector3(player.x * 0.45, 4.6 + s * 2.4 + py, pz + 7.5 + s * 3.4), 1 - Math.exp(-6 * dt));
    camLook.set(player.x * 0.3, 1 + s * 0.4 + py, pz - 9);
  }
  camera.position.copy(camPos).add(fx.shakeOffset);
  camera.lookAt(camLook);

  quality.update(dt);
  world.update(dt, time, pz);
  fx.update(dt);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

loadLevel();
showMenu();
requestAnimationFrame(frame);

// handy for debugging in the console
window.__gloop = {
  save, player,
  get level() { return level; },
  get state() { return state; },
  persist() { writeSave(save); },                                   // save after editing __gloop.save
  goto(n) { save.level = Math.max(1, n | 0); writeSave(save); loadLevel(); showMenu(); }, // jump to a level
};
