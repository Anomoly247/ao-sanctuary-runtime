import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Palette, Zap, Shield, BarChart3, Clock } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function OwnerSettings() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();

  // Fetch settings
  const { data: settings, isLoading: settingsLoading, refetch: refetchSettings } = trpc.ownerSettings.getSettings.useQuery();

  // Fetch audit log
  const { data: auditLog = [], refetch: refetchAuditLog } = trpc.ownerSettings.getAuditLog.useQuery({ limit: 50 });

  // Update settings mutation
  const updateSettingsMutation = trpc.ownerSettings.updateSettings.useMutation({
    onSuccess: () => {
      toast.success("Settings updated! ✅");
      refetchSettings();
      refetchAuditLog();
    },
    onError: (error) => {
      toast.error(`Failed to update settings: ${error.message}`);
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    primaryColor: "#c4b5fd",
    secondaryColor: "#93c5fd",
    accentColor: "#a5b4fc",
    coinRewardPerAction: 10,
    coinRewardPerGame: 50,
    coinRewardPerTask: 10,
    xpPerLevel: 100,
    enableMerch: true,
    enableLounges: true,
    enableGames: true,
    enableCollaboration: true,
    enableKidsCorner: true,
  });

  // Initialize form with settings
  useEffect(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || "Anom Artsy",
        siteDescription: settings.siteDescription || "",
        primaryColor: settings.primaryColor || "#c4b5fd",
        secondaryColor: settings.secondaryColor || "#93c5fd",
        accentColor: settings.accentColor || "#a5b4fc",
        coinRewardPerAction: settings.coinRewardPerAction || 10,
        coinRewardPerGame: settings.coinRewardPerGame || 50,
        coinRewardPerTask: settings.coinRewardPerTask || 10,
        xpPerLevel: settings.xpPerLevel || 100,
        enableMerch: settings.enableMerch ?? true,
        enableLounges: settings.enableLounges ?? true,
        enableGames: settings.enableGames ?? true,
        enableCollaboration: settings.enableCollaboration ?? true,
        enableKidsCorner: settings.enableKidsCorner ?? true,
      });
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#93c5fd] text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#c4b5fd] text-xl mb-4">Admin access required</p>
          <Button className="btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const handleSaveSettings = () => {
    updateSettingsMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#93c5fd]">
      {/* Navigation */}
      <nav className="border-b border-[#334155] px-6 py-4 sticky top-0 bg-[#0f172a]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")} className="text-[#94a3b8]">
              ← Back to Admin
            </Button>
            <h1 className="text-2xl font-bold text-accent flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Owner Settings
            </h1>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-[#1e293b] border border-[#334155] mb-8 grid grid-cols-5">
            <TabsTrigger value="general" className="text-[#93c5fd]">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger value="branding" className="text-[#93c5fd]">
              <Palette className="w-4 h-4 mr-2" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="economy" className="text-[#93c5fd]">
              <Zap className="w-4 h-4 mr-2" />
              Economy
            </TabsTrigger>
            <TabsTrigger value="features" className="text-[#93c5fd]">
              <Shield className="w-4 h-4 mr-2" />
              Features
            </TabsTrigger>
            <TabsTrigger value="audit" className="text-[#93c5fd]">
              <Clock className="w-4 h-4 mr-2" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-8">
              <h2 className="text-2xl font-bold text-[#c4b5fd] mb-6">General Settings</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">Site Name</label>
                  <Input
                    value={formData.siteName}
                    onChange={(e) => setFormData({ ...formData, siteName: e.target.value })}
                    className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                  />
                </div>

                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">Site Description</label>
                  <Textarea
                    value={formData.siteDescription}
                    onChange={(e) => setFormData({ ...formData, siteDescription: e.target.value })}
                    className="bg-[#0f172a] border border-[#334155] text-[#93c5fd] min-h-24"
                  />
                </div>

                <Button
                  className="w-full btn-primary text-lg py-6"
                  onClick={handleSaveSettings}
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending ? "Saving..." : "Save General Settings"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Branding Tab */}
          <TabsContent value="branding" className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-8">
              <h2 className="text-2xl font-bold text-[#c4b5fd] mb-6">Branding & Colors</h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">Primary Color (Magenta)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="w-16 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={formData.primaryColor}
                        onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                        className="flex-1 bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">Secondary Color (Cyan)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="w-16 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={formData.secondaryColor}
                        onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                        className="flex-1 bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">Accent Color (Purple)</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="w-16 h-10 rounded cursor-pointer"
                      />
                      <Input
                        value={formData.accentColor}
                        onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                        className="flex-1 bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                      />
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full btn-secondary text-lg py-6"
                  onClick={handleSaveSettings}
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending ? "Saving..." : "Save Branding"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Economy Tab */}
          <TabsContent value="economy" className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-8">
              <h2 className="text-2xl font-bold text-[#c4b5fd] mb-6">Economy Settings</h2>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">Coins per Action</label>
                    <Input
                      type="number"
                      value={formData.coinRewardPerAction}
                      onChange={(e) => setFormData({ ...formData, coinRewardPerAction: parseInt(e.target.value) })}
                      className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">Coins per Game Completion</label>
                    <Input
                      type="number"
                      value={formData.coinRewardPerGame}
                      onChange={(e) => setFormData({ ...formData, coinRewardPerGame: parseInt(e.target.value) })}
                      className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">Coins per Task Completed</label>
                    <Input
                      type="number"
                      value={formData.coinRewardPerTask}
                      onChange={(e) => setFormData({ ...formData, coinRewardPerTask: parseInt(e.target.value) })}
                      className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                    />
                  </div>

                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">XP Required per Level</label>
                    <Input
                      type="number"
                      value={formData.xpPerLevel}
                      onChange={(e) => setFormData({ ...formData, xpPerLevel: parseInt(e.target.value) })}
                      className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]"
                    />
                  </div>
                </div>

                <Button
                  className="w-full btn-primary text-lg py-6"
                  onClick={handleSaveSettings}
                  disabled={updateSettingsMutation.isPending}
                >
                  {updateSettingsMutation.isPending ? "Saving..." : "Save Economy Settings"}
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Features Tab */}
          <TabsContent value="features" className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-8">
              <h2 className="text-2xl font-bold text-[#c4b5fd] mb-6">Feature Toggles</h2>

              <div className="space-y-4 mb-6">
                {[
                  { key: "enableMerch", label: "Enable Merch System" },
                  { key: "enableLounges", label: "Enable Private Lounges" },
                  { key: "enableGames", label: "Enable Mini-Games" },
                  { key: "enableCollaboration", label: "Enable Collaboration Station" },
                  { key: "enableKidsCorner", label: "Enable Kids Corner" },
                ].map((feature) => (
                  <label key={feature.key} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData[feature.key as keyof typeof formData] as boolean}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [feature.key]: e.target.checked,
                        })
                      }
                      className="w-5 h-5 rounded"
                    />
                    <span className="text-[#93c5fd] font-bold">{feature.label}</span>
                  </label>
                ))}
              </div>

              <Button
                className="w-full btn-secondary text-lg py-6"
                onClick={handleSaveSettings}
                disabled={updateSettingsMutation.isPending}
              >
                {updateSettingsMutation.isPending ? "Saving..." : "Save Feature Settings"}
              </Button>
            </Card>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-8">
              <h2 className="text-2xl font-bold text-[#c4b5fd] mb-6">Admin Audit Log</h2>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {auditLog.length === 0 ? (
                  <p className="text-[#94a3b8]">No audit log entries yet.</p>
                ) : (
                  auditLog.map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-[#0f172a] border border-[#334155] p-4 rounded"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-[#93c5fd] font-bold">{entry.action}</p>
                          <p className="text-xs text-[#94a3b8]">
                            Admin #{entry.adminId} • {entry.targetType ? `${entry.targetType} #${entry.targetId}` : "System"}
                          </p>
                        </div>
                        <span className="text-xs text-[#94a3b8]">
                          {new Date(entry.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {entry.details && (
                        <pre className="text-xs text-[#94a3b8] bg-[#1e293b] p-2 rounded overflow-x-auto">
                          {JSON.stringify(entry.details, null, 2)}
                        </pre>
                      )}
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
