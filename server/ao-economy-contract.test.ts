import { describe, expect, it } from "vitest";
import { AO_DESTINATIONS, getVisibleAODestinations } from "../shared/aoDestinationRegistry";
import { AO_PITCH_GUARDRAILS, AO_PITCH_PHASES } from "../shared/aoPitchPlan";
import { AO_ECONOMY_CONTRACT } from "../shared/aoWorldContract";

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
});
