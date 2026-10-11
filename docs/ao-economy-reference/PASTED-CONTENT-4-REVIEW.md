# Pasted Content 4 Review — Master Anom Hub

## Source

- **Artifact:** `pasted_content_4.txt`
- **Working title:** React Artifact / Master Anom Hub
- **Received:** 2026-10-10
- **Role:** Supporting product reference, not an executable source of truth

## Canon signals worth preserving

1. **Four-house identity model**
   - House 1: Moonberry / gratitude, Pixel & Dot farm duo.
   - House 2: courage, Tater + Clifford vault.
   - House 3: empathy, Mood Buddies.
   - House 4: boundaries, Sassy Patrol / Troll Crush.
2. **Guardian progression**
   - Helper → Kind → Brave → Guardian → Ultra.
   - The mentor loop is cooperative: Helper helps Kind, Kind helps Brave, and Ultra guides Helper.
3. **Private reflection layer**
   - Growth Notes and a Feelings Journal are part of the experience.
   - The Moonberry Farm route now implements this as a device-private guest note rather than a public post or score.
4. **Destination registry**
   - Homeworld, Games, Arcade, Beat Lab, Sanctuary, Global Missions, Archive Games, Off-Grid, Library World, AO Meme Library, and Anom Originals are treated as distinct destinations with ownership/status labels.
5. **Identity handoff**
   - House, mount, and return URL are carried across destinations. The current bridge already preserves these fields and mount color.

## Boundaries and reconciliation

- Values such as `ANOM Coin 240`, `GP 120`, `150 stars`, `15 nodes`, and `22 travelers` are treated as **reference/demo values**, not live telemetry. They must not be displayed as current user stats unless derived from the authoritative ledger.
- The localStorage ledger wording is useful for a guest prototype, but authenticated rewards must continue to use the Sanctuary ledger and idempotent server procedures.
- Shop prices and boost effects are concept proposals. They require an explicit economy contract, owner review, age-aware purchase controls, and server-side authorization before becoming spendable.
- External links from the artifact are preserved as provenance only. They are not silently promoted to production destinations without verifying ownership, route health, and the current domain map.

## IP and brand safeguards

- Keep this artifact and its SHA-256 manifest in the private AO reference archive.
- Preserve provenance and ownership fields in the controlled media/source registries.
- Do not publish unreviewed source exports, private notebooks, raw creative assets, or generated prototypes as canonical public content.
- Require owner approval for new mounts, house names, reward prices, media publication, and cross-domain destination changes.
- Keep a distinction between **canonical source**, **supporting reference**, **prototype**, and **published route** so later contributors cannot accidentally replace AO-owned work with an unverified export.

## Recommended next implementation order

1. Add the four-house contract to the shared world model, with age/guardian metadata and no public behavior scoring.
2. Add a read-only guardian-tier progress surface backed by real private activity, not invented totals.
3. Replace prototype ledger labels with a typed transaction contract before implementing shop purchases.
4. Expand the owner source registry with artifact hashes, rights status, and approval history.
