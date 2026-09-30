import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Mail, Heart, Zap, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function HomepageIntegration() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleEmailSubscribe = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setIsSubscribed(true);
    toast.success("Welcome to the newsletter! 📬");
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  // Sample upcoming events
  const upcomingEvents = [
    { date: "May 20", title: "Community Game Night", icon: "🎮" },
    { date: "May 25", title: "Collaboration Challenge", icon: "🤝" },
    { date: "June 1", title: "Merch Design Contest", icon: "🎨" },
  ];

  // Sample community members
  const communityMembers = [
    { name: "Alex", level: 15, coins: 2500 },
    { name: "Jordan", level: 12, coins: 1800 },
    { name: "Sam", level: 18, coins: 3200 },
    { name: "Casey", level: 10, coins: 1200 },
  ];

  return (
    <div className="space-y-12">
      {/* Calendar Section */}
      <section className="bg-[#141423] border border-[#2b2b42] rounded-lg p-8" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="w-6 h-6 text-[#00eaff]" />
          <h3 className="text-2xl font-bold text-[#ff00c8]">Upcoming Events</h3>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {upcomingEvents.map((event, idx) => (
            <Card
              key={idx}
              className="bg-[#04040a] border border-[#2b2b42] p-4 hover:border-[#00eaff] transition-colors"
            >
              <div className="text-3xl mb-2">{event.icon}</div>
              <p className="text-[#cccccc] text-sm mb-1">{event.date}</p>
              <p className="text-[#00eaff] font-bold">{event.title}</p>
              <Button size="sm" className="btn-secondary mt-3 w-full text-xs">
                Learn More
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Contacts / Community Members Section */}
      <section className="bg-[#141423] border border-[#2b2b42] rounded-lg p-8" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-[#ff00c8]" />
          <h3 className="text-2xl font-bold text-[#00eaff]">Community Highlights</h3>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {communityMembers.map((member, idx) => (
            <Card
              key={idx}
              className="bg-[#04040a] border border-[#2b2b42] p-4 hover:border-[#ff00c8] transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff00c8] to-[#00eaff] flex items-center justify-center text-white font-bold">
                  {member.name[0]}
                </div>
                <Trophy className="w-4 h-4 text-[#d8ae55]" />
              </div>
              <p className="text-[#00eaff] font-bold text-sm">{member.name}</p>
              <p className="text-xs text-[#cccccc] mb-2">Level {member.level}</p>
              <div className="flex items-center gap-1 text-xs text-[#ff00c8]">
                <Zap className="w-3 h-3" />
                {member.coins} coins
              </div>
              <Button size="sm" className="btn-primary mt-3 w-full text-xs">
                View Profile
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Email Newsletter Section */}
      <section className="bg-gradient-to-r from-[#141423] to-[#2b2b42] border border-[#2b2b42] rounded-lg p-8" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
        <div className="flex items-start gap-4">
          <Mail className="w-8 h-8 text-[#d8ae55] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-[#ff00c8] mb-2">Stay Connected</h3>
            <p className="text-[#cccccc] mb-4">
              Get weekly updates on new collaborations, game tournaments, and community highlights. Join {Math.floor(Math.random() * 5000) + 1000}+ subscribers.
            </p>

            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleEmailSubscribe()}
                className="bg-[#04040a] border border-[#2b2b42] text-[#00eaff] flex-1"
              />
              <Button
                className="btn-secondary"
                onClick={handleEmailSubscribe}
                disabled={isSubscribed}
              >
                {isSubscribed ? "✓ Subscribed" : "Subscribe"}
              </Button>
            </div>

            <p className="text-xs text-[#cccccc] mt-3">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="bg-[#141423] border border-[#2b2b42] rounded-lg p-8" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
        <h3 className="text-2xl font-bold text-[#ff00c8] mb-6">Get in Touch</h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[#00eaff] font-bold mb-2">Your Name</label>
            <Input
              placeholder="Full name"
              className="bg-[#04040a] border border-[#2b2b42] text-[#00eaff]"
            />
          </div>

          <div>
            <label className="block text-[#00eaff] font-bold mb-2">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              className="bg-[#04040a] border border-[#2b2b42] text-[#00eaff]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[#00eaff] font-bold mb-2">Message</label>
            <textarea
              placeholder="Tell us what you think..."
              className="w-full bg-[#04040a] border border-[#2b2b42] text-[#00eaff] p-3 rounded min-h-24"
            />
          </div>

          <div className="md:col-span-2">
            <Button className="w-full btn-primary text-lg py-6">
              Send Message
            </Button>
          </div>
        </div>
      </section>

      {/* Social Links */}
      <section className="text-center py-8">
        <p className="text-[#cccccc] mb-4">Follow us on social media</p>
        <div className="flex justify-center gap-4">
          <Button variant="outline" className="text-[#00eaff] border-[#2b2b42] gap-2">
            <Heart className="w-4 h-4" />
            Twitter
          </Button>
          <Button variant="outline" className="text-[#ff00c8] border-[#2b2b42] gap-2">
            <Heart className="w-4 h-4" />
            Discord
          </Button>
          <Button variant="outline" className="text-[#d8ae55] border-[#2b2b42] gap-2">
            <Heart className="w-4 h-4" />
            Instagram
          </Button>
        </div>
      </section>
    </div>
  );
}
