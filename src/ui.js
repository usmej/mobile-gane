// DOM UI: menu, HUD, shop, win/lose screens, toasts.
import { skinSwatchCSS } from './skins.js';
import { pickMeme } from './memes.js';

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const fmt = (n) => Math.round(Number(n) || 0).toLocaleString('en-US');

export class UI {
  constructor(rootEl, handlers = {}) {
    this.root = rootEl;
    this.h = handlers;
    this.hud = null;
    this.hintTimer = 0;
    this.countRaf = 0;
    this.toastTimer = 0;
    this.sound = true;

    this.root.classList.add('ui-root');
    this.root.innerHTML = '';
    this.screen = document.createElement('div');
    this.screen.className = 'screen-host';
    this.toastBox = document.createElement('div');
    this.toastBox.className = 'toast-host';
    this.root.append(this.screen, this.toastBox);
  }

  // ---------- helpers ----------
  _call(name, ...args) {
    try { const f = this.h && this.h[name]; if (typeof f === 'function') return f(...args); } catch (e) { console.error(e); }
  }

  _reset() {
    cancelAnimationFrame(this.countRaf);
    clearTimeout(this.hintTimer);
    this.hud = null;
    this.screen.innerHTML = '';
  }

  _mount(className, html) {
    this._reset();
    const el = document.createElement('div');
    el.className = className;
    el.innerHTML = html;
    this.screen.appendChild(el);
    return el;
  }

  _on(el, sel, handler) {
    const b = el.querySelector(sel);
    if (b) b.addEventListener('click', handler);
    return b;
  }

  _currencyBar(save) {
    return `<div class="cur-bar">
      <div class="chip chip-coin"><span class="chip-ico">🪙</span><b data-k="coins">${fmt(save.coins)}</b></div>
      <div class="chip chip-gem"><span class="chip-ico">💎</span><b data-k="gems">${fmt(save.gems)}</b></div>
    </div>`;
  }

  // ---------- menu ----------
  showMenu(save) {
    this.sound = save.sound !== false;
    const el = this._mount('panel-layer menu', `
      <div class="menu-top">${this._currencyBar(save)}
        <button class="btn btn-round btn-sound" aria-label="Toggle sound">${this.sound ? '🔊' : '🔇'}</button>
      </div>
      <div class="menu-mid">
        <h1 class="title" aria-label="Gloop Rush">
          <span class="t-line t1">${[...'GLOOP'].map((c, i) => `<i style="--i:${i}">${c}</i>`).join('')}</span>
          <span class="t-line t2">${[...'RUSH'].map((c, i) => `<i style="--i:${i + 5}">${c}</i>`).join('')}</span>
        </h1>
        <div class="level-badge">LEVEL ${save.level}</div>
      </div>
      <div class="menu-bottom">
        <button class="btn btn-play">TAP TO PLAY</button>
        <button class="btn btn-shop btn-md">🛍️ SHOP</button>
      </div>`);
    this._on(el, '.btn-play', () => this._call('onPlay'));
    this._on(el, '.btn-shop', () => this._call('onOpenShop'));
    const snd = this._on(el, '.btn-sound', () => {
      this.sound = !this.sound;
      snd.textContent = this.sound ? '🔊' : '🔇';
      this._call('onToggleSound', this.sound);
    });
  }

  // ---------- HUD ----------
  showHUD(save) {
    const el = this._mount('hud', `
      <div class="hud-top">
        <div class="chip chip-coin hud-coins"><span class="chip-ico">🪙</span><b data-k="coins">0</b></div>
        <div class="hud-mid">
          <div class="level-pill">LEVEL <b data-k="level">${save.level}</b></div>
          <div class="prog"><div class="prog-fill" data-k="fill"></div><span class="prog-boss">👹</span></div>
        </div>
        <div class="chip chip-gem hud-gems" data-k="gemchip"><span class="chip-ico">💎</span><b data-k="gems">0</b></div>
      </div>
      <div class="hint">👆 drag to steer</div>`);
    const q = (k) => el.querySelector(`[data-k="${k}"]`);
    this.hud = {
      level: q('level'), coins: q('coins'), gems: q('gems'), gemchip: q('gemchip'), fill: q('fill'),
      hint: el.querySelector('.hint'),
      last: { level: null, coins: null, gems: null, progress: -1 },
    };
    this.hud.gemchip.style.display = 'none';
    this.hintTimer = setTimeout(() => this.hud && this.hud.hint.classList.add('hide'), 3000);
  }

  updateHUD({ level, mass, coins, gems, progress } = {}) {
    const h = this.hud;
    if (!h) return;
    const l = h.last;
    if (level !== undefined && level !== l.level) { l.level = level; h.level.textContent = level; }
    if (coins !== undefined && coins !== l.coins) {
      if (l.coins !== null) { h.coins.parentNode.classList.remove('bump'); void h.coins.parentNode.offsetWidth; h.coins.parentNode.classList.add('bump'); }
      l.coins = coins; h.coins.textContent = fmt(coins);
    }
    if (gems !== undefined && gems !== l.gems) {
      l.gems = gems; h.gems.textContent = fmt(gems);
      h.gemchip.style.display = gems > 0 ? '' : 'none';
    }
    if (progress !== undefined) {
      const p = Math.max(0, Math.min(1, Number(progress) || 0));
      const pc = Math.round(p * 1000) / 10;
      if (pc !== l.progress) { l.progress = pc; h.fill.style.width = pc + '%'; }
    }
  }

  // ---------- win ----------
  showWin({ level, coinsEarned = 0, gemsEarned = 0, multiplier = 1 } = {}) {
    const el = this._mount('panel-layer result win', `
      <div class="card card-win">
        <div class="res-head">LEVEL ${level} CLEARED</div>
        <div class="meme meme-win">${esc(pickMeme('win'))}</div>
        <div class="earn-row">
          <div class="earn-coins"><span class="chip-ico big">🪙</span><b class="count" data-k="coins">0</b></div>
          <div class="mult-badge">x${multiplier}</div>
        </div>
        ${gemsEarned > 0 ? `<div class="earn-gems"><span class="chip-ico">💎</span><b class="count" data-k="gems">0</b></div>` : ''}
        <button class="btn btn-next">NEXT ▶</button>
      </div>`);
    this._on(el, '.btn-next', () => this._call('onNext'));
    const cEl = el.querySelector('[data-k="coins"]');
    const gEl = el.querySelector('[data-k="gems"]');
    const t0 = performance.now();
    const dur = 1300;
    const step = (now) => {
      const t = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - t, 3);
      cEl.textContent = fmt(coinsEarned * e);
      if (gEl) gEl.textContent = fmt(gemsEarned * e);
      if (t < 1) this.countRaf = requestAnimationFrame(step);
    };
    this.countRaf = requestAnimationFrame(step);
  }

  // ---------- lose ----------
  showLose({ level, reason = '' } = {}) {
    const el = this._mount('panel-layer result lose', `
      <div class="card card-lose">
        <div class="res-head lose-head">LEVEL ${level} FAILED</div>
        <div class="meme meme-lose">${esc(pickMeme('lose'))}</div>
        ${reason ? `<div class="reason">${esc(reason)}</div>` : ''}
        <button class="btn btn-retry">RETRY ↻</button>
      </div>`);
    this._on(el, '.btn-retry', () => this._call('onRetry'));
  }

  // ---------- shop ----------
  showShop(save, skins = []) {
    const owned = new Set(save.ownedSkins || []);
    const cards = skins.map((s) => {
      const isOwned = owned.has(s.id);
      const equipped = save.skin === s.id;
      const gem = s.currency === 'gems';
      const have = gem ? save.gems : save.coins;
      const can = have >= s.price;
      let btn;
      if (equipped) btn = `<button class="btn btn-sm btn-equipped" disabled>EQUIPPED</button>`;
      else if (isOwned) btn = `<button class="btn btn-sm btn-equip" data-act="equip" data-id="${esc(s.id)}">EQUIP</button>`;
      else if (can) btn = `<button class="btn btn-sm btn-buy" data-act="buy" data-id="${esc(s.id)}">BUY</button>`;
      else btn = `<button class="btn btn-sm btn-locked" disabled>🔒 LOCKED</button>`;
      const price = isOwned ? '' : `<div class="skin-price ${can ? '' : 'poor'}">${gem ? '💎' : '🪙'} ${fmt(s.price)}</div>`;
      return `<div class="skin-card${equipped ? ' is-eq' : ''}${!isOwned && !can ? ' is-locked' : ''}">
        <div class="swatch" style="background:${skinSwatchCSS(s)}"></div>
        <div class="skin-name">${esc(s.name)}</div>
        ${price}${btn}
      </div>`;
    }).join('');
    const prevGrid = this.screen.querySelector('.skin-grid');
    const prevScroll = prevGrid ? prevGrid.scrollTop : 0;
    const el = this._mount('panel-layer shop', `
      <div class="card card-shop">
        <div class="shop-head"><span class="shop-title">SKIN SHOP</span>${this._currencyBar(save)}</div>
        <div class="skin-grid">${cards}</div>
        <button class="btn btn-close btn-md">CLOSE ✖</button>
      </div>`);
    if (prevScroll) { el.querySelector('.skin-grid').scrollTop = prevScroll; el.classList.add('no-anim'); }
    this._on(el, '.btn-close', () => this._call('onCloseShop'));
    el.querySelectorAll('button[data-act]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        this._call(b.getAttribute('data-act') === 'buy' ? 'onBuySkin' : 'onEquipSkin', id);
      });
    });
  }

  // ---------- misc ----------
  hideAll() {
    this._reset();
  }

  toast(text) {
    clearTimeout(this.toastTimer);
    this.toastBox.innerHTML = '';
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    this.toastBox.appendChild(t);
    this.toastTimer = setTimeout(() => {
      t.classList.add('out');
      setTimeout(() => t.remove(), 300);
    }, 1600);
  }
}
