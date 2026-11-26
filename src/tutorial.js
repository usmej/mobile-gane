import { hand } from './icons.js';

export class Tutorial {
  constructor(overlayEl) {
    this.overlayEl = overlayEl;
    this.tip = document.createElement('div');
    this.tip.className = 'tutorial-tip';
    this.tip.hidden = true;
    overlayEl.appendChild(this.tip);
    this.phase = 'idle';
  }

  start() {
    this.phase = 'drag';
    this.distance = 0;
    this.tip.innerHTML = `${hand()}<span>DRAG</span>`;
    this.tip.classList.add('tutorial-drag');
    this.tip.style.opacity = '';
    this.tip.hidden = true;
  }

  addDrag(dx) {
    if (this.phase === 'drag') this.distance += Math.abs(dx);
  }

  update(dt, player, nextGate) {
    if (this.phase === 'idle') return false;
    if (this.phase === 'drag' && this.distance >= 60) {
      this.phase = 'gate';
      this.tip.textContent = 'BLUE = GROW';
      this.tip.classList.remove('tutorial-drag');
    }
    if (this.phase === 'drag') {
      this.place(player, 30);
    } else if (this.phase === 'gate') {
      if (!nextGate || nextGate.passed) {
        this.phase = 'fade';
        this.fadeLeft = 0.25;
      } else {
        this.place(nextGate.screen, -32);
      }
    } else if (this.phase === 'fade') {
      this.fadeLeft -= dt;
      if (this.fadeLeft <= 0) {
        this.stop();
        return true;
      }
      this.tip.style.opacity = String(this.fadeLeft / 0.25);
    }
    return false;
  }

  place(point, offsetY) {
    const { clientWidth: w, clientHeight: h } = this.overlayEl;
    this.tip.hidden = !point || point.x < 0 || point.x > w || point.y < 0 || point.y > h;
    if (this.tip.hidden) return;
    const margin = this.tip.offsetWidth / 2 + 4;
    this.tip.style.left = Math.max(margin, Math.min(w - margin, point.x)) + 'px';
    this.tip.style.top = Math.max(20, Math.min(h - 20, point.y + offsetY)) + 'px';
  }

  stop() {
    this.phase = 'idle';
    this.tip.hidden = true;
  }
}
