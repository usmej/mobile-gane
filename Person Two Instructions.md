# Person Two Instructions

👋 **Person 2 + ChatGPT, this file is your task board.**
The project lead (Person 1 + Claude Opus) assigns your work here. Paste this whole file into ChatGPT (or connect ChatGPT to this repo) and tell it to start with the first open task.

---

## 🔁 How to do a task (read this every time)

1. **Pull the latest `main`.** Read `README.md` and `docs/ARCHITECTURE.md` so you know the rules and the exact function names.
2. **Make a branch** named `p2/<TASK-ID>-<short-name>`, for example `p2/P2-01-new-skins`.
   - On the GitHub website: open the branch dropdown, type the name, then choose "Create branch".
3. **Only touch the files the task lists.** If you need another file, write that in the PR description.
4. **Put the code in the repo, not just in the chat.**
   - If your ChatGPT can push (Codex or a GitHub-connected agent), let it commit to your branch.
   - If it can only read the repo, copy each full file it writes into GitHub (open the file, ✏️ edit, paste, then "Commit to branch p2/...").
5. **Test it:** run `python3 -m http.server 8080` in the repo folder, open <http://localhost:8080>, play one full level and check the browser console has **no red errors**.
6. **Tick your task's box below** (`- [ ]` becomes `- [x]`) in the same branch.
7. **Open a pull request into `main`** titled `[TASK-ID] short description`. In the description, say what you changed and how you tested it.
8. The lead reviews it. If something's wrong, you'll get comments or a `BUG-xxx` entry below, and you fix it **on the same branch**.
9. **Need something from the lead?** For example repo access, a change to a file you don't own, or a question. Add a `REQ-xxx` to **[`Person One Instructions.md`](Person%20One%20Instructions.md)**. The lead answers there.

### Rules for ChatGPT
- Plain JavaScript ES modules. **No npm, no build tools, no new libraries** unless a task says so.
- **Don't rename or remove existing exports.** Other files depend on them (see `docs/ARCHITECTURE.md`).
- Tuning numbers go in `src/config.js`, not hard-coded.
- Keep it original: no real people, brands, or copyrighted characters or art. Brain-rot slang is fine; keep it clean.
- **No real money or payment code.**
- Must work on a phone (portrait, touch) and on a computer (mouse).

---

## 📋 Task board

| ID | Task | Difficulty | Files | Status |
|---|---|---|---|---|
| BUG-001 | Mass number overlaps the title on the menu | 🟢 Easy | `src/main.js` | Open |
| P2-01 | 6 new skins | 🟢 Easy | `src/skins.js` | Open |
| P2-02 | 4 new level themes | 🟢 Easy | `src/themes.js` | Open |
| P2-03 | Phone vibration (haptics) | 🟢 Easy | new `src/haptics.js`, `src/main.js` | Open |
| P2-04 | Gate combo streak | 🟡 Medium | `src/main.js`, `src/config.js` | Open |
| P2-05 | Daily reward chest | 🟡 Medium | new `src/daily.js`, `src/ui.js`, `src/save.js`, `style.css` | Open |
| P2-06 | New obstacle: swinging hammer | 🔴 Hard | `src/levels.js`, `src/entities.js`, `src/main.js` | Open |

Do them **in order** (top to bottom). Do one per PR.

---

### BUG-001 — Mass number overlaps the menu title 🟢
- [ ] Done

**Problem:** on the main menu, the blob's floating mass label (`10`) draws on top of the big "GLOOP RUSH" title.
**Fix:** in `src/main.js`, hide the label while `state === 'menu'` and show it again when a run starts.
The label is `player.label` (a `THREE.Sprite`, so use `.visible`).
**Done when:**
- The menu shows no number over the title.
- The number still appears during gameplay.
- Retry and Next both still show it.

---

### P2-01 — 6 new skins 🟢
- [ ] Done

Add **6 skins** to the end of the `SKINS` array in `src/skins.js`. Follow the existing format exactly: `{ id, name, price, currency, color, color2, pattern }`.
- Use 4 coin skins priced between 900 and 2000, and 2 gem skins priced between 40 and 60.
- Use at least 3 different patterns (`solid`, `stripes`, `dots`, `checker`, `rainbow`, `glow`).
- Each `id` must be unique and lowercase. Names should be funny, original brain-rot ("Mid Mochi", "Lowkey Lava"...).

**Done when:** all 6 show in the Shop with the right swatch, and can be bought and equipped. To test, give yourself money in the console with `__gloop.save.coins = 5000; __gloop.save.gems = 100; __gloop.persist()`, then open the Shop.

---

### P2-02 — 4 new level themes 🟢
- [ ] Done

Add **4 themes** to `THEMES` in `src/themes.js`, using the same keys as the existing ones (`id, name, sky, fog, track, trackAlt, edge, accent, pattern`).
- Each should look clearly different from the existing 8. Ideas: "Midnight Arcade", "Cotton Candy Storm", "Pickle Planet", "Sunset Drip".
- `track` and `trackAlt` need enough contrast that the pattern is visible.

**Done when:** you can see each new theme by running `__gloop.goto(9)` in the browser console (then 10, 11, 12), and the gate numbers are still readable on every one.

---

### P2-03 — Phone vibration 🟢
- [ ] Done

Create `src/haptics.js`:
```js
export const haptics = { enabled: true, buzz(pattern) { /* navigator.vibrate if supported; never throw */ } };
```
In `src/main.js`, call it for these events (gates, saws and walls are in `handleEvent()`; losing and boss win are in `finishRun()`):
- bad gate: `buzz(40)`
- saw: `buzz([30, 30, 30])`
- wall smash: `buzz(60)`
- losing: `buzz([80, 40, 120])`
- boss win: `buzz([20, 20, 20, 20, 60])`

Only vibrate if `save.sound` is on, so the mute button mutes both.
**Done when:** it doesn't crash on a desktop or iPhone (iOS Safari doesn't support vibrate; that's fine), and an Android phone buzzes.

---

### P2-04 — Gate combo streak 🟡
- [ ] Done

Reward picking good gates in a row.
- Track `combo` in `main.js`. Each **good** gate adds +1 and each **bad** gate resets it to 0. Reset it when a run starts.
- At combo 2 and up, show a pop text `COMBO x{combo}` with `fx.popText`, and give **bonus mass**: `combo * CONFIG.comboBonusMass` (add `comboBonusMass: 2` to `config.js`).
- Play `audio.play('gem')` when the combo reaches 3 and 5.

**Done when:** three good gates in a row show "COMBO x2", then "COMBO x3" with bonus mass, and a bad gate resets it.

---

### P2-05 — Daily reward chest 🟡
- [ ] Done

- `src/save.js`: add `lastDaily: 0` and `dailyStreak: 0` to `DEFAULT_SAVE`.
- New `src/daily.js` exports:
  - `canClaim(save)`: true if the last claim was on a different calendar day.
  - `claim(save)`: returns `{ coins, gems }` and updates the save.
  - Rewards: day 1 is 50 coins, then +25 coins per streak day, capped at day 7, and day 7 also gives 3 gems. Missing a day resets the streak to 1.
- `src/ui.js`: on the menu, show a bouncing 🎁 button when it can be claimed, which calls a new handler `onClaimDaily`. Wire that handler in `main.js`: call `claim()`, then `writeSave()`, `ui.toast(...)` and re-show the menu.

**Done when:**
- You can claim once per day.
- The button is hidden after claiming.
- Faking yesterday with `__gloop.save.lastDaily -= 86400000; __gloop.persist(); location.reload()` makes it claimable again with streak 2.

---

### P2-06 — New obstacle: swinging hammer 🔴
- [ ] Done

Add a new level item `{ type: 'hammer', d, damage, speed }`: a giant cartoon mallet that swings like a pendulum across the whole track.
- `src/levels.js`: spawn it as one of the hazard options, but only from **level 3 on**. Damage is about 30% of expected mass, like saws.
- `src/entities.js`:
  - Build the mesh: a handle plus a head, pivoting from a post above the track.
  - Animate the swing: angle = `sin(time * speed) * 1.2`.
  - Detect collisions using the head's world X position, with a cooldown like saws, and push `{ type: 'saw', damage, pos }` so `main.js` already handles it. Or add a new `'hammer'` event and handle it.
- Keep the sizes readable on a phone.

**Done when:** hammers appear from level 3, hitting one removes mass with a hit effect, and timing a pass gets you through untouched.

---

## 🐞 Bug reports from the lead
_(The lead adds `BUG-xxx` entries here after reviewing PRs. Fix them on the same branch, or a new `p2/BUG-xxx-...` branch.)_

- BUG-001: see above.
