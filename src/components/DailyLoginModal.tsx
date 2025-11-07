"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { Coins, Flame, Gift, X, Zap } from "lucide-react";

interface DailyLoginModalProps {
  address: string;
  onClose: () => void;
}

export function DailyLoginModal({ address, onClose }: DailyLoginModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    checkAndAwardDailyLogin();
  }, [address]);

  function celebrate() {
    // Carnival-themed confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F43F5E', '#F59E0B', '#FBBF24', '#EC4899', '#34D399'],
    });
  }

  async function checkAndAwardDailyLogin() {
    try {
      const res = await fetch("/api/login/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });

      if (res.ok) {
        const result = await res.json();

        // Only show modal if login was successful (not already logged in today)
        if (result.success && !result.alreadyLoggedIn) {
          setData(result);
          setIsOpen(true);
          celebrate();
        }
      }
    } catch (err) {
      console.error("Failed to process daily login:", err);
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    setIsOpen(false);
    setTimeout(onClose, 300);
  }

  if (loading || !isOpen) return null;

  const streakMilestone = data.streak?.milestone;
  const isMilestone = streakMilestone && [7, 30, 100, 365].includes(data.streak.current);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md">
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute -top-2 -right-2 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all z-10"
              >
                <X className="w-5 h-5 text-white" />
              </button>

              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-carnival-night via-carnival-canvas to-carnival-night border-2 border-carnival-twist/50 shadow-2xl">
                {/* Carnival glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-carnival-marquee/10 via-transparent to-carnival-twist/10 animate-marquee-pulse" />

                {/* Striped awning decoration at top */}
                <div className="absolute top-0 left-0 right-0 h-4 awning-stripes opacity-40" />

                <div className="relative p-8 space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="inline-block text-6xl mb-2"
                    >
                      <Gift className="w-16 h-16 text-carnival-ticket mx-auto animate-lights-glow" />
                    </motion.div>
                    <h2 className="text-3xl font-bold carnival-text drop-shadow-lg">
                      Welcome to the Midway!
                    </h2>
                    <p className="text-white/70">You've earned your daily carnival prize</p>
                  </div>

                  {/* Rewards */}
                  <div className="space-y-3">
                    {/* XP Reward */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center justify-between p-4 bg-carnival-violet/10 border-2 border-carnival-violet/30 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-carnival-violet/20 rounded-lg">
                          <Zap className="w-6 h-6 text-carnival-violet animate-lights-glow" />
                        </div>
                        <span className="text-white font-medium">Experience Points</span>
                      </div>
                      <span className="text-2xl font-bold text-carnival-violet">
                        +{data.xpAwarded} XP
                      </span>
                    </motion.div>

                    {/* Coins Reward */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center justify-between p-4 bg-carnival-ticket/10 border-2 border-carnival-ticket/30 rounded-xl"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-carnival-ticket/20 rounded-lg">
                          <Coins className="w-6 h-6 text-carnival-ticket animate-lights-glow" />
                        </div>
                        <span className="text-white font-medium">Carnival Coins</span>
                      </div>
                      <span className="text-2xl font-bold text-carnival-ticket">
                        +{data.coinsAwarded}
                      </span>
                    </motion.div>

                    {/* Streak */}
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        isMilestone
                          ? "bg-gradient-to-r from-carnival-marquee/20 to-carnival-twist/20 border-2 border-carnival-marquee/50"
                          : "bg-carnival-twist/10 border-2 border-carnival-twist/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-carnival-twist/20 rounded-lg">
                          <Flame className="w-6 h-6 text-carnival-twist animate-lights-glow" />
                        </div>
                        <div>
                          <span className="text-white font-medium block">Login Streak</span>
                          {isMilestone && (
                            <span className="text-carnival-marquee text-xs font-semibold animate-marquee-pulse">
                              MILESTONE REACHED! 🎊
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-2xl font-bold text-carnival-twist">
                        {data.streak.current} 🔥
                      </span>
                    </motion.div>

                    {/* Milestone Bonus */}
                    {isMilestone && streakMilestone && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, type: "spring" }}
                        className="p-4 bg-gradient-to-r from-carnival-marquee/20 to-carnival-candy/20 border-2 border-carnival-candy/50 rounded-xl text-center"
                      >
                        <p className="text-sm text-white/70 mb-1">Carnival Jackpot!</p>
                        <p className="text-xl font-bold carnival-text">
                          +{streakMilestone.bonusXP} XP, +{streakMilestone.bonusCoins} Coins
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Encouragement Message */}
                  <div className="text-center pt-4 border-t border-white/10">
                    <p className="text-white/60 text-sm">
                      {data.streak.current < 7
                        ? `Keep going! ${7 - data.streak.current} more days to your next milestone.`
                        : data.streak.current < 30
                        ? `Amazing streak! ${30 - data.streak.current} more days to the next milestone.`
                        : "You're on fire! Keep up the incredible streak!"}
                    </p>
                  </div>

                  {/* CTA Button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-semibold text-white transition-all shadow-lg"
                  >
                    Continue to Dashboard
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
