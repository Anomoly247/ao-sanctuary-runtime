import { describe, expect, it } from "vitest";
import { DEFAULT_CONTENT_CONFIG, getPlatformLabel, getYouTubeEmbedUrl } from "../client/src/lib/aoContent";

describe("AO content registry", () => {
  it("ships the provided YouTube and Substack destinations", () => {
    expect(DEFAULT_CONTENT_CONFIG.channels.find((channel) => channel.platform === "youtube")?.url).toBe("https://www.youtube.com/@anomoriginals");
    expect(DEFAULT_CONTENT_CONFIG.channels.find((channel) => channel.platform === "facebook")?.url).toBe("https://www.facebook.com/anomoriginals");
    expect(DEFAULT_CONTENT_CONFIG.channels.find((channel) => channel.platform === "substack")?.url).toBe("https://anomorig.substack.com/");
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
});
