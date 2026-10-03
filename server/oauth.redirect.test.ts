import { describe, expect, it } from "vitest";
import { buildOAuthRedirectUri } from "./_core/oauth";

describe("OAuth redirect URI", () => {
  it("uses the canonical public origin for deployed hosts", () => {
    expect(buildOAuthRedirectUri({
      protocol: "https",
      requestHost: "internal-service-123.a.run.app",
      publicAppOrigin: "https://universe.anomoriginals.lol",
    })).toBe("https://universe.anomoriginals.lol/api/oauth/callback");
  });

  it("preserves localhost callbacks for local development", () => {
    expect(buildOAuthRedirectUri({
      protocol: "http",
      requestHost: "localhost:3000",
      publicAppOrigin: "https://universe.anomoriginals.lol",
    })).toBe("http://localhost:3000/api/oauth/callback");
  });

  it("removes a trailing slash from a configured public origin", () => {
    expect(buildOAuthRedirectUri({
      protocol: "https",
      requestHost: "preview.example.com",
      publicAppOrigin: "https://universe.anomoriginals.lol/",
    })).toBe("https://universe.anomoriginals.lol/api/oauth/callback");
  });
});
