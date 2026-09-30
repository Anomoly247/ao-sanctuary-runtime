import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ImageUploader from "./ImageUploader";
import DecorationShowcase from "./DecorationShowcase";
import {
  Camera,
  Image as ImageIcon,
  Palette,
  Settings,
  Save,
  X,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ProfileCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
}

export default function ProfileCustomizer({
  isOpen,
  onClose,
  userId,
}: ProfileCustomizerProps) {
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [backgroundImageFile, setBackgroundImageFile] = useState<File | null>(null);
  const [bio, setBio] = useState("");
  const [profileLayout, setProfileLayout] = useState<"compact" | "full" | "showcase">("full");
  const [isPublic, setIsPublic] = useState(true);
  const [showImageUploader, setShowImageUploader] = useState<"profile" | "background" | null>(null);
  const { data: profile } = trpc.profile.getMe.useQuery();
  const updateProfile = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated!");
      onClose();
    },
    onError: () => {
      toast.error("Failed to update profile");
    },
  });

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      updateProfile.mutate({
        bio,
      });
    } catch (error) {
      toast.error("Error saving profile");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <Card className="bg-[#000000] border border-[#00eaff] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#d8ae55]">Customize Profile</h2>
            <button
              onClick={onClose}
              className="text-[#cccccc] hover:text-[#00eaff] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="pictures" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[#0A0A10] border border-[#08080f]">
              <TabsTrigger value="pictures" className="text-xs">
                <Camera className="w-4 h-4 mr-2" />
                Pictures
              </TabsTrigger>
              <TabsTrigger value="info" className="text-xs">
                <Settings className="w-4 h-4 mr-2" />
                Info
              </TabsTrigger>
              <TabsTrigger value="theme" className="text-xs">
                <Palette className="w-4 h-4 mr-2" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="decorations" className="text-xs">
                <ImageIcon className="w-4 h-4 mr-2" />
                Badges
              </TabsTrigger>
            </TabsList>

            {/* Pictures Tab */}
            <TabsContent value="pictures" className="space-y-4 mt-4">
              <div className="space-y-4">
                {/* Profile Picture */}
                <div>
                  <p className="font-bold text-[#00eaff] mb-3">Profile Picture</p>
                  {showImageUploader === "profile" ? (
                    <ImageUploader
                      onImageSelect={(file: File) => {
                        setProfilePictureFile(file);
                        setShowImageUploader(null);
                      }}
                      onClose={() => setShowImageUploader(null)}
                      title="Upload Profile Picture"
                      description="Choose a square image for best results"
                    />
                  ) : (
                    <Button
                      onClick={() => setShowImageUploader("profile")}
                      className="w-full bg-transparent border border-[#d8ae55] text-[#d8ae55] hover:bg-[#d8ae55]/10 font-bold"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Upload Profile Picture
                    </Button>
                  )}
                </div>

                {/* Background Image */}
                <div>
                  <p className="font-bold text-[#00eaff] mb-3">Background Image</p>
                  {showImageUploader === "background" ? (
                    <ImageUploader
                      onImageSelect={(file: File) => {
                        setBackgroundImageFile(file);
                        setShowImageUploader(null);
                      }}
                      onClose={() => setShowImageUploader(null)}
                      title="Upload Background Image"
                      description="Choose a wide image (16:9 aspect ratio recommended)"
                    />
                  ) : (
                    <Button
                      onClick={() => setShowImageUploader("background")}
                      className="w-full bg-transparent border border-[#d8ae55] text-[#d8ae55] hover:bg-[#d8ae55]/10 font-bold"
                    >
                      <ImageIcon className="w-4 h-4 mr-2" />
                      Upload Background Image
                    </Button>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Info Tab */}
            <TabsContent value="info" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-2">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself..."
                  maxLength={500}
                  className="w-full h-24 px-3 py-2 bg-[#0A0A10] border border-[#08080f] rounded-lg text-[#00eaff] placeholder-[#cccccc] focus:border-[#00eaff] focus:outline-none resize-none"
                />
                <p className="text-xs text-[#cccccc] mt-1">
                  {bio.length}/500 characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-2">
                  Profile Visibility
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPublic}
                      onChange={() => setIsPublic(true)}
                      className="w-4 h-4"
                    />
                    <span className="text-[#cccccc]">Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isPublic}
                      onChange={() => setIsPublic(false)}
                      className="w-4 h-4"
                    />
                    <span className="text-[#cccccc]">Private</span>
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* Theme Tab */}
            <TabsContent value="theme" className="space-y-4 mt-4">
              <div>
                <label className="block text-sm font-bold text-[#00eaff] mb-3">
                  Profile Layout
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {["compact", "full", "showcase"].map((layout) => (
                    <button
                      key={layout}
                      onClick={() => setProfileLayout(layout as any)}
                      className={`p-3 rounded-lg border-2 transition-colors capitalize font-bold ${
                        profileLayout === layout
                          ? "border-[#00eaff] bg-transparent border border-[#00eaff] bg-[#00eaff]/10 text-[#d8ae55]"
                          : "border-[#08080f] bg-[#0A0A10] text-[#cccccc] hover:border-[#00eaff]"
                      }`}
                    >
                      {layout}
                    </button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Decorations Tab */}
            <TabsContent value="decorations" className="space-y-4 mt-4">
              {profile?.decorationPackageIds && profile.decorationPackageIds.length > 0 ? (
                <DecorationShowcase
                  decorations={profile.decorationPackageIds.map((id: number) => ({
                    id,
                    name: `Decoration ${id}`,
                    category: "badge" as const,
                    imageUrl: "",
                    rarity: "common" as const,
                  }))}
                  title="Your Decorations"
                />
              ) : (
                <Card className="bg-[#0A0A10] border border-[#08080f] p-4 text-center">
                  <p className="text-[#cccccc]">
                    No decorations yet. Earn them through gameplay!
                  </p>
                </Card>
              )}
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 mt-6">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 text-[#cccccc] border-[#08080f]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={updateProfile.isPending}
              className="flex-1 bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10 font-bold disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
