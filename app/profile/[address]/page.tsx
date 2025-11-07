"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Shield,
  Award,
  Clock,
  Link as LinkIcon,
  Copy,
  CheckCircle,
  ExternalLink,
  Github
} from "lucide-react";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatAddress, formatDate, normalizeScore, getScoreColor, copyToClipboard } from "@/lib/utils";
import toast from "react-hot-toast";

interface Profile {
  address: string;
  handle: string;
  bio?: string;
  links?: {
    github?: string;
    website?: string;
  };
  skills: string[];
  score: number;
  lastAnchorTx?: string;
  lastAnchorBlk?: number;
  hashHex?: string;
  createdAt: string;
  updatedAt: string;
}

interface Attestation {
  attester: string;
  attestationType: string;
  score: number;
  comment: string;
  timestamp: number;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function ProfilePage() {
  const params = useParams();
  const address = params.address as string;

  const [profile, setProfile] = useState<Profile | null>(null);
  const [attestations, setAttestations] = useState<Attestation[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (address) {
      fetchProfile();
      fetchAttestations();
    }
  }, [address]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`/api/profile/${address}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
      toast.error("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchAttestations = async () => {
    try {
      const response = await fetch(`/api/attestations/${address}`);
      if (response.ok) {
        const data = await response.json();
        setAttestations(data.attestations || []);
      }
    } catch (error) {
      console.error("Failed to fetch attestations:", error);
    }
  };

  const handleCopyAddress = async () => {
    try {
      await copyToClipboard(address);
      setCopied(true);
      toast.success("Address copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Skeleton className="h-12 w-32 mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="w-32 h-32 rounded-full mx-auto mb-4" />
                  <Skeleton className="h-8 w-full mb-2" />
                  <Skeleton className="h-6 w-3/4 mx-auto" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen py-20 px-6 flex items-center justify-center">
        <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Shield className="w-16 h-16 mx-auto mb-4 text-carnival-twist" />
            <h2 className="text-2xl font-bold text-white mb-2">Booth Closed</h2>
            <p className="text-white/70 mb-6">
              This profile booth doesn't exist at the midway
            </p>
            <Link href="/explore">
              <Button className="bg-gradient-to-r from-carnival-marquee to-carnival-twist hover:from-carnival-marquee/80 hover:to-carnival-twist/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Midway
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const normalizedScore = normalizeScore(profile.score);

  return (
    <div className="min-h-screen py-20 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <motion.div {...fadeInUp} className="mb-8">
          <Link href="/explore">
            <Button variant="ghost" className="text-carnival-ticket hover:text-carnival-marquee hover:bg-carnival-twist/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Midway
            </Button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile Card */}
          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <Card className="sticky top-24 border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm relative overflow-hidden">
              {/* Awning stripe at top */}
              <div className="absolute top-0 left-0 right-0 h-3 awning-stripes opacity-40" />

              {/* Corner decoration lights */}
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-carnival-ticket animate-lights-glow opacity-60" />
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-carnival-marquee animate-lights-glow opacity-60" style={{ animationDelay: '0.5s' }} />

              <CardContent className="p-6 pt-8">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <Avatar className="w-32 h-32 mx-auto mb-4 ring-4 ring-carnival-twist/30 shadow-lg">
                    <AvatarImage src={`https://api.dicebear.com/7.x/shapes/svg?seed=${address}`} />
                    <AvatarFallback className="text-3xl bg-carnival-marquee/20 text-carnival-ticket">
                      {profile.handle.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  {/* Handle */}
                  <h1 className="text-2xl font-bold carnival-text drop-shadow-lg mb-2">
                    {profile.handle}
                  </h1>

                  {/* Address with Copy */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <code className="text-sm text-white/50 font-mono">
                      {formatAddress(address, 8, 6)}
                    </code>
                    <button
                      onClick={handleCopyAddress}
                      className="text-carnival-twist hover:text-carnival-ticket transition-colors animate-lights-glow"
                    >
                      {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Verification Badge */}
                  {profile.lastAnchorBlk && (
                    <Badge className="mb-4 bg-carnival-mint/20 border-carnival-mint/50 text-carnival-mint">
                      <Shield className="w-3 h-3 mr-1 animate-lights-glow" />
                      Blockchain Verified
                    </Badge>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Reputation Score */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70 text-sm font-semibold">Reputation</span>
                    <span className={`text-2xl font-bold ${normalizedScore >= 80 ? 'text-carnival-mint' : normalizedScore >= 60 ? 'text-carnival-ticket' : normalizedScore >= 40 ? 'text-carnival-twist' : 'text-carnival-marquee'}`}>
                      {normalizedScore}
                    </span>
                  </div>
                  <Progress value={normalizedScore} className="h-3 bg-carnival-night/50" />
                  <p className="text-xs text-white/50">
                    Based on profile completeness and verifications
                  </p>
                </div>

                <Separator className="my-6" />

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-carnival-violet/10 border border-carnival-violet/30 rounded-lg">
                    <div className="text-2xl font-bold text-carnival-violet animate-lights-glow">
                      {attestations.length}
                    </div>
                    <div className="text-xs text-white/70">Attestations</div>
                  </div>
                  <div className="text-center p-3 bg-carnival-candy/10 border border-carnival-candy/30 rounded-lg">
                    <div className="text-2xl font-bold text-carnival-candy animate-lights-glow">
                      {profile.skills.length}
                    </div>
                    <div className="text-xs text-white/70">Skills</div>
                  </div>
                </div>

                {/* QR Code - Carnival Ticket Style */}
                <div className="relative bg-carnival-cream p-4 rounded-lg border-2 border-dashed border-carnival-twist/30">
                  {/* Ticket perforations */}
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-carnival-night rounded-full" />
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-carnival-night rounded-full" />

                  <QRCodeCanvas
                    value={`${typeof window !== 'undefined' ? window.location.origin : ''}/profile/${address}`}
                    size={180}
                    className="mx-auto"
                  />
                  <p className="text-center text-xs text-carnival-ink mt-2 font-semibold">
                    🎫 Scan to visit booth
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Right Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio Section */}
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="carnival-text">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 leading-relaxed">
                    {profile.bio || "This carnival-goer hasn't added a bio yet."}
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Links */}
            {profile.links && (Object.keys(profile.links).length > 0) && (
              <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
                <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 carnival-text">
                      <LinkIcon className="w-5 h-5 text-carnival-twist" />
                      Links
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-3">
                      {profile.links.github && (
                        <a
                          href={profile.links.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-carnival-violet/10 border border-carnival-violet/30 rounded-lg hover:bg-carnival-violet/20 transition-colors"
                        >
                          <Github className="w-4 h-4 text-carnival-violet" />
                          <span>GitHub</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {profile.links.website && (
                        <a
                          href={profile.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 bg-carnival-ticket/10 border border-carnival-ticket/30 rounded-lg hover:bg-carnival-ticket/20 transition-colors"
                        >
                          <LinkIcon className="w-4 h-4 text-carnival-ticket" />
                          <span>Website</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Skills */}
            {profile.skills.length > 0 && (
              <motion.div {...fadeInUp} transition={{ delay: 0.4 }}>
                <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="carnival-text">Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, idx) => (
                        <Badge key={idx} className="bg-carnival-twist/10 border-carnival-twist/40 text-carnival-cotton hover:bg-carnival-twist/20 transition-colors">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Attestations */}
            <motion.div {...fadeInUp} transition={{ delay: 0.5 }}>
              <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 carnival-text">
                    <Award className="w-5 h-5 text-carnival-ticket animate-lights-glow" />
                    Attestations ({attestations.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {attestations.length === 0 ? (
                    <p className="text-white/70 text-center py-8">
                      No attestations at this booth yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {attestations.map((attestation, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-carnival-night/30 border-2 border-carnival-violet/20 rounded-lg relative overflow-hidden"
                        >
                          {/* Corner decoration lights */}
                          <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-carnival-marquee animate-lights-glow opacity-60" />
                          <div className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-carnival-candy animate-lights-glow opacity-60" style={{ animationDelay: '0.5s' }} />

                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <Badge className="mb-2 bg-carnival-violet/20 border-carnival-violet/40 text-carnival-violet">
                                {attestation.attestationType}
                              </Badge>
                              <p className="text-sm text-white/70">
                                From: {formatAddress(attestation.attester)}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className={`text-lg font-bold ${attestation.score >= 80 ? 'text-carnival-mint' : attestation.score >= 60 ? 'text-carnival-ticket' : attestation.score >= 40 ? 'text-carnival-twist' : 'text-carnival-marquee'}`}>
                                {attestation.score}/100
                              </div>
                            </div>
                          </div>
                          {attestation.comment && (
                            <p className="text-sm text-white/80 mt-2 italic">
                              "{attestation.comment}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Metadata */}
            <motion.div {...fadeInUp} transition={{ delay: 0.6 }}>
              <Card className="border-2 border-carnival-twist/30 bg-carnival-canvas/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 carnival-text">
                    <Clock className="w-5 h-5 text-carnival-candy" />
                    Metadata
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/70">Booth Opened:</span>
                    <span className="text-carnival-ticket font-semibold">{formatDate(profile.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/70">Last Updated:</span>
                    <span className="text-carnival-twist font-semibold">{formatDate(profile.updatedAt)}</span>
                  </div>
                  {profile.lastAnchorBlk && (
                    <div className="flex justify-between">
                      <span className="text-white/70">Anchor Block:</span>
                      <span className="text-carnival-mint font-mono">#{profile.lastAnchorBlk}</span>
                    </div>
                  )}
                  {profile.hashHex && (
                    <div className="flex justify-between">
                      <span className="text-white/70">Hash:</span>
                      <code className="text-carnival-violet text-xs font-mono">
                        {formatAddress(profile.hashHex, 12, 8)}
                      </code>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
