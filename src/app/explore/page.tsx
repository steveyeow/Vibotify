import { prisma } from "@/lib/prisma";
import { PlaylistCard } from "@/components/playlist-card";
import Link from "next/link";
import { VIBE_TAGS } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ tag?: string; sort?: string; page?: string }>;
}

export default async function ExplorePage({ searchParams }: Props) {
  const params = await searchParams;
  const tag = params.tag;
  const sort = params.sort || "recent";
  const page = parseInt(params.page || "1");
  const limit = 24;
  const skip = (page - 1) * limit;

  const where = tag ? { tags: { has: tag } } : {};

  const orderBy =
    sort === "popular"
      ? { votes: { _count: "desc" as const } }
      : { createdAt: "desc" as const };

  const [playlists, total] = await Promise.all([
    prisma.sharedPlaylist.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      include: {
        user: { select: { id: true, name: true, image: true } },
        _count: { select: { votes: true, comments: true } },
      },
    }),
    prisma.sharedPlaylist.count({ where }),
  ]);

  const pages = Math.ceil(total / limit);

  function buildUrl(overrides: Record<string, string | undefined>) {
    const p = new URLSearchParams();
    const merged = { tag, sort, page: String(page), ...overrides };
    for (const [k, v] of Object.entries(merged)) {
      if (v && v !== "undefined") p.set(k, v);
    }
    return `/explore?${p.toString()}`;
  }

  return (
    <div className="animate-in">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Explore</h1>
      </div>

      {/* Filters — single scrollable row */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <Link
          href={buildUrl({ sort: "recent", tag: undefined, page: "1" })}
          className={sort === "recent" && !tag ? "tag-active" : "tag"}
        >
          Recent
        </Link>
        <Link
          href={buildUrl({ sort: "popular", tag: undefined, page: "1" })}
          className={sort === "popular" && !tag ? "tag-active" : "tag"}
        >
          Popular
        </Link>
        <span className="mx-1 h-4 w-px shrink-0 bg-border-subtle" />
        {VIBE_TAGS.map((t) => (
          <Link
            key={t}
            href={buildUrl({ tag: t, sort: "recent", page: "1" })}
            className={tag === t ? "tag-active" : "tag"}
          >
            {t}
          </Link>
        ))}
      </div>

      {/* Results */}
      {playlists.length > 0 ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {playlists.map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                id={playlist.id}
                name={playlist.name}
                imageUrl={playlist.imageUrl}
                userName={playlist.user.name || "Anonymous"}
                userImage={playlist.user.image}
                userId={playlist.user.id}
                tags={playlist.tags}
                voteCount={playlist._count.votes}
                commentCount={playlist._count.comments}
                trackCount={playlist.trackCount}
                vibeNote={playlist.vibeNote}
              />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {page > 1 && (
                <Link
                  href={buildUrl({ page: String(page - 1) })}
                  className="btn-ghost"
                >
                  ← Previous
                </Link>
              )}
              <span className="px-4 text-sm text-text-tertiary">
                Page {page} of {pages}
              </span>
              {page < pages && (
                <Link
                  href={buildUrl({ page: String(page + 1) })}
                  className="btn-ghost"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="py-20 text-center">
          <p className="text-text-secondary">
            No playlists found{tag ? ` for "${tag}"` : ""}.
          </p>
          {tag && (
            <Link href="/explore" className="btn-ghost mt-4 inline-flex">
              Clear filters
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
