import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { rateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit";

async function getUserAccessToken(userId: string): Promise<string | null> {
  const account = await prisma.account.findFirst({
    where: { userId, provider: "spotify" },
  });

  if (!account?.access_token || !account.refresh_token) return null;

  if (account.expires_at && account.expires_at * 1000 < Date.now()) {
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from(
          `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: account.refresh_token,
      }),
    });

    const data = await res.json();
    if (!res.ok) return null;

    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: data.access_token,
        expires_at: Math.floor(Date.now() / 1000) + data.expires_in,
        refresh_token: data.refresh_token ?? account.refresh_token,
      },
    });

    return data.access_token;
  }

  return account.access_token;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(getRateLimitKey(req, "save", session.user.id), RATE_LIMITS.spotify);
  if (limited) return limited;

  const { id } = await params;

  const playlist = await prisma.sharedPlaylist.findUnique({
    where: { id },
  });

  if (!playlist) {
    return NextResponse.json({ error: "Playlist not found" }, { status: 404 });
  }

  const token = await getUserAccessToken(session.user.id);
  if (!token) {
    return NextResponse.json({ error: "No Spotify access" }, { status: 401 });
  }

  let res: Response;

  if (playlist.type === "album") {
    res = await fetch(
      `https://api.spotify.com/v1/me/albums`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: [playlist.spotifyId] }),
      }
    );
  } else {
    res = await fetch(
      `https://api.spotify.com/v1/playlists/${playlist.spotifyId}/followers`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ public: false }),
      }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to save to Spotify" },
      { status: 500 }
    );
  }

  return NextResponse.json({ saved: true });
}
