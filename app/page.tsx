"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Wallet2,
  Sparkles,
  Layers3,
  ShieldCheck,
  CircuitBoard,
  Gamepad2,
  Star,
  Activity,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TicketButton } from "@/components/ui/ticket-button";
import { BoothCard, BoothCardContent } from "@/components/ui/booth-card";

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
};

const flows = [
  {
    title: "Connect Wallet",
    description: "Link Polkadot.js extension, sign the midway ticket, and enter the carnival.",
    icon: Wallet2,
  },
  {
    title: "Craft Avatar",
    description: "Assemble layered traits, glow up your identity soul, and preview in real time.",
    icon: Layers3,
  },
  {
    title: "Mint & Anchor",
    description: "Upload to IPFS, hash metadata, and anchor on-chain for verifiable trust.",
    icon: CircuitBoard,
  },
];

const features = [
  {
    title: "Neon Glass Shell",
    description: "Framer Motion transitions, glassmorphic panels, and animated particle depth.",
    icon: Sparkles,
  },
  {
    title: "Gamified Reputation",
    description: "XP rings, quest gates, and attestations that light up every booth.",
    icon: Gamepad2,
  },
  {
    title: "On-Chain Integrity",
    description: "sha256 metadata anchoring with Polkadot signer flow—client only, no custodial keys.",
    icon: ShieldCheck,
  },
];

const stats = [
  { label: "Deterministic Traits", value: "15", accent: "bg-[#C77DFF]/40" },
  { label: "Quest Tracks", value: "12", accent: "bg-[#00D1FF]/40" },
  { label: "Latency Budget", value: "<150ms", accent: "bg-[#89F7FE]/30" },
];

export default function Home() {
  return (
    <div className="relative isolate space-y-28 pb-28">
      <div className="absolute inset-x-0 top-0 -z-10 h-[520px] bg-[radial-gradient(55%_55%_at_50%_0%,rgba(199,125,255,0.45),rgba(10,10,15,0))]" aria-hidden />

      <section className="px-6 pt-20 md:pt-28">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-5xl text-center"
        >
          <Badge className="mx-auto mb-8 flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs uppercase tracking-[0.3em] text-[#00D1FF] shadow-[0_0_16px_rgba(0,209,255,0.35)]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#00D1FF]" />
            Polkadot Powered
          </Badge>

          <div className="space-y-6">
            <h1 className="font-heading text-4xl font-semibold leading-tight text-white md:text-6xl">
              Identity is your midway.
              <span className="block bg-[linear-gradient(135deg,#C77DFF_0%,#00D1FF_100%)] bg-clip-text text-transparent">
                Bonelli ID keeps the lights on.
              </span>
            </h1>
            <p className="font-body mx-auto max-w-3xl text-base text-white/70 md:text-lg">
              Connect your Polkadot wallet, sculpt a luminous avatar, and earn reputation through quests, attestations, and on-chain anchors. Bonelli ID turns decentralized identity into a neon carnival of trust.
            </p>
          </div>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <TicketButton
              variant="primary"
              size="lg"
              onClick={() => (window.location.href = "/builder")}
            >
              Enter the Builder
            </TicketButton>
            <Link
              href="#flow"
              className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition hover:border-white/30 hover:text-white"
              aria-label="Scroll to see how the Bonelli Identity flow works"
            >
              Explore the Flow
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="mt-12 grid gap-6 rounded-3xl border border-white/5 bg-white/5/10 p-6 backdrop-blur-xl sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-2 text-sm text-white/60">
                <span className={`rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 ${stat.accent}`}>
                  {stat.label}
                </span>
                <p className="font-heading text-2xl font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="flow" className="relative px-6">
        <motion.div
          className="mx-auto max-w-6xl rounded-3xl border border-white/5 bg-[#0A0A0F]/60 p-10 backdrop-blur-2xl shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
          {...fadeUp}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
              Wallet to Avatar to Anchor—without leaving the midway.
            </h2>
            <p className="font-body mt-4 text-white/65">
              Every booth glows when you complete a step. Segués with spring easing keep the experience cinematic while staying performant.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {flows.map(({ title, description, icon: Icon }) => (
              <motion.div
                key={title}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5/10 p-6 text-left shadow-[0_20px_50px_rgba(199,125,255,0.12)]"
                whileHover={{ y: -6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#C77DFF_0%,#00D1FF_100%)]/70 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <h3 className="font-heading text-xl font-semibold text-white">
                  {title}
                </h3>
                <p className="font-body mt-3 text-sm text-white/65">
                  {description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <section id="features" className="px-6">
        <motion.div
          className="mx-auto max-w-6xl"
          {...fadeUp}
          viewport={{ once: true, amount: 0.25 }}
        >
          <div className="mb-12 grid gap-6 md:grid-cols-[1fr_1.2fr]">
            <div className="rounded-3xl border border-white/5 bg-white/5/15 p-8 backdrop-blur-xl">
              <span className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-[#00D1FF]/70">
                <Activity className="h-4 w-4" />
                Cinematic UX Stack
              </span>
              <h2 className="font-heading mt-5 text-3xl font-semibold text-white">
                Neon glassmorphism, particle fields, and deterministic trait minting.
              </h2>
              <p className="font-body mt-4 text-white/65">
                Bonelli ID fuses shadcn/ui with Tailwind v4 tokens. Every component respects reduced-motion preferences, keeps contrast accessible, and renders under 150 ms interactions.
              </p>
              <div className="font-body mt-6 flex flex-wrap gap-3 text-sm text-white/60">
                <span className="rounded-full border border-white/15 px-4 py-2">Framer Motion v12</span>
                <span className="rounded-full border border-white/15 px-4 py-2">Zustand orchestrations</span>
                <span className="rounded-full border border-white/15 px-4 py-2">Tailwind v4 tokens</span>
                <span className="rounded-full border border-white/15 px-4 py-2">Polkadot.js anchors</span>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {features.map(({ title, description, icon: Icon }) => (
                <BoothCard key={title} awning awningColor="violet" glow className="border-white/10 bg-[#0A0A0F]/70 p-6">
                  <BoothCardContent className="space-y-4 text-left">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-heading text-lg font-semibold text-white">
                      {title}
                    </h3>
                    <p className="font-body text-sm text-white/65">
                      {description}
                    </p>
                  </BoothCardContent>
                </BoothCard>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section className="px-6">
        <motion.div
          className="mx-auto flex max-w-5xl flex-col gap-10 rounded-3xl border border-white/5 bg-[#0A0A0F]/70 p-12 text-center backdrop-blur-xl"
          {...fadeUp}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4">
            <Star className="h-10 w-10 text-[#C77DFF]" />
            <h2 className="font-heading text-3xl font-semibold text-white md:text-4xl">
              Ready for hackathons. Poised for mainnet.
            </h2>
            <p className="font-body max-w-3xl text-sm text-white/65 md:text-base">
              Run the SKG Forge pipeline to generate layered PNG traits deterministically, mint avatars to IPFS, and anchor hashes without exposing keys. The midway glow you see here ships with the repo.
            </p>
          </div>

          <div className="mx-auto flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <TicketButton
              variant="secondary"
              size="lg"
              onClick={() => (window.location.href = "/dashboard")}
            >
              Open the Prize Counter
            </TicketButton>
            <Link
              href="/quests"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-white/70 transition hover:text-white"
            >
              View Daily Quests
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
