import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractSpotifyId, detectSpotifyLinkType, getPlaylistViaOEmbed } from "@/lib/spotify";
import { rateLimit, getRateLimitKey, RATE_LIMITS } from "@/lib/rate-limit";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const limited = rateLimit(getRateLimitKey(req, "spotify:lookup", session.user.id), RATE_LIMITS.spotify);
  if (limited) return limited;

  const spotifyUrl = req.nextUrl.searchParams.get("url");
  if (!spotifyUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const linkType = detectSpotifyLinkType(spotifyUrl);
  const spotifyId = extractSpotifyId(spotifyUrl);

  if (!spotifyId || !linkType) {
    return NextResponse.json(
      { error: "Please paste a Spotify playlist, album, or artist link" },
      { status: 400 }
    );
  }

  const result = await getPlaylistViaOEmbed(spotifyUrl);
  if (!result) {
    return NextResponse.json(
      { error: "Could not fetch info. Please check the URL and try again." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: result.id,
    name: result.name,
    description: result.description,
    imageUrl: result.imageUrl,
    spotifyUrl: result.spotifyUrl,
    ownerName: result.ownerName,
    type: linkType,
    trackCount: 0,
    snapshotId: null,
    totalDurationMs: 0,
  });
}
