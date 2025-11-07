import { NextRequest, NextResponse } from "next/server";
import { attest } from "@/lib/polkadot";
import logger from "@/lib/server-logger";
import { redisCache, cacheKeys } from "@/lib/redis";

export async function POST(req: NextRequest) {
  // This is a server-side only route
  if (typeof window !== 'undefined') {
    return NextResponse.json({ error: "This endpoint is not available in browser" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { account, subject, attestationType, score, comment } = body;

    if (!account || !subject || !attestationType || typeof score !== 'number') {
      logger.warn('Attest POST: Missing required parameters', { account: !!account, subject, attestationType, score });
      return NextResponse.json({ error: "account, subject, attestationType, and score are required" }, { status: 400 });
    }

    logger.info(`Attest POST: Creating attestation for ${subject} with type ${attestationType}`);

    const result = await attest(account, subject, attestationType, score, comment || "");

    // Invalidate cache for the subject's attestations
    const cacheKey = cacheKeys.attestations(subject);
    await redisCache.del(cacheKey);
    logger.info(`Attest POST: Invalidated cache for ${subject}`);

    logger.info(`Attest POST: Successfully created attestation for ${subject}`);
    return NextResponse.json({ success: true, result });
  } catch (error) {
    logger.error('Attest POST: Unexpected error', { error, body: await req.json().catch(() => ({})) });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}