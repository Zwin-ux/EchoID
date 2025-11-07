import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ticketButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-carnival-marquee focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: [
          "bg-gradient-to-r from-carnival-marquee to-carnival-candy",
          "text-white shadow-lg hover:shadow-xl",
          "border-2 border-carnival-twist/50",
          "hover:from-carnival-candy hover:to-carnival-marquee",
          "before:absolute before:inset-0",
          "before:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.3),transparent_50%)]",
          "after:absolute after:inset-0 after:opacity-0 hover:after:opacity-100",
          "after:bg-[radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.2),transparent_50%)]",
          "after:transition-opacity after:duration-300",
        ],
        secondary: [
          "bg-carnival-cream text-carnival-ink",
          "border-2 border-carnival-twist",
          "shadow-md hover:shadow-lg",
          "hover:bg-carnival-cotton",
          "hover:-translate-y-0.5",
        ],
        golden: [
          "bg-gradient-to-br from-carnival-ticket via-carnival-twist to-carnival-ticket",
          "text-carnival-ink font-black",
          "border-2 border-carnival-twist",
          "shadow-[0_0_20px_rgba(251,191,36,0.5)]",
          "hover:shadow-[0_0_30px_rgba(251,191,36,0.7)]",
          "animate-lights-glow",
        ],
        ghost: [
          "border-2 border-carnival-marquee/50",
          "text-carnival-marquee",
          "hover:bg-carnival-marquee/10",
          "hover:border-carnival-marquee",
        ],
        outline: [
          "border-2 border-dashed border-carnival-twist",
          "text-carnival-twist",
          "hover:bg-carnival-twist/10",
          "hover:border-solid",
        ],
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-14 px-8 text-base",
        xl: "h-16 px-10 text-lg",
      },
      perforated: {
        true: "ticket-perforated px-8",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      perforated: false,
    },
  }
);

export interface TicketButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ticketButtonVariants> {
  asChild?: boolean;
}

const TicketButton = React.forwardRef<HTMLButtonElement, TicketButtonProps>(
  ({ className, variant, size, perforated, asChild = false, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(ticketButtonVariants({ variant, size, perforated, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    );
  }
);
TicketButton.displayName = "TicketButton";

export { TicketButton, ticketButtonVariants };
