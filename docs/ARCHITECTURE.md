# Architecture & Module Contracts

**Game:** *Mass Dash* — an original brain-rot 3D runner (genre: "jelly run / tall man run").
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
| `src/bosses.js` | helper | The 8 boss mesh factories (built from Three.js primitives), rotated by level |
| `src/finale.js` | helper | Bonus stairs after the boss (x1 → x10 multiplier steps) |
| `src/trail.js` | helper | Slime trail and splat decals behind the character (pooled) |
| `src/quality.js` | helper | Watches FPS and steps render quality down on slow phones (never back up) |
| `src/haptics.js` | helper | Vibration feedback via `navigator.vibrate`, no-op when unsupported |
| `src/daily.js` | helper | Daily reward claim and streak (`save.lastDaily`, `save.dailyStreak`) |
| `src/tutorial.js` | helper | First-run "DRAG" hint overlay |
| `src/achievements.js` | helper | `BADGES` list and the rules that unlock them |
| `src/icons.js` | helper | Inline SVG icon strings (coin, gem, hand, etc.) |

## Coordinate system

- The player runs toward **negative Z**. Level items are stored by `d` (distance from start, positive); world `z = -d`.
- Track is centered on `x = 0`, half-width `CONFIG.trackHalfWidth` (3 units). Ground is `y = 0`.

## Module contracts (exports must match exactly)

### `src/save.js`
```js
export const DEFAULT_SAVE = { coins: 0, gems: 0, level: 1, best: 1, ownedSkins: ['drum', 'classic'], skin: 'drum', sound: true };
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
export const SKINS = [ { id, name, price, currency: 'coins'|'gems', color, color2, pattern, shape? } , ... ]
// pattern ∈ 'solid' | 'stripes' | 'dots' | 'checker' | 'rainbow' | 'glow'
// shape (optional, default 'blob'): 'blob' | 'log'. 'log' is the Triple T hero (id 'drum', default skin).
export function getSkin(id)            // -> skin (falls back to SKINS[0])
export function makeSkinMaterial(skin) // -> THREE.MeshStandardMaterial (CanvasTexture for patterns)
```
First skin must be `{ id: 'classic', price: 0 }` (the classic gloop blob). `drum` (Triple T) is the default equipped skin and is owned by everyone.

### `src/bosses.js`
```js
export function makeBossMesh(level, size) // -> { group, body, height, name }
// group: THREE.Group, origin on the floor, front faces +Z (toward the player)
// body:  the core mesh used for fair sizing (boss vs. player core size) and squash animation
// height: total height in world units; name: boss name shown on the banner
```
Eight designs rotate by level: `((level - 1) % 8)`. Names: Squalo Scarpettone, Coccodrillo Bombardone, Tazzina Ballerina, Scimmia Bananosa, Cactofante, Frigocammello, Ochetta Esplosiva, Alberello Scarpato.

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

## Level item shapes (`src/levels.js`, d = distance from start)

```js
{ type:'gate',   d, left:{op,value}, right:{op,value}, doubleBad?: true }  // doubleBad: both sides are red (pick the smaller loss); from level CONFIG.doubleBad.minLevel (2)
{ type:'food',   d, x, good:bool, value }   // good = healthy broccoli (grows); !good = ROTTEN MOLDY food (shrinks)
{ type:'coin',   d, x }
{ type:'gem',    d, x }
{ type:'saw',    d, x, amp, speed, damage }
{ type:'hammer', d, damage, speed }         // from level CONFIG.hammer.minLevel (3)
{ type:'pad',    d, x }                     // jump pad, from level CONFIG.jumpPad.minLevel (4)
{ type:'magnet', d, x }                     // coin magnet pickup, from level CONFIG.magnet.minLevel (5)
{ type:'wall',   d, x, width, value }
```

## Game rules (source of truth)

- Blob starts with `mass = CONFIG.startMass`. Its size grows with mass. The number floats above it.
- **Gates** come in pairs (left/right). Ops: `+N`, `-N`, `xN`, `÷N`. Blue = good, red = bad. From level 2 some pairs are flagged `doubleBad: true` (both choices red; a `-N` there is capped at 40% of expected mass).
- **Food:** healthy broccoli (`good: true`) adds mass; rotten moldy food (`good: false`) removes mass. "Eat healthy" = grow.
- **Coins** (yellow) give run coins; **gems** (purple, rare) give gems.
- **Saws** slide side to side and cut mass. **Walls** carry a number: if mass > number you smash through and lose that number; otherwise you are stopped (lose).
- **Boss** waits at the finish with HP and a name banner. Its size is set from the fight (`makeBossMesh(level, size)`), and it is kept fair versus the player's core size (`CONFIG.bossMinSizeGap`, `CONFIG.bossMaxRatio`). If mass ≥ HP → win, then bonus stairs (`finale.js`) pay a x1–x10 multiplier from leftover mass.
- Mass ≤ 0 → lose.
- Every level is seeded from its number, so level 7 is always the same level 7. Theme rotates every level.
- **No real money, no payments.** Coins and gems are earned only by playing.
