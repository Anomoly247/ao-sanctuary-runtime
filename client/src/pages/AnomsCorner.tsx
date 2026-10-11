import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Share2, Heart, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ExternalContentSpots } from "@/components/ExternalContentSpots";

interface Episode {
  id: string;
  character: string;
  title: string;
  videoId?: string;
  storageUrl?: string;
  premiere?: boolean;
  channelUrl?: string;
  accent: "gold" | "cyan";
  duration: string;
  description: string;
  featured?: boolean;
}

const episodes: Episode[] = [
  {
    id: "premiere-room",
    character: "AO Universe",
    title: "AO Premiere Room | Anom Originals",
    premiere: true,
    channelUrl: "https://www.youtube.com/@anomoriginals",
    accent: "gold",
    duration: "New premieres",
    description: "A dedicated doorway for new premieres, creator thoughts, character signals, and the next story moving through Anom’s Corner.",
    featured: true,
  },
  {
    id: "pixel-dot-adventure",
    character: "Pixel & Dot",
    title: "Pixel & Dot's New Adventure | Anom's Corner",
    videoId: "0pBrQUqU0ig",
    accent: "cyan",
    duration: "1:50",
    description: "Join Pixel and Dot on their first adventure in Anom's Corner! Discover their signal-lit world and the mysteries that await.",
  },
  {
    id: "tater-premiere",
    character: "Tater",
    title: "Tater // Character Premiere Slot",
    channelUrl: "https://www.youtube.com/@anomoriginals",
    accent: "gold",
    duration: "Channel premiere",
    description: "A dedicated home for Tater’s cooking, curiosity, and warm-hearted field notes. The slot opens the channel until a verified episode URL is published.",
  },
  {
    id: "clifford-premiere",
    character: "Clifford",
    title: "Clifford // Character Premiere Slot",
    channelUrl: "https://www.youtube.com/@anomoriginals",
    accent: "cyan",
    duration: "Channel premiere",
    description: "A dedicated home for Clifford’s comedy, protection signals, and thoughts from the wild edge. The slot opens the channel until a verified episode URL is published.",
  },
];

export default function AnomsCorner() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(episodes[0]);
  const [liked, setLiked] = useState(false);
  const [mediaError, setMediaError] = useState(false);

  useEffect(() => {
    setMediaError(false);
  }, [selectedEpisode.id]);

  const handleShare = () => {
    const url = selectedEpisode.channelUrl ?? (selectedEpisode.storageUrl 
      ? `${window.location.origin}${selectedEpisode.storageUrl}`
      : `https://www.youtube.com/watch?v=${selectedEpisode.videoId}`);
    navigator.clipboard.writeText(url);
    toast.success("Episode link copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-[#0A0A10]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#141423] to-[#0A0A10] py-12">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #d8ae55 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #00eaff 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span style={{ color: "#d8ae55" }}>Anom</span>
              <span style={{ color: "#00eaff" }}>'s</span>
              <span className="text-white"> Corner</span>
            </h1>
            <p className="text-xl text-[#cccccc] mb-6">
              Character stories, creator thoughts, and premieres from across the AO Universe
            </p>
            <p className="text-[#cccccc] max-w-2xl mx-auto">
              Step into a living universe where every character gets a voice, a signal, and a place to return to.
            </p>
          </div>

          {/* Character Badges */}
          <div className="ao-character-signal-grid mb-12" aria-label="Anom’s Corner character signals">
            {[
              { label: "Pixel", detail: "The Creator", color: "#d8ae55" },
              { label: "Dot", detail: "The Explorer", color: "#00eaff" },
              { label: "Tater", detail: "The Scout", color: "#d8ae55" },
              { label: "Clifford", detail: "The Protector", color: "#00eaff" },
            ].map((character) => <div className="text-center" key={character.label}>
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: character.color,
                  background: `linear-gradient(135deg, ${character.color}20 0%, ${character.color}10 100%)`,
                  color: character.color,
                }}
              >
                {character.label[0]}
              </div>
              <p className="font-bold text-white">{character.label}</p>
              <p className="text-sm text-[#cccccc]">{character.detail}</p>
            </div>)}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="bg-[#000000] border border-[#08080f] overflow-hidden p-6">
              {/* Featured Video Player */}
              <div className="mb-6">
                <div className="relative w-full bg-black rounded-lg overflow-hidden border border-[#08080f]">
                  {selectedEpisode.premiere ? (
                    <div className="ao-premiere-room flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center" role="region" aria-label="AO Premiere Room">
                      <div className="ao-premiere-room-orbit" aria-hidden="true"><Play className="h-8 w-8" /></div>
                      <div>
                        <p className="ao-world-kicker">ANOM ORIGINALS // PREMIERE DOOR</p>
                        <h3 className="mt-2 text-2xl font-bold text-white">The next signal starts here.</h3>
                        <p className="mx-auto mt-2 max-w-md text-sm text-[#cccccc]">Premieres, character thoughts, and new worlds will land in this room as the AO universe grows.</p>
                      </div>
                      <a className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-3" href={selectedEpisode.channelUrl} target="_blank" rel="noreferrer">
                        Visit the Anom Originals YouTube channel <Share2 className="h-4 w-4" />
                      </a>
                    </div>
                  ) : selectedEpisode.storageUrl && !mediaError ? (
                    <video
                      className="w-full h-auto"
                      controls
                      style={{ maxHeight: "600px" }}
                      onError={() => setMediaError(true)}
                    >
                      <source src={selectedEpisode.storageUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : selectedEpisode.videoId ? (
                    <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedEpisode.videoId}`}
                        title={selectedEpisode.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : selectedEpisode.channelUrl ? (
                    <div className={`ao-character-door ao-character-door-${selectedEpisode.accent} flex min-h-72 flex-col items-center justify-center gap-4 p-8 text-center`} role="region" aria-label={`${selectedEpisode.character} character premiere slot`}>
                      <p className="ao-world-kicker">{selectedEpisode.character.toUpperCase()} // CHARACTER SIGNAL</p>
                      <h3 className="text-2xl font-bold text-white">This character has a room here.</h3>
                      <p className="max-w-md text-sm text-[#cccccc]">The verified episode link will appear when the premiere is published. Until then, visit the channel for the latest real release.</p>
                      <a className="btn-secondary inline-flex items-center gap-2 rounded-full px-5 py-3" href={selectedEpisode.channelUrl} target="_blank" rel="noreferrer">
                        Open Anom Originals channel <Share2 className="h-4 w-4" />
                      </a>
                    </div>
                  ) : (
                    <div className="flex min-h-56 items-center justify-center p-8 text-center text-[#cccccc]" role="status">
                      This story video is temporarily unavailable. Please check back soon.
                    </div>
                  )}
                </div>
              </div>

              {/* Episode Info */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">{selectedEpisode.title}</h2>
                  <p className="text-sm text-[#cccccc]">Creature story archive</p>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#cccccc] mb-6 leading-relaxed">{selectedEpisode.description}</p>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                  onClick={() => setLiked(!liked)}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                  {liked ? "Liked" : "Like"}
                </Button>
                <Button
                  className="flex-1 btn-secondary flex items-center justify-center gap-2"
                  onClick={handleShare}
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </Button>
              </div>
            </Card>
          </div>

          {/* Sidebar - Episode List */}
          <div>
            <Card className="bg-[#000000] border border-[#08080f] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Episodes</h3>
              <div className="space-y-3">
                {episodes.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => setSelectedEpisode(episode)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedEpisode.id === episode.id
                        ? "border-[#00eaff] bg-transparent border border-[#00eaff] bg-[#00eaff]/10"
                        : "border-[#08080f] bg-[#0A0A10] hover:border-[#00eaff]"
                    }`}
                  >
                    <p className="text-[0.68rem] uppercase tracking-[0.18em] text-[#d8ae55]">{episode.character}</p>
                    <p className="font-semibold text-white text-sm mb-1">{episode.title}</p>
                    <p className="text-xs text-[#cccccc]">{episode.duration}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Character Links */}
            <Card className="bg-[#000000] border border-[#08080f] p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Meet the Characters</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#00eaff] text-[#d8ae55] hover:bg-[#00eaff]/10"
                  onClick={() => window.location.href = "/characters/pixel"}
                >
                  <span style={{ color: "#d8ae55" }}>→</span> Pixel's Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10"
                  onClick={() => window.location.href = "/characters/dot"}
                >
                  <span style={{ color: "#00eaff" }}>→</span> Dot's Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        <ExternalContentSpots placement="anoms-corner" />
      </div>
    </div>
  );
}
