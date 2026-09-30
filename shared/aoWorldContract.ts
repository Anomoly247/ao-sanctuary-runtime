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
  { id: "welcome-to-ao", label: "Arrive with intention", cue: "Choose a house and enter together." },
  { id: "play-with-purpose", label: "Play with purpose", cue: "Complete a connected creative activity." },
  { id: "make-something-kind", label: "Make something kind", cue: "Create, share, or encourage safely." },
] as const;
