import { ArrowLeft, ExternalLink, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { AO_DESTINATIONS } from "../../../shared/aoDestinationRegistry";
import { Card } from "@/components/ui/card";

const statusLabel = { active: "Live door", "in-build": "In build", planned: "Planned" } as const;

export default function DivisionMap() {
  const destinations = AO_DESTINATIONS.filter((item) => !item.ownerOnly);
  return <main className="min-h-screen px-4 py-8 sm:px-8"><div className="mx-auto max-w-7xl">
    <Link href="/" className="inline-flex items-center gap-2 text-sm text-[#00eaff]"><ArrowLeft className="h-4 w-4" aria-hidden="true" /> Sanctuary</Link>
    <header className="mb-10 mt-8 max-w-3xl"><p className="text-xs uppercase tracking-[0.24em] text-[#00eaff]">AO Universe / canonical map</p><h1 className="mt-3 text-4xl font-semibold text-[#d8ae55] sm:text-6xl">One universe. Many doors.</h1><p className="mt-4 text-lg leading-8 text-white/70">The AO divisions stay distinct, but share identity, safety, provenance, and a non-cash contribution economy.</p></header>
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{destinations.map((item) => <Card key={item.id} className="border-[#00eaff]/25 bg-[#08080f]/80 p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-[#d8ae55]/70">
      <div className="flex items-start justify-between gap-3"><span className="rounded-full border border-[#d8ae55]/50 px-2 py-1 text-[10px] uppercase tracking-[0.14em] text-[#d8ae55]">{statusLabel[item.status]}</span><span className="text-xs text-white/50">{item.ageTier}</span></div>
      <p className="mt-5 text-xs uppercase tracking-[0.16em] text-[#00eaff]">{item.category}</p><h2 className="mt-2 text-2xl font-semibold text-white">{item.label}</h2><p className="mt-2 text-sm text-[#d8ae55]">{item.subtitle}</p><p className="mt-4 min-h-16 text-sm leading-6 text-white/65">{item.description}</p>
      <div className="mt-5 flex flex-wrap gap-2">{item.earns.length ? item.earns.map((asset) => <span key={asset} className="rounded-full border border-[#00eaff]/40 px-2 py-1 text-xs text-[#00eaff]">Earns {asset}</span>) : <span className="inline-flex items-center gap-1 text-xs text-white/45"><ShieldCheck className="h-3 w-3" aria-hidden="true" /> No wallet mutation</span>}</div>
      <Link href={item.route} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full border border-[#00eaff] px-4 py-2 text-sm font-semibold text-[#00eaff] hover:bg-[#00eaff]/10">Enter division <ExternalLink className="h-4 w-4" aria-hidden="true" /></Link>
    </Card>)}</div>
    <div className="mt-10 rounded-2xl border border-[#d8ae55]/35 bg-[#141423]/70 p-5 text-sm text-white/65"><Sparkles className="mb-2 h-5 w-5 text-[#d8ae55]" aria-hidden="true" /><strong className="text-white">Economy boundary:</strong> GP and AC are non-cash game currencies. Authenticated mutations settle on the server ledger; guest progress remains local until an account is available.</div>
  </div></main>;
}
