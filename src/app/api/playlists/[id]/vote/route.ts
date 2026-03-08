import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const existing = await prisma.vote.findUnique({
    where: {
      userId_playlistId: {
        userId: session.user.id,
        playlistId: id,
      },
    },
  });

  if (existing) {
    await prisma.vote.delete({ where: { id: existing.id } });
    const count = await prisma.vote.count({ where: { playlistId: id } });
    return NextResponse.json({ voted: false, count });
  }

  await prisma.vote.create({
    data: {
      userId: session.user.id,
      playlistId: id,
    },
  });

  const count = await prisma.vote.count({ where: { playlistId: id } });
  return NextResponse.json({ voted: true, count });
}
