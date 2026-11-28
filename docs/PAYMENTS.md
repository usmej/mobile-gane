# Rooster Rush: payments plan (kid-safe, low legal risk)

Goal: make money with in-app purchases like other games do, while staying clear of the **FTC** (the US agency that polices kids' purchases and privacy), Apple's and Google's rules, and copyright problems.

_This is a practical plan, not legal advice. Before real money is switched on, have someone who knows children's app law look it over._

## How the money gets paid

- **Store purchases only.** The game ships as an iPhone/Android app (wrapped with Capacitor) and sells through **Apple and Google in-app purchases**.
- **Why stores and not our own checkout:**
  - Apple and Google handle cards, refunds, taxes and parental "Ask to Buy".
  - We never see or store card details.
- **Fees:** each store takes **15%** (small-business programs). Apple charges $99/year and Google $25 once.
- **The website** stays free. Paid items are hidden there (`CONFIG.payments.enabled = false`).
- **Test mode:** add `?shoptest` to the URL to try the whole flow with a fake store. No real money moves.

## What we sell (cosmetic only)

| Product | Price | Gives |
|---|---|---|
| Supporter Pack (`massdash.supporter`) | $2.99, one-time | Golden Rocco |
| Character packs (ChatGPT, REQ-043) | $0.99–$1.99 | 2–3 exclusive original characters each |

**We never sell:**
- gems, coins, mass, levels, or Keep going. Gems stay **earn-only**, because selling them would be pay-to-win.
- loot boxes, mystery boxes or random rewards. In 2025 the FTC fined Genshin Impact's maker $20M partly over loot boxes to kids.
- ads in the kids' app. Apple's Kids Category bans third-party ads and analytics.

## The rules every purchase follows (already built)

1. **Parent gate first** (`ui.showParentGate`). An adult has to type the answer to a written-out sum, like "thirty-eight minus fifteen". Three wrong tries cancels.
2. **Clear confirm screen** (`ui.showPurchaseConfirm`). It shows what you get, the **real price in dollars** and "one-time purchase". There's a big Buy button and a plain "No thanks". Never a one-tap buy.
3. **No fake currencies hiding the price.** Paid items are priced in real money only.
4. **Restore purchases** button. The store is the source of truth (`save.purchases`).
5. **No pressure:**
   - no countdown timers or "limited time";
   - no "your friends bought this";
   - no shaming the free character;
   - no purchase prompts during a run or on the lose screen.

## Making people *want* to buy (the fair way)

Research on kids and skins says they mainly buy to **look cool and express themselves**. A Norwegian (OsloMet) study also found kids are pressured and even bullied over skins, so we lean on the good half and avoid the bad half.

- **Make paid characters the funniest and coolest-looking ones**, and let them show in the run-card share image.
- **Preview before buying:** the shop shows the character. Later we'll add a "try it on" run.
- **Collection:** the "3/13 characters" counter makes finishing the set feel good.
- **Clear bundles:** one pack with 3 characters beats lots of tiny items.
- **"Support the makers":** the Supporter Pack speaks to parents, who approve the purchase.

## Privacy and copyright checklist

- [x] No accounts, no names, no emails, no tracking. The save stays on the device. Keep it that way, because the updated COPPA rule has been in full force since April 22, 2026.
- [x] All characters are original designs with our own names (original farm animals; no meme characters, mascots or brands).
- [x] Sounds are generated in code, with no audio files to license.
- [x] Fonts (Lilita One, Nunito) are SIL OFL and Three.js is MIT. Both are credited in `CREDITS.md`.
- [ ] **Self-host the fonts and Three.js** so the app makes no third-party requests, since Google Fonts and jsDelivr can see visitor IPs (REQ-044).
- [ ] **Privacy policy, terms and refund page** (REQ-045). Both stores require a privacy policy.
- [ ] **Trademark search for "Rooster Rush"** on USPTO before launch. No app-store game uses that exact name today (one small itch.io web game does).
- [ ] Developer accounts in an adult's name (Apple $99/yr, Google $25), with a bank account for payouts.
- [ ] Optional: a quick review by someone who knows kids' app law.

## Who builds what

- **🟧 Claude:**
  - store layer `src/store.js`, products `src/products.js`, parent gate, confirm screen, shop paid card, restore, Supporter Pack ✅
  - next: the Capacitor app wrapper and the native store bridge (`window.MassDashNativeStore`), once Juan has the developer accounts.
- **🟦 ChatGPT:**
  - REQ-043: two character packs (original designs);
  - REQ-044: self-host fonts and Three.js;
  - REQ-045: privacy policy, terms and refunds page, linked from the menu.

## Sources

- [FTC on the Genshin Impact settlement](https://ftc.gov/business-guidance/blog/2025/01/level-tips-businesses-ftcs-settlement-genshin-impact-developer-hoyoverse)
- [Apple: parental gates and the Kids Category](https://developer.apple.com/app-store/parental-gates/)
- [Federal Register: amended COPPA Rule (2025)](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)
- [OsloMet: kids and in-game spending](https://www.oslomet.no/en/research/featured-research/buying-popularity-how-children-are-influenced-by-in-game-spending)
- See also `docs/RETENTION.md`, which includes the FTC v. Epic Games $520M case.
