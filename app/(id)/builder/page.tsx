"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import PolkadotConnect from "@/components/wallet/PolkadotConnect";
import LayerCanvas from "@/components/avatar/LayerCanvas";
import { TicketButton } from "@/components/ui/ticket-button";
import {
  traitsCatalog,
  traitCategoriesInOrder,
  type TraitCategory,
  type TraitDefinition,
  gateDescriptions,
} from "@/config/traits";
import {
  useAvatarStore,
  selectIsConnected,
  selectPreviewState,
  selectWalletAddress,
  selectSelectedTraitDefinitions,
  selectTraitMap,
  selectUnlockedGates,
} from "@/state/useAvatarStore";

const traitHeadings: Record<TraitCategory, string> = {
  background: "Background",
  base: "Base",
  eyes: "Eyes",
  mouth: "Mouth",
  hat: "Crown",
};

const BuilderPage = () => {
  const selectTrait = useAvatarStore((state) => state.selectTrait);
  const randomizeTraits = useAvatarStore((state) => state.randomizeTraits);
  const resetPreview = useAvatarStore((state) => state.resetPreview);
  const setPreviewData = useAvatarStore((state) => state.setPreviewData);
  const unlockGate = useAvatarStore((state) => state.unlockGate);
  const preview = useAvatarStore(selectPreviewState);
  const walletAddress = useAvatarStore(selectWalletAddress);
  const isConnected = useAvatarStore(selectIsConnected);
  const selectedTraitDefinitions = useAvatarStore(selectSelectedTraitDefinitions);
  const traitMap = useAvatarStore(selectTraitMap);
  const unlockedGates = useAvatarStore(selectUnlockedGates);

  const selectedByCategory = traitCategoriesInOrder.reduce<Record<TraitCategory, TraitDefinition | null>>(
    (acc, category) => {
      const traitId = traitMap[category];
      const traitDefinition = traitsCatalog[category].find((option) => option.id === traitId) ?? null;
      acc[category] = traitDefinition;
      return acc;
    },
    {
      background: null,
      base: null,
      eyes: null,
      mouth: null,
      hat: null,
    },
  );

  useEffect(() => {
    resetPreview();
  }, [resetPreview]);

  const handleRender = (dataUrl: string) => {
    setPreviewData({ imageDataUrl: dataUrl });
  };

  const handleDownload = () => {
    if (!preview.imageDataUrl) return;
    const link = document.createElement("a");
    link.href = preview.imageDataUrl;
    link.download = `bonelli-avatar-${Date.now()}.png`;
    link.click();
  };

  return (
    <div className="relative isolate px-6 pb-24 pt-16">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(199,125,255,0.18),rgba(10,10,15,0)_60%),radial-gradient(circle_at_bottom,_rgba(0,209,255,0.18),rgba(10,10,15,0)_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto max-w-6xl"
      >
        <div className="flex flex-col gap-8 md:grid md:grid-cols-[360px_minmax(0,1fr)] md:items-start md:gap-10">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/5 bg-[#0A0A0F]/70 p-6 backdrop-blur-xl">
              <PolkadotConnect
                onConnected={() => {
                  unlockGate("genesis-drop");
                }}
              />
            </div>

            <div className="rounded-3xl border border-white/5 bg-[#0A0A0F]/70 p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-[#00D1FF]/70">Preview</p>
                  <h2 className="font-heading text-lg text-white">Avatar Canvas</h2>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                  {walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Wallet"}
                </span>
              </div>

              <div className="mt-4">
                <LayerCanvas traits={selectedTraitDefinitions} onRendered={handleRender} />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <TicketButton
                  variant="primary"
                  size="md"
                  onClick={() => randomizeTraits()}
                  disabled={!isConnected}
                >
                  Randomize Genesis
                </TicketButton>
                <TicketButton variant="secondary" size="md" onClick={handleDownload} disabled={!preview.imageDataUrl}>
                  Download PNG
                </TicketButton>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/5 bg-[#0A0A0F]/70 p-6 backdrop-blur-xl">
              <p className="text-xs uppercase tracking-[0.3em] text-[#00D1FF]/70">Traits</p>
              <h2 className="font-heading text-xl text-white">Design your identity soul</h2>

              <div className="mt-6 space-y-6">
                {traitCategoriesInOrder.map((category) => {
                  const trait = selectedByCategory[category];
                  const options = traitsCatalog[category];
                  return (
                    <div key={category} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-heading text-base text-white">{traitHeadings[category]}</p>
                          <p className="font-body text-xs text-white/55">{trait?.name ?? "Select a trait"}</p>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        {options.map((option) => {
                          const isActive = traitMap[category] === option.id;
                          const unlocked = !option.gate || unlockedGates.includes(option.gate);
                          return (
                            <button
                              key={option.id}
                              type="button"
                              onClick={() => selectTrait(category, option.id)}
                              disabled={!unlocked}
                              className={`group flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition ${
                                isActive
                                  ? "border-[#00D1FF]/60 bg-[#00D1FF]/10"
                                  : "border-white/10 bg-white/5 hover:border-[#C77DFF]/40 hover:bg-[#C77DFF]/10"
                              } ${!unlocked ? "opacity-50" : ""}`}
                            >
                              <span className="text-[11px] uppercase tracking-[0.2em] text-white/45">{option.rarity}</span>
                              <span className="font-heading text-sm text-white">{option.name}</span>
                              {option.gate && (
                                <span className="font-body text-[11px] text-white/40">
                                  {unlocked ? "Unlocked" : gateDescriptions[option.gate] ?? "Quest required"}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {!isConnected && (
              <div className="rounded-3xl border border-[#C77DFF]/40 bg-[#C77DFF]/10 p-6 text-sm text-white/80">
                Connect your wallet to unlock the forge actions and trait rarity gates.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BuilderPage;
