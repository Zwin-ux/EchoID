import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import {
  checkLevelUp,
  XP_REWARDS,
  COIN_REWARDS,
  ACHIEVEMENTS,
} from "@/lib/gamification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address, action, amount } = body;

    if (!address || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get current profile
    const profile = await prisma.profile.findUnique({
      where: { address },
      include: { achievements: true },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Calculate XP to award
    const xpAmount = amount || XP_REWARDS[action as keyof typeof XP_REWARDS] || 0;
    const coinAmount = COIN_REWARDS[action as keyof typeof COIN_REWARDS] || 0;

    if (xpAmount === 0 && coinAmount === 0) {
      return NextResponse.json(
        { error: "Invalid action or amount" },
        { status: 400 }
      );
    }

    // Check for level up
    const levelUpInfo = checkLevelUp(profile.xp, profile.xp + xpAmount);

    // Update profile with new XP, coins, and potentially new level
    const updatedProfile = await prisma.profile.update({
      where: { address },
      data: {
        xp: profile.xp + xpAmount,
        level: levelUpInfo.newLevel,
        coins: profile.coins + coinAmount + levelUpInfo.coinsEarned,
      },
    });

    // Check for achievements
    const newAchievements: any[] = [];

    // Check level-based achievements
    if (levelUpInfo.leveledUp) {
      if (levelUpInfo.newLevel === 5 && !profile.achievements.find(a => a.badgeType === 'rising_star')) {
        const achievement = await prisma.achievement.create({
          data: {
            profileId: profile.id,
            badgeType: 'rising_star',
            rarity: 'common',
          },
        });
        newAchievements.push(achievement);
      }

      if (levelUpInfo.newLevel === 10 && !profile.achievements.find(a => a.badgeType === 'level_10')) {
        const achievement = await prisma.achievement.create({
          data: {
            profileId: profile.id,
            badgeType: 'level_10',
            rarity: 'rare',
          },
        });
        newAchievements.push(achievement);
      }
    }

    // Check action-based achievements
    if (action === 'CREATE_PROFILE' && !profile.achievements.find(a => a.badgeType === 'first_steps')) {
      const achievement = await prisma.achievement.create({
        data: {
          profileId: profile.id,
          badgeType: 'first_steps',
          rarity: 'common',
        },
      });
      newAchievements.push(achievement);
    }

    if (action === 'ANCHOR_HASH' && !profile.achievements.find(a => a.badgeType === 'blockchain_verified')) {
      const achievement = await prisma.achievement.create({
        data: {
          profileId: profile.id,
          badgeType: 'blockchain_verified',
          rarity: 'rare',
        },
      });
      newAchievements.push(achievement);
    }

    return NextResponse.json({
      success: true,
      xpAwarded: xpAmount,
      coinsAwarded: coinAmount + levelUpInfo.coinsEarned,
      levelUp: levelUpInfo.leveledUp
        ? {
            oldLevel: levelUpInfo.oldLevel,
            newLevel: levelUpInfo.newLevel,
            bonusCoins: levelUpInfo.coinsEarned,
          }
        : null,
      newAchievements: newAchievements.map(a => ({
        id: a.id,
        badgeType: a.badgeType,
        rarity: a.rarity,
        details: ACHIEVEMENTS[a.badgeType.toUpperCase() as keyof typeof ACHIEVEMENTS],
      })),
      profile: {
        xp: updatedProfile.xp,
        level: updatedProfile.level,
        coins: updatedProfile.coins,
      },
    });
  } catch (error) {
    console.error("Error awarding XP:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
