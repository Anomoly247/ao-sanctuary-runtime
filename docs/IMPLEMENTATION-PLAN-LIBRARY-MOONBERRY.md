# Implementation Plan: Library + Moonberry Vertical Slice

## Scope

1. Add a controlled, source-aware Library game registry using the existing AO content contract.
2. Add one authenticated Library game-completion mutation backed by the server-authoritative AC ledger and a stable idempotency key.
3. Add a guardian capability summary and mount-stable panel to Moonberry Farm using the existing AO bridge context.
4. Preserve guest exploration: authenticated completion is optional and clearly disclosed.

## Safety and truthfulness constraints

- No cash conversion, public leaderboard, or fabricated activity metrics.
- Game completion rewards AC only through the server ledger.
- Duplicate completion events settle once through the existing idempotency contract.
- Growth Notes remain private/local in guest mode.
- Guardian capability copy is informational and does not claim automated enforcement.

## Validation

- Run production build.
- Run full Vitest suite.
- Add focused contract coverage for the registry and completion reward contract.
- Verify route wiring and source markers.
