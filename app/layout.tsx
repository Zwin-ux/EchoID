import "./globals.css";
import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import React from "react";
import Link from "next/link";
import { LucideSparkles } from "lucide-react";
import OnboardingClient from "@/components/OnboardingClient";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
});

const bodyFont = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Bonelli ID — Neon Trust Identity Carnival",
  description:
    "Connect your Polkadot wallet, craft a luminous avatar, and anchor your decentralized identity in the Bonelli midway.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${headingFont.variable} ${bodyFont.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-screen bg-bonelli-gradient text-[#EDEDED] overflow-x-hidden relative">
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(199,125,255,0.28)_0%,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(0,209,255,0.2)_0%,_transparent_50%)]" />
          <div className="absolute inset-0 opacity-30 mix-blend-screen bg-[linear-gradient(120deg,rgba(199,125,255,0.12)_0%,rgba(0,209,255,0.08)_45%,rgba(10,10,15,0.65)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,_rgba(255,255,255,0.08)_1px,_transparent_1px)] bg-[size:24px_24px] animate-static-flicker" />
        </div>

        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0A0A0F]/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/" className="flex items-center gap-3 text-[#EDEDED]">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#C77DFF_0%,#00D1FF_100%)] text-xl font-bold shadow-[0_0_22px_rgba(199,125,255,0.45)]">
                BI
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[#00D1FF]/70">Bonelli Identity</p>
                <p className="text-lg font-heading font-semibold leading-tight">
                  Neon Trust Carnival
                </p>
              </div>
            </Link>

            <nav className="font-body hidden items-center gap-2 text-sm font-medium md:flex">
              {[
                { label: "Midway", href: "/" },
                { label: "Builder", href: "/builder" },
                { label: "Quests", href: "/quests" },
                { label: "Lore", href: "#lore" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-lg px-4 py-2 text-[#EDEDED]/70 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/dashboard"
                className="group relative overflow-hidden rounded-lg px-5 py-2 text-white"
              >
                <span className="absolute inset-0 rounded-lg bg-[linear-gradient(135deg,#C77DFF_0%,#00D1FF_100%)] opacity-80 transition group-hover:opacity-100" />
                <span className="relative flex items-center gap-2">
                  Launch Deck
                  <LucideSparkles className="h-4 w-4 text-[#EDEDED]" />
                </span>
              </Link>
            </nav>

            <div className="flex items-center gap-3 text-xs font-medium md:hidden" aria-hidden>
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">Menu</span>
            </div>
          </div>
        </header>

        <main className="relative z-10 font-body">{children}</main>

        <OnboardingClient />

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "linear-gradient(135deg, rgba(199, 125, 255, 0.95) 0%, rgba(0, 209, 255, 0.95) 100%)",
              color: "#0A0A0F",
              border: "1px solid rgba(237, 237, 237, 0.4)",
              borderRadius: "0.75rem",
              padding: "12px 16px",
              fontWeight: 600,
              boxShadow: "0 0 24px rgba(199, 125, 255, 0.4)",
            },
          }}
        />
      </body>
    </html>
  );
}
