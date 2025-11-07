"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { Coins } from "lucide-react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface CoinCounterProps {
  coins: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function CoinCounter({ coins, size = "md", className }: CoinCounterProps) {
  const spring = useSpring(0, { stiffness: 100, damping: 30 });
  const display = useTransform(spring, (current) =>
    Math.round(current).toLocaleString()
  );

  useEffect(() => {
    spring.set(coins);
  }, [coins, spring]);

  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  const iconSizes = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  return (
    <motion.div
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 rounded-full bg-carnival-ticket/10 border border-carnival-ticket/30",
        className
      )}
      whileHover={{ scale: 1.05 }}
      animate={{ y: [0, -2, 0] }}
      transition={{
        scale: { type: "spring", stiffness: 400 },
        y: { duration: 0.5, repeat: Infinity, repeatDelay: 2 }
      }}
    >
      <Coins className={cn(iconSizes[size], "text-carnival-ticket animate-lights-glow")} />
      <motion.span className={cn(sizeClasses[size], "font-bold text-carnival-ticket")}>
        {display}
      </motion.span>
    </motion.div>
  );
}
