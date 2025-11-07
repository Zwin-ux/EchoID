import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { computeReputation } from "@/lib/reputation";
import { sha256Hex, stableStringify } from "@/lib/hashing";
import logger from "@/lib/logger";
import { generalRateLimit } from "@/lib/rateLimit";

export async function GET(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = generalRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50); // Max 50 per page
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc';

    const skip = (page - 1) * limit;

    logger.info('Profile GET: Fetching profiles list', { page, limit, sortBy, sortOrder });

    const [profiles, total] = await Promise.all([
      prisma.profile.findMany({
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder
        },
        select: {
          id: true,
          address: true,
          handle: true,
          bio: true,
          links: true,
          skills: true,
          score: true,
          updatedAt: true,
          createdAt: true
        }
      }),
      prisma.profile.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    logger.info('Profile GET: Successfully fetched profiles', { count: profiles.length, total, page, totalPages });

    return NextResponse.json({
      profiles,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error: any) {
    logger.error('Profile GET: Unexpected error', { error: error?.message });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = generalRateLimit(req);
  if (rateLimitResult) return rateLimitResult;

  try {
    const body = await req.json();
    const address: string = body.address?.trim();
    const handle: string = body.handle?.trim();
    const bio: string | undefined = body.bio ?? undefined;
    const links: Record<string, string> | undefined = body.links ?? undefined;
    const skills: string[] | undefined = body.skills ?? undefined;

    if (!address || !handle) {
      logger.warn('Profile POST: Missing required fields', { hasAddress: !!address, hasHandle: !!handle });
      return NextResponse.json({ error: "address and handle required" }, { status: 400 });
    }

    logger.info(`Profile POST: Creating/updating profile for ${address}`);

    const base = { address, handle, bio, links, skills };
    const score = computeReputation(base as any);

    const saved = await prisma.profile.upsert({
      where: { address },
      update: { handle, bio, links, skills, score },
      create: { address, handle, bio, links, skills, score },
    });

    const precomputedHashHex = sha256Hex(stableStringify(base));

    logger.info(`Profile POST: Successfully saved profile for ${address}`);

    return NextResponse.json({ profile: { ...saved, precomputedHashHex } });
  } catch (error: any) {
    logger.error('Profile POST: Unexpected error', { error: error?.message });
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
