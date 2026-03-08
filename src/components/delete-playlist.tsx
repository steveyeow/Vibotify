"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeletePlaylistProps {
  playlistId: string;
  isOnlySharer: boolean;
}

export function DeletePlaylist({ playlistId, isOnlySharer }: DeletePlaylistProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.removed === "playlist") {
          router.push("/explore");
        } else {
          router.refresh();
        }
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-tertiary">
          {isOnlySharer ? "Delete playlist?" : "Remove your share?"}
        </span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="rounded-full bg-danger/15 px-3 py-1.5 text-xs font-medium text-danger border border-danger/25 transition-colors hover:bg-danger/25"
        >
          {loading ? "..." : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="rounded-full bg-bg-elevated px-3 py-1.5 text-xs font-medium text-text-secondary border border-border-subtle transition-colors hover:bg-bg-hover"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium text-text-tertiary border border-border-subtle transition-colors hover:text-danger hover:border-danger/30 hover:bg-danger/5"
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
      </svg>
      {isOnlySharer ? "Delete" : "Remove my share"}
    </button>
  );
}
