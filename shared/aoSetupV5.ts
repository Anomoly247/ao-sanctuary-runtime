import type { AOAgeTier } from "./aoContentRegistry";
import { AO_ART, aoArtUrl } from "./aoArt";
import { AO_SOURCE_REGISTRY } from "./aoContentRegistry";
import { AO_WORLD_SCHEMA_REGISTRY, type AOWorldKind } from "./aoWorldKinds";

export type AOGuardianTier = "child" | "teen" | "adult" | "guardian";
export type AOSentinelCaseStatus = "open" | "under_review" | "resolved" | "dismissed";
export type AOSentinelSubjectType = "asset" | "profile" | "media";

export type AOIdentityProfile = {
  house: string | null;
  mount: string | null;
  mountColor: string | null;
  guardianTier: AOGuardianTier;
  guardianConfirmed: boolean;
};

export type AOSetupV5Asset = {
  id: string;
  label: string;
  url: string;
  worldKind: AOWorldKind;
  ageTier: AOAgeTier;
  ownership: "Anom Originals" | "Needs confirmation";
  publicationStatus: "published" | "review" | "planned" | "archived";
  provenanceId: string;
};

export const AO_SETUP_V5_ASSETS: readonly AOSetupV5Asset[] = [
  { id: "character-pixel", label: "Pixel", url: aoArtUrl(AO_ART.characters.pixel), worldKind: "story", ageTier: "KIDS + GUARDIANS", ownership: "Anom Originals", publicationStatus: "published", provenanceId: "master-anom-hub-react-artifact" },
  { id: "character-tater", label: "Tater", url: aoArtUrl(AO_ART.characters.tater), worldKind: "story", ageTier: "KIDS + GUARDIANS", ownership: "Anom Originals", publicationStatus: "published", provenanceId: "anom-originals-channel" },
  { id: "character-clifford", label: "Clifford", url: aoArtUrl(AO_ART.characters.clifford), worldKind: "story", ageTier: "KIDS + GUARDIANS", ownership: "Anom Originals", publicationStatus: "published", provenanceId: "anom-originals-channel" },
  { id: "mount-aurora", label: AO_ART.mounts.aurora.label, url: aoArtUrl(AO_ART.mounts.aurora.art), worldKind: "farm", ageTier: "KIDS + GUARDIANS", ownership: "Anom Originals", publicationStatus: "published", provenanceId: "moonberry-farm-canon" },
  { id: "mount-cyber", label: AO_ART.mounts.cyber.label, url: aoArtUrl(AO_ART.mounts.cyber.art), worldKind: "farm", ageTier: "AGE-AWARE", ownership: "Anom Originals", publicationStatus: "published", provenanceId: "master-artifacts" },
  { id: "mount-gold", label: AO_ART.mounts.gold.label, url: aoArtUrl(AO_ART.mounts.gold.art), worldKind: "farm", ageTier: "AGE-AWARE", ownership: "Anom Originals", publicationStatus: "published", provenanceId: "master-artifacts" },
];

export const AO_SETUP_V5_SENTINEL_POLICY = {
  autonomousEnforcement: false,
  requiresHumanReview: true,
  auditAction: "sentinel_case_review",
  allowedStatuses: ["open", "under_review", "resolved", "dismissed"] as const,
  note: "Sentinel flags and routes cases for human review; it does not silently remove assets or claim automated safety enforcement.",
} as const;

export function validateAOSetupV5AssetRegistry(): readonly string[] {
  const sourceIds = new Set(AO_SOURCE_REGISTRY.map((source) => source.id));
  const schemas = new Set(AO_WORLD_SCHEMA_REGISTRY.map((schema) => schema.kind));
  const errors: string[] = [];
  for (const asset of AO_SETUP_V5_ASSETS) {
    if (!asset.url.startsWith("https://anomartsy.xyz/assets/")) errors.push(`${asset.id}: asset must use canonical Homeworld art host`);
    if (!sourceIds.has(asset.provenanceId)) errors.push(`${asset.id}: missing provenance ${asset.provenanceId}`);
    if (!schemas.has(asset.worldKind)) errors.push(`${asset.id}: unknown worldKind ${asset.worldKind}`);
    if (asset.ownership !== "Anom Originals") errors.push(`${asset.id}: ownership requires review before publication`);
    if (asset.publicationStatus !== "published") errors.push(`${asset.id}: asset is not publishable`);
  }
  return errors;
}
