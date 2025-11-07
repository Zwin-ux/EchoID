"use client";
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import ProfileForm from "@/components/ProfileForm";
import { DailyLoginModal } from "@/components/DailyLoginModal";
import { Wallet, User, Anchor, Eye, Plus, Home, BarChart3, Award, Shield, Clock, TrendingUp, Activity, CheckCircle, XCircle, AlertCircle, Ticket, Trophy, Target, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { TicketButton } from "@/components/ui/ticket-button";
import { BoothCard, BoothCardHeader, BoothCardTitle, BoothCardDescription, BoothCardContent, BoothCardFooter } from "@/components/ui/booth-card";
import { LightsProgress, LightsProgressBar } from "@/components/ui/lights-progress";
import { motion } from "framer-motion";

// Dynamically import components that use Polkadot.js to avoid SSR issues
const ConnectWallet = dynamic(() => import("@/components/ConnectWallet"), { ssr: false });
const AnchorHashCard = dynamic(() => import("@/components/AnchorHashCard"), { ssr: false });
const AttestationViewer = dynamic(() => import("@/components/AttestationViewer"), { ssr: false });
const AttestationForm = dynamic(() => import("@/components/AttestationForm"), { ssr: false });

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function Dashboard() {
  const [account, setAccount] = useState<any>(null);
  const [profileSnapshot, setProfileSnapshot] = useState<any>(null);
  const [trustScore, setTrustScore] = useState(0);
  const [showDailyLogin, setShowDailyLogin] = useState(false);

  useEffect(() => {
    // Simulate trust score calculation
    if (profileSnapshot) {
      const baseScore = 35;
      const profileComplete = profileSnapshot.handle && profileSnapshot.bio ? 25 : 0;
      const anchored = profileSnapshot.lastAnchorBlk ? 20 : 0;
      const attestations = 20; // Would come from actual attestation count
      setTrustScore(baseScore + profileComplete + anchored);
    }
  }, [profileSnapshot]);

  useEffect(() => {
    // Show daily login modal when account is connected
    if (account?.address) {
      setShowDailyLogin(true);
    }
  }, [account]);

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Carnival Midway Header */}
        <motion.div {...fadeInUp} className="mb-12">
          <div className="text-center mb-8 relative">
            {/* Decorative lights */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 flex gap-4">
              {[...Array(7)].map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full bg-carnival-ticket animate-lights-glow"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
            
            <Badge className="mb-4 px-6 py-3 bg-carnival-mint/20 border-2 border-carnival-mint text-carnival-mint font-bold">
              <div className="w-3 h-3 bg-carnival-mint rounded-full mr-3 animate-lights-glow"></div>
              MIDWAY OPEN FOR BUSINESS
            </Badge>
            <h1 className="text-6xl md:text-7xl font-black mb-4 carnival-text drop-shadow-2xl tracking-tight">
              Your Identity Midway
            </h1>
            <p className="text-carnival-cotton text-xl max-w-3xl mx-auto font-semibold">
              Step right up! Build your identity, collect prizes, and earn your reputation at the greatest show on the blockchain!
            </p>
            
            {/* Decorative banner */}
            <div className="mt-6 flex items-center justify-center gap-3">
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-carnival-marquee to-transparent" />
              <Ticket className="w-6 h-6 text-carnival-ticket animate-ticket-bounce" />
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-carnival-marquee to-transparent" />
            </div>
          </div>
        </motion.div>

        {/* Admission Gate - Wallet Connection */}
        {!account && (
          <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
            <BoothCard awning awningColor="marquee" glow className="max-w-2xl mx-auto">
              <BoothCardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-carnival-marquee to-carnival-twist rounded-2xl flex items-center justify-center shadow-2xl border-4 border-carnival-ticket rotate-3">
                    <Wallet className="w-8 h-8 text-white -rotate-3" />
                  </div>
                  <div>
                    <BoothCardTitle>🎟️ Admission Gate</BoothCardTitle>
                    <BoothCardDescription>
                      Connect your wallet to enter the Identity Carnival!
                    </BoothCardDescription>
                  </div>
                </div>
              </BoothCardHeader>
              <BoothCardContent>
                <ConnectWallet onSelect={setAccount} />
              </BoothCardContent>
            </BoothCard>
          </motion.div>
        )}

        {/* Tabbed Interface */}
        {account && (
          <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid mb-8 bg-carnival-canvas/80 border-2 border-carnival-twist/30 p-2">
                <TabsTrigger 
                  value="overview" 
                  className="gap-2 data-[state=active]:bg-carnival-ticket data-[state=active]:text-carnival-ink font-bold"
                >
                  <Home className="w-4 h-4" />
                  <span className="hidden sm:inline">Main Midway</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="profile" 
                  className="gap-2 data-[state=active]:bg-carnival-ticket data-[state=active]:text-carnival-ink font-bold"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Your Booth</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="attestations" 
                  className="gap-2 data-[state=active]:bg-carnival-ticket data-[state=active]:text-carnival-ink font-bold"
                >
                  <Award className="w-4 h-4" />
                  <span className="hidden sm:inline">Prize Counter</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="anchor" 
                  className="gap-2 data-[state=active]:bg-carnival-ticket data-[state=active]:text-carnival-ink font-bold"
                >
                  <Anchor className="w-4 h-4" />
                  <span className="hidden sm:inline">Ferris Wheel</span>
                </TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Game Score Booths */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                    <BoothCard awning awningColor="marquee" glow className="hover:scale-105 transition-all duration-300">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-carnival-marquee to-carnival-candy rounded-full mb-4 border-4 border-carnival-ticket shadow-lg">
                          <User className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <h3 className="text-4xl font-black carnival-text">
                            {profileSnapshot ? "1" : "0"}
                          </h3>
                          <Badge className={profileSnapshot ? "bg-carnival-mint/20 text-carnival-mint border-carnival-mint" : "bg-carnival-ink/20 text-white/50"}>
                            {profileSnapshot ? "ACTIVE" : "CLOSED"}
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-carnival-ink/70">Identity Booth Status</p>
                      </div>
                    </BoothCard>
                  </motion.div>

                  <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
                    <BoothCard awning awningColor="twist" glow className="hover:scale-105 transition-all duration-300">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-carnival-twist to-carnival-ticket rounded-full mb-4 border-4 border-carnival-marquee shadow-lg">
                          <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <h3 className="text-4xl font-black carnival-text">0</h3>
                          <Badge className="bg-carnival-violet/20 text-carnival-violet border-carnival-violet">
                            PRIZES
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-carnival-ink/70">Attestations Collected</p>
                      </div>
                    </BoothCard>
                  </motion.div>

                  <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                    <BoothCard awning awningColor="candy" glow className="hover:scale-105 transition-all duration-300">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-carnival-candy to-carnival-violet rounded-full mb-4 border-4 border-carnival-ticket shadow-lg animate-ferris-rotate">
                          <Anchor className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <h3 className="text-4xl font-black carnival-text">
                            {profileSnapshot?.lastAnchorBlk ? "1" : "0"}
                          </h3>
                          <Badge className={profileSnapshot?.lastAnchorBlk ? "bg-carnival-mint/20 text-carnival-mint border-carnival-mint" : "bg-carnival-ink/20 text-white/50"}>
                            {profileSnapshot?.lastAnchorBlk ? "SECURED" : "WAITING"}
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-carnival-ink/70">Blockchain Rides Taken</p>
                      </div>
                    </BoothCard>
                  </motion.div>

                  <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                    <BoothCard awning awningColor="violet" glow className="hover:scale-105 transition-all duration-300">
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-carnival-violet to-carnival-mint rounded-full mb-4 border-4 border-carnival-ticket shadow-lg">
                          <Target className="w-8 h-8 text-white" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <h3 className="text-4xl font-black carnival-text">{trustScore}</h3>
                          <Badge className="bg-carnival-ticket/30 text-carnival-twist border-carnival-twist font-black">
                            POINTS
                          </Badge>
                        </div>
                        <p className="text-sm font-bold text-carnival-ink/70">High Striker Score</p>
                      </div>
                    </BoothCard>
                  </motion.div>
                </div>

                {/* Prize Meter - Trust Score */}
                <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
                  <BoothCard awning awningColor="marquee" glow>
                    <BoothCardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <BoothCardTitle className="flex items-center gap-2">
                            <Zap className="w-6 h-6 text-carnival-twist animate-lights-glow" />
                            High Striker - Prize Meter
                          </BoothCardTitle>
                          <BoothCardDescription className="mt-2">
                            Ring the bell at 100 points to win the grand prize! Complete challenges to boost your score.
                          </BoothCardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-5xl font-black carnival-text drop-shadow-lg">{trustScore}</div>
                          <div className="text-sm font-bold text-carnival-twist">/ 100 PTS</div>
                        </div>
                      </div>
                    </BoothCardHeader>
                    <BoothCardContent className="space-y-6">
                      <div>
                        <LightsProgress value={trustScore} max={100} steps={5} showLabels color="marquee" />
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-carnival-canvas/50 border border-carnival-twist/20">
                          <div className={`w-8 h-8 rounded-full ${account ? 'bg-carnival-mint' : 'bg-carnival-ink/30'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            {account ? (
                              <Ticket className="w-5 h-5 text-white animate-ticket-bounce" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-carnival-ink/50"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-carnival-ink">Admission Ticket</p>
                            <p className="text-xs font-semibold text-carnival-twist">+35 points</p>
                            <p className="text-xs text-carnival-ink/60 mt-1">{account ? '✓ Stamped!' : 'Get your ticket'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-carnival-canvas/50 border border-carnival-twist/20">
                          <div className={`w-8 h-8 rounded-full ${profileSnapshot ? 'bg-carnival-mint' : 'bg-carnival-ink/30'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            {profileSnapshot ? (
                              <User className="w-5 h-5 text-white" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-carnival-ink/50"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-carnival-ink">Booth Setup</p>
                            <p className="text-xs font-semibold text-carnival-twist">+25 points</p>
                            <p className="text-xs text-carnival-ink/60 mt-1">{profileSnapshot ? '✓ Open for business!' : 'Build your booth'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-carnival-canvas/50 border border-carnival-twist/20">
                          <div className={`w-8 h-8 rounded-full ${profileSnapshot?.lastAnchorBlk ? 'bg-carnival-mint' : 'bg-carnival-ink/30'} flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            {profileSnapshot?.lastAnchorBlk ? (
                              <Anchor className="w-5 h-5 text-white animate-ferris-rotate" />
                            ) : (
                              <div className="w-4 h-4 rounded-full bg-carnival-ink/50"></div>
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-carnival-ink">Ferris Wheel Ride</p>
                            <p className="text-xs font-semibold text-carnival-twist">+20 points</p>
                            <p className="text-xs text-carnival-ink/60 mt-1">{profileSnapshot?.lastAnchorBlk ? '✓ Sky high!' : 'Take a ride'}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 rounded-lg bg-carnival-canvas/50 border border-carnival-twist/20">
                          <div className="w-8 h-8 rounded-full bg-carnival-ink/30 flex items-center justify-center flex-shrink-0 shadow-lg">
                            <Trophy className="w-5 h-5 text-carnival-ink/50" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-carnival-ink">Win Prizes</p>
                            <p className="text-xs font-semibold text-carnival-twist">+20 points</p>
                            <p className="text-xs text-carnival-ink/60 mt-1">Collect attestations</p>
                          </div>
                        </div>
                      </div>
                    </BoothCardContent>
                  </BoothCard>
                </motion.div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-6">
                  {/* Account Overview */}
                  <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5 text-purple-400" />
                          Account Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-white/70">Wallet Address</span>
                            <code className="text-xs font-mono text-white bg-black/30 px-2 py-1 rounded">
                              {account.address.slice(0, 8)}...{account.address.slice(-6)}
                            </code>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-white/70">Account Type</span>
                            <Badge variant="outline">{account.meta?.source || 'Unknown'}</Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-white/70">Network</span>
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                              Polkadot
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                            <span className="text-sm text-white/70">Profile Status</span>
                            <Badge variant={profileSnapshot ? "success" : "outline"}>
                              {profileSnapshot ? 'Created' : 'Not Created'}
                            </Badge>
                          </div>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                          <h4 className="text-sm font-semibold text-white">Security Features</h4>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-white/70">Wallet Encryption Active</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-white/70">Blockchain Verified</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-400" />
                              <span className="text-white/70">Decentralized Storage</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Recent Activity */}
                  <motion.div {...fadeInUp} transition={{ delay: 0.7 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Activity className="w-5 h-5 text-blue-400" />
                          Recent Activity
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {profileSnapshot ? (
                            <>
                              <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                  <CheckCircle className="w-4 h-4 text-green-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">Profile Created</p>
                                  <p className="text-xs text-white/60 mt-1">Your decentralized identity was successfully created</p>
                                  <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Just now
                                  </p>
                                </div>
                              </div>
                              {profileSnapshot.lastAnchorBlk && (
                                <div className="flex gap-4 items-start">
                                  <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Anchor className="w-4 h-4 text-blue-400" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-white">Blockchain Anchor</p>
                                    <p className="text-xs text-white/60 mt-1">Profile anchored at block #{profileSnapshot.lastAnchorBlk}</p>
                                    <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      Recently
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="flex gap-4 items-start">
                                <div className="w-8 h-8 bg-purple-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Wallet className="w-4 h-4 text-purple-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm font-medium text-white">Wallet Connected</p>
                                  <p className="text-xs text-white/60 mt-1">Successfully connected to Polkadot network</p>
                                  <p className="text-xs text-white/40 mt-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    Today
                                  </p>
                                </div>
                              </div>
                            </>
                          ) : (
                            <div className="text-center py-8">
                              <Activity className="w-12 h-12 mx-auto text-slate-600 mb-3" />
                              <p className="text-sm text-white/70">No activity yet</p>
                              <p className="text-xs text-white/50 mt-1">Create your profile to get started</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>

                {/* Getting Started Guide */}
                <motion.div {...fadeInUp} transition={{ delay: 0.8 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Getting Started Guide</CardTitle>
                      <CardDescription>Follow these steps to set up your decentralized identity and maximize your trust score</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            <div className="w-6 h-6 bg-purple-500/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-purple-400">1</span>
                            </div>
                            Setup Phase
                          </h4>
                          <div className="space-y-3 ml-8">
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <CheckCircle className="w-3 h-3 text-green-500" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">Connect Wallet</p>
                                <p className="text-xs text-white/60">✓ Completed successfully</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded-full ${profileSnapshot ? 'bg-green-500/20' : 'bg-purple-500/20'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                {profileSnapshot ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                  <span className="text-xs font-bold text-purple-400">→</span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">Create Profile</p>
                                <p className="text-xs text-white/60">
                                  {profileSnapshot ? '✓ Profile created' : 'Add your handle, bio, and skills'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className={`w-5 h-5 rounded-full ${profileSnapshot?.lastAnchorBlk ? 'bg-green-500/20' : 'bg-slate-500/20'} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                                {profileSnapshot?.lastAnchorBlk ? (
                                  <CheckCircle className="w-3 h-3 text-green-500" />
                                ) : (
                                  <span className="text-xs font-bold text-slate-400">3</span>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">Anchor to Blockchain</p>
                                <p className="text-xs text-white/60">
                                  {profileSnapshot?.lastAnchorBlk ? '✓ Anchored on chain' : 'Secure your profile with blockchain'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            <div className="w-6 h-6 bg-blue-500/20 rounded-full flex items-center justify-center">
                              <span className="text-xs font-bold text-blue-400">2</span>
                            </div>
                            Growth Phase
                          </h4>
                          <div className="space-y-3 ml-8">
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-slate-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-slate-400">1</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">Request Attestations</p>
                                <p className="text-xs text-white/60">Get verified by trusted parties</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-slate-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-slate-400">2</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">Issue Attestations</p>
                                <p className="text-xs text-white/60">Help verify others and build community trust</p>
                              </div>
                            </div>
                            <div className="flex items-start gap-3">
                              <div className="w-5 h-5 rounded-full bg-slate-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-xs font-bold text-slate-400">3</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">Build Reputation</p>
                                <p className="text-xs text-white/60">Increase your trust score to 100</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>Profile Management</CardTitle>
                        <CardDescription>Create and manage your decentralized identity</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ProfileForm address={account.address} onSaved={(snap: any) => setProfileSnapshot(snap)} />
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Attestations Tab */}
              <TabsContent value="attestations" className="space-y-6">
                <div className="grid lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Plus className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>Create Attestation</CardTitle>
                          <CardDescription>Issue attestations to build trust</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <AttestationForm account={account} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Eye className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>View Attestations</CardTitle>
                          <CardDescription>Your received attestations</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <AttestationViewer address={account.address} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Anchor Tab */}
              <TabsContent value="anchor" className="space-y-6">
                {profileSnapshot ? (
                  <Card>
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                          <Anchor className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle>Hash Anchoring</CardTitle>
                          <CardDescription>Anchor your profile data on the blockchain</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <AnchorHashCard account={account} profileSnapshot={profileSnapshot} />
                    </CardContent>
                  </Card>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Anchor className="w-16 h-16 mx-auto mb-4 text-slate-600" />
                      <h3 className="text-2xl font-bold text-white mb-2">Create a Profile First</h3>
                      <p className="text-white/70 mb-6">
                        You need to create a profile before you can anchor it to the blockchain
                      </p>
                      <TabsList>
                        <TabsTrigger value="profile">Go to Profile</TabsTrigger>
                      </TabsList>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}

        {/* Daily Login Modal */}
        {showDailyLogin && account?.address && (
          <DailyLoginModal
            address={account.address}
            onClose={() => setShowDailyLogin(false)}
          />
        )}
      </div>
    </div>
  );
}
