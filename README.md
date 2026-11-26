# 🟢 Gloop Rush

An original **brain-rot 3D mobile runner**, made for the phone and played in the browser.
You run down a candy-colored track as a squishy blob, pick the right gates (`+7`, `x2`, `-8`, `÷2`),
eat healthy food to grow, dodge saws, smash walls, and beat the boss at the end if you're **big enough**.
Coins, gems, 14 skins, 8 rotating themes and endless levels.

> Genre reference: "jelly run / tall man run"-style runners. The mechanics are similar, but every name, character and visual here is our own.

---

## ▶️ Play it locally

```bash
python3 -m http.server 8080
```
Then open <http://localhost:8080>. To play on your phone, connect it to the same Wi-Fi and open `http://<your-computer-ip>:8080`.
Controls: **drag left and right** (or use the ← → keys on a computer).

---

## 👥 The team & how we work

| Who | Role |
|---|---|
| **Person 1** (Juan) + **Claude Opus** | **Project lead / manager.** Opus designs the architecture, writes the core engine, splits work into tasks, reviews every pull request and merges it into `main`. |
| Claude **Sonnet** / **Haiku** subagents | Helpers that Opus sends out for self-contained modules (Sonnet) and simple data or boilerplate (Haiku). |
| **Person 2** + **ChatGPT** | Teammate. Picks up tasks from **[`Person Two Instructions.md`](Person%20Two%20Instructions.md)**, writes the code, and opens a pull request. |

### The rules (from the original brief)
1. **`main` is the source of truth and must always run.** Nobody pushes broken code to `main`.
2. **Person 2 works on branches** named `p2/<task-id>-<short-name>` and opens a **pull request** into `main`. The lead reviews and merges.
3. **Tasks and bug reports for Person 2 live in [`Person Two Instructions.md`](Person%20Two%20Instructions.md).** When ChatGPT finishes a task, it puts the code in the repo (not just in the chat) and ticks the box in that file in the same PR.
4. **Person 2 → lead requests go in [`Person One Instructions.md`](Person%20One%20Instructions.md)** (`REQ-xxx`). The lead does them, or hands them to Sonnet or Haiku, and answers there.
5. **Bugs go back to whoever owns the task.** If a merged PR causes a bug, the lead adds a `BUG-xxx` entry to Person 2's file, and the fix comes back through a PR.
6. **The lead delegates by difficulty.** Hard design and core logic stay with Opus; medium, self-contained modules go to Sonnet; simple, repetitive work goes to Haiku.
7. **No real money.** Coins and gems are only earned by playing. Payments are out of scope until we decide how to process them safely.
8. **Make it fun.** Loud colors, juicy effects, meme pop-ups, unlockable skins, levels that feel different, and a reason to play "just one more".

---

## 🧠 Game design

- **Mass** is your number. It floats over the blob, and the blob grows as it goes up.
- **Gates:** blue is good (`+N`, `xN`) and red is bad (`-N`, `÷N`). Choose your side.
- **Food:** 🥦 healthy food grows you, 🍔 junk shrinks you ("eat healthier").
- **Coins** 🪙 and **gems** 💎 pay for skins in the shop.
- **Saws** slide side to side and cut your mass. **Walls** show a number: if you're bigger, you smash through and lose that much mass. If you're smaller, it's game over.
- **The boss** waits at the finish with HP. If your mass is at least its HP, you win, and leftover mass becomes a **coin multiplier from x1 to x10**.
- **Levels** are generated from a seed, so each level number always plays the same way. Difficulty, speed and length grow over time, and the color theme changes every level.

---

## 🗂️ Code map

Full module contracts are in **[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)**. Read it before changing any file.

```
index.html          page shell + Three.js import map (no build step)
style.css           all UI styling
src/main.js         game loop & state machine (lead)
src/levels.js       seeded level generator (lead)
src/entities.js     gates, food, coins, saws, walls, boss + collisions (lead)
src/player.js       the blob (lead)
src/world.js        track, sky, scenery (lead)
src/config.js       ALL tuning numbers
src/ui.js           menus, HUD, shop
src/fx.js           particles + floating meme text
src/audio.js        synthesized sound effects
src/skins.js        skins (data + materials)
src/themes.js       level color themes (data)
src/memes.js        meme text pack (data)
src/save.js         localStorage progress
```

## 🧪 Debugging
Open the browser console. `__gloop` exposes `save`, `player`, `level` and `state`, plus `__gloop.goto(n)` to jump to level n and `__gloop.persist()` to save after you edit `__gloop.save`.
To reset progress, run `localStorage.clear()` and reload.
