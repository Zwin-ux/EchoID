import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import logger from "@/lib/server-logger";
import { redisCache, cacheKeys, CACHE_TTL } from "@/lib/redis";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;

    if (!address) {
      logger.warn('Profile GET: Missing address parameter');
      return NextResponse.json({ error: "address required" }, { status: 400 });
    }

    const cacheKey = cacheKeys.profile(address);
    logger.info(`Profile GET: Fetching profile for ${address}`);

    // Try cache first
    const cachedProfile = await redisCache.get(cacheKey);
    if (cachedProfile) {
      logger.info(`Profile GET: Cache hit for ${address}`);
      return NextResponse.json({ profile: JSON.parse(cachedProfile) });
    }

    const profile = await prisma.profile.findUnique({ where: { address } });

    if (!profile) {
      logger.info(`Profile GET: Profile not found for ${address}`);
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    // Cache the result
    await redisCache.set(cacheKey, JSON.stringify(profile), CACHE_TTL.PROFILE);

    logger.info(`Profile GET: Successfully retrieved profile for ${address}`);
    return NextResponse.json({ profile });
  } catch (error) {
    logger.error('Profile GET: Unexpected error', { error, address: await params.then(p => p.address) });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
