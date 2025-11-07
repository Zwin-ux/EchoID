"use client";

import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ACHIEVEMENTS, RARITY_COLORS, RARITY_BG_COLORS } from "@/lib/gamification";

interface AchievementCardProps {
  badgeType: string;
  unlocked: boolean;
  earnedAt?: Date;
  className?: string;
}

export function AchievementCard({
  badgeType,
  unlocked,
  earnedAt,
  className,
}: AchievementCardProps) {
  const achievement = ACHIEVEMENTS[badgeType.toUpperCase() as keyof typeof ACHIEVEMENTS];

  if (!achievement) return null;

  const rarityColor = RARITY_COLORS[achievement.rarity as keyof typeof RARITY_COLORS];
  const rarityBg = RARITY_BG_COLORS[achievement.rarity as keyof typeof RARITY_BG_COLORS];

  const getBorderColor = () => {
    const rarity = achievement.rarity as string;
    switch (rarity) {
      case 'legendary':
        return 'border-carnival-marquee/50';
      case 'epic':
        return 'border-carnival-violet/50';
      case 'rare':
        return 'border-carnival-mint/50';
      case 'uncommon':
        return 'border-carnival-mint/40';
      default:
        return 'border-carnival-cream/30';
    }
  };

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.05, y: -5 } : {}}
      transition={{ type: "spring", stiffness: 300 }}
      className={cn("relative", className)}
    >
      <Card className={cn(
        "relative overflow-hidden bg-carnival-canvas/70 backdrop-blur-sm",
        unlocked ? "border-2" : "opacity-50 border-carnival-night/50",
        unlocked && rarityBg,
        unlocked && getBorderColor()
      )}>
        {/* Carnival awning stripe for legendary */}
        {unlocked && (achievement.rarity as string) === 'legendary' && (
          <div className="absolute top-0 left-0 right-0 h-3 awning-stripes opacity-40" />
        )}

        <CardContent className="p-6 text-center">
          {!unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-carnival-night/80 backdrop-blur-sm z-10">
              <Lock className="w-8 h-8 text-white/50" />
            </div>
          )}

          <motion.div
            className="text-5xl mb-3"
            animate={unlocked ? { rotate: [0, -10, 10, -10, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {achievement.icon}
          </motion.div>

          <h3 className="font-bold text-white mb-2">{achievement.name}</h3>
          <p className="text-sm text-white/70 mb-3">{achievement.description}</p>

          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className={cn(
              "text-xs border-current",
              rarityColor,
              (achievement.rarity as string) === 'legendary' && "animate-lights-glow"
            )}>
              {achievement.rarity.toUpperCase()}
            </Badge>
            {unlocked && achievement.reward && (
              <Badge className="text-xs bg-carnival-violet/20 border-carnival-violet/40 text-carnival-violet">
                +{achievement.reward.xp} XP
              </Badge>
            )}
          </div>

          {unlocked && earnedAt && (
            <p className="text-xs text-white/50 mt-2">
              Unlocked {new Date(earnedAt).toLocaleDateString()}
            </p>
          )}
        </CardContent>

        {/* Corner decoration lights for unlocked achievements */}
        {unlocked && (
          <>
            <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-carnival-ticket animate-lights-glow opacity-60" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-carnival-marquee animate-lights-glow opacity-60" style={{ animationDelay: '0.5s' }} />
          </>
        )}
      </Card>
    </motion.div>
  );
}
