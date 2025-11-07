"use client";

import { useState, useEffect } from "react";
import { Search, Filter, TrendingUp, Users, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { formatAddress, normalizeScore, getScoreColor } from "@/lib/utils";
import Link from "next/link";

interface Profile {
  id: string;
  address: string;
  handle: string;
  bio?: string;
  skills: string[];
  score: number;
  lastAnchorBlk?: number;
  createdAt: string;
  updatedAt: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ExplorePage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"score" | "recent">("score");
  const [filterAnchored, setFilterAnchored] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, [sortBy, filterAnchored]);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: "20",
        sort: sortBy === "score" ? "score" : "updatedAt",
        order: "desc",
      });

      if (filterAnchored) {
        params.append("anchored", "true");
      }

      const response = await fetch(`/api/profile?${params}`);
      const data = await response.json();
      setProfiles(data.profiles || []);
    } catch (error) {
      console.error("Failed to fetch profiles:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      profile.handle.toLowerCase().includes(query) ||
      profile.address.toLowerCase().includes(query) ||
      profile.skills.some((skill) => skill.toLowerCase().includes(query)) ||
      profile.bio?.toLowerCase().includes(query)
    );
  });

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div {...fadeInUp} className="mb-12 text-center">
          <Badge className="mb-4 px-6 py-3 bg-carnival-twist/20 border-2 border-carnival-twist/50 text-carnival-ticket font-bold">
            <Users className="w-4 h-4 mr-2 animate-marquee-pulse" />
            DISCOVER PROFILES
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black mb-4 carnival-text drop-shadow-lg">
            Explore the Midway
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto">
            Visit profile booths, connect with carnival-goers, and discover the decentralized identity community
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/90 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-carnival-twist w-5 h-5 animate-marquee-pulse" />
                  <Input
                    placeholder="Search by handle, address, skills, or bio..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-carnival-night/50 border-carnival-twist/30 focus:border-carnival-marquee focus:ring-carnival-marquee/50"
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={sortBy === "score" ? "default" : "outline"}
                    onClick={() => setSortBy("score")}
                    className={sortBy === "score" ? "bg-gradient-to-r from-carnival-marquee to-carnival-twist hover:from-carnival-marquee/80 hover:to-carnival-twist/80" : "border-carnival-twist/50 text-carnival-ticket hover:bg-carnival-twist/20"}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Top Rated
                  </Button>
                  <Button
                    variant={sortBy === "recent" ? "default" : "outline"}
                    onClick={() => setSortBy("recent")}
                    className={sortBy === "recent" ? "bg-gradient-to-r from-carnival-marquee to-carnival-twist hover:from-carnival-marquee/80 hover:to-carnival-twist/80" : "border-carnival-twist/50 text-carnival-ticket hover:bg-carnival-twist/20"}
                  >
                    <Filter className="w-4 h-4 mr-2" />
                    Recent
                  </Button>
                  <Button
                    variant={filterAnchored ? "default" : "outline"}
                    onClick={() => setFilterAnchored(!filterAnchored)}
                    className={filterAnchored ? "bg-gradient-to-r from-carnival-marquee to-carnival-twist hover:from-carnival-marquee/80 hover:to-carnival-twist/80" : "border-carnival-twist/50 text-carnival-ticket hover:bg-carnival-twist/20"}
                  >
                    <Star className="w-4 h-4 mr-2" />
                    Anchored
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Count */}
        <motion.div
          {...fadeInUp}
          transition={{ delay: 0.2 }}
          className="mb-6 text-white/70"
        >
          {loading ? (
            <Skeleton className="h-6 w-32" />
          ) : (
            <p>
              Found <span className="text-carnival-ticket font-bold">{filteredProfiles.length}</span> profiles at the midway
            </p>
          )}
        </motion.div>

        {/* Profile Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-16 h-16 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-6 w-32 mb-2" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProfiles.length === 0 ? (
          <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
            <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/50">
              <CardContent className="p-12 text-center">
                <div className="relative inline-block mb-4">
                  <Users className="w-16 h-16 mx-auto text-carnival-twist/50" />
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-carnival-marquee/20 border-2 border-carnival-marquee/50 rounded-full flex items-center justify-center">
                    <span className="text-carnival-marquee text-lg">!</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">No Booths Found</h3>
                <p className="text-white/70">
                  This section of the midway is empty. Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile, idx) => {
              const normalizedScore = normalizeScore(profile.score);
              return (
                <motion.div
                  key={profile.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.4 }}
                >
                  <Link href={`/profile/${profile.address}`}>
                    <Card className="hover:scale-105 hover:shadow-[0_0_25px_rgba(244,63,94,0.3)] transition-all duration-300 cursor-pointer h-full border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm relative overflow-hidden group">
                      {/* Awning stripe at top */}
                      <div className="absolute top-0 left-0 right-0 h-3 awning-stripes opacity-30 group-hover:opacity-50 transition-opacity" />

                      <CardHeader className="pt-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="w-16 h-16 border-2 border-carnival-twist/50 shadow-lg">
                            <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${profile.address}`} />
                            <AvatarFallback className="bg-carnival-marquee/20 text-carnival-ticket font-bold">
                              {profile.handle.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-white truncate group-hover:text-carnival-ticket transition-colors">
                                {profile.handle}
                              </h3>
                              {profile.lastAnchorBlk && (
                                <Badge className="text-xs bg-carnival-mint/20 border-carnival-mint/50 text-carnival-mint">
                                  <Star className="w-3 h-3 mr-1 animate-lights-glow" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-white/50 truncate font-mono">
                              {formatAddress(profile.address)}
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-white/70 mb-4 line-clamp-2 min-h-[40px]">
                          {profile.bio || "No bio provided"}
                        </p>

                        {/* Skills */}
                        {profile.skills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {profile.skills.slice(0, 3).map((skill, i) => (
                              <Badge key={i} className="text-xs bg-carnival-twist/10 border-carnival-twist/40 text-carnival-cotton hover:bg-carnival-twist/20 transition-colors">
                                {skill}
                              </Badge>
                            ))}
                            {profile.skills.length > 3 && (
                              <Badge className="text-xs bg-carnival-twist/10 border-carnival-twist/40 text-carnival-cotton">
                                +{profile.skills.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Reputation Score */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white/70 font-semibold">Reputation</span>
                            <span className={`font-bold ${normalizedScore >= 80 ? 'text-carnival-mint' : normalizedScore >= 60 ? 'text-carnival-ticket' : normalizedScore >= 40 ? 'text-carnival-twist' : 'text-carnival-marquee'}`}>
                              {normalizedScore}/100
                            </span>
                          </div>
                          <Progress value={normalizedScore} className="h-2 bg-carnival-night/50" />
                        </div>
                      </CardContent>

                      {/* Corner decoration lights */}
                      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-carnival-ticket animate-lights-glow opacity-60" />
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-carnival-marquee animate-lights-glow opacity-60" style={{ animationDelay: '0.5s' }} />
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
