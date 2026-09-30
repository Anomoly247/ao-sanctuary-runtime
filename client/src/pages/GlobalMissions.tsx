import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAOBridge } from "@/contexts/AOBridgeContext";
import { trpc } from "@/lib/trpc";
import { Check, Coins, Sparkles } from "lucide-react";
import { toast } from "sonner";

function eventIdFor(missionId: string, bridge: ReturnType<typeof useAOBridge>) {
  return bridge.eventId || `${bridge.source}:${missionId}:${bridge.house}:${bridge.mount}`;
}

export default function GlobalMissions() {
  const bridge = useAOBridge();
  const missions = trpc.missions.list.useQuery();
  const status = trpc.missions.status.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const complete = trpc.missions.complete.useMutation({
    onSuccess: result => {
      toast.success(result.duplicate ? "Mission already recorded" : `+${result.reward} Anom Coins added`);
      void utils.missions.status.invalidate();
    },
    onError: error => toast.error(error.message),
  });

  const completed = new Set((status.data || []).map(item => `${item.missionId}:${item.eventId}`));

  return (
    <main className="min-h-screen bg-[#0f172a] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[0.35em] text-[#93c5fd] uppercase">AO Alive / Global Ledger</p>
            <h1 className="text-4xl font-bold text-[#c4b5fd] mt-2">Connected Missions</h1>
            <p className="text-[#9aa2b1] mt-3 max-w-2xl">
              Complete a mission from any connected AO surface. Rewards are recorded by Sanctuary’s shared ledger and remain tied to your house, mount, and source context.
            </p>
          </div>
          <div className="rounded-xl border border-[#334155] bg-[#141927] px-4 py-3 text-sm text-[#bfdbfe]">
            <span className="text-[#94a3b8]">Context:</span> House {bridge.house} · {bridge.mount} · {bridge.source}
          </div>
        </div>

        {bridge.mission && (
          <div className="mb-6 rounded-xl border border-[#a5b4fc]/50 bg-[#a5b4fc]/10 p-4 text-sm text-[#e0e7ff]">
            <Sparkles className="inline-block mr-2 h-4 w-4" />
            Continuing mission <strong>{bridge.mission}</strong> from {bridge.source}.
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-3">
          {(missions.data || []).map(mission => {
            const eventId = eventIdFor(mission.id, bridge);
            const isDone = completed.has(`${mission.id}:${eventId}`);
            return (
              <Card key={mission.id} className="border-[#334155] bg-[#141927] p-6">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl font-bold text-[#93c5fd]">{mission.name}</h2>
                  <span className="inline-flex items-center gap-1 text-[#ffd166] text-sm"><Coins className="h-4 w-4" />{mission.reward}</span>
                </div>
                <p className="mt-4 min-h-16 text-sm text-[#9aa2b1]">{mission.description}</p>
                <Button
                  className="mt-6 w-full bg-[#c4b5fd] hover:bg-[#c4b5fd]/80"
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
  );
}
