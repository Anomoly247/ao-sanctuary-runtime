import { useMemo, useState } from "react";
import { ArrowLeft, Check, Droplets, Leaf, LockKeyhole, Sprout, SunMedium, ShieldCheck, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MOONBERRY_FARM } from "../../../shared/aoContentRegistry";
import { useAOBridge } from "@/contexts/AOBridgeContext";

const STORAGE_KEY = "ao_moonberry_growth_note";

type FarmStep = (typeof MOONBERRY_FARM.steps)[number]["id"];

export default function MoonberryFarm() {
  const [, navigate] = useLocation();
  const bridge = useAOBridge();
  const [step, setStep] = useState<FarmStep>("plant");
  const [note, setNote] = useState(() => typeof window === "undefined" ? "" : window.localStorage.getItem(STORAGE_KEY) ?? "");
  const [saved, setSaved] = useState(false);

  const stepIndex = useMemo(() => MOONBERRY_FARM.steps.findIndex((item) => item.id === step), [step]);
  const progress = ((stepIndex + 1) / MOONBERRY_FARM.steps.length) * 100;
  const isComplete = step === "reflect" && note.trim().length > 0;

  const advance = () => {
    const next = MOONBERRY_FARM.steps[stepIndex + 1];
    if (next) setStep(next.id);
  };

  const saveNote = () => {
    const trimmed = note.trim();
    if (!trimmed) return;
    window.localStorage.setItem(STORAGE_KEY, trimmed);
    setNote(trimmed);
    setSaved(true);
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <button type="button" onClick={() => navigate("/games")} className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-[#00eaff] transition-transform hover:-translate-x-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00eaff]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Return to Play Worlds
        </button>

        <section className="ao-world-hero overflow-hidden rounded-3xl border border-[#d8ae55]/50 bg-[#08080f]/80 p-6 shadow-[0_0_60px_rgba(0,234,255,0.08)] sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-[#00eaff]">{MOONBERRY_FARM.world} · {MOONBERRY_FARM.house}</p>
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-[#d8ae55] sm:text-6xl">{MOONBERRY_FARM.label}</h1>
              <p className="mt-5 max-w-xl text-lg leading-8 text-white/75">{MOONBERRY_FARM.description} Move slowly, care for one small thing, and let gratitude become part of the harvest.</p>
              <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-white/60">
                <span className="rounded-full border border-[#00eaff]/40 px-3 py-2">{MOONBERRY_FARM.ageTier}</span>
                <span className="rounded-full border border-[#d8ae55]/40 px-3 py-2">Private reflection</span>
              </div>
            </div>
            <div className="moonberry-orbit" aria-label="A moonberry seed growing in a quiet orbit" role="img">
              <div className="moonberry-orbit__ring" />
              <div className="moonberry-orbit__seed"><Leaf className="h-12 w-12 text-[#d8ae55]" aria-hidden="true" /></div>
              <span className="moonberry-orbit__spark moonberry-orbit__spark--one" aria-hidden="true">✦</span>
              <span className="moonberry-orbit__spark moonberry-orbit__spark--two" aria-hidden="true">·</span>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-2" aria-label="Moonberry Farm guardian and mount context">
          <Card className="border-[#00eaff]/30 bg-[#08080f]/75 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#00eaff]" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#00eaff]">Guardian capability summary</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{MOONBERRY_FARM.ageTier}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">This world presents a calm, private activity with no public score, leaderboard, or open social posting. A guardian can review the age tier before a child enters.</p>
              </div>
            </div>
          </Card>
          <Card className="border-[#d8ae55]/35 bg-[#08080f]/75 p-5">
            <div className="flex items-start gap-3">
              <Sparkles className="mt-1 h-5 w-5 shrink-0 text-[#d8ae55]" aria-hidden="true" />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#d8ae55]">Stable travel identity</p>
                <h2 className="mt-2 text-xl font-semibold text-white">{bridge.mount}</h2>
                <p className="mt-2 text-sm leading-6 text-white/65">House {bridge.house}: {bridge.houseName}. Your selected mount travels with the world handoff; this panel does not expose private notes or create a public profile signal.</p>
              </div>
            </div>
          </Card>
        </section>

        <section className="mt-8" aria-labelledby="farm-progress-title">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 id="farm-progress-title" className="text-sm font-semibold uppercase tracking-[0.2em] text-[#00eaff]">A gentle four-step loop</h2>
            <span className="text-sm text-white/60">{stepIndex + 1} / {MOONBERRY_FARM.steps.length}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress} aria-label="Moonberry Farm progress"><div className="h-full rounded-full bg-gradient-to-r from-[#00eaff] to-[#d8ae55] transition-[width] duration-300" style={{ width: `${progress}%` }} /></div>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {MOONBERRY_FARM.steps.map((item, index) => <div key={item.id} className={`rounded-2xl border p-4 transition-colors ${index <= stepIndex ? "border-[#d8ae55]/70 bg-[#d8ae55]/10" : "border-white/10 bg-white/[0.03]"}`}><p className="text-xs uppercase tracking-[0.16em] text-white/50">0{index + 1}</p><p className="mt-2 font-semibold text-white">{item.label}</p></div>)}
          </div>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <Card className="border-[#00eaff]/30 bg-[#08080f]/75 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-[#00eaff]">Now tending</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#d8ae55]">{MOONBERRY_FARM.steps[stepIndex].label}</h2>
            <p className="mt-3 leading-7 text-white/70">{MOONBERRY_FARM.steps[stepIndex].cue}</p>
            <div className="mt-6 flex items-center gap-3 text-sm text-white/60"><SunMedium className="h-5 w-5 text-[#d8ae55]" aria-hidden="true" /> Calm progress, no leaderboard.</div>
            {step !== "reflect" && <Button type="button" onClick={advance} className="mt-8 w-full border border-[#00eaff] bg-transparent text-[#00eaff] hover:bg-[#00eaff]/10">Complete {MOONBERRY_FARM.steps[stepIndex].label} <Check className="ml-2 h-4 w-4" aria-hidden="true" /></Button>}
          </Card>

          <Card className="border-[#d8ae55]/35 bg-[#08080f]/75 p-6">
            {step === "plant" && <div className="space-y-4"><Sprout className="h-8 w-8 text-[#d8ae55]" aria-hidden="true" /><h2 className="text-2xl font-semibold text-white">Choose a seed</h2><p className="text-white/70">Plant one moonberry. You do not need to hurry; a small beginning is enough.</p><Button type="button" onClick={advance} className="border border-[#d8ae55] bg-transparent text-[#d8ae55] hover:bg-[#d8ae55]/10">Plant moonberry</Button></div>}
            {step === "water" && <div className="space-y-4"><Droplets className="h-8 w-8 text-[#00eaff]" aria-hidden="true" /><h2 className="text-2xl font-semibold text-white">Care with your mount</h2><p className="text-white/70">Let your companion help water the soil. Care is the action; the harvest is the thank-you.</p><Button type="button" onClick={advance} className="border border-[#00eaff] bg-transparent text-[#00eaff] hover:bg-[#00eaff]/10">Water with mount</Button></div>}
            {step === "harvest" && <div className="space-y-4"><Leaf className="h-8 w-8 text-[#d8ae55]" aria-hidden="true" /><h2 className="text-2xl font-semibold text-white">Gather what grew</h2><p className="text-white/70">You harvested a moonberry. Before leaving, notice one thing that helped it grow.</p><Button type="button" onClick={advance} className="border border-[#d8ae55] bg-transparent text-[#d8ae55] hover:bg-[#d8ae55]/10">Open Growth Note</Button></div>}
            {step === "reflect" && <div><div className="flex items-center gap-3"><LockKeyhole className="h-7 w-7 text-[#00eaff]" aria-hidden="true" /><h2 className="text-2xl font-semibold text-white">A private Growth Note</h2></div><p className="mt-3 text-white/70">{MOONBERRY_FARM.growthPrompt}</p><label htmlFor="growth-note" className="sr-only">Private Growth Note</label><textarea id="growth-note" value={note} onChange={(event) => { setNote(event.target.value); setSaved(false); }} rows={5} maxLength={500} placeholder="I noticed..." className="mt-5 w-full resize-y rounded-2xl border border-[#00eaff]/40 bg-black/40 p-4 text-white placeholder:text-white/35 focus:border-[#00eaff] focus:outline-none focus:ring-2 focus:ring-[#00eaff]/30" aria-describedby="growth-note-privacy" /><p id="growth-note-privacy" className="mt-3 text-xs leading-5 text-white/55">{MOONBERRY_FARM.privacyNote} {note.length}/500</p><div className="mt-5 flex flex-wrap items-center gap-3"><Button type="button" onClick={saveNote} disabled={!note.trim()} className="border border-[#00eaff] bg-transparent text-[#00eaff] hover:bg-[#00eaff]/10">Save private note</Button>{saved && <span role="status" className="text-sm text-[#d8ae55]">Saved on this device.</span>}</div></div>}
          </Card>
        </section>

        {isComplete && <p className="mt-6 text-center text-sm text-[#d8ae55]" role="status">Your farm visit is complete. The note remains yours; no public score was created.</p>}
      </div>
    </main>
  );
}
