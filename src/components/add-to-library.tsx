"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface AddToLibraryProps {
  playlistId: string;
  initialVoted: boolean;
  initialCount: number;
}

export function AddToLibrary({
  playlistId,
  initialVoted,
  initialCount,
}: AddToLibraryProps) {
  const { data: session } = useSession();
  const [added, setAdded] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    if (!session || loading) return;

    setLoading(true);
    setAdded(!added);
    setCount(added ? count - 1 : count + 1);

    try {
      const res = await fetch(`/api/playlists/${playlistId}/vote`, {
        method: "POST",
      });
      const data = await res.json();
      setAdded(data.voted);
      setCount(data.count);
    } catch {
      setAdded(added);
      setCount(count);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={!session}
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all active:scale-[0.97]",
        added
          ? "bg-accent/15 text-accent border border-accent/25"
          : "bg-bg-elevated text-text-secondary border border-border-subtle hover:border-border hover:text-text-primary",
        !session && "opacity-50 cursor-not-allowed"
      )}
      title={!session ? "Sign in to add to library" : added ? "Remove from library" : "Add to library"}
    >
      {added ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14" /><path d="M5 12h14" />
        </svg>
      )}
      {added ? "In Library" : "Add to Library"}
      {count > 0 && (
        <span className={cn(
          "text-xs",
          added ? "text-accent/70" : "text-text-tertiary"
        )}>
          {count}
        </span>
      )}
    </button>
  );
}
