import { describe, expect, it } from "vitest";
import { AO_LIBRARY_WORLD, AO_SAFETY_LAYERS, AO_WORLD_PRINCIPLES } from "../shared/aoWorldContract";

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
});
