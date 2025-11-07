"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { xpForNextLevel, xpForCurrentLevel, calculateLevelProgress } from "@/lib/gamification";

interface XPBarProps {
  xp: number;
  level: number;
  className?: string;
  showLabel?: boolean;
}

export function XPBar({ xp, level, className, showLabel = true }: XPBarProps) {
  const currentLevelXP = xpForCurrentLevel(level);
  const nextLevelXP = xpForNextLevel(level);
  const xpInLevel = xp - currentLevelXP;
  const progress = calculateLevelProgress(xp, level);

  return (
    <div className={cn("space-y-2", className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-carnival-violet animate-lights-glow" />
            <span className="text-white/70 font-medium">Level {level}</span>
          </div>
          <span className="text-carnival-twist font-semibold">
            {xpInLevel} / {nextLevelXP} XP
          </span>
        </div>
      )}
      <div className="relative">
        <Progress value={progress} className="h-2 bg-carnival-night/50" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-carnival-twist/20 to-carnival-marquee/20 rounded-full pointer-events-none"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>
    </div>
  );
}
