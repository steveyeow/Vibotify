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

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(getRateLimitKey(req, "spotify:import", session.user.id), RATE_LIMITS.spotify);
  if (limited) return limited;

  const token = await getUserAccessToken(session.user.id);
  if (!token) {
    return NextResponse.json({ error: "No Spotify access token" }, { status: 401 });
  }

  const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=50", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("[Spotify] Import playlists error:", res.status, errorText);
    return NextResponse.json(
      { error: "Could not load playlists. Your Spotify app may require Premium." },
      { status: res.status }
    );
  }

  const data = await res.json();

  return NextResponse.json(
    data.items.map((p: Record<string, unknown>) => {
      const playlist = p as {
        id: string;
        name: string;
        description: string | null;
        images: { url: string }[];
        tracks: { total: number };
        external_urls: { spotify: string };
        owner: { display_name: string };
        snapshot_id: string;
      };
      return {
        id: playlist.id,
        name: playlist.name,
        description: playlist.description,
        imageUrl: playlist.images?.[0]?.url || null,
        trackCount: playlist.tracks.total,
        spotifyUrl: playlist.external_urls.spotify,
        ownerName: playlist.owner.display_name,
        snapshotId: playlist.snapshot_id,
      };
    })
  );
}
