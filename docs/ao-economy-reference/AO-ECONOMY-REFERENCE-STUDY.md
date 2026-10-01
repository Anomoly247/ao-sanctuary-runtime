# AO Universe Economy Reference Study

**Status:** Saved for collaboration and design review  
**Date:** 2026-10-01  
**Scope:** Supplied AO economy infographics, scanned blueprints, architecture reference, and videos

## Executive thought

These references are strong enough to define the next major layer of AO Alive: **the universe should feel like a place where good actions create movement**.

The most compelling through-line is:

> **Contribute → earn → travel/build/unlock → express identity → contribute again.**

The economy should not feel like a shop bolted onto a social platform. It should feel like the **physics of the universe**: actions create energy, energy powers movement, and movement opens new forms of identity and care.

## Reference archive

All supplied source files are preserved in [`assets/`](./assets/).

| Source | Type | Working interpretation |
|---|---|---|
| `AO_Universe_Digital_Economy_Infographic.webp` | Infographic | One-coin contribution economy, unified arcade payouts, creative input, mounts, house buffs, and rewards. |
| `AO_Universe_Contribution_Ecosystem.webp` | Infographic | Two-layer economy: contribution earns rewards; Glow Points support movement while Anom Coins support construction and rare mounts. |
| `Fueling_the_Skies_Game_Economy.webp` | Infographic | Detailed earn/spend loop with Glow Points, Anom Coins, portal travel, mounts, and world-building. |
| `The_Living_Celestial_Blueprint.pdf` | 15-page scanned PDF | World structure and living-universe blueprint; image-first source requiring later human text review. |
| `The_Living_Celestial_Blueprint-1.pdf` | Duplicate scanned PDF | Same visual reference as the primary blueprint; preserved rather than discarded. |
| `The_Architecture_of_Independence.pdf` | 15-page scanned PDF | Independence, safety, and boundary architecture reference; image-first source requiring later human text review. |
| `How_Staggered_Timing_Creates_Life.mp4` | 86-second video | Motion rule: deliberate staggered loops, not synchronized breathing and not random chaos. |
| `The_AO_Universe.mp4` | 6-minute 49-second video | AO premise, constellation navigation, mounts, Glow Points, Anom Coins, social good, and moderation-as-care. |

The scanned PDFs have no usable text layer, so this study treats them as visual/canonical references rather than pretending to quote text that was not machine-readable.

## What is strongest

### 1. The economy has a reason to exist

The references do not present currency as a leaderboard number. Currency has a job:

- **Glow Points** represent positive presence, care, and community energy.
- **Anom Coins** represent earned utility for building, travel, rare mounts, and identity upgrades.
- **Mounts** turn currency into movement and emotional identity.
- **World-building** turns currency into a persistent personal place.

That is a much better fit for AO than a generic points shop. The player is not just accumulating a balance; they are building the means to move through the universe.

### 2. The loop is social-game-first, not social-media-first

The references consistently point away from an infinite feed:

- A constellation of destinations instead of a flat app catalog.
- Portals and mounts instead of ordinary navigation alone.
- Missions and creative acts instead of engagement farming.
- Community care instead of follower competition.
- Moderation as care rather than punishment.

This supports the direction already established in Sanctuary: **worlds, missions, identity, and safe participation should be the primary nouns**.

### 3. Physical creativity becoming digital value is distinctive

The physical-to-digital loop is one of the most original ideas in the references. A drawing, coloring upload, or creative contribution is not merely content submission; it becomes a visible act that can earn currency and alter the player’s world.

This should become a signature AO feature, but it needs clear review states and age-aware handling before it becomes a reward-bearing production system.

### 4. Mounts are the right identity anchor

The mount system works because it connects four things at once:

1. **Identity** — what the player rides says something about them.
2. **Progression** — mounts are earned or unlocked over time.
3. **Navigation** — mounts make world travel feel diegetic.
4. **Emotion** — the emote crown and glow state make the mount feel alive.

The current Sanctuary identity vessel is directionally correct. The next step is to make mounts respond to real state—earned unlocks, selected house, current mood, safe-world access, and recent contribution—rather than becoming decorative static cards.

## Reconciled economy model

The images use several overlapping phrases—“one coin,” “Glow Points,” “Anom Coins,” and “AC.” The cleanest implementation is a **two-layer economy with one spendable currency**:

| Layer | Name | Earned from | Spent on | Should it be purchasable? |
|---|---|---|---|---|
| Social energy | Glow Points (GP) | Care, helpfulness, positive mission completion, constructive collaboration, good reception | Portal travel fuel, temporary propulsion, world vitality, non-tradable social status | No. Keep it non-monetary and non-purchasable. |
| Utility currency | Anom Coins (AC) | Games, approved creative contributions, missions, verified positive actions | Mount unlocks, world-building supplies, decorations, identity upgrades, selected travel capabilities | No in the core loop. Preserve “earned, not bought” as the trust promise. |

### Why this resolves the apparent conflict

The “ONE COIN” framing is useful as a public-facing simplicity story: **one recognizable game currency powers the player journey**. The Glow Point layer can remain an internal/social-energy system that explains movement and care without competing with Anom Coins as the spendable currency.

I would avoid calling Glow Points “coins.” Call them **energy, glow, propulsion, or presence**. This prevents players from confusing two balances and protects the meaning of Anom Coin as the game currency.

## Proposed reward vocabulary

The infographic values are useful as balancing examples, not final promises:

| Action example | Reference value | Recommended implementation status |
|---|---:|---|
| Trivia win | +15 AC | Prototype value; add daily/anti-repeat limits. |
| Memory match | +20 AC | Prototype value; award by completion quality, not unlimited replay. |
| Coin Hunt / good action | +25 AC | Requires verified mission completion and idempotency. |
| Creative upload | +5 to +25 AC | Award only after moderation/review or safe automated checks. |
| Portal travel | GP cost | Use for movement pacing, not punishment. Provide free safe return. |
| Mount unlocks | 500–1,200 AC examples | Keep as aspirational targets; disclose requirements clearly. |

The most important rule is not the exact number. It is **trustworthy causality**: the UI must explain what action earned what, and the ledger must be authoritative when the action is eligible.

## Mount and house design direction

The references suggest a useful three-part progression model:

### Mount rarity

- **Scout / Speed** mounts: accessible, low-cost, teach the system.
- **Healer / Tide** mounts: support exploration and recovery.
- **Tank / Verdant** mounts: stability, protection, guardian-oriented play.
- **Legendary / Cosmic Dragon** mounts: long-term prestige and world mastery.

### House buffs

The Ember, Tide, and Verdant house examples are valuable because they turn a house into a playstyle rather than a cosmetic label:

- **Ember:** movement and action tempo.
- **Tide:** recovery, healing, and safe return.
- **Verdant:** resilience, protection, and steady growth.

These buffs must remain age-safe and non-competitive in a harmful way. Prefer cooperative advantages, accessibility benefits, and different play rhythms over combat superiority.

### Recommendation

Make the first mount purchase a **meaningful identity choice**, not a raw power purchase. Let the player preview its visual, emotional, and navigation traits before spending coins. Avoid irreversible purchases; use a confirmation sheet and a short undo window.

## Motion study: the AO Alive Standard

The staggered-timing video provides a concrete visual rule that should become a project standard:

- Do not animate every card on the same 3.0-second timer.
- Do not replace structure with pure randomness.
- Use deliberate, stable periods such as **3.2s, 3.6s, 3.9s, and 4.1s**.
- Keep movement subtle: opacity, transform, glow, and background position—not layout jumps.
- Respect `prefers-reduced-motion`.

The existing Sanctuary implementation already has breathing cards and ambient background movement. The next refinement is to expose these timings as named design tokens so new pages cannot accidentally synchronize everything again.

Suggested tokens:

```css
--ao-life-card-a: 3.2s;
--ao-life-card-b: 3.6s;
--ao-life-card-c: 3.9s;
--ao-life-card-d: 4.1s;
--ao-life-orbit: 18s;
--ao-life-portal: 11s;
```

## Safety and independence implications

The Architecture of Independence reference should be treated as a design constraint, not a later compliance pass. The economy must not undermine the sanctuary promise.

Required boundaries for implementation:

- Guardian filtering is a first-class control, not a hidden setting.
- Age-tier rules must govern destinations, chat, contribution uploads, and reward eligibility.
- Kids-safe participation should never require public exposure or social approval from unknown adults.
- Community-care rewards need abuse resistance so kindness cannot be farmed through reciprocal clicks.
- The system must provide safe return paths, especially from immersive worlds and portal travel.
- Purchases and unlocks must be reversible or clearly confirmed; no pressure timers or manipulative scarcity.
- Moderation should explain what happened and how to recover, using care-oriented language.
- Guest exploration can be broad, while account-linked rewards and social features remain permissioned.

## What I would not implement yet

1. **Do not launch real-money buying of Anom Coins.** It conflicts with the strongest “earned, not bought” identity in the references and creates unnecessary child-safety and trust complexity.
2. **Do not use public leaderboards as the primary status system.** They pull the universe back toward social-media competition.
3. **Do not make every action rewardable immediately.** First define eligible actions, caps, review states, and idempotency.
4. **Do not make rare mounts pure stat advantages.** Their value should be identity, route access, expression, and cooperative utility.
5. **Do not let generated artwork or uploads become instant currency.** Add a pending/review/approved lifecycle.
6. **Do not preserve hot magenta as a primary UI color.** The references use it as a strong visual signal, but AO’s current calmer gold/cyan direction is better for sustained play. Reserve a coral/magenta-family accent for rare signals, celebrations, or portal energy only.

## Recommended implementation sequence

### Phase A — Make the currency real

- Add a canonical `wallet_balances` and append-only `wallet_ledger` contract.
- Define event types: `game_completed`, `mission_completed`, `creative_submitted`, `creative_approved`, `portal_travelled`, `mount_unlocked`, `world_item_purchased`.
- Every reward event receives an idempotency key.
- Display the source, amount, timestamp, and resulting balance.
- Keep guest wallet state local until account linking is available; never imply it is server-backed.

### Phase B — Add the first spend loop

- Build a small, safe **Mount Vault** with 3–4 mounts.
- Add preview, requirements, confirmation, and undo.
- Start with cosmetic identity and route flavor; postpone hard gameplay buffs.
- Add a visible Anom Coin balance and a separate Glow/Propulsion indicator.

### Phase C — Connect contribution carefully

- Add a creative contribution flow with draft → review → approved states.
- Award a modest AC amount only after approval.
- Add a GP community-care signal from structured missions, not raw likes.
- Add age-tier and guardian rules to every submission path.

### Phase D — Turn the constellation into navigation

- Convert the 12-destination idea into a canonical registry.
- Use portal transitions and mounted identity as the connective tissue.
- Keep ordinary links available for accessibility and safe recovery.
- Let each destination report what it accepts, what it earns, and what it unlocks.

## Bottom line

The references are not asking for a bigger shop. They are describing a **living contribution engine** where currency is the visible proof that the player’s care, creativity, and play have consequences.

My strongest recommendation is to preserve this hierarchy:

> **Care creates Glow. Play and approved creation create Anom Coins. Anom Coins build worlds and unlock identity. Identity opens deeper forms of contribution.**

That is the idea worth building around.


## Architecture of Trust: the new critical layer

The newly supplied **Architecture of Trust** deck sharpens the references from a good economy concept into a production architecture. Its strongest thesis is:

> **Safety is architecture, not overhead.**

That means age-aware access, guardian review, contribution rewards, optimistic UI, and domain routing must be designed as one system rather than added independently.

### Independence ladder

The deck proposes a clear developmental progression:

| Tier | Ages | Independence direction | Safety boundary shown |
|---|---:|---|---|
| Sprouts | 5–8 | Color, watch, and react | Guardian-approved reactions only; no chat, DMs, or links. |
| Explorers | 9–12 | Learn and help | Limited creative showcases, AI spot-checking, public lounges. |
| Builders | 13–15 | Create and teach | Video posting, mentoring, whitelisted links, real-time flagging. |
| Architects | 16–17 | Lead and showcase | Events and commissions with guardian co-sign where required. |
| Guardians | 18+ | Protect and foster | Full moderation and stewardship tooling. |

This is more precise than a single on/off guardian filter. My recommendation is to keep the existing guardian toggle as the simple control, but implement it over a canonical **age-tier capability matrix**.

### Optimistic UI with a guardian queue

One of the best ideas in the deck is separating the player’s immediate experience from the platform’s safety resolution:

1. The child or guest receives immediate local confirmation: “Your action was received.”
2. The system marks the global action as pending when review is needed.
3. Guardian or moderation systems resolve the network state.
4. The wallet, mission, and public visibility synchronize only when eligible.

This avoids making young users stare at surveillance or moderation machinery while still enforcing real safeguards. It also maps cleanly to the reward ledger:

```text
local action → local feedback → pending reward → review/guardian queue → ledger settlement
```

The important distinction is that **local feedback is not the same as settled currency**. The UI should say “received,” “pending,” or “approved” rather than awarding spendable Anom Coins before eligibility is confirmed.

### One Coin Economy clarified

The deck makes the “one coin” direction explicit: all games feed one unified vault, and the player cannot buy their way across the universe. This is a strong product rule and should become the public economy promise.

The dual-domain references do not need to create a dual-spendable-currency system. We can keep:

- **Anom Coins:** one unified, spendable earned currency.
- **Glow / propulsion state:** a non-purchasable social-energy or movement state that can be displayed separately without competing with the coin balance.

The deck’s example values—Trivia +15, Memory +20, good action +25, Cosmic Dragon 1,200—should remain **balancing fixtures**, not hardcoded promises, until the authoritative ledger and anti-farming rules are implemented.

### Dual-domain architecture

The deck describes a useful separation:

- **Homeworld domain:** identity, community, optimistic UI, guardian queue, and core gameplay.
- **Archive/commerce domain:** catalog, digital assets, offers, and transactional surfaces.
- **Domain bridge:** carries approved identity and token state without merging the deployments.

That matches the project’s established direction: do not collapse every site into one deployment. Instead, keep deliberate bridges and explicit ownership of responsibilities. The deck’s named domain examples should be treated as an architectural reference; the final live domain registry still needs to remain the project source of truth.

### Visual standard reconciliation

The deck’s design standard is consistent with the already chosen AO foundation:

- Void background and luminous cyan/gold structure.
- Glass-like panels with restrained blur and thin translucent borders.
- Technical mono labels paired with readable display/body typography.
- Staggered motion periods of 3.2s, 3.6s, 3.9s, and 4.1s.

It also shows hot magenta as a primary accent. That is visually effective in diagrams, but it conflicts with the project’s sustained-play requirement that hot magenta not dominate the interface. My recommendation remains:

- Keep **cyan + gold** as the everyday interaction system.
- Use a **coral/magenta-family signal** only for rare portal energy, pending review, or celebration states.
- Never use it as the default fill for large controls or long reading surfaces.

## Updated implementation priority

The trust deck changes the order of operations slightly:

1. **Canonical capability matrix:** encode the five age tiers, guardian states, and route capabilities.
2. **Reward state machine:** distinguish local feedback, pending review, approved reward, rejected action, and settled wallet balance.
3. **Unified Anom Coin vault:** one append-only ledger across games and connected domains.
4. **Mount Vault:** unlocks draw from settled coins only; previews never spend.
5. **Domain bridge:** pass identity context and approved token state, never raw privileged moderation data.
6. **Optimistic UI standard:** every age-sensitive action gives immediate humane feedback while review happens invisibly and safely.

The Architecture of Trust deck confirms the central design direction: **identity, safety, economy, and motion are not separate features in AO. They are one operating system for the universe.**
