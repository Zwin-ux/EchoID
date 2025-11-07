import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Types for our state
interface Profile {
  id: string;
  address: string;
  handle: string | null;
  bio: string | null;
  score: number;
  xp: number;
  level: number;
  coins: number;
  streak: number;
  lastLoginDate: Date | null;
  hashHex: string | null;
}

interface Achievement {
  id: string;
  badgeType: string;
  rarity: string;
  unlockedAt: Date;
}

interface Quest {
  id: string;
  type: string;
  title: string;
  description: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
}

interface AppState {
  // User state
  selectedAddress: string | null;
  profile: Profile | null;
  achievements: Achievement[];
  quests: Quest[];

  // UI state
  showOnboarding: boolean;
  showDailyLogin: boolean;
  hasSeenTutorial: boolean;

  // Actions for user state
  setSelectedAddress: (address: string | null) => void;
  setProfile: (profile: Profile | null) => void;
  setAchievements: (achievements: Achievement[]) => void;
  setQuests: (quests: Quest[]) => void;
  updateQuestProgress: (questId: string, progress: number) => void;

  // Actions for UI state
  setShowOnboarding: (show: boolean) => void;
  setShowDailyLogin: (show: boolean) => void;
  setHasSeenTutorial: (seen: boolean) => void;

  // Clear state
  clearUserState: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedAddress: null,
      profile: null,
      achievements: [],
      quests: [],
      showOnboarding: false,
      showDailyLogin: false,
      hasSeenTutorial: false,

      // User state actions
      setSelectedAddress: (address) => set({ selectedAddress: address }),

      setProfile: (profile) => set({ profile }),

      setAchievements: (achievements) => set({ achievements }),

      setQuests: (quests) => set({ quests }),

      updateQuestProgress: (questId, progress) => {
        const quests = get().quests;
        const updatedQuests = quests.map(quest =>
          quest.id === questId
            ? { ...quest, progress, completed: progress >= 100 }
            : quest
        );
        set({ quests: updatedQuests });
      },

      // UI state actions
      setShowOnboarding: (show) => set({ showOnboarding: show }),

      setShowDailyLogin: (show) => set({ showDailyLogin: show }),

      setHasSeenTutorial: (seen) => set({ hasSeenTutorial: seen }),

      // Clear all user state
      clearUserState: () => set({
        selectedAddress: null,
        profile: null,
        achievements: [],
        quests: [],
      }),
    }),
    {
      name: 'echoid-storage',
      storage: createJSONStorage(() => {
        // Only use localStorage on client-side
        if (typeof window !== 'undefined') {
          return localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      // Partition state to avoid hydration mismatch
      partialize: (state) => ({
        selectedAddress: state.selectedAddress,
        hasSeenTutorial: state.hasSeenTutorial,
        // Don't persist UI state that changes frequently
      }),
    }
  )
);

// Selectors for computed values
export const selectIsAuthenticated = (state: AppState) =>
  state.selectedAddress !== null && state.profile !== null;

export const selectUserLevel = (state: AppState) =>
  state.profile?.level || 1;

export const selectUserXP = (state: AppState) =>
  state.profile?.xp || 0;

export const selectUserCoins = (state: AppState) =>
  state.profile?.coins || 0;

export const selectCompletedQuests = (state: AppState) =>
  state.quests.filter(q => q.completed);

export const selectUnclaimedQuests = (state: AppState) =>
  state.quests.filter(q => q.completed && !q.claimed);
