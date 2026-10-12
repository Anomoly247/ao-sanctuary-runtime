import { describe, expect, it } from "vitest";
import { AO_DESTINATIONS, getVisibleAODestinations } from "../shared/aoDestinationRegistry";
import { AO_PITCH_GUARDRAILS, AO_PITCH_PHASES } from "../shared/aoPitchPlan";
import { AO_ECONOMY_CONTRACT } from "../shared/aoWorldContract";
import { LIBRARY_WORLD_ASSETS, LIBRARY_WORLD_GAMES } from "../shared/aoContentRegistry";

describe("AO economy and destination contracts", () => {
  it("keeps the destination map canonical and non-empty", () => {
    expect(AO_DESTINATIONS).toHaveLength(12);
    expect(new Set(AO_DESTINATIONS.map((item) => item.id)).size).toBe(12);
    expect(getVisibleAODestinations(true).every((item) => !item.ownerOnly)).toBe(true);
  });

  it("keeps the economy non-cash and server-authoritative for accounts", () => {
    expect(AO_ECONOMY_CONTRACT.cashConversion).toBe("not enabled");
    expect(AO_ECONOMY_CONTRACT.balanceAuthority).toContain("server ledger");
  });

  it("keeps pitch planning separate from live analytics", () => {
    expect(AO_PITCH_PHASES.length).toBeGreaterThan(3);
    expect(AO_PITCH_GUARDRAILS.join(" ")).toContain("not live user analytics");
  });

  it("keeps Library game IDs, artwork, and AC completion rewards controlled", () => {
    expect(LIBRARY_WORLD_GAMES.map((game) => game.id)).toEqual([
      "library-pixel-dot",
      "library-clifford-patrol",
      "library-tater-shelf-heist",
    ]);
    expect(LIBRARY_WORLD_GAMES.every((game) => game.rewardAsset === "AC")).toBe(true);
    expect(LIBRARY_WORLD_GAMES.every((game) => /^\d+\.\d{2}$/.test(game.rewardAmount))).toBe(true);
    expect(Object.values(LIBRARY_WORLD_ASSETS).every((asset) => asset.startsWith("/manus-storage/"))).toBe(true);
  });
});
