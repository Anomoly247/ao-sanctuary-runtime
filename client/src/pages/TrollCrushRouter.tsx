import { ArrowLeft, Compass, LockKeyhole, Route as RouteIcon, ShieldCheck } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { AO_TROLL_CRUSH_ROUTER } from "../../../shared/aoWorldKinds";

export default function TrollCrushRouter() {
  const [, navigate] = useLocation();

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <Link href="/games" className="inline-flex min-h-11 items-center gap-2 text-sm text-[#00eaff] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#00eaff]">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Play Worlds
        </Link>
        <header className="mb-10 mt-8 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.24em] text-[#00eaff]">House 4 / router schema / in build</p>
          <h1 className="mt-3 text-4xl font-semibold text-[#d8ae55] sm:text-6xl">Troll Crush routes the signal.</h1>
          <p className="mt-4 text-lg leading-8 text-white/70">This is the safe navigation shell for the Troll Crush world. It maps the journey without pretending the game or its reward economy is published yet.</p>
        </header>

        <section className="grid gap-5 md:grid-cols-2" aria-label="Troll Crush route nodes">
          {AO_TROLL_CRUSH_ROUTER.nodes.map((node, index) => (
            <Card key={node.id} className="border-[#00eaff]/25 bg-[#08080f]/80 p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-[#d8ae55]/70">
              <div className="flex items-start justify-between gap-3">
                <span className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[#00eaff]"><span className="grid h-7 w-7 place-items-center rounded-full border border-[#d8ae55]/60 text-[#d8ae55]">{index + 1}</span>{node.label}</span>
                <RouteIcon className="h-5 w-5 text-[#d8ae55]" aria-hidden="true" />
              </div>
              <p className="mt-5 text-sm leading-6 text-white/65">{node.description}</p>
              {index < AO_TROLL_CRUSH_ROUTER.nodes.length - 1 ? <button type="button" onClick={() => navigate(AO_TROLL_CRUSH_ROUTER.destinations[index])} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00eaff] px-4 py-2 text-sm font-semibold text-[#00eaff] hover:bg-[#00eaff]/10">Preview next door <Compass className="h-4 w-4" aria-hidden="true" /></button> : <span className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#d8ae55]/45 px-4 py-2 text-sm text-[#d8ae55]"><LockKeyhole className="h-4 w-4" aria-hidden="true" /> Future session door</span>}
            </Card>
          ))}
        </section>

        <aside className="mt-8 rounded-2xl border border-[#d8ae55]/35 bg-[#141423]/70 p-6" aria-label="Troll Crush economy boundary">
          <div className="flex items-start gap-3"><ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#00eaff]" aria-hidden="true" /><div><h2 className="text-lg font-semibold text-[#d8ae55]">Reward boundary</h2><p className="mt-2 text-sm leading-6 text-white/65">{AO_TROLL_CRUSH_ROUTER.rewardPolicy} When a playable session is approved, its completion contract must be added server-side with an idempotency key and age-aware guardian review.</p></div></div>
        </aside>
      </div>
    </main>
  );
}
