# Rooster Rush: legal review (research-based, 2026-11-27)

_Done by Claude from public sources. It is a careful checklist, **not** a lawyer's opinion, and it can't replace one for the final sign-off on real money._

## ✅ Was high risk, now fixed: characters

- **The risk:** the brain-rot meme characters are in an **active trademark and copyright fight** ([NPR, Aug 2026](https://npr.org/2026/08/19/nx-s1-5867638/artificial-intelligence-brainrot-memes-copyright-spyder-tung-tung-sahur)). Our first character set was too close to that meme style.
- **The fix (Juan, 2026-11-27):** the game is now **farm-themed**, with all-original characters:
  - **Hero:** Rocco, a cartoon rooster that eats corn.
  - **Bosses:** 8 ordinary cartoon farm animals with our own names.
- **The rule going forward:** every character is our own invention. No meme characters, mascots or brands. Apple's copycat and IP rules (guidelines 4.1 and 5.2) also stay satisfied.

## 🟡 Medium: needed before launch (mostly already planned)

2. **Kids' privacy (COPPA):**
   - IP addresses count as personal info, and third-party plug-ins and CDNs receive them automatically. Our Google Fonts and jsDelivr requests are the only leak, so self-hosting them fixes it (**REQ-044**).
   - With no data collected, the 2025 COPPA amendments (written security and retention policies, parental consent for sharing) have nothing to apply to. Keep it that way: no analytics, ads, accounts or chat.
3. **App-store age laws:**
   - **Texas** (SB 2420) has been **in effect since the 5th Circuit stayed its injunction on May 28, 2026**. Utah and Louisiana have similar laws.
   - Developers must give an **age rating for the app and for each in-app purchase**, and use the store's age and parental-consent signal. There's a safe harbor if we rely in good faith on the store's info.
   - **Fix:** when we build the app, set ratings per product and read Apple/Google's age-range signal.
4. **Store rules for kids' apps:**
   - **Apple Kids Category:** purchases only behind a parental gate ✅, no third-party ads or analytics ✅, Restore purchases ✅, Apple in-app purchase only ✅.
   - **Google Families:** no deceptive or aggressive purchase flows ✅. Notify users when in-app purchases are added.
5. **Privacy policy, terms and refunds page:** required by both stores (**REQ-045**).
6. **Accounts and contracts:** Apple and Google developer agreements must be signed by an **adult (18+)**, with an adult's bank account. If a teen co-developer is involved, a parent opens the account.
7. **"Rooster Rush" trademark:** no app-store game uses that name; one small free itch.io web game does. A USPTO search is still worth doing before launch.

## 🟢 Fine as built

- **Purchases:** cosmetic only, the real price in dollars, a parent gate, a confirm screen, no one-tap buys, no timers or pressure, and no selling of gems. That's clear of the FTC v. Epic ($520M) and Genshin Impact ($20M) problems.
- **No loot boxes or random paid rewards.** Earned rewards like the daily chest aren't gambling: no money goes in.
- **Gems stay earn-only,** so Keep going is never pay-to-win.
- **Assets:** sounds are made in code; fonts are SIL OFL and Three.js is MIT, both credited; there's no copied art, audio or music.
- **Joke text:** meme slang like "+AURA" is generic words, not anyone's mark.
- **Supporter Pack wording:** now neutral ("a big thank-you for supporting Rooster Rush"). It's now Golden Rocco.

## Sources

- **Characters lawsuit:**
  - [NPR: the battle over Italian brainrot](https://npr.org/2026/08/19/nx-s1-5867638/artificial-intelligence-brainrot-memes-copyright-spyder-tung-tung-sahur)
  - [OPB repost](https://www.opb.org/article/2026/08/22/a-battle-over-italian-brainrot-could-shape-who-owns-ai-art/)
  - [Law360](https://www.law360.com/media/articles/2527463)
- **Texas SB 2420:**
  - [MoFo: Texas law takes effect after the stay](https://www.mofo.com/resources/insights/251111-texas-targets-app-stores-with-new-accountability-law)
  - [FPF: comparing app store laws](https://fpf.org/?p=249901)
  - [Troutman: the injunction](https://www.troutmanprivacy.com/2025/12/federal-district-court-grants-preliminary-injunction-of-texas-app-store-accountability-act/)
- **COPPA:**
  - [CDT on third-party plug-ins and IPs](https://cdt.org/?p=14669)
  - [Federal Register: amended rule](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)
- **Store rules:**
  - [Apple parental gates and Kids](https://developer.apple.com/app-store/parental-gates/)
  - [Apple App Review Guidelines](https://developer.apple.com/appstore/resources/approval/guidelines.html)
  - [Google Play Families policy](https://support.google.com/googleplay/android-developer/answer/9893335)
- **FTC cases:** [Genshin Impact (FTC)](https://ftc.gov/business-guidance/blog/2025/01/level-tips-businesses-ftcs-settlement-genshin-impact-developer-hoyoverse); the Epic case is in `docs/RETENTION.md`.
