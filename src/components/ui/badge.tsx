import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm",
        secondary:
          "border-transparent bg-slate-800/80 text-slate-200 hover:bg-slate-800",
        destructive:
          "border-transparent bg-red-600 text-white shadow-sm",
        outline: "border-purple-500/50 text-purple-400",
        success: "border-transparent bg-green-600 text-white shadow-sm",
        warning: "border-transparent bg-yellow-600 text-white shadow-sm",
        info: "border-transparent bg-blue-600 text-white shadow-sm",
        glass: "border-white/20 bg-white/10 text-white backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
