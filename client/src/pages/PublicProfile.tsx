import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Copy, Heart, Trophy, Zap, Star, Shield, Sparkles, Award, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useParams, useLocation } from "wouter";

export default function PublicProfile() {
  const { userId } = useParams<{ userId: string }>();
  const [, navigate] = useLocation();
  const [copied, setCopied] = useState(false);

  // Fetch public profile data
  const { data: profile, isLoading } = trpc.profile.getPublic.useQuery(
    { userId: parseInt(userId || "0") },
    { enabled: !!userId }
  );

  // Fetch achievements
  const { data: achievements = [] } = trpc.achievement.getUserAchievements.useQuery(
    undefined,
    { enabled: !!userId }
  );

  // Fetch decorations
  const { data: decorations = [] } = trpc.decorations.list.useQuery();

  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/profile/${userId}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("Profile link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/profile/${userId}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile?.name}'s Anom Artsy Profile`,
          text: `Check out ${profile?.name}'s profile on Anom Artsy!`,
          url: shareUrl,
        });
      } catch (err) {
        toast.error("Share failed");
      }
    } else {
      handleCopyLink();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#93c5fd]">Loading profile...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#c4b5fd] text-xl mb-4">Profile not found</p>
          <Button className="btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#93c5fd]">
      {/* Navigation */}
      <nav className="border-b border-[#334155] px-6 py-4 sticky top-0 bg-[#0f172a]/95 backdrop-blur z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate("/")} className="text-[#94a3b8] flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold text-accent">{profile.name}'s Profile</h1>
          <Button variant="ghost" className="text-[#93c5fd]" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Profile Header */}
        <Card
          className="bg-[#1e293b] border border-[#334155] p-8 mb-8"
          style={{
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.28)",
          }}
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#c4b5fd] to-[#93c5fd] flex items-center justify-center text-3xl">
                {profile.avatarUrl || "👤"}
              </div>
              <div>
                <h2 className="text-3xl font-bold text-[#c4b5fd] mb-2">{profile.name}</h2>
                <p className="text-[#94a3b8] mb-4">{profile.bio || "No bio yet"}</p>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    className="text-[#93c5fd] border-[#334155] gap-2"
                    onClick={handleCopyLink}
                  >
                    <Copy className="w-4 h-4" />
                    {copied ? "Copied!" : "Copy Link"}
                  </Button>
                  <Button className="btn-secondary gap-2" onClick={handleShare}>
                    <Share2 className="w-4 h-4" />
                    Share Profile
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card
            className="bg-[#1e293b] border border-[#334155] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Anom Coins</p>
                <p className="text-3xl font-bold text-[#c4b5fd]">{profile.coins || 0}</p>
              </div>
              <Zap className="w-8 h-8 text-[#c4b5fd] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1e293b] border border-[#334155] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Level</p>
                <p className="text-3xl font-bold text-[#93c5fd]">{profile.level || 1}</p>
              </div>
              <Trophy className="w-8 h-8 text-[#93c5fd] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1e293b] border border-[#334155] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Achievements</p>
                <p className="text-3xl font-bold text-[#a5b4fc]">{achievements.length || 0}</p>
              </div>
              <Heart className="w-8 h-8 text-[#a5b4fc] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Achievements Section */}
        {achievements && achievements.length > 0 && (
          <Card
            className="bg-[#1e293b] border border-[#334155] p-6 mb-8"
            style={{
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.22)",
            }}
          >
            <h3 className="text-xl font-bold text-[#a5b4fc] mb-6 flex items-center gap-2">
              <Award className="w-5 h-5" />
              Achievements & Awards
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement: any) => (
                <div key={achievement.id} className="p-4 bg-[#0f172a] rounded-lg border border-[#334155] hover:border-[#c4b5fd] transition-colors">
                  <div className="text-3xl mb-2">{achievement.icon || "🏆"}</div>
                  <p className="text-[#93c5fd] font-bold text-sm">{achievement.name}</p>
                  <p className="text-[#94a3b8] text-xs">{achievement.description}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Decorations & Cosmetics Section */}
        {decorations && decorations.length > 0 && (
          <Card
            className="bg-[#1e293b] border border-[#334155] p-6 mb-8"
            style={{
              boxShadow: "0 6px 18px rgba(15, 23, 42, 0.22)",
            }}
          >
            <h3 className="text-xl font-bold text-[#a5b4fc] mb-6 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Cosmetics & Decorations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {decorations.map((decoration: any) => (
                <div key={decoration.id} className="p-4 bg-[#0f172a] rounded-lg border border-[#334155] hover:border-[#c4b5fd] transition-colors cursor-pointer">
                  <div className="text-3xl mb-2">{decoration.icon || "✨"}</div>
                  <p className="text-[#93c5fd] font-bold text-sm">{decoration.name}</p>
                  <p className="text-[#94a3b8] text-xs">{decoration.type || "Cosmetic"}</p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Mood Glows Section */}
        <Card
          className="bg-[#1e293b] border border-[#334155] p-6 mb-8"
          style={{
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.22)",
          }}
        >
          <h3 className="text-xl font-bold text-[#93c5fd] mb-4 flex items-center gap-2">
            <Star className="w-5 h-5" />
            Mood Glows
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {["😊", "🔥", "💜", "✨", "🌈", "💫"].map((emoji, i) => (
              <div key={i} className="p-3 bg-[#0f172a] rounded-lg border border-[#334155] text-center hover:scale-110 transition-transform cursor-pointer">
                <div className="text-2xl">{emoji}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Themes Section */}
        <Card
          className="bg-[#1e293b] border border-[#334155] p-6 mb-8"
          style={{
            boxShadow: "0 6px 18px rgba(15, 23, 42, 0.22)",
          }}
        >
          <h3 className="text-xl font-bold text-[#c4b5fd] mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Themes
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-[#c4b5fd] to-[#a5b4fc] rounded-lg border-2 border-[#c4b5fd] text-center cursor-pointer hover:scale-105 transition-transform">
              <p className="text-white font-bold">Magenta Dream</p>
              <p className="text-white text-xs opacity-75">Active</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[#93c5fd] to-[#0099ff] rounded-lg border border-[#334155] text-center hover:border-[#93c5fd] transition-colors cursor-pointer hover:scale-105">
              <p className="text-white font-bold">Cyan Wave</p>
              <p className="text-white text-xs opacity-75">Available</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[#a5b4fc] to-[#c4b5fd] rounded-lg border border-[#334155] text-center hover:border-[#a5b4fc] transition-colors cursor-pointer hover:scale-105">
              <p className="text-white font-bold">Purple Haze</p>
              <p className="text-white text-xs opacity-75">Available</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-[#00ff88] to-[#93c5fd] rounded-lg border border-[#334155] text-center hover:border-[#00ff88] transition-colors cursor-pointer hover:scale-105">
              <p className="text-white font-bold">Green</p>
              <p className="text-white text-xs opacity-75">Available</p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
