import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { extractPlaylistId, getPlaylistViaOEmbed } from "@/lib/spotify";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const spotifyUrl = req.nextUrl.searchParams.get("url");
  if (!spotifyUrl) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  const playlistId = extractPlaylistId(spotifyUrl);
  if (!playlistId) {
    return NextResponse.json({ error: "Invalid Spotify playlist URL" }, { status: 400 });
  }

  const playlist = await getPlaylistViaOEmbed(spotifyUrl);
  if (!playlist) {
    return NextResponse.json(
      { error: "Could not fetch playlist. Please check the URL and try again." },
      { status: 404 }
    );
  }

  return NextResponse.json({
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    imageUrl: playlist.imageUrl,
    spotifyUrl: playlist.spotifyUrl,
    ownerName: playlist.ownerName,
    trackCount: 0,
    snapshotId: null,
    totalDurationMs: 0,
  });
}
