"use client"

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface BoothCardProps extends React.HTMLAttributes<HTMLDivElement> {
  awning?: boolean;
  awningColor?: "marquee" | "twist" | "candy" | "violet" | "mint" | "indigo";
  posts?: boolean;
  glow?: boolean;
  glass?: boolean;
  animated?: boolean;
}

const BoothCard = React.forwardRef<HTMLDivElement, BoothCardProps>(
  ({
    className,
    awning = true,
    awningColor = "marquee",
    posts = false,
    glow = false,
    glass = false,
    animated = true,
    children,
    ...props
  }, ref) => {
    const awningColors = {
      marquee: "from-carnival-marquee to-carnival-candy",
      twist: "from-carnival-twist to-carnival-ticket",
      candy: "from-carnival-candy to-carnival-violet",
      violet: "from-carnival-violet to-carnival-mint",
      mint: "from-carnival-mint via-green-500 to-carnival-mint",
      indigo: "from-carnival-indigo to-carnival-violet",
    };

    const glowColors = {
      marquee: "hover:shadow-glow-red",
      twist: "hover:shadow-glow-ticket",
      candy: "hover:shadow-glow-red",
      violet: "hover:shadow-glow-violet",
      mint: "hover:shadow-glow-mint",
      indigo: "hover:shadow-glow-violet",
    };

    const baseClasses = cn(
      "relative rounded-xl overflow-hidden",
      glass
        ? "glass-strong border-2 border-white/20"
        : "bg-carnival-canvas border-2 border-carnival-twist/50",
      "shadow-lg transition-all duration-300",
      glow && glowColors[awningColor],
      posts && "booth-posts",
      "hover:scale-[1.02] hover:shadow-xl",
      className
    );

    const content = (
      <>
        {awning && (
          <div
            className={cn(
              "h-8 bg-gradient-to-r",
              awningColors[awningColor],
              "relative overflow-hidden",
              "before:absolute before:inset-0",
              "before:bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.1)_10px,rgba(255,255,255,0.1)_20px)]",
              "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-1",
              "after:bg-gradient-to-b after:from-black/20 after:to-transparent"
            )}
          >
            {/* Decorative bulbs */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-around px-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-carnival-ticket animate-marquee-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        )}
        <div className={cn("p-6", awning && "pt-4")}>{children}</div>

        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 border-l-2 border-t-2 border-carnival-twist/50 rounded-tl" />
        <div className="absolute top-2 right-2 w-3 h-3 border-r-2 border-t-2 border-carnival-twist/50 rounded-tr" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-l-2 border-b-2 border-carnival-twist/50 rounded-bl" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-r-2 border-b-2 border-carnival-twist/50 rounded-br" />
      </>
    );

    // Simple div for now to avoid Framer Motion type issues
    return (
      <div
        ref={ref}
        className={baseClasses}
        {...props}
      >
        {content}
      </div>
    );
  }
);
BoothCard.displayName = "BoothCard";

const BoothCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-4 border-b-2 border-dashed border-carnival-twist/30", className)}
      {...props}
    />
  )
);
BoothCardHeader.displayName = "BoothCardHeader";

const BoothCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn("text-2xl font-black tracking-tight text-carnival-cream carnival-text", className)}
      {...props}
    />
  )
);
BoothCardTitle.displayName = "BoothCardTitle";

const BoothCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn("text-sm text-carnival-cotton font-medium", className)}
      {...props}
    />
  )
);
BoothCardDescription.displayName = "BoothCardDescription";

const BoothCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("pt-4 text-carnival-cream", className)} {...props} />
  )
);
BoothCardContent.displayName = "BoothCardContent";

const BoothCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-4 border-t-2 border-dashed border-carnival-twist/30", className)}
      {...props}
    />
  )
);
BoothCardFooter.displayName = "BoothCardFooter";

export { BoothCard, BoothCardHeader, BoothCardTitle, BoothCardDescription, BoothCardContent, BoothCardFooter };
