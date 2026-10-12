import { describe, expect, it } from "vitest";
import {
  clampColorCornerGlow,
  colorCornerPresets,
  defaultColorCornerConfig,
  libraryWorldDestinations,
} from "@/data/libraryWorld";
import { libraryWorldAssets, libraryWorldGameIds, libraryWorldGameLabels } from "@/data/libraryWorldAssets";

describe("Library World integration registry", () => {
  it("exposes the three named mini-games through the /games route", () => {
    expect(libraryWorldDestinations.map((destination) => destination.label)).toEqual([
      "Pixel & Dot",
      "Clifford Patrol",
      "Tater Shelf Heist",
    ]);
    expect(libraryWorldDestinations.every((destination) => destination.href.startsWith("/games?game="))).toBe(true);
  });

  it("keeps Color Corner Free Pick local-friendly and bounded", () => {
    expect(defaultColorCornerConfig).toMatchObject({ hex: "#00eaff", glow: 68 });
    expect(colorCornerPresets).toHaveLength(4);
    expect(clampColorCornerGlow(2)).toBe(15);
    expect(clampColorCornerGlow(140)).toBe(100);
    expect(clampColorCornerGlow(61.7)).toBe(62);
  });

  it("keeps the three completion IDs and canonical artwork paths stable", () => {
    expect(libraryWorldGameIds).toEqual(["library-pixel-dot", "library-clifford-patrol", "library-tater-shelf-heist"]);
    expect(Object.values(libraryWorldGameLabels)).toEqual(["Pixel & Dot", "Clifford Patrol", "Tater Shelf Heist"]);
    expect(Object.values(libraryWorldAssets).every((path) => path.startsWith("/manus-storage/") && path.endsWith(".png"))).toBe(true);
  });
});
