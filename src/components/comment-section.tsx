"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

export function CommentSection({ playlistId }: { playlistId: string }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetch(`/api/playlists/${playlistId}/comments`)
      .then((res) => res.json())
      .then(setComments)
      .finally(() => setFetching(false));
  }, [playlistId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || loading) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/playlists/${playlistId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        const comment = await res.json();
        setComments([comment, ...comments]);
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      {session && (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-shrink-0">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt=""
                width={36}
                height={36}
                className="rounded-full"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
                {session.user.name?.[0]?.toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts on this playlist..."
              className="textarea min-h-[80px]"
              rows={2}
            />
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={!content.trim() || loading}
                className="btn-primary text-xs px-4 py-1.5 disabled:opacity-50"
              >
                {loading ? "Posting..." : "Comment"}
              </button>
            </div>
          </div>
        </form>
      )}

      {fetching ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-3 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-bg-hover" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 rounded bg-bg-hover" />
                <div className="h-4 w-full rounded bg-bg-hover" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="space-y-5">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <Link
                href={`/profile/${comment.user.id}`}
                className="flex-shrink-0"
              >
                {comment.user.image ? (
                  <Image
                    src={comment.user.image}
                    alt=""
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
                    {comment.user.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </Link>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/profile/${comment.user.id}`}
                    className="text-sm font-medium hover:text-accent transition-colors"
                  >
                    {comment.user.name}
                  </Link>
                  <span className="text-xs text-text-tertiary">
                    {timeAgo(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="mt-1 text-sm text-text-secondary leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-tertiary">
          No comments yet. {session ? "Be the first!" : "Sign in to comment."}
        </p>
      )}
    </div>
  );
}
