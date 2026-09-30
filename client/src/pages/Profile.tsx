import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Check, Copy, Heart, Home, ImagePlus, LayoutDashboard, Map, Mountain, Pencil, Share2, Sparkles, Star, WandSparkles } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { AO_ART, aoArtUrl } from "../../../shared/aoArt";
import { useAOBridge } from "@/contexts/AOBridgeContext";

type ZoneId = "identity" | "mounts" | "glow" | "memory";
type DecorationType = "star" | "memory" | "portal" | "banner";
type Decoration = { id: string; type: DecorationType; label: string; zone: ZoneId };

const ZONES: Array<{ id: ZoneId; label: string; eyebrow: string; description: string; icon: string; position: string }> = [
  { id: "identity", label: "Identity Garden", eyebrow: "UPPER ORBIT", description: "Your name, house, inscription, and atmosphere.", icon: "✦", position: "top" },
  { id: "mounts", label: "Mount Stable", eyebrow: "RIGHT ORBIT", description: "Your living travel companion, housed in Anom Originals.", icon: "◒", position: "right" },
  { id: "glow", label: "Glow Constellation", eyebrow: "LOWER ORBIT", description: "Collectibles, missions, badges, and kindness signals.", icon: "✧", position: "bottom" },
  { id: "memory", label: "Memory Grove", eyebrow: "LEFT ORBIT", description: "Photos, feelings, artwork, and moments worth keeping.", icon: "♡", position: "left" },
];

const DECORATION_OPTIONS: Array<{ type: DecorationType; label: string; copy: string; icon: string }> = [
  { type: "star", label: "Star", copy: "A small pulse of connection", icon: "✦" },
  { type: "memory", label: "Memory", copy: "A place for a saved moment", icon: "♡" },
  { type: "portal", label: "Portal", copy: "A doorway to another AO world", icon: "↗" },
  { type: "banner", label: "Banner", copy: "A simple world inscription", icon: "▱" },
];

const DEFAULT_DECORATIONS: Decoration[] = [
  { id: "default-star", type: "star", label: "Live signal", zone: "glow" },
  { id: "default-portal", type: "portal", label: "Sanctuary gate", zone: "identity" },
];

function readDecorations(): Decoration[] {
  if (typeof window === "undefined") return DEFAULT_DECORATIONS;
  try {
    const saved = JSON.parse(window.localStorage.getItem("ao_profile_world_decorations") || "null");
    return Array.isArray(saved) ? saved : DEFAULT_DECORATIONS;
  } catch {
    return DEFAULT_DECORATIONS;
  }
}

export default function Profile() {
  const { user, loading } = useAuth();
  const bridge = useAOBridge();
  const [, navigate] = useLocation();
  const { data: profile, isLoading: profileLoading, error: profileError } = trpc.profile.getMe.useQuery(undefined, { enabled: !!user });
  const updateThemeMutation = trpc.settings.updateTheme.useMutation();
  const updateNameColorMutation = trpc.settings.updateNameColor.useMutation();
  const updateBioMutation = trpc.settings.updateBio.useMutation();
  const [selectedZone, setSelectedZone] = useState<ZoneId>("identity");
  const [isDecorating, setIsDecorating] = useState(false);
  const [decorations, setDecorations] = useState<Decoration[]>(readDecorations);
  const [selectedTheme, setSelectedTheme] = useState("magenta");
  const [selectedNameColor, setSelectedNameColor] = useState("#00eaff");
  const [isEditingInscription, setIsEditingInscription] = useState(false);
  const [inscription, setInscription] = useState("");
  const [copied, setCopied] = useState(false);
  const glow = typeof window === "undefined" ? 0 : Number(window.localStorage.getItem("ao_sprout_glow") || 0);

  useEffect(() => {
    if (!profile) return;
    setSelectedTheme(profile.neonTheme || "magenta");
    setSelectedNameColor(profile.nameColor || "#00eaff");
    setInscription(profile.bio || "A small world with room for wonder.");
  }, [profile]);

  useEffect(() => {
    window.localStorage.setItem("ao_profile_world_decorations", JSON.stringify(decorations));
  }, [decorations]);

  const mount = useMemo(() => {
    const mountName = bridge.mount.toLowerCase();
    if (mountName.includes("cyber")) return AO_ART.mounts.cyber;
    if (mountName.includes("gold")) return AO_ART.mounts.gold;
    if (mountName.includes("galaxy")) return AO_ART.mounts.galaxy;
    if (mountName.includes("aurora")) return AO_ART.mounts.aurora;
    return AO_ART.mounts.default;
  }, [bridge.mount]);

  const activeZone = ZONES.find((zone) => zone.id === selectedZone) || ZONES[0];
  const activeDecorations = decorations.filter((item) => item.zone === selectedZone);
  const profileUrl = `${window.location.origin}/profile/${user?.id}`;

  const handleThemeChange = async (theme: string) => {
    setSelectedTheme(theme);
    try {
      await updateThemeMutation.mutateAsync({ theme: theme as "magenta" | "cyan" | "purple" });
      toast.success("World atmosphere updated");
    } catch {
      toast.error("Could not update world atmosphere");
    }
  };

  const handleNameColorChange = async (color: string) => {
    setSelectedNameColor(color);
    try {
      await updateNameColorMutation.mutateAsync({ nameColor: color });
      toast.success("World signal color updated");
    } catch {
      toast.error("Could not update signal color");
    }
  };

  const saveInscription = async () => {
    try {
      await updateBioMutation.mutateAsync({ bio: inscription });
      setIsEditingInscription(false);
      toast.success("World inscription saved");
    } catch {
      toast.error("Could not save the inscription");
    }
  };

  const placeDecoration = (type: DecorationType, label: string) => {
    const item: Decoration = { id: `${type}-${Date.now()}`, type, label, zone: selectedZone };
    setDecorations((current) => [...current, item]);
    toast.success(`${label} placed in ${activeZone.label}`);
  };

  const copyProfileLink = async () => {
    await navigator.clipboard.writeText(profileUrl);
    setCopied(true);
    toast.success("World portal copied");
    window.setTimeout(() => setCopied(false), 1800);
  };

  if (loading || profileLoading) {
    return <div className="ao-profile-loading"><span className="ao-signal-pulse">✦</span><p>Finding your world...</p></div>;
  }

  if (profileError) {
    return <div className="ao-profile-loading"><p>Unable to find this world.</p><Button onClick={() => window.location.reload()}>Try again</Button></div>;
  }

  if (!user) {
    return <div className="ao-profile-loading"><p>Please sign in to enter your world.</p><Button onClick={() => navigate("/")}>Return to Sanctuary</Button></div>;
  }

  return (
    <div className={`ao-profile-world ${isDecorating ? "is-decorating" : ""}`}>
      <header className="ao-profile-world-header">
        <Button variant="ghost" className="ao-world-back" onClick={() => navigate("/")}><ArrowLeft className="h-4 w-4" /> Home signal</Button>
        <div className="ao-profile-world-title"><span>PERSONAL WORLD</span><strong>{user.name || "Traveler"}</strong></div>
        <div className="ao-profile-header-actions">
          <span className="ao-world-context">{bridge.houseName} · {bridge.mount}</span>
          <Button className="ao-admin-world-button" onClick={() => navigate("/admin-hub")}><LayoutDashboard className="h-4 w-4" /> Admin Hub</Button>
          <Button className="ao-shape-button" onClick={() => setIsDecorating((current) => !current)}><WandSparkles className="h-4 w-4" /> {isDecorating ? "Done shaping" : "Shape your world"}</Button>
        </div>
      </header>

      <main className="ao-profile-world-main">
        <section className="ao-profile-arrival">
          <div>
            <p className="ao-profile-kicker">LIVE SIGNAL // CONNECTED ACROSS AO</p>
            <h1>You have arrived in<br /><span style={{ color: selectedNameColor }}>{user.name || "your"}’s world.</span></h1>
            <p className="ao-profile-arrival-copy">Your identity, mounts, Glow, memories, and connections have a place to gather.</p>
          </div>
          <div className="ao-profile-arrival-stats" aria-label="World status">
            <span><Sparkles className="h-4 w-4" /> Glow <strong>{glow}</strong></span>
            <span><Heart className="h-4 w-4" /> Level <strong>{profile?.level || 1}</strong></span>
            <span><Star className="h-4 w-4" /> {decorations.length} world objects</span>
          </div>
        </section>

        <section className="ao-profile-canvas" aria-label="Personal world map">
          <div className="ao-profile-stars" aria-hidden="true">
            {Array.from({ length: 18 }, (_, index) => <span key={`star-${index}`} className={`ao-profile-star ao-profile-star-${index + 1}`} />)}
          </div>
          <div className="ao-profile-ring ao-profile-ring-outer" />
          <div className="ao-profile-ring ao-profile-ring-inner" />
          <div className="ao-profile-signal-trail ao-profile-trail-one" />
          <div className="ao-profile-signal-trail ao-profile-trail-two" />

          <button className="ao-profile-live-signal" onClick={() => setSelectedZone("identity")} aria-label="Focus live signal">
            <span className="ao-live-signal-orbit" /><span className="ao-live-signal-core">AO</span><small>LIVE SIGNAL</small><em>one world<br />many ways in</em>
          </button>

          {ZONES.map((zone) => {
            const zoneDecorations = decorations.filter((item) => item.zone === zone.id);
            return (
              <button key={zone.id} className={`ao-profile-orbit-node ao-profile-orbit-${zone.position} ${selectedZone === zone.id ? "is-selected" : ""}`} onClick={() => setSelectedZone(zone.id)} aria-label={`Open ${zone.label}`}>
                <span className="ao-orbit-node-icon">{zone.icon}</span>
                <small>{zone.eyebrow}</small>
                <strong>{zone.label}</strong>
                <em>{zoneDecorations.length} signals</em>
              </button>
            );
          })}

          <div className="ao-profile-mount-display" aria-label={`Active mount: ${mount.label}`}>
            <span className="ao-mount-caption">ACTIVE MOUNT</span>
            <img src={aoArtUrl(mount.art)} alt={`${mount.label} active mount`} />
            <strong>{mount.label}</strong>
          </div>

          {decorations.map((item, index) => <span key={item.id} className={`ao-profile-decoration ao-decoration-${item.type} ao-decoration-${(index % 8) + 1}`} title={`${item.label} · ${item.zone}`} aria-hidden="true">{DECORATION_OPTIONS.find((option) => option.type === item.type)?.icon}</span>)}
        </section>

        <section className="ao-profile-world-dock">
          <div className="ao-profile-zone-detail">
            <p className="ao-profile-kicker">{activeZone.eyebrow}</p>
            <h2>{activeZone.icon} {activeZone.label}</h2>
            <p>{activeZone.description}</p>
            <div className="ao-profile-zone-chips">
              {activeDecorations.length ? activeDecorations.map((item) => <span key={item.id}>{item.label}</span>) : <span>No objects here yet</span>}
            </div>
          </div>

          {isDecorating ? (
            <div className="ao-decoration-panel">
              <div className="ao-decoration-panel-heading"><div><p className="ao-profile-kicker">SHAPE YOUR WORLD</p><h3>Choose something for {activeZone.label}</h3></div><span>Choices only · no code</span></div>
              <div className="ao-decoration-options">
                {DECORATION_OPTIONS.map((option) => <button key={option.type} onClick={() => placeDecoration(option.type, option.label)}><strong>{option.icon} {option.label}</strong><small>{option.copy}</small></button>)}
              </div>
            </div>
          ) : (
            <div className="ao-profile-portal-actions">
              <Button className="ao-world-action" onClick={() => navigate("/games")}><Map className="h-4 w-4" /> Play Worlds</Button>
              <Button className="ao-world-action" onClick={() => navigate("/mission-hub")}><Sparkles className="h-4 w-4" /> Mission Hub</Button>
              <Button className="ao-world-action" onClick={() => navigate("/games/baba-yaga")}><Mountain className="h-4 w-4" /> Visit a world</Button>
              <Button className="ao-world-action" onClick={copyProfileLink}>{copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />} {copied ? "Copied" : "Share world"}</Button>
            </div>
          )}
        </section>

        <section className="ao-profile-inscription-row">
          <div className="ao-world-inscription">
            <div className="ao-inscription-heading"><p className="ao-profile-kicker">WORLD INSCRIPTION</p><Button variant="ghost" size="sm" onClick={() => setIsEditingInscription((current) => !current)}><Pencil className="h-3 w-3" /> {isEditingInscription ? "Close" : "Edit"}</Button></div>
            {isEditingInscription ? <div className="ao-inscription-editor"><textarea value={inscription} onChange={(event) => setInscription(event.target.value)} maxLength={180} aria-label="World inscription" /><Button onClick={saveInscription}>Save inscription</Button></div> : <p>“{inscription || "A small world with room for wonder."}”</p>}
          </div>
          <div className="ao-atmosphere-controls"><p className="ao-profile-kicker">ATMOSPHERE</p><div><span>Signal color</span>{["#00eaff", "#d8ae55", "#9bc9bb", "#b86f78"].map((color) => <button key={color} className={selectedNameColor === color ? "is-selected" : ""} style={{ backgroundColor: color }} onClick={() => handleNameColorChange(color)} aria-label={`Choose ${color} signal color`} />)}</div><div className="ao-theme-choices"><span>World tone</span>{["magenta", "cyan", "purple"].map((theme) => <button key={theme} className={selectedTheme === theme ? "is-selected" : ""} onClick={() => handleThemeChange(theme)}>{theme}</button>)}</div></div>
        </section>
      </main>
    </div>
  );
}
