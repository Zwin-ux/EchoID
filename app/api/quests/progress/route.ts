import { NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { address, action, increment = 1 } = body;

    if (!address || !action) {
      return NextResponse.json(
        { error: "Address and action are required" },
        { status: 400 }
      );
    }

    // Get user's profile
    const profile = await prisma.profile.findUnique({
      where: { address },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    // Get today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find active quests that match this action
    const activeQuests = await prisma.userQuest.findMany({
      where: {
        profileId: profile.id,
        completed: false,
        quest: {
          type: "daily",
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
      },
      include: {
        quest: true,
      },
    });

    const updatedQuests: any[] = [];

    // Update progress for matching quests
    for (const userQuest of activeQuests) {
      const requirement = userQuest.quest.requirement as {
        action: string;
        count: number;
      };

      // Check if this quest matches the action
      if (requirement.action === action) {
        const newProgress = userQuest.progress + increment;
        const completed = newProgress >= requirement.count;

        const updated = await prisma.userQuest.update({
          where: { id: userQuest.id },
          data: {
            progress: newProgress,
            completed,
          },
          include: {
            quest: true,
          },
        });

        updatedQuests.push({
          questId: updated.questId,
          questTitle: updated.quest.title,
          progress: updated.progress,
          required: requirement.count,
          completed: updated.completed,
          reward: updated.quest.reward,
        });
      }
    }

    return NextResponse.json({
      success: true,
      updated: updatedQuests.length,
      quests: updatedQuests,
    });
  } catch (error: any) {
    console.error("Error updating quest progress:", error);
    return NextResponse.json(
      { error: "Failed to update quest progress", details: error.message },
      { status: 500 }
    );
  }
}
