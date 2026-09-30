import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen, Compass, Search, Sparkles, Users, Video } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { AO_LIBRARY_WORLD } from "../../../shared/aoWorldContract";
import { ExternalContentSpots } from "@/components/ExternalContentSpots";

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
