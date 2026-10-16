import { useMemo, useState } from "react";
import { ArrowLeft, CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { AO_TROLL_CRUSH_COMPLETION_CONTRACT } from "../../../shared/aoWorldKinds";

const ROUNDS = [
  { id: "signal", prompt: "A noisy signal blocks the path. What helps?", choices: ["Pause and notice", "Rush ahead", "Share a private detail"], safe: 0 },
  { id: "boundary", prompt: "A troll asks for more access than it needs. What is the kind response?", choices: ["Ignore every boundary", "Keep the boundary and ask a trusted grown-up", "Give away the passcode"], safe: 1 },
  { id: "route", prompt: "The final route opens when the team agrees. What moves the group forward?", choices: ["Listen, choose, and try again", "Compete for the loudest voice", "Skip the safety check"], safe: 0 },
] as const;

export default function TrollCrushRouter() {
  const { isAuthenticated } = useAuth();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [roundIndex, setRoundIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [guardianConfirmed, setGuardianConfirmed] = useState(false);
  const [complete, setComplete] = useState(false);
  const [guestSession, setGuestSession] = useState(false);
  const startSession = trpc.ao.startTrollCrushSession.useMutation();
  const completeSession = trpc.ao.completeTrollCrushSession.useMutation();
  const round = ROUNDS[roundIndex];
  const progress = useMemo(() => `${roundIndex + 1} of ${ROUNDS.length}`, [roundIndex]);

  const begin = async () => {
    if (!guardianConfirmed) {
      toast.error("Confirm the guardian-guided boundary before entering.");
      return;
    }
    if (isAuthenticated) {
      const result = await startSession.mutateAsync({ guardianConfirmed: true });
      setSessionId(result.sessionId);
    } else {
      setGuestSession(true);
      setSessionId(`guest-${crypto.randomUUID()}`);
      toast.info("Guest session active. Sign in later if you want the completion recorded.");
    }
    setRoundIndex(0);
    setScore(0);
    setComplete(false);
  };

  const choose = async (choiceIndex: number) => {
    const nextScore = score + (choiceIndex === round.safe ? 100 : 25);
    setScore(nextScore);
    if (roundIndex < ROUNDS.length - 1) {
      setRoundIndex((value) => value + 1);
      return;
    }
    if (isAuthenticated && sessionId && !guestSession) {
      await completeSession.mutateAsync({
        sessionId,
        completionEvent: AO_TROLL_CRUSH_COMPLETION_CONTRACT.completionEvent,
        completedRounds: ROUNDS.length,
        score: nextScore,
        guardianConfirmed,
      });
      toast.success("Troll Crush session recorded. No wallet reward was created.");
    } else {
      toast.success("Session complete. Guest progress stays local to this session.");
    }
    setComplete(true);
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link href="/games" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#00eaff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00eaff]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Play Worlds
        </Link>
        <header className="mb-8 mt-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[#00eaff]">House 4 / guardian-guided session</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#d8ae55] sm:text-6xl">Troll Crush, calmly.</h1>
          <p className="mt-4 text-lg leading-8 text-white/70">A three-round signal puzzle about boundaries, listening, and safe choices. There is no public leaderboard and no cash conversion.</p>
        </header>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]" aria-label="Troll Crush playable session">
          <Card className="border-[#00eaff]/25 bg-[#08080f]/85 p-6 sm:p-8">
            {!sessionId ? (
              <div className="space-y-6">
                <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-[#00eaff]" aria-hidden="true" /><div><h2 className="text-2xl font-semibold text-white">Before the door opens</h2><p className="mt-2 text-sm leading-6 text-white/65">A guardian-guided space keeps the choices simple, private, and kind. The server records only an approved completion event for signed-in players.</p></div></div>
                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#d8ae55]/35 bg-[#141423]/60 p-4 text-sm text-white/80"><input type="checkbox" checked={guardianConfirmed} onChange={(event) => setGuardianConfirmed(event.target.checked)} className="mt-1 accent-[#00eaff]" /> <span>I understand this is a guardian-guided, non-cash session with no public leaderboard.</span></label>
                <Button type="button" onClick={begin} disabled={!guardianConfirmed || startSession.isPending} className="min-h-11 rounded-full border border-[#00eaff] bg-transparent px-5 text-[#00eaff] hover:bg-[#00eaff]/10">{startSession.isPending ? "Opening the door…" : "Begin session"}</Button>
              </div>
            ) : complete ? (
              <div className="space-y-5 text-center"><CheckCircle2 className="mx-auto h-12 w-12 text-[#d8ae55]" aria-hidden="true" /><h2 className="text-3xl font-semibold text-white">Signal cleared.</h2><p className="text-white/70">You completed {ROUNDS.length} rounds with a session score of {score}. This is a reflection score, not a public ranking.</p><Button type="button" onClick={() => { setSessionId(null); setGuestSession(false); }} className="min-h-11 rounded-full border border-[#d8ae55] bg-transparent px-5 text-[#d8ae55] hover:bg-[#d8ae55]/10">Play again</Button></div>
            ) : (
              <div className="space-y-6"><div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#00eaff]"><span>Round {progress}</span><span>Score {score}</span></div><div><h2 className="text-2xl font-semibold text-white">{round.prompt}</h2><p className="mt-2 text-sm text-white/55">Choose the response that protects the route.</p></div><div className="grid gap-3">{round.choices.map((choice, index) => <Button key={choice} type="button" onClick={() => void choose(index)} disabled={completeSession.isPending} className="min-h-14 justify-start rounded-xl border border-[#00eaff]/40 bg-transparent px-4 text-left text-white hover:border-[#d8ae55] hover:bg-[#00eaff]/10">{choice}</Button>)}</div></div>
            )}
          </Card>

          <aside className="space-y-5"><Card className="border-[#d8ae55]/35 bg-[#141423]/70 p-6"><div className="flex items-start gap-3"><LockKeyhole className="mt-1 h-5 w-5 text-[#d8ae55]" aria-hidden="true" /><div><h2 className="font-semibold text-[#d8ae55]">Completion boundary</h2><p className="mt-2 text-sm leading-6 text-white/65">{AO_TROLL_CRUSH_COMPLETION_CONTRACT.serverRequirements.join(" ")}</p></div></div></Card><Card className="border-[#00eaff]/25 bg-[#08080f]/70 p-6"><div className="flex items-start gap-3"><Sparkles className="mt-1 h-5 w-5 text-[#00eaff]" aria-hidden="true" /><div><h2 className="font-semibold text-[#00eaff]">What gets recorded</h2><p className="mt-2 text-sm leading-6 text-white/65">{isAuthenticated ? "Your authenticated session completion and reflection score." : "Nothing permanent yet. Guest play remains local until you sign in."}</p></div></div></Card></aside>
        </section>
      </div>
    </main>
  );
}
