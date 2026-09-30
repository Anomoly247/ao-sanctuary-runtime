import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, Volume2, Music, SkipForward, SkipBack, Share2 } from "lucide-react";
import ShareModal from "./ShareModal";
import { trpc } from "@/lib/trpc";

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  url: string;
  mood: string;
  genre: string;
  license: string;
}

interface MusicPlayerProps {
  tracks: Track[];
  onTrackChange?: (track: Track) => void;
  compact?: boolean;
}

export default function MusicPlayer({ tracks, onTrackChange, compact = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(70);
  const [showShareModal, setShowShareModal] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];
  const { data: shareData } = trpc.sharing.generateMusicShareUrls.useQuery(
    {
      trackId: currentTrack?.id || "",
      title: currentTrack?.title || "",
      artist: currentTrack?.artist || "",
      mood: currentTrack?.mood || "",
      genre: currentTrack?.genre || "",
      license: currentTrack?.license || "",
    },
    { enabled: !!currentTrack }
  );

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleNextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
    if (onTrackChange) {
      onTrackChange(tracks[nextIndex]);
    }
  };

  const handlePrevTrack = () => {
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
    if (onTrackChange) {
      onTrackChange(tracks[prevIndex]);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  if (!currentTrack) {
    return (
      <Card className="bg-[#000000] border border-[#08080f] p-4">
        <p className="text-[#cccccc] text-center">No music available</p>
      </Card>
    );
  }

  if (compact) {
    return (
      <div className="bg-[#0A0A10] border border-[#08080f] rounded-lg p-3">
        <audio ref={audioRef} src={currentTrack.url} />
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={handlePlayPause}
            className="bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-[#00eaff] truncate">{currentTrack.title}</p>
            <p className="text-xs text-[#cccccc] truncate">{currentTrack.artist}</p>
          </div>
          <Button size="sm" variant="ghost" onClick={handleNextTrack} className="text-[#cccccc]">
            <SkipForward className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowShareModal(true)}
            className="text-[#cccccc] hover:text-[#ff00c8]"
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
        {shareData && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            title={currentTrack.title}
            description={`by ${currentTrack.artist} - ${currentTrack.mood} ${currentTrack.genre}`}
            shareUrls={shareData.urls}
            shareUrl={shareData.card.shareUrl}
          />
        )}
      </div>
    );
  }

  return (
    <Card className="bg-[#000000] border border-[#00eaff] p-6">
      <audio ref={audioRef} src={currentTrack.url} />

      <div className="flex items-center gap-4 mb-6">
        <Music className="w-8 h-8 text-[#ff00c8]" />
        <div className="flex-1">
          <h4 className="text-lg font-bold text-[#00eaff]">{currentTrack.title}</h4>
          <p className="text-sm text-[#cccccc]">{currentTrack.artist}</p>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <Button
          size="sm"
          variant="outline"
          onClick={handlePrevTrack}
          className="text-[#cccccc] border-[#08080f]"
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          onClick={handlePlayPause}
          className="bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10 font-bold w-12 h-12"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={handleNextTrack}
          className="text-[#cccccc] border-[#08080f]"
        >
          <SkipForward className="w-4 h-4" />
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 mb-6">
        <Volume2 className="w-4 h-4 text-[#cccccc]" />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolumeChange}
          className="flex-1 h-2 bg-[#08080f] rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #ff00c8 0%, #ff00c8 ${volume}%, #08080f ${volume}%, #08080f 100%)`,
          }}
        />
        <span className="text-sm text-[#cccccc] w-8 text-right">{volume}%</span>
      </div>

      {/* Share Button */}
      <div className="flex gap-2">
        <Button
          onClick={() => setShowShareModal(true)}
          className="flex-1 bg-transparent border border-[#d8ae55] text-[#d8ae55] hover:bg-[#d8ae55]/10 font-bold"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share This Track
        </Button>
      </div>

      {/* Track Info */}
      <div className="bg-[#0A0A10] rounded-lg p-4 border border-[#08080f]">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[#cccccc] text-xs mb-1">Mood</p>
            <p className="text-[#00eaff] font-bold capitalize">{currentTrack.mood}</p>
          </div>
          <div>
            <p className="text-[#cccccc] text-xs mb-1">Duration</p>
            <p className="text-[#00eaff] font-bold">
              {Math.floor(currentTrack.duration / 60)}:{String(currentTrack.duration % 60).padStart(2, "0")}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-[#cccccc] text-xs mb-1">License</p>
            <p className="text-[#ff00c8] font-bold capitalize">{currentTrack.license}</p>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="mt-6">
        <p className="text-sm font-bold text-[#00eaff] mb-3">Playlist ({tracks.length})</p>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tracks.map((track, idx) => (
            <button
              key={track.id}
              onClick={() => {
                setCurrentTrackIndex(idx);
                if (onTrackChange) {
                  onTrackChange(track);
                }
              }}
              className={`w-full text-left p-2 rounded-lg transition-colors ${
                idx === currentTrackIndex
                  ? "bg-transparent border border-[#00eaff] bg-[#00eaff]/10 border border-[#00eaff]"
                  : "bg-[#0A0A10] border border-[#08080f] hover:border-[#00eaff]"
              }`}
            >
              <p className={`text-sm font-bold ${idx === currentTrackIndex ? "text-[#ff00c8]" : "text-[#00eaff]"}`}>
                {track.title}
              </p>
              <p className="text-xs text-[#cccccc]">{track.artist}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Share Modal */}
      {shareData && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={currentTrack.title}
          description={`by ${currentTrack.artist} - ${currentTrack.mood} ${currentTrack.genre}`}
          shareUrls={shareData.urls}
          shareUrl={shareData.card.shareUrl}
        />
      )}
    </Card>
  );
}
