import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, Share2, RefreshCw, QrCode, Link as LinkIcon } from "lucide-react";
import { toast } from "sonner";
import {
  createIdentitySyncCode,
  applyIdentitySyncCode,
  loadProfileSettings,
} from "@/lib/profileSettings";

export default function IdentitySyncCard() {
  const [syncCode, setSyncCode] = useState("");
  const [showSyncCode, setShowSyncCode] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const settings = loadProfileSettings();

  const handleGenerateSyncCode = () => {
    const code = createIdentitySyncCode();
    setSyncCode(code);
    setShowSyncCode(true);
    toast.success("Identity sync code generated!");
  };

  const handleCopySyncCode = () => {
    navigator.clipboard.writeText(syncCode);
    toast.success("Sync code copied to clipboard!");
  };

  const handleApplySyncCode = async () => {
    if (!syncCode.trim()) {
      toast.error("Please enter a sync code");
      return;
    }

    setIsApplying(true);
    try {
      const success = applyIdentitySyncCode(syncCode);
      if (success) {
        toast.success("Identity synced successfully!");
        setShowSyncCode(false);
        setSyncCode("");
        // Reload to show updated settings
        window.location.reload();
      } else {
        toast.error("Invalid sync code");
      }
    } catch (error) {
      toast.error("Failed to apply sync code");
    } finally {
      setIsApplying(false);
    }
  };

  const handleShareOnSocial = (platform: "twitter" | "facebook" | "linkedin") => {
    const code = createIdentitySyncCode();
    const shareUrl = `${window.location.origin}/sync?code=${code}`;

    const messages = {
      twitter: `Check out my Anom Artsy identity! Sync your profile with mine: ${shareUrl}`,
      facebook: `Join me on Anom Artsy! Sync your identity: ${shareUrl}`,
      linkedin: `Connecting on Anom Artsy - sync your professional identity: ${shareUrl}`,
    };

    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(messages.twitter)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    };

    window.open(urls[platform], "_blank", "width=600,height=400");
    toast.success(`Shared on ${platform}!`);
  };

  return (
    <Card className="bg-gradient-to-br from-[#1e293b] to-[#0f172a] border-2 border-[#c4b5fd] p-6">
      <h3 className="text-xl font-bold text-[#c4b5fd] mb-4 flex items-center gap-2">
        <RefreshCw className="w-5 h-5" />
        Identity Sync
      </h3>

      {/* Current Identity Info */}
      <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155] mb-6">
        <p className="text-sm text-[#94a3b8] mb-3">
          <strong>Your Current Identity:</strong>
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2"
              style={{ backgroundColor: settings.colors.primary }}
            />
            <p className="text-xs text-[#94a3b8]">Primary</p>
            <p className="text-xs font-bold text-white">{settings.colors.primary}</p>
          </div>
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2"
              style={{ backgroundColor: settings.colors.secondary }}
            />
            <p className="text-xs text-[#94a3b8]">Secondary</p>
            <p className="text-xs font-bold text-white">{settings.colors.secondary}</p>
          </div>
          <div className="text-center">
            <div
              className="w-12 h-12 rounded-full mx-auto mb-2"
              style={{ backgroundColor: settings.colors.accent }}
            />
            <p className="text-xs text-[#94a3b8]">Accent</p>
            <p className="text-xs font-bold text-white">{settings.colors.accent}</p>
          </div>
        </div>
      </div>

      {/* Generate Sync Code */}
      <div className="mb-6">
        <Button
          onClick={handleGenerateSyncCode}
          className="w-full bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black font-bold flex items-center justify-center gap-2 mb-3"
        >
          <QrCode className="w-4 h-4" />
          Generate Sync Code
        </Button>

        {showSyncCode && (
          <div className="bg-[#0f172a] p-4 rounded-lg border border-[#93c5fd]">
            <p className="text-xs text-[#94a3b8] mb-2">Your Sync Code:</p>
            <div className="flex gap-2">
              <Input
                value={syncCode}
                readOnly
                className="bg-[#1e293b] border-[#93c5fd] text-white font-mono text-xs"
              />
              <Button
                onClick={handleCopySyncCode}
                className="bg-[#93c5fd] hover:bg-[#93c5fd]/80 text-black font-bold"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Apply Sync Code */}
      <div className="mb-6">
        <p className="text-sm text-[#94a3b8] mb-2">
          <strong>Import Someone's Identity:</strong>
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="Paste sync code here..."
            value={syncCode}
            onChange={(e) => setSyncCode(e.target.value)}
            className="bg-[#0f172a] border-[#c4b5fd] text-white font-mono text-xs"
          />
          <Button
            onClick={handleApplySyncCode}
            disabled={isApplying || !syncCode.trim()}
            className="bg-[#c4b5fd] hover:bg-[#c4b5fd]/80 text-black font-bold"
          >
            {isApplying ? "Syncing..." : "Sync"}
          </Button>
        </div>
      </div>

      {/* Social Sharing */}
      <div className="mb-4">
        <p className="text-sm text-[#94a3b8] mb-3">
          <strong>Share Your Identity:</strong>
        </p>
        <div className="grid grid-cols-3 gap-2">
          <Button
            onClick={() => handleShareOnSocial("twitter")}
            className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/80 text-white font-bold text-sm"
          >
            Twitter
          </Button>
          <Button
            onClick={() => handleShareOnSocial("facebook")}
            className="bg-[#1877F2] hover:bg-[#1877F2]/80 text-white font-bold text-sm"
          >
            Facebook
          </Button>
          <Button
            onClick={() => handleShareOnSocial("linkedin")}
            className="bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white font-bold text-sm"
          >
            LinkedIn
          </Button>
        </div>
      </div>

      {/* Info */}
      <div className="bg-[#0f172a] p-4 rounded-lg border border-[#334155]">
        <p className="text-xs text-[#94a3b8]">
          <strong>How it works:</strong> Generate a sync code to share your Anom Artsy identity (colors, theme, photos) with friends. They can paste the code to instantly match your aesthetic. Perfect for creating a unified look across your community!
        </p>
      </div>
    </Card>
  );
}
