import { NextRequest, NextResponse } from "next/server";
import { getAttestations } from "@/lib/polkadot";
import logger from "@/lib/server-logger";
import { redisCache, cacheKeys, CACHE_TTL } from "@/lib/redis";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  // Ensure this only runs on server
  if (typeof window !== 'undefined') {
    return NextResponse.json({ error: "This endpoint is not available in browser" }, { status: 400 });
  }

  try {
    const { address } = await params;

    if (!address) {
      logger.warn('Attestations GET: Missing address parameter');
      return NextResponse.json({ error: "address required" }, { status: 400 });
    }

    const cacheKey = cacheKeys.attestations(address);
    logger.info(`Attestations GET: Fetching attestations for ${address}`);

    // Try cache first
    const cachedAttestations = await redisCache.get(cacheKey);
    if (cachedAttestations) {
      logger.info(`Attestations GET: Cache hit for ${address}`);
      return NextResponse.json({ attestations: JSON.parse(cachedAttestations) });
    }

    const attestations = await getAttestations(address);

    // Cache the result
    await redisCache.set(cacheKey, JSON.stringify(attestations), CACHE_TTL.ATTESTATIONS);

    logger.info(`Attestations GET: Successfully retrieved ${attestations.length} attestations for ${address}`);
    return NextResponse.json({ attestations });
  } catch (error) {
    logger.error('Attestations GET: Unexpected error', { error, address: await params.then(p => p.address) });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}