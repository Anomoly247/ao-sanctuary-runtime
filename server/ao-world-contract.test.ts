import { describe, expect, it } from "vitest";
import {
  AO_LIBRARY_WORLD,
  AO_MOUNT_CONTRACT,
  AO_SAFETY_LAYERS,
  AO_SOCIAL_GOOD_MISSIONS,
  AO_WORLD_AGE_TIERS,
  AO_WORLD_PRINCIPLES,
} from "../shared/aoWorldContract";

describe("AO world contract", () => {
  it("keeps the base identity and learning principles explicit", () => {
    expect(AO_WORLD_PRINCIPLES).toEqual([
      "whole identity online and in real life",
      "creativity as a way to learn",
      "kindness as a playable action",
      "hidden lessons inside every world",
    ]);
  });

  it("keeps the safety layers visible for every future world", () => {
    expect(AO_SAFETY_LAYERS).toContain("age-aware worlds");
    expect(AO_SAFETY_LAYERS).toContain("guardian moderation");
    expect(AO_SAFETY_LAYERS).toContain("emote-first expression");
    expect(AO_SAFETY_LAYERS).toContain("rewards for social good");
  });

  it("gives the future Library World a real route", () => {
    expect(AO_LIBRARY_WORLD.path).toBe("/library");
    expect(AO_LIBRARY_WORLD.subtitle).toContain("videos");
    expect(AO_LIBRARY_WORLD.mission).toContain("curiosity");
  });

  it("keeps mounts as earned identity vessels", () => {
    expect(AO_MOUNT_CONTRACT.role).toContain("identity vessel");
    expect(AO_MOUNT_CONTRACT.purchase).toContain("earned Anom Coins");
    expect(AO_MOUNT_CONTRACT.features).toContain("earned through play");
    expect(AO_MOUNT_CONTRACT.expression).toContain("emotion emotes");
  });

  it("keeps every world age-aware and every mission ledger-backed", () => {
    expect(Object.keys(AO_WORLD_AGE_TIERS)).toEqual(
      expect.arrayContaining(["sanctuary", "play", "archive", "creator", "library"]),
    );
    expect(AO_SOCIAL_GOOD_MISSIONS.map(mission => mission.id)).toEqual([
      "welcome-to-ao",
      "play-with-purpose",
      "make-something-kind",
    ]);
    expect(AO_SOCIAL_GOOD_MISSIONS.map(mission => mission.badgeName)).toEqual([
      "First Steps",
      "Game Master",
      "Family Hero",
    ]);
  });
});
