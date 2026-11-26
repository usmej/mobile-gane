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

// ---------- Background music (lookahead-scheduled chiptune loop) ----------
const MAJ = [0, 4, 7, 12];
const MIN = [0, 3, 7, 12];
// Each progression: bpm, 4 chords (root pitch class, tones), 4 lead bars (16 steps; index into tones, -1 = rest)
const SONGS = [
  { bpm: 128, chords: [[9, MIN], [5, MAJ], [0, MAJ], [7, MAJ]], lead: [
    [2, -1, 1, -1, 0, -1, 1, 2, 3, -1, 2, -1, 1, -1, -1, -1],
    [3, -1, 2, -1, 1, -1, 2, 3, 2, -1, 1, -1, 0, -1, -1, -1],
    [2, -1, 3, -1, 2, -1, 1, 0, 1, -1, 2, -1, 3, -1, -1, -1],
    [3, -1, 2, 3, 2, -1, 1, -1, 0, -1, 1, 2, 1, -1, -1, -1]] },
  { bpm: 136, chords: [[0, MAJ], [7, MAJ], [9, MIN], [5, MAJ]], lead: [
    [0, 1, 2, -1, 3, -1, 2, -1, 1, -1, 2, -1, 0, -1, -1, -1],
    [1, 2, 3, -1, 2, -1, 1, -1, 0, -1, 1, -1, 2, -1, -1, -1],
    [3, -1, 2, 1, 0, -1, 1, 2, 3, -1, -1, -1, 2, -1, 1, -1],
    [2, -1, 1, -1, 0, -1, 1, -1, 2, 3, 2, -1, 1, -1, 0, -1]] },
  { bpm: 124, chords: [[2, MIN], [10, MAJ], [5, MAJ], [0, MAJ]], lead: [
    [0, -1, -1, 2, 1, -1, 0, -1, 2, -1, 3, -1, 2, -1, 1, -1],
    [2, -1, -1, 3, 2, -1, 1, -1, 0, -1, 1, -1, 2, -1, -1, -1],
    [3, -1, 2, -1, 1, -1, 2, -1, 3, -1, -1, 2, 1, -1, 0, -1],
    [2, -1, 1, 0, 1, -1, 2, -1, 3, -1, 2, -1, 0, -1, -1, -1]] },
  { bpm: 132, chords: [[7, MAJ], [2, MAJ], [4, MIN], [0, MAJ]], lead: [
    [2, -1, 1, 2, 3, -1, 2, -1, 1, -1, 0, -1, 1, -1, -1, -1],
    [3, -1, 2, -1, 1, 2, 3, -1, 2, -1, 1, -1, 0, -1, -1, -1],
    [1, -1, 2, -1, 3, -1, 2, 1, 2, -1, 3, -1, 2, -1, -1, -1],
    [2, -1, 3, -1, 2, 1, 0, -1, 1, -1, 2, -1, 1, -1, 0, -1]] },
];
const BAR_STEPS = 16;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const fold = (pc, base) => base + (((pc - base) % 12) + 12) % 12;

let musicGain = null;
let musicTimer = null;
let musicLevel = null;
let mSong = null, mStep = 0, mNext = 0, mDur = 0.12;

function mNote(type, freq, t0, dur, vol, dest, cutoff) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  let out = g;
  o.connect(g);
  if (cutoff) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = cutoff;
    g.connect(f);
    out = f;
  }
  out.connect(dest);
  o.start(t0);
  o.stop(t0 + dur + 0.02);
}

function mHat(t0, vol, dest) {
  if (!noiseBuf) {
    noiseBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * 0.5), ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const s = ctx.createBufferSource();
  s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter();
  f.type = 'highpass';
  f.frequency.value = 7000;
  const g = ctx.createGain();
  g.gain.setValueAtTime(vol, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.04);
  s.connect(f).connect(g).connect(dest);
  s.start(t0, Math.random() * 0.3);
  s.stop(t0 + 0.06);
}

function scheduleStep(step, t) {
  const bar = Math.floor(step / BAR_STEPS) % 4;
  const s = step % BAR_STEPS;
  const [pc, tones] = mSong.chords[bar];
  const bassBase = fold(pc, 36);
  // Bass: driving eighths with octave pops
  if (s % 2 === 0) {
    const m = bassBase + (s === 6 || s === 14 ? 12 : 0);
    mNote('triangle', mtof(m), t, mDur * 1.8, 0.7, musicGain);
  }
  // Lead
  const li = mSong.lead[bar][s];
  if (li >= 0) {
    const m = fold(pc, 60) + tones[li];
    mNote('square', mtof(m), t, mDur * 1.5, 0.22, musicGain, 2200);
  }
  // Light hi-hat: off-beat eighths, soft sixteenth ghosts
  if (s % 4 === 2) mHat(t, 0.35, musicGain);
  else if (s % 2 === 1) mHat(t, 0.08, musicGain);
}

function musicTick() {
  try {
    if (!ctx || !musicGain || !mSong) return;
    const cur = ctx.currentTime;
    if (mNext < cur - 0.2) mNext = cur + 0.05; // fell behind (throttled tab): resync
    while (mNext < cur + 0.1) {
      scheduleStep(mStep, mNext);
      mStep = (mStep + 1) % (BAR_STEPS * 4);
      mNext += mDur;
    }
  } catch (e) { /* ignore */ }
}

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
  setEnabled(b) {
    this.enabled = !!b;
    if (!this.enabled) this.stopMusic();
  },
  startMusic(levelNumber) {
    try {
      if (!this.enabled || !ctx || !master) return;
      const lvl = Math.abs(Math.floor(Number(levelNumber) || 0));
      if (musicTimer && musicLevel === lvl) return;
      this.stopMusic();
      if (ctx.state === 'suspended') ctx.resume();
      mSong = SONGS[lvl % SONGS.length];
      musicLevel = lvl;
      mDur = 60 / mSong.bpm / 4; // sixteenth note
      mStep = 0;
      mNext = ctx.currentTime + 0.06;
      musicGain = ctx.createGain();
      musicGain.gain.value = 0.10;
      musicGain.connect(master);
      musicTimer = setInterval(musicTick, 25);
      musicTick();
    } catch (e) { /* ignore */ }
  },
  stopMusic() {
    try {
      if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
      if (musicGain) { musicGain.disconnect(); musicGain = null; }
      musicLevel = null;
      mSong = null;
    } catch (e) { /* ignore */ }
  },
};
