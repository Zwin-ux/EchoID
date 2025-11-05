import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { computeReputation } from "@/lib/reputation";
import { sha256Hex, stableStringify } from "@/lib/hashing";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const address: string = body.address?.trim();
    const handle: string = body.handle?.trim();
    const bio: string | undefined = body.bio ?? undefined;
    const links: Record<string, string> | undefined = body.links ?? undefined;
    const skills: string[] | undefined = body.skills ?? undefined;

    if (!address || !handle) {
      return NextResponse.json({ error: "address and handle required" }, { status: 400 });
    }

    const base = { address, handle, bio, links, skills };
    const score = computeReputation(base as any);

    const saved = await prisma.profile.upsert({
      where: { address },
      update: { handle, bio, links, skills, score },
      create: { address, handle, bio, links, skills, score },
    });

    const precomputedHashHex = sha256Hex(stableStringify(base));
    return NextResponse.json({ profile: { ...saved, precomputedHashHex } });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "server error" }, { status: 500 });
  }
}
