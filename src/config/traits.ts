import type { StaticImageData } from "next/image";

export type TraitCategory = "background" | "base" | "eyes" | "mouth" | "hat";

export type TraitRarity = "common" | "uncommon" | "rare" | "epic" | "legendary";

export interface TraitDefinition {
  category: TraitCategory;
  id: string;
  name: string;
  image: string | StaticImageData;
  rarity: TraitRarity;
  weight: number;
  description?: string;
  gate?: string;
}

export type TraitCatalog = Record<TraitCategory, TraitDefinition[]>;

export const traitsCatalog: TraitCatalog = {
  background: [
    {
      category: "background",
      id: "aurora-neon",
      name: "Aurora Neon",
      image: "/traits/background/aurora-neon.png",
      rarity: "common",
      weight: 45,
      description: "Soft gradient wash with subtle particle bloom.",
    },
    {
      category: "background",
      id: "circuit-dusk",
      name: "Circuit Dusk",
      image: "/traits/background/circuit-dusk.png",
      rarity: "uncommon",
      weight: 32,
      description: "Holographic trace lines shimmer against deep violet.",
    },
    {
      category: "background",
      id: "void-lattice",
      name: "Void Lattice",
      image: "/traits/background/void-lattice.png",
      rarity: "rare",
      weight: 18,
      description: "Neon grid bending into the Bonelli wormhole.",
    },
  ],
  base: [
    {
      category: "base",
      id: "bonelli-core",
      name: "Bonelli Core",
      image: "/traits/base/bonelli-core.png",
      rarity: "common",
      weight: 50,
      description: "Default synth body tuned to the midway vibe.",
    },
    {
      category: "base",
      id: "glow-shell",
      name: "Glow Shell",
      image: "/traits/base/glow-shell.png",
      rarity: "uncommon",
      weight: 28,
      description: "Iridescent plating with cyan underlight.",
    },
    {
      category: "base",
      id: "prism-avatar",
      name: "Prism Avatar",
      image: "/traits/base/prism-avatar.png",
      rarity: "rare",
      weight: 16,
      description: "Crystalline refractor body with internal aurora.",
    },
  ],
  eyes: [
    {
      category: "eyes",
      id: "spectra-focus",
      name: "Spectra Focus",
      image: "/traits/eyes/spectra-focus.png",
      rarity: "common",
      weight: 48,
      description: "Clean cyan HUD optics.",
    },
    {
      category: "eyes",
      id: "orbit-gaze",
      name: "Orbit Gaze",
      image: "/traits/eyes/orbit-gaze.png",
      rarity: "uncommon",
      weight: 30,
      description: "Dual ring pupils with parallax sparkle.",
    },
    {
      category: "eyes",
      id: "mythic-diode",
      name: "Mythic Diode",
      image: "/traits/eyes/mythic-diode.png",
      rarity: "legendary",
      weight: 8,
      description: "Tri-beam emitters reserved for lore quest victors.",
      gate: "lorekeeper",
    },
  ],
  mouth: [
    {
      category: "mouth",
      id: "expresor",
      name: "Expresor",
      image: "/traits/mouth/expresor.png",
      rarity: "common",
      weight: 52,
      description: "Minimal smile with cyan emitter strip.",
    },
    {
      category: "mouth",
      id: "ion-wave",
      name: "Ion Wave",
      image: "/traits/mouth/ion-wave.png",
      rarity: "uncommon",
      weight: 30,
      description: "Layered vox grooves for synth harmonics.",
    },
    {
      category: "mouth",
      id: "celestial-chorus",
      name: "Celestial Chorus",
      image: "/traits/mouth/celestial-chorus.png",
      rarity: "epic",
      weight: 12,
      description: "Audio lattice reserved for XP tier three.",
      gate: "xp-tier-3",
    },
  ],
  hat: [
    {
      category: "hat",
      id: "hover-band",
      name: "Hover Band",
      image: "/traits/hat/hover-band.png",
      rarity: "common",
      weight: 46,
      description: "Floating halo ring with neon tick marks.",
    },
    {
      category: "hat",
      id: "orb-cascade",
      name: "Orb Cascade",
      image: "/traits/hat/orb-cascade.png",
      rarity: "rare",
      weight: 20,
      description: "Layered orbs that pulse with trust score.",
    },
    {
      category: "hat",
      id: "crown-nebula",
      name: "Crown Nebula",
      image: "/traits/hat/crown-nebula.png",
      rarity: "legendary",
      weight: 6,
      description: "Genesis prize. Unlock via Genesis Drop quest chain.",
      gate: "genesis-drop",
    },
  ],
};

export const defaultTraitSelection: Record<TraitCategory, string> = {
  background: traitsCatalog.background[0].id,
  base: traitsCatalog.base[0].id,
  eyes: traitsCatalog.eyes[0].id,
  mouth: traitsCatalog.mouth[0].id,
  hat: traitsCatalog.hat[0].id,
};

export const gateDescriptions: Record<string, string> = {
  "lorekeeper": "Complete the Midway Lore quest to unlock this trait.",
  "xp-tier-3": "Reach XP tier three to access the Celestial Chorus.",
  "genesis-drop": "Participate in the Genesis Drop to earn the Crown Nebula.",
};

export const getTraitDefinition = (category: TraitCategory, traitId: string) =>
  traitsCatalog[category].find((trait) => trait.id === traitId) ?? null;

export const traitCategoriesInOrder: TraitCategory[] = [
  "background",
  "base",
  "eyes",
  "mouth",
  "hat",
];
