# Library + Moonberry Reference Review — 2026-10-12

## Archived sources

The source files are preserved under `assets/2026-10-12-library-moonberry/` with SHA-256 checksums:

- Library World Portal HTML
- `library-world.test.ts`
- `libraryWorldAssets.ts`
- animated Moonberry loading reference
- Moonberry Farm world, final graphics, and world variants

## Library World findings

The supplied Library contract is a strong candidate for the next implementation slice:

- three named game entries: Pixel & Dot, Clifford Patrol, and Tater Shelf Heist;
- stable game IDs suitable for `/games?game=...` handoffs;
- canonical Pixel, Dot, Clifford, and Tater asset paths;
- bounded Color Corner configuration with local-friendly color controls;
- a portal-style world structure that complements the current AO map.

The current Sanctuary `LibraryWorld.tsx` is still a safe, source-aware portal with placeholder trail actions. The supplied registry can be integrated, but only after each game has a real route state and reward policy. AC rewards must settle through the server ledger for authenticated users; guests may receive only local session projection.

## Moonberry findings

The references reinforce Moonberry Farm as a calm House 1 / Off-Grid world:

- gratitude, patience, watering, harvest, and reflection;
- private Growth Notes rather than public behavior scoring;
- mount hangar/stable identity and gentle traversal;
- sleeping/resting states and low-pressure return rhythm;
- helper language that is emotionally legible for younger players.

The current managed route already implements plant → water → harvest → private Growth Note and is aligned with the strongest parts of these references.

## Conflicts and safeguards

- Several artifacts contain legacy hot magenta, purple, fluorescent green, or neon utility colors. Do not import those tokens into Sanctuary.
- One Library artifact presents `10 AC = $1` build-currency language. This conflicts with the current non-cash economy contract and must not be implemented or displayed.
- Mount costs, market-price language, public profiles, feed moderation, and reward amounts in compiled prototypes are not live commitments. They require owner-approved registry entries and server-side policy checks.
- Preserve IP provenance for every supplied character asset and keep publication state explicit before exposing media to child-facing routes.

## Recommended implementation order

1. Add a controlled Library World registry in the managed runtime using the supplied game IDs and asset paths.
2. Add an accessible game-selection surface that hands off to existing `/games?game=` state.
3. Implement one game completion event end-to-end through the authoritative AC ledger before enabling additional rewards.
4. Add the guardian capability summary and mount-stable identity surface to Moonberry Farm.
5. Keep all reference HTML as source material, not production markup.
