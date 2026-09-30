import { describe, expect, it } from "vitest";
import { DEFAULT_CONTENT_CONFIG, DEFAULT_SOCIAL_FALLBACK_MESSAGE, getPlatformLabel, getSocialPostPlatform, getYouTubeEmbedUrl, isEmbedReadySocialUrl } from "../client/src/lib/aoContent";

describe("AO content registry", () => {
  it("ships the provided YouTube and Substack destinations", () => {
    expect(DEFAULT_CONTENT_CONFIG.channels.find((channel) => channel.platform === "youtube")?.url).toBe("https://www.youtube.com/@anomoriginals");
    expect(DEFAULT_CONTENT_CONFIG.channels.find((channel) => channel.platform === "facebook")?.url).toBe("https://www.facebook.com/anomoriginals");
    expect(DEFAULT_CONTENT_CONFIG.channels.find((channel) => channel.platform === "substack")?.url).toBe("https://anomorig.substack.com/");
    expect(DEFAULT_CONTENT_CONFIG.channels.find((channel) => channel.platform === "spreadshop")?.url).toBe("https://anomoriginals.myspreadshop.com/");
    expect(DEFAULT_CONTENT_CONFIG.offers.find((offer) => offer.id === "spreadshop-ao-collection")?.url).toBe("https://anomoriginals.myspreadshop.com/");
  });

  it("turns supported YouTube URLs into safe embed URLs", () => {
    expect(getYouTubeEmbedUrl("https://www.youtube.com/watch?v=0pBrQUqU0ig")).toBe("https://www.youtube.com/embed/0pBrQUqU0ig");
    expect(getYouTubeEmbedUrl("https://youtu.be/0pBrQUqU0ig")).toBe("https://www.youtube.com/embed/0pBrQUqU0ig");
    expect(getYouTubeEmbedUrl("https://example.com/video")).toBe("");
  });

  it("keeps platform labels generalized for public link surfaces", () => {
    expect(getPlatformLabel("youtube")).toBe("YouTube");
    expect(getPlatformLabel("substack")).toBe("Substack");
    expect(getPlatformLabel("spreadshop")).toBe("Spreadshop");
  });

  it("recognizes only public-post permalink shapes for Meta embeds", () => {
    expect(DEFAULT_CONTENT_CONFIG.socialPosts).toEqual([]);
    expect(DEFAULT_SOCIAL_FALLBACK_MESSAGE).toContain("main AO social channels");
    expect(getSocialPostPlatform("https://www.facebook.com/anomoriginals/posts/123456789")).toBe("facebook");
    expect(getSocialPostPlatform("https://www.instagram.com/p/C0ffee123/")) .toBe("instagram");
    expect(isEmbedReadySocialUrl("https://www.facebook.com/anomoriginals", "facebook")).toBe(false);
    expect(isEmbedReadySocialUrl("https://www.instagram.com/p/C0ffee123/", "instagram")).toBe(true);
  });
});
