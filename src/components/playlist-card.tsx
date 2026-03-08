"use client";

import Image from "next/image";
import Link from "next/link";

interface Sharer {
  id: string;
  name: string | null;
  image: string | null;
}

interface PlaylistCardProps {
  id: string;
  name: string;
  imageUrl: string | null;
  sharers: Sharer[];
  voteCount: number;
  commentCount: number;
  sharerCount: number;
}

export function PlaylistCard({
  id,
  name,
  imageUrl,
  sharers,
  voteCount,
  commentCount,
  sharerCount,
}: PlaylistCardProps) {
  return (
    <Link href={`/playlist/${id}`} className="group block rounded-lg p-3 transition-colors hover:bg-bg-elevated">
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

        {/* Stats overlay — bottom-left on cover */}
        {(voteCount > 0 || commentCount > 0) && (
          <div className="absolute bottom-0 left-0 right-0 flex items-center gap-2.5 bg-gradient-to-t from-black/70 to-transparent px-2.5 pb-2 pt-6 text-[11px] font-medium text-white/90">
            {voteCount > 0 && (
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M7 10v12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                </svg>
                {voteCount}
              </span>
            )}
            {commentCount > 0 && (
              <span className="flex items-center gap-1">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
                </svg>
                {commentCount}
              </span>
            )}
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

        {/* Sharer avatars */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <div className="flex -space-x-1.5">
            {sharers.slice(0, 4).map((sharer) => (
              <Link
                key={sharer.id}
                href={`/profile/${sharer.id}`}
                onClick={(e) => e.stopPropagation()}
                title={sharer.name || "Anonymous"}
              >
                {sharer.image ? (
                  <Image
                    src={sharer.image}
                    alt=""
                    width={20}
                    height={20}
                    className="rounded-full ring-2 ring-[#121212]"
                  />
                ) : (
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/20 text-[9px] font-bold text-accent ring-2 ring-[#121212]">
                    {sharer.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
              </Link>
            ))}
          </div>
          {sharerCount > 4 && (
            <span className="text-[11px] text-text-tertiary">+{sharerCount - 4}</span>
          )}
          <span className="text-[12px] text-text-secondary line-clamp-1">
            {sharers[0]?.name || "Anonymous"}
            {sharerCount > 1 && ` +${sharerCount - 1}`}
          </span>
        </div>
      </div>
    </Link>
  );
}
