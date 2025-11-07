/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Refined typography system
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.5', letterSpacing: '0' }],
        'base': ['1rem', { lineHeight: '1.6', letterSpacing: '0' }],
        'lg': ['1.125rem', { lineHeight: '1.6', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.5', letterSpacing: '-0.01em' }],
        '2xl': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.02em' }],
        '4xl': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1.1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.04em' }],
      },
      // 8-point grid spacing system
      spacing: {
        '0': '0',
        '1': '0.125rem',    // 2px
        '2': '0.25rem',     // 4px
        '3': '0.5rem',      // 8px
        '4': '0.75rem',     // 12px
        '5': '1rem',        // 16px
        '6': '1.5rem',      // 24px
        '7': '2rem',        // 32px
        '8': '2.5rem',      // 40px
        '9': '3rem',        // 48px
        '10': '4rem',       // 64px
        '11': '5rem',       // 80px
        '12': '6rem',       // 96px
        '14': '8rem',       // 128px
        '16': '10rem',      // 160px
      },
      // Refined color palette - sophisticated carnival
      colors: {
        carnival: {
          // Primary palette - deep and sophisticated
          marquee: '#DC2626',      // Refined red (deeper)
          twist: '#F59E0B',        // Warm amber
          cotton: '#FEF3C7',       // Subtle cream
          night: '#0F172A',        // Rich dark blue
          canvas: '#1E293B',       // Slate background
          deep: '#312E81',         // Deep indigo (new primary)
          darker: '#1E1B4B',       // Darker indigo
          cream: '#FFFBEB',        // Warm white
          ink: '#1E293B',          // Text color
          mint: '#10B981',         // Refined mint (less neon)
          indigo: '#4338CA',       // Primary indigo
          violet: '#7C3AED',       // Refined violet
          candy: '#DB2777',        // Refined pink
          ticket: '#F59E0B',       // Golden amber
        },
        // Existing shadcn colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "marquee-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(0.95)" },
        },
        "tent-sway": {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        "ticket-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        "lights-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 10px rgba(244, 63, 94, 0.5), 0 0 20px rgba(244, 63, 94, 0.3)",
          },
          "50%": { 
            boxShadow: "0 0 20px rgba(244, 63, 94, 0.8), 0 0 40px rgba(244, 63, 94, 0.6)",
          },
        },
        "ferris-rotate": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "marquee-pulse": "marquee-pulse 2s ease-in-out infinite",
        "tent-sway": "tent-sway 4s ease-in-out infinite",
        "ticket-bounce": "ticket-bounce 0.5s ease-in-out",
        "lights-glow": "lights-glow 2s ease-in-out infinite",
        "ferris-rotate": "ferris-rotate 20s linear infinite",
      },
      // Refined gradient system - subtle and sophisticated
      backgroundImage: {
        'striped-awning': 'repeating-linear-gradient(45deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.1) 20px, rgba(255, 251, 235, 0.05) 20px, rgba(255, 251, 235, 0.05) 40px)',
        'dotted-lights': 'radial-gradient(circle, rgba(245, 158, 11, 0.3) 2px, transparent 2px)',
        'carnival-gradient': 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(245, 158, 11, 0.9) 50%, rgba(219, 39, 119, 0.9) 100%)',
        'neon-gradient': 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.9) 100%)',
        'indigo-gradient': 'linear-gradient(135deg, rgba(67, 56, 202, 0.9) 0%, rgba(124, 58, 237, 0.9) 100%)',
        'aurora-gradient': 'linear-gradient(135deg, rgba(49, 46, 129, 0.9) 0%, rgba(124, 58, 237, 0.6) 50%, rgba(16, 185, 129, 0.9) 100%)',
        'twilight-gradient': 'linear-gradient(180deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.98) 100%)',
        'grid-pattern': 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
        'subtle-mesh': 'radial-gradient(at 40% 20%, rgba(67, 56, 202, 0.2) 0px, transparent 50%), radial-gradient(at 80% 80%, rgba(16, 185, 129, 0.2) 0px, transparent 50%)',
      },
      // Refined shadow system
      boxShadow: {
        'glow-red': '0 0 20px rgba(220, 38, 38, 0.3), 0 0 40px rgba(220, 38, 38, 0.15)',
        'glow-mint': '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.15)',
        'glow-violet': '0 0 20px rgba(124, 58, 237, 0.3), 0 0 40px rgba(124, 58, 237, 0.15)',
        'glow-ticket': '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.15)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.12)',
        'elegant': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'elegant-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'elegant-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}