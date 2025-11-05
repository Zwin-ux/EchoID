import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET(req: NextRequest, { params }: { params: { address: string } }) {
  const onchainHash = req.nextUrl.searchParams.get("onchainHash");
  if (!onchainHash) return NextResponse.json({ error: "onchainHash required" }, { status: 400 });

  const profile = await prisma.profile.findUnique({ where: { address: params.address } });
  if (!profile) return NextResponse.json({ error: "not found" }, { status: 404 });

  const matches = profile.hashHex && profile.hashHex.toLowerCase() === onchainHash.toLowerCase();

  return NextResponse.json({
    address: params.address,
    storedHashHex: profile.hashHex ?? null,
    onchainHash,
    matches,
  });
}
