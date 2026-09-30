import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Award, Star, Trophy, Heart } from "lucide-react";

export default function Achievements() {
  const { user, isAuthenticated } = useAuth();
  const { data: profileData } = trpc.profile.getMe.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const { data: allAchievements } = trpc.achievement.getAll.useQuery();
  const { data: userAchievements } = trpc.achievement.getUserAchievements.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0A0A10] text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#cccccc] mb-4">Sign in to view your achievements</p>
        </div>
      </div>
    );
  }

  const level = profileData?.level || 1;
  const xp = profileData?.xp || 0;
  const xpPerLevel = 100;
  const xpProgress = (xp / xpPerLevel) * 100;

  const unlockedIds = new Set(userAchievements?.map((a) => a.achievementId) || []);

  return (
    <div className="min-h-screen bg-[#0A0A10] text-white p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#00eaff] mb-2">Achievements & Progress</h1>
          <p className="text-[#cccccc]">Track your journey and unlock badges</p>
        </div>

        {/* Level Card */}
        <div
          className="rounded-lg border-2 border-[#00eaff] p-8 mb-8"
          style={{
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.28)",
          }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[#cccccc] text-sm mb-2">Current Level</p>
              <p className="text-5xl font-bold text-[#00eaff]">{level}</p>
            </div>
            <Trophy className="w-24 h-24 text-[#00eaff] opacity-50" />
          </div>

          {/* XP Progress Bar */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-[#cccccc] text-sm">Experience Points</span>
              <span className="text-[#ff00c8] font-bold">
                {xp} / {xpPerLevel}
              </span>
            </div>
            <div className="w-full h-4 bg-[#141423] rounded-full border border-[#cccccc] overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff00c8] to-[#00eaff]"
                style={{ width: `${xpProgress}%`, transition: "width 0.3s ease" }}
              />
            </div>
          </div>
        </div>

        {/* Achievements Grid */}
        <div>
          <h2 className="text-2xl font-bold text-[#ff00c8] mb-6">Achievements</h2>
          {!allAchievements || allAchievements.length === 0 ? (
            <div
              className="rounded-lg border-2 border-[#cccccc] p-8 text-center"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)",
              }}
            >
              <p className="text-[#cccccc]">No achievements available yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allAchievements.map((achievement) => {
                const isUnlocked = unlockedIds.has(achievement.id);
                return (
                  <div
                    key={achievement.id}
                    className={`rounded-lg border-2 p-6 transition-all ${
                      isUnlocked
                        ? "border-[#ff00c8] bg-[#141423]"
                        : "border-[#cccccc] bg-[#0A0A10] opacity-60"
                    }`}
                    style={{
                      boxShadow: isUnlocked
                        ? "0 0 15px rgba(196, 181, 253, 0.2)"
                        : "0 0 10px rgba(122, 127, 142, 0.1)",
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-white mb-1">{achievement.name}</h3>
                        <p className="text-[#cccccc] text-sm">{achievement.description}</p>
                      </div>
                      {isUnlocked ? (
                        <Award className="w-6 h-6 text-[#ff00c8] flex-shrink-0 ml-2" />
                      ) : (
                        <Star className="w-6 h-6 text-[#cccccc] flex-shrink-0 ml-2" />
                      )}
                    </div>

                    {isUnlocked && (
                      <div className="text-[#00eaff] text-xs font-bold">✓ UNLOCKED</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Achievement Categories */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-lg border-2 border-[#d8ae55] p-6" style={{ boxShadow: "0 6px 18px rgba(0, 0, 0, 0.45)" }}>
            <Heart className="w-8 h-8 text-[#d8ae55] mb-3" />
            <h3 className="font-bold text-white mb-2">Social Good</h3>
            <p className="text-[#cccccc] text-sm">Earn by helping others and spreading positivity</p>
          </div>
          <div className="rounded-lg border-2 border-[#00eaff] p-6" style={{ boxShadow: "0 6px 18px rgba(0, 0, 0, 0.45)" }}>
            <Trophy className="w-8 h-8 text-[#00eaff] mb-3" />
            <h3 className="font-bold text-white mb-2">Games</h3>
            <p className="text-[#cccccc] text-sm">Unlock badges by winning mini-games</p>
          </div>
          <div className="rounded-lg border-2 border-[#ff00c8] p-6" style={{ boxShadow: "0 6px 18px rgba(0, 0, 0, 0.45)" }}>
            <Star className="w-8 h-8 text-[#ff00c8] mb-3" />
            <h3 className="font-bold text-white mb-2">Milestones</h3>
            <p className="text-[#cccccc] text-sm">Reach level milestones and community goals</p>
          </div>
        </div>
      </div>
    </div>
  );
}
