"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

interface VoteButtonProps {
  playlistId: string;
  initialVoted: boolean;
  initialCount: number;
}

export function VoteButton({
  playlistId,
  initialVoted,
  initialCount,
}: VoteButtonProps) {
  const { data: session } = useSession();
  const [voted, setVoted] = useState(initialVoted);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleVote() {
    if (!session) return;
    if (loading) return;

    setLoading(true);
    setVoted(!voted);
    setCount(voted ? count - 1 : count + 1);

    try {
      const res = await fetch(`/api/playlists/${playlistId}/vote`, {
        method: "POST",
      });
      const data = await res.json();
      setVoted(data.voted);
      setCount(data.count);
    } catch {
      setVoted(voted);
      setCount(count);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleVote}
      disabled={!session}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-[0.97]",
        voted
          ? "bg-accent/15 text-accent border border-accent/25"
          : "bg-bg-elevated text-text-secondary border border-border-subtle hover:border-border hover:text-text-primary",
        !session && "opacity-50 cursor-not-allowed"
      )}
      title={!session ? "Sign in to vote" : undefined}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={voted ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 10v12" />
        <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
      </svg>
      {count}
    </button>
  );
}
