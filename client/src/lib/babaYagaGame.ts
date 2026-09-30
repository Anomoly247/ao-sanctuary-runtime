export type LanternColor = "gold" | "rose" | "cyan";
export type Emote = "☀" | "✦" | "♡" | "◌";

export const lanterns: Array<{ color: LanternColor; label: string; clue: string }> = [
  { color: "gold", label: "warm gold", clue: "A safe light for the doorway" },
  { color: "rose", label: "soft rose", clue: "A gentle light for a resting friend" },
  { color: "cyan", label: "quiet cyan", clue: "A listening light for the path home" },
];

export const careEmotes: Array<{ symbol: Emote; label: string; meaning: string }> = [
  { symbol: "♡", label: "heart", meaning: "I am here with you" },
  { symbol: "◌", label: "listen", meaning: "I will slow down and listen" },
  { symbol: "✦", label: "glow", meaning: "We can share the light" },
];

export function resolveLanternStep(progress: number, choice: LanternColor): number | null {
  if (progress < 0 || progress >= lanterns.length) return null;
  return lanterns[progress]?.color === choice ? progress + 1 : null;
}

export function isCareEmote(symbol: Emote): boolean {
  return symbol === "♡";
}

export function getGlowReward(kind: "lantern" | "care" | "home"): number {
  if (kind === "lantern") return 2;
  if (kind === "care") return 2;
  return 5;
}
