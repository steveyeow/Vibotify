"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface SaveToSpotifyProps {
  playlistId: string;
  spotifyId: string;
  type?: string;
}

export function SaveToSpotify({ playlistId, spotifyId, type = "playlist" }: SaveToSpotifyProps) {
  const { data: session } = useSession();
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    if (!session || loading || saved) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/playlists/${playlistId}/save`, {
        method: "POST",
      });
      if (res.ok) {
        setSaved(true);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <a
      href={`https://open.spotify.com/${type}/${spotifyId}`}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        if (session && !saved) {
          e.preventDefault();
          handleSave();
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97]",
        saved
          ? "bg-accent/15 text-accent border border-accent/25"
          : "bg-bg-elevated text-text-secondary border border-border-subtle hover:border-border hover:text-text-primary"
      )}
    >
      {saved ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Saved
        </>
      ) : loading ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
          </svg>
          Saving...
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
          </svg>
          Save to Spotify
        </>
      )}
    </a>
  );
}
