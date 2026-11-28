# Rooster Rush: retention plan (kid-safe)

Juan's goal: make kids **want to come back and keep playing**. This plan does that with **healthy engagement**: the reasons kids return to great games (mastery, progress, collecting, surprise). It avoids manipulative "addiction" tricks, which are both harmful and a **legal risk** for a kids' game, especially once payments arrive.

## What the research says

- **Self-Determination Theory** ([Ryan, Rigby & Przybylski 2006](https://www.doi.org/10.1007/S11031-006-9051-8)): **competence**, **autonomy** and **relatedness** each independently predict enjoyment *and future play*. Games that feed these needs keep players coming back. That's the backbone of this plan.
  - **Competence:** I'm getting better.
  - **Autonomy:** I choose what to do.
  - **Relatedness:** I'm connected to others.
- The same research line warns that very high-pull designs can tip into problematic, addictive-style play ([Rochester / SDT work](https://www.rochester.edu/news/printable.php?id=2719)).
- **Regulators target "dark patterns" in kids' games:**
  - **FTC v. Epic Games (2022): $520M.** It included $245M in refunds over dark patterns that led kids into unwanted purchases: saved cards by default, confusing buttons, and hard-to-cancel purchases ([FTC](https://www.ftc.gov/node/80648), [Orrick summary](https://www.orrick.com/en/Insights/2023/02/6-Top-Takeaways-from-FTCs-Landmark-Epic-Games-Settlements)).
  - **UK Children's Code / ICO game guidance:** no nudge techniques against kids' interests. It named reward loops and streaks as concerns and recommends **built-in breaks and break prompts** ([ICO 2023](https://ico.org.uk/about-the-ico/media-centre/news-and-blogs/2023/02/new-guidance-to-industry-issued-for-game-developers-on-protecting-children)).

## ✅ Do: healthy hooks (what we'll build)

| Need | Feature | Why kids come back |
|---|---|---|
| Competence | **1–3 stars per level:** ★ clear, ★★ beat the boss with a fight bonus, ★★★ perfect fight plus no hits | A reason to replay old levels via the level picker. Mastery feels great. |
| Competence | **"So close!" feedback:** "Only 12 mass short!" with a highlight of the best gate you missed | Turns a loss into "one more try" honestly, by teaching. |
| Competence | **World challenges:** 3 per world, e.g. "Clear 2-4 without touching mold" | Clear goals and skill growth. |
| Autonomy | **Level picker, character choice, route choice** | Player-chosen goals. |
| Collection | **Character album:** a page with silhouettes of every character, with how to get each ("Beat 3-5", "250 coins") | Collecting is a top motivator for kids, and the goal is always visible. |
| Novelty | A **new mechanic per world** (in progress) plus rare **golden-gate** surprises | Curiosity: "what's next?" |
| Novelty | **Weekly silly level:** a rotating modifier (giant mode, mirror track, double gates) | A fresh reason to return, with no penalty for missing it. |
| Progress | **World map** showing the next world's teaser silhouette | Anticipation. |
| Relatedness (kid-safe, no chat) | **Run card:** a shareable picture of your best run (character, level, mass) that a parent can share | Social pride, with no data collection. |
| Relatedness | **Ghost race:** race a faint ghost of your own best run | Self-competition with no strangers. |
| Feel | More **juice**: sounds, haptics, combo meter, boss reactions | Moment-to-moment fun. |
| Competence | **Keep going (gems):** after a loss, pay gems to continue from where you fell. The price grows with level and character size, and doubles each time in the same run. TRY AGAIN restarts for free. | A loss near the end isn't a full reset. Gems get a real use. |
| Returning | **Daily mission** (e.g. "peck 30 corn") with a small reward, which **never punishes missed days** | Return motivation without anxiety. |

## ❌ Don't (harmful and/or legal risk)

- **Loss-based streaks:** "you lose your streak if you miss a day". → Change our daily chest so a missed day **pauses** the streak instead of resetting it.
- **FOMO countdown timers** and "limited time only!" pressure on kids.
- **Loot boxes / paid random rewards.**
- **Pay-to-win or paywalled progress.** Never sell mass, gates or boss wins.
- **Confusing purchase buttons, purchases without a parent, saved payment by default** (the exact Epic violations).
- **Notifications that guilt kids** ("Rocco misses you 😢"), and endless play with no natural stopping points.
- **Collecting personal data** from kids. COPPA applies to under-13s, so keep everything local.

## 🔬 More research to use (round 2)

| Finding | What it means for Rooster Rush |
|---|---|
| **Goal-gradient effect:** people speed up as a goal gets close ([Kivetz, Urminsky & Zheng 2006](https://doi.org/10.1509/jmkr.43.1.39)) | Show progress toward the **next character unlock** and the **world's boss** on the menu ("2 levels to the boss!"). |
| **Endowed progress:** a goal that already looks partly done gets finished more often ([Nunes & Drèze 2006](https://doi.org/10.1086/500480)) | Start each world's challenge card with the first box already ticked for reaching the world. |
| **Flow:** fun is when challenge matches skill ([Csikszentmihalyi](https://en.wikipedia.org/wiki/Flow_(psychology))) | Keep difficulty rising slowly. After 3 losses in a row on one level, quietly add one extra blue gate (an assist, never announced as "easy mode"). |
| **Curiosity and open loops:** an unfinished set keeps pulling you back | Album silhouettes plus "next world" teasers. End each world on a reveal of the next one. |
| **Gamification works when tied to real goals, and fades when it's just points** ([Hamari, Koivisto & Sarsa 2014](https://doi.org/10.1109/HICSS.2014.377)) | Every reward unlocks something you can *see or use* (a character, a costume, a new world), not a bare number. |

## 💳 Before payments (next phase)

- **Keep going must stay fair:** if gems ever become buyable, a paid continue turns into pay-to-win. Either keep gems **earn-only**, or let continues use only earned gems. Decide before payments ship.

- **Parental gate** before any purchase screen (e.g. an adult math question or a hold-to-confirm), with a clear price in real currency.
- Use **App Store / Google Play in-app purchase** systems (required for digital goods in apps), or Stripe with a parent account on the web. **Never store card details ourselves.**
- **Cosmetic-only purchases** (characters, trails, celebrations) or a one-time "supporter pack". No consumables that affect winning.
- Clear refund path. No purchase on a single tap. Purchase confirmations go to the parent.
- Kids categories (Apple Kids, Google Families) restrict third-party ads and analytics. Plan for none.

## Who builds what

- **🟦 ChatGPT** (gameplay and logic): stars per level (REQ-039), world challenges (REQ-040), daily missions and the non-punishing daily-chest change (REQ-041), weekly silly-level modifier (REQ-042), plus REQ-037 (level picker, which shows the stars).
- **🟧 Claude** (UI and feel): character album, "So close!" feedback, Keep going (gems), run-card share image, juice pass, world-map teaser, ghost race.

_Juan's call (2026-11-27): no stretch-break prompt, so players aren't pulled out of the game. Natural stopping points (end of each level and world) stay._
