import { useMemo, useState } from "react";
import { ArrowLeft, Check, Palette, Sparkles } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AO_ART, aoArtUrl } from "../../../shared/aoArt";
import { useAOBridge } from "@/contexts/AOBridgeContext";
import { toast } from "sonner";

const houses = [
  { id: "1", name: "Pixel & Dot", role: "Curious caretakers", description: "Find patterns, notice details, and make room for gentle discovery.", mount: "aurora", tone: "gold" },
  { id: "2", name: "Clifford & Tater", role: "Brave companions", description: "Investigate together, protect the small things, and keep moving with heart.", mount: "cyber", tone: "cyan" },
  { id: "3", name: "Mood Buddies", role: "Feeling listeners", description: "Name the feeling, share the signal, and practice social repair.", mount: "galaxy", tone: "gold" },
  { id: "4", name: "Patrol Guardians", role: "Watchful kindness", description: "Keep the shared world safe through care, boundaries, and responsibility.", mount: "gold", tone: "cyan" },
] as const;

const colors = [
  { id: "cyan", label: "Cyan current", value: "#00eaff" },
  { id: "gold", label: "Deep gold", value: "#d8ae55" },
  { id: "pearl", label: "Moon pearl", value: "#e7e2d0" },
] as const;

export default function HouseSelect() {
  const [, navigate] = useLocation();
  const bridge = useAOBridge();
  const currentHouse = houses.find((house) => house.id === bridge.house) || houses[0];
  const [selectedHouse, setSelectedHouse] = useState(currentHouse.id);
  const [selectedColor, setSelectedColor] = useState(bridge.mountColor || "cyan");
  const house = useMemo(() => houses.find((item) => item.id === selectedHouse) || houses[0], [selectedHouse]);
  const mount = AO_ART.mounts[house.mount];

  const chooseIdentity = () => {
    bridge.setIdentity({ house: house.id, mount: house.mount, mountColor: selectedColor });
    toast.success(`${house.name} is carrying your signal now.`);
    navigate("/games");
  };

  return (
    <main className="min-h-screen bg-[#0A0A10] text-white px-5 py-8 md:px-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between gap-4 mb-10">
          <Button variant="ghost" className="text-[#cccccc] hover:text-[#00eaff]" onClick={() => navigate("/games")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to the constellation
          </Button>
          <span className="text-xs tracking-[0.22em] text-[#d8ae55]">AO UNIVERSE // IDENTITY GATEWAY</span>
        </header>

        <section className="grid lg:grid-cols-[1fr_0.82fr] gap-10 items-start">
          <div>
            <p className="text-xs tracking-[0.25em] text-[#00eaff] mb-4">START HERE · YOUR HOUSE REMEMBERS</p>
            <h1 className="text-4xl md:text-6xl font-serif text-[#d8ae55] leading-tight">Choose the way you travel.</h1>
            <p className="text-[#cccccc] text-lg leading-7 max-w-2xl mt-5">A House is a lens, not a label. Choose the feeling that should accompany you through Play Worlds, Library World, missions, and the archive.</p>
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {houses.map((item) => {
                const selected = item.id === selectedHouse;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedHouse(item.id)}
                    aria-pressed={selected}
                    className={`text-left p-5 border transition-colors ${selected ? "border-[#d8ae55] bg-[#d8ae55]/10" : "border-white/15 bg-black/20 hover:border-[#00eaff]/60"}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <span className={`w-9 h-9 rounded-full border flex items-center justify-center ${item.tone === "gold" ? "border-[#d8ae55] text-[#d8ae55]" : "border-[#00eaff] text-[#00eaff]"}`}>{item.id}</span>
                      {selected && <Check className="w-5 h-5 text-[#00eaff]" aria-label="Selected" />}
                    </div>
                    <h2 className="font-serif text-2xl text-[#d8ae55] mt-5">{item.name}</h2>
                    <p className="text-[#00eaff] text-sm mt-2">{item.role}</p>
                    <p className="text-[#cccccc] text-sm leading-6 mt-3">{item.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="border border-white/15 bg-black/30 p-6 lg:sticky lg:top-8">
            <p className="text-xs tracking-[0.22em] text-[#8b8c90]">YOUR LIVING MOUNT</p>
            <div className="relative min-h-[290px] flex items-center justify-center mt-4">
              <div className="absolute w-64 h-40 border border-[#d8ae55]/50 rounded-[50%] rotate-[-14deg]" aria-hidden="true" />
              <div className="absolute w-48 h-28 border border-[#00eaff]/50 rounded-[50%] rotate-[22deg]" aria-hidden="true" />
              <img src={aoArtUrl(mount.art)} alt={`${mount.label}, paired with ${house.name}`} className="relative z-10 w-56 h-56 object-contain" style={{ filter: selectedColor === "gold" ? "hue-rotate(28deg) saturate(1.2)" : selectedColor === "pearl" ? "grayscale(1) brightness(1.2)" : "saturate(1.15)" }} />
            </div>
            <h2 className="font-serif text-3xl text-[#d8ae55]">{mount.label}</h2>
            <p className="text-[#cccccc] mt-2">{house.name} · color signal ready</p>
            <div className="mt-6">
              <div className="flex items-center gap-2 text-sm text-[#00eaff]"><Palette className="w-4 h-4" /> Mount color</div>
              <div className="flex gap-3 mt-3" role="group" aria-label="Choose mount color">
                {colors.map((color) => (
                  <button key={color.id} type="button" onClick={() => setSelectedColor(color.id)} aria-label={color.label} aria-pressed={selectedColor === color.id} className={`w-10 h-10 rounded-full border-2 ${selectedColor === color.id ? "border-white" : "border-white/20"}`} style={{ backgroundColor: color.value }} />
                ))}
              </div>
            </div>
            <Button className="btn-primary w-full mt-7" onClick={chooseIdentity}><Sparkles className="w-4 h-4 mr-2" /> Carry this identity forward</Button>
            <p className="text-xs text-[#8b8c90] mt-4 leading-5">Your choice is saved locally for guest exploration and passed through the Sanctuary bridge when you enter another world.</p>
          </aside>
        </section>
      </div>
    </main>
  );
}
