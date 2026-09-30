import { describe, expect, it } from "vitest";
import { MISSION_CATALOG } from "./missionLedger";

describe("AO mission and badge contract", () => {
  it("keeps stable mission ids and explicit achievement linkage", () => {
    expect(MISSION_CATALOG.map(mission => mission.id)).toEqual([
      "welcome-to-ao",
      "play-with-purpose",
      "make-something-kind",
    ]);

    for (const mission of MISSION_CATALOG) {
      expect(mission.name).toBeTruthy();
      expect(mission.reward).toMatch(/^\d+\.\d{2}$/);
      expect(mission).toHaveProperty("achievementId");
    }
  });
});
