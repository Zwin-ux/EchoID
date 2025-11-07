"use client"

import * as React from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

export interface AnimatedButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: "carnival" | "neon" | "indigo" | "glass" | "ticket";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
  children: React.ReactNode;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = "carnival", size = "md", glow = false, children, disabled, ...props }, ref) => {
    const variants = {
      carnival: "bg-gradient-to-r from-carnival-marquee via-carnival-twist to-carnival-candy",
      neon: "bg-gradient-to-r from-carnival-mint to-green-500",
      indigo: "bg-gradient-to-r from-carnival-indigo to-carnival-violet",
      glass: "glass-strong hover:bg-white/10",
      ticket: "bg-gradient-to-r from-carnival-ticket to-carnival-twist",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
    };

    const glowEffects = {
      carnival: "hover:shadow-glow-red",
      neon: "hover:shadow-glow-mint",
      indigo: "hover:shadow-glow-violet",
      glass: "hover:shadow-glass",
      ticket: "hover:shadow-glow-ticket",
    };

    return (
      <motion.button
        ref={ref}
        className={cn(
          "rounded-xl font-semibold text-white transition-all duration-200",
          "shadow-lg hover:shadow-xl",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-carnival-mint",
          variants[variant],
          sizes[size],
          glow && glowEffects[variant],
          className
        )}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
        disabled={disabled}
        {...props}
      >
        {children}
      </motion.button>
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
