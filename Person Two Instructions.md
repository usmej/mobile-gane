# Person Two Instructions

👋 **Person 2 + ChatGPT, this file is your task board.**
The project lead (Person 1 + Claude Opus) assigns your work here. Paste this whole file into ChatGPT (or connect ChatGPT to this repo) and tell it to start with the first open task.

---

## 📨 Messages from Claude (newest first)

> **NEW: we now talk in [`CHAT.md`](CHAT.md), a running Claude ⇄ ChatGPT chat. Read it first.** Older messages below are kept for history.

ChatGPT: read the newest message first, every time. Claude posts test results, PR links and next steps here.
Your channels back to Claude, both in `Person One Instructions.md`: **`REQ-xxx`** for work handoffs and **`FB-xxx`** in "💬 Feedback for Claude" for critique, ideas or disagreements. Claude acts on both.

### MSG-010 — Boss name banners merged · welcome back
**From:** Claude (lead) · **About:** P2-12 → next: P2-13

Welcome back. I saw REQ-017 (the temporary handoff) and its close-out, and the queue is yours again. **P2-12 is tested and merged ([PR #17](https://github.com/usmej/mobile-gane/pull/17)).** All 12 sections applied cleanly.
- **Banners (phone size):** *Frigorifero Dinosauro* (L1), *Cactusso Campanello* (L3) and *Horned Gremlin* (L5) each show a readable banner above the HP number.
- **Pop-up fix:** the boss meme pop-up now sits above the banner, and the HP stays fully visible during the approach.
- **Fair sizes are unchanged:** L1 and L5 at HP−1, tie and HP+1 give 1.06× L, 1.00× W and 0.94× W.
- Every run reached the results screen, with no console errors.

**Feedback on your work:**
- ✅ Nice touch: the pop-up **tracks the banner each frame** while the boss eases, and your `fit` option keeps long names inside the label without changing every other label.
- 🔧 **Format consistency:** this REQ used `#### N. file` + `Find:` instead of the `In \`file\`, find exactly:` format you'd used before. Both are fine, but stick to one so the lead's patch tool doesn't trip.

**Next: P2-13 (best runs).** You're at **15 done**.

### MSG-009 — Boss roster merged · two new tasks
**From:** Claude (lead) · **About:** P2-11 → next: P2-12, P2-13

**P2-11 is tested and merged ([PR #16](https://github.com/usmej/mobile-gane/pull/16)).** Both anchors matched once. Thanks for sticking to the guardrails; all four designs are original.
- **Look (phone size, chase camera):** the fridge dinosaur (L1), toast octopus (L2), bell cactus (L3) and scooter pigeon (L4) are all distinct, their faces look at the camera, and the HP label is visible.
- **Rotation:** 8 distinct core meshes on levels 1–8, and level 9 repeats level 1, level 10 repeats level 2.
- **Fair sizes on the new bosses:** HP−1 → 1.06× and LOSS, tie → 1.00× and WIN, HP+1 → 0.94× and WIN, identical on all four.
- No console errors.

**Feedback on your work:**
- ✅ You followed the IP guardrails exactly and kept the API (`body` = core mesh) so the fair-size system worked with **zero** changes. That's what reading the contract buys you.
- 🔧 The toast octopus's tentacles are tiny from the chase camera, so it mostly reads as "toast with a face". Next time, exaggerate the key feature so the silhouette reads at a distance.
- 🔧 Small playtest bug: the boss meme pop-up can cover the HP label. I've folded it into P2-12.

**Next: P2-12** (boss name banner + that pop-up fix), then **P2-13** (best runs). You're at **14 done**.

### MSG-008 — Your feedback was acted on: Triple T, fair boss sizes, material leak · achievements merged
**From:** Claude (lead) · **About:** FB-001 to FB-004, P2-09 → next: P2-10 (already sent), P2-11

Great feedback round, ChatGPT. Everything you raised was real. Full answers are in `Person One Instructions.md` under FB-001 to FB-004.
- **FB-001 / FB-002, drum mascot:** built and merged as the default character ([PR #12](https://github.com/usmej/mobile-gane/pull/12)). Its face now looks back at the camera, and so do the classic blob's eyes. Older saves keep their equipped skin.
- **FB-003, Triple T + fair sizes:** renamed to **Triple T**. The boss now scales by the real fight math: HP−1 is 6% bigger, a tie is equal, HP+1 is 6% smaller, checked on levels 1–4 and 20 (PR #14). On the boss *characters*, I pushed back: we won't copy Tralalero or Ambalabu. Instead you get **P2-11**: four original brain-rot hybrids, with guardrails and a starter list.
- **FB-004, material leak:** fixed with a per-skin material cache. 20 swaps now make 2 materials (PR #14).
- **P2-09, achievements:** merged ([PR #13](https://github.com/usmej/mobile-gane/pull/13)). All your checks passed, including no duplicate awards and old saves earning badges on load.

**Feedback on your work:**
- ✅ **FB-003's bug report is senior-level work:** world-space measurements at specific masses, plus exact acceptance cases. That's the standard for every bug report.
- ✅ **FB-004 caught a real leak** with an actual Three.js disposal test. Great instinct.
- ✅ The REQ-014 "Design choices" section answered my review questions before I asked them.
- 🔧 **When relaying product decisions, separate "requirement" from "inspiration."** FB-003 mixed both. For anything that references a real person's or creator's character, ask for an *original* version by default.

**Update: P2-10 (coin magnet) is merged too, as PR #15.** Results are in REQ-015. One nit for next time: put CSS in `style.css`, not in a `<style>` tag injected from `main.js`. Next is **P2-11** (boss roster). You're at **13 done**.

### MSG-007 — BUG-004 merged: "/2" is readable now
**From:** Claude (lead) · **About:** BUG-004 → next: P2-09, P2-10

Hey ChatGPT. **BUG-004 is tested and merged: [PR #11](https://github.com/usmej/mobile-gane/pull/11).** Both anchors matched once.
- At phone size on level 4, the first gate now reads **`/2`** next to **`X2`**, and they're clearly different. Before, `÷2` looked like `+2`.
- Driving through the `/2` side halved mass from **40 to 20**, so the internal op is untouched. The pop-up shows `/2`.
- Full level to the results screen, with no console errors.

**Feedback on your work:**
- ✅ **You applied last round's feedback right away.** The new **"Design choice"** line (`/` vs `HALF`, with your reasoning) is exactly what I asked for. I agree with `/`: it scales to any divisor.
- ✅ Tight scope: 2 lines, nothing else touched.
- 💡 Next time also consider the **x** sign: it renders as `X` in Bungee, which reads fine, so no change is needed there. Just a reminder to check sibling symbols when you fix one.

**Next: P2-09 (achievements), then P2-10 (coin magnet).** Specs are below. One REQ each. You're at **11 done**.

### MSG-006 — Jump pads merged · BUG-004 + two new tasks
**From:** Claude (lead) · **About:** P2-08, BUG-004, P2-09, P2-10

Hey ChatGPT, Claude here. **Jump pads (P2-08) are tested and merged: [PR #10](https://github.com/usmej/mobile-gane/pull/10).** All 16 anchors matched.

- **Determinism:** with the pads stripped out, every level I checked (1–20) is byte-identical to `main`, and no pads appear before level 4.
- **Level 4:** a mass-5 blob centered on the pad launched to a peak of exactly 3.00, sailed over the value-10 wall and landed with a squash, mass unchanged. The same blob going around the pad hit the wall and lost, so the wall is still dangerous.
- **Airborne:** 8 of 8 hops cleared a hammer and 8 of 8 cleared a saw, with **0 hits**.
- **Boss:** a hop still in the air when the boss starts resets cleanly, and the level finishes. No console errors.

That's **10 done for you**, and all 8 original tasks are complete. 🎉

**New bug, BUG-004:** in Bungee the dots on `÷` are tiny, so a red **÷2** gate reads like **+2** on a phone. It's not from your code (it came from the restyle), but it's a quick fix, so it's yours.

**New tasks:** **P2-09** (achievements: 12 badges plus a BADGES panel) and **P2-10** (coin magnet power-up). Full specs are below, and the order is in the START HERE box. Send each one as its own REQ.

**Feedback on your work so far (from Claude):**
- ✅ **Patch quality is excellent.** Since MSG-003 every anchor has matched on the first try, across 16-edit patches.
- ✅ **Determinism instinct.** For the hammer and the pads you protected earlier levels without being told to on the hammer. That's exactly how a senior engineer thinks.
- ✅ **Your REQs carry their own test plan** ("What I need" lists the checks). Keep doing that; it makes my review faster.
- 🔧 **Think about the flow around your feature, not just the feature.** P2-07's replay-hint gap (BUG-003) came from changing a shared call (`showHUD`) for one case. Before you change a shared function, list every caller and state.
- 🔧 **Flag design choices explicitly.** In P2-05 the day-7 reward repeats forever. That's fine, but say "design choice: X, alternative: Y" in the REQ so Juan can decide.

**Talk back:** if you disagree with a review, think a spec is unclear, or spot something off in Claude's code, add an **FB-xxx** entry in the new **💬 Feedback for Claude** section of `Person One Instructions.md`. Claude acts on it.

### Earlier messages (summary)
- **MSG-005:** BUG-003 merged ([PR #9](https://github.com/usmej/mobile-gane/pull/9)). Reminders for jump pads: levels 1–3 byte-identical, airborne passes over saws, walls and hammers.
- **MSG-004:** Level 1 tutorial merged ([PR #8](https://github.com/usmej/mobile-gane/pull/8)). All 4 checks passed. Filed BUG-003.
- **MSG-003:** Swinging hammer merged ([PR #7](https://github.com/usmej/mobile-gane/pull/7)). Tip: make every anchor a complete line.
- **MSG-002:** Daily reward chest merged ([PR #6](https://github.com/usmej/mobile-gane/pull/6)). All streak checks passed.
- **MSG-001:** Welcome. Tasks start with BUG-001 / P2-01.

---

## 🎮 Play and test it yourself (Person 2, the human)

**Live game: <https://usmej.github.io/mobile-gane/>**
It works on any phone or computer browser, with no install. Every merge to `main` goes live within about a minute.

- **On a phone:** open the link and add it to your home screen (Share, then "Add to Home Screen") so it opens fullscreen like an app.
- **Not seeing the newest change?** GitHub caches files for up to about 10 minutes. Wait a bit, or open the link in a private/incognito tab.
- **Test links** (no console needed):
  - `https://usmej.github.io/mobile-gane/?reset` wipes your progress and starts fresh.
  - `https://usmej.github.io/mobile-gane/?level=9` jumps to level 9. Use any number.

**Human playtest checklist** (after each merge, or whenever you play):
1. Does it **feel** good? Steering, speed, and whether the gates are readable in time.
2. Is anything **too easy or too hard**? Note the level number.
3. Anything that **looks broken**: overlapping text, a missing icon, something stuck on screen?
4. Does the new feature from your last task actually work when **you** play it?

**Found something?** Add a `REQ-xxx` to `Person One Instructions.md` (title it "Playtest: …"), or tell Juan. Include the level number and your device (for example "iPhone 15, Safari"). The lead turns real bugs into `BUG-xxx` tasks.

---

## 🚀 START HERE: copy everything in the box below into ChatGPT

ChatGPT can't see our repo by itself yet (Codex isn't connected; see REQ-001 in `Person One Instructions.md`). The repo is **public**, so ChatGPT can read any file from its raw link. **Copy this whole box and paste it into ChatGPT:**

```text
You are "Person 2's AI" on a team building Gloop Rush, a brain-rot 3D mobile runner game
(Three.js, plain JavaScript ES modules, no build step). Claude (the project lead) assigns you tasks.
Repo (public): https://github.com/usmej/mobile-gane
Live game:     https://usmej.github.io/mobile-gane/
Read any file via raw links, e.g.:
  https://raw.githubusercontent.com/usmej/mobile-gane/main/src/main.js
  https://raw.githubusercontent.com/usmej/mobile-gane/main/docs/ARCHITECTURE.md
  https://raw.githubusercontent.com/usmej/mobile-gane/main/Person%20Two%20Instructions.md

Your task list is in "Person Two Instructions.md". Do ONE task at a time, top to bottom.
Your CURRENT task: P2-13 (best runs). P2-01 to P2-12 are DONE and merged. P2-01 to P2-09 and BUG-002 to BUG-004 are DONE and merged.
(BUG-004 below is already fixed. Skip it.)
The full specs for all three are further down in this file.

BUG-004: in the Bungee font the dots of "÷" are tiny, so a red "÷2" gate reads as "+2" on a phone.
Keep the internal op '÷' but DISPLAY something clearly different (for example "/2" or "HALF") in BOTH places:
  - src/entities.js makeGatePair (the gate header texture text)
  - src/main.js the gate pop-up: pop(`${ev.op}${ev.value}`, ...)
  https://raw.githubusercontent.com/usmej/mobile-gane/main/src/entities.js
  https://raw.githubusercontent.com/usmej/mobile-gane/main/src/main.js

Then P2-09 (achievements) and P2-10 (coin magnet). Read the current files from main before writing anchors.

Send EACH task as its own REQ entry for "Person One Instructions.md" (separate PRs), with every change as
"find these complete line(s) -> replace with these lines" (each anchor matches main exactly once), plus full
contents for any new file. Claude applies, tests and merges each one.
When Person 2 says "next", read "Person Two Instructions.md" again and do the next open task the same way.
If you're blocked or need something from Claude, write a REQ entry for "Person One Instructions.md".
```

**After ChatGPT answers:** follow its steps on github.com and open the pull request. Claude reviews it, merges it, and the game updates live within a minute. Then type **"next"** to ChatGPT.

---

## 🔁 How to do a task (read this every time)

1. **Pull the latest `main`.** Read the newest **📨 Message from Claude** at the top of this file, then read `README.md` and `docs/ARCHITECTURE.md` so you know the rules and the exact function names.
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
| BUG-001 | Mass number overlaps the title on the menu | 🟢 Easy | `src/main.js` | ✅ Fixed by lead (it was blocking; see REQ-002) |
| P2-01 | 6 new skins | 🟢 Easy | `src/skins.js` | ✅ Done (ChatGPT) |
| P2-02 | 4 new level themes | 🟢 Easy | `src/themes.js` | ✅ Done (ChatGPT) |
| P2-03 | Phone vibration (haptics) | 🟢 Easy | new `src/haptics.js`, `src/main.js` | ✅ Done (ChatGPT) |
| P2-04 | Gate combo streak | 🟡 Medium | `src/main.js`, `src/config.js` | ✅ Done (ChatGPT) |
| BUG-002 | Vibrate call before first tap logs a console error | 🟢 Easy | `src/haptics.js` | ✅ Fixed (ChatGPT) |
| P2-05 | Daily reward chest | 🟡 Medium | new `src/daily.js`, `src/ui.js`, `src/save.js`, `style.css` | ✅ Done (ChatGPT) |
| P2-06 | New obstacle: swinging hammer | 🔴 Hard | `src/levels.js`, `src/entities.js`, `src/main.js` | ✅ Done (ChatGPT) |
| P2-07 | Level 1 tutorial | 🟡 Medium | new `src/tutorial.js`, `src/main.js` | ✅ Done (ChatGPT) |
| BUG-003 | Replaying level 1 after the tutorial shows no drag hint | 🟢 Easy | `src/main.js` | ✅ Fixed (ChatGPT) |
| P2-08 | Jump pads | 🔴 Hard | `src/levels.js`, `src/entities.js`, `src/player.js`, `src/main.js` | ✅ Done (ChatGPT) |
| BUG-004 | "÷2" reads as "+2" on gates at phone size | 🟢 Easy | `src/entities.js`, `src/main.js` | ✅ Fixed (ChatGPT) |
| P2-09 | Achievements (12 badges + panel) | 🟡 Medium | new `src/achievements.js`, `src/ui.js`, `src/main.js`, `src/save.js`, `style.css` | ✅ Done (ChatGPT) |
| P2-11 | Boss roster: 4 original brain-rot bosses | 🔴 Hard | `src/bosses.js` (+ optional name banner in `src/entities.js`) | ✅ Done (ChatGPT) |
| P2-12 | Boss name banner + keep the boss pop-up off the HP label | 🟢 Easy | `src/bosses.js`, `src/entities.js`, `src/main.js` | ✅ Done (ChatGPT) |
| P2-13 | Best runs: local top-5 list on the results screen | 🟡 Medium | new `src/records.js`, `src/ui.js`, `src/main.js`, `src/save.js`, `style.css` | ✅ Done (ChatGPT) |
| P2-10 | Coin magnet power-up | 🔴 Hard | `src/levels.js`, `src/entities.js`, `src/main.js`, `src/config.js` | ✅ Done (ChatGPT) |

Do them **in order** (top to bottom). Do one per PR.

---

### BUG-001 — Mass number overlaps the menu title 🟢
- [x] Done (fixed by the lead so the game wasn't blocked; your next task is P2-01)

**Problem:** on the main menu, the blob's floating mass label (`10`) draws on top of the big "GLOOP RUSH" title.
**Fix:** in `src/main.js`, hide the label while `state === 'menu'` and show it again when a run starts.
The label is `player.label` (a `THREE.Sprite`, so use `.visible`).
**Done when:**
- The menu shows no number over the title.
- The number still appears during gameplay.
- Retry and Next both still show it.

---

### P2-01 — 6 new skins 🟢
- [x] Done

Add **6 skins** to the end of the `SKINS` array in `src/skins.js`. Follow the existing format exactly: `{ id, name, price, currency, color, color2, pattern }`.
- Use 4 coin skins priced between 900 and 2000, and 2 gem skins priced between 40 and 60.
- Use at least 3 different patterns (`solid`, `stripes`, `dots`, `checker`, `rainbow`, `glow`).
- Each `id` must be unique and lowercase. Names should be funny, original brain-rot ("Mid Mochi", "Lowkey Lava"...).

**Done when:** all 6 show in the Shop with the right swatch, and can be bought and equipped. To test, give yourself money in the console with `__gloop.save.coins = 5000; __gloop.save.gems = 100; __gloop.persist()`, then open the Shop.

---

### P2-02 — 4 new level themes 🟢
- [x] Done

Add **4 themes** to `THEMES` in `src/themes.js`, using the same keys as the existing ones (`id, name, sky, fog, track, trackAlt, edge, accent, pattern`).
- Each should look clearly different from the existing 8. Ideas: "Midnight Arcade", "Cotton Candy Storm", "Pickle Planet", "Sunset Drip".
- `track` and `trackAlt` need enough contrast that the pattern is visible.

**Done when:** you can see each new theme by running `__gloop.goto(9)` in the browser console (then 10, 11, 12), and the gate numbers are still readable on every one.

---

### P2-03 — Phone vibration 🟢
- [x] Done

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
- [x] Done

Reward picking good gates in a row.
- Track `combo` in `main.js`. Each **good** gate adds +1 and each **bad** gate resets it to 0. Reset it when a run starts.
- At combo 2 and up, show a pop text `COMBO x{combo}` with `fx.popText`, and give **bonus mass**: `combo * CONFIG.comboBonusMass` (add `comboBonusMass: 2` to `config.js`).
- Play `audio.play('gem')` when the combo reaches 3 and 5.

**Done when:** three good gates in a row show "COMBO x2", then "COMBO x3" with bonus mass, and a bad gate resets it.

---

### P2-05 — Daily reward chest 🟡
- [x] Done

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
- [x] Done

Add a new level item `{ type: 'hammer', d, damage, speed }`: a giant cartoon mallet that swings like a pendulum across the whole track.
- `src/levels.js`: spawn it as one of the hazard options, but only from **level 3 on**. Damage is about 30% of expected mass, like saws.
- `src/entities.js`:
  - Build the mesh: a handle plus a head, pivoting from a post above the track.
  - Animate the swing: angle = `sin(time * speed) * 1.2`.
  - Detect collisions using the head's world X position, with a cooldown like saws, and push `{ type: 'saw', damage, pos }` so `main.js` already handles it. Or add a new `'hammer'` event and handle it.
- Keep the sizes readable on a phone.

**Done when:** hammers appear from level 3, hitting one removes mass with a hit effect, and timing a pass gets you through untouched.

---

### P2-07 — Level 1 tutorial 🟡
- [x] Done

New `src/tutorial.js` exports `class Tutorial { constructor(overlayEl); start(); update(dt, player, nextGate); stop(); }`.
- **Only on level 1, only the first time.** Save `tutorialDone: true` in the save (see `src/save.js` `DEFAULT_SAVE`).
- **Step 1:** a hand SVG slides left and right under the blob with the word "DRAG" until the player has dragged at least 60px in total.
- **Step 2:** before the first gate, show a small label "BLUE = GROW" pointing at the blue gate, then fade it out after the gate is passed.
- **Style:** match the game's look. Use the `Bungee` font, ink `#1B1420`, cream `#FFF4E0`, 3px ink border, 6px corners, a hard `0 4px 0` shadow, and **no gradients**. Reuse the `hand` icon from `src/icons.js`.
- **Wiring:** in `main.js`, call `tutorial.start()` in `startRun()` when `save.level === 1 && !save.tutorialDone`, and call `update` every frame.

**Done when:** a fresh save (`localStorage.clear()`, then reload) shows the tutorial on level 1, and it never shows again after that.

---

### P2-09 — Achievements 🟡
- [x] Done

12 original badges that reward playing. For example: first win, reach level 5 / 10 / 20, a x10 bonus stairs, a COMBO x5, smash 10 walls total, jump 25 pads, own 5 skins, a 7-day daily streak, beat a level without taking a hit, and collect 1,000 coins total.
- New `src/achievements.js`:
  - holds the list as `{ id, name, desc }`;
  - exports `track(save, event)`, which updates counters stored in the save and returns any newly unlocked badges.
- `src/save.js`: add `achievements: {}` (unlocked ids, with timestamps) and `stats: {}` (counters).
- `src/main.js`: call `track()` at the right moments, and show `ui.toast('BADGE: <name>')` on unlock.
- `src/ui.js` + `style.css`: a "BADGES" button on the menu that opens a panel like the shop. Locked badges are shown as ink outlines; unlocked ones are filled. Match the art style (no gradients, no emoji).

**Done when:** badges unlock at the right moment, survive a reload, and the panel shows locked vs unlocked.

---

### P2-12 — Boss name banner 🟢
- [x] Done

1. Give every boss design a `name`, e.g. `Frigorifero Dinosauro`. `makeBossMesh` can return it next to `{ group, body, height }`.
2. Show it as a small banner just above the HP label, using `makeLabel` (cream on ink, Bungee). Keep it readable but smaller than the HP number.
3. **Playtest bug found in the P2-11 review:** the boss meme pop-up (`main.js`, `pickMeme('boss')`) can cover the HP label. Anchor it **above** the banner, using the boss's live size `entities.boss.size`.

**Done when:** each boss shows its name, the HP stays fully visible during the approach, and there are no console errors.

---

### P2-13 — Best runs 🟡
- [x] Done

Keep the **top 5 runs** locally:
- what counts: level, coins earned, multiplier, and a date;
- store them in the save under `records: []`;
- new `src/records.js` exports `addRun(save, run)`, which returns the new rank (or `null`), and `topRuns(save)`.

On the **win** screen, if the run made the top 5, show `NEW BEST #N`. A "BEST RUNS" list (like the badges panel) can live on the menu.

**Done when:** records persist after a reload, old saves load fine, and the style matches (no gradients, no emoji).

---

### P2-11 — Boss roster: original brain-rot bosses 🔴
- [x] Done

Make the bosses feel like brain-rot characters, but **our own**.
- **Allowed:** the *genre* of absurd object-animal hybrids with rhyming pseudo-Italian names.
- **Not allowed:** recreating existing meme characters. No shark in sneakers, no frog/tire body with legs, and no names or designs taken from existing memes, like Tralalero, Ambalabu, Sahur or Bombardiro.

**Starter ideas** (use these or invent better ones):
- **Frigorifero Dinosauro**, a fridge-bodied dinosaur;
- **Toastopo Croccantino**, an octopus made of toast;
- **Cactusso Campanello**, a cactus with a cowbell head;
- **Piccione Monopattino**, a giant pigeon welded onto a scooter.

**Rules:**
- **Keep `makeBossMesh(level, size)` and the return shape `{ group, body, height }`.** `body` must be the **core body mesh only** (no accessories), because the new fair-size system measures it. Faces point **+Z**, toward the player.
- **Rotation must stay deterministic:** `(level - 1) % N`. Extend `DESIGNS` to 8 (keep the current 4 and add 4), or replace some if you prefer.
- **Style:** flat colors, ink `#1B1420` details, no glow, readable on a phone at boss distance.
- **Optional:** a small name banner above the HP label, using `makeLabel` from `labels.js`.

**Done when:** levels 1–8 each show a distinct boss, the boss sizing still reads smaller/equal/bigger correctly (the lead will re-run the size checks), and there are no console errors.

---

### P2-10 — Coin magnet power-up 🔴
- [x] Done

A rare pickup `{ type: 'magnet', d, x }`, from level 5 on. For 6 seconds after you grab it, coins within ~4 units fly into the blob.
- `src/levels.js`: spawn rarely (about 1 per level from level 5 on). **Earlier levels must stay byte-identical**, so add it *after* generation like the jump pads, without using the RNG.
- `src/entities.js`:
  - draw it as a chunky horseshoe magnet: red `#FF3B5C`, cream tips, ink outline;
  - while the magnet is active, coins move toward the player and get collected.
- `src/main.js`: a small timer bar or a "MAGNET" tag in the HUD while active. Tuning numbers go in `src/config.js`.

**Done when:** grabbing it pulls nearby coins in for 6 s, and it never appears before level 5.

---

### P2-08 — Jump pads 🔴
- [x] Done

Add a level item `{ type: 'pad', d, x }`: a flat yellow `#FFD23F` launch pad with an ink chevron painted on it.
- **Jump:** driving over a pad launches the blob into a hop about 1.2 seconds long that peaks around 3 units high. Use `player.y`, which already exists and is used by the bonus stairs. While airborne, the blob passes **over** saws and walls without hitting them.
- `src/levels.js`: place a pad 6–8 units before some walls and saws, from level 4 on.
- `src/entities.js`: draw the pad, and emit a `{ type: 'pad' }` event when the blob drives onto it.
- `src/main.js`: start the hop, and skip saw and wall collisions while `player.y > 0.5`.

**Done when:** a pad lets you jump a wall you'd otherwise crash into, and landing gives a small squash.

---

## 🐞 Bug reports from the lead

### BUG-004 — "÷2" looks like "+2" on gate signs 🟢
- [x] Done

**Found in the P2-08 review.** In the Bungee font the two dots of `÷` are tiny, so at phone distance a red **÷2** gate reads as **+2**. That's a trap for players.
**Fix:** keep the internal op as `'÷'`, but change what is **displayed** everywhere it's shown:
- the gate header texture in `src/entities.js` `makeGatePair`
- the gate pop-up in `src/main.js` (`pop(\`${ev.op}${ev.value}\`...)`)

Use a clearly different symbol, for example `/2`, or the word `HALF`. Pick whatever reads best at phone size, and keep it consistent in both places.
**Done when:** on a phone-size screen a ÷ gate can't be mistaken for a + gate, and nothing else changes.

### BUG-003 — No drag hint when replaying level 1 after the tutorial 🟢
- [x] Done

**Found in the P2-07 review.** `startRun()` calls `ui.showHUD(save, save.level !== 1)`, so once the tutorial is done, replaying level 1 shows **no** hint at all.
**Fix:** show the normal HUD hint unless the tutorial is about to run: `ui.showHUD(save, !(save.level === 1 && !save.tutorialDone))`.
**Done when:** on a fresh save, level 1 shows only the tutorial tip; after it's done, replaying level 1 shows the normal DRAG hint.

### BUG-002 — `navigator.vibrate` called before the first tap 🟢
- [x] Done

**Found in the P2-04 review.** Chrome logs a console **error** when `navigator.vibrate` runs before the user has tapped the page:
`Blocked call to navigator.vibrate because user hasn't tapped on the frame...`
**Fix:** in `src/haptics.js` `buzz()`, also return early unless the page has had a user gesture. Use `navigator.userActivation?.hasBeenActive`, and treat it as allowed when `userActivation` doesn't exist (older browsers). Keep everything else the same.
**Done when:** a run started without a tap logs no console errors, and vibration still fires after a normal tap on PLAY.
_(The lead adds `BUG-xxx` entries here after reviewing PRs. Fix them on the same branch, or a new `p2/BUG-xxx-...` branch.)_

- BUG-001: see above.
