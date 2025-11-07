"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Coins, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface QuestCardProps {
  questId: string;
  userQuestId: string;
  title: string;
  description: string;
  icon: string;
  progress: number;
  required: number;
  completed: boolean;
  claimed: boolean;
  reward: {
    xp: number;
    coins: number;
  };
  type: "daily" | "weekly";
  onClaim?: (userQuestId: string) => void;
  className?: string;
}

export function QuestCard({
  questId,
  userQuestId,
  title,
  description,
  icon,
  progress,
  required,
  completed,
  claimed,
  reward,
  type,
  onClaim,
  className,
}: QuestCardProps) {
  const progressPercentage = Math.min((progress / required) * 100, 100);
  const canClaim = completed && !claimed;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: canClaim ? 1.02 : 1 }}
      transition={{ duration: 0.2 }}
      className={cn("relative", className)}
    >
      <Card
        className={cn(
          "relative overflow-hidden border-2 bg-carnival-canvas/70 backdrop-blur-sm transition-all duration-300",
          completed && !claimed && "border-carnival-ticket/60 shadow-lg shadow-carnival-ticket/20",
          completed && claimed && "border-carnival-mint/40 opacity-75",
          !completed && "border-carnival-twist/30"
        )}
      >
        {/* Ticket perforation effect for claimable quests */}
        {canClaim && (
          <>
            <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-carnival-night rounded-full" />
            <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-carnival-night rounded-full" />
          </>
        )}

        {/* Awning stripe for daily quests */}
        {type === "daily" && (
          <div className="absolute top-0 left-0 right-0 h-2 awning-stripes opacity-30" />
        )}

        {/* Corner lights */}
        <div className={cn(
          "absolute top-1 left-1 w-1.5 h-1.5 rounded-full opacity-60",
          completed ? "bg-carnival-ticket animate-lights-glow" : "bg-carnival-twist/40"
        )} />
        <div
          className={cn(
            "absolute top-1 right-1 w-1.5 h-1.5 rounded-full opacity-60",
            completed ? "bg-carnival-marquee animate-lights-glow" : "bg-carnival-twist/40"
          )}
          style={{ animationDelay: '0.5s' }}
        />

        <CardContent className="p-5 pt-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3 flex-1">
              {/* Icon */}
              <div className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg border-2 transition-colors",
                completed
                  ? "bg-carnival-ticket/20 border-carnival-ticket/50"
                  : "bg-carnival-twist/10 border-carnival-twist/30"
              )}>
                <span className="text-2xl">{icon}</span>
              </div>

              {/* Title & Description */}
              <div className="flex-1">
                <h3 className={cn(
                  "font-bold text-white mb-1",
                  completed && "text-carnival-ticket"
                )}>
                  {title}
                </h3>
                <p className="text-sm text-white/60">{description}</p>
              </div>
            </div>

            {/* Status Badge */}
            {completed && (
              <Badge
                className={cn(
                  "ml-2",
                  claimed
                    ? "bg-carnival-mint/20 border-carnival-mint/50 text-carnival-mint"
                    : "bg-carnival-ticket/20 border-carnival-ticket/50 text-carnival-ticket animate-lights-glow"
                )}
              >
                {claimed ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Claimed
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 mr-1 animate-lights-glow" />
                    Ready!
                  </>
                )}
              </Badge>
            )}
            {!completed && (
              <Badge className="ml-2 bg-carnival-violet/20 border-carnival-violet/40 text-carnival-violet">
                <Clock className="w-3 h-3 mr-1" />
                {type === "daily" ? "Daily" : "Weekly"}
              </Badge>
            )}
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-white/70 font-semibold">Progress</span>
              <span className={cn(
                "font-bold",
                completed ? "text-carnival-ticket" : "text-carnival-twist"
              )}>
                {progress} / {required}
              </span>
            </div>
            <Progress
              value={progressPercentage}
              className={cn(
                "h-2 bg-carnival-night/50",
                completed && "bg-carnival-ticket/20"
              )}
            />
          </div>

          {/* Rewards & Action */}
          <div className="flex items-center justify-between gap-3">
            {/* Rewards */}
            <div className="flex items-center gap-3">
              {reward.xp > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-carnival-violet/10 border border-carnival-violet/30 rounded">
                  <Zap className="w-3 h-3 text-carnival-violet" />
                  <span className="text-xs font-bold text-carnival-violet">+{reward.xp}</span>
                </div>
              )}
              {reward.coins > 0 && (
                <div className="flex items-center gap-1 px-2 py-1 bg-carnival-ticket/10 border border-carnival-ticket/30 rounded">
                  <Coins className="w-3 h-3 text-carnival-ticket" />
                  <span className="text-xs font-bold text-carnival-ticket">+{reward.coins}</span>
                </div>
              )}
            </div>

            {/* Claim Button */}
            {canClaim && (
              <Button
                onClick={() => onClaim?.(userQuestId)}
                className="bg-gradient-to-r from-carnival-ticket to-carnival-twist hover:from-carnival-ticket/90 hover:to-carnival-twist/90 text-carnival-ink font-bold shadow-lg"
                size="sm"
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Claim Prize
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
