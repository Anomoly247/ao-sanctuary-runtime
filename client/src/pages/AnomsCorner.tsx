import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Share2, Heart, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { ExternalContentSpots } from "@/components/ExternalContentSpots";

interface Episode {
  id: string;
  title: string;
  videoId?: string;
  storageUrl?: string;
  duration: string;
  description: string;
  featured?: boolean;
}

const episodes: Episode[] = [
  {
    id: "1",
    title: "Pixel & Dot's Full Story | Anom's Corner",
    storageUrl: "/manus-storage/v8_pixel_dot_full_story_final_45228357.mp4",
    duration: "Full Story",
    description: "The complete Pixel & Dot story. Join these two characters on their epic journey through a signal-lit universe filled with mystery, wonder, and unforgettable moments. This is the definitive Anom's Corner experience.",
    featured: true,
  },
  {
    id: "2",
    title: "Pixel & Dot's New Adventure | Anom's Corner",
    videoId: "0pBrQUqU0ig",
    duration: "1:50",
    description: "Join Pixel and Dot on their first adventure in Anom's Corner! Discover their signal-lit world and the mysteries that await.",
  },
];

export default function AnomsCorner() {
  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(episodes[0]);
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    const url = selectedEpisode.storageUrl 
      ? `${window.location.origin}${selectedEpisode.storageUrl}`
      : `https://www.youtube.com/watch?v=${selectedEpisode.videoId}`;
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
              Digital Storybooks featuring <span style={{ color: "#d8ae55" }}>Pixel</span> & <span style={{ color: "#00eaff" }}>Dot</span>
            </p>
            <p className="text-[#cccccc] max-w-2xl mx-auto">
              Step into a living universe where two characters navigate surreal landscapes, uncover mysteries, and create unforgettable moments.
            </p>
          </div>

          {/* Character Badges */}
          <div className="flex justify-center gap-6 mb-12">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: "#d8ae55",
                  background: "linear-gradient(135deg, #d8ae5520 0%, #d8ae5510 100%)",
                  color: "#d8ae55",
                }}
              >
                P
              </div>
              <p className="font-bold text-white">Pixel</p>
              <p className="text-sm text-[#cccccc]">The Creator</p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: "#00eaff",
                  background: "linear-gradient(135deg, #00eaff20 0%, #00eaff10 100%)",
                  color: "#00eaff",
                }}
              >
                D
              </div>
              <p className="font-bold text-white">Dot</p>
              <p className="text-sm text-[#cccccc]">The Explorer</p>
            </div>
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
                  {selectedEpisode.storageUrl ? (
                    <video
                      className="w-full h-auto"
                      controls
                      style={{ maxHeight: "600px" }}
                    >
                      <source src={selectedEpisode.storageUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <div className="relative w-full bg-black rounded-lg overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedEpisode.videoId}`}
                        title={selectedEpisode.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
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
