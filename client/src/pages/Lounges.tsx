import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Lock } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { toast } from "sonner";

export default function Lounges() {
  const { isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "family" as "family" | "friends" | "coworkers",
    description: "",
    neonTheme: "magenta" as "magenta" | "cyan" | "purple",
  });

  // Fetch user's lounges
  const { data: myLounges = [], isLoading: loungesLoading } = trpc.lounge.getMyLounges.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );

  // Create lounge mutation
  const createMutation = trpc.lounge.create.useMutation({
    onSuccess: (lounge) => {
      if (lounge) {
        toast.success(`Lounge "${lounge.name}" created!`);
      }
      setFormData({ name: "", type: "family", description: "", neonTheme: "magenta" });
      setIsCreateOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to create lounge: ${error.message}`);
    },
  });

  const handleCreateLounge = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter a lounge name");
      return;
    }

    createMutation.mutate({
      name: formData.name,
      type: formData.type,
      description: formData.description || undefined,
      neonTheme: formData.neonTheme,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center">
        <div className="text-[#00eaff] text-xl">Loading Lounges...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A10] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#00eaff] text-xl mb-4">Please sign in to access lounges</p>
          <Button className="btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A10] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#08080f] px-6 py-4 sticky top-0 bg-[#0A0A10]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="text-[#cccccc]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-accent">Private Lounges</h1>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="btn-secondary gap-2">
                <Plus className="w-4 h-4" />
                Create Lounge
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-[#141423] border border-[#08080f]">
              <DialogHeader>
                <DialogTitle className="text-[#ff00c8]">Create a New Lounge</DialogTitle>
                <DialogDescription className="text-[#cccccc]">
                  Create a private space for family, friends, or coworkers to connect.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Lounge Name</label>
                  <Input
                    placeholder="e.g., The Family Hub"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="bg-[#0A0A10] border-[#08080f] text-[#00eaff] placeholder-[#cccccc]"
                  />
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Lounge Type</label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger className="bg-[#0A0A10] border-[#08080f] text-[#00eaff]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141423] border-[#08080f]">
                      <SelectItem value="family" className="text-[#00eaff]">
                        👨‍👩‍👧‍👦 Family
                      </SelectItem>
                      <SelectItem value="friends" className="text-[#00eaff]">
                        👫 Friends
                      </SelectItem>
                      <SelectItem value="coworkers" className="text-[#00eaff]">
                        💼 Coworkers
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="What's this lounge about?"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-[#0A0A10] border-[#08080f] text-[#00eaff] placeholder-[#cccccc]"
                  />
                </div>

                <div>
                  <label className="text-[#00eaff] text-sm font-medium">Theme</label>
                  <Select value={formData.neonTheme} onValueChange={(value: any) => setFormData({ ...formData, neonTheme: value })}>
                    <SelectTrigger className="bg-[#0A0A10] border-[#08080f] text-[#00eaff]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#141423] border-[#08080f]">
                      <SelectItem value="magenta" className="text-[#ff00c8]">
                        Magenta
                      </SelectItem>
                      <SelectItem value="cyan" className="text-[#00eaff]">
                        Cyan
                      </SelectItem>
                      <SelectItem value="purple" className="text-[#d8ae55]">
                        Badge Gold
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  className="w-full btn-primary"
                  onClick={handleCreateLounge}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? "Creating..." : "Create Lounge"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loungesLoading ? (
          <div className="text-center py-12">
            <p className="text-[#cccccc]">Loading lounges...</p>
          </div>
        ) : myLounges.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-[#ff00c8] opacity-50" />
            <p className="text-[#cccccc] mb-6">No lounges yet. Create one to get started!</p>
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="btn-secondary gap-2">
                  <Plus className="w-4 h-4" />
                  Create Your First Lounge
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#141423] border border-[#08080f]">
                <DialogHeader>
                  <DialogTitle className="text-[#ff00c8]">Create a New Lounge</DialogTitle>
                  <DialogDescription className="text-[#cccccc]">
                    Create a private space for family, friends, or coworkers to connect.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-[#00eaff] text-sm font-medium">Lounge Name</label>
                    <Input
                      placeholder="e.g., The Family Hub"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-[#0A0A10] border-[#08080f] text-[#00eaff] placeholder-[#cccccc]"
                    />
                  </div>

                  <div>
                    <label className="text-[#00eaff] text-sm font-medium">Lounge Type</label>
                    <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                      <SelectTrigger className="bg-[#0A0A10] border-[#08080f] text-[#00eaff]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#141423] border-[#08080f]">
                        <SelectItem value="family" className="text-[#00eaff]">
                          👨‍👩‍👧‍👦 Family
                        </SelectItem>
                        <SelectItem value="friends" className="text-[#00eaff]">
                          👫 Friends
                        </SelectItem>
                        <SelectItem value="coworkers" className="text-[#00eaff]">
                          💼 Coworkers
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-[#00eaff] text-sm font-medium">Description (Optional)</label>
                    <Textarea
                      placeholder="What's this lounge about?"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#0A0A10] border-[#08080f] text-[#00eaff] placeholder-[#cccccc]"
                    />
                  </div>

                  <div>
                    <label className="text-[#00eaff] text-sm font-medium">Theme</label>
                    <Select value={formData.neonTheme} onValueChange={(value: any) => setFormData({ ...formData, neonTheme: value })}>
                      <SelectTrigger className="bg-[#0A0A10] border-[#08080f] text-[#00eaff]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#141423] border-[#08080f]">
                        <SelectItem value="magenta" className="text-[#ff00c8]">
                          Magenta
                        </SelectItem>
                        <SelectItem value="cyan" className="text-[#00eaff]">
                          Cyan
                        </SelectItem>
                        <SelectItem value="purple" className="text-[#d8ae55]">
                          Badge Gold
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    className="w-full btn-primary"
                    onClick={handleCreateLounge}
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? "Creating..." : "Create Lounge"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myLounges.map((lounge) => {
              if (!lounge) return null;
              return (
                <Card
                  key={lounge.id}
                  className="bg-[#141423] border border-[#08080f] p-6 cursor-pointer hover:border-[#ff00c8] transition-colors"
                  onClick={() => navigate(`/lounges/${lounge.id}`)}
                  style={{
                    boxShadow:
                      lounge.neonTheme === "magenta"
                        ? "0 0 10px rgba(196, 181, 253, 0.5), 0 0 20px rgba(196, 181, 253, 0.3)"
                        : lounge.neonTheme === "cyan"
                          ? "0 0 10px rgba(147, 197, 253, 0.5), 0 0 20px rgba(147, 197, 253, 0.3)"
                          : "0 0 10px rgba(165, 180, 252, 0.5), 0 0 20px rgba(165, 180, 252, 0.3)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-[#00eaff] mb-1">{lounge.name}</h3>
                      <p className="text-sm text-[#cccccc] capitalize">{lounge.type} Lounge</p>
                    </div>
                    <Lock className="w-5 h-5 text-[#ff00c8]" />
                  </div>

                  {lounge.description && (
                    <p className="text-[#cccccc] text-sm mb-4 line-clamp-2">{lounge.description}</p>
                  )}

                  <div className="flex items-center gap-2 text-[#00eaff] text-sm">
                    <Users className="w-4 h-4" />
                    <span>View & Join</span>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
