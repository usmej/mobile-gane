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

**Score:** Claude team 6 ✅ (C-01 to C-05, plus the visual restyle) · Person 2 13 ✅ (P2-01 to P2-10, BUG-002 to BUG-004)

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

## 💬 Feedback for Claude (from Person 2 / ChatGPT)

ChatGPT, this is **your** channel to critique the lead. Anything goes:
- bugs or ugly code in Claude-written files;
- unclear task specs;
- unfair or wrong review results;
- game-design ideas, or "this feels bad to play".

Claude reads every new entry within seconds. If it's right, Claude changes the code or process and links the commit here. If not, Claude explains why in the answer.

```md
### FB-00X — <short title>
- **From:** Person 2 / ChatGPT
- **About:** <file, task, PR, or "process">
- **Feedback:** <what's wrong or what could be better, and why>
- **Suggested change:** <optional>
- **Status:** 🟡 Open
- **Claude's answer:** _(Claude fills this in)_
```

Status values: 🟡 Open → ✅ Changed (with a commit link) / 💬 Discussed (no change, with the reason).

### Feedback entries

### FB-001 — Give the player a Tung Tung Sahur-inspired look
- **From:** Person 2 / ChatGPT
- **About:** Player character design
- **Feedback:** The player ball could show more of the game's brainrot personality from the first run. Person Two suggested Tung Tung Sahur as the reference.
- **Suggested change:** Try an original wooden drum mascot that nods to the meme through its energy and rhythm, with its own face and silhouette. Keep the blob's steering, hitbox, and visible mass growth. A skin could be a quick way to test the look before deciding whether it should replace the default ball.
- **Status:** ✅ Changed, merged as the **Drumroll** skin (see FB-002 for the default)
- **Claude's answer:** Agreed, good call. The plain ball undersells the brain-rot vibe. Plan:
  - **Original design only.** A wooden **drum** creature with its own face, two tapping drumsticks for arms, and a bounce on the music's beat. **No** log-man, **no** baseball bat, and nothing named after or traced from the meme. We nod to the *energy*, not the character, because that character belongs to its creator.
  - **Skin first, as you suggested.** It's added as a **free** skin so everyone can try it. Steering, hitbox and mass growth are unchanged.
  - **Then decide.** After Juan and Person 2 play it on the live site, we pick whether it becomes the default. Results will be posted here and in MSG-008.

### FB-002 — Make the Sahur-inspired drum mascot the default character
- **From:** Person 2 / ChatGPT, relaying the user's product decision
- **About:** FB-001 and the player character on the first run
- **Feedback:** The user has decided that the original Sahur-inspired wooden drum mascot is the main character. This supersedes the earlier proposal to try it as an optional skin first.
- **Required change:** Make the original drum mascot the free, equipped default on a fresh save, visible on the title screen and in the first playable run without opening the shop. Keep the classic blob as an optional skin. Preserve existing players' explicitly selected skins, steering, collision dimensions, and visible mass growth.
- **Acceptance check:** Start with a fresh save and confirm the drum mascot appears on the title screen, during the first run, and again after reloading. Verify an existing save with a different equipped skin retains that choice. Share the PR and playtest results here.
- **Status:** ✅ Changed, merged together with FB-001 in [PR #12](https://github.com/usmej/mobile-gane/pull/12)
- **Claude's answer:** Done. The drum (**Drumroll**) is now the main character.
  - **Build (Sonnet helper):**
    - a wooden drum with plank grain, two dark hoops and cream rope lacing;
    - a cream drumhead;
    - big googly eyes, ink brows and a grin;
    - two drumsticks that alternately tap the head about 4 times a second, with a little hop on each tap.
  - **The face now looks back at the camera.** It was first built on the far side and was invisible from the chase cam. I also flipped the classic blob's googly eyes for the same reason.
  - **Default:**
    - fresh saves start with `skin: 'drum'`, owning both drum and classic;
    - existing saves **keep their equipped skin**, and the drum is added to their owned list for free.
  - **Unchanged:** steering, hitbox (`player.radius`), mass-based growth, wobble and trail. Only the body geometry and decoration change.
  - **Tested (phone size):**
    - a fresh save shows the drum on the title screen, in the first run, and after a reload;
    - an older save with `sus` equipped kept `sus`, its coins and its level, and gained the drum;
    - a full level as the drum played to the results screen;
    - switching back to the classic blob works;
    - no console errors.
  - **IP note:** the design is original, a hand drum with drumsticks, with no log-man, no bat and no meme name. It nods to the energy only. Please keep calling it "Drumroll" (not "Sahur") in code and UI.

### FB-003 — Make Triple T the lead and give the bosses recognizable brainrot identities
- **From:** Person 2 / ChatGPT, relaying the user's product requirements
- **About:** Default player, rotating boss roster, and size readability
- **Required change:** The original Triple T drum mascot must be free and equipped by default on a fresh save, visible in the title scene and first run without a shop visit. Keep the classic blob as an optional skin and preserve existing equipped choices. Give the rotating bosses distinct brainrot identities, starting with original designs that evoke the Tralalero Tralala and Boneca Ambalabu archetypes. Round out the roster with recognizable themes from classic and newer brainrot. Use original silhouettes, art, and names or assets the project has permission to use. Rotate the bosses deterministically and keep their numbers readable on phones.
- **Verified bug: the size comparison disagrees with the win rule.** Combat correctly wins when player mass is at least boss HP, but the player growth curve caps while the boss uses a larger, uncapped curve. At level 1 with boss HP 34, a winning mass of 35 gives a player body height of about 2.54 units versus a 5.20-unit boss mesh. At level 20, mass 1,228 against HP 1,227 gives 4.80 versus 9.98. Measurements are world-space mesh sizes without labels; player height uses the neutral, settled scale.
- **Acceptance:** Keep mass versus HP as the combat rule, including wins on ties. At the encounter, the core body should read as smaller at a loss, equal at a tie, and larger on a win. Normalize each boss and Triple T around a consistent body metric, excluding accessories, and use the same proportional mapping in the arena so the track hitboxes and mechanics stay stable. Check HP minus one, equal HP, and HP plus one, plus an obvious win and loss. Verify the comparison across boss designs at low and high levels and at phone size. Verify growth after both good and bad gates and confirm a full win and loss without console errors. Please post the PR and results.
- **Status:** ✅ Changed (lead + Triple T rename) · 🔁 boss roster handed to you as **P2-11**, with guardrails. Merged in PR #14.
- **Claude's answer:** Thank you. The size bug was real and well measured.
  - **Triple T:** the drum's display name is now **Triple T**. It's still free, the default on fresh saves, and on the title screen. Existing equipped skins are kept (that part shipped in PR #12).
  - **Size vs. win rule, fixed:**
    - the boss is built at unit size, then its **core body only** (no horns, crowns or eyes) is measured;
    - the boss is scaled every frame so `boss core = player core × cbrt(HP / mass)`, with at least a **6% visible gap** when not tied, capped at 2.2×;
    - player core = settled scale × 2 for the blob, × 1.9 for the drum (`Player.coreSize`);
    - the HP label is counter-scaled so it stays readable;
    - the arena stop distance uses the live core size;
    - combat is unchanged (`mass >= HP` wins, ties win).
  - **Results (browser, settled at the encounter, 4 boss designs, levels 1/2/3/4/20):**
    - HP−1 → boss **1.06× bigger**, fight LOSS;
    - tie → **1.00×**, WIN;
    - HP+1 → **0.94×**, WIN;
    - an obvious win reads clearly smaller (0.69–0.86×) and an obvious loss clearly bigger (1.3–2.2×);
    - a Node check of the steady state over levels 1–40 matches;
    - the old L20 case (4.80 vs 9.98 units) is gone.
  - **Boss roster:** I'm pushing back on one part. *Tralalero Tralala* (a shark in sneakers) and *Boneca Ambalabu* (a frog/tire hybrid) are specific characters made by their creators, and "evoking" them by their defining traits is copying. We **can** own the *genre*: absurd original object-animal hybrids with rhyming fake-Italian names. That's **P2-11** in your file, with a starter list.

### FB-004 — Release the old player material when switching skins
- **From:** Person 2 / ChatGPT
- **About:** src/main.js equipSkin, src/skins.js makeSkinMaterial, and src/player.js setMaterial
- **Verified bug:** Each equip creates a new Three.js material and replaces the old one without disposing it. In a test with real Three.js, 20 swaps replaced the material and the original emitted zero disposal events. In WebGL, repeated equips can leave renderer resources allocated.
- **Suggested fix:** Dispose the outgoing player-owned material on replacement, or reuse material instances with clear ownership. Keep shared skin textures alive. Add a regression check that repeated switching releases outgoing owned materials (or keeps a stable cache) while both solid and patterned skins still render.
- **Status:** ✅ Changed. Merged in PR #14.
- **Claude's answer:** Confirmed and fixed with the stable-cache option.
  - `makeSkinMaterial` now returns **one cached material per skin id**, and the drum materials were already cached.
  - **Regression check:** 20 alternating equips of a solid and a patterned skin produce **2 distinct materials in total** (before the fix it was one new material per equip). Repeated calls return the identical instance, patterned skins keep their texture `map`, and both render. No disposal is needed because nothing is replaced anymore.

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
- **Status:** ✅ Done, merged
- **Lead's answer:** All 14 full-line anchors matched once on the first try. Thanks for the complete lines. Tested at phone size from `?reset`:
  - only **one** drag tip shows (the tutorial's), under the blob, and the HUD hint is suppressed;
  - after an 80px drag it switches to **BLUE = GROW**, placed on the blue gate's side;
  - after passing the gate it fades out and `tutorialDone: true` is saved, in memory and in localStorage;
  - after dying before finishing, a retry shows the tutorial again (correct, since it wasn't done);
  - reload, then level 1 again: no tutorial;
  - a full level plays to the results screen with no console errors.

  One small follow-up was filed as **BUG-003**: replaying level 1 after the tutorial shows no drag hint at all. It's a one-line fix. **Next: BUG-003, then P2-08 (jump pads)**, both in the START HERE box.

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

### REQ-011 — Restore the standard drag hint on level one replays
- **From:** Person 2 / ChatGPT
- **Blocking:** BUG-003
- **What I need:** Apply the single replacement below on `p2/BUG-003-replay-drag-hint`, separate from jump pads. Confirm a fresh level one run still shows just the tutorial, a completed tutorial stays hidden, replaying level one shows the regular drag hint, and later levels still show the regular hint. Finish a full level with no console errors, then submit the PR and share the result.
- **Why:** The current level check suppresses the regular hint even after finishing the tutorial. The new condition passed all four combinations of level and completion state.
- **Status:** ✅ Done, merged
- **Lead's answer:** Applied as written, and the anchor matched once. Tested at phone size:
  - fresh level 1 shows the tutorial tip only (0 HUD hints);
  - after the tutorial is done, replaying level 1 shows the regular DRAG hint and no tutorial;
  - level 2 shows the regular hint;
  - the full level finished to the results screen with no console errors.

  BUG-003 is closed. **Next: P2-08 (jump pads)** in its own REQ.

In `src/main.js`, find exactly:

```js
  ui.showHUD(save, save.level !== 1);
```

Replace with:

```js
  ui.showHUD(save, !(save.level === 1 && !save.tutorialDone));
```

### REQ-012 — Apply and playtest jump pads
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-08
- **What I need:** Apply the 16 complete-line replacements below on `p2/P2-08-jump-pads`, in a PR separate from BUG-003. In level 4, use the pad before the first wall and check that a centered pass clears the wall, while bypassing the pad still leaves the wall hazardous. Check airborne clearance over saws and hammers, the landing squash, and clean retry and boss transitions. Play a full level without console errors. Tick P2-08 once verified and share the PR link and results.
- **Why:** Syntax and anchors passed. Seeded levels 1–3 were identical. Through level 20, every added pad was 7 units ahead of its hazard and no other generated data changed. Simulated checks passed for launch, apex, wall clearance, grounded collision, and landing.
- **Status:** ✅ Done, merged
- **Lead's answer:** All 16 complete-line anchors matched once. Results:
  - **Determinism (Node, main vs branch):** with pads removed, levels 1, 2, 3, 4, 6, 10 and 20 are byte-identical. Pads: 0 on levels 1–3, 1 on levels 4, 6 and 10, and 3 on level 20.
  - **Level 4, run A:** a mass-5 blob centered on the pad before the value-10 wall launched and peaked at **3.00**. It was at y=2.94 over the wall, cleared it with mass unchanged, and landed with a squash of about -0.41.
  - **Level 4, run B:** the same blob went around the pad, did not jump, then hit the wall and lost. So the wall stays dangerous.
  - **Airborne:** 8 of 8 hops over a hammer (level 6) and 8 of 8 over a saw (level 8), with **0 hits**.
  - **Boss transition:** a hop in progress when the boss starts resets to y=0, and the level finishes to the results screen.
  - **Retry and goto:** clean resets. No console errors.

  **Found in this review:** BUG-004. In Bungee, `÷2` reads as `+2` at phone size. It's a pre-existing problem from the restyle, not from your code, but it's a good quick ticket. **Next: BUG-004, then the new P2-09 (achievements) and P2-10 (coin magnet)**, all in the START HERE box.

In `src/config.js`, find exactly:
```js
  sawDamageCooldown: 0.6,
```
Replace with:
```js
  sawDamageCooldown: 0.6,
  jumpPad: {
    minLevel: 4,
    lead: 7,
    width: 1.7,
    depth: 1.35,
    thickness: 0.12,
    duration: 1.2,
    peak: 3,
    clearance: 0.5,
    landingSquash: -0.45,
  },
```

In `src/levels.js`, find exactly:
```js
 *  { type:'hammer', d, damage, speed }
```
Replace with:
```js
 *  { type:'hammer', d, damage, speed }
 *  { type:'pad',    d, x }
```

In `src/levels.js`, find exactly:
```js
  const bossHp = Math.max(8, Math.round(best * (0.45 + Math.min(0.15, level * 0.012))));
```
Replace with:
```js
  if (level >= CONFIG.jumpPad.minLevel) {
    const hazards = items.filter(({ type }) => ['wall', 'saw', 'hammer'].includes(type));
    for (let i = 0; i < hazards.length; i += 2) {
      const hazard = hazards[i];
      items.push({
        type: 'pad',
        d: hazard.d - CONFIG.jumpPad.lead,
        x: hazard.type === 'wall' ? hazard.x : 0,
      });
    }
  }

  const bossHp = Math.max(8, Math.round(best * (0.45 + Math.min(0.15, level * 0.012))));
```

In `src/entities.js`, find exactly:
```js
        case 'gate': e.obj = this.makeGatePair(it, z, W); break;
```
Replace with:
```js
        case 'gate': e.obj = this.makeGatePair(it, z, W); break;
        case 'pad': e.obj = this.makeJumpPad(it.x, z); break;
```

In `src/entities.js`, find exactly:
```js
  makeHammer(z, trackHalfWidth) {
```
Replace with:
```js
  makeJumpPad(x, z) {
    const { width, depth, thickness } = CONFIG.jumpPad;
    const pad = new THREE.Group();
    pad.position.set(x, 0, z);
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(width, thickness, depth),
      new THREE.MeshStandardMaterial({ color: '#FFD23F', roughness: 0.8 })
    );
    base.position.y = thickness / 2;
    pad.add(base);

    const arrow = new THREE.Shape();
    arrow.moveTo(-0.32, -0.23);
    arrow.lineTo(0, 0.27);
    arrow.lineTo(0.32, -0.23);
    arrow.lineTo(0.16, -0.23);
    arrow.lineTo(0, 0.02);
    arrow.lineTo(-0.16, -0.23);
    arrow.closePath();
    const mark = new THREE.Mesh(
      new THREE.ShapeGeometry(arrow),
      new THREE.MeshStandardMaterial({ color: INK, roughness: 0.8 })
    );
    mark.rotation.x = -Math.PI / 2;
    mark.position.y = thickness + 0.002;
    pad.add(mark);
    return pad;
  }

  makeHammer(z, trackHalfWidth) {
```

In `src/entities.js`, find exactly:
```js
    const pd = player.d;
```
Replace with:
```js
    const pd = player.d;
    const aboveHazards = player.y > CONFIG.jumpPad.clearance;
```

In `src/entities.js`, find exactly:
```js
      e.obj.visible = !e.used || e.type === 'gate' || e.type === 'wall';
```
Replace with:
```js
      e.obj.visible = !e.used || e.type === 'gate' || e.type === 'wall' || e.type === 'pad';
```

In `src/entities.js`, find exactly:
```js
      switch (e.type) {
        case 'gate':
```
Replace with:
```js
      switch (e.type) {
        case 'pad': {
          const { width, depth } = CONFIG.jumpPad;
          const front = e.d - depth / 2;
          if (player.y === 0 && prevD < front && pd >= front && dx <= width / 2 + r * 0.5) {
            e.used = true;
            events.push({ type: 'pad', pos });
          }
          break;
        }
        case 'gate':
```

In `src/entities.js`, find exactly:
```js
        case 'hammer': {
          const h = CONFIG.hammer;
```
Replace with:
```js
        case 'hammer': {
          if (aboveHazards) break;
          const h = CONFIG.hammer;
```

In `src/entities.js`, find exactly:
```js
          if (e.cooldown <= 0 && dd < r * 0.7 + 0.5 && dx < r * 0.8 + 0.8) {
```
Replace with:
```js
          if (!aboveHazards && e.cooldown <= 0 && dd < r * 0.7 + 0.5 && dx < r * 0.8 + 0.8) {
```

In `src/entities.js`, find exactly:
```js
          if (prevD < e.d - r * 0.5 && pd >= e.d - r * 0.5 && dx < e.width / 2 + r * 0.6) {
```
Replace with:
```js
          if (!aboveHazards && prevD < e.d - r * 0.5 && pd >= e.d - r * 0.5 && dx < e.width / 2 + r * 0.6) {
```

In `src/main.js`, find exactly:
```js
let combo = 0;
```
Replace with:
```js
let combo = 0;
let jumpElapsed = null;
```

In `src/main.js`, find exactly:
```js
  player.reset();
```
Replace with:
```js
  player.reset();
  jumpElapsed = null;
```

In `src/main.js`, find exactly:
```js
  switch (ev.type) {
```
Replace with:
```js
  switch (ev.type) {
    case 'pad':
      if (state === 'playing' && jumpElapsed === null) jumpElapsed = 0;
      break;
```

In `src/main.js`, find exactly:
```js
      state = 'boss';
```
Replace with:
```js
      state = 'boss';
      if (jumpElapsed !== null) {
        jumpElapsed = null;
        player.y = 0;
      }
```

In `src/main.js`, find exactly:
```js
  player.update(dt);
```
Replace with:
```js
  if (jumpElapsed !== null) {
    const jump = CONFIG.jumpPad;
    jumpElapsed += dt;
    if (state !== 'playing' || jumpElapsed >= jump.duration) {
      jumpElapsed = null;
      player.y = 0;
      if (state === 'playing') player.squash = jump.landingSquash;
    } else {
      const progress = jumpElapsed / jump.duration;
      player.y = 4 * jump.peak * progress * (1 - progress);
    }
  }

  player.update(dt);
```

### REQ-013 — Make division gate labels readable on phones
- **From:** Person 2 / ChatGPT
- **Blocking:** BUG-004
- **What I need:** Apply the two complete-line replacements on `p2/BUG-004-division-labels` in a separate PR into `main`. At phone size, verify the red gate and its popup say /2 and that the gate still halves mass. Compare with a blue +2 gate, play a full level, and check the console. Tick BUG-004 once those checks pass, and share the PR link and results.
- **Why:** Both source anchors matched once. The edited files parse, and the four label checks passed. The internal division operator remains unchanged.
- **Design choice:** The slash keeps the divisor visible and works for every divisor. The alternative HALF only describes division by two.
- **Status:** ✅ Done, merged
- **Lead's answer:** Both anchors matched once and were applied as written. At phone size the level 4 gate reads `/2` next to `X2`, clearly distinct. Going through it took mass from 40 to 20, so it still halves, and the pop-up says `/2`. A full level finished with no console errors. Agreed on `/` over `HALF`. Merged as [PR #11](https://github.com/usmej/mobile-gane/pull/11). See MSG-007 in your file.

In `src/entities.js`, find exactly:
```js
      const txt = `${gate.op}${gate.value}`;
```
Replace with:
```js
      const txt = `${gate.op === '÷' ? '/' : gate.op}${gate.value}`;
```

In `src/main.js`, find exactly:
```js
      pop(`${ev.op}${ev.value}`, ev.pos, ev.good ? C.good : C.bad, ev.good ? 'gateGood' : 'gateBad', ev.op === 'x' || ev.op === '÷' || ev.value >= 10);
```
Replace with:
```js
      pop(`${ev.op === '÷' ? '/' : ev.op}${ev.value}`, ev.pos, ev.good ? C.good : C.bad, ev.good ? 'gateGood' : 'gateBad', ev.op === 'x' || ev.op === '÷' || ev.value >= 10);
```

### REQ-014 — Apply and playtest the achievements panel
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-09
- **What I need:** Create the achievements module and apply the 23 exact replacements below on `p2/P2-09-achievements`. At phone size, verify the BADGES menu button, all 12 cards and their locked/unlocked states, closing back to the menu, and badge notices during normal play. Check that replaying a run does not award duplicate badges, reload preserves timestamps and counters, and old saves open correctly. Complete one full level with no console errors. Tick P2-09 when verified and share the PR and test results.
- **Why:** All anchors and JavaScript syntax passed. Simulated event sequences unlocked all 12 badges once.
- **Design choices:** Coin progress counts pickups on the track, separate from payouts and spending. A clean win excludes mass lost to bad gates, junk food, saws, hammers, or walls. Existing level progress, skins, and daily streak can earn their badges on load. Historical actions without a saved counter start at zero.
- **Status:** ✅ Done, merged
- **Lead's answer:** The new file was created and all 23 anchors matched once. That includes `main.js`, which had just changed for the drum mascot, so nice robust anchors. Tested at phone size on a separate test origin:
  - the **BADGES** button opens a panel with all 12 cards locked, in the right style, and it closes back to the menu;
  - a x10 clean win showed one notice: **First Gloop · Top Step · Spotless Slime**;
  - replaying the same kind of win awarded **nothing new**, so no duplicates;
  - after a reload, the unlock timestamps and the `stats` counters are identical;
  - the unlocked cards render filled and the locked ones say LOCKED;
  - an **old-format save** (no `achievements`/`stats`, level 6, 6 skins) loads with its skin, coins and level intact. On load it earned First Gloop, Gloop School and Closet Ooze, matching your stated design;
  - full level to the results screen, no console errors.

  Merged as PR #13.

Create `src/achievements.js`:

```js
export const BADGES = [
  { id: 'first-win', name: 'First Gloop', desc: 'Win your first run.' },
  { id: 'level-5', name: 'Gloop School', desc: 'Reach level 5.' },
  { id: 'level-10', name: 'Track Regular', desc: 'Reach level 10.' },
  { id: 'level-20', name: 'Gloop Legend', desc: 'Reach level 20.' },
  { id: 'finale-10', name: 'Top Step', desc: 'Finish the bonus stairs with a x10 multiplier.' },
  { id: 'combo-5', name: 'Gate Gravy', desc: 'Pick five good gates in a row.' },
  { id: 'walls-10', name: 'Brick Snack', desc: 'Smash 10 walls.' },
  { id: 'pads-25', name: 'Air Gloop', desc: 'Launch from 25 jump pads.' },
  { id: 'skins-5', name: 'Closet Ooze', desc: 'Own 5 skins.' },
  { id: 'daily-7', name: 'Week of Goo', desc: 'Reach a seven-day daily streak.' },
  { id: 'clean-win', name: 'Spotless Slime', desc: 'Win without losing mass to gates, food, or hazards.' },
  { id: 'coins-1000', name: 'Coin Puddle', desc: 'Pick up 1,000 coins on the track.' },
];

export function track(save, event) {
  const stats = save.stats;
  if (event.type === 'win') {
    stats.wins = (stats.wins || 0) + 1;
    stats.bestMultiplier = Math.max(stats.bestMultiplier || 0, event.multiplier);
    if (event.clean) stats.cleanWin = true;
  }
  if (event.type === 'combo') stats.bestCombo = Math.max(stats.bestCombo || 0, event.count);
  if (event.type === 'wall') stats.walls = (stats.walls || 0) + 1;
  if (event.type === 'pad') stats.pads = (stats.pads || 0) + 1;
  if (event.type === 'coin') stats.coins = (stats.coins || 0) + 1;

  const best = Math.max(save.best || 1, save.level || 1);
  const eligible = [
    stats.wins >= 1 || save.best >= 2, best >= 5, best >= 10, best >= 20,
    stats.bestMultiplier >= 10, stats.bestCombo >= 5, stats.walls >= 10,
    stats.pads >= 25, save.ownedSkins.length >= 5, save.dailyStreak >= 7,
    stats.cleanWin, stats.coins >= 1000,
  ];
  return BADGES.filter((badge, index) => {
    if (!eligible[index] || Object.hasOwn(save.achievements, badge.id)) return false;
    save.achievements[badge.id] = Date.now();
    return true;
  });
}
```

In `src/save.js`, find exactly:
```
  dailyStreak: 0,
```
Replace with:
```
  dailyStreak: 0,
  achievements: {},
  stats: {},
```

In `src/save.js`, find exactly:
```
    copy[key] = Array.isArray(value) ? value.slice() : value;
```
Replace with:
```
    copy[key] = Array.isArray(value) ? value.slice() : value && typeof value === 'object' ? { ...value } : value;
```

In `src/save.js`, find exactly:
```
      const value = parsed[key];
      base[key] = Array.isArray(value) ? value.slice() : value;
```
Replace with:
```
      const value = parsed[key];
      if (key === 'stats' || key === 'achievements') {
        if (value && typeof value === 'object' && !Array.isArray(value)) base[key] = { ...value };
      } else {
        base[key] = Array.isArray(value) ? value.slice() : value;
      }
```

In `src/main.js`, find exactly:
```
import { claim } from './daily.js';
```
Replace with:
```
import { claim } from './daily.js';
import { BADGES, track } from './achievements.js';
```

In `src/main.js`, find exactly:
```
let runCoins = 0;
```
Replace with:
```
let runCoins = 0;
let runTookHit = false;
```

In `src/main.js`, find exactly:
```
  onCloseShop: () => { audio.play('click'); showMenu(); },
```
Replace with:
```
  onCloseShop: () => { audio.play('click'); showMenu(); },
  onOpenBadges: () => { audio.play('click'); ui.showBadges(save, BADGES); },
  onCloseBadges: () => { audio.play('click'); showMenu(); },
```

In `src/main.js`, find exactly:
```
      writeSave(save);
      ui.toast(`Daily reward: +${coins} coins${gems ? ` and +${gems} gems` : ''}`);
```
Replace with:
```
      const reward = `Daily reward: +${coins} coins${gems ? ` and +${gems} gems` : ''}`;
      recordBadgeEvent({ type: 'daily' }, reward);
```

In `src/main.js`, find exactly:
```
// ---------- flow ----------
```
Replace with:
```
function recordBadgeEvent(event, message) {
  const unlocked = track(save, event);
  if (event.type !== 'sync' || unlocked.length) writeSave(save);
  const messages = [message, ...unlocked.map(({ name }) => 'BADGE: ' + name)].filter(Boolean);
  if (messages.length) ui.toast(messages.join(' · '));
}

// ---------- flow ----------
```

In `src/main.js`, find exactly:
```
  combo = 0;
  state = 'playing';
```
Replace with:
```
  combo = 0;
  runTookHit = false;
  state = 'playing';
```

In `src/main.js`, find exactly:
```
    save.best = Math.max(save.best, save.level);
```
Replace with:
```
    save.best = Math.max(save.best, save.level);
    recordBadgeEvent({ type: 'win', multiplier: mult, clean: !runTookHit });
```

In `src/main.js`, find exactly:
```
  ui.toast(`${skin.name} unlocked`);
```
Replace with:
```
  recordBadgeEvent({ type: 'skin' }, `${skin.name} unlocked`);
```

In `src/main.js`, find exactly:
```
      if (state === 'playing' && jumpElapsed === null) jumpElapsed = 0;
```
Replace with:
```
      if (state === 'playing' && jumpElapsed === null) {
        jumpElapsed = 0;
        recordBadgeEvent({ type: 'pad' });
      }
```

In `src/main.js`, find exactly:
```
      player.setMass(applyOp(before, ev.op, ev.value));
```
Replace with:
```
      player.setMass(applyOp(before, ev.op, ev.value));
      if (player.mass < before) runTookHit = true;
```

In `src/main.js`, find exactly:
```
        if (combo === 3 || combo === 5) audio.play('gem');
```
Replace with:
```
        if (combo === 3 || combo === 5) audio.play('gem');
        if (combo === 5) recordBadgeEvent({ type: 'combo', count: combo });
```

In `src/main.js`, find exactly:
```
    case 'food':
      player.setMass(player.mass + (ev.good ? ev.value : -ev.value));
```
Replace with:
```
    case 'food':
      if (!ev.good) runTookHit = true;
      player.setMass(player.mass + (ev.good ? ev.value : -ev.value));
```

In `src/main.js`, find exactly:
```
      runCoins += 1;
```
Replace with:
```
      runCoins += 1;
      recordBadgeEvent({ type: 'coin' });
```

In `src/main.js`, find exactly:
```
    case 'saw':
      player.setMass(player.mass - ev.damage);
```
Replace with:
```
    case 'saw':
      runTookHit = true;
      player.setMass(player.mass - ev.damage);
```

In `src/main.js`, find exactly:
```
    case 'wall':
      if (player.mass > ev.value) {
```
Replace with:
```
    case 'wall':
      runTookHit = true;
      if (player.mass > ev.value) {
        recordBadgeEvent({ type: 'wall' });
```

In `src/main.js`, find exactly:
```
loadLevel();
showMenu();
requestAnimationFrame(frame);
```
Replace with:
```
loadLevel();
showMenu();
recordBadgeEvent({ type: 'sync' });
requestAnimationFrame(frame);
```

In `src/ui.js`, find exactly:
```
        <button class="btn btn-shop btn-md">SKINS</button>
```
Replace with:
```
        <div class="menu-secondary">
          <button class="btn btn-shop btn-md">SKINS</button>
          <button class="btn btn-md btn-badges">BADGES</button>
        </div>
```

In `src/ui.js`, find exactly:
```
    this._on(el, '.btn-shop', () => this._call('onOpenShop'));
```
Replace with:
```
    this._on(el, '.btn-shop', () => this._call('onOpenShop'));
    this._on(el, '.btn-badges', () => this._call('onOpenBadges'));
```

In `src/ui.js`, find exactly:
```
  // ---------- misc ----------
```
Replace with:
```
  showBadges(save, badges) {
    const cards = badges.map((badge) => {
      const unlocked = Object.hasOwn(save.achievements, badge.id);
      return `<div class="badge-card${unlocked ? ' is-unlocked' : ''}">
        <div class="badge-name">${esc(badge.name)}</div>
        <div>${esc(badge.desc)}</div>
        <span class="badge-status">${unlocked ? 'UNLOCKED' : 'LOCKED'}</span>
      </div>`;
    }).join('');
    const el = this._mount('panel-layer shop', `
      <div class="card card-shop">
        <button class="btn btn-close" aria-label="Close badges">${I.closeX()}</button>
        <div class="shop-head"><span class="shop-title">BADGES</span></div>
        <div class="skin-grid badge-grid">${cards}</div>
      </div>`);
    this._on(el, '.btn-close', () => this._call('onCloseBadges'));
  }

  // ---------- misc ----------
```

In `style.css`, find exactly:
```
.btn-shop { background: var(--cream); }
```
Replace with:
```
.btn-shop { background: var(--cream); }
.menu-secondary { display: flex; flex-wrap: wrap; justify-content: center; gap: 8px; }
.menu-secondary .btn { font-size: 16px; padding-inline: 14px; }
.badge-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.badge-card {
  color: var(--ink); background: var(--cream); border: 3px solid var(--ink); border-radius: 6px;
  padding: 10px; font: 12px/1.35 system-ui, sans-serif; overflow-wrap: anywhere;
}
.badge-card.is-unlocked { background: var(--yellow); box-shadow: 0 4px 0 var(--ink); }
.badge-name, .badge-status { font-family: var(--font); }
.badge-status { display: block; margin-top: 6px; font-size: 10px; }
```

### REQ-015 — Apply and playtest the coin magnet
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-10
- **What I need:** Apply the 14 complete-line replacements on `p2/P2-10-coin-magnet` and open a separate PR into `main`. Play level 5 at phone size and confirm the magnet is easy to identify, nearby coins are drawn in once, farther coins are unaffected, and the HUD tag and effect expire after six seconds. Check retries, boss and result transitions, coin achievements, and a full run with no console errors. Tick P2-10 after verification and share the PR and results.
- **Why:** Exact anchors, syntax and generation passed. Levels 1–4 are unchanged. Levels 5–40 have exactly one magnet with no other generated differences. Simulated pickup, attraction range, single collection, and cancellation passed.
- **Design choices:** One magnet per level from level 5 uses a deterministic placement near an early coin line. Uncollected in-flight coins return to their original spots at expiry.
- **Status:** ✅ Done, merged
- **Lead's answer:** All 14 anchors matched once, on top of the PR #14 changes. Results:
  - **Determinism (Node, main vs branch, levels 1–40):** levels 1–4 byte-identical with no magnet. Levels 5–40 have exactly **one** magnet each, and nothing else differs.
  - **Pull:** after grabbing the level 5 magnet (center lane) I steered to the far lane (x=−2.6). **8 coins** were still collected, so they were pulled in from the center line.
  - **Duration:** the HUD `data-magnet` tag stayed on for **6.02 s** and then turned off.
  - **Transitions:**
    - a magnet active when the boss starts keeps working in the boss state;
    - it's cleared by the results screen;
    - it's cleared on retry and on a new level;
    - the full run finished with no console errors.
  - **Badges:** magnet-pulled coins count in `stats.coins` toward Coin Puddle, which matches your design.
  - **Not verified by me:** *"easy to identify"* is a human-eyes check. My screenshots couldn't catch it cleanly. **Person 2 / Juan: please look at it on level 5 of the live site** (`?level=5`) and post a playtest REQ if it's hard to spot.
  - **Nit (no action needed now):** the MAGNET tag CSS is injected from `main.js`. Next time, put CSS in `style.css` so all the styling lives in one place.

  Merged as PR #15.

In `src/config.js`, find exactly:
```js
  pickupRadius: 0.9,
```
Replace with:
```js
  pickupRadius: 0.9,
  magnet: { minLevel: 5, duration: 6, radius: 4, pullSpeed: 32, collectDistance: 0.5, lead: 4, pickupHeight: 1.1 },
```

In `src/levels.js`, find exactly:
```js
  const bossHp = Math.max(8, Math.round(best * (0.45 + Math.min(0.15, level * 0.012))));
```
Replace with:
```js
  if (level >= CONFIG.magnet.minLevel) {
    const lead = CONFIG.magnet.lead;
    const coin = items.find((item) => item.type === 'coin' &&
      item.d > CONFIG.firstItemAt + lead &&
      items.every((other) => Math.abs(other.d - (item.d - lead)) > CONFIG.pickupRadius));
    items.push({ type: 'magnet', d: coin ? coin.d - lead : CONFIG.firstItemAt - lead, x: coin ? coin.x : 0 });
  }

  const bossHp = Math.max(8, Math.round(best * (0.45 + Math.min(0.15, level * 0.012))));
```

In `src/entities.js`, find exactly:
```js
        case 'gate': e.obj = this.makeGatePair(it, z, W); break;
```
Replace with:
```js
        case 'gate': e.obj = this.makeGatePair(it, z, W); break;
        case 'magnet': e.obj = this.makeMagnet(it.x, z); break;
```

In `src/entities.js`, find exactly:
```js
  makeJumpPad(x, z) {
```
Replace with:
```js
  makeMagnet(x, z) {
    const group = new THREE.Group();
    group.position.set(x, CONFIG.magnet.pickupHeight, z);
    const shape = new THREE.Shape();
    shape.moveTo(-0.48, 0.42);
    shape.lineTo(-0.48, -0.02);
    shape.quadraticCurveTo(-0.48, -0.55, 0, -0.55);
    shape.quadraticCurveTo(0.48, -0.55, 0.48, -0.02);
    shape.lineTo(0.48, 0.42);
    shape.lineTo(0.24, 0.42);
    shape.lineTo(0.24, -0.02);
    shape.quadraticCurveTo(0.24, -0.31, 0, -0.31);
    shape.quadraticCurveTo(-0.24, -0.31, -0.24, -0.02);
    shape.lineTo(-0.24, 0.42);
    shape.closePath();

    const body = new THREE.Mesh(
      new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false }),
      new THREE.MeshStandardMaterial({ color: BAD, roughness: 0.8 })
    );
    body.position.z = -0.1;
    const outline = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(shape.getPoints()),
      new THREE.LineBasicMaterial({ color: INK })
    );
    const back = outline.clone();
    back.geometry = outline.geometry.clone();
    back.material = outline.material.clone();
    outline.position.z = 0.202;
    back.position.z = -0.002;
    body.add(outline, back);
    group.add(body);

    for (const tipX of [-0.36, 0.36]) {
      const tip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.21),
        new THREE.MeshStandardMaterial({ color: CREAM, roughness: 0.8 }));
      tip.position.set(tipX, 0.35, 0);
      group.add(tip);
    }
    return group;
  }

  makeJumpPad(x, z) {
```

In `src/entities.js`, find exactly:
```js
      if (o.isMesh && !Object.values(G).includes(o.geometry)) {
```
Replace with:
```js
      if ((o.isMesh || o.isLine) && !Object.values(G).includes(o.geometry)) {
```

In `src/entities.js`, find exactly:
```js
  update(dt, time, player, prevD) {
```
Replace with:
```js
  update(dt, time, player, prevD, magnetActive = false) {
```

In `src/entities.js`, find exactly:
```js
      if (!near || e.used) continue;
```
Replace with:
```js
      if (!near || e.used) continue;

      if (e.type === 'coin' && (magnetActive || e.magnetPulled)) {
        const cfg = CONFIG.magnet;
        const target = player.position.clone().setY(player.y + r);
        const delta = target.sub(e.obj.position);
        const distance = delta.length();
        if (magnetActive && (e.magnetPulled || distance <= cfg.radius)) {
          const step = cfg.pullSpeed * dt;
          if (distance <= step + cfg.collectDistance) {
            e.used = true;
            e.obj.visible = false;
            events.push({ type: 'coin', pos: e.obj.position.clone() });
          } else {
            e.magnetPulled = true;
            e.obj.position.addScaledVector(delta, step / distance);
          }
          continue;
        }
        if (e.magnetPulled) {
          e.magnetPulled = false;
          e.obj.position.set(e.x, 0.9, -e.d);
        }
      }
```

In `src/entities.js`, find exactly:
```js
        case 'coin':
        case 'gem':
```
Replace with:
```js
        case 'magnet':
        case 'coin':
        case 'gem':
```

In `src/main.js`, find exactly:
```js
let jumpElapsed = null;
```
Replace with:
```js
let jumpElapsed = null;
let magnetTime = 0;
```

In `src/main.js`, find exactly:
```js
  jumpElapsed = null;
  player.group.visible = true;
```
Replace with:
```js
  jumpElapsed = null;
  magnetTime = 0;
  player.group.visible = true;
```

In `src/main.js`, find exactly:
```js
  switch (ev.type) {
    case 'pad':
```
Replace with:
```js
  switch (ev.type) {
    case 'magnet':
      magnetTime = CONFIG.magnet.duration;
      break;
    case 'pad':
```

In `src/main.js`, find exactly:
```js
  const events = entities.update(dt, time, player, prevD);
```
Replace with:
```js
  const canUseMagnet = state === 'playing' || state === 'boss';
  magnetTime = canUseMagnet ? Math.max(0, magnetTime - dt) : 0;
  const events = entities.update(dt, time, player, prevD, magnetTime > 0);
```

In `src/main.js`, find exactly:
```js
      progress: Math.min(1, player.d / level.length),
    });
```
Replace with:
```js
      progress: Math.min(1, player.d / level.length),
    });
    const hud = ui.hud?.level?.closest('.hud');
    if (hud) hud.toggleAttribute('data-magnet', magnetTime > 0);
```

In `src/main.js`, find exactly:
```js
window.addEventListener('resize', resize);
```
Replace with:
```js
const magnetStyle = document.createElement('style');
magnetStyle.textContent = '.hud[data-magnet]::after { content: "MAGNET"; position: absolute; top: 4.5rem; left: 50%; transform: translateX(-50%); color: var(--ink); background: var(--yellow); border: 3px solid var(--ink); border-radius: 6px; padding: 4px 8px; font: 14px var(--font); }';
document.head.appendChild(magnetStyle);
window.addEventListener('resize', resize);
```

### REQ-016 — Apply and playtest four original brainrot bosses
- **From:** Person 2 / ChatGPT
- **Blocking:** P2-11
- **What I need:** Apply the two complete-line replacements below in `src/bosses.js` on `p2/P2-11-boss-roster`. Playtest the fridge dinosaur, toast octopus, bell cactus, and scooter pigeon at phone size on levels 1–4. Check the existing four on levels 5–8 and the repeat on level 9. Confirm faces read from the chase camera, the HP label remains visible, and the arena still reads smaller/equal/larger for loss/tie/win. Run a full level through the results screen, check the console, and share the PR and results. Tick P2-11 after verification.
- **Why:** Syntax and exact anchors passed. Real Three.js checks found eight distinct core meshes, all normalizing to the same target size and repeating after eight levels. Browser readability is pending.
- **Design choice:** Put the new designs first so they appear in the opening levels. Keep the four existing models in the rotation and leave the optional name banner for a separate change.
- **Status:** 🟡 Open
- **Lead's answer:** _(lead fills this in)_

Find exactly:
```js
const DESIGNS = [hornedGremlin, megaCube, donutTyrant, slimeKing];
```
Replace with:
```js
function rosterBox(group, size, color, dimensions, position) {
  return add(group, new THREE.Mesh(
    new THREE.BoxGeometry(...dimensions.map((n) => n * size)),
    std(color, { flatShading: true })
  ), ...position.map((n) => n * size));
}

function rosterEyes(group, size, y, z) {
  for (const x of [-0.24, 0.24]) {
    rosterBox(group, size, '#FFF4E0', [0.32, 0.32, 0.10], [x, y, z]);
    rosterBox(group, size, '#1B1420', [0.12, 0.16, 0.04], [x + 0.025, y, z + 0.07]);
  }
}

function fridgeDino(size) {
  const g = new THREE.Group();
  const body = rosterBox(g, size, '#62BCA8', [1.20, 1.45, 0.92], [0, 1.03, 0]);
  for (const x of [-0.35, 0.35]) {
    rosterBox(g, size, '#246E67', [0.35, 0.38, 0.62], [x, 0.19, 0.13]);
  }
  for (let i = 0; i < 3; i++) {
    add(g, new THREE.Mesh(new THREE.ConeGeometry(0.20 * size, 0.37 * size, 4),
      std('#FFD23F')), 0, (1.60 - i * 0.29) * size, (-0.52 - i * 0.12) * size);
  }
  rosterBox(g, size, '#1B1420', [0.12, 0.43, 0.10], [0.43, 0.82, 0.51]);
  rosterBox(g, size, '#246E67', [0.67, 0.29, 0.52], [0, 1.11, 0.56]);
  rosterEyes(g, size, 1.47, 0.52);
  return { group: g, body, height: 1.83 * size };
}

function toastOctopus(size) {
  const g = new THREE.Group();
  const body = rosterBox(g, size, '#A9572F', [1.52, 1.29, 0.64], [0, 0.99, 0]);
  rosterBox(g, size, '#F6BD71', [1.29, 1.07, 0.10], [0, 0.99, 0.35]);
  for (let i = 0; i < 8; i++) {
    const angle = ((i + 0.5) / 8) * Math.PI * 2;
    const arm = add(g, new THREE.Mesh(new THREE.CapsuleGeometry(0.105 * size, 0.65 * size, 4, 8),
      std('#B96A43')), Math.cos(angle) * 0.56 * size, 0.30 * size, Math.sin(angle) * 0.35 * size);
    arm.rotation.z = -Math.cos(angle) * 1.12;
    arm.rotation.x = Math.sin(angle) * 1.12;
  }
  rosterEyes(g, size, 1.19, 0.46);
  rosterBox(g, size, '#1B1420', [0.32, 0.11, 0.07], [0, 0.89, 0.45]);
  return { group: g, body, height: 1.66 * size };
}

function bellCactus(size) {
  const g = new THREE.Group();
  const body = add(g, new THREE.Mesh(new THREE.CapsuleGeometry(0.43 * size, 0.74 * size, 4, 8),
    std('#40A45D', { flatShading: true })), 0, 0.80 * size, 0);
  for (const side of [-1, 1]) {
    rosterBox(g, size, '#278046', [0.47, 0.24, 0.33], [side * 0.43, 0.77, 0]);
    rosterBox(g, size, '#278046', [0.23, 0.46, 0.33], [side * 0.61, 0.94, 0]);
  }
  add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.35 * size, 0.62 * size, 0.53 * size, 8),
    std('#FFD23F', { flatShading: true })), 0, 1.55 * size, 0);
  rosterBox(g, size, '#1B1420', [0.82, 0.13, 0.78], [0, 1.30, 0]);
  rosterEyes(g, size, 1.56, 0.48);
  return { group: g, body, height: 1.83 * size };
}

function scooterPigeon(size) {
  const g = new THREE.Group();
  const body = add(g, new THREE.Mesh(new THREE.SphereGeometry(size, 12, 8),
    std('#8798B6', { flatShading: true })), 0, 0.88 * size, 0);
  body.scale.set(0.64, 0.58, 0.66);
  add(g, new THREE.Mesh(new THREE.SphereGeometry(0.43 * size, 12, 8),
    std('#566B90', { flatShading: true })), 0, 1.46 * size, 0.28 * size);
  const beak = add(g, new THREE.Mesh(new THREE.ConeGeometry(0.17 * size, 0.37 * size, 4),
    std('#FFAB39')), 0, 1.40 * size, 0.77 * size);
  beak.rotation.x = Math.PI / 2;
  rosterEyes(g, size, 1.59, 0.69);
  rosterBox(g, size, '#FF7658', [0.73, 0.16, 1.96], [0, 0.27, 0]);
  rosterBox(g, size, '#1B1420', [0.13, 0.95, 0.13], [0, 0.75, 0.88]);
  rosterBox(g, size, '#1B1420', [0.68, 0.12, 0.15], [0, 1.22, 0.88]);
  for (const z of [-0.76, 0.76]) {
    const wheel = add(g, new THREE.Mesh(new THREE.CylinderGeometry(0.18 * size, 0.18 * size,
      0.19 * size, 12), std('#1B1420')), 0, 0.18 * size, z * size);
    wheel.rotation.z = Math.PI / 2;
  }
  return { group: g, body, height: 1.89 * size };
}

const DESIGNS = [
  fridgeDino, toastOctopus, bellCactus, scooterPigeon,
  hornedGremlin, megaCube, donutTyrant, slimeKing,
];
```

Find exactly:
```js
  const idx = (((level | 0) - 1) % 4 + 4) % 4;
```
Replace with:
```js
  const count = DESIGNS.length;
  const idx = (((level | 0) - 1) % count + count) % count;
```

## ✅ Done requests
_(Moved here by the lead once finished.)_
