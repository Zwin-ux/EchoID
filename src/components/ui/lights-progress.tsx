import * as React from "react";
import { cn } from "@/lib/utils";

export interface LightsProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  steps?: number;
  showLabels?: boolean;
  color?: "marquee" | "twist" | "mint" | "violet";
}

const LightsProgress = React.forwardRef<HTMLDivElement, LightsProgressProps>(
  ({ className, value = 0, max = 100, steps = 5, showLabels = false, color = "marquee", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const filledSteps = Math.floor((percentage / 100) * steps);

    const colorClasses = {
      marquee: {
        filled: "bg-carnival-marquee shadow-[0_0_10px_rgba(244,63,94,0.6)]",
        unfilled: "bg-carnival-marquee/20",
      },
      twist: {
        filled: "bg-carnival-twist shadow-[0_0_10px_rgba(245,158,11,0.6)]",
        unfilled: "bg-carnival-twist/20",
      },
      mint: {
        filled: "bg-carnival-mint shadow-[0_0_10px_rgba(52,211,153,0.6)]",
        unfilled: "bg-carnival-mint/20",
      },
      violet: {
        filled: "bg-carnival-violet shadow-[0_0_10px_rgba(139,92,246,0.6)]",
        unfilled: "bg-carnival-violet/20",
      },
    };

    return (
      <div ref={ref} className={cn("relative w-full", className)} {...props}>
        {/* Main progress track */}
        <div className="relative h-12 bg-carnival-night/50 rounded-full border-2 border-carnival-twist/30 p-2">
          {/* Background pattern */}
          <div className="absolute inset-0 lights-pattern opacity-10 rounded-full" />
          
          {/* Progress fill */}
          <div
            className="absolute top-2 left-2 bottom-2 bg-gradient-to-r from-carnival-marquee/30 to-carnival-twist/30 rounded-full transition-all duration-500 ease-out"
            style={{ width: `calc(${percentage}% - 16px)` }}
          />

          {/* Light bulbs */}
          <div className="relative flex justify-between items-center h-full px-2">
            {[...Array(steps)].map((_, i) => {
              const isFilled = i < filledSteps;
              const isActive = i === filledSteps && percentage < 100;
              
              return (
                <div key={i} className="relative flex flex-col items-center gap-1">
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all duration-300",
                      isFilled
                        ? cn(
                            colorClasses[color].filled,
                            "border-white animate-lights-glow scale-110"
                          )
                        : isActive
                        ? cn(
                            colorClasses[color].filled,
                            "border-white/50 animate-marquee-pulse"
                          )
                        : cn(
                            colorClasses[color].unfilled,
                            "border-carnival-twist/30"
                          )
                    )}
                  >
                    {/* Inner glow */}
                    {isFilled && (
                      <div className="absolute inset-1 rounded-full bg-white/30" />
                    )}
                  </div>
                  
                  {showLabels && (
                    <span className="text-xs font-bold text-carnival-cotton">
                      {Math.round((i + 1) * (max / steps))}
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Percentage label */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xl font-black text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>

        {/* Decorative text below */}
        {showLabels && (
          <div className="flex justify-between mt-2 px-4">
            <span className="text-xs font-semibold text-carnival-twist">Start</span>
            <span className="text-xs font-semibold text-carnival-mint">Prize!</span>
          </div>
        )}
      </div>
    );
  }
);
LightsProgress.displayName = "LightsProgress";

// Simple variant for inline use
const LightsProgressBar = React.forwardRef<HTMLDivElement, Omit<LightsProgressProps, 'steps' | 'showLabels'>>(
  ({ className, value = 0, max = 100, color = "marquee", ...props }, ref) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div
        ref={ref}
        className={cn("relative h-4 bg-carnival-night/50 rounded-full border border-carnival-twist/30 overflow-hidden", className)}
        {...props}
      >
        {/* Animated lights background */}
        <div className="absolute inset-0 lights-pattern opacity-5" />
        
        {/* Progress bar */}
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden",
            "bg-gradient-to-r",
            color === "marquee" && "from-carnival-marquee to-carnival-candy",
            color === "twist" && "from-carnival-twist to-carnival-ticket",
            color === "mint" && "from-carnival-mint to-carnival-mint/80",
            color === "violet" && "from-carnival-violet to-carnival-violet/80"
          )}
          style={{ width: `${percentage}%` }}
        >
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>

        {/* Light bulbs along the track */}
        <div className="absolute inset-0 flex items-center justify-around px-1">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300",
                (i / 8) * 100 < percentage
                  ? "bg-white animate-lights-glow scale-110"
                  : "bg-carnival-twist/30"
              )}
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    );
  }
);
LightsProgressBar.displayName = "LightsProgressBar";

export { LightsProgress, LightsProgressBar };
