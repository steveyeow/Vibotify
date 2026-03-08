import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ playlists: [], following: [] });
  }

  const [votedPlaylists, following] = await Promise.all([
    prisma.vote.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        playlist: {
          select: {
            id: true,
            name: true,
            imageUrl: true,
            user: { select: { name: true } },
          },
        },
      },
    }),
    prisma.follow.findMany({
      where: { followerId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      include: {
        following: {
          select: { id: true, name: true, image: true },
        },
      },
    }),
  ]);

  const myPlaylists = await prisma.sharedPlaylist.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: { id: true, name: true, imageUrl: true },
  });

  return NextResponse.json({
    myPlaylists: myPlaylists.map((p) => ({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      type: "playlist" as const,
    })),
    playlists: votedPlaylists.map((v) => ({
      id: v.playlist.id,
      name: v.playlist.name,
      imageUrl: v.playlist.imageUrl,
      owner: v.playlist.user.name,
      type: "playlist" as const,
    })),
    following: following.map((f) => ({
      id: f.following.id,
      name: f.following.name,
      image: f.following.image,
      type: "user" as const,
    })),
  });
}
