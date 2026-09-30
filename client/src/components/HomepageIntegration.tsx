import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Users, Mail, Heart, Zap, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AO_SAFETY_LAYERS } from "../../../shared/aoWorldContract";

export default function HomepageIntegration() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleEmailSubscribe = () => {
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    setIsSubscribed(true);
    toast.success("Welcome to the universe signal!");
    setEmail("");
    setTimeout(() => setIsSubscribed(false), 3000);
  };

  const upcomingEvents = [
    { date: "MAY 20", title: "Community Game Night", icon: "🎮", signal: "PLAY" },
    { date: "MAY 25", title: "Collaboration Challenge", icon: "🤝", signal: "CREATE" },
    { date: "JUNE 01", title: "Merch Design Contest", icon: "🎨", signal: "GLOW" },
  ];

  const communityMembers = [
    { name: "Alex", level: 15, coins: 2500 },
    { name: "Jordan", level: 12, coins: 1800 },
    { name: "Sam", level: 18, coins: 3200 },
    { name: "Casey", level: 10, coins: 1200 },
  ];

  return (
    <div className="ao-constellation">
      <section className="ao-constellation-heading" aria-labelledby="events-title">
        <div>
          <p className="ao-world-kicker">CONSTELLATION // UPCOMING SIGNALS</p>
          <h3 id="events-title">World events are gathering.</h3>
        </div>
        <p><Calendar className="mr-2 inline-block h-4 w-4 text-[#00eaff]" />Speak in emotes. Join the orbit.</p>
      </section>

      <div className="ao-event-field">
        {upcomingEvents.map((event) => (
          <button type="button" className="ao-event-orbit" key={event.title} onClick={() => toast.info(`${event.title} is coming into orbit.`)}>
            <span className="ao-event-icon" aria-hidden="true">{event.icon}</span>
            <span className="ao-event-date">{event.date} · {event.signal}</span>
            <span className="ao-event-title">{event.title}</span>
            <span className="ao-event-note">A moderated gathering for play, kindness, and creative connection.</span>
          </button>
        ))}
      </div>

      <section className="ao-community-current" aria-labelledby="community-title">
        <div className="ao-constellation-heading">
          <div>
            <p className="ao-world-kicker">COMMUNITY CURRENT // SAFE SOCIAL PLAY</p>
            <h3 id="community-title">Players in orbit.</h3>
          </div>
          <p><Users className="mr-2 inline-block h-4 w-4 text-[#d8ae55]" />Glow together, with guardians watching the gates.</p>
        </div>
        <div className="ao-member-field">
          {communityMembers.map((member) => (
            <button type="button" className="ao-member-orbit" key={member.name} onClick={() => toast.info(`Opening ${member.name}'s safe profile signal.`)}>
              <span className="ao-member-orb" aria-hidden="true">{member.name[0]}</span>
              <span>
                <span className="ao-member-name">{member.name} <Trophy className="ml-1 inline-block h-3 w-3 text-[#d8ae55]" /></span>
                <span className="ao-member-meta">LEVEL {member.level} · <Zap className="mr-1 inline-block h-3 w-3 text-[#d8ae55]" />{member.coins} AC</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="ao-transmission" aria-labelledby="transmission-title">
        <div className="ao-transmission-layout">
          <div>
            <p className="ao-world-kicker">SEND A SIGNAL // MODERATED TRANSMISSION</p>
            <h3 id="transmission-title">Keep the universe breathing.</h3>
            <p>Share a thought, a kind idea, or a world you want to see. Profiles use simple choices and words — no code, no unsafe gates.</p>
            <p className="ao-transmission-privacy"><Mail className="mr-1 inline-block h-3 w-3" />Your signal stays inside the Sanctuary rules.</p>
          </div>
          <div className="ao-transmission-form">
            <Input placeholder="Your name" className="bg-black border-[#d8ae55]/50 text-white" aria-label="Your name" />
            <Input type="email" placeholder="your@email.com" value={email} onChange={(event) => setEmail(event.target.value)} onKeyDown={(event) => event.key === "Enter" && handleEmailSubscribe()} className="bg-black border-[#d8ae55]/50 text-white" aria-label="Email address" />
            <textarea placeholder="Write a simple signal..." className="min-h-24 rounded-md border border-[#d8ae55]/50 bg-black p-3 text-sm text-white outline-none placeholder:text-white/35 focus:border-[#00eaff] md:col-span-2" aria-label="Your message" />
            <div className="flex flex-wrap items-center gap-3 md:col-span-2">
              <Button type="button" className="btn-primary" onClick={() => toast.success("Signal held for moderation.")}>Send Signal</Button>
              <Button type="button" className="btn-secondary" onClick={handleEmailSubscribe} disabled={isSubscribed}>
                {isSubscribed ? "✓ Subscribed" : "Follow the Orbit"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="ao-safety-rail" aria-label="Safety and age-tier promise">
        <span className="ao-safety-badge"><Heart className="h-4 w-4" /> SAFE BY DESIGN</span>
        {AO_SAFETY_LAYERS.map((layer) => <span key={layer}>{layer.replace(/^./, (letter) => letter.toUpperCase())}</span>)}
        <span>Online identity ↔ real life</span>
      </section>
    </div>
  );
}
