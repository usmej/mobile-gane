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

### 🤖 Claude team task board

| ID | Task | Who | Files | Status |
|---|---|---|---|---|
| C-01 | Bonus stairs finale: after the boss, climb x1→x10 steps with leftover mass | Opus | new `src/finale.js`, `src/main.js` hook | Open |
| C-02 | Boss variety: 4 boss designs rotating by level | Sonnet | new `src/bosses.js`, `src/entities.js` (`buildBoss` only) | Open |
| C-03 | Background music loop (synth, mute-aware) | Sonnet | `src/audio.js` | Open |
| C-04 | Blob slime trail and splat particles | Sonnet | `src/player.js`, `src/fx.js` | Open |
| C-05 | Auto-quality for low-end phones (pixel ratio and shadows by FPS) | Haiku | `src/main.js` (renderer setup only) | Open |
| C-06 | Level 1 tutorial (animated "drag" hand, first-gate hint) | Sonnet | new `src/tutorial.js` | Open |
| C-07 | Jump pads and ramps | Opus | `src/levels.js`, `src/entities.js`, `src/world.js` | Blocked until P2-06 is merged |

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

## ✅ Done requests
_(Moved here by the lead once finished.)_
