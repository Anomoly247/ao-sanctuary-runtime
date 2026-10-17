import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Archive, LockKeyhole, Sparkles, Trophy } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAOBridge } from "@/contexts/AOBridgeContext";
import { AO_ART, aoArtUrl } from "../../../shared/aoArt";

const houseCoins = [
  { id: "1", house: "Pixel & Dot", title: "Pattern Keeper", cost: 120, mount: "aurora" },
  { id: "2", house: "Clifford & Tater", title: "Brave Companion", cost: 240, mount: "cyber" },
  { id: "3", house: "Mood Buddies", title: "Feeling Listener", cost: 360, mount: "galaxy" },
  { id: "4", house: "Patrol Guardians", title: "Kindness Watch", cost: 480, mount: "gold" },
] as const;

export default function CoinVault() {
  const [, navigate] = useLocation();
  const bridge = useAOBridge();
  const [coins, setCoins] = useState(() => Number(window.localStorage.getItem("ao_guest_anom_coins") || 0));
  const [claimed, setClaimed] = useState<string[]>(() => JSON.parse(window.localStorage.getItem("ao_guest_vault_claimed") || "[]"));
  const active = houseCoins.find((coin) => coin.id === bridge.house) || houseCoins[0];

  useEffect(() => { window.localStorage.setItem("ao_guest_anom_coins", String(coins)); }, [coins]);
  useEffect(() => { window.localStorage.setItem("ao_guest_vault_claimed", JSON.stringify(claimed)); }, [claimed]);

  const progress = useMemo(() => Math.min(100, Math.round((coins / active.cost) * 100)), [coins, active.cost]);
  const activeMount = AO_ART.mounts[active.mount];

  const claim = (id: string, cost: number) => {
    if (claimed.includes(id) || coins < cost) return;
    setCoins((value) => value - cost);
    setClaimed((items) => [...items, id]);
  };

  return (
    <main className="min-h-screen bg-[#0A0A10] text-white px-5 py-8 md:px-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-10">
          <Button variant="ghost" className="text-[#cccccc] hover:text-[#00eaff]" onClick={() => navigate("/games")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to the constellation
          </Button>
          <span className="text-xs tracking-[0.22em] text-[#d8ae55]">AO UNIVERSE // COIN VAULT</span>
        </header>

        <section className="grid lg:grid-cols-[1fr_0.8fr] gap-10 items-center border-y border-white/15 py-10">
          <div>
            <p className="text-xs tracking-[0.25em] text-[#00eaff]">EARNED GLOW · REMEMBERED JOURNEYS</p>
            <h1 className="text-5xl md:text-7xl font-serif text-[#d8ae55] leading-none mt-4">The Coin Vault</h1>
            <p className="text-[#cccccc] text-lg leading-7 max-w-2xl mt-6">Anom Coins are a local preview reward for play and kindness. They are not a promise of money or ownership; they are a gentle way to see your journey accumulate.</p>
            <div className="flex flex-wrap gap-6 mt-8">
              <div><p className="text-xs tracking-[0.18em] text-[#8b8c90]">YOUR WALLET</p><p className="text-4xl text-[#00eaff] mt-1">{coins}</p></div>
              <div><p className="text-xs tracking-[0.18em] text-[#8b8c90]">HOUSE SIGNAL</p><p className="text-xl text-[#d8ae55] mt-2">{bridge.houseName}</p></div>
              <div><p className="text-xs tracking-[0.18em] text-[#8b8c90]">NEXT UNLOCK</p><p className="text-xl text-[#d8ae55] mt-2">{active.cost} coins</p></div>
            </div>
          </div>
          <div className="relative min-h-[280px] flex items-center justify-center">
            <div className="absolute w-64 h-64 rounded-full border border-[#d8ae55]" aria-hidden="true" />
            <div className="absolute w-48 h-48 rounded-full border border-[#00eaff]/60" aria-hidden="true" />
            <div className="relative z-10 w-40 h-40 rounded-full border-[8px] border-[#d8ae55] bg-black flex items-center justify-center text-center">
              <div><Sparkles className="w-7 h-7 text-[#00eaff] mx-auto mb-2" /><strong className="block text-3xl text-[#d8ae55]">{coins}</strong><span className="text-xs text-[#cccccc] tracking-[0.18em]">ANOM COINS</span></div>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-[0.8fr_1.2fr] gap-10 mt-12">
          <div className="border-l border-[#d8ae55] pl-6">
            <p className="text-xs tracking-[0.22em] text-[#8b8c90]">ACTIVE HOUSE COIN</p>
            <img src={aoArtUrl(activeMount.art)} alt={`${active.house} mount`} className="w-48 h-48 object-contain mt-4" />
            <h2 className="font-serif text-3xl text-[#d8ae55]">{active.title}</h2>
            <p className="text-[#cccccc] mt-2">{active.house} · carried by {bridge.mount}</p>
            <div className="mt-6"><div className="flex justify-between text-xs text-[#8b8c90]"><span>Unlock progress</span><span>{progress}%</span></div><div className="h-2 bg-white/10 mt-2"><div className="h-full bg-[#00eaff]" style={{ width: `${progress}%` }} /></div></div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-5"><Archive className="w-5 h-5 text-[#00eaff]" /><h2 className="font-serif text-3xl text-[#d8ae55]">House coins</h2></div>
            <div className="grid sm:grid-cols-2 gap-4">
              {houseCoins.map((coin) => {
                const owned = claimed.includes(coin.id);
                const affordable = coins >= coin.cost;
                return <div key={coin.id} className="border border-white/15 bg-black/25 p-5"><div className="flex justify-between items-start"><span className="text-[#00eaff] text-sm">HOUSE {coin.id}</span>{owned ? <Trophy className="w-5 h-5 text-[#d8ae55]" /> : <LockKeyhole className="w-5 h-5 text-[#8b8c90]" />}</div><h3 className="font-serif text-2xl text-[#d8ae55] mt-4">{coin.house}</h3><p className="text-[#cccccc] text-sm mt-2">{coin.title}</p><Button className="btn-secondary w-full mt-5" disabled={owned || !affordable} onClick={() => claim(coin.id, coin.cost)}>{owned ? "Claimed" : affordable ? `Unlock · ${coin.cost}` : `Need ${coin.cost - coins} more`}</Button></div>;
              })}
            </div>
          </div>
        </section>
        <p className="text-xs text-[#8b8c90] border-t border-white/10 mt-12 pt-5">Guest wallet and vault previews are stored on this device. Authenticated reward ledger entries remain governed by Sanctuary server procedures and are kept separate from local preview state.</p>
      </div>
    </main>
  );
}
