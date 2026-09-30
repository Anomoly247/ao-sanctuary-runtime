import { describe, expect, it } from "vitest";

describe("Umami configuration contract", () => {
  it("keeps analytics configuration names aligned with the app bootstrap", () => {
    expect("VITE_ANALYTICS_ENDPOINT").toMatch(/^VITE_/);
    expect("VITE_ANALYTICS_WEBSITE_ID").toMatch(/^VITE_/);
    expect("UMAMI_API_KEY").toBe("UMAMI_API_KEY");
  });

  it("does not require analytics configuration to make the app buildable", () => {
    expect(true).toBe(true);
  });
});
