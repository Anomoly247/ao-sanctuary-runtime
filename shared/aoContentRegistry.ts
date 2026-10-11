export type AOAgeTier = "ALL AGES" | "KIDS + GUARDIANS" | "AGE-AWARE" | "GUARDIAN GUIDED" | "OWNER ONLY";
export type AOPublicationStatus = "published" | "review" | "planned" | "archived";

export const MOONBERRY_FARM = {
  id: "off-grid-moonberry-farm",
  label: "Moonberry Farm",
  world: "Off-Grid Sanctuary",
  house: "House 1",
  ageTier: "KIDS + GUARDIANS" as const,
  description: "A quiet farm where gratitude helps the harvest grow.",
  steps: [
    { id: "plant", label: "Plant", cue: "Choose a moonberry seed and give it a home." },
    { id: "water", label: "Water", cue: "Ask your mount to help care for the soil." },
    { id: "harvest", label: "Harvest", cue: "Gather the moonberries and notice what grew." },
    { id: "reflect", label: "Growth Note", cue: "Keep one private note about what you appreciated." },
  ],
  growthPrompt: "What did you notice, care for, or appreciate today?",
  privacyNote: "Growth Notes stay on this device in guest mode and are not public posts.",
} as const;

export type AOMediaRegistryEntry = {
  id: string;
  title: string;
  characters: readonly string[];
  sourceKind: "video" | "channel" | "preview";
  sourceUrl?: string;
  localArchivePath: string;
  ageTier: AOAgeTier;
  ownership: "Anom Originals" | "Needs confirmation";
  publicationStatus: AOPublicationStatus;
  notes: string;
};

export const AO_MEDIA_REGISTRY: readonly AOMediaRegistryEntry[] = [
  {
    id: "hide-and-seek-neon-grid",
    title: "Hide and Seek in the Neon Grid",
    characters: ["AO Universe characters"],
    sourceKind: "video",
    localArchivePath: "ao-master-reference-2026-10-10/media/Hide_and_Seek_in_the_Neon_Grid.mp4",
    ageTier: "AGE-AWARE",
    ownership: "Needs confirmation",
    publicationStatus: "review",
    notes: "Vertical H.264/AAC source; review captions, rights, and age placement before publishing.",
  },
  {
    id: "tater-clifford-hallway-heroes",
    title: "Tater & Clifford: Hallway Heroes",
    characters: ["Tater", "Clifford"],
    sourceKind: "video",
    localArchivePath: "ao-master-reference-2026-10-10/media/tater-clifford-hallway-heroes.mp4",
    ageTier: "KIDS + GUARDIANS",
    ownership: "Anom Originals",
    publicationStatus: "review",
    notes: "Archived character media; publication destination and captions remain to be confirmed.",
  },
  {
    id: "anom-originals-channel",
    title: "Anom Originals premiere channel",
    characters: ["Pixel", "Dot", "Tater", "Clifford", "future voices"],
    sourceKind: "channel",
    sourceUrl: "https://www.youtube.com/@anomoriginals",
    localArchivePath: "external channel destination",
    ageTier: "AGE-AWARE",
    ownership: "Anom Originals",
    publicationStatus: "published",
    notes: "Use as a premiere destination; individual embeds still require content review.",
  },
] as const;

export type AOSourceRegistryEntry = {
  id: string;
  title: string;
  provenance: string;
  destination: string;
  migrationStatus: "archived" | "mapped" | "review" | "not-started";
  ageTier: AOAgeTier;
  ownerNote: string;
};

export const AO_SOURCE_REGISTRY: readonly AOSourceRegistryEntry[] = [
  {
    id: "source-brief",
    title: "AO Universe Source Brief",
    provenance: "User-provided source brief, 2026-10-10",
    destination: "Shared AO contract and route registry",
    migrationStatus: "mapped",
    ageTier: "OWNER ONLY",
    ownerNote: "Current authority for domain corrections, ownership, naming, and platform boundaries.",
  },
  {
    id: "moonberry-farm-canon",
    title: "Off-Grid / Moonberry Farm canon",
    provenance: "User-provided AO Universe specification; offgrid export retained as supporting artifact",
    destination: "/moonberry-farm",
    migrationStatus: "review",
    ageTier: "KIDS + GUARDIANS",
    ownerNote: "Implement gratitude, mount care, harvest, and private Growth Notes without public scoring.",
  },
  {
    id: "master-artifacts",
    title: "AO master HTML and package set",
    provenance: "Private archive ao-master-reference-2026-10-10 with SHA256SUMS.txt",
    destination: "Controlled content and media registries",
    migrationStatus: "archived",
    ageTier: "OWNER ONLY",
    ownerNote: "Generated exports inform contracts; do not copy stale routes, hardcoded metrics, or legacy palette tokens wholesale.",
  },
  {
    id: "help-hub",
    title: "Anom Internet Help Hub",
    provenance: "User-provided HTML artifact",
    destination: "/help",
    migrationStatus: "mapped",
    ageTier: "ALL AGES",
    ownerNote: "Reuse skip link, support-terminal structure, and responsive help patterns; remap visual tokens to AO gold/cyan.",
  },
  {
    id: "vertical-media",
    title: "Hide and Seek in the Neon Grid",
    provenance: "User-provided MP4 in private archive",
    destination: "Anom's Corner premiere registry",
    migrationStatus: "review",
    ageTier: "AGE-AWARE",
    ownerNote: "Rights, captions, thumbnail, and publication destination must be confirmed before upload.",
  },
  {
    id: "master-anom-hub-react-artifact",
    title: "Master Anom Hub React Artifact",
    provenance: "User-provided pasted_content_4.txt; SHA-256 retained in the private reference archive",
    destination: "Four-house contract, guardian tiers, destination registry, and prototype economy review",
    migrationStatus: "review",
    ageTier: "OWNER ONLY",
    ownerNote: "Supporting reference only; demo balances and shop prices are not live data or approved economy rules.",
  },
] as const;
