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

export const LIBRARY_WORLD_ASSETS = {
  pixel: "/manus-storage/library-pixel_8b3a5225.png",
  dot: "/manus-storage/library-dot_94e0e0f1.png",
  clifford: "/manus-storage/library-clifford-canonical_fcb00d06.png",
  tater: "/manus-storage/library-tater-canonical_d2544178.png",
} as const;

export const LIBRARY_WORLD_GAMES = [
  {
    id: "library-pixel-dot",
    label: "Pixel & Dot",
    description: "Follow a paired clue trail through the Library’s story shelves.",
    characters: ["Pixel", "Dot"],
    ageTier: "KIDS + GUARDIANS" as const,
    rewardAsset: "AC" as const,
    rewardAmount: "15.00",
    artwork: LIBRARY_WORLD_ASSETS.pixel,
  },
  {
    id: "library-clifford-patrol",
    label: "Clifford Patrol",
    description: "Practice noticing safe routes, helpful signals, and trusted support.",
    characters: ["Clifford"],
    ageTier: "GUARDIAN GUIDED" as const,
    rewardAsset: "AC" as const,
    rewardAmount: "20.00",
    artwork: LIBRARY_WORLD_ASSETS.clifford,
  },
  {
    id: "library-tater-shelf-heist",
    label: "Tater Shelf Heist",
    description: "Solve a gentle shelf puzzle where curiosity beats rushing.",
    characters: ["Tater"],
    ageTier: "AGE-AWARE" as const,
    rewardAsset: "AC" as const,
    rewardAmount: "25.00",
    artwork: LIBRARY_WORLD_ASSETS.tater,
  },
] as const;

export type LibraryWorldGameId = (typeof LIBRARY_WORLD_GAMES)[number]["id"];

export type AOStoryAccent = "gold" | "cyan";

export type AOStoryCharacter = {
  id: string;
  name: string;
  role: string;
  ageTier: AOAgeTier;
  provenanceId: string;
};

export type AOStoryThought = {
  id: string;
  characterId: string;
  title: string;
  text: string;
  publicationStatus: AOPublicationStatus;
  ageTier: AOAgeTier;
};

export type AOStoryEntry = {
  id: string;
  character: string;
  title: string;
  description: string;
  duration: string;
  accent: AOStoryAccent;
  videoId?: string;
  channelUrl?: string;
  premiere?: boolean;
  featured?: boolean;
  publicationStatus: AOPublicationStatus;
  ageTier: AOAgeTier;
  provenanceId: string;
};

export const AO_STORY_WORLD_CONTENT = {
  characters: [
    { id: "pixel", name: "Pixel", role: "The Creator", ageTier: "KIDS + GUARDIANS", provenanceId: "master-anom-hub-react-artifact" },
    { id: "dot", name: "Dot", role: "The Explorer", ageTier: "KIDS + GUARDIANS", provenanceId: "master-anom-hub-react-artifact" },
    { id: "tater", name: "Tater", role: "The Scout", ageTier: "KIDS + GUARDIANS", provenanceId: "ao-originals-channel" },
    { id: "clifford", name: "Clifford", role: "The Protector", ageTier: "KIDS + GUARDIANS", provenanceId: "ao-originals-channel" },
  ] satisfies readonly AOStoryCharacter[],
  thoughts: [
    { id: "pixel-first-signal", characterId: "pixel", title: "Pixel’s first signal", text: "A small idea can become a whole world when we care for it.", publicationStatus: "review", ageTier: "KIDS + GUARDIANS" },
    { id: "dot-notice-more", characterId: "dot", title: "Dot notices more", text: "Look twice. The quiet detail may be the beginning of the next path.", publicationStatus: "review", ageTier: "KIDS + GUARDIANS" },
    { id: "tater-warm-note", characterId: "tater", title: "Tater’s warm note", text: "A good journey has room for a snack, a pause, and a friend.", publicationStatus: "review", ageTier: "KIDS + GUARDIANS" },
    { id: "clifford-safe-route", characterId: "clifford", title: "Clifford checks the route", text: "Trusted grown-ups and clear boundaries help every adventure feel safer.", publicationStatus: "review", ageTier: "KIDS + GUARDIANS" },
  ] satisfies readonly AOStoryThought[],
  entries: [
    { id: "premiere-room", character: "AO Universe", title: "AO Premiere Room | Anom Originals", premiere: true, channelUrl: "https://www.youtube.com/@anomoriginals", accent: "gold", duration: "New premieres", description: "A dedicated doorway for new premieres, creator thoughts, character signals, and the next story moving through Anom’s Corner.", featured: true, publicationStatus: "published", ageTier: "AGE-AWARE", provenanceId: "anom-originals-channel" },
    { id: "pixel-dot-adventure", character: "Pixel & Dot", title: "Pixel & Dot's New Adventure | Anom's Corner", videoId: "0pBrQUqU0ig", accent: "cyan", duration: "1:50", description: "Join Pixel and Dot on their first adventure in Anom's Corner! Discover their signal-lit world and the mysteries that await.", publicationStatus: "review", ageTier: "KIDS + GUARDIANS", provenanceId: "master-anom-hub-react-artifact" },
    { id: "tater-premiere", character: "Tater", title: "Tater // Character Premiere Slot", channelUrl: "https://www.youtube.com/@anomoriginals", accent: "gold", duration: "Channel premiere", description: "A dedicated home for Tater’s cooking, curiosity, and warm-hearted field notes. The slot opens the channel until a verified episode URL is published.", publicationStatus: "review", ageTier: "KIDS + GUARDIANS", provenanceId: "anom-originals-channel" },
    { id: "clifford-premiere", character: "Clifford", title: "Clifford // Character Premiere Slot", channelUrl: "https://www.youtube.com/@anomoriginals", accent: "cyan", duration: "Channel premiere", description: "A dedicated home for Clifford’s comedy, protection signals, and thoughts from the wild edge. The slot opens the channel until a verified episode URL is published.", publicationStatus: "review", ageTier: "KIDS + GUARDIANS", provenanceId: "anom-originals-channel" },
  ] satisfies readonly AOStoryEntry[],
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
    id: "library-world-safe-launch",
    title: "Library World Safe Launch",
    provenance: "User-provided Library World safe-launch artifact",
    destination: "/library",
    migrationStatus: "mapped",
    ageTier: "AGE-AWARE",
    ownerNote: "Controlled Library game schema and authenticated completion boundary.",
  },
  {
    id: "anom-originals-channel",
    title: "Anom Originals YouTube Channel",
    provenance: "Controlled external channel destination",
    destination: "/anoms-corner",
    migrationStatus: "mapped",
    ageTier: "AGE-AWARE",
    ownerNote: "Channel door for premieres and character entries; individual episodes remain review-gated.",
  },
  {
    id: "troll-crush-final",
    title: "Troll Crush Final Game Reference",
    provenance: "User-provided Troll Crush PDF and related game references",
    destination: "/games/troll-crush",
    migrationStatus: "review",
    ageTier: "KIDS + GUARDIANS",
    ownerNote: "Router and future session reference; no reward mutation is enabled until completion-contract approval.",
  },
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
  {
    id: "sel-architecture-reference",
    title: "AO SEL Architecture lesson",
    provenance: "User-provided pasted_content_5.txt; SHA-256 retained in the private reference archive",
    destination: "Non-extractive architecture, four-house contract, and Guardian-tier review",
    migrationStatus: "review",
    ageTier: "OWNER ONLY",
    ownerNote: "Adopts privacy and SEL principles; does not adopt hot-magenta primary styling or a fixed AC-to-dollar exchange rate.",
  },
  {
    id: "definitive-master-build-specification",
    title: "AO Universe Definitive Master Build Specification",
    provenance: "User-provided pasted_content_6.txt; SHA-256 retained in the private reference archive",
    destination: "Shared Houses, Guardian tiers, timing, visual, Sentinel, and staged economy contracts",
    migrationStatus: "mapped",
    ageTier: "OWNER ONLY",
    ownerNote: "Primary product specification; cash conversion, spendable economy, and automated enforcement remain gated for separate approval.",
  },
  {
    id: "master-build-specification-pdf",
    title: "AO Universe Master Build Specification PDF",
    provenance: "User-provided five-page PDF; SHA-256 retained in the private reference archive",
    destination: "High-fidelity source for design guardrails, timing, divisions, mounts, and Sentinel review",
    migrationStatus: "mapped",
    ageTier: "OWNER ONLY",
    ownerNote: "Confidential reference; identity-passport, payment, financial-target, and autonomous-enforcement sections remain gated.",
  },
  {
    id: "ao-5m-blueprint-video",
    title: "AO Universe $5M Blueprint video",
    provenance: "User-provided strategic video; companion analysis and SHA-256 manifest retained in the private reference archive",
    destination: "Confidential pitch, flywheel, division, growth-planning, and IP-protection reference",
    migrationStatus: "review",
    ageTier: "OWNER ONLY",
    ownerNote: "Financial, fundraising, subscriber, licensing, and expansion figures are illustrative planning claims, never live product metrics.",
  },
] as const;
