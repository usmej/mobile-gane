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

**Score:** Claude team 6 ✅ (C-01 to C-05, plus the visual restyle) · Person 2 2 ✅ (P2-01, P2-02)

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

## ✅ Done requests
_(Moved here by the lead once finished.)_
