"use client";

import React, { useState } from "react";
import { attest } from "../lib/polkadot";
import type { InjectedAccountWithMeta } from "@polkadot/extension-inject/types";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

type Props = {
  account: InjectedAccountWithMeta;
};

export default function AttestationForm({ account }: Props) {
  const [subject, setSubject] = useState("");
  const [attestationType, setAttestationType] = useState("General");
  const [score, setScore] = useState(50);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const templates = [
    { name: "Select Template", type: "General", score: 50, comment: "" },
    { name: "Verified Email", type: "VerifiedEmail", score: 100, comment: "Email address verified through secure process." },
    { name: "Verified Phone", type: "VerifiedPhone", score: 90, comment: "Phone number verified via SMS." },
    { name: "Trusted Developer", type: "General", score: 85, comment: "Reliable contributor to open source projects." },
  ];

  function applyTemplate(template: typeof templates[0]) {
    setAttestationType(template.type);
    setScore(template.score);
    setComment(template.comment);
  }

  function celebrateLevelUp() {
    // Carnival-themed confetti explosion
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const carnivalColors = ['#F43F5E', '#F59E0B', '#FBBF24', '#EC4899', '#34D399'];
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      colors: carnivalColors
    };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  }

  async function awardXP(address: string, action: string) {
    try {
      const xpRes = await fetch("/api/xp/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, action }),
      });

      if (xpRes.ok) {
        const xpData = await xpRes.json();

        // Show XP notification with carnival colors
        toast.success(`+${xpData.xpAwarded} XP, +${xpData.coinsAwarded} coins! 🎉`, {
          duration: 4000,
          position: "top-center",
          style: {
            background: "linear-gradient(135deg, #34D399 0%, #10B981 100%)",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "600",
            border: "2px solid rgba(52, 211, 153, 0.5)",
            borderRadius: "0.5rem",
          },
        });

        // Update quest progress
        try {
          const questAction = action === "GIVE_ATTESTATION" ? "give_attestations" : "receive_attestations";
          await fetch("/api/quests/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              address,
              action: questAction,
              increment: 1,
            }),
          });
        } catch (err) {
          console.error("Failed to update quest progress:", err);
        }

        // Level up celebration with carnival gradient
        if (xpData.levelUp) {
          celebrateLevelUp();
          toast.success(
            `🎊 LEVEL UP! You reached Level ${xpData.levelUp.newLevel}! 🎊`,
            {
              duration: 5000,
              position: "top-center",
              style: {
                background: "linear-gradient(135deg, #F43F5E 0%, #F59E0B 100%)",
                color: "#fff",
                fontSize: "18px",
                fontWeight: "bold",
                border: "2px solid rgba(251, 191, 36, 0.6)",
                borderRadius: "0.5rem",
                boxShadow: "0 0 20px rgba(244, 63, 94, 0.5)",
              },
            }
          );
        }

        // Achievement unlocks with carnival ticket color
        if (xpData.newAchievements && xpData.newAchievements.length > 0) {
          xpData.newAchievements.forEach((achievement: any) => {
            toast.success(
              `🏆 Achievement Unlocked: ${achievement.name}!`,
              {
                duration: 5000,
                position: "top-right",
                style: {
                  background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
                  color: "#0F172A",
                  fontSize: "16px",
                  fontWeight: "600",
                  border: "2px solid rgba(251, 191, 36, 0.8)",
                  borderRadius: "0.5rem",
                },
              }
            );
          });
        }
      }
    } catch (xpErr) {
      console.error("Failed to award XP:", xpErr);
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await attest(account, subject, attestationType, score, comment);
      toast.success("Attestation created successfully!");

      // Award XP to both giver and receiver
      await Promise.all([
        awardXP(account.address, "GIVE_ATTESTATION"),
        awardXP(subject, "RECEIVE_ATTESTATION"),
      ]);

      // Reset form
      setSubject("");
      setAttestationType("General");
      setScore(50);
      setComment("");
    } catch (err: any) {
      const errorMsg = err?.message || String(err);
      toast.error(`Failed to create attestation: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl space-y-6">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-sm">📝</span>
        </div>
        <h3 className="text-xl font-semibold text-white">Create Attestation</h3>
      </div>

      <form onSubmit={submit} className="space-y-6">
        <div>
          <label className="text-sm font-medium text-white/90 mb-3 block">Attestation Template</label>
          <select
            defaultValue=""
            onChange={(e) => {
              const template = templates.find(t => t.name === e.target.value);
              if (template) applyTemplate(template);
            }}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
          >
            {templates.map((t) => (
              <option key={t.name} value={t.name} className="bg-gray-800">{t.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-white/90 mb-3 block">Subject Address</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="0x..."
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="text-sm font-medium text-white/90 mb-3 block">Attestation Type</label>
            <select
              value={attestationType}
              onChange={(e) => setAttestationType(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            >
              <option value="General" className="bg-gray-800">General</option>
              <option value="VerifiedEmail" className="bg-gray-800">Verified Email</option>
              <option value="VerifiedPhone" className="bg-gray-800">Verified Phone</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-white/90 mb-3 block">Trust Score (0-100)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-white/90 mb-3 block">Comment</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            rows={4}
            placeholder="Add your attestation details..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-600 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Creating Attestation...</span>
            </div>
          ) : (
            'Create Attestation'
          )}
        </button>
      </form>
    </div>
  );
}