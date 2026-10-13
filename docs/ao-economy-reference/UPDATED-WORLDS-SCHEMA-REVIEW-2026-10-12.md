# Updated Worlds & Pages Schema Review

**Date:** 2026-10-12  
**Scope:** ReactArtifact, Troll Crush Final PDF, Master Anom Black-Gold, Off-Grid export, and Library World Safe Launch.

## Executive conclusion

The updated material confirms that AO Alive needs a **shared universe envelope with world-specific schemas**. A single generic page model would flatten the differences between a calm reflective farm, a controlled story library, an arcade/router world, a help/safety hub, and future creator spaces.

The safe architecture is:

1. One shared identity, safety, provenance, bridge, and economy envelope.
2. A discriminated `worldKind` payload for each world.
3. Page-specific UI and state machines inside each world.
4. Server validation at the ledger boundary, never trusting client-provided reward values.
5. Owner provenance records for every imported artifact and media asset.

No production page was changed during this review.

## What is shared across every world

Every destination should expose a small, stable envelope:

```ts
type AOWorldEnvelope = {
  id: string;
  route: string;
  division: string;
  label: string;
  worldKind: "farm" | "library" | "arcade" | "story" | "help" | "studio" | "hub";
  ageTier: AOAgeTier;
  guardianMode: "required" | "guided" | "optional";
  status: "active" | "in-build" | "planned" | "review";
  owner: "Anom Originals" | "Needs confirmation";
  publicationStatus: "published" | "review" | "planned" | "archived";
  bridge: { house?: string; mount?: string; mountColor?: string; returnUrl?: string };
  economy: { earns: readonly ("GP" | "AC")[]; completionPolicy: "none" | "server-ledger" | "private-only" };
  provenanceId: string;
};
```

This envelope is not the gameplay schema. It is the safety and interoperability boundary.

## World-specific schemas

### 1. Off-Grid / Moonberry Farm: reflective state machine

This world is not an arcade score page. Its core state is a calm sequence:

`plant -> water -> harvest -> private Growth Note`

Recommended payload:

```ts
type MoonberryFarmWorld = AOWorldEnvelope & {
  worldKind: "farm";
  house: "House 1";
  steps: readonly ["plant", "water", "harvest", "reflect"];
  currentStep: "plant" | "water" | "harvest" | "reflect";
  mountCare: { assisted: boolean; mountId?: string };
  harvest: { count: number; completedAt?: number };
  growthNote: { text: string; storage: "device" | "private-account"; public: false };
};
```

Rules:

- No public leaderboard or behavior score.
- Growth Notes are private by default.
- Guardian capability summary remains visible without exposing private note text.
- Mount identity is stable across the bridge but should not become a public child profile.
- A completed farm cycle may create a server-authoritative event only when the authenticated ledger contract permits it; the note itself must never be sent as a public post.

Current implementation alignment: `shared/aoContentRegistry.ts` already contains `MOONBERRY_FARM`; `client/src/pages/MoonberryFarm.tsx` is the correct page-specific home for this schema.

### 2. Library World: controlled game registry

The Library is a collection of distinct, bounded games rather than one continuous state machine. Each game can have its own narrative and completion event while sharing the Library shell.

Recommended payload:

```ts
type LibraryWorld = AOWorldEnvelope & {
  worldKind: "library";
  games: readonly {
    id: string;
    characters: readonly string[];
    ageTier: AOAgeTier;
    rewardAsset: "AC" | "GP" | "none";
    rewardAmount: string;
    completionEventId: string;
    artwork: string;
  }[];
  selectedGameId?: string;
  completedGameIds: readonly string[];
};
```

Rules:

- The server owns reward amounts and idempotency.
- Client completion state is per game, never a single global boolean.
- Guardian filtering can hide or explain games, but should not silently mutate ledger state.
- Each video or image must have alt text, age metadata, ownership, and publication status.

Current implementation alignment: `LIBRARY_WORLD_GAMES` and the authenticated completion procedure already establish this direction.

### 3. Troll Crush / Games Hub: router and session schema

The Troll Crush PDF describes a **router world**: Universe -> World -> Community -> Space, with arcade, mission, lounge, and field-quest reward sources. That is structurally different from Moonberry and Library.

Recommended payload:

```ts
type GamesHubWorld = AOWorldEnvelope & {
  worldKind: "hub" | "arcade";
  mapMode: "router";
  currentNode: "universe" | "world" | "community" | "space";
  destinations: readonly string[];
  session: {
    gameId?: string;
    startedAt?: number;
    completedAt?: number;
    result?: "complete" | "abandoned";
  };
  completionEventId?: string;
};
```

Rules:

- Treat the PDF’s reward values as design references, not trusted client inputs.
- Reconcile the PDF’s "unified coin ledger" with the current non-cash GP/AC contract before adding any new game.
- Keep arcade outcomes bounded and auditable; do not create a generic `score -> coins` endpoint.
- The router must preserve the AO bridge context when opening a world or returning to the hub.
- The PDF lists legacy magenta and purple tokens. Those are not adopted as primary UI tokens; current AO gold/cyan rules remain authoritative.

### 4. ReactArtifact / AO Living Standard: architecture and motion reference

This artifact is valuable for the conceptual model:

- living worlds rather than infinite-scroll social feeds;
- Sanctuary as the central home base;
- Glow Points as an appreciation/presence concept;
- mounts as identity vessels;
- breathing cadence and asynchronous motion;
- multiple divisions and destinations.

It also contains conflicts that must not be copied directly:

- hot magenta as an active/in-build system color;
- purple tokens that the current project has withdrawn;
- a fixed AC-to-USD conversion and wallet-pack/membership assumptions;
- illustrative economy values that are not live product telemetry;
- broad claims about moderation or system status that require evidence.

Use it for **information architecture and motion rhythm**, not as a production schema or financial contract.

### 5. Master Anom Black-Gold: visual reference only

This artifact reinforces the black/gold/cyan visual language and dense world-map presentation. Its generated CSS still contains magenta, purple, social-platform colors, and white-page utility assumptions. It should therefore be treated as an art-direction reference.

Adopt:

- deep black canvas;
- badge gold for prestige and planned states;
- cyan for active/live interaction;
- real AO character and world artwork;
- responsive map/orbit composition;
- calm, staggered motion.

Do not adopt wholesale:

- generated utility bundles;
- legacy color classes;
- static counters or mock activity;
- unreviewed external/social pathways;
- any client-side economy logic.

### 6. Off-Grid export: provenance warning

The supplied `offgrid.html` is a Google Docs editor export rather than a clean world artifact. It contains editor chrome and does not provide a reliable implementation contract. The canonical Off-Grid contract should remain the reviewed Moonberry Farm specification plus the existing `MOONBERRY_FARM` registry and route.

### 7. Library Safe Launch: controlled launch reference

The Library launch export is useful as a page-level reference for a guardian-aware, media-rich world. Because it is a compiled artifact, its generated styles and embedded implementation should not be treated as source of truth. Integrate only reviewed content metadata and interaction ideas into the typed Library registry.

## Proposed type boundary

The next implementation should add a shared union without replacing existing page contracts:

```ts
type AOWorldPayload =
  | MoonberryFarmWorld
  | LibraryWorld
  | GamesHubWorld
  | StoryWorld
  | HelpWorld;

function renderWorld(world: AOWorldPayload) {
  switch (world.worldKind) {
    case "farm": return <MoonberryFarmWorldView world={world} />;
    case "library": return <LibraryWorldView world={world} />;
    case "hub":
    case "arcade": return <GamesHubWorldView world={world} />;
    case "story": return <StoryWorldView world={world} />;
    case "help": return <HelpWorldView world={world} />;
  }
}
```

The existing page components can remain specialized. The union belongs in shared contracts and registry validation, not as a forced mega-component.

## Ownership and IP protection

- Preserve every supplied source in a private archive with SHA-256 checksums.
- Keep `provenanceId`, owner, publication state, and destination route on controlled media entries.
- Do not publish an artifact merely because it appears in an HTML export.
- Keep private investor/pitch material separate from user-facing world data and analytics.
- Do not expose archive paths, internal source notes, or owner-only registry fields to guests.
- Review captions, thumbnails, rights, and age placement before any character video becomes public.

## Recommended next build slice

1. Add `worldKind`, `guardianMode`, and `provenanceId` to the shared destination/world contract without changing existing routes.
2. Add a `Games Hub` registry entry based on the Troll Crush router model, with no new reward mutation yet.
3. Add a typed `StoryWorld` contract for character-led pages so Anom’s Corner can grow beyond duplicate video cards.
4. Keep Moonberry and Library on their current specialized schemas.
5. Build a small owner-only schema inspector that reports each world’s contract, age tier, publication state, and ledger policy.
6. Only after those contracts pass tests should new game completion events be added.

## Decision

**Adopt the architecture, world distinctions, bridge semantics, and motion language.**

**Do not adopt the supplied exports’ legacy magenta/purple primary styling, fixed cash conversion, static activity claims, or compiled markup as source code.**
