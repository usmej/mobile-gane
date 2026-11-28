// DOM UI: menu, HUD, shop, win/lose screens, toasts.
import { canUnlockSkin, skinSwatchCSS, shopSkins } from './skins.js';
import { getPortrait } from './portraits.js';
import { pickMeme } from './memes.js';
import * as I from './icons.js';
import { canClaim } from './daily.js';
import { shareRunCard } from './runcard.js';
import { productForSkin } from './products.js';
import { storeAvailable, storeKind } from './store.js';

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

  // Goal-gradient nudge: show how close the cheapest character you don't own yet is.
  _nextGoal(save) {
    const owned = new Set(save.ownedSkins || []);
    const next = shopSkins()
      .filter((s) => !owned.has(s.id) && s.price > 0 && canUnlockSkin(save, s))
      .sort((a, b) => (a.currency === b.currency ? a.price - b.price : a.currency === 'coins' ? -1 : 1))[0];
    if (!next) return '';
    const have = next.currency === 'gems' ? save.gems : save.coins;
    const pct = Math.round(Math.min(1, have / next.price) * 100);
    const left = Math.max(0, next.price - have);
    const ico = next.currency === 'gems' ? I.gem() : I.coin();
    const msg = left ? `${fmt(left)} more for ${esc(next.name)}` : `${esc(next.name)} is ready in Skins!`;
    return `<div class="next-goal${left ? '' : ' is-ready'}"><span class="ng-ico">${ico}</span><span class="ng-text">${msg}</span><div class="ng-bar"><i style="width:${pct}%"></i></div></div>`;
  }

  _currencyBar(save) {
    return `<div class="cur-bar">
      <div class="chip chip-coin"><span class="chip-ico">${I.coin()}</span><b data-k="coins">${fmt(save.coins)}</b></div>
      <div class="chip chip-gem"><span class="chip-ico">${I.gem()}</span><b data-k="gems">${fmt(save.gems)}</b></div>
    </div>`;
  }

  // ---------- menu ----------
  showMenu(save) {
    this.sound = save.sound !== false;
    const el = this._mount('panel-layer menu', `
      <div class="menu-top">${this._currencyBar(save)}
        <div class="top-stack">
          <button class="btn btn-sq btn-round btn-sound" aria-label="Toggle sound">${this.sound ? I.speakerOn() : I.speakerOff()}</button>
          ${canClaim(save) ? `<button type="button" class="btn btn-sq btn-round btn-daily" aria-label="Daily reward">${I.gift()}<i class="notif-dot"></i></button>` : ''}
        </div>
      </div>
      <div class="menu-mid">
        <h1 class="title" aria-label="Mass Dash">
          <span class="t-line t1">${[...'MASS'].map((c) => `<i>${c}</i>`).join('')}</span>
          <span class="t-line t2"><span class="speed-wrap"><svg class="speed" viewBox="0 0 40 30" width="40" height="30" aria-hidden="true" stroke="#1B1420" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5h24" fill="none" stroke-width="7" stroke="#1B1420"/><path d="M12 5h24" fill="none" stroke-width="3" stroke="#FFF4E0"/><path d="M4 15h28" fill="none" stroke-width="7" stroke="#1B1420"/><path d="M4 15h28" fill="none" stroke-width="3" stroke="#FFF4E0"/><path d="M14 25h20" fill="none" stroke-width="7" stroke="#1B1420"/><path d="M14 25h20" fill="none" stroke-width="3" stroke="#FFF4E0"/></svg></span>${[...'DASH'].map((c) => `<i>${c}</i>`).join('')}</span>
        </h1>
        <div class="level-tag">Level ${save.level}</div>
      </div>
      <div class="menu-bottom">
        ${this._nextGoal(save)}
        <button class="btn btn-play">PLAY</button>
        <div class="menu-secondary">
          <button class="btn btn-tile btn-shop"><span class="tile-ico">${I.skin()}</span><span class="tile-label">Skins</span></button>
          <button class="btn btn-tile btn-badges"><span class="tile-ico">${I.medal()}</span><span class="tile-label">Badges</span></button>
          <button class="btn btn-tile btn-records"><span class="tile-ico">${I.trophy()}</span><span class="tile-label">Best runs</span></button>
        </div>
      </div>`);
    this._on(el, '.btn-play', () => this._call('onPlay'));
    this._on(el, '.btn-shop', () => this._call('onOpenShop'));
    this._on(el, '.btn-badges', () => this._call('onOpenBadges'));
    this._on(el, '.btn-records', () => this._call('onOpenRecords'));
    this._on(el, '.btn-daily', () => this._call('onClaimDaily'));
    const snd = this._on(el, '.btn-sound', () => {
      this.sound = !this.sound;
      snd.innerHTML = this.sound ? I.speakerOn() : I.speakerOff();
      this._call('onToggleSound', this.sound);
    });
  }

  // ---------- HUD ----------
  showHUD(save, showDragHint = true) {
    const el = this._mount('hud', `
      <div class="hud-top">
        <div class="prog">
          <span class="prog-lv"><b data-k="level">${save.level}</b></span>
          <div class="prog-bar"><div class="prog-fill" data-k="fill"></div></div>
          <span class="prog-boss">${I.bossFace()}</span>
        </div>
        <div class="hud-cur">
          <div class="chip chip-coin hud-coins"><span class="chip-ico">${I.coin()}</span><b data-k="coins">0</b></div>
          <div class="chip chip-gem hud-gems" data-k="gemchip"><span class="chip-ico">${I.gem()}</span><b data-k="gems">0</b></div>
        </div>
      </div>
      ${showDragHint ? `<div class="hint"><div class="hint-row">${I.hand()}${I.arrows()}</div><span>Drag</span></div>` : ''}
      <button type="button" class="btn-jump" aria-label="Jump" hidden>JUMP</button>`);
    const q = (k) => el.querySelector(`[data-k="${k}"]`);
    this.hud = {
      level: q('level'), coins: q('coins'), gems: q('gems'), gemchip: q('gemchip'), fill: q('fill'),
      hint: el.querySelector('.hint'),
      jump: el.querySelector('.btn-jump'),
      lv: el.querySelector('.prog-lv'),
      last: { level: null, coins: null, gems: null, progress: -1, worldLabel: null },
    };
    // Jump button: its touch must never become the steering finger (see main.js pointers).
    const jb = this.hud.jump;
    jb.addEventListener('pointerdown', (e) => { e.stopPropagation(); e.preventDefault(); this._call('onJump'); });
    // Keyboard activation (Enter/Space on the focused button) fires click with detail 0; touches already fired on pointerdown.
    jb.addEventListener('click', (e) => { if (e.detail === 0) this._call('onJump'); });
    this.hud.gemchip.style.display = 'none';
    if (this.hud.hint) {
      this.hintTimer = setTimeout(() => this.hud?.hint?.classList.add('hide'), 2500);
    }
  }

  updateHUD({ level, mass, coins, gems, progress, worldLabel } = {}) {
    const h = this.hud;
    if (!h) return;
    const l = h.last;
    if (worldLabel !== undefined && worldLabel !== l.worldLabel) {
      // e.g. "WORLD 2-3": shown as "2-3" in the level circle, full text for screen readers
      l.worldLabel = worldLabel;
      const short = String(worldLabel).replace(/^WORLD\s*/i, '');
      h.level.textContent = short; l.level = short;
      h.lv.classList.toggle('wide', short.length > 2);
      h.lv.setAttribute('aria-label', String(worldLabel));
    }
    if (level !== undefined && l.worldLabel === null && level !== l.level) { l.level = level; h.level.textContent = level; }
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
  showWin({ level, coinsEarned = 0, gemsEarned = 0, multiplier = 1, bestRank = null, winner = 'YOU', skinId = null } = {}) {
    const verb = String(winner).trim().toUpperCase() === 'YOU' ? 'CLEAR' : 'CLEARS';
    const sticker = bestRank === null ? '' : `<div class="sticker">${bestRank === 1 ? 'NEW BEST!' : `#${esc(bestRank)} BEST RUN`}</div>`;
    const el = this._mount('panel-layer result win', `
      <div class="card card-win">
        ${sticker}
        <h2 class="res-title">${esc(winner)} ${verb} LEVEL ${esc(level)}!</h2>
        <p class="res-sub">${esc(pickMeme('win'))}</p>
        <div class="earn-row">
          <div class="earn-main">
            <div class="earn-coins"><span class="earn-ico">${I.coin()}</span><b class="count" data-k="coins">0</b></div>
            <div class="mult-tag">\u00d7${multiplier}</div>
          </div>
          ${gemsEarned > 0 ? `<div class="earn-gems"><span class="earn-ico">${I.gem()}</span><b class="count" data-k="gems">0</b></div>` : ''}
        </div>
        <button class="btn btn-next">NEXT</button>
        <button class="btn btn-share"><svg class="ico" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" fill="none" stroke="#1B1420" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 15V3"/><path d="M7 8l5-5 5 5"/><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-7"/></svg><span>Share</span></button>
      </div>`);
    this._on(el, '.btn-next', () => this._call('onNext'));
    this._on(el, '.btn-share', () => shareRunCard({ winner, level, coinsEarned, multiplier, skinId }));
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
  showLose({ level, reason = '', progress, tip = '', continueCost = 0, gems = 0 } = {}) {
    const sentence = (str) => {
      const t = String(str).trim();
      return t && t === t.toUpperCase() ? t.charAt(0) + t.slice(1).toLowerCase() : t;
    };
    const hasProg = progress !== undefined && progress !== null && Number.isFinite(Number(progress));
    const pc = hasProg ? Math.round(Math.max(0, Math.min(1, Number(progress))) * 100) : 0;
    const hasMenu = !!(this.h && typeof this.h.onMenu === 'function');
    const el = this._mount('panel-layer result lose', `
      <div class="card card-lose">
        <div class="res-level">Level ${esc(level)}</div>
        <h2 class="res-title res-reason">${esc(sentence(reason) || 'Not this time!')}</h2>
        ${tip ? `<p class="res-tip">${esc(tip)}</p>` : `<p class="res-sub">${esc(pickMeme('lose'))}</p>`}
        ${hasProg && !tip ? `<div class="lose-prog"><span>You made it ${pc}% of the way</span><div class="bar"><i style="width:${pc}%"></i></div></div>` : ''}
        ${continueCost > 0 ? `<button class="btn btn-continue"${gems < continueCost ? ' disabled' : ''}>KEEP GOING <span class="cont-cost">${I.gem()}<b>${fmt(continueCost)}</b></span></button>
        ${gems < continueCost ? `<p class="cont-need">You have ${fmt(gems)} gems</p>` : ''}` : ''}
        <button class="btn btn-retry">TRY AGAIN</button>
        ${hasMenu ? '<button class="btn-link btn-menu">Menu</button>' : ''}
      </div>`);
    this._on(el, '.btn-retry', () => this._call('onRetry'));
    this._on(el, '.btn-continue', () => this._call('onContinue'));
    this._on(el, '.btn-menu', () => this._call('onMenu'));
  }

  // ---------- shop ----------
  showShop(save, skins = []) {
    const canPay = storeAvailable();
    // Paid characters only appear where a store exists (app build or ?shoptest), unless already owned.
    skins = skins.filter((s) => !s.retired && (s.currency !== 'iap' || canPay || (save.ownedSkins || []).includes(s.id)));
    const owned = new Set(save.ownedSkins || []);
    const cards = skins.map((s) => {
      const isOwned = owned.has(s.id);
      const equipped = save.skin === s.id;
      const gem = s.currency === 'gems';
      const have = gem ? save.gems : save.coins;
      const eligible = canUnlockSkin(save, s);
      const can = eligible && have >= s.price;
      const ico = gem ? I.gem() : I.coin();
      let btn;
      const product = s.currency === 'iap' ? productForSkin(s.id) : null;
      if (product && !isOwned) {
        btn = `<button class="btn btn-sm btn-paid" data-act="product" data-id="${esc(product.id)}">${esc(product.price)}</button>`;
      } else if (equipped) btn = `<button class="btn btn-sm btn-equipped" disabled>Equipped</button>`;
      else if (isOwned) btn = `<button class="btn btn-sm btn-equip" data-act="equip" data-id="${esc(s.id)}">Equip</button>`;
      else if (!eligible) btn = `<button class="btn btn-sm btn-locked" disabled>${I.lock()}<span>Beat level ${s.unlockLevel}</span></button>`;
      else if (can) btn = `<button class="btn btn-sm btn-buy" data-act="buy" data-id="${esc(s.id)}">${ico}<span>${fmt(s.price)}</span></button>`;
      else btn = `<button class="btn btn-sm btn-locked" disabled>${I.lock()}<span>Need ${fmt(s.price)}</span></button>`;
      const portrait = getPortrait(s);
      return `<div class="skin-card${equipped ? ' is-eq' : ''}${!isOwned && !can ? ' is-locked' : ''}">
        ${equipped ? `<span class="eq-check" aria-label="Equipped">${I.check()}</span>` : ''}
        ${portrait ? `<img class="portrait${eligible ? '' : ' is-gated'}" src="${portrait}" alt="${esc(s.name)}">` : `<div class="swatch" style="background:${skinSwatchCSS(s)}"><i class="spec"></i></div>`}
        <div class="skin-name">${esc(s.name)}</div>
        ${btn}
      </div>`;
    }).join('');
    const prevGrid = this.screen.querySelector('.skin-grid');
    const prevScroll = prevGrid ? prevGrid.scrollTop : 0;
    const el = this._mount('panel-layer shop', `
      <div class="card card-shop">
        <button class="btn btn-close" aria-label="Close">${I.closeX()}</button>
        <h2 class="panel-title">Characters <span class="collect-count">${skins.filter((s) => owned.has(s.id)).length}/${skins.length}</span></h2>
        ${this._currencyBar(save)}
        <div class="skin-grid">${cards}</div>
        ${canPay ? `<div class="shop-foot">${storeKind() === 'test' ? '<span class="test-tag">TEST STORE: no real money</span>' : ''}<button class="btn-link btn-restore">Restore purchases</button></div>` : ''}
      </div>`);
    this._on(el, '.btn-restore', () => this._call('onRestore'));
    if (prevScroll) { el.querySelector('.skin-grid').scrollTop = prevScroll; el.classList.add('no-anim'); }
    this._on(el, '.btn-close', () => this._call('onCloseShop'));
    el.querySelectorAll('button[data-act]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-id');
        const act = b.getAttribute('data-act');
        this._call(act === 'buy' ? 'onBuySkin' : act === 'product' ? 'onBuyProduct' : 'onEquipSkin', id);
      });
    });
  }

  showBadges(save, badges) {
    const cards = badges.map((badge) => {
      const unlocked = Object.prototype.hasOwnProperty.call(save.achievements, badge.id);
      return `<div class="badge-card${unlocked ? ' is-unlocked' : ''}">
        <div class="badge-name">${esc(badge.name)}</div>
        <div>${esc(badge.desc)}</div>
        <span class="badge-status">${unlocked ? 'Unlocked' : 'Locked'}</span>
      </div>`;
    }).join('');
    const el = this._mount('panel-layer shop', `
      <div class="card card-shop">
        <button class="btn btn-close" aria-label="Close badges">${I.closeX()}</button>
        <h2 class="panel-title">Badges</h2>
        <div class="skin-grid badge-grid">${cards}</div>
      </div>`);
    this._on(el, '.btn-close', () => this._call('onCloseBadges'));
  }

  showRecords(runs) {
    const rows = runs.map((run, index) => {
      const date = new Date(run.date).toISOString().slice(0, 10);
      return `<li class="badge-card record-row">
        <div class="badge-name">#${index + 1} · LV ${run.level}</div>
        <div>${fmt(run.coinsEarned)} coins · x${run.multiplier}</div>
        <time datetime="${date}">${date}</time>
      </li>`;
    }).join('');
    const el = this._mount('panel-layer shop', `
      <div class="card card-shop">
        <button class="btn btn-close" aria-label="Close best runs">${I.closeX()}</button>
        <h2 class="panel-title">Best runs</h2>
        ${rows
          ? `<ol class="skin-grid record-list" role="list">${rows}</ol>`
          : '<div class="badge-card">Win a level to record your first run.</div>'}
      </div>`);
    this._on(el, '.btn-close', () => this._call('onCloseRecords'));
  }

  // ---------- misc ----------
  hideAll() {
    this._reset();
  }

  // Show or hide the on-screen Jump button (bottom-right thumb zone).
  showJumpButton(visible) {
    if (this.hud?.jump) this.hud.jump.hidden = !visible;
  }

  // First-encounter explainer: dimmed backdrop + centered card. Doesn't touch the HUD.
  // ---------- purchases ----------
  // Parent gate (Apple Kids Category 1.3 / FTC): an adult-level question before any purchase screen.
  showParentGate(onPass, onCancel) {
    this.hideModal();
    const words = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const say = (n) => (n < 20 ? words[n] : tens[Math.floor(n / 10)] + (n % 10 ? '-' + words[n % 10] : ''));
    const a = 31 + Math.floor(Math.random() * 60);
    const b = 12 + Math.floor(Math.random() * 18);
    const answer = a - b;
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `
      <div class="card modal-card" role="dialog" aria-modal="true" aria-labelledby="pg-title">
        <div class="intro-new">GROWN-UPS ONLY</div>
        <h2 class="panel-title" id="pg-title">Ask a grown-up</h2>
        <p class="modal-text">To continue, type the answer to: <b>${say(a)} minus ${say(b)}</b></p>
        <input class="pg-input" type="text" inputmode="numeric" autocomplete="off" maxlength="3" aria-label="Answer">
        <p class="pg-err" hidden>That's not right. Ask a grown-up for help!</p>
        <button class="btn btn-next pg-ok">Continue</button>
        <button class="btn-link pg-cancel">Cancel</button>
      </div>`;
    this.root.appendChild(back);
    this.modalEl = back;
    const input = back.querySelector('.pg-input');
    const err = back.querySelector('.pg-err');
    let tries = 0;
    const submit = () => {
      if (Number(input.value.trim()) === answer) { this.hideModal(); onPass && onPass(); return; }
      tries += 1;
      err.hidden = false;
      input.value = '';
      if (tries >= 3) { this.hideModal(); onCancel && onCancel(); }
    };
    back.querySelector('.pg-ok').addEventListener('click', submit);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    back.querySelector('.pg-cancel').addEventListener('click', () => { this.hideModal(); onCancel && onCancel(); });
    back.addEventListener('pointerdown', (e) => e.stopPropagation());
    try { input.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }

  // Clear confirm screen: what you get and the real price. Never a one-tap purchase.
  showPurchaseConfirm(product, { test = false } = {}, onBuy, onCancel) {
    this.hideModal();
    const back = document.createElement('div');
    back.className = 'modal-back';
    back.innerHTML = `
      <div class="card modal-card" role="dialog" aria-modal="true" aria-labelledby="pc-title">
        ${test ? '<div class="intro-new">TEST STORE: NO REAL MONEY</div>' : ''}
        <h2 class="panel-title" id="pc-title">${esc(product.title)}</h2>
        <p class="modal-text">${esc(product.blurb)}</p>
        <p class="modal-price">${esc(product.price)} <span>one-time purchase</span></p>
        <button class="btn btn-next pc-buy">Buy for ${esc(product.price)}</button>
        <button class="btn-link pc-cancel">No thanks</button>
      </div>`;
    this.root.appendChild(back);
    this.modalEl = back;
    const buy = back.querySelector('.pc-buy');
    buy.addEventListener('click', () => { buy.disabled = true; buy.textContent = 'Working...'; onBuy && onBuy(); });
    back.querySelector('.pc-cancel').addEventListener('click', () => { this.hideModal(); onCancel && onCancel(); });
    back.addEventListener('pointerdown', (e) => e.stopPropagation());
  }

  hideModal() {
    if (this.modalEl) this.modalEl.remove();
    this.modalEl = null;
  }

  showIntro(intro, onDone) {
    this.hideIntro();
    if (!intro) return;
    const back = document.createElement('div');
    back.className = 'intro-back';
    back.setAttribute('role', 'dialog');
    back.setAttribute('aria-modal', 'true');
    back.innerHTML = `<div class="intro-card">
      ${intro.icon ? `<div class="intro-icon"></div>` : ''}
      <div class="intro-new">${esc(intro.badge || 'NEW!')}</div>
      <h2 class="intro-title"></h2>
      <p class="intro-how"></p>
      <button type="button" class="btn btn-next intro-btn">Got it</button>
    </div>`;
    const iconEl = back.querySelector('.intro-icon');
    if (iconEl) {
      const raw = String(intro.icon);
      if (raw.trim().startsWith('<')) iconEl.innerHTML = raw;
      else if (typeof I[raw] === 'function') iconEl.innerHTML = I[raw]();
      else iconEl.remove();
    }
    back.querySelector('.intro-title').textContent = intro.title || '';
    back.querySelector('.intro-how').textContent = intro.how || '';
    const btn = back.querySelector('.intro-btn');
    this._introShownAt = performance.now();
    this._introDone = onDone;
    this._introPrevFocus = document.activeElement;
    btn.addEventListener('click', () => this.pressIntro());
    this.root.appendChild(back);
    this.introEl = back;
    try { btn.focus({ preventScroll: true }); } catch (e) { /* ignore */ }
  }

  // "Got it" (button, Space or Enter). Ignores accidental presses in the first 350 ms. Fires once.
  pressIntro() {
    if (!this.introEl || performance.now() - this._introShownAt < 350) return;
    const done = this._introDone;
    this._introDone = null;
    if (done) this._call_fn(done);
  }

  _call_fn(f) { try { f(); } catch (e) { console.error(e); } }

  hideIntro() {
    this._introDone = null;
    if (this.introEl) { this.introEl.remove(); this.introEl = null; }
    const prev = this._introPrevFocus;
    this._introPrevFocus = null;
    if (prev && prev.isConnected && typeof prev.focus === 'function') { try { prev.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    else if (document.activeElement && document.activeElement !== document.body) { try { document.activeElement.blur(); } catch (e) { /* ignore */ } }
  }

  // One-line "NEW!" banner that introduces a mechanic. Auto-hides after ~2 s.
  cue(text) {
    clearTimeout(this.cueTimer);
    this.cueBox?.remove();
    const c = document.createElement('div');
    c.className = 'cue';
    c.innerHTML = `<span class="cue-new">NEW!</span><span class="cue-text"></span>`;
    c.querySelector('.cue-text').textContent = text;
    this.root.appendChild(c);
    this.cueBox = c;
    this.cueTimer = setTimeout(() => { c.classList.add('out'); setTimeout(() => c.remove(), 300); }, 2000);
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
