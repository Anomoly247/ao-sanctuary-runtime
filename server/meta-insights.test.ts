import { describe, expect, it } from "vitest";
import { getMetaConfigStatus } from "./meta.procedures";

describe("Meta native insights configuration", () => {
  it("never reports native sync as ready when server credentials are absent", () => {
    const status = getMetaConfigStatus();
    const hasToken = Boolean(process.env.META_GRAPH_ACCESS_TOKEN);
    const hasPage = Boolean(process.env.META_FACEBOOK_PAGE_ID);
    const hasInstagram = Boolean(process.env.META_INSTAGRAM_BUSINESS_ACCOUNT_ID);
    expect(status.configured).toBe(hasToken && hasPage && hasInstagram);
    expect(status.facebook).toBe(hasToken && hasPage);
    expect(status.instagram).toBe(hasToken && hasInstagram);
  });
});
