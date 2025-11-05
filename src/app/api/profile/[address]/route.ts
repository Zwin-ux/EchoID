import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/server/db";

export async function GET(_req: NextRequest, { params }: { params: { address: string } }) {
  const { address } = params;
  if (!address) return NextResponse.json({ error: "address required" }, { status: 400 });
  const profile = await prisma.profile.findUnique({ where: { address } });
  if (!profile) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ profile });
}
