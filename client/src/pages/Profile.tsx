import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { User, Zap, Award, Palette, Settings, LogOut, Edit2, Save, Share2, Copy, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import ProfilePhotoManager from "@/components/ProfilePhotoManager";
import IdentitySyncCard from "@/components/IdentitySyncCard";
import { useAuth } from "@/_core/hooks/useAuth";

const THEME_OPTIONS = [
  { id: "magenta", name: "Neon Magenta", color: "#c4b5fd", preview: "🌸" },
  { id: "cyan", name: "Neon Cyan", color: "#93c5fd", preview: "💎" },
  { id: "purple", name: "Neon Purple", color: "#b000ff", preview: "👾" },
];

const NAME_COLORS = [
  { id: "#ffffff", name: "White", color: "#ffffff" },
  { id: "#c4b5fd", name: "Magenta", color: "#c4b5fd" },
  { id: "#93c5fd", name: "Cyan", color: "#93c5fd" },
  { id: "#b000ff", name: "Purple", color: "#b000ff" },
  { id: "#ffd700", name: "Gold (VIP)", color: "#ffd700" },
  { id: "#c0c0c0", name: "Silver (VIP Max)", color: "#c0c0c0" },
];

export default function Profile() {
  const { user, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"dashboard" | "customize" | "settings" | "share">("dashboard");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string>("magenta");
  const [selectedNameColor, setSelectedNameColor] = useState<string>("#93c5fd");
  const [copied, setCopied] = useState(false);
  const [editData, setEditData] = useState({
    name: user?.name || "",
    bio: "",
  });

  // Fetch user profile with error handling
  const { data: profile, isLoading: profileLoading, error: profileError } = trpc.profile.getMe.useQuery(undefined, {
    enabled: !!user,
  });

  // Load settings when profile loads
  useEffect(() => {
    if (profile?.neonTheme) setSelectedTheme(profile.neonTheme);
    if (profile?.nameColor) setSelectedNameColor(profile.nameColor);
    if (profile?.bio) setEditData(prev => ({ ...prev, bio: profile.bio || "" }));
  }, [profile]);

  // Mutations
  const updateThemeMutation = trpc.settings.updateTheme.useMutation();
  const updateNameColorMutation = trpc.settings.updateNameColor.useMutation();
  const updateBioMutation = trpc.settings.updateBio.useMutation();

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#93c5fd] flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Show error state if profile fails to load
  if (profileError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] flex items-center justify-center p-4">
        <Card className="border-2 border-[#c4b5fd] bg-[#0f172a]/80 p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-[#c4b5fd]" />
            <h2 className="text-xl font-bold text-[#c4b5fd]">Unable to Load Profile</h2>
          </div>
          <p className="text-[#94a3b8] text-sm mb-6">
            We're having trouble connecting to your profile data. This might be a temporary issue. Please try again later or contact support if the problem persists.
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={() => window.location.reload()} 
              className="flex-1 bg-[#93c5fd] hover:bg-[#93c5fd]/80 text-black font-bold"
            >
              Retry
            </Button>
            <Button 
              onClick={() => navigate("/")} 
              className="flex-1 bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black font-bold"
            >
              Go Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#93c5fd] flex items-center justify-center">
        <Card className="border-2 border-[#c4b5fd] bg-[#0f172a]/80 p-8">
          <p className="text-[#c4b5fd] mb-4">Please sign in to view your profile</p>
          <Button onClick={() => navigate("/")} className="bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black">
            Go to Home
          </Button>
        </Card>
      </div>
    );
  }

  const handleUpdateProfile = async () => {
    try {
      await updateBioMutation.mutateAsync({
        bio: editData.bio,
      });
      toast.success("Profile updated!");
      setIsEditingProfile(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    try {
      await updateThemeMutation.mutateAsync({ theme: theme as "magenta" | "cyan" | "purple" });
      toast.success("Theme updated!");
    } catch (error) {
      toast.error("Failed to update theme");
    }
  };

  const handleNameColorChange = async (color: string) => {
    setSelectedNameColor(color);
    try {
      await updateNameColorMutation.mutateAsync({ nameColor: color });
      toast.success("Name color updated!");
    } catch (error) {
      toast.error("Failed to update name color");
    }
  };

  const profileUrl = `${window.location.origin}/profile/${user?.id}`;
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("Profile link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareProfile = (platform: string) => {
    const message = `Check out my Anom Artsy profile: ${profileUrl}`;
    const encodedMessage = encodeURIComponent(message);
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], "_blank", "width=600,height=400");
      toast.success(`Shared on ${platform}!`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      {/* Header */}
      <div className="border-b border-[#334155] bg-[#0f172a]/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#c4b5fd]">My Profile</h1>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => navigate("/")} className="text-[#93c5fd] border-[#93c5fd] hover:bg-[#93c5fd]/10">
                ← Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: "dashboard", label: "Dashboard", icon: "📊" },
            { id: "customize", label: "Customize", icon: "🎨" },
            { id: "settings", label: "Settings", icon: "⚙️" },
            { id: "share", label: "Share", icon: "📤" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-lg border-2 font-bold transition-all ${
                activeTab === tab.id
                  ? "border-[#c4b5fd] bg-[#c4b5fd]/20 text-[#c4b5fd]"
                  : "border-[#93c5fd] bg-transparent text-[#93c5fd] hover:bg-[#93c5fd]/10"
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-[#1e293b] border border-[#334155] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#94a3b8] text-sm">Level</p>
                    <p className="text-4xl font-bold text-[#c4b5fd]">{profile?.level || 1}</p>
                  </div>
                  <Zap className="w-12 h-12 text-[#c4b5fd] opacity-50" />
                </div>
              </Card>

              <Card className="bg-[#1e293b] border border-[#334155] p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#94a3b8] text-sm">Anom Coin Balance</p>
                    <p className="text-4xl font-bold text-[#93c5fd]">{profile?.anomCoinBalance || "0"}</p>
                  </div>
                  <Award className="w-12 h-12 text-[#93c5fd] opacity-50" />
                </div>
              </Card>
            </div>

            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-xl font-bold text-[#c4b5fd] mb-4">Bio</h3>
              <p className="text-[#94a3b8]">{profile?.bio || "No bio yet. Add one in the Customize tab!"}</p>
            </Card>
          </div>
        )}

        {/* Customize Tab */}
        {activeTab === "customize" && (
          <div className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-xl font-bold text-[#c4b5fd] mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {THEME_OPTIONS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedTheme === theme.id
                        ? "border-[#c4b5fd] bg-[#c4b5fd]/20"
                        : "border-[#334155] hover:border-[#c4b5fd]"
                    }`}
                  >
                    <div className="text-3xl mb-2">{theme.preview}</div>
                    <p className="text-sm text-[#94a3b8]">{theme.name}</p>
                  </button>
                ))}
              </div>
            </Card>

            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-xl font-bold text-[#c4b5fd] mb-4">Name Color</h3>
              <div className="grid grid-cols-3 gap-4">
                {NAME_COLORS.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => handleNameColorChange(color.id)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedNameColor === color.id
                        ? "border-[#c4b5fd] bg-[#c4b5fd]/20"
                        : "border-[#334155] hover:border-[#c4b5fd]"
                    }`}
                  >
                    <div 
                      className="w-8 h-8 rounded-full mx-auto mb-2"
                      style={{ backgroundColor: color.id }}
                    />
                    <p className="text-sm text-[#94a3b8]">{color.name}</p>
                  </button>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-xl font-bold text-[#c4b5fd] mb-4">Edit Bio</h3>
              {isEditingProfile ? (
                <div className="space-y-4">
                  <textarea
                    value={editData.bio}
                    onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                    className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-3 text-[#93c5fd] placeholder-[#94a3b8] focus:border-[#c4b5fd] focus:outline-none"
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleUpdateProfile} className="flex-1 bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black font-bold">
                      Save Bio
                    </Button>
                    <Button onClick={() => setIsEditingProfile(false)} variant="outline" className="flex-1 text-[#93c5fd] border-[#93c5fd]">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button onClick={() => setIsEditingProfile(true)} className="w-full bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black font-bold">
                  Edit Bio
                </Button>
              )}
            </Card>
          </div>
        )}

        {/* Share Tab */}
        {activeTab === "share" && (
          <div className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <h3 className="text-xl font-bold text-[#c4b5fd] mb-4">Share Your Profile</h3>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={profileUrl}
                    readOnly
                    className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                  />
                  <Button
                    onClick={handleCopyLink}
                    className="bg-[#93c5fd] hover:bg-[#93c5fd]/80 text-black font-bold"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { platform: "twitter", icon: "𝕏", label: "Twitter" },
                    { platform: "facebook", icon: "f", label: "Facebook" },
                    { platform: "linkedin", icon: "in", label: "LinkedIn" },
                  ].map((social) => (
                    <Button
                      key={social.platform}
                      onClick={() => handleShareProfile(social.platform)}
                      className="bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black font-bold"
                    >
                      {social.icon}
                    </Button>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
