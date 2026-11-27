import * as THREE from 'three';
import { CONFIG } from './config.js';

// Boss fight mini-game: tap the glowing weak spots on the boss.
// canWin === true  -> every hit hurts; the fight can only end in a win (taps just change the bonus).
// canWin === false -> hits do nothing; after loseDuration the fight ends in a loss.
const END_PAUSE = 0.8;   // seconds the verdict ("PERFECT!") stays up before onEnd fires

export class BossFight {
  constructor(overlayEl, camera) {
    this.overlay = overlayEl;
    this.camera = camera;
    this.root = null;
    this._active = false;
    this.spots = [];
    this._box = new THREE.Box3();
    this._v = new THREE.Vector3();
    this._onKey = (e) => {
      if (!this._active || (e.code !== 'Space' && e.code !== 'Enter') || e.repeat) return;
      e.preventDefault();
      const oldest = this.spots.reduce((a, s) => (!a || s.age > a.age ? s : a), null);
      if (oldest) this._hit(oldest);
    };
  }

  get active() { return this._active; }

  start({ bossGroup, bossBody, bossSize, canWin, onHit, onEnd }) {
    this.stop();
    const C = CONFIG.bossFight;
    this.cfg = C;
    this.bossGroup = bossGroup;
    this.bossBody = bossBody || bossGroup;
    this.bossSize = bossSize || 1;
    this.canWin = !!canWin;
    this.onHit = onHit;
    this.onEnd = onEnd;
    this.fightHp = C.fightHp;
    this.dealt = 0;
    this.time = 0;
    this.total = this.canWin ? C.duration : C.loseDuration;
    this.verdict = null;       // set once the fight is decided
    this.verdictTimer = 0;
    this.result = null;
    this.wobble = 0;
    this._active = true;

    const root = document.createElement('div');
    root.className = 'bf-root';
    root.innerHTML = `
      <div class="bf-bar">
        <div class="bf-head"><div class="bf-title">TAP THE WEAK SPOTS!</div><div class="bf-count" aria-label="seconds left"></div></div>
        <div class="bf-hp"><div class="bf-hp-fill"></div></div>
      </div>`;
    this.overlay.appendChild(root);
    this.root = root;
    this.titleEl = root.querySelector('.bf-title');
    this.hpEl = root.querySelector('.bf-hp');
    this.hpFill = root.querySelector('.bf-hp-fill');
    this.countEl = root.querySelector('.bf-count');   // countdown number replaces the old unlabeled time bar

    this.spots = [];
    for (let i = 0; i < Math.max(1, C.spotsAtOnce); i++) this._spawn();
    window.addEventListener('keydown', this._onKey, true);
  }

  stop() {
    this._active = false;
    window.removeEventListener('keydown', this._onKey, true);
    if (this.root) this.root.remove();
    this.root = null;
    this.spots = [];
    this.onHit = null;
    this.onEnd = null;
  }

  _spawn(reuse) {
    const el = reuse?.el || document.createElement('button');
    const spot = reuse || { el, age: 0, x: 0, y: 0, wx: 0, wy: 0, wz: 0 };
    if (!reuse) {
      el.type = 'button';
      el.tabIndex = -1;
      el.className = 'bf-spot';
      el.setAttribute('aria-label', 'Weak spot');
      el.innerHTML = '<span class="bf-spot-core"></span>';
      const size = Math.max(64, this.cfg.minSpotPx);
      el.style.width = el.style.height = size + 'px';
      el.addEventListener('pointerdown', (e) => {
        e.stopPropagation();   // never becomes the steering finger
        e.preventDefault();
        if (this._active) this._hit(spot);
      });
      this.root.appendChild(el);
    }
    spot.age = 0;
    this._place(spot);
    // restart the pop-in animation
    const core = el.firstElementChild;
    core.classList.remove('bf-pop');
    void core.offsetWidth;
    core.classList.add('bf-pop');
    if (!reuse) this.spots.push(spot);
    return spot;
  }

  // Pick a random point on the front/upper part of the boss's bounding box (world space).
  _place(spot) {
    const box = this._box.setFromObject(this.bossBody);
    const w = this.root.clientWidth || window.innerWidth;
    const h = this.root.clientHeight || window.innerHeight;
    const half = Math.max(64, this.cfg.minSpotPx) / 2;
    let best = null;
    for (let tries = 0; tries < 12; tries++) {
      const wx = box.min.x + (box.max.x - box.min.x) * (0.2 + Math.random() * 0.6);
      const wy = box.min.y + (box.max.y - box.min.y) * (0.2 + Math.random() * 0.65);
      const wz = box.max.z;
      const p = this._project(wx, wy, wz, w, h, half);
      const clear = this.spots.every((o) => o === spot || Math.hypot(o.x - p.x, o.y - p.y) > half * 2.4);
      best = { wx, wy, wz };
      if (clear) break;
    }
    Object.assign(spot, best);
    this._moveEl(spot, w, h, half);
  }

  _project(wx, wy, wz, w, h, half) {
    const v = this._v.set(wx, wy, wz).project(this.camera);
    const behind = v.z > 1 || v.z < -1;
    let x = behind ? w / 2 : (v.x + 1) * w / 2;
    let y = behind ? h * 0.5 : (1 - v.y) * h / 2;
    const top = 120 + half;   // keep clear of the fight bar
    x = Math.min(w - half - 6, Math.max(half + 6, x));
    y = Math.min(h - half - 90, Math.max(top, y));
    return { x, y };
  }

  _moveEl(spot, w, h, half) {
    const p = this._project(spot.wx, spot.wy, spot.wz, w, h, half);
    spot.x = p.x;
    spot.y = p.y;
    spot.el.style.transform = `translate(${(p.x - half).toFixed(1)}px, ${(p.y - half).toFixed(1)}px)`;
  }

  _hit(spot) {
    if (this.verdict) return;
    const C = this.cfg;
    if (this.onHit) this.onHit(spot.x, spot.y);
    if (this.canWin) {
      const dmg = Math.min(C.damagePerHit, this.fightHp);
      this.fightHp -= dmg;
      this.dealt += dmg;
      this._wobbleBar();
      if (this.fightHp <= 0) {
        this.fightHp = 0;
        this._decide('PERFECT!', true);
      }
    } else {
      this.titleEl.textContent = 'TOO SMALL!';
      this.titleEl.classList.add('bf-bad');
      this.hpEl.classList.remove('bf-shake');
      void this.hpEl.offsetWidth;
      this.hpEl.classList.add('bf-shake');
    }
    this._spawn(spot);   // the struck spot jumps elsewhere
  }

  _wobbleBar() {
    this.hpEl.classList.remove('bf-shake');
    void this.hpEl.offsetWidth;
    this.hpEl.classList.add('bf-shake');
  }

  _decide(text, won) {
    this.verdict = text;
    this.verdictTimer = END_PAUSE;
    this.titleEl.textContent = text;
    this.titleEl.classList.toggle('bf-good', won);
    this.titleEl.classList.toggle('bf-bad', !won);
    this.root.classList.add('bf-done');
    this.countEl.textContent = '';
    const total = this.cfg.fightHp;
    this.result = won
      ? { won: true, hitRatio: Math.max(0, Math.min(1, this.dealt / total)), perfect: this.fightHp <= 0 }
      : { won: false };
    this.result.hitRatio = won ? this.result.hitRatio : 0;
  }

  update(dt) {
    if (!this._active) return;
    if (this.verdict) {
      this.verdictTimer -= dt;
      this._track();
      if (this.verdictTimer <= 0) {
        const cb = this.onEnd;
        const res = this.result;
        this.stop();
        if (cb) cb(res);
      }
      return;
    }
    this.time += dt;
    const left = Math.max(0, Math.ceil(this.total - this.time));
    if (this.countEl.textContent !== String(left)) this.countEl.textContent = String(left);
    this.hpFill.style.transform = `scaleX(${(this.fightHp / this.cfg.fightHp).toFixed(3)})`;
    for (const s of this.spots) {
      s.age += dt;
      if (s.age >= this.cfg.spotLife) this._spawn(s);
    }
    this._track();
    if (this.time >= this.total) {
      if (this.canWin) this._decide('FINISHING BLOW!', true);
      else this._decide('TOO SMALL!', false);
    }
  }

  // Keep the spots glued to the moving boss.
  _track() {
    if (!this.root) return;
    this.camera.updateMatrixWorld();
    const w = this.root.clientWidth || window.innerWidth;
    const h = this.root.clientHeight || window.innerHeight;
    const half = Math.max(64, this.cfg.minSpotPx) / 2;
    const box = this._box.setFromObject(this.bossBody);
    for (const s of this.spots) {
      // follow the body: keep the spot at the same relative height/width on the box
      s.wz = box.max.z;
      this._moveEl(s, w, h, half);
    }
    if (this.hpFill) this.hpFill.style.transform = `scaleX(${(this.fightHp / this.cfg.fightHp).toFixed(3)})`;
  }
}
