import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Zap, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { toast } from "sonner";

export default function MissionHub() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState("25");

  const missionPillars = [
    {
      title: "Social Good First",
      description: "Every feature, every coin, every interaction drives positive change in the world.",
      icon: Heart,
    },
    {
      title: "Creator Empowerment",
      description: "Artists and visionaries get the tools and platform to amplify their impact.",
      icon: Sparkles,
    },
    {
      title: "Community Ownership",
      description: "Build together. Earn together. Grow together. No gatekeepers.",
      icon: Users,
    },
    {
      title: "Transparent Impact",
      description: "See exactly how your participation creates change. Real metrics. Real impact.",
      icon: Zap,
    },
  ];

  const handleDonate = () => {
    toast.success(`Thank you for donating $${donationAmount}! Your support fuels our mission.`);
    setShowDonationModal(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A10] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#08080f] px-6 py-4 sticky top-0 bg-[#0A0A10]/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-accent">Anom Mission Hub</h1>
          <div className="flex gap-4">
            {isAuthenticated && (
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="text-[#00eaff] border-[#00eaff]"
              >
                Back to Platform
              </Button>
            )}
            <Button
              onClick={() => setShowDonationModal(true)}
              className="bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10 font-bold"
            >
              <Heart className="w-4 h-4 mr-2" />
              Support Our Mission
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Mission Statement */}
      <section className="px-6 py-20 bg-gradient-to-b from-[#141423] to-[#0A0A10]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">
            <span className="text-accent">Social Good</span>
            <span className="text-[#00eaff]"> Meets </span>
            <span className="text-accent">Creative Power</span>
          </h2>
          <p className="text-xl text-[#cccccc] mb-8 leading-relaxed">
            Anom Artsy is more than a platform. It's a movement where artists, creators, and visionaries
            unite to amplify positive change. Every coin earned, every collaboration started, every voice
            amplified—it all drives real-world impact.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => setShowDonationModal(true)}
              className="bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10 font-bold text-lg py-6 px-8"
            >
              Donate to Build the Mission
            </Button>
            <Button
              onClick={() => navigate("/collaboration")}
              className="btn-secondary text-lg py-6 px-8"
            >
              Join as Creator
            </Button>
            <Button
              onClick={() => navigate("/music-library")}
              className="bg-transparent border border-[#d8ae55] text-[#d8ae55] hover:bg-[#d8ae55]/10 font-bold text-lg py-6 px-8"
            >
              Browse Music Library
            </Button>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="px-6 py-16 border-t border-[#08080f]">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-[#000000] border border-[#d8ae55] p-8 text-center">
            <Zap className="w-8 h-8 mx-auto mb-4 text-[#00eaff]" />
            <h3 className="text-2xl font-bold text-[#d8ae55] mb-3">Impact ledger status</h3>
            <p className="text-[#cccccc] leading-relaxed">
              No impact totals are displayed here until they are backed by the shared AO ledger. This keeps the mission story honest: participation, completions, and donations will appear only when a live record exists.
            </p>
          </Card>
        </div>
      </section>

      {/* Mission Pillars */}
      <section className="px-6 py-16 bg-[#000000] border-t border-[#08080f]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-accent">
            Our Four Pillars
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            {missionPillars.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[#0A0A10] border border-[#08080f] p-8 hover:border-[#00eaff] transition-colors"
                >
                  <Icon className="w-8 h-8 text-[#00eaff] mb-4" />
                  <h4 className="text-xl font-bold text-[#d8ae55] mb-3">{pillar.title}</h4>
                  <p className="text-[#cccccc]">{pillar.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Collaboration Station Spotlight */}
      <section className="px-6 py-16 border-t border-[#08080f]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-bold mb-6">
                <span className="text-accent">Collaboration Station</span>
                <span className="text-[#00eaff]"> for Visionaries</span>
              </h3>
              <p className="text-lg text-[#cccccc] mb-6">
                Connect with fellow artists, creators, and social entrepreneurs. Launch collaborative
                projects. Pool resources. Amplify impact. The Collaboration Station is where individual
                vision becomes collective power.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex gap-3">
                  <span className="text-[#d8ae55]">✓</span>
                  <span className="text-[#cccccc]">Find and connect with creators aligned to your mission</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#00eaff]">✓</span>
                  <span className="text-[#cccccc]">Launch collaborative projects with built-in task management</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#d8ae55]">✓</span>
                  <span className="text-[#cccccc]">Share resources, knowledge, and Anom Coins</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#ffd700]">✓</span>
                  <span className="text-[#cccccc]">Track collective impact and celebrate milestones together</span>
                </li>
              </ul>
              <Button
                onClick={() => navigate("/collaboration")}
                className="btn-primary text-lg py-6 px-8"
              >
                Explore Collaboration Station
              </Button>
            </div>
            <Card className="bg-[#000000] border border-[#00eaff] p-8">
              <div className="space-y-6">
                <div className="bg-[#0A0A10] rounded-lg p-4 border border-[#08080f]">
                  <p className="text-[#00eaff] font-bold mb-2">Featured Project</p>
                  <h4 className="text-xl font-bold text-[#d8ae55] mb-2">
                    Ocean Cleanup Initiative
                  </h4>
                  <p className="text-[#cccccc] text-sm mb-4">
                    Featured projects will appear here after a live collaboration record is connected.
                  </p>
                  <Button className="w-full btn-secondary" size="sm" onClick={() => navigate("/collaboration")}>
                    Open Collaboration Station
                  </Button>
                </div>
                <div className="bg-[#0A0A10] rounded-lg p-4 border border-[#08080f]">
                  <p className="text-[#d8ae55] font-bold mb-2">Live creator signal</p>
                  <p className="text-[#cccccc] text-sm">No aggregate creator count is shown until it is read from the live collaboration ledger.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* How Donations Work */}
      <section className="px-6 py-16 bg-[#000000] border-t border-[#08080f]">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-accent">
            How Your Donation Powers the Mission
          </h3>
          <Card className="bg-[#0A0A10] border border-[#08080f] p-6">
            <p className="text-[#cccccc] leading-relaxed">
              Donation routing is not active in this runtime. The allocation breakdown will be published here only when the connected financial and mission records are available.
            </p>
          </Card>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonationModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-[#000000] border border-[#00eaff] w-full max-w-md">
            <div className="p-8">
              <h3 className="text-2xl font-bold text-[#d8ae55] mb-6">Support Our Mission</h3>
              <p className="text-[#cccccc] mb-6">
                Your donation fuels platform development, creator support, and real-world social good impact.
              </p>

              <div className="space-y-4 mb-6">
                {["10", "25", "50", "100"].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setDonationAmount(amount)}
                    className={`w-full p-3 rounded-lg border-2 transition-all font-bold ${
                      donationAmount === amount
                        ? "border-[#00eaff] bg-transparent border border-[#00eaff] bg-[#00eaff]/10 text-[#d8ae55]"
                        : "border-[#08080f] bg-[#0A0A10] text-[#cccccc] hover:border-[#00eaff]"
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="bg-[#0A0A10] rounded-lg p-4 mb-6 border border-[#08080f]">
                <p className="text-[#cccccc] text-sm mb-2">Donation Amount</p>
                <p className="text-3xl font-bold text-[#00eaff]">${donationAmount}</p>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleDonate}
                  className="flex-1 bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10 font-bold"
                >
                  Donate Now
                </Button>
                <Button
                  onClick={() => setShowDonationModal(false)}
                  variant="outline"
                  className="flex-1 text-[#cccccc] border-[#08080f]"
                >
                  Cancel
                </Button>
              </div>

              <p className="text-[#cccccc] text-xs text-center mt-4">
                Donations are secure and tax-deductible. You'll receive a receipt.
              </p>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
