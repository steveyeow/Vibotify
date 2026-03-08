export interface SpotifyPlaylistInfo {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  spotifyUrl: string;
  ownerName: string | null;
}

export type SpotifyLinkType = "playlist" | "artist" | null;

export function detectSpotifyLinkType(input: string): SpotifyLinkType {
  if (/open\.spotify\.com\/playlist\/[a-zA-Z0-9]+/.test(input) || /spotify:playlist:/.test(input)) {
    return "playlist";
  }
  if (/open\.spotify\.com\/artist\/[a-zA-Z0-9]+/.test(input) || /spotify:artist:/.test(input)) {
    return "artist";
  }
  return null;
}

export function extractSpotifyId(input: string): string | null {
  const urlMatch = input.match(
    /open\.spotify\.com\/(?:playlist|artist)\/([a-zA-Z0-9]+)/
  );
  if (urlMatch) return urlMatch[1];

  const uriMatch = input.match(/spotify:(?:playlist|artist):([a-zA-Z0-9]+)/);
  if (uriMatch) return uriMatch[1];

  return null;
}

/** @deprecated Use extractSpotifyId instead */
export function extractPlaylistId(input: string): string | null {
  return extractSpotifyId(input);
}

export async function getPlaylistViaOEmbed(
  spotifyUrl: string
): Promise<SpotifyPlaylistInfo | null> {
  const linkType = detectSpotifyLinkType(spotifyUrl);
  const id = extractSpotifyId(spotifyUrl);
  if (!id || !linkType) return null;

  const canonicalUrl = `https://open.spotify.com/${linkType}/${id}`;

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
    let hdImageUrl = thumbnailUrl;
    if (thumbnailUrl) {
      hdImageUrl = thumbnailUrl
        .replace("ab67706c0000d72c", "ab67706c0000bebb")
        .replace("ab6761610000d72c", "ab6761610000e5eb");
    }

    return {
      id,
      name: data.title || (linkType === "artist" ? "Unknown Artist" : "Untitled Playlist"),
      description: null,
      imageUrl: hdImageUrl,
      spotifyUrl: canonicalUrl,
      ownerName: linkType === "artist" ? data.title : null,
    };
  } catch (err) {
    console.error("[Spotify] oEmbed fetch failed:", err);
    return null;
  }
}
