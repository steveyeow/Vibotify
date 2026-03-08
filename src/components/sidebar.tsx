"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface LibraryPlaylist {
  id: string;
  name: string;
  imageUrl: string | null;
  owner?: string;
  type: "playlist";
}

interface LibraryUser {
  id: string;
  name: string | null;
  image: string | null;
  type: "user";
}

type LibraryItem = LibraryPlaylist | LibraryUser;

type FilterTab = "all" | "playlists" | "coders";

export function Sidebar() {
  const { data: session } = useSession();
  const [filter, setFilter] = useState<FilterTab>("all");
  const [myPlaylists, setMyPlaylists] = useState<LibraryPlaylist[]>([]);
  const [playlists, setPlaylists] = useState<LibraryPlaylist[]>([]);
  const [following, setFollowing] = useState<LibraryUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) {
      setLoading(false);
      return;
    }
    fetch("/api/me/library")
      .then((res) => res.json())
      .then((data) => {
        setMyPlaylists(data.myPlaylists || []);
        setPlaylists(data.playlists || []);
        setFollowing(data.following || []);
      })
      .finally(() => setLoading(false));
  }, [session]);

  const items: LibraryItem[] = (() => {
    switch (filter) {
      case "playlists":
        return [...myPlaylists, ...playlists];
      case "coders":
        return following;
      default:
        return [...myPlaylists, ...playlists, ...following];
    }
  })();

  return (
    <aside className="hidden lg:flex lg:w-[280px] xl:w-[320px] flex-shrink-0 flex-col rounded-lg bg-[#121212] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 text-text-secondary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <span className="text-sm font-bold">Your Library</span>
        </div>
        {session && (
          <Link
            href="/share"
            className="flex h-7 w-7 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
            title="Share playlist"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14" /><path d="M12 5v14" />
            </svg>
          </Link>
        )}
      </div>

      {/* Filter tabs */}
      {session && (myPlaylists.length + playlists.length + following.length > 0 || filter !== "all") && (
        <div className="flex gap-1.5 px-4 py-2">
          {(["all", "playlists", "coders"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={
                filter === tab
                  ? "rounded-full bg-white px-3 py-1 text-[11px] font-bold text-black"
                  : "rounded-full bg-[#232323] px-3 py-1 text-[11px] font-bold text-text-secondary hover:bg-[#2a2a2a] hover:text-text-primary transition-colors"
              }
            >
              {tab === "all" ? "All" : tab === "playlists" ? "Playlists" : "Coders"}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto px-2 py-2 scrollbar-thin">
        {!session ? (
          <div className="space-y-1 px-1 py-2">
            <Link
              href="/explore"
              className="flex items-center gap-3 rounded-md p-2.5 transition-colors hover:bg-white/5"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-[#232323]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Discover playlists</p>
                <p className="text-[11px] text-text-tertiary">Find your next coding vibe</p>
              </div>
            </Link>
            <Link
              href="/explore?sort=popular"
              className="flex items-center gap-3 rounded-md p-2.5 transition-colors hover:bg-white/5"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-[#232323]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium">Discover coders</p>
                <p className="text-[11px] text-text-tertiary">See what others vibe to</p>
              </div>
            </Link>
          </div>
        ) : loading ? (
          <div className="space-y-1 px-1">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center gap-3 rounded-md p-2 animate-pulse">
                <div className="h-10 w-10 rounded bg-[#232323]" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3 w-24 rounded bg-[#232323]" />
                  <div className="h-2.5 w-16 rounded bg-[#232323]" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="space-y-0.5">
            {items.map((item) =>
              item.type === "playlist" ? (
                <Link
                  key={`pl-${item.id}`}
                  href={`/playlist/${item.id}`}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-white/5"
                >
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded bg-[#232323]">
                    {(item as LibraryPlaylist).imageUrl ? (
                      <Image
                        src={(item as LibraryPlaylist).imageUrl!}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-text-tertiary">
                          <path d="M3 7l4 5-4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <rect x="10" y="15" width="5" height="2.5" rx="1.25" fill="currentColor" />
                          <rect x="17" y="7" width="2.5" height="10" rx="1.25" fill="currentColor" />
                          <rect x="21" y="4" width="2.5" height="16" rx="1.25" fill="currentColor" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-text-tertiary truncate">
                      Playlist{(item as LibraryPlaylist).owner ? ` · ${(item as LibraryPlaylist).owner}` : ""}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link
                  key={`user-${item.id}`}
                  href={`/profile/${item.id}`}
                  className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-white/5"
                >
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-[#232323]">
                    {(item as LibraryUser).image ? (
                      <Image
                        src={(item as LibraryUser).image!}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs font-bold text-text-tertiary">
                        {(item as LibraryUser).name?.[0]?.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-[11px] text-text-tertiary">Developer</p>
                  </div>
                </Link>
              )
            )}
          </div>
        ) : (
          <div className="px-3 py-6 text-center">
            <p className="text-xs text-text-tertiary">
              Vote on playlists and follow coders to build your library.
            </p>
          </div>
        )}
      </div>
    </aside>
  );
}
