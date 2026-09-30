import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Share2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

export default function MissionRally() {
  const { isAuthenticated, user } = useAuth();
  const [isPledged, setIsPledged] = useState(false);

  const handlePledge = () => {
    setIsPledged(true);
    toast.success("You've joined the mission! Welcome to the movement.");
  };

  const handleShare = () => {
    const url = `${window.location.origin}/mission`;
    navigator.clipboard.writeText(url);
    toast.success("Mission link copied! Share it with your network.");
  };

  return (
    <div className="min-h-screen bg-[#0A0A10] text-[#00eaff]">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-[#d8ae55]/10 to-[#00eaff]/10 pointer-events-none" />
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-accent">
              The Anom Mission Rally
            </h1>
            <p className="text-xl text-[#cccccc] mb-4 max-w-3xl mx-auto">
              Unite your physical and digital identity. Make real-world impact. Build the future together.
            </p>
            <p className="text-lg text-[#00eaff] font-bold">
              Every action counts. Every voice matters. Every person can change the world.
            </p>
          </div>

          {/* Mission Statement */}
          <Card
            className="bg-[#000000] border-2 border-[#00eaff] p-12 mb-12 text-center"
            style={{
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
            }}
          >
            <h2 className="text-3xl font-bold text-[#d8ae55] mb-6">Our Mission</h2>
            <p className="text-lg text-[#00eaff] mb-6 leading-relaxed">
              Anom Artsy is more than a platform—it's a movement. We believe that your digital identity and physical impact are one and the same. By connecting your authentic self with meaningful action, we're building a world where social good isn't just a goal—it's a way of life.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                className="btn-primary"
                onClick={handlePledge}
                disabled={isPledged}
              >
                {isPledged ? "✓ Mission Pledged" : "Take the Pledge"}
              </Button>
              <Button
                className="btn-secondary"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share the Mission
              </Button>
            </div>
          </Card>
        </div>
      </section>

      <section className="py-16 px-6 bg-[#0A0A10]/50">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-[#000000] border border-[#d8ae55] p-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-info">Live impact, when connected</h2>
            <p className="text-[#cccccc] leading-relaxed">
              This page does not invent totals, stories, or rankings. The shared AO ledger will publish verified participation here once the live mission records are available.
            </p>
          </Card>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-accent">
            Our Core Values
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: "🤝",
                title: "Community First",
                desc: "We lift each other up. Your success is our success.",
              },
              {
                icon: "🌍",
                title: "Global Impact",
                desc: "Think globally, act locally. Make change wherever you are.",
              },
              {
                icon: "✨",
                title: "Authentic Identity",
                desc: "Be yourself. Your real self has real power to change the world.",
              },
              {
                icon: "🎯",
                title: "Measurable Change",
                desc: "We track impact. We celebrate progress. We celebrate you.",
              },
              {
                icon: "🚀",
                title: "Innovation for Good",
                desc: "Technology serves humanity. Always.",
              },
              {
                icon: "💜",
                title: "Radical Empathy",
                desc: "We see you. We hear you. We stand with you.",
              },
            ].map((value, idx) => (
              <Card
                key={idx}
                className="bg-[#000000] border border-[#08080f] p-6 hover:border-[#00eaff] transition-colors"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-[#d8ae55] mb-2">{value.title}</h3>
                <p className="text-[#cccccc]">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 bg-gradient-to-r from-[#d8ae55]/10 to-[#00eaff]/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-accent">
            Ready to Join the Movement?
          </h2>
          <p className="text-lg text-[#cccccc] mb-8">
            Your digital identity + your real-world impact = infinite possibilities. Start collaborating on social good projects today.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button className="btn-primary text-lg px-8 py-6">
              Start Collaborating
            </Button>
            <Button className="btn-secondary text-lg px-8 py-6">
              Explore Projects
            </Button>
            <Button className="btn-tertiary text-lg px-8 py-6">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
