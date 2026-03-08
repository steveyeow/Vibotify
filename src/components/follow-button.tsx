"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface FollowButtonProps {
  userId: string;
  initialFollowing: boolean;
}

export function FollowButton({ userId, initialFollowing }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);

  async function handleFollow() {
    if (loading) return;
    setLoading(true);
    setFollowing(!following);

    try {
      const res = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
      });
      const data = await res.json();
      setFollowing(data.following);
    } catch {
      setFollowing(following);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleFollow}
      className={cn(
        "rounded-full px-4 py-1.5 text-sm font-medium transition-all active:scale-[0.97]",
        following
          ? "bg-bg-elevated text-text-secondary border border-border hover:bg-bg-hover"
          : "bg-accent text-text-inverse hover:bg-accent-hover"
      )}
    >
      {following ? "Following" : "Follow"}
    </button>
  );
}
