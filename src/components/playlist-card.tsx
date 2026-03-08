"use client";

import Image from "next/image";
import Link from "next/link";

interface PlaylistCardProps {
  id: string;
  name: string;
  imageUrl: string | null;
  userName: string;
  userImage: string | null;
  userId: string;
  tags: string[];
  voteCount: number;
  commentCount: number;
  trackCount: number;
  vibeNote?: string | null;
}

export function PlaylistCard({
  id,
  name,
  imageUrl,
  userName,
  userImage,
  userId,
  tags,
  voteCount,
  commentCount,
}: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${id}`} className="group block rounded-lg p-3 transition-colors hover:bg-bg-elevated">
      {/* Cover art — square, rounded like Spotify */}
      <div className="relative aspect-square w-full overflow-hidden rounded-md bg-bg-active shadow-lg shadow-black/30">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-text-tertiary">
              <path d="M3 7l4 5-4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <rect x="10" y="15" width="5" height="2.5" rx="1.25" fill="currentColor" />
              <rect x="17" y="7" width="2.5" height="10" rx="1.25" fill="currentColor" />
              <rect x="21" y="4" width="2.5" height="16" rx="1.25" fill="currentColor" />
            </svg>
          </div>
        )}
        {/* Play button on hover */}
        <div className="absolute bottom-2 right-2 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-accent opacity-0 shadow-xl shadow-black/40 transition-all group-hover:translate-y-0 group-hover:opacity-100">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-text-inverse ml-0.5">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3">
        <h3 className="text-sm font-bold leading-snug line-clamp-1">
          {name}
        </h3>
        <div className="mt-1 flex items-center gap-1.5">
          <Link
            href={`/profile/${userId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 group/user"
          >
            {userImage ? (
              <Image src={userImage} alt="" width={18} height={18} className="rounded-full" />
            ) : (
              <div className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent">
                {userName[0]?.toUpperCase()}
              </div>
            )}
            <span className="text-[13px] text-text-secondary group-hover/user:text-text-primary transition-colors line-clamp-1">
              {userName}
            </span>
          </Link>
        </div>
        {tags.length > 0 && (
          <p className="mt-1 text-[11px] text-text-tertiary line-clamp-1">
            {tags.join(", ")}
          </p>
        )}
        {(voteCount > 0 || commentCount > 0) && (
          <div className="mt-1.5 flex items-center gap-3 text-[11px] text-text-tertiary">
            {voteCount > 0 && (
              <span className="flex items-center gap-0.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                {voteCount}
              </span>
            )}
            {commentCount > 0 && (
              <span className="flex items-center gap-0.5">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
                {commentCount}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
