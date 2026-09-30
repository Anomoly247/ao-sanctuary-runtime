import { ArrowUpRight, BookOpen, Facebook, Instagram, Youtube } from "lucide-react";
import { useMemo } from "react";
import { readAOContentConfig, Platform } from "@/lib/aoContent";

const iconFor: Partial<Record<Platform, typeof Youtube>> = { youtube: Youtube, facebook: Facebook, instagram: Instagram, substack: BookOpen };

export default function ExternalWebDoor() {
  const channels = useMemo(() => readAOContentConfig().channels.filter((channel) => ["youtube", "facebook", "instagram", "substack"].includes(channel.platform) && channel.url), []);
  return (
    <div className="ao-public-door">
      <div className="ao-public-door-copy">
        <span className="ao-public-door-kicker">THE DOOR IS OPEN</span>
        <h2>Explore first. Sign in only when you want to save your signal.</h2>
        <p>Start as a guest, follow the worlds, and find Anom Originals wherever the work is moving.</p>
      </div>
      <div className="ao-public-door-links" aria-label="Anom Originals web destinations">
        <a className="ao-public-door-enter" href="/games">Enter the universe <ArrowUpRight className="h-4 w-4" /></a>
        {channels.map((channel) => {
          const Icon = iconFor[channel.platform] || BookOpen;
          return <a key={channel.platform} href={channel.url} target="_blank" rel="noreferrer"><Icon className="h-4 w-4" /> {channel.label.replace(" channel", "").replace(" publication", "")} <ArrowUpRight className="h-3 w-3" /></a>;
        })}
      </div>
    </div>
  );
}
