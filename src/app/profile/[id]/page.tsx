import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
import Image from "next/image";
import { PlaylistCard } from "@/components/playlist-card";
import { FollowButton } from "@/components/follow-button";
import { timeAgo } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: Props) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      playlists: {
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, name: true, image: true } },
          _count: { select: { votes: true, comments: true } },
        },
      },
      _count: {
        select: {
          playlists: true,
          followers: true,
          following: true,
        },
      },
    },
  });

  if (!user) notFound();

  const isFollowing = session?.user?.id
    ? !!(await prisma.follow.findUnique({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: id,
          },
        },
      }))
    : false;

  const isOwnProfile = session?.user?.id === id;

  const totalVotes = await prisma.vote.count({
    where: { playlist: { userId: id } },
  });

  return (
    <div className="animate-in">
      {/* Profile Header */}
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        {user.image ? (
          <Image
            src={user.image}
            alt=""
            width={96}
            height={96}
            className="rounded-full"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-accent/20 text-3xl font-semibold text-accent">
            {user.name?.[0]?.toUpperCase()}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-semibold">{user.name}</h1>
            {!isOwnProfile && session && (
              <FollowButton userId={id} initialFollowing={isFollowing} />
            )}
          </div>

          {user.bio && (
            <p className="mt-2 text-text-secondary">{user.bio}</p>
          )}

          <div className="mt-3 flex items-center gap-5 text-sm text-text-tertiary">
            <span>
              <strong className="text-text-secondary">
                {user._count.playlists}
              </strong>{" "}
              playlists
            </span>
            <span>
              <strong className="text-text-secondary">
                {user._count.followers}
              </strong>{" "}
              followers
            </span>
            <span>
              <strong className="text-text-secondary">
                {user._count.following}
              </strong>{" "}
              following
            </span>
            <span>
              <strong className="text-text-secondary">{totalVotes}</strong>{" "}
              votes received
            </span>
          </div>

          <p className="mt-2 text-xs text-text-tertiary">
            Joined {timeAgo(user.createdAt)}
          </p>
        </div>
      </div>

      {/* Playlists */}
      <div className="mt-10">
        <h2 className="mb-6 text-xl font-semibold">
          Shared playlists ({user.playlists.length})
        </h2>

        {user.playlists.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {user.playlists.map((playlist) => (
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
        ) : (
          <div className="py-16 text-center">
            <p className="text-text-secondary">
              {isOwnProfile
                ? "You haven't shared any playlists yet."
                : "No playlists shared yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
