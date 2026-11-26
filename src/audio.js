// Pure WebAudio synthesized SFX. Never throws.
let ctx = null;
let master = null;
let noiseBuf = null;
const lastPlayed = {};

function now() { return ctx.currentTime; }

function tone(type, f0, f1, t0, dur, vol = 0.5) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(f0, t0);
  if (f1 && f1 !== f0) o.frequency.exponentialRampToValueAtTime(Math.max(1, f1), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(vol, t0 + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g).connect(master);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

function noise(t0, dur, vol = 0.5, freq = 1200) {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = 'lowpass';
  f.frequency.setValueAtTime(freq, t0);
  f.frequency.exponentialRampToValueAtTime(100, t0 + dur);
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  s.connect(f).connect(g).connect(master);
  s.start(t0);
  s.stop(t0 + dur + 0.02);
}

function arp(notes, step, type, dur, vol) {
  const t = now();
  notes.forEach((f, i) => tone(type, f, f, t + i * step, dur, vol));
}

const SOUNDS = {
  gateGood() { arp([523, 659, 784, 1047], 0.06, 'triangle', 0.14, 0.5); },
  gateBad() { arp([660, 523, 415, 311], 0.07, 'sawtooth', 0.16, 0.3); },
  coin() { const t = now(); tone('square', 988, 988, t, 0.06, 0.25); tone('square', 1319, 1319, t + 0.05, 0.14, 0.25); },
  gem() {
    const t = now();
    tone('sine', 1568, 1568, t, 0.12, 0.4);
    tone('sine', 2093, 2093, t + 0.07, 0.2, 0.35);
    tone('triangle', 2637, 2637, t + 0.14, 0.25, 0.25);
  },
  foodGood() { tone('sine', 250, 600, now(), 0.16, 0.6); },
  foodBad() { const t = now(); tone('sawtooth', 300, 90, t, 0.35, 0.3); noise(t, 0.2, 0.15, 500); },
  hit() { const t = now(); noise(t, 0.18, 0.6, 2500); tone('square', 180, 60, t, 0.15, 0.4); },
  win() {
    const t = now();
    [523, 659, 784].forEach((f, i) => tone('square', f, f, t + i * 0.1, 0.1, 0.3));
    tone('square', 1047, 1047, t + 0.3, 0.4, 0.3);
    tone('triangle', 784, 784, t + 0.3, 0.4, 0.3);
  },
  lose() {
    const t = now();
    tone('sawtooth', 392, 392, t, 0.18, 0.3);
    tone('sawtooth', 370, 370, t + 0.18, 0.18, 0.3);
    tone('sawtooth', 330, 330, t + 0.36, 0.14, 0.3);
    tone('sawtooth', 311, 130, t + 0.5, 0.3, 0.3);
  },
  click() { tone('square', 700, 500, now(), 0.04, 0.2); },
  buy() { const t = now(); tone('triangle', 784, 784, t, 0.08, 0.4); tone('triangle', 1175, 1175, t + 0.08, 0.2, 0.4); },
  boss() {
    const t = now();
    tone('sawtooth', 90, 55, t, 0.7, 0.45);
    tone('square', 95, 50, t, 0.7, 0.2);
    noise(t, 0.6, 0.15, 400);
  },
  smash() { const t = now(); noise(t, 0.4, 0.8, 4000); tone('sine', 140, 40, t, 0.35, 0.7); },
};

export const audio = {
  enabled: true,
  unlock() {
    try {
      if (!ctx) {
        const AC = window.AudioContext || window.webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0.25;
        master.connect(ctx.destination);
      }
      if (ctx.state === 'suspended') ctx.resume();
    } catch (e) { /* ignore */ }
  },
  play(name) {
    try {
      if (!this.enabled || !ctx || !SOUNDS[name]) return;
      if (ctx.state === 'suspended') ctx.resume();
      const t = performance.now();
      if (lastPlayed[name] && t - lastPlayed[name] < 40) return;
      lastPlayed[name] = t;
      SOUNDS[name]();
    } catch (e) { /* ignore */ }
  },
  setEnabled(b) { this.enabled = !!b; },
};
