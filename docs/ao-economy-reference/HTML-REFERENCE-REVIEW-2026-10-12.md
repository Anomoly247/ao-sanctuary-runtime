# AO HTML Reference Review — 2026-10-12

## Sources

- `ao_living_standard_v2.html` — supplied AO Living Standard v2 artifact.
- `games-hub-live.html` — supplied Games Hub live artifact.
- SHA-256 checksums are recorded in `assets/2026-10-12-html-reference.sha256`.

## Findings

### AO Living Standard v2

This artifact reinforces the current AO presentation direction: deep near-black/Void surfaces, cyan for live interaction, badge gold for prestige and earned identity, orbiting/portal composition, and a living-world rather than conventional dashboard feel.

It also contains legacy or conflicting visual values, including hot magenta and purple utility colors. Those values are not adopted as Sanctuary primary tokens. The current product decision remains: **Void canvas, AO cyan, badge gold, restrained semantic signal colors, and no hot-magenta primary controls**.

### Games Hub Live

The Games Hub contributes useful interaction grammar:

- compact destination cards;
- category and age-aware labels;
- clear entry actions;
- game/world grouping that supports exploration;
- short descriptions that make a destination understandable before entry.

The current Sanctuary Games page already implements the stronger parts of this pattern through searchable world cards and category filtering. The artifact’s palette is not adopted because it includes pink, purple, fluorescent green, and other competing accents.

## Adoption boundary

1. Adopt structure and interaction patterns, not compiled HTML.
2. Keep the canonical AO destination registry as the source of truth for route, status, age tier, and economy behavior.
3. Keep the five-tier age model and server-authoritative ledger; neither artifact replaces those contracts.
4. Preserve separate deployments and the AO bridge rather than collapsing the sites into one route tree.
5. Treat all displayed activity, balances, and publication claims as live only when backed by the runtime or owner-controlled registry.

## Recommended next implementation slice

Use the references to refine the existing Games Hub with a stronger “world card” hierarchy and richer live status metadata, then add a guardian-visible capability summary to Moonberry Farm. Do not import the reference artifacts’ palette wholesale or expose unverified external media as playable content.
