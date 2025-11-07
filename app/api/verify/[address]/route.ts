import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import logger from "@/lib/logger";

export async function GET(req: NextRequest, { params }: { params: Promise<{ address: string }> }) {
  try {
    const { address } = await params;
    const onchainHash = req.nextUrl.searchParams.get("onchainHash");

    if (!onchainHash) {
      logger.warn('Verify GET: Missing onchainHash parameter', { address });
      return NextResponse.json({ error: "onchainHash required" }, { status: 400 });
    }

    logger.info(`Verify GET: Verifying hash for ${address}`);

    const profile = await prisma.profile.findUnique({ where: { address } });

    if (!profile) {
      logger.info(`Verify GET: Profile not found for ${address}`);
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }

    const matches = profile.hashHex && profile.hashHex.toLowerCase() === onchainHash.toLowerCase();

    logger.info(`Verify GET: Verification result for ${address}`, { matches });

    return NextResponse.json({
      address,
      storedHashHex: profile.hashHex ?? null,
      onchainHash,
      matches,
    });
  } catch (error) {
    logger.error('Verify GET: Unexpected error', { error, address: await params.then(p => p.address) });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
