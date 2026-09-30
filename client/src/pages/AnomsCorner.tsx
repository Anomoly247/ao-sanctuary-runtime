import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Share2, Heart, Star, Zap } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface Episode {
  id: string;
  title: string;
  videoId?: string;
  storageUrl?: string;
  duration: string;
  views: number;
  postedAt: string;
  description: string;
  featured?: boolean;
}

const episodes: Episode[] = [
  {
    id: "1",
    title: "Pixel & Dot's Full Story | Anom's Corner",
    storageUrl: "/manus-storage/v8_pixel_dot_full_story_final_45228357.mp4",
    duration: "Full Story",
    views: 1,
    postedAt: "Today",
    description: "The complete Pixel & Dot story. Join these two characters on their epic journey through a neon-powered universe filled with mystery, wonder, and unforgettable moments. This is the definitive Anom's Corner experience.",
    featured: true,
  },
  {
    id: "2",
    title: "Pixel & Dot's New Adventure | Anom's Corner",
    videoId: "0pBrQUqU0ig",
    duration: "1:50",
    views: 18,
    postedAt: "1 month ago",
    description: "Join Pixel and Dot on their first adventure in Anom's Corner! Discover their neon-powered world and the mysteries that await.",
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
    <div className="min-h-screen bg-[#0f172a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1e293b] to-[#0f172a] py-12">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #c4b5fd 0%, transparent 70%)" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl"
            style={{ background: "radial-gradient(circle, #93c5fd 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              <span style={{ color: "#c4b5fd" }}>Anom</span>
              <span style={{ color: "#93c5fd" }}>'s</span>
              <span className="text-white"> Corner</span>
            </h1>
            <p className="text-xl text-[#94a3b8] mb-6">
              Digital Storybooks featuring <span style={{ color: "#c4b5fd" }}>Pixel</span> & <span style={{ color: "#93c5fd" }}>Dot</span>
            </p>
            <p className="text-[#94a3b8] max-w-2xl mx-auto">
              Step into a neon-powered universe where two characters navigate surreal landscapes, uncover mysteries, and create unforgettable moments.
            </p>
          </div>

          {/* Character Badges */}
          <div className="flex justify-center gap-6 mb-12">
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: "#c4b5fd",
                  background: "linear-gradient(135deg, #c4b5fd20 0%, #c4b5fd10 100%)",
                  color: "#c4b5fd",
                }}
              >
                P
              </div>
              <p className="font-bold text-white">Pixel</p>
              <p className="text-sm text-[#94a3b8]">The Creator</p>
            </div>

            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center font-bold text-2xl border-2"
                style={{
                  borderColor: "#93c5fd",
                  background: "linear-gradient(135deg, #93c5fd20 0%, #93c5fd10 100%)",
                  color: "#93c5fd",
                }}
              >
                D
              </div>
              <p className="font-bold text-white">Dot</p>
              <p className="text-sm text-[#94a3b8]">The Explorer</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card className="bg-[#1e293b] border border-[#334155] overflow-hidden p-6">
              {/* Featured Video Player */}
              <div className="mb-6">
                <div className="relative w-full bg-black rounded-lg overflow-hidden border border-[#334155]">
                  {selectedEpisode.storageUrl ? (
                    <video
                      className="w-full h-auto"
                      controls
                      autoPlay
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
                  <div className="flex items-center gap-4 text-sm text-[#94a3b8]">
                    <span>{selectedEpisode.views} views</span>
                    <span>•</span>
                    <span>{selectedEpisode.postedAt}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-[#94a3b8] mb-6 leading-relaxed">{selectedEpisode.description}</p>

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
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-xl font-bold text-white mb-4">Episodes</h3>
              <div className="space-y-3">
                {episodes.map((episode) => (
                  <button
                    key={episode.id}
                    onClick={() => setSelectedEpisode(episode)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedEpisode.id === episode.id
                        ? "border-[#c4b5fd] bg-[#c4b5fd]/10"
                        : "border-[#334155] bg-[#0f172a] hover:border-[#c4b5fd]"
                    }`}
                  >
                    <p className="font-semibold text-white text-sm mb-1">{episode.title}</p>
                    <p className="text-xs text-[#94a3b8]">{episode.duration}</p>
                  </button>
                ))}
              </div>
            </Card>

            {/* Series Stats */}
            <Card className="bg-[#1e293b] border border-[#334155] p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Series Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[#94a3b8] text-sm">Episodes</span>
                  <span className="text-[#c4b5fd] font-bold">{episodes.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94a3b8] text-sm">Total Views</span>
                  <span className="text-[#93c5fd] font-bold">{episodes.reduce((a, b) => a + b.views, 0)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#94a3b8] text-sm">Featured</span>
                  <Badge className="bg-[#c4b5fd] text-white">New</Badge>
                </div>
              </div>
            </Card>

            {/* Character Links */}
            <Card className="bg-[#1e293b] border border-[#334155] p-6 mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Meet the Characters</h3>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#c4b5fd] text-[#c4b5fd] hover:bg-[#c4b5fd]/10"
                  onClick={() => window.location.href = "/characters/pixel"}
                >
                  <span style={{ color: "#c4b5fd" }}>→</span> Pixel's Profile
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start border-[#93c5fd] text-[#93c5fd] hover:bg-[#93c5fd]/10"
                  onClick={() => window.location.href = "/characters/dot"}
                >
                  <span style={{ color: "#93c5fd" }}>→</span> Dot's Profile
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
