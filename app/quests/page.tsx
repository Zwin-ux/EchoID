"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Target, Trophy, Sparkles } from "lucide-react";
import { QuestCard } from "@/components/quests/QuestCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

interface Quest {
  id: string;
  title: string;
  description: string;
  type: "daily" | "weekly";
  requirement: {
    action: string;
    count: number;
  };
  reward: {
    xp: number;
    coins: number;
  };
  icon: string;
  progress: number;
  completed: boolean;
  claimed: boolean;
  userQuestId: string;
}

export default function QuestsPage() {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);

  useEffect(() => {
    // Get user address from wallet (simplified for now)
    const address = localStorage.getItem("selectedAddress");
    setUserAddress(address);

    if (address) {
      fetchQuests(address);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchQuests = async (address: string) => {
    try {
      const response = await fetch(`/api/quests/daily?address=${address}`);
      const data = await response.json();

      if (response.ok) {
        setQuests(data.quests);
      } else {
        toast.error("Failed to load quests");
      }
    } catch (error) {
      console.error("Error fetching quests:", error);
      toast.error("Failed to load quests");
    } finally {
      setLoading(false);
    }
  };

  const handleClaimQuest = async (userQuestId: string) => {
    if (!userAddress || claiming) return;

    setClaiming(true);
    try {
      const response = await fetch("/api/quests/claim", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: userAddress,
          userQuestId,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Celebrate with confetti
        const carnivalColors = ['#F43F5E', '#F59E0B', '#FBBF24', '#EC4899', '#34D399'];
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: carnivalColors,
        });

        // Show success toast
        toast.success(
          `${data.questTitle} complete! +${data.rewards.xp} XP, +${data.rewards.coins} coins!`,
          {
            style: {
              background: "linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)",
              color: "#0F172A",
              border: "2px solid rgba(251, 191, 36, 0.8)",
              fontWeight: "bold",
            },
            icon: "🎫",
            duration: 4000,
          }
        );

        // Check for level up
        if (data.levelUp) {
          setTimeout(() => {
            toast.success(
              `🎊 LEVEL UP! You reached Level ${data.levelUp.newLevel}! 🎊`,
              {
                style: {
                  background: "linear-gradient(135deg, #F43F5E 0%, #F59E0B 100%)",
                  border: "2px solid rgba(251, 191, 36, 0.6)",
                  boxShadow: "0 0 20px rgba(244, 63, 94, 0.5)",
                  fontWeight: "bold",
                },
                duration: 5000,
              }
            );

            // Extra confetti for level up
            confetti({
              particleCount: 150,
              spread: 120,
              origin: { y: 0.5 },
              colors: carnivalColors,
            });
          }, 500);
        }

        // Refresh quests
        fetchQuests(userAddress);
      } else {
        toast.error(data.error || "Failed to claim reward");
      }
    } catch (error) {
      console.error("Error claiming quest:", error);
      toast.error("Failed to claim reward");
    } finally {
      setClaiming(false);
    }
  };

  const dailyQuests = quests.filter((q) => q.type === "daily");
  const completedQuests = quests.filter((q) => q.completed);
  const activeQuests = quests.filter((q) => !q.completed);

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-16 w-64 mb-8" />
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!userAddress) {
    return (
      <div className="min-h-screen py-20 px-6 flex items-center justify-center">
        <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Target className="w-16 h-16 mx-auto mb-4 text-carnival-twist" />
            <h2 className="text-2xl font-bold text-white mb-2">No Ticket Found</h2>
            <p className="text-white/70">
              Please connect your wallet to access carnival quests
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            {/* Carnival entrance sign */}
            <div className="absolute -top-2 -left-2 w-full h-full bg-carnival-marquee/20 rounded-lg blur-xl" />
            <h1 className="relative text-5xl font-bold carnival-text drop-shadow-2xl mb-3">
              🎯 Task Board
            </h1>
          </div>
          <p className="text-xl text-white/70 mt-2">
            Complete daily challenges to earn XP, coins, and exclusive prizes!
          </p>

          {/* Stats */}
          <div className="flex gap-4 mt-6">
            <Card className="border-2 border-carnival-violet/30 bg-carnival-violet/10 backdrop-blur-sm px-4 py-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-carnival-violet" />
                <div>
                  <div className="text-2xl font-bold text-carnival-violet">
                    {completedQuests.length}/{quests.length}
                  </div>
                  <div className="text-xs text-white/60">Completed Today</div>
                </div>
              </div>
            </Card>

            <Card className="border-2 border-carnival-ticket/30 bg-carnival-ticket/10 backdrop-blur-sm px-4 py-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-carnival-ticket animate-lights-glow" />
                <div>
                  <div className="text-2xl font-bold text-carnival-ticket">
                    {completedQuests.filter(q => !q.claimed).length}
                  </div>
                  <div className="text-xs text-white/60">Ready to Claim</div>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>

        {/* Quest Tabs */}
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="bg-carnival-canvas/70 border-2 border-carnival-twist/30 p-1">
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-carnival-marquee data-[state=active]:to-carnival-twist data-[state=active]:text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Active ({activeQuests.length})
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-carnival-mint data-[state=active]:to-carnival-mint/80 data-[state=active]:text-carnival-ink"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed ({completedQuests.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-6">
            {activeQuests.length === 0 ? (
              <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <CheckCircle className="w-16 h-16 mx-auto mb-4 text-carnival-mint" />
                  <h3 className="text-2xl font-bold text-white mb-2">All Done!</h3>
                  <p className="text-white/70">
                    You've completed all available quests. Check back tomorrow!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {activeQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    questId={quest.id}
                    userQuestId={quest.userQuestId}
                    title={quest.title}
                    description={quest.description}
                    icon={quest.icon}
                    progress={quest.progress}
                    required={quest.requirement.count}
                    completed={quest.completed}
                    claimed={quest.claimed}
                    reward={quest.reward}
                    type={quest.type}
                    onClaim={handleClaimQuest}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            {completedQuests.length === 0 ? (
              <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
                <CardContent className="p-12 text-center">
                  <Target className="w-16 h-16 mx-auto mb-4 text-carnival-twist" />
                  <h3 className="text-2xl font-bold text-white mb-2">No Completed Quests</h3>
                  <p className="text-white/70">
                    Start completing quests to earn rewards!
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {completedQuests.map((quest) => (
                  <QuestCard
                    key={quest.id}
                    questId={quest.id}
                    userQuestId={quest.userQuestId}
                    title={quest.title}
                    description={quest.description}
                    icon={quest.icon}
                    progress={quest.progress}
                    required={quest.requirement.count}
                    completed={quest.completed}
                    claimed={quest.claimed}
                    reward={quest.reward}
                    type={quest.type}
                    onClaim={handleClaimQuest}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
