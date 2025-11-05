import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";
import { sha256Hex, stableStringify } from "@/lib/hashing";
import { computeReputation } from "@/lib/reputation";

export async function POST(req: NextRequest) {
  try {
    const { address, txHash, blockNumber, profileSnapshot } = await req.json();
    if (!address || !txHash || typeof blockNumber !== "number" || !profileSnapshot) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    const localHash = sha256Hex(stableStringify(profileSnapshot));

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

    return NextResponse.json({ ok: true, profile: updated, verifiedHashHex: localHash });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "server error" }, { status: 500 });
  }
}
