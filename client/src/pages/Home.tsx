import { Button } from "@/components/ui/button";
import { Zap, Users, Gamepad2, Heart, Sparkles, ShoppingBag, Upload, Palette, Check, Target, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";
import SignUpConnectors from "@/components/SignUpConnectors";
import HomepageIntegration from "@/components/HomepageIntegration";
import { trpc } from "@/lib/trpc";
import { AO_LIBRARY_WORLD, AO_SOCIAL_GOOD_MISSIONS, AO_WORLD_AGE_TIERS, AO_WORLD_PRINCIPLES, getAOBadgeRarity } from "../../../shared/aoWorldContract";

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();
  const { data: profileData } = trpc.profile.getMe.useQuery(undefined, { enabled: isAuthenticated });
  const { data: allAchievements } = trpc.achievement.getAll.useQuery();
  const { data: userAchievements } = trpc.achievement.getUserAchievements.useQuery(undefined, { enabled: isAuthenticated });
  const { data: missions } = trpc.missions.list.useQuery();
  const { data: missionStatus } = trpc.missions.status.useQuery(undefined, { enabled: isAuthenticated, retry: false });
  const unlockedIds = new Set(userAchievements?.map((achievement) => achievement.achievementId) || []);
  const unlockedBadgeCount = (allAchievements || []).filter((achievement) => unlockedIds.has(achievement.id)).length;
  const unlockedBadges = (allAchievements || []).filter((achievement) => unlockedIds.has(achievement.id)).slice(0, 4);
  const completedMissionIds = new Set((missionStatus || []).map((item) => item.missionId));
  const missionCount = missions?.length || AO_SOCIAL_GOOD_MISSIONS.length;
  const completedMissionCount = missions?.filter((mission) => completedMissionIds.has(mission.id)).length || 0;
  const missionPercent = missionCount ? Math.round((completedMissionCount / missionCount) * 100) : 0;
  const homeMissions = missions?.length
    ? missions
    : AO_SOCIAL_GOOD_MISSIONS.map((mission) => ({
      ...mission,
      name: mission.label,
      description: mission.cue,
      reward: "0.00",
    }));
  const glowColor = profileData?.nameColor || "#00eaff";
  const [backgroundUrl, setBackgroundUrl] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('homepageBackground') || '';
    }
    return '';
  });
  const [showBgMenu, setShowBgMenu] = useState(false);
  const [guardianFilter, setGuardianFilter] = useState<boolean>(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('ao-guardian-filter') === 'on';
    return false;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Anom Artsy...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A10] text-[#00eaff] flex flex-col">
        {/* Navigation */}
        <nav className="border-b border-[#08080f] px-6 py-4">
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
              <div className="mb-6 inline-block bg-transparent border border-[#00eaff] bg-[#00eaff]/10 border border-[#00eaff] rounded-lg px-4 py-2">
                <p className="text-[#d8ae55] font-bold text-sm">🌍 Social Good First</p>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                <span className="text-accent">Identity</span>
                <span className="text-[#00eaff]">, Amplified</span>
              </h1>
              <p className="text-lg text-[#cccccc] mb-8">
                Join the Anom Artsy community — a neon-lit sanctuary where family comes first, creativity thrives, and your identity matters. Every interaction drives real-world social good impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="/api/auth/google">
                  <Button className="btn-secondary text-lg py-6 px-8">
                    Enter the Universe
                  </Button>
                </a>
                <a href="/mission-hub">
                  <Button className="bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10 font-bold text-lg py-6 px-8">
                    💜 Support Our Mission
                  </Button>
                </a>
              </div>
            </div>
            <SignUpConnectors />
          </div>
        </section>

        {/* Mission Section */}
        <section className="bg-gradient-to-r from-[#d8ae55]/10 to-[#00eaff]/10 border-t border-[#00eaff] px-6 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              <span className="text-accent">Social Good</span>
              <span className="text-[#00eaff]"> Meets </span>
              <span className="text-accent">Creative Power</span>
            </h2>
            <p className="text-[#cccccc] max-w-2xl mx-auto mb-6">
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
        <section className="bg-[#000000] border-t border-[#08080f] px-6 py-20">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-center mb-16 text-accent">
              What Awaits You
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-[#000000] border border-[#08080f] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'}}>
                <Zap className="w-8 h-8 text-[#d8ae55] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Anom Coin Economy</h3>
                <p className="text-[#cccccc]">
                  Earn coins through social good actions, games, and community engagement. Spend them on profile decorations and exclusive lounges.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-[#000000] border border-[#08080f] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'}}>
                <Users className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#d8ae55] mb-2">Private Lounges</h3>
                <p className="text-[#cccccc]">
                  Create family, friend, and coworker lounges. Chat, share goals, and customize your space with visual themes.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-[#000000] border border-[#08080f] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'}}>
                <Gamepad2 className="w-8 h-8 text-[#d8ae55] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Mini-Games</h3>
                <p className="text-[#cccccc]">
                  Play Trivia, Memory, Mood Matcher, and Snack Vault Rush. Earn coins and climb the leaderboard.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-[#000000] border border-[#08080f] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'}}>
                <Heart className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#d8ae55] mb-2">Anom's Corner</h3>
                <p className="text-[#cccccc]">
                  A safe space for children to watch Pixel & Dot episodes, play Off-Grid Adventure, and color.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-[#000000] border border-[#08080f] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'}}>
                <Sparkles className="w-8 h-8 text-[#d8ae55] mb-4" />
                <h3 className="text-xl font-bold text-[#00eaff] mb-2">Profile Customization</h3>
                <p className="text-[#cccccc]">
                  Apply visual themes, character badges, and mood glows to your profile. No coding required.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-[#000000] border border-[#08080f] rounded-lg p-4" style={{boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)'}}>
                <ShoppingBag className="w-8 h-8 text-[#00eaff] mb-4" />
                <h3 className="text-xl font-bold text-[#d8ae55] mb-2">Custom Merch</h3>
                <p className="text-[#cccccc]">
                  Request your bespoke artwork. We create and fulfill it through our trusted partners.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-6 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6 text-[#00eaff]">
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
        <footer className="border-t border-[#08080f] px-6 py-8 text-center text-[#cccccc]">
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

  const toggleGuardianFilter = () => {
    setGuardianFilter(current => {
      const next = !current;
      localStorage.setItem('ao-guardian-filter', next ? 'on' : 'off');
      toast.success(next ? 'Guardian view on: showing safer worlds' : 'Guardian view off: showing all worlds');
      return next;
    });
  };

  const worldPortals = [
    {
      name: 'Sanctuary',
      eyebrow: 'SOCIAL GOOD',
      detail: 'Lounges · Feed · Missions',
      description: 'Find your people and turn kindness into momentum.',
      ageTier: AO_WORLD_AGE_TIERS.sanctuary,
      guardianSafe: true,
      path: '/mission-hub',
      tone: 'gold',
      icon: Heart,
      delay: '0s',
    },
    {
      name: 'Play Worlds',
      eyebrow: 'ARCADE SIGNAL',
      detail: "Games · Anom's Corner",
      description: 'Play small, bright games that grow your signal.',
      ageTier: AO_WORLD_AGE_TIERS.play,
      guardianSafe: true,
      path: '/games',
      tone: 'cyan',
      icon: Gamepad2,
      delay: '0.2s',
    },
    {
      name: 'Archive',
      eyebrow: 'MOUNTS + BADGES',
      detail: 'Achievements · Merch',
      description: 'Collect the objects, colors, and memories you unlock.',
      ageTier: AO_WORLD_AGE_TIERS.archive,
      guardianSafe: true,
      path: '/achievements',
      tone: 'gold',
      icon: Sparkles,
      delay: '0.4s',
    },
    {
      name: 'Creator Orbit',
      eyebrow: 'MAKE TOGETHER',
      detail: 'Collaboration · Profiles',
      description: 'Shape your identity through simple, joyful choices.',
      ageTier: AO_WORLD_AGE_TIERS.creator,
      guardianSafe: false,
      path: '/collaboration',
      tone: 'cyan',
      icon: Users,
      delay: '0.6s',
    },
  ] as const;
  const visibleWorldPortals = guardianFilter ? worldPortals.filter(world => world.guardianSafe) : worldPortals;

  const signals = [
    { label: 'LEVEL', value: String(profileData?.level || 1).padStart(2, '0'), icon: Sparkles, tone: 'cyan' },
    { label: 'BADGES', value: String(unlockedBadgeCount), icon: Heart, tone: 'gold' },
  ] as const;

  return (
    <div
      className="ao-world-page min-h-screen bg-[#0A0A10] text-white"
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

      <nav className="ao-world-nav sticky top-0 z-40">
        <div className="ao-world-nav-inner">
          <button type="button" className="ao-wordmark" onClick={() => navigate('/')}>ANOM ARTSY</button>
          <div className="ao-world-nav-actions">
            <span className="ao-nav-welcome">Welcome, {user?.name}</span>
            <div className="relative">
              <Button onClick={() => setShowBgMenu(!showBgMenu)} className="btn-outline" size="sm">
                <Palette className="w-4 h-4" />
                Background
              </Button>
              {showBgMenu && (
                <div className="ao-background-menu">
                  <p className="ao-menu-kicker">CHOOSE A MOOD</p>
                  <button type="button" onClick={() => handlePresetBackground('gradient1')}>Gold Aurora</button>
                  <button type="button" onClick={() => handlePresetBackground('gradient2')}>Cyan Orbit</button>
                  <button type="button" onClick={() => handlePresetBackground('gradient3')}>Garden Signal</button>
                  <label>
                    <Upload className="w-4 h-4" />
                    Upload Image
                    <input type="file" accept="image/*" onChange={handleBackgroundUpload} className="hidden" />
                  </label>
                </div>
              )}
            </div>
            {user?.role === 'admin' && (
              <Button onClick={() => navigate('/owner')} className="btn-primary font-bold" size="sm">
                Owner Panel
              </Button>
            )}
            <Button variant="outline" onClick={logout} className="text-[#00eaff]" size="sm">
              Sign Out
            </Button>
          </div>
        </div>
      </nav>

      <main className="ao-world-main">
        <section className="ao-world-hero" aria-labelledby="world-title">
          <div className="ao-world-intro">
            <p className="ao-world-kicker">AO SANCTUARY // LIVE WORLD MAP · AGE-AWARE · MODERATED</p>
            <h1 id="world-title">Choose a world.<br /><span>Bring your signal.</span></h1>
            <p className="ao-world-lede">
              This is one social game with many worlds: build a whole identity online and in real life, speak in emotes, glow with your creativity, and earn progress by doing good together.
            </p>
            <div className="ao-world-hero-actions">
              <Button className="btn-primary" onClick={() => navigate('/mission-hub')}>Open Mission Hub</Button>
              <Button className="btn-secondary" onClick={() => navigate('/games')}>Enter Play Worlds</Button>
              <Button type="button" className={`btn-outline ${guardianFilter ? 'ao-guardian-toggle-active' : ''}`} aria-pressed={guardianFilter} onClick={toggleGuardianFilter}>
                <ShieldCheck className="h-4 w-4" />
                {guardianFilter ? 'Guardian view on' : 'Guardian filter'}
              </Button>
            </div>
            <p className="ao-guardian-control-copy">
              {guardianFilter ? 'Showing all-ages and kids + guardians worlds.' : 'Filter the map to age-appropriate worlds when exploring together.'}
            </p>
            <p className="ao-world-caption">{AO_WORLD_PRINCIPLES.join(" · ")}</p>
          </div>

          <div className="ao-world-map" role="group" aria-label={`${visibleWorldPortals.length} connected Anom worlds orbiting a shared sanctuary core`}>
            <div className="ao-map-halo ao-map-halo-outer" />
            <div className="ao-map-halo ao-map-halo-inner" />
            <div className="ao-map-star ao-map-star-one" />
            <div className="ao-map-star ao-map-star-two" />
            <div className="ao-map-star ao-map-star-three" />
            <div className="ao-world-core">
              <span className="ao-core-signal">LIVE SIGNAL</span>
              <strong>AO</strong>
              <span className="ao-core-caption">one universe<br />many ways in</span>
            </div>
            {visibleWorldPortals.map((world, index) => {
              const Icon = world.icon;
              return (
                <button
                  key={world.name}
                  type="button"
                  className={`ao-world-node ao-world-node-${index + 1} ao-world-node-${world.tone}`}
                  style={{ animationDelay: world.delay }}
                  onClick={() => navigate(world.path)}
                  aria-label={`Enter ${world.name}: ${world.description}`}
                >
                  <span className="ao-world-node-icon"><Icon className="w-6 h-6" /></span>
                  <span className="ao-world-node-eyebrow">{world.eyebrow}</span>
                  <strong>{world.name}</strong>
                  <span className="ao-world-node-detail">{world.detail}</span>
                  <span className="ao-world-node-age"><ShieldCheck className="h-3 w-3" />{world.ageTier}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="ao-signal-strip" aria-label="Your current Anom signals">
          <div className="ao-signal-strip-label">YOUR SIGNALS</div>
          {signals.map((signal) => {
            const Icon = signal.icon;
            return (
              <div className={`ao-signal ao-signal-${signal.tone}`} key={signal.label}>
                <Icon className="w-4 h-4" />
                <span className="ao-signal-label">{signal.label}</span>
                <strong>{signal.value}</strong>
              </div>
            );
          })}
        </section>

        <section className="ao-homeworld-identity" aria-labelledby="identity-title">
          <div className="ao-identity-copy">
            <p className="ao-world-kicker">HOMEWORLD IDENTITY // ONLINE ↔ REAL LIFE</p>
            <h2 id="identity-title">Your profile is a world.</h2>
            <p>Show the badges you earn, tune the glow you carry, and let your online choices point back to the person you are becoming offline.</p>
            <div className="ao-identity-actions">
              <Button type="button" className="btn-primary" onClick={() => navigate('/profile')}>Shape your glow</Button>
              <Button type="button" className="btn-secondary" onClick={() => navigate('/achievements')}>Display badges</Button>
            </div>
          </div>
          <div className="ao-identity-orbit" aria-label={`${unlockedBadgeCount} badges displayed on your Homeworld`}>
            <div className="ao-identity-ring ao-identity-ring-one" />
            <div className="ao-identity-ring ao-identity-ring-two" />
            <div className="ao-identity-glow" style={{ borderColor: glowColor, boxShadow: `0 0 36px ${glowColor}66, inset 0 0 24px ${glowColor}22` }}>
              <span className="ao-identity-initial">{user?.name?.charAt(0).toUpperCase() || 'A'}</span>
              <span className="ao-identity-glow-label">YOUR GLOW</span>
            </div>
            <div className="ao-badge-dock">
              {unlockedBadges.length > 0 ? unlockedBadges.map((badge) => {
                const rarity = getAOBadgeRarity(badge);
                return <span className={`ao-badge-chip ao-badge-rarity-${rarity}`} key={badge.id} title={`${badge.name} · ${rarity}`}><Sparkles className="h-3 w-3" /><span>{badge.name}</span><small>{rarity}</small></span>;
              }) : <span className="ao-badge-chip ao-badge-chip-empty"><Sparkles className="h-3 w-3" />First badge waiting</span>}
            </div>
          </div>
        </section>

        <section className="ao-mission-rail" aria-labelledby="mission-rail-title">
          <div className="ao-section-heading">
            <div>
              <p className="ao-world-kicker">SOCIAL GOOD // SHARED PROGRESS</p>
              <h2 id="mission-rail-title">Kindness is playable.</h2>
            </div>
            <div className="ao-mission-progress-summary">
              <span>{completedMissionCount}/{missionCount} signals recorded</span>
              <div className="ao-mission-progress" aria-label={`${missionPercent}% of social-good missions recorded`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={missionPercent}>
                <span style={{ width: `${missionPercent}%` }} />
              </div>
            </div>
          </div>
          <p className="ao-mission-rail-lede">Small actions become a shared reward loop: arrive, make, play, and leave the next person with more room to glow.</p>
          <div className="ao-mission-grid">
            {homeMissions.map((mission, index) => {
              const metadata = AO_SOCIAL_GOOD_MISSIONS.find(item => item.id === mission.id);
              const isDone = completedMissionIds.has(mission.id);
              return (
                <article className={`ao-mission-card ${isDone ? 'ao-mission-card-done' : ''}`} key={mission.id}>
                  <div className="ao-mission-card-topline"><span>0{index + 1}</span><span>{isDone ? 'RECORDED' : 'OPEN SIGNAL'}</span></div>
                  <div className="ao-mission-card-icon"><Target className="h-5 w-5" /></div>
                  <h3>{metadata?.label || mission.name}</h3>
                  <p>{metadata?.cue || mission.description}</p>
                  <div className="ao-mission-card-footer">
                    <span>{isDone ? <><Check className="h-3 w-3" /> Complete</> : `+${mission.reward} AC`}</span>
                    <Button type="button" className="btn-link" onClick={() => navigate(`/mission-hub?mission=${encodeURIComponent(mission.id)}`)}>{isDone ? 'View' : 'Enter'}</Button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <section className="ao-world-gates" aria-labelledby="gate-title">
          <div className="ao-section-heading">
            <div>
              <p className="ao-world-kicker">OPEN GATES</p>
              <h2 id="gate-title">The universe is wider than one screen.</h2>
            </div>
            <p>Choose a doorway and let the next experience carry your identity forward.</p>
          </div>
          <div className="ao-gate-line">
            <button type="button" className="ao-gate ao-gate-gold" onClick={() => navigate('/profile')}>
              <span className="ao-gate-index">01</span><span><strong>Identity Garden</strong><small>Profile · badges · colors</small></span><span className="ao-gate-arrow">↗</span>
            </button>
            <button type="button" className="ao-gate ao-gate-cyan" onClick={() => navigate('/feed')}>
              <span className="ao-gate-index">02</span><span><strong>Community Current</strong><small>Feed · lounges · shared goals</small></span><span className="ao-gate-arrow">↗</span>
            </button>
            <button type="button" className="ao-gate ao-gate-gold" onClick={() => navigate('/merch')}>
              <span className="ao-gate-index">03</span><span><strong>Object Lab</strong><small>Merch · mounts · visual rewards</small></span><span className="ao-gate-arrow">↗</span>
            </button>
            <button type="button" className="ao-gate ao-gate-cyan" onClick={() => navigate(AO_LIBRARY_WORLD.path)}>
              <span className="ao-gate-index">04</span><span><strong>{AO_LIBRARY_WORLD.label}</strong><small>{AO_LIBRARY_WORLD.subtitle}</small></span><span className="ao-gate-arrow">↗</span>
            </button>
          </div>
        </section>

        <HomepageIntegration />
      </main>
    </div>
  );
}
