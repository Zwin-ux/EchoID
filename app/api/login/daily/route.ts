import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { calculateStreak, isToday, XP_REWARDS, COIN_REWARDS } from "@/lib/gamification";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { address } = body;

    if (!address) {
      return NextResponse.json(
        { error: "Missing address" },
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

    // Check if already logged in today
    if (profile.lastLoginDate && isToday(profile.lastLoginDate)) {
      return NextResponse.json({
        success: true,
        alreadyLoggedIn: true,
        streak: profile.streak,
        message: "Already received daily login bonus today",
      });
    }

    // Calculate new streak
    const streakChange = calculateStreak(profile.lastLoginDate);
    let newStreak = profile.streak;

    if (streakChange === -1) {
      // Streak broken, reset to 1
      newStreak = 1;
    } else if (streakChange === 1) {
      // Continue streak
      newStreak = profile.streak + 1;
    }

    // Award login rewards
    const xpAmount = XP_REWARDS.DAILY_LOGIN;
    const coinAmount = COIN_REWARDS.DAILY_LOGIN;

    // Bonus for streak milestones
    let bonusXP = 0;
    let bonusCoins = 0;
    const milestones = [7, 30, 100, 365];

    if (milestones.includes(newStreak)) {
      bonusXP = newStreak * 10; // More XP for longer streaks
      bonusCoins = newStreak * 5;
    }

    // Update profile
    const updatedProfile = await prisma.profile.update({
      where: { address },
      data: {
        lastLoginDate: new Date(),
        streak: newStreak,
        xp: profile.xp + xpAmount + bonusXP,
        coins: profile.coins + coinAmount + bonusCoins,
      },
    });

    // Check for streak achievements
    const newAchievements: any[] = [];

    if (newStreak === 7 && !profile.achievements.find(a => a.badgeType === 'on_fire')) {
      const achievement = await prisma.achievement.create({
        data: {
          profileId: profile.id,
          badgeType: 'on_fire',
          rarity: 'epic',
        },
      });
      newAchievements.push(achievement);
    }

    return NextResponse.json({
      success: true,
      alreadyLoggedIn: false,
      xpAwarded: xpAmount + bonusXP,
      coinsAwarded: coinAmount + bonusCoins,
      streak: {
        current: newStreak,
        previous: profile.streak,
        broken: streakChange === -1,
      },
      milestone: milestones.includes(newStreak),
      newAchievements: newAchievements.map(a => ({
        badgeType: a.badgeType,
        rarity: a.rarity,
      })),
      profile: {
        xp: updatedProfile.xp,
        level: updatedProfile.level,
        coins: updatedProfile.coins,
        streak: updatedProfile.streak,
      },
    });
  } catch (error) {
    console.error("Error processing daily login:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
