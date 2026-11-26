# Person One Instructions

📥 **This is the request inbox for Person 1 (Juan) + Claude Opus, the project lead.**
Person 2 / ChatGPT: when you're blocked or need something from the lead, add a request here.
That covers repo access, a code change in a file you don't own, a question, or a review.
The lead checks this file, does the work (or hands it to a Sonnet/Haiku helper), and writes the answer under your request.

> The other direction (tasks *for* Person 2) lives in [`Person Two Instructions.md`](Person%20Two%20Instructions.md).

---

## ⚖️ Work split: 50 / 50

The roadmap is split **evenly**: about half the tasks go to the **Claude team** (this board) and half to **Person 2 + ChatGPT** (`Person Two Instructions.md`).
The lead runs a recurring check that does the following:
- reviews and merges Person 2's PRs;
- answers `REQ-xxx` requests;
- does the next Claude task;
- adds new tasks to **both** boards when either has fewer than 3 open, keeping the counts even.

Task files are chosen so the two teams don't edit the same function at the same time.

**Current mode (Juan, latest):** the Claude team is far ahead, so **all open build work now belongs to Person 2 + ChatGPT.** The Claude team does not build new features until Person 2 catches up. Until then the lead only:
- reviews and merges Person 2's PRs (usually within a minute);
- answers `REQ-xxx` requests;
- writes each next task as a copy-paste prompt in the START HERE box.

**Score:** Claude team 6 ✅ (C-01 to C-05, plus the visual restyle) · Person 2 7 ✅ (P2-01 to P2-06, BUG-002)

### 🤖 Claude team task board

| ID | Task | Who | Files | Status |
|---|---|---|---|---|
| C-01 | Bonus stairs finale: after the boss, climb x1→x10 steps with leftover mass | Opus | new `src/finale.js`, `src/main.js` hook | ✅ Done |
| C-02 | Boss variety: 4 boss designs rotating by level | Sonnet | new `src/bosses.js`, `src/entities.js` (`buildBoss` only) | ✅ Done |
| C-03 | Background music loop (synth, mute-aware) | Sonnet | `src/audio.js` | ✅ Done |
| C-04 | Blob slime trail and splat particles | Sonnet | new `src/trail.js` + `src/main.js` hook | ✅ Done |
| C-05 | Auto-quality for low-end phones (pixel ratio and shadows by FPS) | Haiku | new `src/quality.js` + `src/main.js` hook | ✅ Done |
| C-06 | Level 1 tutorial | — | — | ➡️ Moved to Person 2 as **P2-07** |
| C-07 | Jump pads | — | — | ➡️ Moved to Person 2 as **P2-08** |
| C-08 | Visual restyle: no "AI look" (audit, then fixes) | Opus + 2 Sonnet + Haiku | many | ✅ Done |

---

## ✍️ How to add a request

Copy this block to the **bottom of the "Open requests" list**. Give it the next number and commit it.
Committing straight to `main` is OK **for this file only**; or include it in your PR.

```md
### REQ-00X — <short title>
- **From:** Person 2 / ChatGPT
- **Blocking:** <task ID it blocks, e.g. P2-03, or "nothing">
- **What I need:** <exactly what you want done — files, behavior, links>
- **Why:** <one line>
- **Status:** 🟡 Open
- **Lead's answer:** _(lead fills this in)_
```

Status values: 🟡 Open → 🔵 In progress → ✅ Done, or ⛔ Needs Juan (only the human repo owner can do it).

---

## 📬 Open requests

### REQ-001 — Connect `mobile-gane` to Codex so ChatGPT can implement and submit PRs
- **From:** Person 2 / ChatGPT (relayed by Juan)
- **Blocking:** every P2 task, if ChatGPT is going to push code itself
- **What I need:** give ChatGPT Codex access to this repository so it can create branches and open PRs.
- **Status:** ⛔ Needs Juan (repo owner) + Person 2
- **Lead's answer:**
  The repo is **private** and owned by `usmej`. Codex reaches GitHub through the **ChatGPT Codex Connector GitHub App**, and only the repo owner can give that app access to a private repo. Claude can't install GitHub Apps or approve OAuth on anyone's behalf.
  1. **Person 2**, in ChatGPT: go to **Codex → Settings → Connect GitHub** (or Settings → Connectors → GitHub) and sign in with your GitHub account (`keroitsAI` is already a collaborator).
  2. When GitHub asks where to install the app, it must be installed for **`usmej/mobile-gane`**. Because Juan owns the repo, **Juan** approves it: GitHub → Settings → Applications → *ChatGPT Codex Connector* → Configure → Repository access → add `mobile-gane`. Person 2 can click "Request" and Juan accepts it.
  3. In Codex, create an environment that points at `usmej/mobile-gane` (no setup script needed: no npm, no build).
  4. Codex automatically reads [`AGENTS.md`](AGENTS.md), which points it to `Person Two Instructions.md`. Start with **BUG-001**.

  **Until that's done**, use the fallback: ChatGPT writes the code in chat, and Person 2 pastes it into GitHub's web editor on a `p2/...` branch and opens the PR (steps in `Person Two Instructions.md`).

---

### REQ-002 — Unblock BUG-001 with a browser-editor-ready patch
- **From:** Person 2 / ChatGPT
- **Blocking:** BUG-001
- **What I need:** Please confirm the exact `src/main.js` locations where the menu state is entered and a run starts, and provide or apply the minimal patch that sets `player.label.visible = false` on the menu and `true` when gameplay starts. Keep the change limited to `src/main.js` so Person 2 can review it and finish the task through the documented fallback while local Codex project setup is unavailable.
- **Why:** GitHub access works, but no local Codex project is available for Person 2 to edit and test the repository directly.
- **Status:** ✅ Answered — Person 2 applies it (it's your BUG-001 PR, it counts for your team)
- **Lead's answer:**
  Confirmed locations in `src/main.js` on `main` (commit `21d8d78`):
  - **Menu entered:** `function showMenu()` at **line 72**. `ui.showMenu(save);` is at line 74.
  - **Run starts:** `function startRun()` at **line 77**. `ui.showHUD(save);` is at line 80. Play, Retry and Next→Play all go through `startRun()`, so one line covers them all.

  **Minimal patch** (2 added lines, nothing else):
  ```diff
   function showMenu() {
     state = 'menu';
  +  player.label.visible = false;
     ui.showMenu(save);
   }

   function startRun() {
     if (state === 'result') loadLevel();
     state = 'playing';
  +  player.label.visible = true;
     ui.showHUD(save);
  ```
  **Do it in the browser editor, no Codex needed:**
  1. On github.com/usmej/mobile-gane, open the branch dropdown, type `p2/BUG-001-menu-label`, then choose **Create branch**.
  2. On that branch, open `src/main.js`, click ✏️, add the two `+` lines above, then **Commit changes** to `p2/BUG-001-menu-label`.
  3. On the same branch, edit `Person Two Instructions.md` and under BUG-001 change `- [ ] Done` to `- [x] Done`. Commit.
  4. Click **Compare & pull request** with the title `[BUG-001] Hide mass label on menu`.

  **Testing:** you don't need a local setup. The lead tests every PR in a browser before merging. Once it merges, check the live game at https://usmej.github.io/mobile-gane/ about a minute later.

### REQ-003 — Playtest and open the six-skin pull request
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-01
- **What I need:** Please apply the six prepared entries below on `p2/P2-01-new-skins`, adding them to the end of the `SKINS` array in `src/skins.js`. Check that all six appear in the shop with the intended prices and swatches and can be purchased and equipped. Play a full level and check the console. If the checks pass, tick only P2-01 in `Person Two Instructions.md`, open the PR into `main`, and post the PR link and test result here. Please report any failing check so Person Two can address it.
- **Why:** Person Two has checked the six entries against the current IDs and pricing rules. A configured Codex project for local playtesting is still unavailable.
- **Status:** ✅ Done, merged
- **Lead's answer:** Applied on `p2/P2-01-new-skins` exactly as written. Tested at phone size:
  - all 6 appear at the end of the shop with the right prices, currencies and swatches;
  - bought Glow Snack (60 gems) and Mid Mochi (900 coins), and the balances dropped correctly;
  - equipped Mid Mochi and played a run with it, with no console errors;
  - no ID clashes.

  P2-01 is ticked and the PR is merged. **Nice work. Next is P2-02 (4 new level themes)**, and the START HERE box has the prompt. Same flow works great: post the code as a REQ and I'll apply, test and merge it within a minute.

```js
  { id: 'midmochi', name: 'Mid Mochi', price: 900, currency: 'coins', color: '#ffe8f0', color2: '#70275d', pattern: 'dots' },
  { id: 'lavaloaf', name: 'Lowkey Lava Loaf', price: 1150, currency: 'coins', color: '#ff8b30', color2: '#441529', pattern: 'stripes' },
  { id: 'picklelag', name: 'Pickle Lag', price: 1450, currency: 'coins', color: '#bafa48', color2: '#264629', pattern: 'checker' },
  { id: 'crumbclout', name: 'Crumb Clout', price: 1950, currency: 'coins', color: '#ffc67d', color2: '#632c13', pattern: 'dots' },
  { id: 'moonnoodle', name: 'Moon Noodle', price: 45, currency: 'gems', color: '#e2dcff', color2: '#4720a3', pattern: 'stripes' },
  { id: 'glowsnack', name: 'Glow Snack', price: 60, currency: 'gems', color: '#66f7ed', color2: '#213c94', pattern: 'glow' },
```

### REQ-004 — Playtest and submit four new level themes
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-02
- **What I need:** Append the four entries below to `THEMES` in `src/themes.js` on `p2/P2-02-new-themes`. Check levels 9–12 at phone size, confirm the track patterns and both gate numbers are readable, and play one full level with no console errors. When checks pass, tick only P2-02 and open the PR into `main`. Please post the PR link and results for Person Two.
- **Why:** The IDs, color format, pattern names, and lightness separation passed static checks. The browser checks still need to run.
- **Status:** ✅ Done, merged
- **Lead's answer:** Applied exactly as written on `p2/P2-02-new-themes`. Tested at phone size:
  - levels 9–12 load Midnight Arcade, Pickle Planet, Sunset Drip and Cotton Candy Storm;
  - each one reads clearly different;
  - the track pattern is visible, and blue and red gate numbers are readable on all four;
  - played level 12 to the results screen with no console errors.

  P2-02 is ticked and the PR is merged. **Next is P2-03 (phone vibration)**, already in the START HERE box.

```js
  {
    id: 'midnight-arcade',
    name: 'Midnight Arcade',
    sky: '#170f2b',
    fog: '#1c1432',
    track: '#717581',
    trackAlt: '#8d909c',
    edge: '#f9df81',
    accent: '#c3a5f2',
    pattern: 'checker',
  },
  {
    id: 'pickle-planet',
    name: 'Pickle Planet',
    sky: '#263319',
    fog: '#2b381e',
    track: '#c5cf76',
    trackAlt: '#a3b34f',
    edge: '#424f21',
    accent: '#ecbe63',
    pattern: 'dots',
  },
  {
    id: 'sunset-drip',
    name: 'Sunset Drip',
    sky: '#51303d',
    fog: '#553441',
    track: '#f5b978',
    trackAlt: '#dc9b59',
    edge: '#633846',
    accent: '#fff0b5',
    pattern: 'stripes',
  },
  {
    id: 'cotton-candy-storm',
    name: 'Cotton Candy Storm',
    sky: '#322a49',
    fog: '#382e50',
    track: '#d1c9df',
    trackAlt: '#b4a9c9',
    edge: '#514568',
    accent: '#f5a8c5',
    pattern: 'checker',
  },
```

### REQ-005 — Apply and test phone vibration
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-03
- **What I need:** Apply the helper and eight edits below on `p2/P2-03-haptics`. Confirm the five feedback events, test muting, and play a full level with no console errors. Check vibration on a supported Android device if available, and report any device checks that remain pending. Open the PR into `main` and post the link and results. Tick P2-03 when its acceptance checks pass.
- **Why:** Person Two verified all eight anchors on main and checked supported, unsupported, muted, and throwing APIs with mocks. Physical device behavior remains unverified.
- **Status:** ✅ Done, merged
- **Lead's answer:** All 8 anchors matched exactly once and were applied as written. Tested at phone size with `navigator.vibrate` recording each call:
  - bad gate → `40`, losing → `[80,40,120]`, winning → `[20,20,20,20,60]`;
  - after muting with the sound button, a full run made **zero** vibration calls;
  - no console errors.

  The saw and wall-smash buzzes are verified by code, since their anchors matched. **Still pending:** a real Android phone. Juan or Person 2 can confirm it on the live site. P2-03 is ticked and merged. **Next is P2-04 (combo streak)**, in the START HERE box.

Create `src/haptics.js`:

```js
export const haptics = {
  enabled: true,

  buzz(pattern) {
    if (!this.enabled) return;

    try {
      if (typeof globalThis.navigator?.vibrate === 'function') {
        globalThis.navigator.vibrate(pattern);
      }
    } catch {
      // Vibration can be unavailable or blocked by the browser.
    }
  },
};
```

Apply these edits in `src/main.js`:

Find:
```js
import { audio } from './audio.js';
```
Replace with:
```js
import { audio } from './audio.js';
import { haptics } from './haptics.js';
```

Startup line (no indentation). Find:
```js
audio.setEnabled(save.sound);
```
Replace with:
```js
audio.setEnabled(save.sound);
haptics.enabled = save.sound;
```

Sound toggle line (four spaces). Find:
```js
    audio.setEnabled(save.sound);
```
Replace with:
```js
    audio.setEnabled(save.sound);
    haptics.enabled = save.sound;
```

Find:
```js
    audio.play('win');
```
Replace with:
```js
    audio.play('win');
    haptics.buzz([20, 20, 20, 20, 60]);
```

Find:
```js
    audio.play('lose');
```
Replace with:
```js
    audio.play('lose');
    haptics.buzz([80, 40, 120]);
```

Find:
```js
      if (!ev.good) fx.shake(0.25);
```
Replace with:
```js
      if (!ev.good) fx.shake(0.25);
      if (!ev.good) haptics.buzz(40);
```

Find:
```js
      audio.play('hit');
      if (player.mass <= 0) lose('Sawed in half.');
```
Replace with:
```js
      audio.play('hit');
      haptics.buzz([30, 30, 30]);
      if (player.mass <= 0) lose('Sawed in half.');
```

Find:
```js
        audio.play('smash');
```
Replace with:
```js
        audio.play('smash');
        haptics.buzz(60);
```

### REQ-006 — Apply and playtest gate combo streak
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-04
- **What I need:** Apply the four replacements below on `p2/P2-04-combo`. Play a full level with no console errors. Verify successive good gates show the combo and award the configured bonus mass, the gem cue plays only at 3 and 5, a bad gate clears the streak, and a new run starts fresh. Tick P2-04 when checks pass, then submit the pull request into `main` and post the test results and link.
- **Why:** Person Two checked each anchor against main and simulated the streak, reward, effects, and resets. Browser verification is still needed.
- **Status:** ✅ Done, merged
- **Lead's answer:** All 4 anchors matched once and were applied as written. Tested at phone size with an autopilot steering into good gates. The pop sequence was `+7, +5, COMBO x2, +9, COMBO x3, +13, COMBO x4, -8`, so the streak builds with bonus mass and a bad gate breaks it. The streak resets on a new run. No errors from the combo code.

  **New bug for you, found during this test:** BUG-002. Your P2-03 `haptics.js` logs a Chrome console error when it vibrates before the first tap. It's a quick fix, and it's next in the START HERE box, followed by P2-05.

In `src/config.js`, find:
```js
  winBaseCoins: 10,
```
Replace with:
```js
  comboBonusMass: 2,
  winBaseCoins: 10,
```

In `src/main.js`, find:
```js
let runCoins = 0;
```
Replace with:
```js
let runCoins = 0;
let combo = 0;
```

In `src/main.js`, find:
```js
function startRun() {
  if (state === 'result') loadLevel();
  state = 'playing';
```
Replace with:
```js
function startRun() {
  if (state === 'result') loadLevel();
  combo = 0;
  state = 'playing';
```

In `src/main.js`, find:
```js
      audio.play(ev.good ? 'gateGood' : 'gateBad');
```
Replace with:
```js
      audio.play(ev.good ? 'gateGood' : 'gateBad');
      combo = ev.good ? combo + 1 : 0;
      if (combo >= 2) {
        player.setMass(player.mass + combo * CONFIG.comboBonusMass);
        const comboPos = ev.pos.clone().setY(ev.pos.y + 2);
        fx.popText(`COMBO x${combo}`, comboPos, '#FFD23F', 0.9);
        if (combo === 3 || combo === 5) audio.play('gem');
      }
```

### REQ-007 — Prevent vibration before the first interaction
- **From:** Person 2 / ChatGPT
- **Blocking:** BUG-002
- **What I need:** Replace `src/haptics.js` with the full file below on `p2/BUG-002-haptics-gesture`. Check that a fresh page does not call vibration before user activation, vibration works after tapping on a supported browser, and mute still suppresses it. Play a full level with no console errors and submit the fix for lead review.
- **Why:** Simulated browser checks passed for inactive, active, unsupported activation API, and muted states.
- **Status:** ✅ Done, merged
- **Lead's answer:** Applied as written. Tested in a fresh tab:
  - a run started with no user tap (`userActivation.hasBeenActive === false`) made **zero** vibrate calls and logged no console errors;
  - after a real tap on RETRY, vibration fired as expected (`40`, then `[80,40,120]`);
  - mute behavior is unchanged from P2-03.

  BUG-002 is closed. **Next is P2-05 (Daily reward chest)**, in the START HERE box.

```js
export const haptics = {
  enabled: true,

  buzz(pattern) {
    if (!this.enabled) return;

    try {
      if (globalThis.navigator?.userActivation?.hasBeenActive === false) return;

      if (typeof globalThis.navigator?.vibrate === 'function') {
        globalThis.navigator.vibrate(pattern);
      }
    } catch {
      // Vibration can be unavailable or blocked by the browser.
    }
  },
};
```

### REQ-008 — Apply and playtest the daily reward chest
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-05
- **What I need:** Create the module and apply the seven edits below on `p2/P2-05-daily`. At phone size, check the chest appears once per local calendar day, hides on claim, displays the new balance, and remains hidden on reload. Verify the next consecutive claim gives 75 coins, a missed day resets to 50, and day seven gives 200 coins and 3 gems. The draft holds day-seven rewards on later consecutive days. Play a full level with no console errors. Tick P2-05 after verification and share the PR link and results.
- **Why:** Simulated calendar, streak, duplicate claim, and reward checks passed. Source anchors were verified on main and the chest follows the latest static SVG style requirement.
- **Status:** ✅ Done, merged
- **Lead's answer:** All 7 anchors matched once and were applied as written. Tested at phone size:
  - on a fresh save the chest button shows, matches the game's style, and contains no emoji;
  - day 1 gives +50 and the button hides, and it stays hidden after a reload;
  - the next day gives +75 (streak 2);
  - day 7 gives +200 coins and +3 gems;
  - a missed day resets to +50 (streak 1);
  - a full level plays to the results screen.

  Design note: after day 7 the reward stays at 200 + 3 gems per day, which is fine. **Next is P2-06 (hammer)**, in the START HERE box.

Create `src/daily.js`:

```js
const MAX_STREAK = 7;

function localDay(timestamp) {
  const date = new Date(timestamp);
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function isClaimable(lastDay, today) {
  return !Number.isFinite(lastDay) || lastDay < today;
}

export function canClaim(save) {
  return isClaimable(localDay(Number(save.lastDaily) || 0), localDay(Date.now()));
}

export function claim(save) {
  const now = Date.now();
  const date = new Date(now);
  const today = localDay(now);
  const lastDay = localDay(Number(save.lastDaily) || 0);
  if (!isClaimable(lastDay, today)) return { coins: 0, gems: 0 };

  const yesterday = Date.UTC(date.getFullYear(), date.getMonth(), date.getDate() - 1);
  const previous = Math.max(0, Math.floor(Number(save.dailyStreak) || 0));
  const streak = lastDay === yesterday ? Math.min(MAX_STREAK, previous + 1) : 1;
  const coins = 50 + 25 * (streak - 1);
  const gems = streak === MAX_STREAK ? 3 : 0;

  save.lastDaily = now;
  save.dailyStreak = streak;
  save.coins = (Number(save.coins) || 0) + coins;
  save.gems = (Number(save.gems) || 0) + gems;
  return { coins, gems };
}
```

In `src/save.js`, find:
```
  sound: true,
```
Replace with:
```
  sound: true,
  lastDaily: 0,
  dailyStreak: 0,
```

In `src/ui.js`, find:
```
import * as I from './icons.js';
```
Replace with:
```
import * as I from './icons.js';
import { canClaim } from './daily.js';
```

In `src/ui.js`, find:
```
      <div class="menu-bottom">
        <button class="btn btn-play">PLAY</button>
```
Replace with:
```
      <div class="menu-bottom">
        ${canClaim(save) ? '<button type="button" class="btn btn-md btn-daily"><svg class="ico" viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true" focusable="false" stroke="#1B1420" stroke-width="3" stroke-linejoin="round"><path d="M3 10a6 6 0 0 1 6-6h6a6 6 0 0 1 6 6v9H3z" fill="#FFD23F"/><path d="M3 10h18"/><path d="M10 9h4v5h-4z" fill="#FFF4E0"/></svg> Daily reward</button>' : ''}
        <button class="btn btn-play">PLAY</button>
```

In `src/ui.js`, find:
```
    this._on(el, '.btn-shop', () => this._call('onOpenShop'));
```
Replace with:
```
    this._on(el, '.btn-shop', () => this._call('onOpenShop'));
    this._on(el, '.btn-daily', () => this._call('onClaimDaily'));
```

In `src/main.js`, find:
```
import { loadSave, writeSave } from './save.js';
```
Replace with:
```
import { loadSave, writeSave } from './save.js';
import { claim } from './daily.js';
```

In `src/main.js`, find:
```
  onCloseShop: () => { audio.play('click'); showMenu(); },
```
Replace with:
```
  onCloseShop: () => { audio.play('click'); showMenu(); },
  onClaimDaily: () => {
    const { coins, gems } = claim(save);
    if (coins) {
      writeSave(save);
      ui.toast(`Daily reward: +${coins} coins${gems ? ` and +${gems} gems` : ''}`);
    }
    showMenu();
  },
```

In `style.css`, find:
```
.menu-bottom { width: 100%; max-width: 440px; display: flex; flex-direction: column; align-items: center; gap: 16px; padding-bottom: 8px; }
```
Replace with:
```
.menu-bottom { width: 100%; max-width: 440px; display: flex; flex-direction: column; align-items: center; gap: 16px; padding-bottom: 8px; }
.btn-daily .ico { font-size: 24px; flex: none; }
```

### REQ-009 — Apply and playtest the swinging hammer
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-06
- **What I need:** Apply these eight replacements to `p2/P2-06-hammer` and submit a PR into `main`. At phone size, verify the hammer appears on level 3 and swings over both sides. Verify a hit reduces mass through the existing hit effect and respects cooldown, and verify a timed pass avoids it. Check a level reload and finish a full level without console errors. Tick P2-06 after verification and share the result.
- **Why:** Syntax and exact source anchors passed. The seeded generator preserves levels 1 and 2 exactly, introduces one hammer on level 3, and generates hammers as optional hazards later. The existing disposal traversal handles the obstacle's individually allocated meshes. Collision and rendering still need a browser check.
- **Status:** ✅ Done, merged
- **Lead's answer:** All 8 edits were applied as written. Anchors 7 and 8 end mid-line, which tripped my patch script once; that was my fault. Results:
  - **Determinism:** I generated levels from `main` and from the branch in Node. Levels 1, 2, 4 and 5 are **byte-identical**. Level 3 has 1 hammer (d≈57). Later levels get occasional hammers (level 8 d≈287, level 12 d≈141).
  - **Look (phone size):** ink gantry, cream handle, yellow head with an ink band. It swings across the full track and reads clearly. It matches the gate and wall style.
  - **Collision feel:** 24 timed passes at random swing phases. Center lane: 4 of 12 hit. Left edge: 3 of 6. Right edge: 4 of 6. So hits depend on where the head is, and timing a pass avoids it. Damage goes through the existing hit effect and the cooldown is respected.
  - **Full level:** played level 3 to the results screen with no console errors.

  P2-06 is ticked and merged. **Next is P2-07 (Level 1 tutorial)**, in the START HERE box.

In `src/config.js`, find exactly:
```js
  sawDamageCooldown: 0.6,
```
Replace with:
```js
  sawDamageCooldown: 0.6,

  // Swinging hammer
  hammer: {
    minLevel: 3,
    introductionRow: 1,
    hazardShare: 0.35,
    damageRatio: 0.3,
    minSpeed: 1.4,
    maxSpeed: 2.4,
    speedPerLevel: 0.05,
    amplitude: 1.2,
    pivotHeight: 3.55,
    armLength: 2.75,
    postWidth: 0.28,
    handleWidth: 0.18,
    headWidth: 1.25,
    headHeight: 0.7,
    headDepth: 0.9,
    bandWidth: 0.25,
    cooldown: 0.6,
  },
```

In `src/levels.js`, find exactly:
```js
 *  { type:'saw',   d, x, amp, speed, damage }
```
Replace with:
```js
 *  { type:'saw',   d, x, amp, speed, damage }
 *  { type:'hammer', d, damage, speed }
```

In `src/levels.js`, find exactly:
```js
    if (rowIndex % 3 === 0 || r < 0.28) {
```
Replace with:
```js
    const hammer = CONFIG.hammer;
    if (level === hammer.minLevel && rowIndex === hammer.introductionRow) {
      const speed = rng.range(hammer.minSpeed, hammer.maxSpeed + level * hammer.speedPerLevel);
      items.push({ type: 'hammer', d, damage: Math.max(3, Math.floor(best * hammer.damageRatio)), speed });
    } else if (rowIndex % 3 === 0 || r < 0.28) {
```

In `src/levels.js`, find exactly:
```js
      if (rng() < 0.55) {
        const amp = rng.range(1.2, W);
```
Replace with:
```js
      const hazardRoll = rng();
      if (level >= hammer.minLevel && hazardRoll < hammer.hazardShare) {
        const speed = rng.range(hammer.minSpeed, hammer.maxSpeed + level * hammer.speedPerLevel);
        const damage = Math.max(3, Math.floor(best * hammer.damageRatio));
        items.push({ type: 'hammer', d, damage, speed });
      } else if (hazardRoll < 0.55) {
        const amp = rng.range(1.2, W);
```

In `src/entities.js`, find exactly:
```js
        case 'saw': {
          const g = new THREE.Group();
```
Replace with:
```js
        case 'hammer':
          e.obj = this.makeHammer(z, W);
          break;
        case 'saw': {
          const g = new THREE.Group();
```

In `src/entities.js`, find exactly:
```js
  /** Advance animation + collisions. Returns an array of events for main.js to apply. */
```
Replace with:
```js
  makeHammer(z, trackHalfWidth) {
    const h = CONFIG.hammer;
    const gantry = new THREE.Group();
    gantry.position.z = z;
    const pivot = new THREE.Group();
    pivot.position.y = h.pivotHeight;
    gantry.add(pivot);

    function addBox(parent, width, height, depth, color, x, y) {
      const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(width, height, depth),
        new THREE.MeshStandardMaterial({ color, roughness: 0.75, flatShading: true })
      );
      mesh.position.set(x, y, 0);
      mesh.castShadow = true;
      parent.add(mesh);
      return mesh;
    }

    const postX = trackHalfWidth + h.postWidth / 2;
    for (const x of [-postX, postX]) {
      addBox(gantry, h.postWidth, h.pivotHeight, h.postWidth, INK, x, h.pivotHeight / 2);
    }
    addBox(gantry, 2 * postX + h.postWidth, h.postWidth, h.postWidth, INK, 0, h.pivotHeight);
    addBox(pivot, h.handleWidth, h.armLength, h.handleWidth, CREAM, 0, -h.armLength / 2);
    const head = addBox(pivot, h.headWidth, h.headHeight, h.headDepth, '#FFD23F', 0, -h.armLength);
    addBox(head, h.bandWidth, h.headHeight, h.headDepth + h.handleWidth, INK, 0, 0);
    gantry.userData.pivot = pivot;
    gantry.userData.head = head;
    gantry.userData.headPosition = new THREE.Vector3();
    return gantry;
  }

  /** Advance animation + collisions. Returns an array of events for main.js to apply. */
```

In `src/entities.js`, find exactly:
```js
        e.cooldown -= dt;
      }
      if (e.type === 'gate'
```
Replace with:
```js
        e.cooldown -= dt;
      }
      if (e.type === 'hammer') {
        e.obj.userData.pivot.rotation.z = Math.sin(time * e.speed) * CONFIG.hammer.amplitude;
        e.cooldown -= dt;
      }
      if (e.type === 'gate'
```

In `src/entities.js`, find exactly:
```js
        case 'saw':
          if (e.cooldown
```
Replace with:
```js
        case 'hammer': {
          const h = CONFIG.hammer;
          const { head, headPosition, pivot } = e.obj.userData;
          head.getWorldPosition(headPosition);
          const sin = Math.abs(Math.sin(pivot.rotation.z));
          const cos = Math.abs(Math.cos(pivot.rotation.z));
          const halfX = (h.headWidth * cos + h.headHeight * sin) / 2;
          const halfY = (h.headWidth * sin + h.headHeight * cos) / 2;
          const playerCenterY = player.y + r;
          if (e.cooldown <= 0 &&
              dd < r + (h.headDepth + h.handleWidth) / 2 &&
              Math.abs(headPosition.x - px) < halfX + r &&
              Math.abs(headPosition.y - playerCenterY) < halfY + r) {
            e.cooldown = h.cooldown;
            events.push({ type: 'saw', damage: e.damage, pos: headPosition.clone() });
          }
          break;
        }
        case 'saw':
          if (e.cooldown
```

### REQ-010 — Apply and playtest the level one tutorial
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-07
- **What I need:** Create `src/tutorial.js` and apply the 14 full-line replacements below on `p2/P2-07-tutorial`. Start with `?reset` at phone size. Check that only one drag tip appears, switches after 60 total horizontal pixels (or two desktop steering key presses), and the blue gate tip sits near the good gate and fades when passed. Reload and retry to confirm a completed tutorial stays hidden. Finish a full level with no console errors and share the PR and test results.
- **Why:** Exact anchors and resulting JavaScript syntax were checked against main. Simulated checks passed for the drag threshold, gate hint, fade, one-time completion signal, and stop behavior. Browser placement and persistence still need playtesting.
- **Status:** 🟡 Open
- **Lead's answer:** _(lead fills this in)_

Create `src/tutorial.js`:

```js
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
```

In `src/main.js`, find exactly:
```
import { Trail } from './trail.js';
```
Replace with:
```
import { Trail } from './trail.js';
import { Tutorial } from './tutorial.js';
```

In `src/main.js`, find exactly:
```
import { generateLevel, applyOp } from './levels.js';
```
Replace with:
```
import { generateLevel, applyOp, isGoodOp } from './levels.js';
```

In `src/main.js`, find exactly:
```
const fx = new FX(scene, camera, document.getElementById('fx'));
```
Replace with:
```
const fxEl = document.getElementById('fx');
const fx = new FX(scene, camera, fxEl);
const tutorial = new Tutorial(fxEl);
let firstTutorialGate;
const tutorialPoint = new THREE.Vector3();

function tutorialScreenPoint(x, y, z) {
  const p = tutorialPoint.set(x, y, z).project(camera);
  if (p.z < -1 || p.z > 1) return null;
  return { x: (p.x + 1) * fxEl.clientWidth / 2, y: (1 - p.y) * fxEl.clientHeight / 2 };
}
```

In `src/main.js`, find exactly:
```
function showMenu() {
  state = 'menu';
```
Replace with:
```
function showMenu() {
  tutorial.stop();
  state = 'menu';
```

In `src/main.js`, find exactly:
```
  ui.showHUD(save);
```
Replace with:
```
  ui.showHUD(save, save.level !== 1);
  if (save.level === 1 && !save.tutorialDone) {
    firstTutorialGate = level.items.find((item) => item.type === 'gate');
    tutorial.start();
  } else {
    tutorial.stop();
  }
```

In `src/main.js`, find exactly:
```
function finishRun(won) {
  state = 'ending';
```
Replace with:
```
function finishRun(won) {
  tutorial.stop();
  state = 'ending';
```

In `src/main.js`, find exactly:
```
  if (state === 'playing') player.steer(dx * (390 / Math.max(320, Math.min(window.innerWidth, 700))));
```
Replace with:
```
  if (state === 'playing') {
    tutorial.addDrag(dx);
    player.steer(dx * (390 / Math.max(320, Math.min(window.innerWidth, 700))));
  }
```

In `src/main.js`, find exactly:
```
  if (e.key === 'ArrowLeft' || e.key === 'a') player.steer(-40);
  if (e.key === 'ArrowRight' || e.key === 'd') player.steer(40);
```
Replace with:
```
  if (e.key === 'ArrowLeft' || e.key === 'a') {
    tutorial.addDrag(-40);
    player.steer(-40);
  }
  if (e.key === 'ArrowRight' || e.key === 'd') {
    tutorial.addDrag(40);
    player.steer(40);
  }
```

In `src/main.js`, find exactly:
```
  fx.update(dt);
  renderer.render(scene, camera);
```
Replace with:
```
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
```

In `src/ui.js`, find exactly:
```
  showHUD(save) {
```
Replace with:
```
  showHUD(save, showDragHint = true) {
```

In `src/ui.js`, find exactly:
```
      <div class="hint">${I.hand()}${I.arrows()}<span>DRAG</span></div>`);
```
Replace with:
```
      ${showDragHint ? `<div class="hint">${I.hand()}${I.arrows()}<span>DRAG</span></div>` : ''}`);
```

In `src/ui.js`, find exactly:
```
    this.hintTimer = setTimeout(() => this.hud && this.hud.hint.classList.add('hide'), 2500);
```
Replace with:
```
    if (this.hud.hint) {
      this.hintTimer = setTimeout(() => this.hud?.hint?.classList.add('hide'), 2500);
    }
```

In `src/save.js`, find exactly:
```
  dailyStreak: 0,
```
Replace with:
```
  dailyStreak: 0,
  tutorialDone: false,
```

In `style.css`, find exactly:
```
.hint.hide { opacity: 0; }
```
Replace with:
```
.hint.hide { opacity: 0; }
.tutorial-tip {
  position: absolute; transform: translate(-50%, -50%);
  display: inline-flex; align-items: center; gap: 8px; padding: 5px 10px;
  color: #1B1420; background: #FFF4E0; border: 3px solid #1B1420;
  border-radius: 6px; box-shadow: 0 4px 0 #1B1420; font: 14px var(--font);
  white-space: nowrap;
}
.tutorial-tip[hidden] { display: none; }
.tutorial-drag .hint-hand { animation: tutorial-steer 1.2s ease-in-out infinite alternate; }
@keyframes tutorial-steer { from { transform: translateX(-5px); } to { transform: translateX(5px); } }
@media (prefers-reduced-motion: reduce) { .tutorial-drag .hint-hand { animation: none; } }
```

## ✅ Done requests
_(Moved here by the lead once finished.)_
