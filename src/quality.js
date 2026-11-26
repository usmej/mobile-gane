// Watches FPS and lowers render cost on slow phones.
// Levels: 2 = high, 1 = medium, 0 = low. Only ever steps down, never back up.

const WINDOW_SECONDS = 2;      // rolling average window
const START_DELAY = 2;         // ignore the first seconds after start
const CHANGE_DELAY = 1.5;      // ignore the first seconds after any change
const MIN_FPS = 45;            // below this average, drop a level
const MAX_SAMPLE_DT = 1;       // frames longer than this (tab stalls) are not sampled

const PIXEL_RATIO_CAP = [1, 1.5, 2]; // indexed by level; level 0 is exactly 1 (see _apply)

export class AutoQuality {
  constructor(renderer, { onChange } = {}) {
    this.renderer = renderer;
    this.onChange = onChange;
    this._level = 2;
    this._elapsed = 0;      // seconds since start
    this._sinceChange = 0;  // seconds since last level change (or start)
    this._samples = [];     // frame dt values inside the rolling window
    this._sampleSum = 0;
    this._apply(this._level);
  }

  get level() {
    return this._level;
  }

  update(dt) {
    this._elapsed += dt;
    this._sinceChange += dt;

    if (this._level === 0) return;
    if (this._elapsed < START_DELAY || this._sinceChange < CHANGE_DELAY) return;
    if (!(dt > 0) || dt > MAX_SAMPLE_DT) return;

    // Rolling window of frame times covering the last WINDOW_SECONDS.
    this._samples.push(dt);
    this._sampleSum += dt;
    while (this._sampleSum > WINDOW_SECONDS && this._samples.length > 1) {
      this._sampleSum -= this._samples.shift();
    }
    if (this._sampleSum < WINDOW_SECONDS) return; // window not full yet

    const avgFps = this._samples.length / this._sampleSum;
    if (avgFps < MIN_FPS) {
      this._setLevel(this._level - 1, avgFps);
    }
  }

  _setLevel(newLevel, avgFps) {
    this._level = newLevel;
    this._sinceChange = 0;
    this._samples = [];
    this._sampleSum = 0;
    this._apply(newLevel);
    console.info(`[quality] level ${newLevel} (avg ${avgFps.toFixed(1)} fps)`);
    if (typeof this.onChange === 'function') this.onChange(newLevel);
  }

  _apply(level) {
    const r = this.renderer;
    const dpr = (typeof window !== 'undefined' && window.devicePixelRatio) || 1;
    const pixelRatio = level === 0 ? 1 : Math.min(dpr, PIXEL_RATIO_CAP[level]);

    r.setPixelRatio(pixelRatio);
    r.setSize(window.innerWidth, window.innerHeight);

    r.shadowMap.enabled = level > 0;
    r.shadowMap.needsUpdate = true;
  }
}
