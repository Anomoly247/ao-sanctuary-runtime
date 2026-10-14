# AO Setup v5 Adapter — Implementation Plan

## Scope

Adapt the valid portions of `setup-ao-ecosystem-v4.sh` into the managed Sanctuary runtime without importing its standalone deployment, marketplace, identity, or financial assumptions.

## Contracts

1. **Sentinel moderation:** owner/admin-controlled, reviewable actions with an append-only audit trail; no autonomous enforcement or child-facing moderation claims.
2. **Identity profiles:** reuse the existing authenticated user/profile model and add only typed AO identity metadata needed for world handoffs (house, mount, guardian tier). No separate identity database.
3. **Marketplace inventory:** reuse `decoration_packages` as the catalog and add owned inventory records only if absent; all purchases remain non-cash AC ledger spends, with no AC-to-dollar conversion.
4. **Asset provenance:** validate every canonical Homeworld/Anom Originals asset against `worldKind`, age tier, ownership, and publication status before it can be mapped to a destination.

## Data changes

- Add a compact `ao_identity_profiles` table for authenticated identity context and guardian review state.
- Add `ao_inventory_items` for idempotent non-cash ownership grants linked to catalog package IDs.
- Add `ao_sentinel_cases` for reviewable moderation cases and status transitions.
- Add migration SQL only for these new tables; preserve existing wallet, ledger, profile, and decoration data.

## Server surface

- Protected read/update for the current user’s identity profile.
- Protected AC purchase/grant boundary using the existing atomic ledger helper and idempotency key.
- Admin-only Sentinel case create/review/list procedures, each writing `auditLog`.
- Public/read-only asset validation helper and regression tests; no public access to private provenance notes.

## UI surface

- Add owner-only Sentinel review panel and identity/inventory metadata to the existing owner control area.
- Do not add a public marketplace or expose fabricated inventory/activity stats in this slice.

## Validation

- Schema migration is additive and non-destructive.
- Registry validation returns no missing provenance or worldKind mismatches.
- Tests cover Sentinel audit boundaries, identity age/guardian rules, inventory idempotency, and asset metadata alignment.
- Run `pnpm test` and `pnpm run build`; smoke-test owner routes and `/divisions`.
