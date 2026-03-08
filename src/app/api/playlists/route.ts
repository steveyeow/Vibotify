import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const limited = rateLimit(getRateLimitKey(req, "playlists:get"), RATE_LIMITS.read);
  if (limited) return limited;
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag");
  const sort = searchParams.get("sort") || "recent";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 24;
  const skip = (page - 1) * limit;

  const where = tag
    ? { tags: { has: tag } }
    : {};

  const orderBy =
    sort === "popular"
      ? { votes: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [playlists, total] = await Promise.all([
    prisma.sharedPlaylist.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { votes: true, comments: true } },
      },
    }),
    prisma.sharedPlaylist.count({ where }),
  ]);

  return NextResponse.json({
    playlists: playlists.map((p) => ({
      id: p.id,
      name: p.name,
      imageUrl: p.imageUrl,
      spotifyUrl: p.spotifyUrl,
      trackCount: p.trackCount,
      tags: p.tags,
      vibeNote: p.vibeNote,
      createdAt: p.createdAt,
      user: p.user,
      voteCount: p._count.votes,
      commentCount: p._count.comments,
    })),
    total,
    pages: Math.ceil(total / limit),
  });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(getRateLimitKey(req, "playlists:post", session.user.id), RATE_LIMITS.write);
  if (limited) return limited;

  const body = await req.json();
  const { spotifyId, name, description, imageUrl, spotifyUrl, trackCount, totalDurationMs, ownerName, snapshotId, tags, vibeNote } = body;

  if (!spotifyId || !name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const existing = await prisma.sharedPlaylist.findUnique({
    where: { spotifyId },
  });

  if (existing) {
    return NextResponse.json(
      { error: "This playlist has already been shared" },
      { status: 409 }
    );
  }

  const playlist = await prisma.sharedPlaylist.create({
    data: {
      spotifyId,
      name,
      description,
      imageUrl,
      spotifyUrl,
      trackCount: trackCount || 0,
      totalDurationMs: totalDurationMs || 0,
      ownerName,
      snapshotId,
      tags: tags || [],
      vibeNote,
      userId: session.user.id,
    },
  });

  return NextResponse.json(playlist, { status: 201 });
}
