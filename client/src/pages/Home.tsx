import { Button } from "@/components/ui/button";
import { Zap, Users, Gamepad2, Heart, Sparkles, ShoppingBag, Upload, Palette } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import SignUpConnectors from "@/components/SignUpConnectors";
import HomepageIntegration from "@/components/HomepageIntegration";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const [backgroundUrl, setBackgroundUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('homepageBackground') || '';
    }
    return '';
  });
  const [showBgMenu, setShowBgMenu] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#93c5fd] text-xl">Loading Anom Artsy...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-[#93c5fd] flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-[#334155] px-6 py-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="text-2xl font-bold text-accent">Anom Artsy</div>
            <a href="/api/auth/google">
              <Button className="btn-primary">Sign In</Button>
            </a>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="flex-1 px-6 py-20">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="mb-6 inline-block bg-[#c4b5fd]/20 border border-[#c4b5fd] rounded-lg px-4 py-2">
                <p className="text-[#c4b5fd] font-bold text-sm">🌍 Social Good First</p>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                <span className="text-accent">Identity</span>
                <span className="text-[#93c5fd]">, Amplified</span>
              </h1>
              <p className="text-lg text-[#94a3b8] mb-8">
                Join the Anom Artsy community — a neon-lit sanctuary where family comes first, creativity thrives, and your identity matters. Every interaction drives real-world social good impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/api/auth/google">
                  <Button className="btn-secondary text-lg py-6 px-8">
                    Enter the Universe
                  </Button>
                </a>
                <a href="/mission-hub">
                  <Button className="bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black font-bold text-lg py-6 px-8">
                    💜 Support Our Mission
                  </Button>
                </a>
              </div>
            </div>
            <SignUpConnectors />
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gradient-to-r from-[#c4b5fd]/10 to-[#93c5fd]/10 border-t border-[#c4b5fd] px-6 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              <span className="text-accent">Social Good</span>
              <span className="text-[#93c5fd]"> Meets </span>
              <span className="text-accent">Creative Power</span>
            </h2>
            <p className="text-[#94a3b8] max-w-2xl mx-auto mb-6">
              Every coin earned, every collaboration started, every voice amplified—it all drives real impact. Join artists, creators, and visionaries building a better world together.
            </p>
            <a href="/mission-hub">
              <Button className="btn-primary text-lg py-4 px-8">
                Explore the Mission
              </Button>
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-[#1e293b] border-t border-[#334155] px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-accent">
              What Awaits You
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
                <Zap className="w-8 h-8 text-[#c4b5fd] mb-4" />
                <h3 className="text-xl font-bold text-[#93c5fd] mb-2">Anom Coin Economy</h3>
                <p className="text-[#94a3b8]">
                  Earn coins through social good actions, games, and community engagement. Spend them on profile decorations and exclusive lounges.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
                <Users className="w-8 h-8 text-[#93c5fd] mb-4" />
                <h3 className="text-xl font-bold text-[#c4b5fd] mb-2">Private Lounges</h3>
                <p className="text-[#94a3b8]">
                  Create family, friend, and coworker lounges. Chat, share goals, and customize your space with visual themes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
                <Gamepad2 className="w-8 h-8 text-[#c4b5fd] mb-4" />
                <h3 className="text-xl font-bold text-[#93c5fd] mb-2">Mini-Games</h3>
                <p className="text-[#94a3b8]">
                  Play Trivia, Memory, Mood Matcher, and Snack Vault Rush. Earn coins and climb the leaderboard.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
                <Heart className="w-8 h-8 text-[#93c5fd] mb-4" />
                <h3 className="text-xl font-bold text-[#c4b5fd] mb-2">Kids Corner</h3>
                <p className="text-[#94a3b8]">
                  A safe space for children to watch Pixel & Dot episodes, play Off-Grid Adventure, and color.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
                <Sparkles className="w-8 h-8 text-[#c4b5fd] mb-4" />
                <h3 className="text-xl font-bold text-[#93c5fd] mb-2">Profile Customization</h3>
                <p className="text-[#94a3b8]">
                  Apply visual themes, character badges, and mood glows to your profile. No coding required.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
                <ShoppingBag className="w-8 h-8 text-[#93c5fd] mb-4" />
                <h3 className="text-xl font-bold text-[#c4b5fd] mb-2">Custom Merch</h3>
                <p className="text-[#94a3b8]">
                  Request your bespoke artwork. We create and fulfill it through our trusted partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#93c5fd]">
              Ready to join the Anom Universe?
            </h2>
            <a href="/api/auth/google">
              <Button className="btn-primary text-lg py-6 px-8">
                Get Started Now
              </Button>
            </a>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[#334155] px-6 py-8 text-center text-[#94a3b8]">
          <p>&copy; 2026 Anom Artsy. Identity, Amplified.</p>
        </footer>
      </div>
    );
  }

  const handleBackgroundUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setBackgroundUrl(url);
        localStorage.setItem('homepageBackground', url);
        toast.success('Background updated!');
        setShowBgMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePresetBackground = (preset: string) => {
    const presets: Record<string, string> = {
      gradient1: 'linear-gradient(135deg, rgba(196, 181, 253, 0.1) 0%, rgba(147, 197, 253, 0.1) 100%)',
      gradient2: 'linear-gradient(135deg, rgba(165, 180, 252, 0.1) 0%, rgba(196, 181, 253, 0.1) 100%)',
      gradient3: 'linear-gradient(135deg, rgba(147, 197, 253, 0.1) 0%, rgba(134, 239, 172, 0.1) 100%)',
    };
    setBackgroundUrl(presets[preset] || '');
    localStorage.setItem('homepageBackground', presets[preset] || '');
    toast.success('Background preset applied!');
    setShowBgMenu(false);
  };

  // Authenticated Dashboard
  return (
    <div 
      className="min-h-screen bg-[#0f172a] text-[#93c5fd]"
      style={{
        backgroundImage: backgroundUrl.startsWith('linear-gradient') ? backgroundUrl : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {backgroundUrl && !backgroundUrl.startsWith('linear-gradient') && (
        <div 
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.15,
          }}
        />
      )}
      {/* Navigation */}
      <nav className="border-b border-[#334155] px-6 py-4 sticky top-0 bg-[#0f172a]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-accent">Anom Artsy</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#94a3b8]">Welcome, {user?.name}</span>
            <div className="relative">
              <Button 
                onClick={() => setShowBgMenu(!showBgMenu)}
                className="bg-[#93c5fd]/20 hover:bg-[#93c5fd]/30 text-[#93c5fd] border border-[#93c5fd]"
                size="sm"
              >
                <Palette className="w-4 h-4 mr-2" />
                Background
              </Button>
              {showBgMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1e293b] border border-[#334155] rounded-lg p-4 shadow-lg z-50">
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePresetBackground('gradient1')}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#334155] text-[#93c5fd] text-sm"
                    >
                      Magenta-Cyan
                    </button>
                    <button
                      onClick={() => handlePresetBackground('gradient2')}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#334155] text-[#93c5fd] text-sm"
                    >
                      Purple-Magenta
                    </button>
                    <button
                      onClick={() => handlePresetBackground('gradient3')}
                      className="w-full text-left px-3 py-2 rounded hover:bg-[#334155] text-[#93c5fd] text-sm"
                    >
                      Cyan-Green
                    </button>
                    <label className="w-full text-left px-3 py-2 rounded hover:bg-[#334155] text-[#93c5fd] text-sm cursor-pointer flex items-center">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleBackgroundUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
            {user?.role === 'admin' && (
              <Button onClick={() => navigate('/owner')} className="bg-[#a855f7] hover:bg-[#a855f7]/80 text-white font-bold">
                Owner Panel
              </Button>
            )}
            <Button variant="outline" onClick={logout} className="text-[#c4b5fd]">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {/* Coin Balance */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Anom Coin Balance</p>
                <p className="text-3xl font-bold text-[#c4b5fd]">0 AC</p>
              </div>
              <Zap className="w-8 h-8 text-[#c4b5fd]" />
            </div>
          </div>

          {/* Level */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Your Level</p>
                <p className="text-3xl font-bold text-[#93c5fd]">1</p>
              </div>
              <Sparkles className="w-8 h-8 text-[#93c5fd]" />
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Achievements</p>
                <p className="text-3xl font-bold text-[#c4b5fd]">0</p>
              </div>
              <Heart className="w-8 h-8 text-[#c4b5fd]" />
            </div>
          </div>

          {/* Lounges */}
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Your Lounges</p>
                <p className="text-3xl font-bold text-[#93c5fd]">0</p>
              </div>
              <Users className="w-8 h-8 text-[#93c5fd]" />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <h3 className="text-xl font-bold text-[#c4b5fd] mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button className="w-full btn-primary" onClick={() => navigate("/profile")}>
                View Profile
              </Button>
              <Button className="w-full btn-secondary" onClick={() => navigate("/lounges")}>
                Browse Lounges
              </Button>
              <Button className="w-full btn-tertiary" onClick={() => navigate("/achievements")}>
                View Achievements
              </Button>
              <Button className="w-full btn-primary" onClick={() => navigate("/kids-corner")}>
                Kids Corner
              </Button>
              <Button className="w-full btn-secondary" onClick={() => navigate("/feed")}>
                Social Feed
              </Button>
              <Button className="w-full btn-outline" onClick={() => navigate("/games")}>
                Play Games
              </Button>
              <Button className="w-full btn-primary" onClick={() => navigate("/merch")}>
                Custom Merch
              </Button>
              <Button className="w-full btn-secondary" onClick={() => navigate("/collaboration")}>
                Collaboration Station
              </Button>
            </div>
          </div>

          <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <h3 className="text-xl font-bold text-[#93c5fd] mb-4">Live from the Universe</h3>
            <p className="text-[#94a3b8] text-sm">
              Check back soon for community highlights, memes, and universe updates!
            </p>
          </div>
        </div>

        {/* Homepage Integration */}
        <div className="mt-12">
          <HomepageIntegration />
        </div>
      </main>
    </div>
  );
}
