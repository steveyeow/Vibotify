import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(getRateLimitKey(req, "playlists:delete", session.user.id), RATE_LIMITS.write);
  if (limited) return limited;

  const { id } = await params;

  const playlist = await prisma.sharedPlaylist.findUnique({
    where: { id },
    include: { sharers: true },
  });

  if (!playlist) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
  }

  const isOriginalPoster = playlist.userId === session.user.id;
  const isSharer = playlist.sharers.some((s) => s.userId === session.user.id);

  if (!isOriginalPoster && !isSharer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (isSharer && !isOriginalPoster) {
    await prisma.playlistSharer.delete({
      where: {
        userId_playlistId: {
          userId: session.user.id,
          playlistId: id,
        },
      },
    });
    return NextResponse.json({ removed: "sharer" });
  }

  // Original poster: if other sharers exist, transfer ownership to the next sharer
  const otherSharers = playlist.sharers.filter((s) => s.userId !== session.user.id);

  if (otherSharers.length > 0) {
    await prisma.$transaction([
      prisma.playlistSharer.delete({
        where: {
          userId_playlistId: {
            userId: session.user.id,
            playlistId: id,
          },
        },
      }),
      prisma.sharedPlaylist.update({
        where: { id },
        data: { userId: otherSharers[0].userId },
      }),
    ]);
    return NextResponse.json({ removed: "sharer", transferred: true });
  }

  // Only sharer — delete the entire playlist
  await prisma.sharedPlaylist.delete({ where: { id } });
  return NextResponse.json({ removed: "playlist" });
}
