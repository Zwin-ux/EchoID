// Gamification constants and helper functions

// XP Constants
export const XP_PER_LEVEL = 100; // Base XP for level 1
export const LEVEL_MULTIPLIER = 1.5; // Each level requires 50% more XP

// XP Rewards
export const XP_REWARDS = {
  CREATE_PROFILE: 200,
  UPDATE_PROFILE: 50,
  GIVE_ATTESTATION: 50,
  RECEIVE_ATTESTATION: 100,
  ANCHOR_HASH: 150,
  COMPLETE_PROFILE: 150,
  DAILY_LOGIN: 25,
  COMPLETE_QUEST: 0, // Variable based on quest
  WIN_GAME: 0, // Variable based on game
} as const;

// Coin Rewards
export const COIN_REWARDS = {
  CREATE_PROFILE: 100,
  UPDATE_PROFILE: 10,
  GIVE_ATTESTATION: 25,
  RECEIVE_ATTESTATION: 50,
  ANCHOR_HASH: 75,
  DAILY_LOGIN: 10,
  LEVEL_UP: 50,
  COMPLETE_QUEST: 0, // Variable
  WIN_GAME: 0, // Variable
} as const;

// Achievement Types
export const ACHIEVEMENTS = {
  FIRST_STEPS: {
    id: 'first_steps',
    name: 'First Steps',
    description: 'Create your first profile',
    icon: '🎯',
    rarity: 'common',
    requirement: { action: 'create_profile', count: 1 },
    reward: { xp: 50, coins: 25 },
  },
  RISING_STAR: {
    id: 'rising_star',
    name: 'Rising Star',
    description: 'Reach level 5',
    icon: '🌟',
    rarity: 'common',
    requirement: { action: 'reach_level', level: 5 },
    reward: { xp: 100, coins: 50 },
  },
  TRUSTED_MEMBER: {
    id: 'trusted_member',
    name: 'Trusted Member',
    description: 'Receive 5 attestations',
    icon: '💎',
    rarity: 'rare',
    requirement: { action: 'receive_attestations', count: 5 },
    reward: { xp: 200, coins: 100 },
  },
  CONNECTOR: {
    id: 'connector',
    name: 'Connector',
    description: 'Give 10 attestations',
    icon: '🔗',
    rarity: 'rare',
    requirement: { action: 'give_attestations', count: 10 },
    reward: { xp: 150, coins: 75 },
  },
  ON_FIRE: {
    id: 'on_fire',
    name: 'On Fire!',
    description: 'Maintain a 7-day login streak',
    icon: '🔥',
    rarity: 'epic',
    requirement: { action: 'login_streak', days: 7 },
    reward: { xp: 300, coins: 150 },
  },
  HIGH_ROLLER: {
    id: 'high_roller',
    name: 'High Roller',
    description: 'Reach reputation score of 80+',
    icon: '📈',
    rarity: 'epic',
    requirement: { action: 'reputation_score', score: 80 },
    reward: { xp: 250, coins: 125 },
  },
  CUSTOMIZER: {
    id: 'customizer',
    name: 'Customizer',
    description: 'Update your profile 5 times',
    icon: '🎨',
    rarity: 'common',
    requirement: { action: 'update_profile', count: 5 },
    reward: { xp: 100, coins: 50 },
  },
  POPULAR: {
    id: 'popular',
    name: 'Popular',
    description: 'Receive 100 profile views',
    icon: '👁️',
    rarity: 'rare',
    requirement: { action: 'profile_views', count: 100 },
    reward: { xp: 200, coins: 100 },
  },
  BLOCKCHAIN_VERIFIED: {
    id: 'blockchain_verified',
    name: 'Blockchain Verified',
    description: 'Anchor your profile to the blockchain',
    icon: '⛓️',
    rarity: 'rare',
    requirement: { action: 'anchor_hash', count: 1 },
    reward: { xp: 150, coins: 75 },
  },
  LEVEL_10: {
    id: 'level_10',
    name: 'Experienced',
    description: 'Reach level 10',
    icon: '⭐',
    rarity: 'rare',
    requirement: { action: 'reach_level', level: 10 },
    reward: { xp: 500, coins: 250 },
  },
} as const;

// Level Calculation
export function calculateLevelFromXP(xp: number): number {
  let level = 1;
  let xpNeeded = XP_PER_LEVEL;
  let totalXP = 0;

  while (totalXP + xpNeeded <= xp) {
    totalXP += xpNeeded;
    level++;
    xpNeeded = Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1));
  }

  return level;
}

// XP needed for next level
export function xpForNextLevel(currentLevel: number): number {
  return Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, currentLevel));
}

// XP needed for current level start
export function xpForCurrentLevel(currentLevel: number): number {
  if (currentLevel === 1) return 0;

  let totalXP = 0;
  for (let i = 1; i < currentLevel; i++) {
    totalXP += Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, i - 1));
  }
  return totalXP;
}

// Progress percentage to next level
export function calculateLevelProgress(xp: number, currentLevel: number): number {
  const currentLevelXP = xpForCurrentLevel(currentLevel);
  const nextLevelXP = xpForCurrentLevel(currentLevel + 1);
  const levelXPRange = nextLevelXP - currentLevelXP;
  const xpInCurrentLevel = xp - currentLevelXP;

  return Math.min(100, Math.max(0, (xpInCurrentLevel / levelXPRange) * 100));
}

// Check if user leveled up
export function checkLevelUp(oldXP: number, newXP: number): {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  coinsEarned: number;
} {
  const oldLevel = calculateLevelFromXP(oldXP);
  const newLevel = calculateLevelFromXP(newXP);
  const leveledUp = newLevel > oldLevel;
  const coinsEarned = leveledUp ? COIN_REWARDS.LEVEL_UP * (newLevel - oldLevel) : 0;

  return {
    leveledUp,
    oldLevel,
    newLevel,
    coinsEarned,
  };
}

// Daily Quest Types
export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: {
    action: string;
    count: number;
  };
  reward: {
    xp: number;
    coins: number;
  };
  type: 'daily' | 'weekly' | 'monthly';
}

export const DAILY_QUESTS: DailyQuest[] = [
  {
    id: 'daily_update_bio',
    title: 'Update Your Bio',
    description: 'Make your profile more interesting',
    icon: '✏️',
    requirement: { action: 'update_profile', count: 1 },
    reward: { xp: 50, coins: 25 },
    type: 'daily',
  },
  {
    id: 'daily_give_attestations',
    title: 'Spread the Trust',
    description: 'Give 3 attestations to other users',
    icon: '✅',
    requirement: { action: 'give_attestations', count: 3 },
    reward: { xp: 100, coins: 50 },
    type: 'daily',
  },
  {
    id: 'daily_visit_profiles',
    title: 'Social Explorer',
    description: 'Visit 5 different profiles',
    icon: '👥',
    requirement: { action: 'visit_profiles', count: 5 },
    reward: { xp: 30, coins: 15 },
    type: 'daily',
  },
  {
    id: 'daily_earn_xp',
    title: 'XP Grinder',
    description: 'Earn 100 XP today',
    icon: '⚡',
    requirement: { action: 'earn_xp', count: 100 },
    reward: { xp: 0, coins: 50 },
    type: 'daily',
  },
];

export const WEEKLY_QUESTS: DailyQuest[] = [
  {
    id: 'weekly_level_up',
    title: 'Level Up',
    description: 'Reach the next level',
    icon: '🆙',
    requirement: { action: 'level_up', count: 1 },
    reward: { xp: 500, coins: 200 },
    type: 'weekly',
  },
  {
    id: 'weekly_streak',
    title: '7-Day Streak',
    description: 'Login for 7 consecutive days',
    icon: '🔥',
    requirement: { action: 'login_streak', count: 7 },
    reward: { xp: 300, coins: 150 },
    type: 'weekly',
  },
  {
    id: 'weekly_attestations',
    title: 'Trust Builder',
    description: 'Receive 5 new attestations',
    icon: '💎',
    requirement: { action: 'receive_attestations', count: 5 },
    reward: { xp: 250, coins: 100 },
    type: 'weekly',
  },
];

// Rarity Colors - Carnival Theme
export const RARITY_COLORS = {
  common: 'text-carnival-cream',
  uncommon: 'text-carnival-mint',
  rare: 'text-carnival-mint',
  epic: 'text-carnival-violet',
  legendary: 'text-carnival-marquee',
} as const;

export const RARITY_BG_COLORS = {
  common: 'bg-carnival-cream/10',
  uncommon: 'bg-carnival-mint/10',
  rare: 'bg-carnival-mint/10',
  epic: 'bg-carnival-violet/10',
  legendary: 'bg-gradient-to-br from-carnival-marquee/10 to-carnival-ticket/10',
} as const;

// Check if date is today
export function isToday(date: Date | null): boolean {
  if (!date) return false;
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}

// Calculate login streak
export function calculateStreak(lastLoginDate: Date | null): number {
  if (!lastLoginDate) return 1;

  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  // If last login was today, maintain streak
  if (isToday(lastLoginDate)) {
    return 0; // Don't increment, already logged in today
  }

  // If last login was yesterday, increment streak
  const lastLogin = new Date(lastLoginDate);
  if (
    lastLogin.getDate() === yesterday.getDate() &&
    lastLogin.getMonth() === yesterday.getMonth() &&
    lastLogin.getFullYear() === yesterday.getFullYear()
  ) {
    return 1; // Increment by 1
  }

  // Streak broken, reset to 1
  return -1; // Signal to reset streak
}
