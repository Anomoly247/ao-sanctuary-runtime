import { useEffect, useState } from "react";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Play, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentEntry, getPlatformLabel, getYouTubeEmbedUrl, isEmbedReadySocialUrl, PlatformChannel, readAOContentConfig, SocialPost } from "@/lib/aoContent";

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "facebook") return <Facebook className="h-4 w-4" />;
  if (platform === "instagram") return <Instagram className="h-4 w-4" />;
  if (platform === "linkedin") return <Linkedin className="h-4 w-4" />;
  return <Video className="h-4 w-4" />;
}

function ChannelLinks({ channels }: { channels: PlatformChannel[] }) {
  return <div className="ao-external-channel-row" aria-label="Connected social channels">{channels.filter((channel) => channel.url).map((channel) => <a href={channel.url} target="_blank" rel="noreferrer" key={channel.platform} className="ao-external-channel-link"><PlatformIcon platform={channel.platform} /> {getPlatformLabel(channel.platform)} <ArrowUpRight className="h-3 w-3" /></a>)}</div>;
}

function VideoSpot({ entry }: { entry: ContentEntry }) {
  const embedUrl = entry.platform === "youtube" ? getYouTubeEmbedUrl(entry.url) : "";
  return <article className="ao-external-video-card"><div className="ao-external-video-frame">{embedUrl ? <iframe src={embedUrl} title={entry.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /> : <div className="ao-external-video-placeholder"><Play className="h-7 w-7" /><span>Video spot ready for your next {getPlatformLabel(entry.platform)} upload</span></div>}</div><div className="ao-external-video-copy"><span className="ao-external-eyebrow">{getPlatformLabel(entry.platform)} · {entry.ageTier}</span><h3>{entry.title}</h3><p>{entry.description}</p>{entry.url && <a href={entry.url} target="_blank" rel="noreferrer">Open source video <ArrowUpRight className="inline h-3 w-3" /></a>}</div></article>;
}

function loadMetaEmbedScripts(needsFacebook: boolean, needsInstagram: boolean) {
  if (needsFacebook && !document.querySelector("script[data-ao-facebook-sdk]")) {
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.dataset.aoFacebookSdk = "true";
    document.body.appendChild(script);
  }
  if (needsInstagram && !document.querySelector("script[data-ao-instagram-embed]")) {
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.instagram.com/embed.js";
    script.dataset.aoInstagramEmbed = "true";
    document.body.appendChild(script);
  }
}

export function useSocialEmbedScripts(posts: SocialPost[]) {
  const signature = posts.map((post) => `${post.id}:${post.platform}:${post.url}`).join("|");
  useEffect(() => {
    if (!posts.length) return;
    loadMetaEmbedScripts(posts.some((post) => post.platform === "facebook"), posts.some((post) => post.platform === "instagram"));
    const process = () => {
      const instagram = (window as Window & { instgrm?: { Embeds?: { process: () => void } } }).instgrm;
      instagram?.Embeds?.process();
      const facebook = (window as Window & { FB?: { XFBML?: { parse: () => void } } }).FB;
      facebook?.XFBML?.parse();
    };
    const timer = window.setTimeout(process, 900);
    return () => window.clearTimeout(timer);
  }, [signature]);
}

export function SocialPostEmbed({ post, profileChannels = [] }: { post: SocialPost; profileChannels?: PlatformChannel[] }) {
  useSocialEmbedScripts([post]);
  const valid = isEmbedReadySocialUrl(post.url, post.platform);
  if (!valid) return <article className="ao-social-post-fallback"><div className="ao-social-post-fallback-icon">{post.platform === "facebook" ? <Facebook className="h-5 w-5" /> : <Instagram className="h-5 w-5" />}</div><div><span className="ao-external-eyebrow">{post.platform} signal</span><h4>{post.title}</h4><p>{post.fallbackMessage || post.caption}</p><div className="ao-social-fallback-links">{profileChannels.filter((channel) => ["facebook", "instagram", "youtube"].includes(channel.platform) && channel.url).map((channel) => <a href={channel.url} target="_blank" rel="noreferrer" key={channel.platform}>Visit {getPlatformLabel(channel.platform)} <ArrowUpRight className="inline h-3 w-3" /></a>)}</div>{post.url && <a href={post.url} target="_blank" rel="noreferrer">Open source post <ArrowUpRight className="inline h-3 w-3" /></a>}</div></article>;
  if (post.platform === "facebook") return <article className="ao-social-post-card"><div className="fb-post" data-href={post.url} data-width="500" data-show-text="true" data-lazy="true" /><div className="ao-social-post-copy"><h4>{post.title}</h4>{post.caption && <p>{post.caption}</p>}<a href={post.url} target="_blank" rel="noreferrer">Open on Facebook <ArrowUpRight className="inline h-3 w-3" /></a></div></article>;
  return <article className="ao-social-post-card"><blockquote className="instagram-media" data-instgrm-permalink={post.url} data-instgrm-version="14"><a href={post.url} target="_blank" rel="noreferrer">View this post on Instagram</a></blockquote><div className="ao-social-post-copy"><h4>{post.title}</h4>{post.caption && <p>{post.caption}</p>}<a href={post.url} target="_blank" rel="noreferrer">Open on Instagram <ArrowUpRight className="inline h-3 w-3" /></a></div></article>;
}

function SocialPostCollection({ posts, channels }: { posts: SocialPost[]; channels: PlatformChannel[] }) {
  const visiblePosts = posts.filter((post) => post.status === "published" && post.featured);
  useSocialEmbedScripts(visiblePosts);
  if (!visiblePosts.length) return null;
  return <section className="ao-social-post-collection" aria-labelledby="ao-social-posts-title"><div className="ao-section-heading"><div><p className="ao-world-kicker">SOCIAL CONSTELLATION // PUBLIC POSTS</p><h2 id="ao-social-posts-title">The Corner keeps moving.</h2></div><p>Official public posts from the Anom Originals orbit, gathered without turning the Sanctuary into a scroll feed.</p></div><div className="ao-social-post-grid">{visiblePosts.map((post) => <SocialPostEmbed key={post.id} post={post} profileChannels={channels} />)}</div></section>;
}

export function ExternalContentSpots({ placement }: { placement: "library" | "anoms-corner" }) {
  const [config, setConfig] = useState(readAOContentConfig);
  useEffect(() => {
    const onStorage = () => setConfig(readAOContentConfig());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  const entries = config.entries.filter((entry) => entry.placement === placement && entry.status !== "draft");
  const channels = config.channels.filter((channel) => ["youtube", "facebook", "instagram", "linkedin"].includes(channel.platform));
  const fallback = config.entries.find((entry) => entry.placement === placement) || config.entries[0];
  const visibleEntry = entries[0] || fallback;
  return <section className="ao-external-spots" aria-labelledby={`${placement}-external-title`}><div className="ao-section-heading"><div><p className="ao-world-kicker">CONNECTED SIGNALS // {placement === "library" ? "VIDEO ORCHARD" : "ANOM'S CORNER"}</p><h2 id={`${placement}-external-title`}>{placement === "library" ? "Bring in the wider conversation." : "A living window into the Corner."}</h2></div><p>{placement === "library" ? "YouTube, social notes, and long-form trails can gather here." : "Episodes, art drops, and platform moments can meet in one safe doorway."}</p></div><div className="ao-external-spots-grid">{visibleEntry && <VideoSpot entry={visibleEntry} />}<aside className="ao-external-channel-card"><div className="ao-external-channel-icon"><Video className="h-5 w-5" /></div><span className="ao-external-eyebrow">THE OUTER ORBIT</span><h3>One home base, many ways in.</h3><p>Connect your channels in the Admin Hub and reuse the same story across video, social, newsletter, and shop worlds.</p><ChannelLinks channels={channels} /><Button type="button" className="btn-secondary" onClick={() => window.location.href = "/admin-hub"}>Open Admin Hub</Button></aside></div>{placement === "anoms-corner" && <SocialPostCollection posts={config.socialPosts} channels={channels} />}</section>;
}
