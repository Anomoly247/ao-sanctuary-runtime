# Active task checklist

This iteration extends the identity-first AO Homeworld foundation with live badge/glow identity, age-aware world labels, and social-good mission progress. The historical roadmap remains preserved at `docs/DEVELOPMENT-ROADMAP.md`.

## Identity and badge system

- [x] Load real profile glow color from the existing profile contract.
- [x] Load real unlocked achievement data from the existing badge contract.
- [x] Display badge chips and first-badge fallback in the Homeworld identity orbit.
- [x] Keep Profile and Achievements actions connected to the identity surface.
- [x] Preserve cyan/gold motion and reduced-motion-friendly interaction timing.

## Age-aware worlds

- [x] Add age-tier metadata to Sanctuary, Play Worlds, Archive, and Creator Orbit.
- [x] Show age-aware / guardian-guided labels directly on orbiting world nodes.
- [x] Keep the Library World and shared AO world contract aligned with age-aware language.
- [x] Preserve moderated, emote-first, social-good safety principles.

## Social-good missions

- [x] Connect Homeworld to the real `missions.list` and `missions.status` contracts.
- [x] Show recorded mission count and progress percentage.
- [x] Add mission cards for Welcome to AO, Play With Purpose, and Make Something Kind.
- [x] Link mission cards into Mission Hub with the real mission ID.
- [x] Keep the fallback mission catalog safe while the ledger is unavailable.

## Validation and handoff

- [x] Add contract coverage for age tiers and mission IDs.
- [x] Run the full Vitest suite: 130 tests passed.
- [x] Run the production build successfully.
- [x] Run `git diff --check` successfully.
- [x] Capture the managed preview with age-aware world nodes and cyan/gold motion.
- [x] Document remaining TypeScript diagnostics as pre-existing backend/schema issues outside this pass.
- [x] Save the updated managed checkpoint.
