export interface SpotifyPlaylistInfo {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  spotifyUrl: string;
  ownerName: string | null;
}

export function extractPlaylistId(input: string): string | null {
  const urlMatch = input.match(
    /open\.spotify\.com\/playlist\/([a-zA-Z0-9]+)/
  );
  if (urlMatch) return urlMatch[1];

  const uriMatch = input.match(/spotify:playlist:([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];

  if (/^[a-zA-Z0-9]{22}$/.test(input.trim())) return input.trim();

  return null;
}

export async function getPlaylistViaOEmbed(
  spotifyUrl: string
): Promise<SpotifyPlaylistInfo | null> {
  const playlistId = extractPlaylistId(spotifyUrl);
  if (!playlistId) return null;

  const canonicalUrl = `https://open.spotify.com/playlist/${playlistId}`;

  try {
    const res = await fetch(
      `https://open.spotify.com/oembed?url=${encodeURIComponent(canonicalUrl)}`
    );

    if (!res.ok) {
      console.error("[Spotify] oEmbed error:", res.status);
      return null;
    }

    const data = await res.json();

    const thumbnailUrl: string | null = data.thumbnail_url || null;
    const hdImageUrl = thumbnailUrl
      ? thumbnailUrl.replace("ab67706c0000d72c", "ab67706c0000bebb")
      : null;

    return {
      id: playlistId,
      name: data.title || "Untitled Playlist",
      description: null,
      imageUrl: hdImageUrl,
      spotifyUrl: canonicalUrl,
      ownerName: null,
    };
  } catch (err) {
    console.error("[Spotify] oEmbed fetch failed:", err);
    return null;
  }
}
