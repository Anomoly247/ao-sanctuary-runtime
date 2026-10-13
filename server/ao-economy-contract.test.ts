import { describe, expect, it } from "vitest";
import { AO_DESTINATIONS, getVisibleAODestinations, validateAODestinationRegistry } from "../shared/aoDestinationRegistry";
import { AO_PITCH_GUARDRAILS, AO_PITCH_PHASES } from "../shared/aoPitchPlan";
import { AO_ECONOMY_CONTRACT } from "../shared/aoWorldContract";
import { AO_SOURCE_REGISTRY, AO_STORY_WORLD_CONTENT, LIBRARY_WORLD_ASSETS, LIBRARY_WORLD_GAMES } from "../shared/aoContentRegistry";
import { AO_TROLL_CRUSH_COMPLETION_CONTRACT, AO_TROLL_CRUSH_ROUTER, AO_WORLD_SCHEMA_REGISTRY } from "../shared/aoWorldKinds";

describe("AO economy and destination contracts", () => {
  it("keeps the destination map canonical and non-empty", () => {
    expect(AO_DESTINATIONS).toHaveLength(13);
    expect(new Set(AO_DESTINATIONS.map((item) => item.id)).size).toBe(13);
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

  it("keeps specialized world schemas explicit and Troll Crush reward-free", () => {
    expect(AO_WORLD_SCHEMA_REGISTRY.map((schema) => schema.kind)).toEqual(["farm", "library", "hub", "story", "help"]);
    expect(AO_WORLD_SCHEMA_REGISTRY.every((schema) => schema.provenanceId.length > 0)).toBe(true);
    expect(AO_TROLL_CRUSH_ROUTER.route).toBe("/games/troll-crush");
    expect(AO_TROLL_CRUSH_ROUTER.rewardPolicy).toContain("no wallet reward");
    expect(AO_TROLL_CRUSH_COMPLETION_CONTRACT.enabled).toBe(true);
    expect(AO_TROLL_CRUSH_COMPLETION_CONTRACT.status).toBe("approved");
    expect(AO_TROLL_CRUSH_COMPLETION_CONTRACT.rewardAsset).toBe("none");
  });

  it("keeps every destination tied to provenance and its matching world schema", () => {
    expect(validateAODestinationRegistry()).toEqual([]);
    expect(AO_DESTINATIONS.every((destination) => destination.worldKind && destination.provenanceId)).toBe(true);
  });

  it("keeps StoryWorld characters, thoughts, and entries typed and provenance-backed", () => {
    const characterIds = new Set(AO_STORY_WORLD_CONTENT.characters.map((character) => character.id));
    const sourceIds = new Set(AO_SOURCE_REGISTRY.map((source) => source.id));
    expect(AO_STORY_WORLD_CONTENT.characters).toHaveLength(4);
    expect(AO_STORY_WORLD_CONTENT.thoughts.every((thought) => characterIds.has(thought.characterId))).toBe(true);
    expect(AO_STORY_WORLD_CONTENT.entries.every((entry) => sourceIds.has(entry.provenanceId))).toBe(true);
    expect(AO_STORY_WORLD_CONTENT.entries.some((entry) => entry.premiere)).toBe(true);
  });
});
