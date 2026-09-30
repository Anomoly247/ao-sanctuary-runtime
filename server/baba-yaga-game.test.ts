import { describe, expect, it } from "vitest";
import { getGlowReward, isCareEmote, resolveLanternStep } from "../client/src/lib/babaYagaGame";

describe("Baba Yaga Sprout puzzle rules", () => {
  it("accepts the lanterns in the warm-room sequence", () => {
    expect(resolveLanternStep(0, "gold")).toBe(1);
    expect(resolveLanternStep(1, "rose")).toBe(2);
    expect(resolveLanternStep(2, "cyan")).toBe(3);
  });

  it("does not punish a wrong lantern choice", () => {
    expect(resolveLanternStep(0, "cyan")).toBeNull();
    expect(resolveLanternStep(2, "rose")).toBeNull();
  });

  it("treats the heart as the care signal", () => {
    expect(isCareEmote("♡")).toBe(true);
    expect(isCareEmote("✦")).toBe(false);
    expect(isCareEmote("◌")).toBe(false);
  });

  it("keeps the reward loop predictable", () => {
    expect(getGlowReward("lantern")).toBe(2);
    expect(getGlowReward("care")).toBe(2);
    expect(getGlowReward("home")).toBe(5);
  });
});
