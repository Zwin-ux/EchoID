import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage, type StateStorage } from "zustand/middleware";
import {
  defaultTraitSelection,
  traitCategoriesInOrder,
  type TraitCategory,
  type TraitDefinition,
  traitsCatalog,
  getTraitDefinition,
} from "@/config/traits";

export interface LayerSelection {
  category: TraitCategory;
  traitId: string;
}

export interface AvatarPreviewState {
  imageDataUrl: string | null;
  metadataCid: string | null;
  hash: string | null;
  minting: boolean;
  anchoring: boolean;
  error: string | null;
}

interface AvatarStoreState {
  walletAddress: string | null;
  signer: any | null;
  connected: boolean;
  traits: Record<TraitCategory, string>;
  gatedTraitsUnlocked: string[];
  preview: AvatarPreviewState;
  randomSeed: string | null;
  setWallet: (params: { address: string; signer: any }) => void;
  disconnect: () => void;
  selectTrait: (category: TraitCategory, traitId: string) => void;
  randomizeTraits: (seed?: string) => void;
  unlockGate: (gateId: string) => void;
  resetPreview: () => void;
  setPreviewData: (updates: Partial<AvatarPreviewState>) => void;
}

const buildWeightedPool = (category: TraitCategory, unlockedGates: string[]) =>
  traitsCatalog[category]
    .filter((trait) => !trait.gate || unlockedGates.includes(trait.gate))
    .flatMap((trait) => Array.from({ length: trait.weight }).map(() => trait.id));

const drawRandomTrait = (category: TraitCategory, unlockedGates: string[], seed?: string) => {
  const pool = buildWeightedPool(category, unlockedGates);
  if (pool.length === 0) return defaultTraitSelection[category];

  let randomIndex: number;
  if (seed) {
    const hash = Array.from(seed).reduce((acc, char) => acc + char.charCodeAt(0), 0);
    randomIndex = hash % pool.length;
  } else {
    randomIndex = Math.floor(Math.random() * pool.length);
  }
  return pool[randomIndex] ?? pool[0];
};

const isTraitUnlocked = (trait: TraitDefinition, unlockedGates: string[]) =>
  !trait.gate || unlockedGates.includes(trait.gate);

const fallbackStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

const generateSeed = () => {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2);
};

export const useAvatarStore = create<AvatarStoreState>()(
  persist(
    immer((set) => ({
      walletAddress: null,
      signer: null,
      connected: false,
      traits: { ...defaultTraitSelection },
      gatedTraitsUnlocked: [],
      randomSeed: null,
      preview: {
        imageDataUrl: null,
        metadataCid: null,
        hash: null,
        minting: false,
        anchoring: false,
        error: null,
      },
      setWallet: ({ address, signer }) =>
        set((state) => {
          state.walletAddress = address;
          state.signer = signer;
          state.connected = true;
        }),
      disconnect: () =>
        set((state) => {
          state.walletAddress = null;
          state.signer = null;
          state.connected = false;
          state.traits = { ...defaultTraitSelection };
          state.preview = {
            imageDataUrl: null,
            metadataCid: null,
            hash: null,
            minting: false,
            anchoring: false,
            error: null,
          };
        }),
      selectTrait: (category, traitId) =>
        set((state) => {
          const trait = getTraitDefinition(category, traitId);
          if (trait && isTraitUnlocked(trait, state.gatedTraitsUnlocked)) {
            state.traits[category] = traitId;
          }
        }),
      randomizeTraits: (seed) =>
        set((state) => {
          const appliedSeed = seed || generateSeed();
          state.randomSeed = appliedSeed;
          traitCategoriesInOrder.forEach((category) => {
            state.traits[category] = drawRandomTrait(
              category,
              state.gatedTraitsUnlocked,
              `${appliedSeed}-${category}`,
            );
          });
        }),
      unlockGate: (gateId) =>
        set((state) => {
          if (!state.gatedTraitsUnlocked.includes(gateId)) {
            state.gatedTraitsUnlocked.push(gateId);
          }
        }),
      resetPreview: () =>
        set((state) => {
          state.preview = {
            imageDataUrl: null,
            metadataCid: null,
            hash: null,
            minting: false,
            anchoring: false,
            error: null,
          };
        }),
      setPreviewData: (updates) =>
        set((state) => {
          state.preview = { ...state.preview, ...updates };
        }),
    })),
    {
      name: "bonelli-avatar-store",
      storage: createJSONStorage(() => (
        typeof window !== "undefined" ? window.localStorage : fallbackStorage
      )),
      partialize: (state) => ({
        traits: state.traits,
        randomSeed: state.randomSeed,
        gatedTraitsUnlocked: state.gatedTraitsUnlocked,
      }),
    },
  ),
);

export const getSelectedTraits = (state: AvatarStoreState): TraitDefinition[] =>
  traitCategoriesInOrder
    .map((category) => getTraitDefinition(category, state.traits[category]))
    .filter((trait): trait is TraitDefinition => Boolean(trait));

export const selectWalletAddress = (state: AvatarStoreState) => state.walletAddress;
export const selectIsConnected = (state: AvatarStoreState) => state.connected;
export const selectTraitByCategory = (category: TraitCategory) => (state: AvatarStoreState) =>
  getTraitDefinition(category, state.traits[category]);
export const selectPreviewState = (state: AvatarStoreState) => state.preview;
export const selectTraitMap = (state: AvatarStoreState) => state.traits;
export const selectUnlockedGates = (state: AvatarStoreState) => state.gatedTraitsUnlocked;
export const selectSelectedTraitDefinitions = (state: AvatarStoreState) => getSelectedTraits(state);
