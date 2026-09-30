import { ArrowLeft, Heart, Home, RotateCcw, Sparkles, Volume2, VolumeX } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AO_ART, aoArtUrl } from "../../../shared/aoArt";
import { useAOBridge } from "@/contexts/AOBridgeContext";
import { toast } from "sonner";
import { careEmotes, lanterns, isCareEmote, resolveLanternStep, type Emote, type LanternColor } from "@/lib/babaYagaGame";

type PuzzleState = "lanterns" | "emotes" | "warm-room" | "complete";

export default function BabaYagaGame() {
  const [, navigate] = useLocation();
  const bridge = useAOBridge();
  const [puzzle, setPuzzle] = useState<PuzzleState>("lanterns");
  const [lanternProgress, setLanternProgress] = useState(0);
  const [selectedEmote, setSelectedEmote] = useState<Emote | null>(null);
  const [glow, setGlow] = useState(() => {
    if (typeof window === "undefined") return 0;
    return Number(window.localStorage.getItem("ao_sprout_glow") || 0);
  });
  const [returnedHome, setReturnedHome] = useState(false);
  const [muted, setMuted] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("ao_baba_yaga_muted") === "true";
  });

  const mount = useMemo(() => {
    const mountName = bridge.mount.toLowerCase();
    if (mountName.includes("cyber")) return AO_ART.mounts.cyber;
    if (mountName.includes("gold")) return AO_ART.mounts.gold;
    if (mountName.includes("galaxy")) return AO_ART.mounts.galaxy;
    if (mountName.includes("aurora")) return AO_ART.mounts.aurora;
    return AO_ART.mounts.default;
  }, [bridge.mount]);

  useEffect(() => {
    window.localStorage.setItem("ao_sprout_glow", String(glow));
  }, [glow]);

  useEffect(() => {
    window.localStorage.setItem("ao_baba_yaga_muted", String(muted));
  }, [muted]);

  const cue = (message: string) => {
    if (!muted && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.rate = 0.82;
      utterance.pitch = 1.06;
      utterance.volume = 0.34;
      window.speechSynthesis.speak(utterance);
    }
  };

  const earnGlow = (amount: number, message: string) => {
    setGlow((current) => current + amount);
    toast.success(`+${amount} Glow — ${message}`);
    cue(message);
  };

  const handleLantern = (color: LanternColor) => {
    const next = resolveLanternStep(lanternProgress, color);
    if (next === null) {
      toast("The hut pauses. Try the warm path again.");
      cue("Try the warm path again");
      return;
    }

    setLanternProgress(next);
    cue(lanterns[lanternProgress].clue);
    if (next === lanterns.length) {
      earnGlow(2, "The children can see the safe path");
      setPuzzle("emotes");
    }
  };

  const handleEmote = (symbol: Emote) => {
    setSelectedEmote(symbol);
    if (isCareEmote(symbol)) {
      earnGlow(2, "Your care signal reached the warm room");
      setPuzzle("warm-room");
    } else {
      toast("Baba Yaga nods. Choose the signal that says: I am here with you.");
      cue("Choose the heart signal");
    }
  };

  const finishWarmRoom = () => {
    earnGlow(5, "The hut opens a safe way home");
    setPuzzle("complete");
    cue("Everybody comes home free");
  };

  const callOly = () => {
    setReturnedHome(true);
    setPuzzle("lanterns");
    setLanternProgress(0);
    setSelectedEmote(null);
    cue("Oly oly oxen free. You are home.");
  };

  const resetGame = () => {
    setReturnedHome(false);
    setPuzzle("lanterns");
    setLanternProgress(0);
    setSelectedEmote(null);
  };

  return (
    <div className="ao-baba-page min-h-screen text-white">
      <header className="ao-baba-nav">
        <div className="ao-baba-nav-inner">
          <Button variant="ghost" onClick={() => navigate("/games")} className="text-[#d8ae55] gap-2">
            <ArrowLeft className="h-4 w-4" /> Play Worlds
          </Button>
          <div className="flex items-center gap-3">
            <span className="ao-baba-nav-label">WILD EDGE // SPROUT HOUSE</span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={muted ? "Unmute guidance" : "Mute guidance"}
              onClick={() => setMuted((value) => !value)}
              className="text-[#d8ae55]"
            >
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </header>

      <main className="ao-baba-main">
        <section className="ao-baba-hero">
          <div className="ao-baba-hero-copy">
            <p className="ao-world-kicker">TATER & CLIFFORD // THE WARM ROOM</p>
            <h1>Baba Yaga is waiting at the edge of the path.</h1>
            <p className="ao-baba-intro">
              Follow the lanterns, send a care signal, and remember: the hut can move, but your way home stays open.
            </p>
            <div className="ao-baba-status-row" aria-live="polite">
              <span className="ao-baba-status"><Sparkles className="h-4 w-4" /> Glow {glow}</span>
              <span className="ao-baba-status"><Heart className="h-4 w-4" /> {bridge.houseName}</span>
              <span className="ao-baba-status">Sprout 3–6</span>
            </div>
          </div>

          <div className="ao-baba-art-stage" aria-label="Tater and Clifford identity companions">
            <div className="ao-baba-art-haze" />
            <img className="ao-baba-character ao-baba-tater" src={aoArtUrl(AO_ART.characters.tater)} alt="Tater, the scout" />
            <img className="ao-baba-character ao-baba-clifford" src={aoArtUrl(AO_ART.characters.clifford)} alt="Clifford, the protector" />
            <img className="ao-baba-mount" src={aoArtUrl(mount.art)} alt={`${mount.label} identity mount`} />
            {AO_ART.emotes.map((emote, index) => (
              <span key={emote} className={`ao-alive-emote ao-alive-emote-${index + 1}`} aria-hidden="true">{emote}</span>
            ))}
          </div>
        </section>

        <section className="ao-baba-game-grid">
          <Card className="ao-baba-puzzle-panel">
            <div className="ao-baba-panel-head">
              <div>
                <p className="ao-panel-kicker">OPEN PLAY // SAFE RETURN ALWAYS AVAILABLE</p>
                <h2>{puzzle === "lanterns" ? "Follow the warm lanterns" : puzzle === "emotes" ? "Send a care signal" : puzzle === "warm-room" ? "The children are inside" : "The warm room is open"}</h2>
              </div>
              <Button variant="outline" className="ao-oly-button" onClick={callOly}>
                <Home className="h-4 w-4" /> Oly Olly Oxen Free
              </Button>
            </div>

            {puzzle === "lanterns" && (
              <div className="ao-baba-puzzle-body">
                <p className="ao-puzzle-copy">Match the lanterns in the order Baba Yaga left them. There is no timer. The hut will wait.</p>
                <div className="ao-lantern-sequence" aria-label={`Lantern ${lanternProgress + 1} of ${lanterns.length}`}>
                  {lanterns.map((lantern, index) => (
                    <span key={lantern.color} className={`ao-sequence-dot ${index < lanternProgress ? "is-lit" : ""}`} />
                  ))}
                </div>
                <div className="ao-lantern-buttons">
                  {lanterns.map((lantern) => (
                    <button key={lantern.color} className={`ao-lantern ao-lantern-${lantern.color}`} onClick={() => handleLantern(lantern.color)} aria-label={`Choose ${lantern.label}`}>
                      <span className="ao-lantern-core" />
                      <span>{lantern.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {puzzle === "emotes" && (
              <div className="ao-baba-puzzle-body">
                <p className="ao-puzzle-copy">One child is looking toward the doorway. Choose the emote that says: “I am here with you.”</p>
                <div className="ao-care-emotes">
                  {careEmotes.map((item) => (
                    <button key={item.symbol} className={`ao-care-emote ${selectedEmote === item.symbol ? "is-selected" : ""}`} onClick={() => handleEmote(item.symbol)}>
                      <span className="ao-care-emote-symbol">{item.symbol}</span>
                      <span className="ao-care-emote-label">{item.label}</span>
                      <span className="ao-care-emote-meaning">{item.meaning}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {puzzle === "warm-room" && (
              <div className="ao-warm-room-copy">
                <div className="ao-warm-room-orbit" aria-hidden="true"><span>♡</span><span>✦</span><span>◌</span></div>
                <p>The children are safe, coloring by lantern-light. Baba Yaga lowers the hut’s legs and opens the door.</p>
                <Button className="ao-gold-button" onClick={finishWarmRoom}>Open the way home</Button>
              </div>
            )}

            {puzzle === "complete" && (
              <div className="ao-complete-state" aria-live="polite">
                <div className="ao-complete-mark"><Heart className="h-8 w-8" /></div>
                <div>
                  <p className="ao-panel-kicker">SAFE RETURN CONFIRMED</p>
                  <h3>Everybody comes home free.</h3>
                  <p>Your Glow, mount, and care signal stay with you.</p>
                </div>
                <Button variant="outline" className="ao-oly-button" onClick={resetGame}><RotateCcw className="h-4 w-4" /> Play again</Button>
              </div>
            )}
          </Card>

          <aside className="ao-baba-side-column">
            <Card className="ao-baba-story-card">
              <p className="ao-panel-kicker">BABA YAGA // WILD EDGE KEEPER</p>
              <h2>Not every frightening shape is your enemy.</h2>
              <p>She tests whether Tater and Clifford can listen, share the light, and keep the children together.</p>
              <div className="ao-baba-story-quote">“The hut can move. The way home stays.”</div>
            </Card>
            <Card className="ao-baba-oly-card">
              <p className="ao-panel-kicker">YOUR SAFE CALL</p>
              <h2>Oly Olly Oxen Free</h2>
              <p>Use it at any moment. Leaving never costs Glow or progress.</p>
              <Button className="ao-oly-button ao-oly-button-wide" onClick={callOly}><Home className="h-4 w-4" /> Come home free</Button>
            </Card>
          </aside>
        </section>

        {returnedHome && (
          <div className="ao-return-banner" role="status">
            <div><strong>You’re home.</strong><span>Nobody is tagged. The hut will be here when you are ready.</span></div>
            <Button variant="ghost" className="text-[#d8ae55]" onClick={() => setReturnedHome(false)}>Continue</Button>
          </div>
        )}
      </main>
    </div>
  );
}
