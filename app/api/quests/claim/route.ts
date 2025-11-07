import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, userQuestId } = body;

    if (!address || !userQuestId) {
      return NextResponse.json(
        { error: "Address and userQuestId are required" },
        { status: 400 }
      );
    }

    // Get the user quest with quest details
    const userQuest = await prisma.userQuest.findUnique({
      where: { id: userQuestId },
      include: {
        quest: true,
        profile: true,
      },
    });

    if (!userQuest) {
      return NextResponse.json(
        { error: "Quest not found" },
        { status: 404 }
      );
    }

    // Verify this quest belongs to the user
    if (userQuest.profile.address !== address) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    // Check if quest is completed
    if (!userQuest.completed) {
      return NextResponse.json(
        { error: "Quest not completed yet" },
        { status: 400 }
      );
    }

    // Check if already claimed
    if (userQuest.claimed) {
      return NextResponse.json(
        { error: "Rewards already claimed" },
        { status: 400 }
      );
    }

    // Calculate rewards
    const reward = userQuest.quest.reward as { xp: number; coins: number };
    const xpReward = reward.xp || 0;
    const coinsReward = reward.coins || 0;

    // Update profile with rewards and mark quest as claimed
    const updatedProfile = await prisma.profile.update({
      where: { id: userQuest.profileId },
      data: {
        xp: {
          increment: xpReward,
        },
        coins: {
          increment: coinsReward,
        },
      },
    });

    // Mark quest as claimed
    await prisma.userQuest.update({
      where: { id: userQuestId },
      data: {
        claimed: true,
        completedAt: new Date(),
      },
    });

    // Check for level up
    const XP_PER_LEVEL = 100;
    const LEVEL_MULTIPLIER = 1.5;

    function calculateLevelFromXP(xp: number): number {
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

    const oldLevel = userQuest.profile.level;
    const newLevel = calculateLevelFromXP(updatedProfile.xp);
    const leveledUp = newLevel > oldLevel;

    // Update level if level-up occurred
    if (leveledUp) {
      await prisma.profile.update({
        where: { id: updatedProfile.id },
        data: { level: newLevel },
      });
    }

    return NextResponse.json({
      success: true,
      rewards: {
        xp: xpReward,
        coins: coinsReward,
      },
      profile: {
        xp: updatedProfile.xp,
        level: leveledUp ? newLevel : oldLevel,
        coins: updatedProfile.coins,
      },
      levelUp: leveledUp ? {
        oldLevel,
        newLevel,
      } : null,
      questTitle: userQuest.quest.title,
    });
  } catch (error: any) {
    console.error("Error claiming quest reward:", error);
    return NextResponse.json(
      { error: "Failed to claim quest reward", details: error.message },
      { status: 500 }
    );
  }
}
