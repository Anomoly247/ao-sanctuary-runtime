import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Filter, Gamepad2, Globe2, Heart, Music2, Search, ShoppingBag, Star, Trophy, Users, X, Zap } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AO_ART, aoArtUrl } from "../../../shared/aoArt";
import { useAOBridge } from "@/contexts/AOBridgeContext";

const worlds = [
  { id: "sanctuary", label: "Sanctuary", eyebrow: "SAFE HOME WORLD", tier: "ALL AGES", category: "governance", path: "/", icon: Heart, description: "The calm center: lounges, missions, signals, and the shared safe call.", cta: "Return to Sanctuary", tone: "gold" },
  { id: "creator", label: "Creator Orbit", eyebrow: "MAKE TOGETHER", tier: "GUARDIAN GUIDED", category: "creative", path: "/collaboration", icon: Users, description: "Build, collaborate, and turn creative work into a kind action.", cta: "Make together", tone: "cyan" },
  { id: "play", label: "Play Worlds", eyebrow: "ARCADE SIGNAL", tier: "KIDS + GUARDIANS", category: "play", path: "/games", icon: Gamepad2, description: "Retro-inspired games, living mounts, and story pockets like Baba Yaga’s Hut.", cta: "You are here", tone: "cyan" },
  { id: "library", label: "Library World", eyebrow: "HIDDEN LESSONS", tier: "AGE-AWARE", category: "education", path: "/library", icon: BookOpen, description: "Videos, research trails, and curiosity quests that connect online life to real life.", cta: "Open Library", tone: "gold" },
  { id: "archive", label: "Archive", eyebrow: "MOUNTS + BADGES", tier: "ALL AGES", category: "rewards", path: "/merch", icon: ShoppingBag, description: "Keep earned glow, mounts, achievements, and the objects that remember your journey.", cta: "Visit Archive", tone: "gold" },
  { id: "anoms-corner", label: "Anom’s Corner", eyebrow: "THE CREATOR’S SIGNAL", tier: "COMMUNITY", category: "education", path: "/anoms-corner", icon: Globe2, description: "A living window for stories, social posts, videos, and the next strange idea.", cta: "Enter the Corner", tone: "cyan" },
  { id: "missions", label: "Mission Hub", eyebrow: "PLAY WITH PURPOSE", tier: "ALL AGES", category: "social", path: "/mission-hub", icon: Trophy, description: "Small connected actions that turn kindness, learning, and collaboration into progress.", cta: "Choose a mission", tone: "gold" },
  { id: "music", label: "Sound Garden", eyebrow: "AMBIENT SIGNAL", tier: "ALL AGES", category: "audio", path: "/music-library", icon: Music2, description: "Instrumentals and quiet soundscapes for moving through the universe at your own pace.", cta: "Listen inward", tone: "cyan" },
] as const;

// Trivia Game Component
function TriviaGame({ onClose, onComplete }: { onClose: () => void; onComplete: (score: number) => void }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const questions = [
    {
      q: "What is the capital of France?",
      options: ["London", "Paris", "Berlin", "Madrid"],
      correct: 1,
    },
    {
      q: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correct: 1,
    },
    {
      q: "What is the largest planet?",
      options: ["Earth", "Mars", "Jupiter", "Saturn"],
      correct: 2,
    },
    {
      q: "What color is the sky?",
      options: ["Green", "Blue", "Red", "Yellow"],
      correct: 1,
    },
    {
      q: "How many continents are there?",
      options: ["5", "6", "7", "8"],
      correct: 2,
    },
  ];

  const handleAnswer = (index: number) => {
    if (index === questions[currentQuestion].correct) {
      setScore(score + 20);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Card className="bg-[#000000] border border-[#00eaff] p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#d8ae55] mb-4">Game Over!</h2>
          <p className="text-4xl font-bold text-[#00eaff] mb-6">{score} Points</p>
          <div className="flex gap-4">
            <Button
              className="flex-1 btn-secondary"
              onClick={() => {
                onComplete(score);
                onClose();
              }}
            >
              Claim Reward
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setCurrentQuestion(0);
                setScore(0);
                setGameOver(false);
              }}
            >
              Play Again
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-[#000000] border border-[#00eaff] p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#d8ae55]">Trivia Challenge</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#cccccc]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-[#cccccc] text-sm mb-2">
            Question {currentQuestion + 1} / {questions.length}
          </p>
          <div className="w-full bg-[#0A0A10] rounded-full h-2">
            <div
              className="bg-transparent border border-[#00eaff] text-[#00eaff] h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#00eaff] mb-6">{questions[currentQuestion].q}</h3>

        <div className="grid grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option, idx) => (
            <Button
              key={idx}
              onClick={() => handleAnswer(idx)}
              className="btn-secondary h-16 text-base"
            >
              {option}
            </Button>
          ))}
        </div>

        <p className="text-center text-[#d8ae55] font-bold mt-6">Score: {score}</p>
      </Card>
    </div>
  );
}

// Memory Game Component
function MemoryGame({ onClose, onComplete }: { onClose: () => void; onComplete: (score: number) => void }) {
  const [cards, setCards] = useState<{ id: number; emoji: string; flipped: boolean; matched: boolean }[]>([
    { id: 1, emoji: "🌟", flipped: false, matched: false },
    { id: 2, emoji: "🌟", flipped: false, matched: false },
    { id: 3, emoji: "🎮", flipped: false, matched: false },
    { id: 4, emoji: "🎮", flipped: false, matched: false },
    { id: 5, emoji: "🚀", flipped: false, matched: false },
    { id: 6, emoji: "🚀", flipped: false, matched: false },
    { id: 7, emoji: "💎", flipped: false, matched: false },
    { id: 8, emoji: "💎", flipped: false, matched: false },
  ]);
  const [moves, setMoves] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const handleCardClick = (index: number) => {
    if (cards[index].flipped || cards[index].matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const flipped = newCards.filter((c) => c.flipped && !c.matched);
    if (flipped.length === 2) {
      setMoves(moves + 1);
      if (flipped[0].emoji === flipped[1].emoji) {
        setTimeout(() => {
          const updated = [...newCards];
          updated[newCards.indexOf(flipped[0])].matched = true;
          updated[newCards.indexOf(flipped[1])].matched = true;
          setCards(updated);

          if (updated.every((c) => c.matched)) {
            setGameOver(true);
          }
        }, 500);
      } else {
        setTimeout(() => {
          const updated = [...newCards];
          updated.forEach((c) => {
            if (!c.matched) c.flipped = false;
          });
          setCards(updated);
        }, 1000);
      }
    }
  };

  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <Card className="bg-[#000000] border border-[#00eaff] p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#d8ae55] mb-4">You Won!</h2>
          <p className="text-4xl font-bold text-[#00eaff] mb-2">{100 - moves * 5} Points</p>
          <p className="text-[#cccccc] mb-6">Completed in {moves} moves</p>
          <Button
            className="w-full btn-secondary"
            onClick={() => {
              onComplete(100 - moves * 5);
              onClose();
            }}
          >
            Claim Reward
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-[#000000] border border-[#00eaff] p-8 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#d8ae55]">Memory Game</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#cccccc]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {cards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className="w-16 h-16 bg-gradient-to-br from-[#d8ae55] to-[#d8ae55] rounded-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            >
              {card.flipped || card.matched ? card.emoji : "?"}
            </button>
          ))}
        </div>

        <p className="text-center text-[#00eaff] font-bold">Moves: {moves}</p>
      </Card>
    </div>
  );
}

// Mood Matcher Game Component
function MoodMatcherGame({ onClose, onComplete }: { onClose: () => void; onComplete: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);

  const moods = [
    { emoji: "😊", name: "Happy" },
    { emoji: "😢", name: "Sad" },
    { emoji: "😡", name: "Angry" },
    { emoji: "😴", name: "Sleepy" },
  ];

  const rounds = [
    { question: "When you win a game, you feel...", correct: "Happy" },
    { question: "When you lose your favorite toy, you feel...", correct: "Sad" },
    { question: "When someone takes your snack, you feel...", correct: "Angry" },
    { question: "After playing all day, you feel...", correct: "Sleepy" },
  ];

  const handleMoodClick = (mood: string) => {
    if (mood === rounds[round].correct) {
      setScore(score + 25);
    }

    if (round + 1 < rounds.length) {
      setRound(round + 1);
    } else {
      setTimeout(() => {
        onComplete(score + (mood === rounds[round].correct ? 25 : 0));
        onClose();
      }, 500);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <Card className="bg-[#000000] border border-[#00eaff] p-8 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#d8ae55]">Mood Matcher</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#cccccc]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-[#00eaff] text-lg mb-6 text-center font-bold">{rounds[round].question}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => handleMoodClick(mood.name)}
              className="p-4 bg-[#0A0A10] border border-[#08080f] rounded-lg hover:border-[#00eaff] transition-colors"
            >
              <div className="text-4xl mb-2">{mood.emoji}</div>
              <div className="text-sm text-[#cccccc]">{mood.name}</div>
            </button>
          ))}
        </div>

        <p className="text-center text-[#d8ae55] font-bold">Score: {score}</p>
      </Card>
    </div>
  );
}

export default function Games() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const bridge = useAOBridge();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});
  const [anomCoins, setAnomCoins] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    return Number(window.localStorage.getItem("ao_guest_anom_coins") || 0);
  });
  const [worldQuery, setWorldQuery] = useState("");
  const [worldCategory, setWorldCategory] = useState("all");

  useEffect(() => {
    window.localStorage.setItem("ao_guest_anom_coins", String(anomCoins));
  }, [anomCoins]);

  const mountKey = bridge.mount.toLowerCase();
  const activeMount = mountKey.includes("cyber")
    ? AO_ART.mounts.cyber
    : mountKey.includes("gold")
      ? AO_ART.mounts.gold
      : mountKey.includes("galaxy")
        ? AO_ART.mounts.galaxy
        : mountKey.includes("aurora")
          ? AO_ART.mounts.aurora
          : AO_ART.mounts.default;
  const mountColorFilter = bridge.mountColor === "gold"
    ? "hue-rotate(28deg) saturate(1.3)"
    : bridge.mountColor === "pearl"
      ? "grayscale(1) brightness(1.2)"
      : "saturate(1.15)";

  const saveGameScore = trpc.games.saveScore.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Failed to save game score");
    },
  });

  const games = [
    {
      id: "trivia",
      title: "Trivia Challenge",
      description: "Answer questions and test your knowledge!",
      icon: "🧠",
      difficulty: "Easy",
      reward: 50,
      component: TriviaGame,
    },
    {
      id: "memory",
      title: "Memory Game",
      description: "Match pairs of cards and test your memory!",
      icon: "🎮",
      difficulty: "Medium",
      reward: 75,
      component: MemoryGame,
    },
    {
      id: "mood-matcher",
      title: "Mood Matcher",
      description: "Match emotions to situations!",
      icon: "😊",
      difficulty: "Easy",
      reward: 40,
      component: MoodMatcherGame,
    },
  ];

  const filteredWorlds = worlds.filter((world) => {
    const query = worldQuery.trim().toLowerCase();
    const matchesQuery = !query || [world.label, world.eyebrow, world.description, world.tier, world.category].some((value) => value.toLowerCase().includes(query));
    const matchesCategory = worldCategory === "all" || world.category === worldCategory;
    return matchesQuery && matchesCategory;
  });

  const handleGameComplete = (gameId: string, score: number) => {
    setGameScores({ ...gameScores, [gameId]: score });
    setActiveGame(null);
    const coinsEarned = Math.max(10, Math.round(score / 2));
    setAnomCoins((current) => current + coinsEarned);
    if (isAuthenticated) {
      saveGameScore.mutate({ gameId, score });
    } else {
      toast.success(`+${coinsEarned} Anom Coins earned. Your guest wallet is saved on this device.`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Games...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A10] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#08080f] px-6 py-4 sticky top-0 bg-[#0A0A10]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#cccccc]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-info">Anom's Corner // Play Worlds</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <section className="ao-play-world-hero mb-10" style={{ backgroundImage: `linear-gradient(90deg, rgba(8,8,15,0.96), rgba(8,8,15,0.6)), url(${aoArtUrl('/backgrounds/05_moonlit_forest_spirit.jpg')})` }}>
          <div className="ao-play-world-copy">
            <p className="ao-world-kicker">AO UNIVERSE // ONE CONSTELLATION, MANY DOORS</p>
            <h2>Every world is part of the journey.</h2>
            <p>Play Worlds is not only a game corner. It is the map of the connected Sanctuary: a place to choose a world, carry your identity, and return with something that matters.</p>
            <Button className="btn-primary mt-5" onClick={() => navigate("/")}>
              Return to the live signal
            </Button>
          </div>
          <div className="ao-mount-identity" aria-label={`${activeMount.label} identity mount with emotion emotes`}>
            <span className="ao-mount-emote ao-mount-emote-1">{AO_ART.emotes[0]}</span>
            <span className="ao-mount-emote ao-mount-emote-2">{AO_ART.emotes[1]}</span>
            <span className="ao-mount-emote ao-mount-emote-3">{AO_ART.emotes[2]}</span>
            <span className="ao-mount-emote ao-mount-emote-4">{AO_ART.emotes[3]}</span>
            <img src={aoArtUrl(activeMount.art)} alt={`${activeMount.label} mount identity`} style={{ filter: mountColorFilter }} />
            <p>{activeMount.label}</p>
            <small>Identity mount · {bridge.houseName} · {bridge.mountColor}</small>
          </div>
        </section>
        <section className="ao-world-directory mb-12" aria-labelledby="world-directory-title">
          <div className="ao-world-directory-heading">
            <div>
              <p className="ao-world-kicker">THE WHOLE CONSTELLATION</p>
              <h2 id="world-directory-title">Choose your next doorway.</h2>
              <p>Worlds orbit the Sanctuary home signal. Games, learning, making, music, missions, and archive objects are different ways into the same safe universe.</p>
            </div>
            <span className="ao-analytics-local-note">{filteredWorlds.length} of {worlds.length} connected worlds</span>
          </div>
          <div className="ao-world-directory-tools" role="search" aria-label="Find a connected AO world">
            <label className="ao-world-search">
              <Search className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Search worlds</span>
              <input value={worldQuery} onChange={(event) => setWorldQuery(event.target.value)} placeholder="Search education, governance, missions…" type="search" />
            </label>
            <label className="ao-world-filter">
              <Filter className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only">Filter worlds by category</span>
              <select value={worldCategory} onChange={(event) => setWorldCategory(event.target.value)} aria-label="Filter worlds by category">
                <option value="all">All pathways</option>
                <option value="education">Education & stories</option>
                <option value="governance">Governance & safety</option>
                <option value="play">Play worlds</option>
                <option value="creative">Creative making</option>
                <option value="social">Social good</option>
                <option value="audio">Sound garden</option>
                <option value="rewards">Rewards & archive</option>
              </select>
            </label>
          </div>
          <p className="ao-world-directory-status" role="status" aria-live="polite">
            {filteredWorlds.length ? `Showing ${filteredWorlds.length} world${filteredWorlds.length === 1 ? "" : "s"}.` : "No worlds match that signal. Try another search or pathway."}
          </p>
          <div className="ao-world-directory-grid">
            {filteredWorlds.map((world) => {
              const Icon = world.icon;
              const isCurrent = world.path === "/games";
              return (
                <Card key={world.id} className={`ao-world-door ao-world-door-${world.tone} ${isCurrent ? "is-current" : ""}`}>
                  <div className="ao-world-door-orbit"><Icon className="h-5 w-5" /></div>
                  <div className="ao-world-door-copy">
                    <span className="ao-external-eyebrow">{world.eyebrow}</span>
                    <h3>{world.label}</h3>
                    <p>{world.description}</p>
                    <small>{world.tier}</small>
                  </div>
                  <Button className="btn-secondary" onClick={() => !isCurrent && navigate(world.path)} disabled={isCurrent}>
                    {world.cta}
                  </Button>
                </Card>
              );
            })}
          </div>
        </section>
        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            className="bg-[#000000] border border-[#08080f] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#cccccc] text-sm">Games Played</p>
                <p className="text-3xl font-bold text-[#d8ae55]">{Object.keys(gameScores).length}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-[#d8ae55] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#000000] border border-[#08080f] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#cccccc] text-sm">Anom Coins</p>
                <p className="text-3xl font-bold text-[#00eaff]">{anomCoins}</p>
              </div>
              <Zap className="w-8 h-8 text-[#00eaff] opacity-50" />
            </div>
            <p className="text-xs text-[#cccccc] mt-2">Anom Coins · game currency</p>
          </Card>

          <Card
            className="bg-[#000000] border border-[#08080f] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#cccccc] text-sm">Games Available</p>
                <p className="text-3xl font-bold text-[#d8ae55]">{games.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-[#d8ae55] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Games Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => {
            const GameComponent = game.component;
            return (
              <Card
                key={game.id}
                className="bg-[#000000] border border-[#08080f] p-6 hover:border-[#00eaff] transition-colors"
                style={{
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
                }}
              >
                <div className="text-5xl mb-4 text-center">{game.icon}</div>
                <h3 className="text-lg font-bold text-[#00eaff] mb-2">{game.title}</h3>
                <p className="text-sm text-[#cccccc] mb-4">{game.description}</p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#08080f]">
                  <span className="text-xs px-2 py-1 bg-[#0A0A10] rounded text-[#cccccc]">
                    {game.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 bg-[#0A0A10] rounded text-[#d8ae55] flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {gameScores[game.id] || game.reward} pts
                  </span>
                </div>

                {gameScores[game.id] && (
                  <div className="mb-4">
                    <p className="text-xs text-[#cccccc] mb-1">Best Score</p>
                    <p className="text-2xl font-bold text-[#00eaff] flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#d8ae55]" />
                      {gameScores[game.id]}
                    </p>
                  </div>
                )}

                <Button
                  className="w-full btn-primary gap-2"
                  onClick={() => setActiveGame(game.id)}
                >
                  <Gamepad2 className="w-4 h-4" />
                  Play Now
                </Button>

                {activeGame === game.id && (
                  <GameComponent
                    onClose={() => setActiveGame(null)}
                    onComplete={(score) => handleGameComplete(game.id, score)}
                  />
                )}
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
