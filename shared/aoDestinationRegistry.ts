export type AODivisionStatus = "active" | "in-build" | "planned";
export type AODestinationAgeTier = "ALL AGES" | "KIDS + GUARDIANS" | "AGE-AWARE" | "GUARDIAN GUIDED" | "OWNER ONLY";
import { AO_WORLD_SCHEMA_REGISTRY, type AOWorldKind } from "./aoWorldKinds";
import { AO_SOURCE_REGISTRY } from "./aoContentRegistry";

export type AODestination = {
  id: string;
  division: string;
  category: string;
  route: string;
  label: string;
  subtitle: string;
  description: string;
  status: AODivisionStatus;
  ageTier: AODestinationAgeTier;
  earns: readonly ("GP" | "AC")[];
  worldKind: AOWorldKind;
  provenanceId: string;
  ownerOnly?: boolean;
};

/** Canonical AO division map. Status is product planning metadata, not live activity. */
export const AO_DESTINATIONS: readonly AODestination[] = [
  { id: "pixel-dot", division: "Pixel & Dot Studio", category: "Creative Studio", route: "/anoms-corner", label: "Pixel & Dot", subtitle: "Stories, art, and character signals", description: "The creative studio for original stories, visual identity, and safe character-led expression.", status: "active", ageTier: "KIDS + GUARDIANS", earns: ["AC"], worldKind: "story", provenanceId: "master-anom-hub-react-artifact" },
  { id: "kids-corner", division: "Anom's Corner", category: "Children's Brand", route: "/anoms-corner", label: "Anom's Corner", subtitle: "Age-aware character worlds", description: "A governed home for child-safe stories, thoughts, and controlled media premieres.", status: "active", ageTier: "KIDS + GUARDIANS", earns: ["GP", "AC"], worldKind: "story", provenanceId: "master-anom-hub-react-artifact" },
  { id: "color-space", division: "Color Space", category: "Art & Design Lab", route: "/library", label: "Color Space", subtitle: "Color studies and creative workshops", description: "A future-facing creative lab for color, backgrounds, and identity packs.", status: "in-build", ageTier: "ALL AGES", earns: ["AC"], worldKind: "library", provenanceId: "library-world-safe-launch" },
  { id: "identity-shop", division: "Identity Shop", category: "Brand Agency", route: "/profile", label: "Identity Shop", subtitle: "Identity tools and visual signatures", description: "Owner-reviewed identity services and expressive profile upgrades.", status: "in-build", ageTier: "GUARDIAN GUIDED", earns: ["AC"], worldKind: "hub", provenanceId: "master-artifacts" },
  { id: "lounges", division: "Lounges", category: "Experience Spaces", route: "/lounges", label: "Lounges", subtitle: "Private spaces for belonging", description: "Family, friends, and coworker spaces with permissioned participation.", status: "in-build", ageTier: "GUARDIAN GUIDED", earns: ["GP"], worldKind: "hub", provenanceId: "sel-architecture-reference" },
  { id: "off-grid", division: "Off-Grid Sanctuary", category: "Lifestyle", route: "/moonberry-farm", label: "Off-Grid", subtitle: "Moonberry Farm and Growth Notes", description: "A calm nature-centered world where gratitude, care, and reflection shape the journey.", status: "active", ageTier: "KIDS + GUARDIANS", earns: ["GP", "AC"], worldKind: "farm", provenanceId: "moonberry-farm-canon" },
  { id: "troll-crush-router", division: "House 4 Arcade Missions", category: "Games Hub", route: "/games/troll-crush", label: "Troll Crush", subtitle: "Universe · World · Community · Space", description: "A guardian-guided three-round session with server-recorded, reward-free completion.", status: "active", ageTier: "KIDS + GUARDIANS", earns: [], worldKind: "hub", provenanceId: "troll-crush-final" },
  { id: "youtube-engine", division: "YouTube Engine", category: "Content Engine", route: "/feed", label: "YouTube Engine", subtitle: "Premieres and creator channels", description: "A controlled media door for approved premieres, creator thoughts, and future voices.", status: "active", ageTier: "AGE-AWARE", earns: [], worldKind: "story", provenanceId: "vertical-media" },
  { id: "anomaly-ai", division: "Anomaly AI", category: "AI Division", route: "/library", label: "Anomaly AI", subtitle: "Tools for creative independence", description: "A planned AI division for owner-reviewed tools, research, and workflow support.", status: "planned", ageTier: "OWNER ONLY", earns: [], worldKind: "help", provenanceId: "source-brief" },
  { id: "security-team", division: "Security Team", category: "Cybersecurity", route: "/help", label: "Security Team", subtitle: "Trust, safety, and IP protection", description: "Operational security and brand protection concepts; not a public claim of automated enforcement.", status: "active", ageTier: "OWNER ONLY", earns: [], worldKind: "help", provenanceId: "help-hub", ownerOnly: true },
  { id: "brand-kit", division: "Brand Kit", category: "Brand Systems", route: "/library", label: "Brand Kit", subtitle: "Reusable identity systems", description: "Planned downloadable brand systems with provenance and licensing review.", status: "active", ageTier: "AGE-AWARE", earns: ["AC"], worldKind: "library", provenanceId: "master-artifacts" },
  { id: "merch-systems", division: "Merch Systems", category: "Merchandise Engine", route: "/merch", label: "Merch Systems", subtitle: "Physical-to-digital identity", description: "Custom goods and trusted production partners, kept separate from the non-cash game ledger.", status: "active", ageTier: "GUARDIAN GUIDED", earns: [], worldKind: "hub", provenanceId: "master-artifacts" },
  { id: "payment-infra", division: "Payment Infra", category: "FinTech Layer", route: "/owner/pitch-reporting", label: "Payment Infra", subtitle: "Future payment architecture", description: "A gated planning concept only; no real-money conversion or spendable payment flow is enabled.", status: "in-build", ageTier: "OWNER ONLY", earns: [], worldKind: "help", provenanceId: "ao-5m-blueprint-video", ownerOnly: true },
] as const;

export function getVisibleAODestinations(guardianMode: boolean): readonly AODestination[] {
  return AO_DESTINATIONS.filter((destination) => !destination.ownerOnly && (!guardianMode || destination.ageTier !== "OWNER ONLY"));
}

export function validateAODestinationRegistry(): readonly string[] {
  const sourceIds = new Set(AO_SOURCE_REGISTRY.map((source) => source.id));
  const errors: string[] = [];
  for (const destination of AO_DESTINATIONS) {
    if (!sourceIds.has(destination.provenanceId)) {
      errors.push(`${destination.id}: missing provenance ${destination.provenanceId}`);
    }
  }
  for (const schema of AO_WORLD_SCHEMA_REGISTRY) {
    const routeDestinations = AO_DESTINATIONS.filter((destination) => destination.route === schema.route);
    if (routeDestinations.length > 0 && !routeDestinations.some((destination) => destination.worldKind === schema.kind && destination.provenanceId === schema.provenanceId)) {
      errors.push(`${schema.route}: no destination matches worldKind ${schema.kind} and provenance ${schema.provenanceId}`);
    }
  }
  return errors;
}
