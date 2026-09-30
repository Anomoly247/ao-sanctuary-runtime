import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Users, Send, Settings, Plus, X } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";

interface LoungeDetailProps {
  params: { loungeId: string };
}

export default function LoungeDetail({ params }: LoungeDetailProps) {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();
  const loungeId = parseInt(params.loungeId, 10);
  const [messageInput, setMessageInput] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [customizeData, setCustomizeData] = useState({
    name: "",
    description: "",
    neonTheme: "magenta" as "magenta" | "cyan" | "purple",
  });

  // Fetch lounge details
  const { data: lounge, isLoading: loungeLoading, refetch: refetchLounge } = trpc.lounge.getById.useQuery(
    { loungeId },
    { enabled: isAuthenticated && !!loungeId }
  );

  // Fetch lounge members
  const { data: members = [], isLoading: membersLoading } = trpc.lounge.getMembers.useQuery(
    { loungeId },
    { enabled: isAuthenticated && !!loungeId }
  );

  // Fetch lounge messages
  const { data: messages = [], isLoading: messagesLoading, refetch: refetchMessages } = trpc.lounge.getMessages.useQuery(
    { loungeId, limit: 50 },
    { enabled: isAuthenticated && !!loungeId }
  );

  // Send message mutation
  const sendMessageMutation = trpc.lounge.sendMessage.useMutation({
    onSuccess: () => {
      setMessageInput("");
      refetchMessages();
    },
    onError: (error) => {
      toast.error(`Failed to send message: ${error.message}`);
    },
  });

  // Update lounge settings mutation
  const updateSettingsMutation = trpc.lounge.updateSettings.useMutation({
    onSuccess: (updatedLounge) => {
      toast.success("Lounge settings updated!");
      setIsCustomizeOpen(false);
      refetchLounge();
    },
    onError: (error) => {
      toast.error(`Failed to update lounge: ${error.message}`);
    },
  });

  // Initialize customize form when lounge loads
  useEffect(() => {
    if (lounge) {
      setCustomizeData({
        name: lounge.name || "",
        description: lounge.description || "",
        neonTheme: (lounge.neonTheme as "magenta" | "cyan" | "purple") || "magenta",
      });
    }
  }, [lounge]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    sendMessageMutation.mutate({
      loungeId,
      content: messageInput,
    });
  };

  const handleUpdateSettings = () => {
    if (!customizeData.name.trim()) {
      toast.error("Lounge name is required");
      return;
    }

    updateSettingsMutation.mutate({
      loungeId,
      name: customizeData.name,
      description: customizeData.description || undefined,
      neonTheme: customizeData.neonTheme,
    });
  };

  if (loading || loungeLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#93c5fd] text-xl">Loading lounge...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#93c5fd] text-xl mb-4">Please sign in to access this lounge</p>
          <Button className="btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  if (!lounge) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#93c5fd] text-xl mb-4">Lounge not found</p>
          <Button className="btn-primary" onClick={() => navigate("/lounges")}>
            Back to Lounges
          </Button>
        </div>
      </div>
    );
  }

  const themeColor = lounge.neonTheme === "cyan" ? "#93c5fd" : lounge.neonTheme === "purple" ? "#a5b4fc" : "#c4b5fd";

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b]">
      {/* Header */}
      <div className="bg-[#1e293b] border-b-2" style={{ borderColor: themeColor }} >
        <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: themeColor }}>
              {lounge.name}
            </h1>
            <p className="text-[#93c5fd]">{lounge.type} Lounge</p>
          </div>
          <Button onClick={() => navigate("/lounges")} className="bg-[#334155] hover:bg-[#3a3f4e] text-[#93c5fd]">
            Back to Lounges
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-[#1e293b] border-2 h-96 flex flex-col" style={{ borderColor: themeColor }}>
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              <div className="space-y-3">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-[#94a3b8]">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className="bg-[#0f172a] rounded-lg p-3 border border-[#93c5fd]/20">
                      <p className="text-[#93c5fd] font-bold text-sm">User</p>
                      <p className="text-gray-300 text-sm">{msg.content}</p>
                      <p className="text-[#94a3b8] text-xs mt-1">{new Date(msg.createdAt).toLocaleTimeString()}</p>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </Card>

          {/* Message Input */}
          <div className="flex gap-2">
            <Input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="bg-[#1e293b] border-2 text-white"
              style={{ borderColor: themeColor }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={sendMessageMutation.isPending}
              className="text-black font-bold flex items-center gap-2"
              style={{ backgroundColor: themeColor }}
            >
              <Send className="w-4 h-4" />
              Send
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Members */}
          <Card className="bg-[#1e293b] border-2 border-[#93c5fd] p-4">
            <h3 className="text-lg font-bold text-[#93c5fd] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Members ({members.length})
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {members.map((member, idx) => (
                <div key={idx} className="text-sm text-gray-300 p-2 bg-[#0f172a] rounded">
                  {member.user?.name || 'Member'}
                  {member.member?.role === 'owner' && <span className="text-[#c4b5fd] ml-2 text-xs">(Owner)</span>}
                </div>
              ))}
            </div>
          </Card>

          {/* Settings */}
          <Card className="bg-[#1e293b] border-2 p-4" style={{ borderColor: themeColor }}>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: themeColor }}>
              <Settings className="w-5 h-5" />
              Lounge Settings
            </h3>
            <div className="space-y-2">
              <Dialog open={isCustomizeOpen} onOpenChange={setIsCustomizeOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full text-black font-bold" style={{ backgroundColor: themeColor }}>
                    Customize Lounge
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1e293b] border-2" style={{ borderColor: themeColor }}>
                  <DialogHeader>
                    <DialogTitle style={{ color: themeColor }}>Customize Lounge</DialogTitle>
                    <DialogDescription className="text-[#94a3b8]">
                      Update your lounge name, description, and theme.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[#93c5fd] text-sm font-medium">Lounge Name</label>
                      <Input
                        value={customizeData.name}
                        onChange={(e) => setCustomizeData({ ...customizeData, name: e.target.value })}
                        className="bg-[#0f172a] border-[#334155] text-[#93c5fd] placeholder-[#94a3b8]"
                      />
                    </div>

                    <div>
                      <label className="text-[#93c5fd] text-sm font-medium">Description (Optional)</label>
                      <Textarea
                        value={customizeData.description}
                        onChange={(e) => setCustomizeData({ ...customizeData, description: e.target.value })}
                        placeholder="What's this lounge about?"
                        className="bg-[#0f172a] border-[#334155] text-[#93c5fd] placeholder-[#94a3b8]"
                      />
                    </div>

                    <div>
                      <label className="text-[#93c5fd] text-sm font-medium">Theme</label>
                      <Select value={customizeData.neonTheme} onValueChange={(value: any) => setCustomizeData({ ...customizeData, neonTheme: value })}>
                        <SelectTrigger className="bg-[#0f172a] border-[#334155] text-[#93c5fd]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1e293b] border-[#334155]">
                          <SelectItem value="magenta" className="text-[#c4b5fd]">
                            Magenta
                          </SelectItem>
                          <SelectItem value="cyan" className="text-[#93c5fd]">
                            Cyan
                          </SelectItem>
                          <SelectItem value="purple" className="text-[#a5b4fc]">
                            Purple
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full text-black font-bold"
                      onClick={handleUpdateSettings}
                      disabled={updateSettingsMutation.isPending}
                      style={{ backgroundColor: themeColor }}
                    >
                      {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-[#93c5fd] hover:bg-[#93c5fd]/80 text-black font-bold">
                    Invite Members
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-[#1e293b] border-2 border-[#93c5fd]">
                  <DialogHeader>
                    <DialogTitle className="text-[#93c5fd]">Invite Members</DialogTitle>
                    <DialogDescription className="text-[#94a3b8]">
                      Invite people to join your lounge by email.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[#93c5fd] text-sm font-medium">Email Address</label>
                      <Input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="friend@example.com"
                        className="bg-[#0f172a] border-[#334155] text-[#93c5fd] placeholder-[#94a3b8]"
                      />
                    </div>
                    <Button
                      className="w-full bg-[#93c5fd] hover:bg-[#93c5fd]/80 text-black font-bold"
                      onClick={() => {
                        if (!inviteEmail.trim()) {
                          toast.error("Please enter an email address");
                          return;
                        }
                        toast.success(`Invitation sent to ${inviteEmail}`);
                        setInviteEmail("");
                        setIsInviteOpen(false);
                      }}
                    >
                      Send Invite
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
