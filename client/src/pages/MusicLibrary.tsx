import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Music, Search, Filter, Play, Download } from "lucide-react";
import { trpc } from "@/lib/trpc";
import MusicPlayer from "@/components/MusicPlayer";

export default function MusicLibrary() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [selectedTrack, setSelectedTrack] = useState<any>(null);

  const { data: allTracks } = trpc.music.getAllTracks.useQuery();
  const { data: moods } = trpc.music.getMoods.useQuery();
  const { data: genres } = trpc.music.getGenres.useQuery();
  const { data: searchResults } = trpc.music.search.useQuery({
    query: searchQuery,
    mood: selectedMood || undefined,
    genre: selectedGenre || undefined,
  });

  const displayTracks = searchQuery || selectedMood || selectedGenre ? searchResults : allTracks;
  const playerTracks = displayTracks || [];

  return (
    <div className="min-h-screen bg-[#0A0A10] text-[#00eaff]">
      {/* Navigation */}
      <nav className="border-b border-[#08080f] px-6 py-4 sticky top-0 bg-[#0A0A10]/95 backdrop-blur z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Music className="w-8 h-8 text-[#d8ae55]" />
            <h1 className="text-2xl font-bold text-accent">Music Library</h1>
          </div>
          <p className="text-[#cccccc]">Copyright-free music for lounges, profiles & more</p>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search & Filters */}
            <Card className="bg-[#000000] border border-[#08080f] p-6">
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-[#cccccc]" />
                  <input
                    type="text"
                    placeholder="Search by title or artist..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#0A0A10] border border-[#08080f] rounded-lg text-[#00eaff] placeholder-[#cccccc] focus:border-[#00eaff] focus:outline-none"
                  />
                </div>

                {/* Filter Controls */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold text-[#cccccc] mb-2 block">Mood</label>
                    <select
                      value={selectedMood}
                      onChange={(e) => setSelectedMood(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A0A10] border border-[#08080f] rounded-lg text-[#00eaff] focus:border-[#00eaff] focus:outline-none"
                    >
                      <option value="">All Moods</option>
                      {moods?.map((mood) => (
                        <option key={mood} value={mood}>
                          {mood.charAt(0).toUpperCase() + mood.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-bold text-[#cccccc] mb-2 block">Genre</label>
                    <select
                      value={selectedGenre}
                      onChange={(e) => setSelectedGenre(e.target.value)}
                      className="w-full px-3 py-2 bg-[#0A0A10] border border-[#08080f] rounded-lg text-[#00eaff] focus:border-[#00eaff] focus:outline-none"
                    >
                      <option value="">All Genres</option>
                      {genres?.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre.charAt(0).toUpperCase() + genre.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {(searchQuery || selectedMood || selectedGenre) && (
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedMood("");
                      setSelectedGenre("");
                    }}
                    variant="outline"
                    className="w-full text-[#cccccc] border-[#08080f]"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </Card>

            {/* Music Tracks List */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-[#00eaff]">
                Available Tracks ({playerTracks.length})
              </h2>

              {playerTracks && playerTracks.length > 0 ? (
                playerTracks.map((track: any) => (
                  <Card
                    key={track.id}
                    onClick={() => setSelectedTrack(track)}
                    className={`bg-[#000000] border-2 p-4 cursor-pointer transition-all ${
                      selectedTrack?.id === track.id
                        ? "border-[#00eaff] bg-transparent border border-[#00eaff] bg-[#00eaff]/10"
                        : "border-[#08080f] hover:border-[#00eaff]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-bold text-[#00eaff]">{track.title}</h3>
                        <div className="flex gap-4 text-sm text-[#cccccc] mt-2">
                          <span>{track.artist}</span>
                          <span className="capitalize">{track.mood}</span>
                          <span className="capitalize">{track.genre}</span>
                          <span className="capitalize">{track.license}</span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-transparent border border-[#00eaff] text-[#00eaff] hover:bg-[#00eaff]/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTrack(track);
                        }}
                      >
                        <Play className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))
              ) : (
                <Card className="bg-[#000000] border border-[#08080f] p-8 text-center">
                  <p className="text-[#cccccc]">No tracks found matching your criteria</p>
                </Card>
              )}
            </div>
          </div>

          {/* Player Sidebar */}
          <div className="space-y-6">
            {selectedTrack && playerTracks.length > 0 ? (
              <>
                <MusicPlayer
                  tracks={playerTracks}
                  onTrackChange={setSelectedTrack}
                  compact={false}
                />

                {/* Usage Guide */}
                <Card className="bg-[#000000] border border-[#08080f] p-6">
                  <h3 className="font-bold text-[#00eaff] mb-4">How to Use</h3>
                  <ul className="space-y-3 text-sm text-[#cccccc]">
                    <li className="flex gap-2">
                      <span className="text-[#d8ae55]">1.</span>
                      <span>Select a track from the list</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#00eaff]">2.</span>
                      <span>Preview the music in the player</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#d8ae55]">3.</span>
                      <span>Copy the track URL for your lounge/profile</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="text-[#ffd700]">4.</span>
                      <span>Include attribution as shown in license info</span>
                    </li>
                  </ul>
                </Card>

                {/* Track Details */}
                <Card className="bg-[#000000] border border-[#00eaff] p-6">
                  <h3 className="font-bold text-[#d8ae55] mb-4">Track Details</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-[#cccccc] mb-1">URL</p>
                      <input
                        type="text"
                        value={selectedTrack.url}
                        readOnly
                        className="w-full px-2 py-1 bg-[#0A0A10] border border-[#08080f] rounded text-[#00eaff] text-xs"
                      />
                    </div>
                    <div>
                      <p className="text-[#cccccc] mb-1">Attribution</p>
                      <p className="text-[#00eaff] text-xs">{selectedTrack.attribution}</p>
                    </div>
                    <div>
                      <p className="text-[#cccccc] mb-1">Duration</p>
                      <p className="text-[#00eaff]">
                        {Math.floor(selectedTrack.duration / 60)}:
                        {String(selectedTrack.duration % 60).padStart(2, "0")}
                      </p>
                    </div>
                  </div>
                </Card>
              </>
            ) : (
              <Card className="bg-[#000000] border border-[#08080f] p-6 text-center">
                <Music className="w-8 h-8 text-[#cccccc] mx-auto mb-4" />
                <p className="text-[#cccccc]">Select a track to preview and get details</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
