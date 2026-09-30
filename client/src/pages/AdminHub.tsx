import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { ArrowLeft, BookOpen, Check, ExternalLink, Facebook, FileText, Globe2, Instagram, LayoutDashboard, Link2, Play, Plus, Save, ShoppingBag, Sparkles, Store, Video, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/_core/hooks/useAuth";
import { AOContentConfig, ContentEntry, ContentKind, ContentPlacement, ContentStatus, DEFAULT_CONTENT_CONFIG, DEFAULT_SOCIAL_FALLBACK_MESSAGE, Platform, SocialPost, isEmbedReadySocialUrl, readAOContentConfig, writeAOContentConfig, getPlatformLabel, AO_CONTENT_STORAGE_KEY } from "@/lib/aoContent";
import { SocialPostEmbed } from "@/components/ExternalContentSpots";

type HubSection = "overview" | "content" | "publishing" | "shop";

const sectionMeta: Array<{ id: HubSection; label: string; detail: string; icon: typeof LayoutDashboard }> = [
  { id: "overview", label: "Overview", detail: "the whole orbit", icon: LayoutDashboard },
  { id: "content", label: "Content Studio", detail: "worlds + video", icon: FileText },
  { id: "publishing", label: "Publishing Desk", detail: "social + Substack", icon: Globe2 },
  { id: "shop", label: "Shop & Offerings", detail: "Spreadshop + services", icon: Store },
];

const platformOptions: Platform[] = ["youtube", "facebook", "instagram", "linkedin", "substack", "spreadshop"];

function AccessGate({ user, logout }: { user: { name?: string | null; email?: string | null } | null; logout: () => Promise<void> }) {
  const [, navigate] = useLocation();
  return <div className="ao-admin-gate"><Sparkles className="h-8 w-8" /><h1>Admin access required</h1><p>{user ? `Signed in as ${user.name || user.email || "this account"}, but this session is not marked as an administrator yet.` : "Sign in with the AO owner account to open the control room."}</p><div className="ao-admin-gate-actions">{user ? <><Button className="btn-primary" onClick={() => window.location.reload()}>Refresh owner access</Button><Button className="btn-secondary" onClick={async () => { await logout(); window.location.href = "/api/auth/google"; }}>Sign out and sign in again</Button></> : <a href="/api/auth/google"><Button className="btn-primary">Sign in as owner</Button></a>}<Button className="btn-secondary" onClick={() => navigate("/")}>Return to Sanctuary</Button></div></div>;
}

export default function AdminHub() {
  const { user, loading, logout } = useAuth();
  const [, navigate] = useLocation();
  const [section, setSection] = useState<HubSection>("overview");
  const [config, setConfig] = useState<AOContentConfig>(() => readAOContentConfig());
  const [selectedEntryId, setSelectedEntryId] = useState(config.entries[0]?.id || "");
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const selectedEntry = config.entries.find((entry) => entry.id === selectedEntryId) || config.entries[0];

  const publishedCount = useMemo(() => config.entries.filter((entry) => entry.status === "published").length, [config.entries]);
  const connectedCount = useMemo(() => config.channels.filter((channel) => channel.url).length, [config.channels]);
  const featuredOffers = useMemo(() => config.offers.filter((offer) => offer.status === "featured").length, [config.offers]);

  if (loading) return <div className="ao-admin-loading">Opening the Admin Hub…</div>;
  if (user?.role !== "admin") return <AccessGate user={user} logout={logout} />;

  const updateEntry = (patch: Partial<ContentEntry>) => {
    if (!selectedEntry) return;
    setConfig((current) => ({ ...current, entries: current.entries.map((entry) => entry.id === selectedEntry.id ? { ...entry, ...patch } : entry) }));
  };

  const saveConfig = () => {
    writeAOContentConfig(config);
    setSavedAt(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
    toast.success("Admin Hub changes saved to this Sanctuary browser.");
  };

  const addEntry = () => {
    const entry: ContentEntry = { id: `entry-${Date.now()}`, title: "New AO story", kind: "video", placement: "library", platform: "youtube", url: "", description: "Add a description for the next signal.", status: "draft", featured: false, ageTier: "All ages" };
    setConfig((current) => ({ ...current, entries: [entry, ...current.entries] }));
    setSelectedEntryId(entry.id);
    setSection("content");
  };

  const updateChannel = (platform: Platform, url: string) => {
    setConfig((current) => ({ ...current, channels: current.channels.map((channel) => channel.platform === platform ? { ...channel, url, status: url ? "ready" : "needs-link" } : channel) }));
  };

  const addSocialPost = (platform: SocialPost["platform"]) => {
    const post: SocialPost = { id: `social-post-${Date.now()}`, platform, url: "", title: platform === "facebook" ? "Facebook post" : "Instagram post", caption: "Add a short caption for this signal.", fallbackMessage: DEFAULT_SOCIAL_FALLBACK_MESSAGE, status: "draft", featured: false };
    setConfig((current) => ({ ...current, socialPosts: [post, ...current.socialPosts] }));
  };

  const updateSocialPost = (id: string, patch: Partial<SocialPost>) => {
    setConfig((current) => ({ ...current, socialPosts: current.socialPosts.map((post) => post.id === id ? { ...post, ...patch } : post) }));
  };

  const removeSocialPost = (id: string) => {
    setConfig((current) => ({ ...current, socialPosts: current.socialPosts.filter((post) => post.id !== id) }));
  };

  const updateOffer = (id: string, patch: Partial<AOContentConfig["offers"][number]>) => {
    setConfig((current) => ({ ...current, offers: current.offers.map((offer) => offer.id === id ? { ...offer, ...patch } : offer) }));
  };

  const resetConfig = () => {
    setConfig(DEFAULT_CONTENT_CONFIG);
    setSelectedEntryId(DEFAULT_CONTENT_CONFIG.entries[0].id);
    window.localStorage.removeItem(AO_CONTENT_STORAGE_KEY);
    toast.success("Admin Hub restored to its starting content map.");
  };

  return (
    <div className="ao-admin-hub">
      <header className="ao-admin-header">
        <div className="ao-admin-header-inner">
          <div className="ao-admin-brand"><button type="button" onClick={() => navigate("/")} aria-label="Return to Sanctuary"><ArrowLeft className="h-4 w-4" /></button><div><p className="ao-world-kicker">AO CONTROL ROOM // OWNER ACCESS</p><h1>Admin Hub</h1></div></div>
          <div className="ao-admin-header-actions"><span className="ao-admin-save-state">{savedAt ? <><Check className="inline h-3 w-3" /> Saved {savedAt}</> : "Local draft mode"}</span><Button type="button" className="btn-primary" onClick={saveConfig}><Save className="h-4 w-4" /> Save changes</Button></div>
        </div>
      </header>
      <div className="ao-admin-layout">
        <aside className="ao-admin-sidebar" aria-label="Admin Hub sections">
          <div className="ao-admin-sidebar-intro"><Sparkles className="h-5 w-5" /><p>One home base for the worlds, stories, channels, and offers you are growing.</p></div>
          <nav>{sectionMeta.map((item) => { const Icon = item.icon; return <button type="button" key={item.id} className={section === item.id ? "is-active" : ""} onClick={() => setSection(item.id)}><Icon className="h-4 w-4" /><span><strong>{item.label}</strong><small>{item.detail}</small></span></button>; })}</nav>
          <div className="ao-admin-sidebar-footer"><p>Owner: {user.name || "Anom"}</p><button type="button" onClick={resetConfig}>Reset local draft</button></div>
        </aside>
        <main className="ao-admin-main">
          {section === "overview" && <Overview config={config} publishedCount={publishedCount} connectedCount={connectedCount} featuredOffers={featuredOffers} onAdd={addEntry} onSection={setSection} />}
          {section === "content" && <ContentStudio config={config} selectedEntry={selectedEntry} selectedEntryId={selectedEntryId} setSelectedEntryId={setSelectedEntryId} updateEntry={updateEntry} addEntry={addEntry} />}
          {section === "publishing" && <PublishingDesk config={config} updateChannel={updateChannel} addSocialPost={addSocialPost} updateSocialPost={updateSocialPost} removeSocialPost={removeSocialPost} />}
          {section === "shop" && <ShopOfferings config={config} updateOffer={updateOffer} />}
        </main>
      </div>
    </div>
  );
}

function Overview({ config, publishedCount, connectedCount, featuredOffers, onAdd, onSection }: { config: AOContentConfig; publishedCount: number; connectedCount: number; featuredOffers: number; onAdd: () => void; onSection: (section: HubSection) => void }) {
  return <div className="ao-admin-section"><div className="ao-admin-hero"><div><p className="ao-world-kicker">THE AO UNIVERSE // EDITABLE AT THE SOURCE</p><h2>Your worlds need a control room.</h2><p>Prepare a Library trail, feature an Anom&apos;s Corner video, connect the outer platforms, and put a clear path to your creative work in front of the people who find you.</p></div><Button className="btn-primary" onClick={onAdd}><Plus className="h-4 w-4" /> Add content</Button></div><div className="ao-admin-stat-grid"><Stat label="Published signals" value={publishedCount} icon={Play} tone="gold" /><Stat label="Connected channels" value={connectedCount} icon={Link2} tone="cyan" /><Stat label="Featured offers" value={featuredOffers} icon={ShoppingBag} tone="garden" /></div><div className="ao-admin-overview-grid"><Card className="ao-admin-command-card"><div className="ao-admin-card-heading"><div><span className="ao-external-eyebrow">NEXT BUILD</span><h3>Make the outer orbit useful.</h3></div><Sparkles className="h-5 w-5 text-[#d8ae55]" /></div><p>Every story can point somewhere meaningful: a video, a Substack essay, a Spreadshop collection, or a design service that keeps your creative work moving.</p><div className="ao-admin-quick-links"><button onClick={() => onSection("content")}><BookOpen className="h-4 w-4" /> Build a Library trail</button><button onClick={() => onSection("publishing")}><Instagram className="h-4 w-4" /> Connect your channels</button><button onClick={() => onSection("shop")}><ShoppingBag className="h-4 w-4" /> Add an offer</button></div></Card><Card className="ao-admin-feed-card"><span className="ao-external-eyebrow">PUBLIC SURFACES</span><h3>Two video spots are ready.</h3>{config.entries.filter((entry) => entry.kind === "video").slice(0, 3).map((entry) => <div className="ao-admin-feed-row" key={entry.id}><span className={`ao-status-dot ao-status-${entry.status}`} /><div><strong>{entry.title}</strong><small>{entry.placement === "library" ? "Library World" : "Anom's Corner"} · {entry.status}</small></div><Video className="h-4 w-4" /></div>)}</Card></div></div>;
}

function Stat({ label, value, icon: Icon, tone }: { label: string; value: number; icon: typeof Play; tone: string }) { return <Card className={`ao-admin-stat ao-admin-stat-${tone}`}><Icon className="h-5 w-5" /><span>{label}</span><strong>{value}</strong></Card>; }

function ContentStudio({ config, selectedEntry, selectedEntryId, setSelectedEntryId, updateEntry, addEntry }: { config: AOContentConfig; selectedEntry?: ContentEntry; selectedEntryId: string; setSelectedEntryId: (value: string) => void; updateEntry: (patch: Partial<ContentEntry>) => void; addEntry: () => void }) {
  return <div className="ao-admin-section"><div className="ao-admin-section-heading"><div><p className="ao-world-kicker">CONTENT STUDIO // LIBRARY + ANOM&apos;S CORNER</p><h2>Shape what opens in each world.</h2><p>Create one signal and place it where it belongs. Drafts stay private until you mark them ready or published.</p></div><Button className="btn-secondary" onClick={addEntry}><Plus className="h-4 w-4" /> New content</Button></div><div className="ao-admin-studio-grid"><div className="ao-admin-entry-list">{config.entries.map((entry) => <button type="button" key={entry.id} className={selectedEntryId === entry.id ? "is-active" : ""} onClick={() => setSelectedEntryId(entry.id)}><span className="ao-entry-kind"><FileText className="h-4 w-4" /></span><span><strong>{entry.title}</strong><small>{entry.kind} · {entry.placement === "library" ? "Library World" : "Anom's Corner"}</small></span><em>{entry.status}</em></button>)}</div>{selectedEntry && <Card className="ao-admin-editor"><div className="ao-admin-editor-heading"><div><span className="ao-external-eyebrow">EDITING SIGNAL</span><h3>{selectedEntry.title}</h3></div><span className={`ao-status-pill ao-status-pill-${selectedEntry.status}`}>{selectedEntry.status}</span></div><label>Title<Input value={selectedEntry.title} onChange={(event) => updateEntry({ title: event.target.value })} /></label><div className="ao-admin-form-grid"><label>Kind<select value={selectedEntry.kind} onChange={(event) => updateEntry({ kind: event.target.value as ContentKind })}><option value="video">Video</option><option value="article">Article</option><option value="artwork">Artwork</option><option value="announcement">Announcement</option></select></label><label>Platform<select value={selectedEntry.platform} onChange={(event) => updateEntry({ platform: event.target.value as Platform })}>{platformOptions.map((platform) => <option value={platform} key={platform}>{getPlatformLabel(platform)}</option>)}</select></label><label>Placement<select value={selectedEntry.placement} onChange={(event) => updateEntry({ placement: event.target.value as ContentPlacement })}><option value="library">Library World</option><option value="anoms-corner">Anom's Corner</option><option value="homeworld">Homeworld</option></select></label><label>Visibility<select value={selectedEntry.status} onChange={(event) => updateEntry({ status: event.target.value as ContentStatus })}><option value="draft">Draft</option><option value="ready">Ready</option><option value="published">Published</option></select></label></div><label>Source URL<Input value={selectedEntry.url} onChange={(event) => updateEntry({ url: event.target.value })} placeholder="https://youtube.com/watch?v=..." /></label><label>Age tier<Input value={selectedEntry.ageTier} onChange={(event) => updateEntry({ ageTier: event.target.value })} /></label><label>Description<Textarea value={selectedEntry.description} onChange={(event) => updateEntry({ description: event.target.value })} /></label><label className="ao-admin-checkbox"><input type="checkbox" checked={selectedEntry.featured} onChange={(event) => updateEntry({ featured: event.target.checked })} /> Feature this signal in its world</label></Card>}</div></div>;
}

function PublishingDesk({ config, updateChannel, addSocialPost, updateSocialPost, removeSocialPost }: { config: AOContentConfig; updateChannel: (platform: Platform, url: string) => void; addSocialPost: (platform: SocialPost["platform"]) => void; updateSocialPost: (id: string, patch: Partial<SocialPost>) => void; removeSocialPost: (id: string) => void }) {
  return <div className="ao-admin-section"><div className="ao-admin-section-heading"><div><p className="ao-world-kicker">PUBLISHING DESK // OUTER ORBIT</p><h2>One story, many doorways.</h2><p>Connect your channels, then paste public post URLs to build a curated Facebook and Instagram collection for Anom&apos;s Corner.</p></div><div className="ao-admin-connector-note"><Link2 className="h-4 w-4" /> Public posts only · no passwords or code</div></div><div className="ao-admin-platform-grid">{config.channels.map((channel) => <Card className="ao-admin-platform-card" key={channel.platform}><div className="ao-admin-platform-top"><div className="ao-admin-platform-icon"><PlatformMark platform={channel.platform} /></div><div><h3>{channel.label}</h3><span className={`ao-status-pill ao-status-pill-${channel.status}`}>{channel.status === "ready" ? "connected link" : "add link"}</span></div></div><p>{channel.note}</p><label>Channel or publication URL<Input value={channel.url} onChange={(event) => updateChannel(channel.platform, event.target.value)} placeholder={`https://${channel.platform}.com/...`} /></label>{channel.url && <a href={channel.url} target="_blank" rel="noreferrer">Open {channel.label} <ExternalLink className="inline h-3 w-3" /></a>}</Card>)}</div><div className="ao-admin-social-collection"><div className="ao-admin-social-heading"><div><span className="ao-external-eyebrow">ANOM&apos;S CORNER // CURATED POSTS</span><h3>Build the social constellation.</h3><p>Paste a permalink copied from a public Facebook post, Reel, Instagram post, or Instagram Reel. Preview it here before you publish.</p></div><div className="ao-admin-social-actions"><Button type="button" className="btn-secondary" onClick={() => addSocialPost("facebook")}><Facebook className="h-4 w-4" /> Add Facebook post</Button><Button type="button" className="btn-secondary" onClick={() => addSocialPost("instagram")}><Instagram className="h-4 w-4" /> Add Instagram post</Button></div></div>{config.socialPosts.length === 0 ? <div className="ao-admin-social-empty">No post cards yet. Add a public post URL to start the collection.</div> : <div className="ao-admin-social-list">{config.socialPosts.map((post) => <SocialPostEditor key={post.id} post={post} profileChannels={config.channels} update={(patch) => updateSocialPost(post.id, patch)} remove={() => removeSocialPost(post.id)} />)}</div>}</div></div>;
}

function SocialPostEditor({ post, profileChannels, update, remove }: { post: SocialPost; profileChannels: AOContentConfig["channels"]; update: (patch: Partial<SocialPost>) => void; remove: () => void }) {
  const [showPreview, setShowPreview] = useState(false);
  const valid = isEmbedReadySocialUrl(post.url, post.platform);
  return <Card className="ao-admin-social-card"><div className="ao-admin-social-card-top"><div className="ao-admin-platform-top"><div className="ao-admin-platform-icon">{post.platform === "facebook" ? <Facebook className="h-5 w-5" /> : <Instagram className="h-5 w-5" />}</div><div><h4>{post.platform === "facebook" ? "Facebook post" : "Instagram post"}</h4><span className={`ao-social-validation ${valid ? "is-valid" : post.url ? "is-invalid" : ""}`}>{valid ? "embed-ready URL" : post.url ? "Paste a public post permalink" : "waiting for URL"}</span></div></div><button type="button" className="ao-admin-remove-button" onClick={remove}>Remove</button></div><label>Post permalink<Input value={post.url} onChange={(event) => update({ url: event.target.value })} placeholder={post.platform === "facebook" ? "https://www.facebook.com/.../posts/..." : "https://www.instagram.com/p/.../"} /></label><div className="ao-admin-social-form-grid"><label>Display title<Input value={post.title} onChange={(event) => update({ title: event.target.value })} /></label><label>Visibility<select value={post.status} onChange={(event) => update({ status: event.target.value as SocialPost["status"] })}><option value="draft">Draft</option><option value="published">Published</option></select></label></div><label>Caption<Textarea value={post.caption} onChange={(event) => update({ caption: event.target.value })} /></label><label>Unavailable-post message<Textarea value={post.fallbackMessage} onChange={(event) => update({ fallbackMessage: event.target.value })} /></label><div className="ao-admin-preview-row"><Button type="button" className="btn-secondary" onClick={() => setShowPreview((current) => !current)}>{showPreview ? "Hide live preview" : "Preview embed"}</Button><span>Preview does not publish or change visibility.</span></div>{showPreview && <div className="ao-admin-social-preview"><div className="ao-admin-preview-label">LIVE PREVIEW // {valid ? "OFFICIAL EMBED" : "FALLBACK CARD"}</div><SocialPostEmbed post={post} profileChannels={profileChannels} /></div>}<label className="ao-admin-checkbox"><input type="checkbox" checked={post.featured} onChange={(event) => update({ featured: event.target.checked })} /> Feature this post in Anom&apos;s Corner</label></Card>;
}

function PlatformMark({ platform }: { platform: Platform }) { if (platform === "youtube") return <Youtube className="h-5 w-5" />; if (platform === "instagram") return <Instagram className="h-5 w-5" />; if (platform === "spreadshop") return <ShoppingBag className="h-5 w-5" />; return <Globe2 className="h-5 w-5" />; }

function ShopOfferings({ config, updateOffer }: { config: AOContentConfig; updateOffer: (id: string, patch: Partial<AOContentConfig["offers"][number]>) => void }) { return <div className="ao-admin-section"><div className="ao-admin-section-heading"><div><p className="ao-world-kicker">SHOP + OFFERINGS // REVENUE PATHS</p><h2>Let the work open a door.</h2><p>Keep the public experience generous, then make it simple for someone to support the art, buy a piece, or hire you to build a world.</p></div><ShoppingBag className="h-8 w-8 text-[#d8ae55]" /></div><div className="ao-admin-offer-grid">{config.offers.map((offer) => <Card className="ao-admin-offer-card" key={offer.id}><div className="ao-admin-offer-icon">{offer.type === "spreadshop" ? <ShoppingBag className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}</div><span className="ao-external-eyebrow">{offer.type === "spreadshop" ? "SPREADSHOP" : "SERVICE OFFER"}</span><label>Offer title<Input value={offer.title} onChange={(event) => updateOffer(offer.id, { title: event.target.value })} /></label><label>Destination URL<Input value={offer.url} onChange={(event) => updateOffer(offer.id, { url: event.target.value })} placeholder={offer.type === "spreadshop" ? "https://spreadshop..." : "https://anom..."} /></label><label>Description<Textarea value={offer.description} onChange={(event) => updateOffer(offer.id, { description: event.target.value })} /></label><div className="ao-admin-offer-footer"><select value={offer.status} onChange={(event) => updateOffer(offer.id, { status: event.target.value as "featured" | "draft" })}><option value="featured">Featured</option><option value="draft">Draft</option></select>{offer.url && <a href={offer.url} target="_blank" rel="noreferrer">Open destination <ExternalLink className="inline h-3 w-3" /></a>}</div></Card>)}</div></div>; }
