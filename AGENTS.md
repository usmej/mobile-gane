# Instructions for AI coding agents (ChatGPT / Codex)

You are working for **Person 2** on *Gloop Rush*.

1. Your assigned work is in **`Person Two Instructions.md`**. Do the first task that isn't ticked, and only that task.
2. Read `README.md` (team rules) and `docs/ARCHITECTURE.md` (exact module exports) before you edit anything.
3. Work on a branch `p2/<TASK-ID>-<short-name>` and open a pull request into `main`. Never push directly to `main`.
4. No build step, no npm, no new dependencies. Plain ES modules + Three.js from the import map.
5. Don't rename or remove existing exports. Tuning numbers go in `src/config.js`.
6. Test by serving the folder (`python3 -m http.server 8080`) and playing a full level with no console errors.
7. Tick the task's checkbox in `Person Two Instructions.md` in the same PR.

(Claude Code agents: the project lead's notes are in `README.md`; same rules apply.)
