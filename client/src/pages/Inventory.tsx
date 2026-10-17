import { useMemo, useState, type CSSProperties } from "react";
import { ArrowLeft, Check, CircleHelp, Coins, Gem, ShieldCheck, Sparkles, Waves } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { useAOBridge } from "@/contexts/AOBridgeContext";
import { AO_SETUP_V5_ASSETS } from "../../../shared/aoSetupV5";

const MOUNT_ASSETS = new Map(AO_SETUP_V5_ASSETS.filter((asset) => asset.id.startsWith("mount-" )).map((asset) => [asset.id, asset]));

function formatAssetLabel(assetId: string) {
  return assetId.replace(/^mount-/, "").replace(/-/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default function Inventory() {
  const { user, loading } = useAuth();
  const bridge = useAOBridge();
  const [, navigate] = useLocation();
  const identityQuery = trpc.ao.identity.get.useQuery(undefined, { enabled: !!user });
  const inventoryQuery = trpc.ao.inventory.list.useQuery(undefined, { enabled: !!user });
  const updateIdentity = trpc.ao.identity.update.useMutation();
  const [selecting, setSelecting] = useState<string | null>(null);

  const ownedMounts = useMemo(() => {
    const items = inventoryQuery.data ?? [];
    const ids = new Set(items.filter((item) => item.assetId.startsWith("mount-")).map((item) => item.assetId));
    if (bridge.mount.startsWith("mount-")) ids.add(bridge.mount);
    return Array.from(ids).map((id) => MOUNT_ASSETS.get(id) ?? {
      id,
      label: formatAssetLabel(id),
      url: "",
      worldKind: "farm" as const,
      ageTier: "AGE-AWARE" as const,
      ownership: "Needs confirmation" as const,
      publicationStatus: "review" as const,
      provenanceId: "unknown",
    });
  }, [inventoryQuery.data, bridge.mount]);

  const activeMount = identityQuery.data?.mount || bridge.mount;
  const isBusy = identityQuery.isLoading || inventoryQuery.isLoading;

  const selectMount = async (assetId: string) => {
    const asset = MOUNT_ASSETS.get(assetId);
    if (!asset || selecting) return;
    setSelecting(assetId);
    try {
      await updateIdentity.mutateAsync({ mount: asset.id, mountColor: asset.id === "mount-gold" ? "gold" : asset.id === "mount-cyber" ? "cyan" : "aurora" });
      bridge.setIdentity({ mount: asset.id, mountColor: asset.id === "mount-gold" ? "gold" : asset.id === "mount-cyber" ? "cyan" : "aurora" });
      await identityQuery.refetch();
      toast.success(`${asset.label} is now your active mount`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The identity signal could not be updated");
    } finally {
      setSelecting(null);
    }
  };

  if (loading || (user && isBusy)) {
    return <div className="ao-inventory-loading" role="status"><span className="ao-signal-pulse">✦</span><p>Opening your stable...</p></div>;
  }

  if (!user) {
    return <div className="ao-inventory-loading"><p>Sign in to view your owned mounts and identity.</p><Button onClick={() => navigate("/")}>Return to Sanctuary</Button></div>;
  }

  if (identityQuery.error || inventoryQuery.error) {
    return <div className="ao-inventory-loading"><p>We could not reach your stable.</p><Button onClick={() => { void identityQuery.refetch(); void inventoryQuery.refetch(); }}>Try again</Button></div>;
  }

  return (
    <div className="ao-inventory-page">
      <header className="ao-inventory-header">
        <Button variant="ghost" className="ao-world-back" onClick={() => navigate("/profile")}><ArrowLeft className="h-4 w-4" /> Profile world</Button>
        <div className="ao-inventory-title"><span>AO SANCTUARY // STABLE</span><strong>Inventory</strong></div>
        <div className="ao-inventory-signal" aria-label="Current AO bridge identity"><span className="ao-signal-dot" /> {bridge.houseName} · {formatAssetLabel(activeMount)}</div>
      </header>

      <main className="ao-inventory-main">
        <section className="ao-inventory-hero">
          <div>
            <p className="ao-inventory-kicker">SERVER-AUTHORITATIVE IDENTITY</p>
            <h1>Choose what<br /><span>travels with you.</span></h1>
            <p>Your owned mounts stay inside the non-cash AO economy. Select one to update your active identity across connected worlds.</p>
          </div>
          <div className="ao-inventory-hero-orbit" aria-hidden="true"><span /><span /><strong>AO</strong></div>
        </section>

        <section className="ao-identity-status" aria-labelledby="identity-status-heading">
          <div className="ao-status-icon"><ShieldCheck /></div>
          <div><p className="ao-inventory-kicker">LIVE IDENTITY SIGNAL</p><h2 id="identity-status-heading">{formatAssetLabel(activeMount)}</h2><p>{identityQuery.data?.guardianTier ? `Guardian tier: ${identityQuery.data.guardianTier}` : "Guardian settings are protected."}</p></div>
          <div className="ao-status-meta"><span><Waves /> Bridge synced</span><span><Sparkles /> {identityQuery.data?.house || bridge.houseName}</span></div>
        </section>

        <section className="ao-inventory-section" aria-labelledby="mounts-heading">
          <div className="ao-inventory-section-heading"><div><p className="ao-inventory-kicker">OWNED COMPANIONS</p><h2 id="mounts-heading">Mount stable</h2></div><span>{ownedMounts.length} available</span></div>
          {ownedMounts.length ? <div className="ao-mount-grid" role="list">{ownedMounts.map((asset, index) => {
            const selected = activeMount === asset.id;
            return <article className={`ao-mount-card ${selected ? "is-active" : ""}`} style={{ "--mount-delay": `${index * 90}ms` } as CSSProperties} key={asset.id} role="listitem">
              <div className="ao-mount-art-wrap">{asset.url ? <img src={asset.url} alt={`${asset.label} mount`} /> : <CircleHelp aria-hidden="true" />}{selected && <span className="ao-active-badge"><Check /> Active</span>}</div>
              <div className="ao-mount-card-copy"><p>{asset.ageTier}</p><h3>{asset.label}</h3><span><Gem /> {asset.ownership}</span></div>
              <Button className={selected ? "ao-selected-mount-button" : "ao-select-mount-button"} disabled={selected || selecting !== null} onClick={() => void selectMount(asset.id)} aria-pressed={selected}>{selecting === asset.id ? "Syncing..." : selected ? "Active identity" : "Travel with this"}</Button>
            </article>;
          })}</div> : <div className="ao-inventory-empty"><Sparkles /><h3>Your stable is still listening.</h3><p>Owned mounts will appear here when they are granted or acquired through an approved AO activity.</p><Button onClick={() => navigate("/games")}>Explore worlds</Button></div>}
        </section>

        <section className="ao-inventory-section ao-items-section" aria-labelledby="items-heading">
          <div className="ao-inventory-section-heading"><div><p className="ao-inventory-kicker">NON-CASH OWNERSHIP</p><h2 id="items-heading">All items</h2></div><span><Coins /> {inventoryQuery.data?.length ?? 0} recorded</span></div>
          {inventoryQuery.data?.length ? <ul className="ao-item-list">{inventoryQuery.data.map((item) => <li key={item.id}><span className="ao-item-symbol">✦</span><div><strong>{MOUNT_ASSETS.get(item.assetId)?.label ?? formatAssetLabel(item.assetId)}</strong><small>{item.acquisition.replace("_", " ")} · {item.assetId}</small></div><span className="ao-item-owned">Owned</span></li>)}</ul> : <p className="ao-muted-note">No additional items are recorded yet. This page never displays cash balances or market prices.</p>}
        </section>
      </main>
    </div>
  );
}
