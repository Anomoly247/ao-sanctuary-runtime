import { useEffect, useState } from "react";
import { ArrowUpRight, Facebook, Instagram, Linkedin, Play, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentEntry, getPlatformLabel, getYouTubeEmbedUrl, PlatformChannel, readAOContentConfig } from "@/lib/aoContent";

function PlatformIcon({ platform }: { platform: string }) {
  if (platform === "facebook") return <Facebook className="h-4 w-4" />;
  if (platform === "instagram") return <Instagram className="h-4 w-4" />;
  if (platform === "linkedin") return <Linkedin className="h-4 w-4" />;
  return <Video className="h-4 w-4" />;
}

function ChannelLinks({ channels }: { channels: PlatformChannel[] }) {
  return (
    <div className="ao-external-channel-row" aria-label="Connected social channels">
      {channels.filter((channel) => channel.url).map((channel) => (
        <a href={channel.url} target="_blank" rel="noreferrer" key={channel.platform} className="ao-external-channel-link">
          <PlatformIcon platform={channel.platform} /> {getPlatformLabel(channel.platform)} <ArrowUpRight className="h-3 w-3" />
        </a>
      ))}
    </div>
  );
}

function VideoSpot({ entry }: { entry: ContentEntry }) {
  const embedUrl = entry.platform === "youtube" ? getYouTubeEmbedUrl(entry.url) : "";
  return (
    <article className="ao-external-video-card">
      <div className="ao-external-video-frame">
        {embedUrl ? (
          <iframe src={embedUrl} title={entry.title} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <div className="ao-external-video-placeholder"><Play className="h-7 w-7" /><span>Video spot ready for your next {getPlatformLabel(entry.platform)} upload</span></div>
        )}
      </div>
      <div className="ao-external-video-copy">
        <span className="ao-external-eyebrow">{getPlatformLabel(entry.platform)} · {entry.ageTier}</span>
        <h3>{entry.title}</h3>
        <p>{entry.description}</p>
        {entry.url && <a href={entry.url} target="_blank" rel="noreferrer">Open source video <ArrowUpRight className="inline h-3 w-3" /></a>}
      </div>
    </article>
  );
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

  return (
    <section className="ao-external-spots" aria-labelledby={`${placement}-external-title`}>
      <div className="ao-section-heading">
        <div>
          <p className="ao-world-kicker">CONNECTED SIGNALS // {placement === "library" ? "VIDEO ORCHARD" : "ANOM'S CORNER"}</p>
          <h2 id={`${placement}-external-title`}>{placement === "library" ? "Bring in the wider conversation." : "A living window into the Corner."}</h2>
        </div>
        <p>{placement === "library" ? "YouTube, social notes, and long-form trails can gather here." : "Episodes, art drops, and platform moments can meet in one safe doorway."}</p>
      </div>
      <div className="ao-external-spots-grid">
        {visibleEntry && <VideoSpot entry={visibleEntry} />}
        <aside className="ao-external-channel-card">
          <div className="ao-external-channel-icon"><Video className="h-5 w-5" /></div>
          <span className="ao-external-eyebrow">THE OUTER ORBIT</span>
          <h3>One home base, many ways in.</h3>
          <p>Connect your channels in the Admin Hub and reuse the same story across video, social, newsletter, and shop worlds.</p>
          <ChannelLinks channels={channels} />
          <Button type="button" className="btn-secondary" onClick={() => window.location.href = "/admin-hub"}>Open Admin Hub</Button>
        </aside>
      </div>
    </section>
  );
}
