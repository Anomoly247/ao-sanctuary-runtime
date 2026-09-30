export const AO_ART = {
  base: "https://anomartsy.xyz/assets",
  worlds: {
    play: "/backgrounds/05_moonlit_forest_spirit.jpg",
    archive: "/backgrounds/09_emerald_moon_dragon_castle.jpg",
    sanctuary: "/backgrounds/03_neon_cosmic_muse.jpg",
  },
  characters: {
    pixel: "/master/pixel-dot.png",
    tater: "/master/tater.png",
    clifford: "/master/clifford.png",
  },
  mounts: {
    aurora: { label: "Aurora Portal", art: "/mounts/ridable_aurora_portal_cutout.png" },
    cyber: { label: "Cyber Dragon", art: "/mounts/ridable_cyber_dragon_cutout.png" },
    gold: { label: "Gold Halo", art: "/mounts/ridable_gold_halo_cutout.png" },
    galaxy: { label: "Galaxy Spiral", art: "/mounts/ridable_galaxy_spiral_cutout.png" },
    default: { label: "Emotion Driven Travel Animal", art: "/mounts/futuristic_emotion_driven_travel_animal.png" },
  },
  emotes: ["☀", "✦", "♡", "◌"] as const,
  badges: {
    cyanDragon: "/emblems/cyber_dragon_badge_cyan.png",
    goldDragon: "/emblems/cyber_dragon_badge_gold.png",
    collectorSet: "/emblems/ao_collector_emblems_showcase.png",
    moodBuddies: "/emblems/house_3_mood_buddies_emblem.jpg",
  },
} as const;

export function aoArtUrl(path: string) {
  return `${AO_ART.base}${path}`;
}
