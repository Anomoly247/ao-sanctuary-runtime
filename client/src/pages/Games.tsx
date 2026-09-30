import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, Trophy, Zap, Star, X } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

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
        <Card className="bg-[#1e293b] border border-[#c4b5fd] p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#c4b5fd] mb-4">Game Over!</h2>
          <p className="text-4xl font-bold text-[#93c5fd] mb-6">{score} Points</p>
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
      <Card className="bg-[#1e293b] border border-[#c4b5fd] p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#c4b5fd]">Trivia Challenge</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#94a3b8]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-6">
          <p className="text-[#94a3b8] text-sm mb-2">
            Question {currentQuestion + 1} / {questions.length}
          </p>
          <div className="w-full bg-[#0f172a] rounded-full h-2">
            <div
              className="bg-[#c4b5fd] h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <h3 className="text-xl font-bold text-[#93c5fd] mb-6">{questions[currentQuestion].q}</h3>

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

        <p className="text-center text-[#c4b5fd] font-bold mt-6">Score: {score}</p>
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
        <Card className="bg-[#1e293b] border border-[#c4b5fd] p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-[#c4b5fd] mb-4">You Won!</h2>
          <p className="text-4xl font-bold text-[#93c5fd] mb-2">{100 - moves * 5} Points</p>
          <p className="text-[#94a3b8] mb-6">Completed in {moves} moves</p>
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
      <Card className="bg-[#1e293b] border border-[#c4b5fd] p-8 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#c4b5fd]">Memory Game</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#94a3b8]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-6">
          {cards.map((card, idx) => (
            <button
              key={idx}
              onClick={() => handleCardClick(idx)}
              className="w-16 h-16 bg-gradient-to-br from-[#c4b5fd] to-[#a5b4fc] rounded-lg flex items-center justify-center text-2xl hover:scale-110 transition-transform"
            >
              {card.flipped || card.matched ? card.emoji : "?"}
            </button>
          ))}
        </div>

        <p className="text-center text-[#93c5fd] font-bold">Moves: {moves}</p>
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
      <Card className="bg-[#1e293b] border border-[#c4b5fd] p-8 max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-[#c4b5fd]">Mood Matcher</h2>
          <Button variant="ghost" onClick={onClose} className="text-[#94a3b8]">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <p className="text-[#93c5fd] text-lg mb-6 text-center font-bold">{rounds[round].question}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {moods.map((mood) => (
            <button
              key={mood.name}
              onClick={() => handleMoodClick(mood.name)}
              className="p-4 bg-[#0f172a] border border-[#334155] rounded-lg hover:border-[#c4b5fd] transition-colors"
            >
              <div className="text-4xl mb-2">{mood.emoji}</div>
              <div className="text-sm text-[#94a3b8]">{mood.name}</div>
            </button>
          ))}
        </div>

        <p className="text-center text-[#c4b5fd] font-bold">Score: {score}</p>
      </Card>
    </div>
  );
}

export default function Games() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [gameScores, setGameScores] = useState<Record<string, number>>({});

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

  const handleGameComplete = (gameId: string, score: number) => {
    setGameScores({ ...gameScores, [gameId]: score });
    setActiveGame(null);
    // Save the game score to the backend and award coins
    saveGameScore.mutate({ gameId, score });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#93c5fd] text-xl">Loading Games...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#93c5fd] text-xl mb-4">Please sign in to play games</p>
          <Button className="btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const totalRewards = Object.values(gameScores).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#93c5fd]">
      {/* Navigation */}
      <nav className="border-b border-[#334155] px-6 py-4 sticky top-0 bg-[#0f172a]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#94a3b8]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-info">Mini-Games Arcade</h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card
            className="bg-[#1e293b] border border-[#334155] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Games Played</p>
                <p className="text-3xl font-bold text-[#c4b5fd]">{Object.keys(gameScores).length}</p>
              </div>
              <Gamepad2 className="w-8 h-8 text-[#c4b5fd] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1e293b] border border-[#334155] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Total Points</p>
                <p className="text-3xl font-bold text-[#93c5fd]">{totalRewards}</p>
              </div>
              <Zap className="w-8 h-8 text-[#93c5fd] opacity-50" />
            </div>
          </Card>

          <Card
            className="bg-[#1e293b] border border-[#334155] p-6"
            style={{
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
            }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Games Available</p>
                <p className="text-3xl font-bold text-[#a5b4fc]">{games.length}</p>
              </div>
              <Trophy className="w-8 h-8 text-[#a5b4fc] opacity-50" />
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
                className="bg-[#1e293b] border border-[#334155] p-6 hover:border-[#c4b5fd] transition-colors"
                style={{
                  boxShadow: "0 4px 12px rgba(15, 23, 42, 0.18)",
                }}
              >
                <div className="text-5xl mb-4 text-center">{game.icon}</div>
                <h3 className="text-lg font-bold text-[#93c5fd] mb-2">{game.title}</h3>
                <p className="text-sm text-[#94a3b8] mb-4">{game.description}</p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#334155]">
                  <span className="text-xs px-2 py-1 bg-[#0f172a] rounded text-[#94a3b8]">
                    {game.difficulty}
                  </span>
                  <span className="text-xs px-2 py-1 bg-[#0f172a] rounded text-[#c4b5fd] flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    {gameScores[game.id] || game.reward} pts
                  </span>
                </div>

                {gameScores[game.id] && (
                  <div className="mb-4">
                    <p className="text-xs text-[#94a3b8] mb-1">Best Score</p>
                    <p className="text-2xl font-bold text-[#93c5fd] flex items-center gap-2">
                      <Star className="w-5 h-5 text-[#c4b5fd]" />
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
