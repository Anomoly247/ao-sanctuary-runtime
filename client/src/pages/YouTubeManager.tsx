import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Upload, Play, Settings, TrendingUp, Trash2, Edit, Share2, Eye, AlertCircle, Calendar, Tag } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function YouTubeManager() {
  const { isAuthenticated, loading, user } = useAuth();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Sample video library data
  const videos = [
    {
      id: 1,
      title: "Anom Artsy Platform Tour",
      description: "Complete walkthrough of the Anom Artsy social platform",
      views: 1250,
      likes: 89,
      comments: 23,
      uploadDate: "2026-05-10",
      status: "published",
      thumbnail: "https://via.placeholder.com/320x180?text=Video+1",
      url: "https://youtube.com/watch?v=example1",
    },
    {
      id: 2,
      title: "VIP Membership Benefits Explained",
      description: "Learn about our VIP tiers and exclusive perks",
      views: 856,
      likes: 67,
      comments: 15,
      uploadDate: "2026-05-08",
      status: "published",
      thumbnail: "https://via.placeholder.com/320x180?text=Video+2",
      url: "https://youtube.com/watch?v=example2",
    },
    {
      id: 3,
      title: "Collaboration Station: Making Social Impact",
      description: "How to create and join social good projects",
      views: 0,
      likes: 0,
      comments: 0,
      uploadDate: "2026-05-15",
      status: "scheduled",
      thumbnail: "https://via.placeholder.com/320x180?text=Video+3",
      url: null,
    },
    {
      id: 4,
      title: "Kids Corner Adventures",
      description: "Fun educational content for kids",
      views: 0,
      likes: 0,
      comments: 0,
      uploadDate: "2026-05-16",
      status: "draft",
      thumbnail: "https://via.placeholder.com/320x180?text=Video+4",
      url: null,
    },
  ];

  const channelStats = {
    subscribers: 15420,
    totalViews: 2106,
    totalVideos: 4,
    avgEngagement: 8.5,
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast.success(`Selected: ${file.name}`);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a video file");
      return;
    }

    setIsUploading(true);
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 300));
    }

    setIsUploading(false);
    setUploadProgress(0);
    setSelectedFile(null);
    toast.success("Video uploaded successfully!");
  };

  const handlePublish = (videoId: number) => {
    toast.success("Video published to YouTube!");
  };

  const handleSchedule = (videoId: number) => {
    toast.success("Video scheduled for publishing!");
  };

  const handleDelete = (videoId: number) => {
    toast.error("Video deleted");
  };

  const handleShare = (videoId: number) => {
    toast.success("Share link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-[#93c5fd] text-xl">Loading YouTube Manager...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 mx-auto mb-4 text-[#c4b5fd]" />
          <p className="text-[#93c5fd] text-xl mb-4">Admin access required</p>
          <Button className="btn-primary" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-[#93c5fd]">
      {/* Navigation */}
      <nav className="border-b border-[#334155] px-6 py-4 sticky top-0 bg-[#0f172a]/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin")} className="text-[#94a3b8]">
              ← Back
            </Button>
            <h1 className="text-2xl font-bold text-info">YouTube Upload Manager</h1>
          </div>
          <div className="flex items-center gap-2">
            <Play className="w-5 h-5 text-[#c4b5fd]" />
            <span className="text-sm text-[#94a3b8]">Connected to YouTube</span>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Channel Statistics */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-[#1e293b] border border-[#334155] p-6" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Subscribers</p>
                <p className="text-3xl font-bold text-[#c4b5fd]">{channelStats.subscribers.toLocaleString()}</p>
              </div>
              <Eye className="w-8 h-8 text-[#c4b5fd] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1e293b] border border-[#334155] p-6" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Total Views</p>
                <p className="text-3xl font-bold text-[#93c5fd]">{channelStats.totalViews.toLocaleString()}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#93c5fd] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1e293b] border border-[#334155] p-6" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Total Videos</p>
                <p className="text-3xl font-bold text-[#a5b4fc]">{channelStats.totalVideos}</p>
              </div>
              <Play className="w-8 h-8 text-[#a5b4fc] opacity-50" />
            </div>
          </Card>

          <Card className="bg-[#1e293b] border border-[#334155] p-6" style={{boxShadow: '0 8px 24px rgba(15, 23, 42, 0.22)'}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#94a3b8] text-sm">Avg Engagement</p>
                <p className="text-3xl font-bold text-[#93c5fd]">{channelStats.avgEngagement}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#93c5fd] opacity-50" />
            </div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-[#1e293b] border border-[#334155] mb-8">
            <TabsTrigger value="upload" className="text-[#93c5fd]">
              <Upload className="w-4 h-4 mr-2" />
              Upload Video
            </TabsTrigger>
            <TabsTrigger value="library" className="text-[#93c5fd]">
              <Play className="w-4 h-4 mr-2" />
              Video Library
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-[#93c5fd]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-[#93c5fd]">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Upload Tab */}
          <TabsContent value="upload" className="space-y-6">
            <Card className="bg-[#1e293b] border border-[#334155] p-8">
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-[#c4b5fd]">Upload New Video</h3>

                {/* File Upload Area */}
                <div className="border-2 border-dashed border-[#334155] rounded-lg p-12 text-center hover:border-[#93c5fd] transition-colors cursor-pointer">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                    id="video-upload"
                  />
                  <label htmlFor="video-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 mx-auto mb-4 text-[#93c5fd] opacity-50" />
                    <p className="text-[#93c5fd] font-bold mb-2">
                      {selectedFile ? selectedFile.name : "Drag and drop your video here"}
                    </p>
                    <p className="text-[#94a3b8] text-sm">or click to browse (Max 100GB)</p>
                  </label>
                </div>

                {/* Video Metadata */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">Video Title</label>
                    <Input placeholder="Enter video title..." className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]" />
                  </div>

                  <div>
                    <label className="block text-[#93c5fd] font-bold mb-2">Description</label>
                    <textarea placeholder="Enter video description..." className="w-full bg-[#0f172a] border border-[#334155] text-[#93c5fd] p-3 rounded min-h-24" />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#93c5fd] font-bold mb-2">Tags</label>
                      <Input placeholder="anom, artsy, neon, community..." className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]" />
                    </div>

                    <div>
                      <label className="block text-[#93c5fd] font-bold mb-2">Visibility</label>
                      <select className="w-full bg-[#0f172a] border border-[#334155] text-[#93c5fd] p-2 rounded">
                        <option>Public</option>
                        <option>Unlisted</option>
                        <option>Private</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#93c5fd]">Uploading...</span>
                      <span className="text-[#94a3b8]">{uploadProgress}%</span>
                    </div>
                    <div className="w-full bg-[#0f172a] rounded-full h-2 border border-[#334155]">
                      <div
                        className="bg-gradient-to-r from-[#c4b5fd] to-[#93c5fd] h-full rounded-full transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    className="flex-1 btn-primary"
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Publish
                  </Button>
                  <Button
                    className="flex-1 btn-secondary"
                    onClick={handleUpload}
                    disabled={!selectedFile || isUploading}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Upload & Schedule
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Video Library Tab */}
          <TabsContent value="library" className="space-y-6">
            <h3 className="text-xl font-bold text-[#c4b5fd]">Video Library</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {videos.map((video) => (
                <Card key={video.id} className="bg-[#1e293b] border border-[#334155] overflow-hidden hover:border-[#93c5fd] transition-colors">
                  <img src={video.thumbnail} alt={video.title} className="w-full h-40 object-cover" />
                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-lg font-bold text-[#93c5fd] line-clamp-2">{video.title}</h4>
                      <p className="text-xs text-[#94a3b8] mt-1">{video.uploadDate}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="bg-[#0f172a] p-2 rounded text-center">
                        <p className="text-[#94a3b8] text-xs">Views</p>
                        <p className="text-[#93c5fd] font-bold">{video.views}</p>
                      </div>
                      <div className="bg-[#0f172a] p-2 rounded text-center">
                        <p className="text-[#94a3b8] text-xs">Likes</p>
                        <p className="text-[#c4b5fd] font-bold">{video.likes}</p>
                      </div>
                      <div className="bg-[#0f172a] p-2 rounded text-center">
                        <p className="text-[#94a3b8] text-xs">Comments</p>
                        <p className="text-[#a5b4fc] font-bold">{video.comments}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1 text-[#93c5fd] border-[#334155]" onClick={() => handleShare(video.id)}>
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-[#94a3b8] border-[#334155]" onClick={() => handleDelete(video.id)}>
                        <Trash2 className="w-3 h-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h3 className="text-xl font-bold text-[#c4b5fd]">Channel Analytics</h3>
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-[#94a3b8] text-sm mb-2">Views Over Time</p>
                    <div className="h-40 bg-[#0f172a] rounded border border-[#334155] flex items-center justify-center">
                      <p className="text-[#94a3b8]">Chart placeholder</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[#94a3b8] text-sm mb-2">Engagement Rate</p>
                    <div className="h-40 bg-[#0f172a] rounded border border-[#334155] flex items-center justify-center">
                      <p className="text-[#94a3b8]">Chart placeholder</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[#94a3b8] text-sm mb-2">Top Videos</p>
                  <div className="space-y-2">
                    {videos.filter(v => v.status === "published").map((video) => (
                      <div key={video.id} className="flex justify-between items-center p-3 bg-[#0f172a] rounded border border-[#334155]">
                        <div className="flex-1">
                          <p className="text-[#93c5fd] font-bold text-sm">{video.title}</p>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-[#94a3b8]">{video.views} views</span>
                          <span className="text-[#c4b5fd]">{video.likes} likes</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <h3 className="text-xl font-bold text-[#c4b5fd]">YouTube Settings</h3>
            <Card className="bg-[#1e293b] border border-[#334155] p-6">
              <div className="space-y-6">
                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">Channel Name</label>
                  <Input value="Anom Artsy" disabled className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]" />
                </div>

                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">Default Video Description</label>
                  <textarea placeholder="Enter default description for all videos..." className="w-full bg-[#0f172a] border border-[#334155] text-[#93c5fd] p-3 rounded min-h-24" />
                </div>

                <div>
                  <label className="block text-[#93c5fd] font-bold mb-2">Default Tags</label>
                  <Input placeholder="anom, artsy, neon..." className="bg-[#0f172a] border border-[#334155] text-[#93c5fd]" />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[#93c5fd] font-bold mb-2">
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                    Auto-publish videos immediately after upload
                  </label>
                </div>

                <Button className="w-full btn-primary">Save Settings</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
