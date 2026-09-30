export type ContentKind = "video" | "article" | "artwork" | "announcement";
export type ContentPlacement = "library" | "anoms-corner" | "homeworld";
export type ContentStatus = "draft" | "ready" | "published";
export type Platform = "youtube" | "facebook" | "instagram" | "linkedin" | "substack" | "spreadshop";

export type ContentEntry = {
  id: string;
  title: string;
  kind: ContentKind;
  placement: ContentPlacement;
  platform: Platform;
  url: string;
  description: string;
  status: ContentStatus;
  featured: boolean;
  ageTier: string;
};

export type PlatformChannel = {
  platform: Platform;
  label: string;
  url: string;
  status: "ready" | "needs-link";
  note: string;
};

export type SocialPost = {
  id: string;
  platform: "facebook" | "instagram";
  url: string;
  title: string;
  caption: string;
  fallbackMessage: string;
  status: "draft" | "published";
  featured: boolean;
};

export type ShopOffer = {
  id: string;
  title: string;
  type: "spreadshop" | "service" | "digital";
  url: string;
  description: string;
  status: "featured" | "draft";
};

export type AOContentConfig = {
  entries: ContentEntry[];
  channels: PlatformChannel[];
  socialPosts: SocialPost[];
  offers: ShopOffer[];
};

export const AO_CONTENT_STORAGE_KEY = "ao-admin-content-v1";
export const DEFAULT_SOCIAL_FALLBACK_MESSAGE = "This post is resting outside the Sanctuary right now. Follow the main AO social channels for the newest signal.";

export const DEFAULT_CONTENT_CONFIG: AOContentConfig = {
  entries: [
    {
      id: "anoms-corner-pixel-dot",
      title: "Pixel & Dot's New Adventure",
      kind: "video",
      placement: "anoms-corner",
      platform: "youtube",
      url: "https://www.youtube.com/watch?v=0pBrQUqU0ig",
      description: "A gentle doorway into Anom's Corner and the first Pixel & Dot adventure.",
      status: "published",
      featured: true,
      ageTier: "All ages",
    },
    {
      id: "library-video-orchard",
      title: "The Video Orchard is gathering",
      kind: "video",
      placement: "library",
      platform: "youtube",
      url: "",
      description: "Add a YouTube lesson, interview, or making-of video from the Admin Hub.",
      status: "draft",
      featured: true,
      ageTier: "All ages",
    },
  ],
  channels: [
    { platform: "youtube", label: "YouTube channel", url: "https://www.youtube.com/@anomoriginals", status: "ready", note: "Video Orchard and Anom's Corner embeds" },
    { platform: "facebook", label: "Facebook page", url: "https://www.facebook.com/anomoriginals", status: "ready", note: "Community updates and live moments" },
    { platform: "instagram", label: "Instagram", url: "", status: "needs-link", note: "Art drops, emotes, and short-form motion" },
    { platform: "linkedin", label: "LinkedIn", url: "", status: "needs-link", note: "Design services and professional work" },
    { platform: "substack", label: "Substack publication", url: "https://anomorig.substack.com/", status: "ready", note: "Long-form lore, lessons, and behind the scenes" },
    { platform: "spreadshop", label: "Spreadshop", url: "https://anomoriginals.myspreadshop.com/", status: "ready", note: "Official products and collections" },
  ],
  socialPosts: [],
  offers: [
    { id: "spreadshop-ao-collection", title: "AO Originals collection", type: "spreadshop", url: "https://anomoriginals.myspreadshop.com/", description: "Wearable art and world signals from the Archive.", status: "featured" },
    { id: "custom-world-design", title: "Custom world and identity design", type: "service", url: "", description: "Design a living identity space, character system, or creative world for a client.", status: "featured" },
  ],
};

export function readAOContentConfig(): AOContentConfig {
  if (typeof window === "undefined") return DEFAULT_CONTENT_CONFIG;
  try {
    const stored = window.localStorage.getItem(AO_CONTENT_STORAGE_KEY);
    if (!stored) return DEFAULT_CONTENT_CONFIG;
    const parsed = JSON.parse(stored) as Partial<AOContentConfig>;
    return {
      entries: parsed.entries?.length ? parsed.entries : DEFAULT_CONTENT_CONFIG.entries,
      channels: DEFAULT_CONTENT_CONFIG.channels.map((fallback) => {
        const saved = parsed.channels?.find((channel) => channel.platform === fallback.platform);
        if (!saved) return fallback;
        const url = saved.url || fallback.url;
        return { ...fallback, ...saved, url, status: url ? "ready" : saved.status };
      }),
      socialPosts: (parsed.socialPosts || DEFAULT_CONTENT_CONFIG.socialPosts).map((post) => ({ ...post, fallbackMessage: post.fallbackMessage || DEFAULT_SOCIAL_FALLBACK_MESSAGE })),
      offers: DEFAULT_CONTENT_CONFIG.offers.map((fallback) => {
        const saved = parsed.offers?.find((offer) => offer.id === fallback.id);
        if (!saved) return fallback;
        return { ...fallback, ...saved, url: saved.url || fallback.url };
      }),
    };
  } catch {
    return DEFAULT_CONTENT_CONFIG;
  }
}

export function writeAOContentConfig(config: AOContentConfig) {
  if (typeof window !== "undefined") window.localStorage.setItem(AO_CONTENT_STORAGE_KEY, JSON.stringify(config));
}

export function getYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/i);
  return match?.[1] ? `https://www.youtube.com/embed/${match[1]}` : "";
}

export function getPlatformLabel(platform: Platform) {
  return {
    youtube: "YouTube",
    facebook: "Facebook",
    instagram: "Instagram",
    linkedin: "LinkedIn",
    substack: "Substack",
    spreadshop: "Spreadshop",
  }[platform];
}

export function getSocialPostPlatform(url: string): SocialPost["platform"] | "" {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
    const path = parsed.pathname.toLowerCase();
    if (host === "facebook.com" && /(posts|reel|share|story|permalink)/.test(path)) return "facebook";
    if (host === "instagram.com" && /\/(p|reel|tv|share)\//.test(path)) return "instagram";
  } catch {
    return "";
  }
  return "";
}

export function isEmbedReadySocialUrl(url: string, platform: SocialPost["platform"]) {
  return getSocialPostPlatform(url) === platform;
}
