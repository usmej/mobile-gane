import * as THREE from 'three';
import { CONFIG, speedForLevel } from './config.js';
import { generateLevel, applyOp, isGoodOp, worldLabel } from './levels.js';
import { World } from './world.js';
import { Player } from './player.js';
import { Entities } from './entities.js';
import { FX } from './fx.js';
import { UI } from './ui.js';
import { audio } from './audio.js';
import { haptics } from './haptics.js';
import { SKINS, canUnlockSkin, getSkin, makeSkinMaterial } from './skins.js';
import { loadSave, writeSave, resetSave } from './save.js';
import { claim } from './daily.js';
import { BADGES, track } from './achievements.js';
import { addRun, topRuns } from './records.js';
import { pickMeme } from './memes.js';
import { Finale } from './finale.js';
import { AutoQuality } from './quality.js';
import { Trail } from './trail.js';
import { Tutorial } from './tutorial.js';
import { BossFight } from './bossfight.js';

// ---------- setup ----------
// Test links for human playtesters (no console needed on a phone):
//   ?reset      → wipe progress and start fresh
//   ?level=12   → jump straight to level 12
const params = new URLSearchParams(location.search);
if (params.has('reset')) resetSave();
const save = loadSave();
// FB-002: everyone owns the drum mascot. Existing saves keep the skin they already had equipped.
if (!save.ownedSkins.includes('drum')) { save.ownedSkins.unshift('drum'); writeSave(save); }
if (params.has('level')) {
  const n = parseInt(params.get('level'), 10);
  if (n >= 1) { save.level = n; writeSave(save); }
}
if (params.has('reset') || params.has('level')) history.replaceState(null, '', location.pathname);
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
player.setSkin(getSkin(save.skin), makeSkinMaterial(getSkin(save.skin)));
const fxEl = document.getElementById('fx');
const fx = new FX(scene, camera, fxEl);
const tutorial = new Tutorial(fxEl);
const bossFight = new BossFight(fxEl, camera);
let firstTutorialGate;
const tutorialPoint = new THREE.Vector3();

function tutorialScreenPoint(x, y, z) {
  const p = tutorialPoint.set(x, y, z).project(camera);
  if (p.z < -1 || p.z > 1) return null;
  return { x: (p.x + 1) * fxEl.clientWidth / 2, y: (1 - p.y) * fxEl.clientHeight / 2 };
}
const finale = new Finale(scene);
const trail = new Trail(scene);
trail.setColor(getSkin(save.skin).color);
audio.setEnabled(save.sound);
haptics.enabled = save.sound;

let state = 'menu';   // menu | playing | boss | fight | finale | ending | result
let finaleMult = 1;
let level = null;
let runCoins = 0;
let runTookHit = false;
let combo = 0;
let jumpElapsed = null;
let magnetTime = 0;
let runGems = 0;
let endTimer = 0;
let endResult = null;
let time = 0;

const ui = new UI(document.getElementById('ui'), {
  onPlay: () => { audio.unlock(); audio.play('click'); startRun(); },
  onNext: () => { audio.play('click'); loadLevel(); showMenu(); },
  onRetry: () => { audio.play('click'); startRun(); },
  onJump: () => startManualJump(),
  onOpenShop: () => { audio.unlock(); audio.play('click'); ui.showShop(save, SKINS); },
  onCloseShop: () => { audio.play('click'); showMenu(); },
  onOpenBadges: () => { audio.play('click'); ui.showBadges(save, BADGES); },
  onCloseBadges: () => { audio.play('click'); showMenu(); },
  onOpenRecords: () => { audio.play('click'); ui.showRecords(topRuns(save)); },
  onCloseRecords: () => { audio.play('click'); showMenu(); },
  onClaimDaily: () => {
    const { coins, gems } = claim(save);
    if (coins) {
      const reward = `Daily reward: +${coins} coins${gems ? ` and +${gems} gems` : ''}`;
      recordBadgeEvent({ type: 'daily' }, reward);
    }
    showMenu();
  },
  onBuySkin: (id) => buySkin(id),
  onEquipSkin: (id) => equipSkin(id),
  onToggleSound: (on) => {
    audio.unlock();
    save.sound = typeof on === 'boolean' ? on : !save.sound;
    audio.setEnabled(save.sound);
    haptics.enabled = save.sound;
    writeSave(save);
  },
});

function recordBadgeEvent(event, message) {
  const unlocked = track(save, event);
  // Only hit localStorage when a badge unlocks; counters are saved with the run at finishRun().
  if (unlocked.length) writeSave(save);
  const messages = [message, ...unlocked.map(({ name }) => 'BADGE: ' + name)].filter(Boolean);
  if (messages.length) ui.toast(messages.join(' · '));
}

// ---------- flow ----------
function loadLevel() {
  bossFight.stop();
  level = generateLevel(save.level);
  world.build(level);
  entities.build(level);
  finale.build(level);
  player.reset();
  jumpElapsed = null;
  magnetTime = 0;
  player.group.visible = true;
  fx.clear();
  trail.clear();
  runCoins = 0;
  runGems = 0;
}

function showMenu() {
  bossFight.stop();
  tutorial.stop();
  state = 'menu';
  player.label.visible = false;
  ui.showMenu(save);
}

function startManualJump() {
  if (state !== 'playing' || save.level < CONFIG.timedJump.firstLevel || jumpElapsed !== null) return;
  jumpElapsed = 0;
}

function startRun() {
  bossFight.stop();
  if (state === 'result') loadLevel();
  combo = 0;
  runTookHit = false;
  state = 'playing';
  player.label.visible = true;
  ui.showHUD(save, !(save.level === 1 && !save.tutorialDone));
  ui.showJumpButton(save.level >= CONFIG.timedJump.firstLevel);
  if (save.level === CONFIG.timedJump.firstLevel) ui.cue('Jump over the striped barriers');
  if (save.level === 1 && !save.tutorialDone) {
    firstTutorialGate = level.items.find((item) => item.type === 'gate');
    tutorial.start();
  } else {
    tutorial.stop();
  }
  audio.startMusic(save.level);
  fx.popText(pickMeme('start') || 'GO', player.position.clone().setY(5), '#FFF4E0', 1.2);
}

// Boss beaten: blow it up, then climb the bonus stairs.
function defeatBoss() {
  const b = entities.boss;
  b.dead = true;
  b.group.visible = false;
  fx.burst(b.group.position.clone().setY(b.size), '#e0245e', 60);
  fx.burst(b.group.position.clone().setY(b.size * 1.5), '#ffd23f', 40);
  fx.popText(pickMeme('win') || 'W', b.group.position.clone().setY(b.size * 2), '#4EE06A', 1.6);
  fx.shake(0.6);
  audio.play('smash');
  const massBonus = Math.min(CONFIG.finaleMaxMassBonus, (save.level - 1) * CONFIG.finaleMassPerLevel);
  if (massBonus > 0) {
    player.setMass(player.mass + massBonus);
    ui.toast(`BOSS BONUS: +${massBonus} MASS`);
  }
  finaleMult = finale.start(player);
  state = 'finale';
  if (!save.defeatedBossSkins.includes(b.skinId)) {
    save.defeatedBossSkins.push(b.skinId);
    writeSave(save);
    ui.toast(`${getSkin(b.skinId).name} is now available in Skins`);
  }
}

function setHudVisible(v) {
  const hud = ui.hud?.level?.closest('.hud');
  if (hud) hud.style.visibility = v ? '' : 'hidden';
}

const fightPoint = new THREE.Vector3();
function beginBossFight(b) {
  state = 'fight';
  ui.showJumpButton(false);
  setHudVisible(false);
  player.targetX = -CONFIG.trackHalfWidth * 0.6; // step aside so the boss is in clear view
  const canWin = player.mass >= b.hp;
  bossFight.start({
    bossGroup: b.group,
    bossBody: b.body,
    bossSize: b.size,
    canWin,
    onHit: (x, y) => {
      // screen point -> a spot in front of the boss for the burst
      const w = fxEl.clientWidth || 1, h = fxEl.clientHeight || 1;
      fightPoint.set((x / w) * 2 - 1, 1 - (y / h) * 2, 0.5).unproject(camera);
      fightPoint.sub(camera.position).normalize().multiplyScalar(camera.position.distanceTo(b.group.position) * 0.85).add(camera.position);
      fx.burst(fightPoint.clone(), canWin ? '#FFD23F' : '#FFF4E0', canWin ? 14 : 6);
      audio.play(canWin ? 'hit' : 'click');
      fx.shake(canWin ? 0.15 : 0.05);
      haptics.buzz(canWin ? 15 : 8);
    },
    onEnd: (res) => {
      if (state !== 'fight') return;
      if (res.won) {
        const bonus = Math.round(player.mass * CONFIG.bossFight.perfectBonusRatio * (res.hitRatio || 0));
        setHudVisible(true);
        if (bonus > 0) {
          player.setMass(player.mass + bonus);
          fx.popText(`+${bonus} BONUS`, player.position.clone().setY(player.y + 4), '#4EE06A', 1.2);
        }
        defeatBoss();
      } else {
        lose(`Boss had ${b.hp}. You had ${player.mass}.`);
      }
    },
  });
}

function finishRun(won) {
  bossFight.stop();
  tutorial.stop();
  state = 'ending';
  audio.stopMusic();
  endTimer = won ? 1.0 : 1.2;
  if (won) {
    const mult = Math.min(CONFIG.maxMultiplier, finaleMult);
    const coinsEarned = (runCoins + CONFIG.winBaseCoins + save.level * CONFIG.winCoinsPerLevel) * mult;
    const gemsEarned = runGems + (save.level % CONFIG.gemEveryNLevels === 0 ? 2 : 0);
    const bestRank = addRun(save, { level: save.level, coinsEarned, multiplier: mult, date: new Date().toISOString() });
    endResult = { won, level: save.level, coinsEarned, gemsEarned, multiplier: mult, bestRank, winner: getSkin(save.skin).name.toUpperCase() };
    save.coins += coinsEarned;
    save.gems += gemsEarned;
    save.level += 1;
    save.best = Math.max(save.best, save.level);
    recordBadgeEvent({ type: 'win', multiplier: mult, clean: !runTookHit });
    fx.burst(player.position.clone().setY(player.y + 2), '#ffd23f', 50);
    audio.play('win');
    haptics.buzz([20, 20, 20, 20, 60]);
  } else {
    // keep what you picked up — losing shouldn't feel like a total L
    save.coins += runCoins;
    save.gems += runGems;
    endResult = { won, level: save.level, reason: lossReason, progress: Math.min(1, player.d / Math.max(1, level.length)) };
    player.group.visible = false;
    fx.burst(player.position.clone().setY(1), getSkin(save.skin).color, 50);
    fx.popText(pickMeme('lose') || 'L', player.position.clone().setY(2.5), '#FF3B5C', 1.6);
    fx.shake(0.5);
    audio.play('lose');
    haptics.buzz([80, 40, 120]);
  }
  writeSave(save);
}

let lossReason = '';
function lose(reason) {
  if (state !== 'playing' && state !== 'boss' && state !== 'fight') return;
  lossReason = reason;
  finishRun(false);
}

function buySkin(id) {
  const skin = getSkin(id);
  if (skin.id !== id) return;
  if (save.ownedSkins.includes(id)) return equipSkin(id);
  if (!canUnlockSkin(save, skin)) {
    ui.toast(`Defeat ${skin.name} first`);
    return;
  }
  const wallet = skin.currency === 'gems' ? 'gems' : 'coins';
  if (save[wallet] < skin.price) { ui.toast('Not enough ' + wallet); return; }
  save[wallet] -= skin.price;
  save.ownedSkins.push(id);
  audio.play('buy');
  recordBadgeEvent({ type: 'skin' }, `${skin.name} unlocked`);
  equipSkin(id);
}

function equipSkin(id) {
  if (!save.ownedSkins.includes(id)) return;
  save.skin = id;
  player.setSkin(getSkin(id), makeSkinMaterial(getSkin(id)));
  trail.setColor(getSkin(id).color);
  writeSave(save);
  audio.play('click');
  ui.showShop(save, SKINS);
}

// ---------- input: drag anywhere to steer ----------
// One finger steers at a time. Extra fingers are tracked so that if the steering
// finger lifts, another finger still on the screen takes over without a jump.
const pointers = new Map();   // pointerId -> last clientX
let steerId = null;
window.addEventListener('pointerdown', (e) => {
  pointers.set(e.pointerId, e.clientX);
  if (steerId === null) steerId = e.pointerId;
});
window.addEventListener('pointermove', (e) => {
  if (!pointers.has(e.pointerId)) return;
  const prev = pointers.get(e.pointerId);
  pointers.set(e.pointerId, e.clientX);
  if (e.pointerId !== steerId) return;
  const dx = e.clientX - prev;
  if (state === 'playing') {
    tutorial.addDrag(dx);
    player.steer(dx * (390 / Math.max(320, Math.min(window.innerWidth, 700))));
  }
});
const endDrag = (e) => {
  pointers.delete(e.pointerId);
  if (e.pointerId === steerId) steerId = pointers.size ? pointers.keys().next().value : null;
};
window.addEventListener('pointerup', endDrag);
window.addEventListener('pointercancel', endDrag);

// Pause music while the tab is hidden (the game loop already stops), resume on return.
document.addEventListener('visibilitychange', () => {
  if (document.hidden) audio.stopMusic();
  else if (state === 'playing' || state === 'boss' || state === 'finale') audio.startMusic(save.level);
});
window.addEventListener('keydown', (e) => {
  if (state !== 'playing') return;
  if (e.code === 'Space' && save.level >= CONFIG.timedJump.firstLevel && !e.target?.closest?.('button')) {
    e.preventDefault();
    if (!e.repeat) startManualJump();
    return;
  }
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    tutorial.addDrag(-40);
    player.steer(-40);
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    tutorial.addDrag(40);
    player.steer(40);
  }
});

// ---------- events from entities ----------
// The number pops big; a meme word follows separately, but only now and then
// (every 3rd event, or always on a big swing) so it doesn't spam the screen.
const C = { good: '#1FA2FF', bad: '#FF3B5C', green: '#4EE06A', coin: '#FFD23F', gem: '#B04BFF', cream: '#FFF4E0' };
let memeTick = 0;
function pop(numberText, pos, color, memeCat, big = false) {
  fx.popText(numberText, pos, color, 1.1);
  memeTick++;
  if (!memeCat || !(big || memeTick % 3 === 0)) return;
  const word = pickMeme(memeCat);
  if (!word) return;
  const p = pos.clone(); p.y += 1.3;
  setTimeout(() => fx.popText(word, p, color, 0.7), 120);
}

function handleEvent(ev) {
  switch (ev.type) {
    case 'magnet':
      magnetTime = CONFIG.magnet.duration;
      break;
    case 'pad':
      if (state === 'playing' && jumpElapsed === null) {
        jumpElapsed = 0;
        recordBadgeEvent({ type: 'pad' });
      }
      break;
    case 'gate': {
      const before = player.mass;
      player.setMass(applyOp(before, ev.op, ev.value));
      if (player.mass < before) runTookHit = true;
      pop(`${ev.op}${ev.value}`, ev.pos, ev.good ? C.good : C.bad, ev.good ? 'gateGood' : 'gateBad', ev.op === 'x' || ev.op === '÷' || ev.value >= 10);
      fx.burst(ev.pos, ev.good ? '#2fa8ff' : '#ff3b5c', 20);
      audio.play(ev.good ? 'gateGood' : 'gateBad');
      combo = ev.good ? combo + 1 : 0;
      if (combo >= 2) {
        player.setMass(player.mass + combo * CONFIG.comboBonusMass);
        const comboPos = ev.pos.clone().setY(ev.pos.y + 2);
        fx.popText(`COMBO x${combo}`, comboPos, '#FFD23F', 0.9);
        if (combo === 3 || combo === 5) audio.play('gem');
        if (combo === 5) recordBadgeEvent({ type: 'combo', count: combo });
      }
      if (!ev.good) fx.shake(0.25);
      if (!ev.good) haptics.buzz(40);
      if (player.mass <= 0) lose('Divided into nothing.');
      break;
    }
    case 'food':
      if (!ev.good) runTookHit = true;
      player.setMass(player.mass + (ev.good ? ev.value : -ev.value));
      pop(`${ev.good ? '+' : '-'}${ev.value}`, ev.pos, ev.good ? C.green : C.bad, ev.good ? 'foodGood' : 'foodBad');
      fx.burst(ev.pos, ev.good ? '#3fd64f' : '#8a4b1e', 10);
      audio.play(ev.good ? 'foodGood' : 'foodBad');
      if (player.mass <= 0) lose('Ate too much mold.');
      break;
    case 'coin':
      runCoins += 1;
      recordBadgeEvent({ type: 'coin' });
      audio.play('coin');
      fx.burst(ev.pos, '#ffd23f', 6);
      break;
    case 'gem':
      runGems += 1;
      audio.play('gem');
      fx.burst(ev.pos, '#b04bff', 18);
      pop('+1 GEM', ev.pos, C.gem, 'gem', true);
      break;
    case 'barrier':
    case 'saw':
      runTookHit = true;
      player.setMass(player.mass - ev.damage);
      pop(`-${ev.damage}`, ev.pos, C.bad, 'hit', ev.damage >= 10);
      fx.burst(ev.pos, getSkin(save.skin).color, 14);
      trail.splat(player.position, getSkin(save.skin).color, player.scale);
      fx.shake(0.35);
      audio.play('hit');
      haptics.buzz([30, 30, 30]);
      if (player.mass <= 0) lose(ev.type === 'barrier' ? 'Missed the jump.' : 'Sawed in half.');
      break;
    case 'wall':
      runTookHit = true;
      if (player.mass > ev.value) {
        recordBadgeEvent({ type: 'wall' });
        player.setMass(player.mass - ev.value);
        entities.smashWall(ev.wall);
        fx.burst(ev.pos, '#8a8fa8', 30);
        pop(`SMASH -${ev.value}`, ev.pos, C.coin);
        fx.shake(0.45);
        audio.play('smash');
        haptics.buzz(60);
      } else {
        player.setMass(0);
        audio.play('hit');
        lose(`Too small for the ${ev.value} wall.`);
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
const magnetStyle = document.createElement('style');
magnetStyle.textContent = '.hud[data-magnet]::after { content: "MAGNET"; position: absolute; top: 4.5rem; left: 50%; transform: translateX(-50%); color: var(--ink); background: var(--yellow); border: 3px solid var(--ink); border-radius: 6px; padding: 4px 8px; font: 14px var(--font); }';
document.head.appendChild(magnetStyle);
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
      ui.showJumpButton(false);
      tutorial.stop();
      if (jumpElapsed !== null) {
        jumpElapsed = null;
        player.y = 0;
      }
      player.targetX = 0;
      audio.play('boss');
      const boss = entities.boss;
      fx.popText(pickMeme('boss') || 'BOSS', (anchor) => {
        boss.banner.getWorldPosition(anchor);
        anchor.y += Math.max(1, boss.size * 0.5);
      }, '#FF3B5C', 1.3);
    }
    if (state === 'boss') {
      player.targetX = 0;
      const b = entities.boss;
      if (player.d >= b.d - b.size - player.radius * 0.6) {
        player.d = b.d - b.size - player.radius * 0.6;
        beginBossFight(b);
      }
    }
  }

  if (state === 'finale') {
    const { stepped, done } = finale.update(dt);
    if (stepped) {
      const pos = finale.stepPosition(stepped);
      fx.popText(`x${stepped}`, pos, stepped >= 8 ? '#FFD23F' : '#FFF4E0', 1 + stepped * 0.05);
      fx.burst(pos, finale.steps[stepped - 1].color, 12);
      audio.play(stepped === finaleMult ? 'gem' : 'coin');
    }
    ui.updateHUD({ mass: player.mass });
    if (done) finishRun(true);
  }

  if (jumpElapsed !== null) {
    const jump = CONFIG.jumpPad;
    jumpElapsed += dt;
    if (state !== 'playing' || jumpElapsed >= jump.duration) {
      jumpElapsed = null;
      player.y = 0;
      if (state === 'playing') player.squash = jump.landingSquash;
    } else {
      const progress = jumpElapsed / jump.duration;
      player.y = 4 * jump.peak * progress * (1 - progress);
    }
  }

  player.update(dt);
  trail.update(dt, player, (state === 'playing' || state === 'boss') && player.y < 0.05);
  const canUseMagnet = state === 'playing' || state === 'boss';
  magnetTime = canUseMagnet ? Math.max(0, magnetTime - dt) : 0;
  const events = entities.update(dt, time, player, prevD, magnetTime > 0);
  if (state === 'playing' || state === 'boss') {
    for (const ev of events) {
      handleEvent(ev);
      if (state !== 'playing' && state !== 'boss') break;
    }
    ui.updateHUD({
      level: save.level,
      worldLabel: worldLabel(save.level),
      mass: player.mass,
      coins: save.coins + runCoins,
      gems: save.gems + runGems,
      progress: Math.min(1, player.d / level.length),
    });
    const hud = ui.hud?.level?.closest('.hud');
    if (hud) hud.toggleAttribute('data-magnet', magnetTime > 0);
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
  } else if (state === 'fight' && entities.boss) {
    const b = entities.boss;
    // Hero steps aside (see beginBossFight); camera swings right and up to frame the boss over the hero.
    camPos.lerp(new THREE.Vector3(2.4 + s * 0.6, 3.2 + b.size * 1.1, pz + 3 + s * 1.6 + b.size * 1.2), 1 - Math.exp(-3 * dt));
    camLook.lerp(new THREE.Vector3(0.6, b.size * 0.9, -b.d), 1 - Math.exp(-4 * dt));
  } else {
    const py = player.y;
    camPos.lerp(new THREE.Vector3(player.x * 0.45, 4.6 + s * 2.4 + py, pz + 7.5 + s * 3.4), 1 - Math.exp(-6 * dt));
    camLook.set(player.x * 0.3, 1 + s * 0.4 + py, pz - 9);
  }
  camera.position.copy(camPos).add(fx.shakeOffset);
  camera.lookAt(camLook);
  if (state === 'fight') bossFight.update(dt);

  quality.update(dt);
  world.update(dt, time, pz);
  fx.update(dt);
  if (state === 'playing' && tutorial.phase !== 'idle') {
    camera.updateMatrixWorld();
    const playerPoint = tutorialScreenPoint(player.x, player.y, pz);
    const gate = firstTutorialGate;
    const side = gate && isGoodOp(gate.left.op) ? -1 : 1;
    const nextGate = gate && {
      passed: player.d >= gate.d,
      screen: tutorialScreenPoint(side * CONFIG.trackHalfWidth / 2, 2.55, -gate.d),
    };
    if (tutorial.update(dt, playerPoint, nextGate)) {
      save.tutorialDone = true;
      writeSave(save);
    }
  }
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}

loadLevel();
showMenu();
recordBadgeEvent({ type: 'sync' });
requestAnimationFrame(frame);

// handy for debugging in the console
window.__gloop = {
  save, player, entities, ui,
  get level() { return level; },
  get state() { return state; },
  persist() { writeSave(save); },                                   // save after editing __gloop.save
  goto(n) { save.level = Math.max(1, n | 0); writeSave(save); loadLevel(); showMenu(); }, // jump to a level
};
