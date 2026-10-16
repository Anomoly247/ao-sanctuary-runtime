export const AO_WORLD_PRINCIPLES = [
  "whole identity online and in real life",
  "creativity as a way to learn",
  "kindness as a playable action",
  "hidden lessons inside every world",
] as const;

export const AO_SAFETY_LAYERS = [
  "age-aware worlds",
  "guardian moderation",
  "emote-first expression",
  "rewards for social good",
] as const;

export const AO_HOUSES = [
  { id: "house-1", label: "House 1", characters: ["Pixel", "Dot"], focus: "gratitude and safe storytelling", anchorWorld: "Moonberry Farm" },
  { id: "house-2", label: "House 2", characters: ["Tater", "Clifford"], focus: "courage and safety", anchorWorld: "Vault" },
  { id: "house-3", label: "House 3", characters: ["Mood Buddies"], focus: "empathy and emotional transformation", anchorWorld: "Feelings Journal" },
  { id: "house-4", label: "House 4", characters: ["Sassy Patrol", "Troll Crush"], focus: "boundaries and digital literacy", anchorWorld: "Arcade Missions" },
] as const;

export const AO_GUARDIAN_TIERS = [
  { id: "helper", shortCode: "H", label: "Helper", mentorTarget: "Kind" },
  { id: "kind", shortCode: "K", label: "Kind", mentorTarget: "Brave" },
  { id: "brave", shortCode: "B", label: "Brave", mentorTarget: "Guardian" },
  { id: "guardian", shortCode: "G", label: "Guardian", mentorTarget: "Ultra" },
  { id: "ultra", shortCode: "U", label: "Ultra", mentorTarget: "Helper" },
] as const;

export const AO_LIVING_TIMING = {
  maxScale: 1.05,
  maxTranslationPx: 6,
  houseLoopsSeconds: { house1: 3.2, house2: 3.6, house3: 3.9, house4: 4.1 },
  orbitLoopsSeconds: { innerMount: 3.8, moon: 4, outerMount: 6, hubMount: 7 },
} as const;

export const AO_COLOR_CONTRACT = {
  canvas: "#000000",
  void: "#0A0A10",
  active: "#00eaff",
  prestige: "#d8ae55",
  restrictedInBuild: "#ff00c8",
  restrictedRole: "signal only; never primary UI",
} as const;

export const AO_ECONOMY_CONTRACT = {
  glowPointsToAnomCoin: 10,
  apprenticeMinimumGlow: 201,
  minimumSwapGlow: 100,
  conversionEndpoint: "/api/v1/vault/convert",
  cashConversion: "not enabled",
  balanceAuthority: "server ledger for authenticated users; local prototype only for guests",
} as const;

export const AO_SENTINEL_RULES = [
  "strictly SFW",
  "identity and IP protection",
  "no toxicity",
  "mood-first respect",
  "reviewable moderation with an audit path",
] as const;

export const AO_MOUNT_CONTRACT = {
  role: "identity vessel across worlds and missions",
  purchase: "earned Anom Coins",
  membership: "may include a mount",
  features: "earned through play, missions, and safe community actions",
  expression: "emotion emotes orbit the selected creature",
} as const;

export const AO_LIBRARY_WORLD = {
  id: "library",
  label: "Library World",
  path: "/library",
  subtitle: "Research · videos · hidden lessons",
  mission: "Turn curiosity into a shared quest.",
} as const;

export const AO_WORLD_AGE_TIERS = {
  sanctuary: "ALL AGES",
  play: "KIDS + GUARDIANS",
  archive: "ALL AGES",
  creator: "GUARDIAN GUIDED",
  library: "AGE-AWARE",
} as const;

export const AO_SOCIAL_GOOD_MISSIONS = [
  { id: "welcome-to-ao", label: "Arrive with intention", cue: "Choose a house and enter together.", badgeName: "First Steps" },
  { id: "play-with-purpose", label: "Play with purpose", cue: "Complete a connected creative activity.", badgeName: "Game Master" },
  { id: "make-something-kind", label: "Make something kind", cue: "Create, share, or encourage safely.", badgeName: "Family Hero" },
] as const;

export const AO_BADGE_RARITIES = {
  common: { label: "COMMON", color: "cyan" },
  uncommon: { label: "UNCOMMON", color: "gold" },
  rare: { label: "RARE", color: "gold" },
  legendary: { label: "LEGENDARY", color: "white" },
} as const;

export type AOBadgeRarity = keyof typeof AO_BADGE_RARITIES;

export function getAOBadgeRarity(achievement: { id: number; category?: string | null }): AOBadgeRarity {
  if (achievement.id === 6 || achievement.category === "milestones") return "legendary";
  if (achievement.category === "games") return "rare";
  if (achievement.category === "family") return "uncommon";
  return "common";
}
