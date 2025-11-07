"use client"

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import toast from "react-hot-toast";
import { useSoundEffects } from "@/hooks/useSoundEffects";

type Props = {
  address: string;
  onSaved?: (profile: any) => void;
};

export default function ProfileForm({ address, onSaved }: Props) {
  const { playSound, playSequence } = useSoundEffects();
  const [handle, setHandle] = useState("");
  const [bio, setBio] = useState("");
  const [github, setGithub] = useState("");
  const [site, setSite] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isNewProfile, setIsNewProfile] = useState(true);

  useEffect(() => {
    setError(null);
    setResult(null);

    // Check if profile exists
    async function checkProfile() {
      try {
        const res = await fetch(`/api/profile?address=${address}`);
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setIsNewProfile(false);
            // Pre-fill the form
            setHandle(data.profile.handle || "");
            setBio(data.profile.bio || "");
            setGithub(data.profile.links?.github || "");
            setSite(data.profile.links?.site || "");
            setSkills(data.profile.skills?.join(", ") || "");
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    }
    checkProfile();
  }, [address]);

  function celebrateLevelUp() {
    // Carnival-themed confetti explosion
    // Wrapped to ensure client-side only execution
    if (typeof window === 'undefined') return;

    const duration = 3000;
    const animationEnd = performance.now() + duration;
    const carnivalColors = ['#F43F5E', '#F59E0B', '#FBBF24', '#EC4899', '#34D399'];
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: carnivalColors
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - performance.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      address,
      handle,
      bio,
      links: { github: github || null, site: site || null },
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save");
      setResult(data);

      // Award XP
      const action = isNewProfile ? "CREATE_PROFILE" : "UPDATE_PROFILE";
      try {
        const xpRes = await fetch("/api/xp/award", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address, action }),
        });

        if (xpRes.ok) {
          const xpData = await xpRes.json();

          // Play success sound
          playSound('success');

          // Show XP notification with carnival colors
          toast.success(`+${xpData.xpAwarded} XP, +${xpData.coinsAwarded} coins! 🎉`, {
            duration: 4000,
            position: "top-center",
            style: {
              background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "600",
              border: "2px solid rgba(52, 211, 153, 0.5)",
              borderRadius: "0.5rem",
            },
          });

          // Update quest progress
          try {
            await fetch("/api/quests/progress", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                address,
                action: "update_profile",
                increment: 1,
              }),
            });
          } catch (err) {
            console.error("Failed to update quest progress:", err);
          }

          // Level up celebration with carnival gradient
          if (xpData.levelUp) {
            playSequence(['levelUp', 'achievement', 'coin'], 150);
            celebrateLevelUp();
            toast.success(
              `🎊 LEVEL UP! You reached Level ${xpData.levelUp.newLevel}! 🎊`,
              {
                duration: 5000,
                position: "top-center",
                style: {
                  background: "linear-gradient(135deg, #F43F5E 0%, #F59E0B 100%)",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "bold",
                  border: "2px solid rgba(251, 191, 36, 0.6)",
                  borderRadius: "0.5rem",
                  boxShadow: "0 0 20px rgba(244, 63, 94, 0.5)",
                },
              }
            );
          }

          // Achievement unlocks with carnival ticket color
          if (xpData.newAchievements && xpData.newAchievements.length > 0) {
            playSound('achievement');
            xpData.newAchievements.forEach((achievement: any) => {
              toast.success(
                `🏆 Achievement Unlocked: ${achievement.name}!`,
                {
                  duration: 5000,
                  position: "top-right",
                  style: {
                    background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
                    color: "#0F172A",
                    fontSize: "16px",
                    fontWeight: "600",
                    border: "2px solid rgba(251, 191, 36, 0.8)",
                    borderRadius: "0.5rem",
                  },
                }
              );
            });
          }
        }
      } catch (xpErr) {
        console.error("Failed to award XP:", xpErr);
      }

      setIsNewProfile(false);
      onSaved?.(data.profile ?? data);
    } catch (err: any) {
      playSound('error');
      setError(err?.message || String(err));
      toast.error(`Error: ${err?.message || String(err)}`, {
        duration: 4000,
        position: "top-center",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={submit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Handle</label>
            <input
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Your unique handle"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Wallet Address</label>
            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl font-mono text-sm text-white/70 break-all">
              {address}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            rows={4}
            placeholder="Tell us about yourself..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">GitHub</label>
            <input
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="https://github.com/username"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-white/90">Website</label>
            <input
              value={site}
              onChange={(e) => setSite(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-white/90">Skills</label>
          <input
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="React, TypeScript, Blockchain (comma separated)"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-600 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Saving...</span>
              </div>
            ) : (
              'Save Profile'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 text-red-400">⚠️</div>
            <span className="text-red-400 font-medium">Error: {error}</span>
          </div>
        </div>
      )}

      {result && (
        <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-5 h-5 text-green-400">✅</div>
            <span className="text-green-400 font-semibold">Profile Saved Successfully!</span>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-white/10">
              <span className="text-white/70">Trust Score:</span>
              <span className="font-semibold text-green-400">{result.profile?.score ?? result.score}/100</span>
            </div>

            <div className="space-y-2">
              <span className="text-white/70 text-sm">Profile Hash:</span>
              <div className="font-mono text-xs bg-black/30 p-3 rounded-lg break-all text-white/80">
                {result.precomputedHashHex ?? result.hashHex}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
