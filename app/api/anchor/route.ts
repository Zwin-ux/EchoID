import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { secureHashProfile } from "@/lib/hashing";
import { computeReputation } from "@/lib/reputation";
import logger from "@/lib/logger";
import { strictRateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = strictRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { address, txHash, blockNumber, profileSnapshot } = await req.json();

    if (!address || !txHash || typeof blockNumber !== "number" || !profileSnapshot) {
      logger.warn('Anchor POST: Missing required fields', { address, hasTxHash: !!txHash, blockNumber, hasProfileSnapshot: !!profileSnapshot });
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    logger.info(`Anchor POST: Anchoring profile for ${address}`, { txHash, blockNumber });

    const localHash = secureHashProfile(profileSnapshot);

    const updated = await prisma.profile.update({
      where: { address },
      data: {
        lastAnchorTx: txHash,
        lastAnchorBlk: blockNumber,
        hashHex: localHash,
        score: computeReputation({
          handle: profileSnapshot.handle,
          bio: profileSnapshot.bio,
          links: profileSnapshot.links,
          skills: profileSnapshot.skills,
          lastAnchorBlk: blockNumber,
        } as any),
        version: { increment: 1 },
      },
    });

    logger.info(`Anchor POST: Successfully anchored profile for ${address}`, { hashHex: localHash });

    return NextResponse.json({ ok: true, profile: updated, verifiedHashHex: localHash });
  } catch (error: any) {
    logger.error('Anchor POST: Unexpected error', { error: error?.message, stack: error?.stack });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
