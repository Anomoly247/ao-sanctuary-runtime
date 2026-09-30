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
  rare: { label: "RARE", color: "violet" },
  legendary: { label: "LEGENDARY", color: "white" },
} as const;

export type AOBadgeRarity = keyof typeof AO_BADGE_RARITIES;

export function getAOBadgeRarity(achievement: { id: number; category?: string | null }): AOBadgeRarity {
  if (achievement.id === 6 || achievement.category === "milestones") return "legendary";
  if (achievement.category === "games") return "rare";
  if (achievement.category === "family") return "uncommon";
  return "common";
}
