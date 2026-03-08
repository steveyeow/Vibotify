import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import Image from "next/image";
import Link from "next/link";
import { formatTotalDuration, timeAgo } from "@/lib/utils";
import { AddToLibrary } from "@/components/add-to-library";
import { SaveToSpotify } from "@/components/save-to-spotify";
import { CommentSection } from "@/components/comment-section";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PlaylistPage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const playlist = await prisma.sharedPlaylist.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, image: true } },
      sharers: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { votes: true, comments: true } },
    },
  });

  if (!playlist) notFound();

  const hasVoted = session?.user?.id
    ? !!(await prisma.vote.findUnique({
        where: {
          userId_playlistId: {
            userId: session.user.id,
            playlistId: id,
          },
        },
      }))
    : false;

  const allSharers = playlist.sharers.length > 0
    ? playlist.sharers
    : [{ user: playlist.user, vibeNote: playlist.vibeNote, createdAt: playlist.createdAt }];

  return (
    <div className="animate-in">
      <div className="mb-8">
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back to explore
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
        {/* Sidebar */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-border-subtle">
            {playlist.imageUrl ? (
              <Image
                src={playlist.imageUrl}
                alt={playlist.name}
                width={340}
                height={340}
                className="aspect-square w-full object-cover"
              />
            ) : (
              <div className="flex aspect-square items-center justify-center bg-bg-elevated">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="text-text-tertiary">
                  <path d="M3 7l4 5-4 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="10" y="15" width="5" height="2.5" rx="1.25" fill="currentColor" />
                  <rect x="17" y="7" width="2.5" height="10" rx="1.25" fill="currentColor" />
                  <rect x="21" y="4" width="2.5" height="16" rx="1.25" fill="currentColor" />
                </svg>
              </div>
            )}
          </div>

          <div className="mt-5 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <AddToLibrary
                playlistId={id}
                initialVoted={hasVoted}
                initialCount={playlist._count.votes}
              />
              <SaveToSpotify playlistId={id} spotifyId={playlist.spotifyId} type={playlist.type} />
              <a
                href={playlist.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost text-xs"
              >
                Open in Spotify ↗
              </a>
            </div>

            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span>{playlist.trackCount} tracks</span>
              <span className="h-1 w-1 rounded-full bg-text-tertiary" />
              <span>{formatTotalDuration(playlist.totalDurationMs)}</span>
            </div>

            {playlist.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {playlist.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/explore?tag=${encodeURIComponent(tag)}`}
                    className="tag"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Sharers */}
            <div className="space-y-2">
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">
                Shared by
              </p>
              {allSharers.map((sharer, i) => (
                <Link
                  key={i}
                  href={`/profile/${sharer.user.id}`}
                  className="flex items-center gap-2.5 rounded-xl border border-border-subtle p-3 transition-colors hover:bg-bg-hover"
                >
                  {sharer.user.image ? (
                    <Image
                      src={sharer.user.image}
                      alt=""
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-sm font-medium text-accent">
                      {sharer.user.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{sharer.user.name}</p>
                    {sharer.vibeNote && (
                      <p className="text-xs text-text-tertiary truncate italic">
                        &ldquo;{sharer.vibeNote}&rdquo;
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Main content */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {playlist.name}
          </h1>

          {playlist.description && (
            <p className="mt-3 text-sm text-text-tertiary">
              {playlist.description}
            </p>
          )}

          {/* Spotify Embed */}
          <div className="mt-8 overflow-hidden rounded-xl">
            <iframe
              src={`https://open.spotify.com/embed/${playlist.type || "playlist"}/${playlist.spotifyId}?utm_source=generator&theme=0`}
              width="100%"
              height="480"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              className="rounded-xl border-0"
              style={{ borderRadius: "12px" }}
            />
          </div>

          {/* Comments */}
          <div className="mt-10">
            <h2 className="mb-6 text-lg font-semibold">
              Comments ({playlist._count.comments})
            </h2>
            <CommentSection playlistId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}
