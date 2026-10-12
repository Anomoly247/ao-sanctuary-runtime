import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Compass, Search, Sparkles, Users, Video, Coins, ShieldCheck } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { AO_LIBRARY_WORLD } from "../../../shared/aoWorldContract";
import { LIBRARY_WORLD_GAMES } from "../../../shared/aoContentRegistry";
import { ExternalContentSpots } from "@/components/ExternalContentSpots";
import { useAOBridge } from "@/contexts/AOBridgeContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";

const lessonTrails = [
  {
    icon: Compass,
    label: "RESEARCH ATLAS",
    title: "Follow a question",
    detail: "Deep dives, field notes, and source trails that turn curiosity into a shared quest.",
    tone: "gold",
  },
  {
    icon: Video,
    label: "VIDEO ORCHARD",
    title: "Watch a new angle",
    detail: "Clips, interviews, talks, and demonstrations organized around what they teach us.",
    tone: "cyan",
  },
  {
    icon: Sparkles,
    label: "HIDDEN LESSON INDEX",
    title: "Find the meaning",
    detail: "Every game, story, and artifact leaves a small lesson for the player to carry.",
    tone: "gold",
  },
];

export default function LibraryWorld() {
  const [, navigate] = useLocation();
  const bridge = useAOBridge();
  const { isAuthenticated } = useAuth();
  const [completed, setCompleted] = useState<string[]>([]);
  const [pendingGameId, setPendingGameId] = useState<string | null>(null);
  const completeGame = trpc.ao.completeLibraryGame.useMutation({
    onSuccess: (result) => {
      toast.success(result.idempotent ? "That Library completion was already recorded." : `You earned ${result.entry.amount} AC.`);
      setPendingGameId(null);
    },
    onError: (error) => {
      if (pendingGameId) setCompleted((current) => current.filter((id) => id !== pendingGameId));
      setPendingGameId(null);
      toast.error(error.message || "The Library could not record that completion.");
    },
  });

  const claimCompletion = (gameId: (typeof LIBRARY_WORLD_GAMES)[number]["id"]) => {
    if (!isAuthenticated) {
      toast.info("Explore as a guest. Sign in only when you want to save an AC completion.");
      return;
    }
    const eventId = window.crypto?.randomUUID?.() ?? `${Date.now()}-${gameId}`;
    setPendingGameId(gameId);
    setCompleted((current) => current.includes(gameId) ? current : [...current, gameId]);
    completeGame.mutate({ gameId, score: 100, eventId, house: bridge.house, mount: bridge.mount });
  };

  return (
    <div className="ao-library-page ao-world-page min-h-screen bg-[#0A0A10] text-white">
      <nav className="ao-world-nav sticky top-0 z-40">
        <div className="ao-world-nav-inner">
          <button type="button" className="ao-wordmark" onClick={() => navigate("/")}>ANOM ARTSY</button>
          <Button type="button" className="btn-outline" onClick={() => navigate("/")} size="sm">
            <ArrowLeft className="h-4 w-4" /> Return to worlds
          </Button>
        </div>
      </nav>

      <main className="ao-world-main">
        <section className="ao-library-hero" aria-labelledby="library-title">
          <div className="ao-library-intro">
            <p className="ao-world-kicker">{AO_LIBRARY_WORLD.label.toUpperCase()} // RESEARCH · VIDEO · LESSONS</p>
            <h1 id="library-title">Curiosity is<br /><span>a playable power.</span></h1>
            <p>
              The Library is where the wider AO universe gathers what it learns: source trails, videos, experiments, stories, and the hidden lessons inside every world. {AO_LIBRARY_WORLD.mission}
            </p>
            <div className="ao-world-hero-actions">
              <Button type="button" className="btn-primary" onClick={() => toast.info("The first Library trails are being gathered.")}>
                <BookOpen className="h-4 w-4" /> Open the first trail
              </Button>
              <Button type="button" className="btn-secondary" onClick={() => navigate("/games")}>
                Learn through play
              </Button>
            </div>
            <div className="ao-library-safety-note">
              <Users className="h-4 w-4" /> Every trail will carry an age tier, source note, and moderation status before it opens.
            </div>
          </div>

          <div className="ao-library-orbit" role="img" aria-label="Library World orbiting research, video, and hidden lessons">
            <div className="ao-library-ring ao-library-ring-outer" />
            <div className="ao-library-ring ao-library-ring-inner" />
            <div className="ao-library-particle ao-library-particle-one" />
            <div className="ao-library-particle ao-library-particle-two" />
            <div className="ao-library-core">
              <span>OPEN INDEX</span>
              <strong>{AO_LIBRARY_WORLD.label.replace(" World", "").toUpperCase()}</strong>
              <small>learn · remix · share</small>
            </div>
            <div className="ao-library-scanline" />
          </div>
        </section>

        <section className="ao-library-trails" aria-labelledby="trails-title">
          <div className="ao-section-heading">
            <div>
              <p className="ao-world-kicker">THREE WAYS IN</p>
              <h2 id="trails-title">Every trail changes how you see.</h2>
            </div>
            <p><Search className="mr-2 inline-block h-4 w-4 text-[#00eaff]" />The full research and video catalog will grow from the connected AO repositories.</p>
          </div>
          <div className="ao-library-trail-line">
            {lessonTrails.map((trail) => {
              const Icon = trail.icon;
              return (
                <button type="button" key={trail.title} className={`ao-library-trail ao-library-trail-${trail.tone}`} onClick={() => toast.info(`${trail.title} is part of the next Library build.`)}>
                  <span className="ao-library-trail-icon"><Icon className="h-5 w-5" /></span>
                  <span className="ao-library-trail-label">{trail.label}</span>
                  <strong>{trail.title}</strong>
                  <span>{trail.detail}</span>
                  <em>COMING INTO ORBIT ↗</em>
                </button>
              );
            })}
          </div>
        </section>

        <section className="ao-library-games" aria-labelledby="library-games-title">
          <div className="ao-section-heading">
            <div>
              <p className="ao-world-kicker">CONTROLLED GAME REGISTRY</p>
              <h2 id="library-games-title">Learn by entering a story.</h2>
            </div>
            <p><ShieldCheck className="mr-2 inline-block h-4 w-4 text-[#00eaff]" />Age tier, characters, and reward rules travel with every completion.</p>
          </div>
          <div className="ao-library-game-grid">
            {LIBRARY_WORLD_GAMES.map((game) => {
              const wasCompleted = completed.includes(game.id);
              return (
                <article key={game.id} className="ao-library-game-card">
                  <img src={game.artwork} alt={`${game.characters.join(" and ")} Library artwork`} loading="lazy" />
                  <div className="ao-library-game-card-body">
                    <p className="ao-world-kicker">{game.ageTier}</p>
                    <h3>{game.label}</h3>
                    <p>{game.description}</p>
                    <div className="ao-library-game-meta"><span>{game.characters.join(" · ")}</span><span><Coins className="inline h-4 w-4" /> {game.rewardAmount} AC</span></div>
                    <button type="button" className="btn-outline mt-4 w-full" onClick={() => claimCompletion(game.id)} disabled={completeGame.isPending}>
                      {wasCompleted ? "Completion recorded" : isAuthenticated ? "Record completion" : "Explore as guest"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
          <p className="mt-4 text-sm text-white/55">AC is a non-cash universe reward. Guest play stays local; authenticated completions are recorded once by the server ledger.</p>
        </section>

        <ExternalContentSpots placement="library" />

        <section className="ao-safety-rail" aria-label="Library World safety promise">
          <span className="ao-safety-badge"><BookOpen className="h-4 w-4" /> LIBRARY RULES</span>
          <span>Source-aware</span>
          <span>Age-tiered</span>
          <span>Moderated before publish</span>
          <span>Always leaves a lesson</span>
        </section>
      </main>
    </div>
  );
}
