# Architecture & Module Contracts

**Game:** *Gloop Rush* — an original brain-rot 3D runner (genre: "jelly run / tall man run").
**Stack:** plain HTML + JavaScript ES modules + [Three.js](https://threejs.org) `0.160.0` loaded from a CDN via an import map.
No build step, no npm, no bundler. Open `index.html` through any static server.

```bash
python3 -m http.server 8080   # then open http://localhost:8080
```

> ES modules do NOT load from `file://`. Always use a local server.

## Folder layout

| File | Owner | What it does |
|---|---|---|
| `index.html` | Lead (Person 1) | Page shell, import map, `#game` canvas host, `#ui` overlay, `#fx` overlay |
| `style.css` | UI module | All CSS (mobile-first, portrait) |
| `src/config.js` | Lead | Every tuning number (speed, sizes, economy) |
| `src/main.js` | Lead | Boot, game loop, state machine (`menu → playing → boss → win/lose`) |
| `src/levels.js` | Lead | Seeded procedural level generator |
| `src/world.js` | Lead | Track, sky, fog, lights, scenery per theme |
| `src/player.js` | Lead | The blob: size from mass, wobble, steering |
| `src/entities.js` | Lead | Gates, food, coins, gems, saws, walls, boss + collisions |
| `src/labels.js` | Lead | Canvas-texture number/text sprites |
| `src/save.js` | helper | localStorage save/load |
| `src/memes.js` | helper | Brain-rot pop-up text pack |
| `src/themes.js` | helper | Level color themes (data) |
| `src/skins.js` | helper | Skin data + material factory |
| `src/audio.js` | helper | Synthesized sound effects (WebAudio, no files) |
| `src/fx.js` | helper | Particles + floating 3D-anchored text |
| `src/ui.js` | helper | Menus, HUD, shop, win/lose screens (DOM) |

## Coordinate system

- The player runs toward **negative Z**. Level items are stored by `d` (distance from start, positive); world `z = -d`.
- Track is centered on `x = 0`, half-width `CONFIG.trackHalfWidth` (3 units). Ground is `y = 0`.

## Module contracts (exports must match exactly)

### `src/save.js`
```js
export const DEFAULT_SAVE = { coins: 0, gems: 0, level: 1, best: 1, ownedSkins: ['classic'], skin: 'classic', sound: true };
export function loadSave()        // -> save object (merged over DEFAULT_SAVE, never throws)
export function writeSave(save)   // persists; never throws
export function resetSave()       // -> fresh DEFAULT_SAVE copy (also persisted)
```
localStorage key: `gloop-rush-save-v1`. Wrap every access in try/catch.

### `src/memes.js`
```js
export const MEMES = { gateGood:[], gateBad:[], foodGood:[], foodBad:[], coin:[], hit:[], win:[], lose:[], boss:[], start:[] };
export function pickMeme(category) // -> random string from that category ('' if unknown)
```
Original brain-rot slang only (e.g. "W", "L", "SHEESH", "NO CAP", "BUSSIN", "RIZZ +1"). No real people, no copyrighted characters, nothing offensive.

### `src/themes.js`
```js
export const THEMES = [ { id, name, sky, fog, track, trackAlt, edge, accent, pattern } , ... ]
// colors are '#rrggbb' strings; pattern ∈ 'stripes' | 'checker' | 'dots' | 'plain'
export function themeForLevel(level) // -> THEMES[(level - 1) % THEMES.length]
```

### `src/skins.js`
```js
export const SKINS = [ { id, name, price, currency: 'coins'|'gems', color, color2, pattern } , ... ]
// pattern ∈ 'solid' | 'stripes' | 'dots' | 'checker' | 'rainbow' | 'glow'
export function getSkin(id)            // -> skin (falls back to SKINS[0])
export function makeSkinMaterial(skin) // -> THREE.MeshStandardMaterial (CanvasTexture for patterns)
```
First skin must be `{ id: 'classic', price: 0 }`.

### `src/audio.js`
```js
export const audio = { unlock(), play(name), setEnabled(bool), enabled }
// names: 'gateGood','gateBad','coin','gem','foodGood','foodBad','hit','win','lose','click','buy','boss','smash'
```
Pure WebAudio synthesis. `unlock()` is called on the first user tap. Never throws when audio is unavailable.

### `src/fx.js`
```js
export class FX {
  constructor(scene, camera, overlayEl)
  burst(position /*THREE.Vector3*/, color /*'#hex'*/, count = 16)
  popText(text, position /*THREE.Vector3*/, color = '#fff', size = 1)  // DOM text projected from 3D, floats up & fades
  shake(intensity = 0.3)          // sets this.shakeOffset (THREE.Vector3) that main.js adds to the camera
  update(dt)
  clear()
}
```

### `src/ui.js`
```js
export class UI {
  constructor(rootEl, handlers) // handlers: { onPlay, onNext, onRetry, onOpenShop, onCloseShop, onBuySkin(id), onEquipSkin(id), onToggleSound }
  showMenu(save)
  showHUD(save)
  updateHUD({ level, mass, coins, gems, progress })   // progress 0..1
  showWin({ level, coinsEarned, gemsEarned, multiplier })
  showLose({ level, reason })
  showShop(save, skins)   // re-render shop; call again after buy/equip
  hideAll()
  toast(text)
}
```

## Game rules (source of truth)

- Blob starts with `mass = CONFIG.startMass`. Its size grows with mass. The number floats above it.
- **Gates** come in pairs (left/right). Ops: `+N`, `-N`, `xN`, `÷N`. Blue = good, red = bad.
- **Food:** healthy (green) adds mass; junk (red/brown) removes mass. "Eat healthy" = grow.
- **Coins** (yellow) give run coins; **gems** (purple, rare) give gems.
- **Saws** slide side to side and cut mass. **Walls** carry a number: if mass > number you smash through and lose that number; otherwise you are stopped (lose).
- **Boss** waits at the finish with HP. If mass ≥ HP → win, with a coin multiplier (x1–x10) for leftover mass.
- Mass ≤ 0 → lose.
- Every level is seeded from its number, so level 7 is always the same level 7. Theme rotates every level.
- **No real money, no payments.** Coins and gems are earned only by playing.
