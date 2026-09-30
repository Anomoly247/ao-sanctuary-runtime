import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, Sparkles, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PixelProfile() {
  const [liked, setLiked] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied!");
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-[#1e293b] to-[#0f172a] py-12">
        <div className="absolute inset-0 opacity-30">
          <div
            className="absolute inset-0 blur-3xl"
            style={{ background: "radial-gradient(circle at 50% 50%, #c4b5fd 0%, transparent 70%)" }}
          />
        </div>

        <div className="relative container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            {/* Character Avatar */}
            <div
              className="w-32 h-32 rounded-full mx-auto mb-6 flex items-center justify-center font-bold text-6xl border-4 mb-6"
              style={{
                borderColor: "#c4b5fd",
                background: "linear-gradient(135deg, #c4b5fd40 0%, #c4b5fd20 100%)",
                color: "#c4b5fd",
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)',
              }}
            >
              P
            </div>

            <h1 className="text-5xl font-bold text-white mb-2">Pixel</h1>
            <p className="text-xl text-[#94a3b8] mb-4">The Creator</p>

            <div className="flex justify-center gap-3 mb-6">
              <Badge className="bg-[#c4b5fd] text-black font-bold">Anom's Corner</Badge>
              <Badge className="bg-[#334155] text-[#93c5fd] font-bold">Main Character</Badge>
            </div>

            <p className="text-[#94a3b8] text-lg max-w-xl mx-auto mb-8">
              Pixel is the creative force behind Anom's Corner. With a passion for digital art and neon aesthetics, Pixel brings imagination to life through surreal landscapes and unforgettable adventures.
            </p>

            <div className="flex justify-center gap-3">
              <Button
                onClick={() => setLiked(!liked)}
                className={`${
                  liked
                    ? "bg-[#c4b5fd] text-black hover:bg-[#c4b5fd]/80"
                    : "bg-[#334155] text-[#94a3b8] hover:bg-[#3a3f4e]"
                }`}
              >
                <Heart className={`w-4 h-4 mr-2 ${liked ? "fill-current" : ""}`} />
                {liked ? "Liked" : "Like"}
              </Button>
              <Button
                onClick={handleShare}
                className="bg-[#334155] text-[#94a3b8] hover:bg-[#3a3f4e]"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">
            {/* About */}
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6" style={{ color: "#c4b5fd" }} />
                About Pixel
              </h2>
              <p className="text-[#94a3b8] leading-relaxed mb-4">
                Pixel is a digital artist and visionary who creates immersive neon-powered worlds. With a keen eye for detail and a passion for cyberpunk aesthetics, Pixel crafts experiences that blur the line between reality and imagination.
              </p>
              <p className="text-[#94a3b8] leading-relaxed">
                In Anom's Corner, Pixel serves as the creative guide, leading viewers through surreal landscapes filled with mystery, wonder, and artistic expression. Every frame is carefully designed to evoke emotion and spark curiosity.
              </p>
            </Card>

            {/* Abilities */}
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-6 h-6" style={{ color: "#93c5fd" }} />
                Creative Powers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: "Digital Artistry", level: 95 },
                  { name: "Neon Design", level: 90 },
                  { name: "Storytelling", level: 85 },
                  { name: "Animation", level: 88 },
                  { name: "Color Theory", level: 92 },
                  { name: "Visual Effects", level: 87 },
                ].map((ability) => (
                  <div key={ability.name}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-bold text-white">{ability.name}</span>
                      <span className="text-xs text-[#94a3b8]">{ability.level}%</span>
                    </div>
                    <div className="w-full bg-[#0f172a] rounded-full h-2 border border-[#334155]">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${ability.level}%`,
                          background: "linear-gradient(90deg, #c4b5fd 0%, #93c5fd 100%)",
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Character Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Episodes</span>
                  <span className="font-bold text-[#c4b5fd]">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Appearances</span>
                  <span className="font-bold text-[#c4b5fd]">1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#94a3b8]">Fan Likes</span>
                  <span className="font-bold text-[#c4b5fd]">18</span>
                </div>
              </div>
            </Card>

            {/* Traits */}
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Character Traits</h3>
              <div className="flex flex-wrap gap-2">
                {["Creative", "Visionary", "Artistic", "Curious", "Imaginative"].map((trait) => (
                  <Badge
                    key={trait}
                    className="bg-[#c4b5fd]/20 text-[#c4b5fd] border border-[#c4b5fd]"
                  >
                    {trait}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Related */}
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-lg font-bold text-white mb-4">Related</h3>
              <div className="space-y-2">
                <Button className="w-full bg-[#334155] text-[#94a3b8] hover:bg-[#3a3f4e] justify-start">
                  Partner: Dot
                </Button>
                <Button className="w-full bg-[#334155] text-[#94a3b8] hover:bg-[#3a3f4e] justify-start">
                  View Episodes
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
