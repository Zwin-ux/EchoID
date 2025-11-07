import { NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { DAILY_QUESTS } from "@/lib/gamification";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 }
      );
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { address },
      include: {
        questProgress: {
          where: {
            quest: {
              type: "daily",
            },
          },
          include: {
            quest: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Check if we need to generate today's quests
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's quests
    let dailyQuests = await prisma.quest.findMany({
      where: {
        type: "daily",
        createdAt: {
          gte: today,
        },
      },
    });

    // If no quests exist for today, create them
    if (dailyQuests.length === 0) {
      const questsToCreate = DAILY_QUESTS.map((questTemplate) => ({
        title: questTemplate.title,
        description: questTemplate.description,
        type: "daily" as const,
        requirement: questTemplate.requirement,
        reward: questTemplate.reward,
        icon: questTemplate.icon,
        expiresAt: new Date(today.getTime() + 24 * 60 * 60 * 1000), // Expires in 24 hours
      }));

      await prisma.quest.createMany({
        data: questsToCreate,
      });

      dailyQuests = await prisma.quest.findMany({
        where: {
          type: "daily",
          createdAt: {
            gte: today,
          },
        },
      });
    }

    // Get or create UserQuest records for today
    const userQuestsMap = new Map(
      profile.questProgress.map((uq) => [uq.questId, uq])
    );

    const questsWithProgress = await Promise.all(
      dailyQuests.map(async (quest) => {
        let userQuest = userQuestsMap.get(quest.id);

        // Create UserQuest if it doesn't exist
        if (!userQuest) {
          userQuest = await prisma.userQuest.create({
            data: {
              profileId: profile.id,
              questId: quest.id,
              progress: 0,
              completed: false,
            },
            include: {
              quest: true,
            },
          });
        }

        return {
          ...quest,
          progress: userQuest.progress,
          completed: userQuest.completed,
          claimed: userQuest.claimed || false,
          userQuestId: userQuest.id,
        };
      })
    );

    return NextResponse.json({
      quests: questsWithProgress,
      profile: {
        xp: profile.xp,
        level: profile.level,
        coins: profile.coins,
      },
    });
  } catch (error: any) {
    console.error("Error fetching daily quests:", error);
    return NextResponse.json(
      { error: "Failed to fetch daily quests", details: error.message },
      { status: 500 }
    );
  }
}
