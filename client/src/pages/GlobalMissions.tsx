import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAOBridge } from "@/contexts/AOBridgeContext";
import { trpc } from "@/lib/trpc";
import { AO_SOCIAL_GOOD_MISSIONS, AO_BADGE_RARITIES, getAOBadgeRarity } from "../../../shared/aoWorldContract";
import { Check, Coins, Sparkles, Trophy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Celebration = {
  missionId: string;
  reward: string;
  badge: {
    id: number;
    name: string;
    description: string | null;
    icon: string | null;
    category: string;
  };
};

function eventIdFor(missionId: string, bridge: ReturnType<typeof useAOBridge>) {
  return bridge.eventId || `${bridge.source}:${missionId}:${bridge.house}:${bridge.mount}`;
}

export default function GlobalMissions() {
  const bridge = useAOBridge();
  const missions = trpc.missions.list.useQuery();
  const status = trpc.missions.status.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const [celebration, setCelebration] = useState<Celebration | null>(null);
  const complete = trpc.missions.complete.useMutation({
    onSuccess: result => {
      void utils.missions.status.invalidate();
      void utils.achievement.getUserAchievements.invalidate();
      void utils.profile.getMe.invalidate();

      if (result.duplicate) {
        toast.success("Mission already recorded");
        return;
      }

      const fallbackBadge = AO_SOCIAL_GOOD_MISSIONS.find(item => item.id === result.missionId);
      const badge = result.badgeAwarded || {
        id: 0,
        name: fallbackBadge?.badgeName || "AO Signal",
        description: "A new signal in your connected identity.",
        icon: "✦",
        category: "social_good",
      };
      setCelebration({ missionId: result.missionId, reward: result.reward, badge });
    },
    onError: error => toast.error(error.message),
  });

  const completed = new Set((status.data || []).map(item => `${item.missionId}:${item.eventId}`));
  const celebrationRarity = celebration ? getAOBadgeRarity(celebration.badge) : "common";
  const celebrationRarityMeta = AO_BADGE_RARITIES[celebrationRarity];

  return (
    <>
      <main className="min-h-screen bg-[#0A0A10] text-white px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[0.35em] text-[#00eaff] uppercase">AO Alive / Global Ledger</p>
              <h1 className="text-4xl font-bold text-[#d8ae55] mt-2">Connected Missions</h1>
              <p className="text-[#9aa2b1] mt-3 max-w-2xl">
                Complete a mission from any connected AO surface. Rewards are recorded by Sanctuary’s shared ledger and remain tied to your house, mount, and source context.
              </p>
            </div>
            <div className="rounded-xl border border-[#d8ae55]/50 bg-[#141927] px-4 py-3 text-sm text-[#bfdbfe]">
              <span className="text-[#cccccc]">Context:</span> House {bridge.house} · {bridge.mount} · {bridge.source}
            </div>
          </div>

          {bridge.mission && (
            <div className="mb-6 rounded-xl border border-[#d8ae55] bg-[#d8ae55]/10 p-4 text-sm text-[#ffffff]">
              <Sparkles className="inline-block mr-2 h-4 w-4" />
              Continuing mission <strong>{bridge.mission}</strong> from {bridge.source}.
            </div>
          )}

          <div className="grid gap-5 md:grid-cols-3">
            {(missions.data || []).map(mission => {
              const eventId = eventIdFor(mission.id, bridge);
              const isDone = completed.has(`${mission.id}:${eventId}`);
              return (
                <Card key={mission.id} className="border-[#d8ae55]/40 bg-[#141927] p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-bold text-[#00eaff]">{mission.name}</h2>
                    <span className="inline-flex items-center gap-1 text-[#ffd166] text-sm"><Coins className="h-4 w-4" />{mission.reward}</span>
                  </div>
                  <p className="mt-4 min-h-16 text-sm text-[#9aa2b1]">{mission.description}</p>
                  <Button
                    className="mt-6 w-full bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10"
                    disabled={isDone || complete.isPending}
                    onClick={() => complete.mutate({
                      missionId: mission.id,
                      eventId,
                      source: bridge.source,
                      house: bridge.house,
                      mount: bridge.mount,
                    })}
                  >
                    {isDone ? <><Check className="mr-2 h-4 w-4" />Recorded</> : "Record completion"}
                  </Button>
                </Card>
              );
            })}
          </div>
        </div>
      </main>

      <Dialog open={Boolean(celebration)} onOpenChange={open => !open && setCelebration(null)}>
        <DialogContent className="ao-celebration-dialog">
          <div className="ao-celebration-burst" aria-hidden="true"><Sparkles /><Sparkles /><Sparkles /><Sparkles /></div>
          <DialogHeader>
            <DialogTitle className="ao-celebration-title">Mission signal received</DialogTitle>
            <DialogDescription className="ao-celebration-description">
              Your social-good action is now part of the shared AO world.
            </DialogDescription>
          </DialogHeader>
          {celebration && (
            <div className="ao-celebration-rewards" aria-live="polite">
              <div className="ao-coin-reward">
                <Coins className="h-6 w-6" />
                <strong>+{celebration.reward}</strong>
                <span>Anom Coins</span>
              </div>
              <div className={`ao-unlock-badge ao-badge-rarity-${celebrationRarity}`}>
                <div className="ao-unlock-badge-icon" aria-hidden="true">{celebration.badge.icon || "✦"}</div>
                <div>
                  <span className="ao-unlock-kicker"><Trophy className="h-3 w-3" /> NEW BADGE UNLOCKED</span>
                  <h3>{celebration.badge.name}</h3>
                  <p>{celebration.badge.description}</p>
                  <span className="ao-rarity-label">{celebrationRarityMeta.label}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" className="btn-primary" onClick={() => setCelebration(null)}>Keep exploring</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
