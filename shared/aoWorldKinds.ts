import type { AOAgeTier } from "./aoContentRegistry";

export type AOWorldKind = "farm" | "library" | "hub" | "story" | "help";
export type AOLedgerPolicy = "none" | "server-ledger" | "private-only";
export type AOWorldStatus = "active" | "in-build" | "planned" | "review";

export type AOBridgeIdentity = {
  house?: string;
  mount?: string;
  mountColor?: string;
  returnUrl?: string;
};

export type AOWorldEnvelope = {
  id: string;
  route: string;
  division: string;
  label: string;
  worldKind: AOWorldKind;
  ageTier: AOAgeTier;
  guardianMode: "required" | "guided" | "optional";
  status: AOWorldStatus;
  owner: "Anom Originals" | "Needs confirmation";
  publicationStatus: "published" | "review" | "planned" | "archived";
  bridge: AOBridgeIdentity;
  economy: {
    earns: readonly ("GP" | "AC")[];
    completionPolicy: AOLedgerPolicy;
  };
  provenanceId: string;
};

export type MoonberryFarmWorld = AOWorldEnvelope & {
  worldKind: "farm";
  house: "House 1";
  steps: readonly ["plant", "water", "harvest", "reflect"];
  currentStep: "plant" | "water" | "harvest" | "reflect";
  growthNote: { storage: "device" | "private-account"; public: false };
};

export type LibraryWorld = AOWorldEnvelope & {
  worldKind: "library";
  games: readonly {
    id: string;
    characters: readonly string[];
    ageTier: AOAgeTier;
    rewardAsset: "AC" | "GP" | "none";
    completionEventId: string;
  }[];
  completedGameIds: readonly string[];
};

export type TrollCrushRouterWorld = AOWorldEnvelope & {
  worldKind: "hub";
  mapMode: "router";
  currentNode: "universe" | "world" | "community" | "space";
  destinations: readonly string[];
  session: {
    gameId?: string;
    startedAt?: number;
    completedAt?: number;
    result?: "complete" | "abandoned";
  };
};

export type StoryWorld = AOWorldEnvelope & {
  worldKind: "story";
  characters: readonly string[];
  mediaPolicy: "controlled-registry";
  currentSignal?: string;
};

export type HelpWorld = AOWorldEnvelope & {
  worldKind: "help";
  supportModes: readonly ("guardian" | "privacy" | "safety" | "technical")[];
  escalation: "human-reviewed" | "documented-guidance";
};

export type AOWorldPayload = MoonberryFarmWorld | LibraryWorld | TrollCrushRouterWorld | StoryWorld | HelpWorld;

export type AOWorldSchemaDefinition = {
  kind: AOWorldKind;
  label: string;
  route: string;
  description: string;
  fields: readonly string[];
  ageTier: AOAgeTier;
  guardianMode: AOWorldEnvelope["guardianMode"];
  status: AOWorldStatus;
  publicationStatus: AOWorldEnvelope["publicationStatus"];
  provenanceId: string;
  ledgerPolicy: AOLedgerPolicy;
  ledgerNote: string;
};

export const AO_WORLD_SCHEMA_REGISTRY: readonly AOWorldSchemaDefinition[] = [
  {
    kind: "farm",
    label: "Moonberry Farm",
    route: "/moonberry-farm",
    description: "A calm plant, water, harvest, and private Growth Note loop.",
    fields: ["house", "steps", "currentStep", "growthNote", "mountCare"],
    ageTier: "KIDS + GUARDIANS",
    guardianMode: "guided",
    status: "active",
    publicationStatus: "published",
    provenanceId: "moonberry-farm-canon",
    ledgerPolicy: "private-only",
    ledgerNote: "Growth Notes are private; no public behavior score or leaderboard.",
  },
  {
    kind: "library",
    label: "Library World",
    route: "/library",
    description: "A controlled collection of distinct character-led games and lessons.",
    fields: ["games", "selectedGameId", "completedGameIds", "completionEventId"],
    ageTier: "AGE-AWARE",
    guardianMode: "guided",
    status: "active",
    publicationStatus: "published",
    provenanceId: "library-world-safe-launch",
    ledgerPolicy: "server-ledger",
    ledgerNote: "Authenticated completion events are idempotent and settle on the AC ledger.",
  },
  {
    kind: "hub",
    label: "Troll Crush Router",
    route: "/games/troll-crush",
    description: "A Universe → World → Community → Space router for future arcade missions.",
    fields: ["mapMode", "currentNode", "destinations", "session"],
    ageTier: "KIDS + GUARDIANS",
    guardianMode: "guided",
    status: "in-build",
    publicationStatus: "review",
    provenanceId: "troll-crush-final",
    ledgerPolicy: "none",
    ledgerNote: "Router only. No reward mutation or wallet event is enabled in this slice.",
  },
  {
    kind: "story",
    label: "Anom’s Corner Story World",
    route: "/anoms-corner",
    description: "A controlled multi-character story and premiere surface.",
    fields: ["characters", "mediaPolicy", "currentSignal"],
    ageTier: "KIDS + GUARDIANS",
    guardianMode: "required",
    status: "active",
    publicationStatus: "published",
    provenanceId: "master-anom-hub-react-artifact",
    ledgerPolicy: "none",
    ledgerNote: "Media publication is controlled separately from the player ledger.",
  },
  {
    kind: "help",
    label: "Anom Internet Help Hub",
    route: "/help",
    description: "Guardian, privacy, safety, and technical guidance with documented escalation.",
    fields: ["supportModes", "escalation"],
    ageTier: "ALL AGES",
    guardianMode: "required",
    status: "active",
    publicationStatus: "review",
    provenanceId: "help-hub",
    ledgerPolicy: "none",
    ledgerNote: "Support and safety guidance never creates GP or AC rewards.",
  },
];

export const AO_TROLL_CRUSH_ROUTER = {
  id: "troll-crush-router",
  route: "/games/troll-crush",
  nodes: [
    { id: "universe", label: "Universe", description: "Choose a safe signal and begin at the AO map." },
    { id: "world", label: "World", description: "Select a world door without changing wallet state." },
    { id: "community", label: "Community", description: "Review the guardian-guided community boundary." },
    { id: "space", label: "Space", description: "Enter a future Troll Crush session when it is published." },
  ],
  destinations: ["/", "/divisions", "/games", "/library", "/moonberry-farm"],
  rewardPolicy: "No reward mutation in this router slice.",
} as const;

export function getWorldSchema(kind: AOWorldKind) {
  return AO_WORLD_SCHEMA_REGISTRY.find((schema) => schema.kind === kind);
}
