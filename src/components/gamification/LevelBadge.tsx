"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  className?: string;
}

function getLevelTier(level: number): {
  color: string;
  bgColor: string;
  borderColor: string;
  glow: string;
} {
  // Platinum (21+): carnival-marquee + carnival-candy gradient
  if (level >= 21) {
    return {
      color: "text-carnival-marquee",
      bgColor: "bg-gradient-to-br from-carnival-marquee/20 to-carnival-candy/20",
      borderColor: "border-carnival-marquee/50",
      glow: "shadow-carnival-marquee/50",
    };
  }
  // Gold (11-20): carnival-ticket
  if (level >= 11) {
    return {
      color: "text-carnival-ticket",
      bgColor: "bg-carnival-ticket/10",
      borderColor: "border-carnival-ticket/30",
      glow: "shadow-carnival-ticket/50",
    };
  }
  // Silver (6-10): carnival-cream with carnival-ink
  if (level >= 6) {
    return {
      color: "text-carnival-ink",
      bgColor: "bg-carnival-cream/20",
      borderColor: "border-carnival-cream/40",
      glow: "shadow-carnival-cream/50",
    };
  }
  // Bronze (1-5): carnival-twist
  return {
    color: "text-carnival-twist",
    bgColor: "bg-carnival-twist/10",
    borderColor: "border-carnival-twist/30",
    glow: "shadow-carnival-twist/50",
  };
}

export function LevelBadge({
  level,
  size = "md",
  animated = true,
  className,
}: LevelBadgeProps) {
  const tier = getLevelTier(level);

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const Component = animated ? motion.div : "div";
  const animationProps = animated
    ? {
        whileHover: { scale: 1.1, rotate: 5 },
        transition: { type: "spring" as const, stiffness: 300 },
      }
    : {};

  return (
    <Component
      className={cn(
        "relative flex items-center justify-center rounded-full border-2",
        sizeClasses[size],
        tier.bgColor,
        tier.borderColor,
        "shadow-lg",
        tier.glow,
        className
      )}
      {...animationProps}
    >
      <Star className={cn(iconSizes[size], tier.color, "absolute top-0 right-0 translate-x-1 -translate-y-1")} />
      <span className={cn("font-bold", tier.color)}>{level}</span>
    </Component>
  );
}
