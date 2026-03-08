import { prisma } from "@/lib/prisma";
import { PlaylistCard } from "@/components/playlist-card";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/explore");
  }

  const recentPlaylists = await prisma.sharedPlaylist.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: {
      user: { select: { id: true, name: true, image: true } },
      _count: { select: { votes: true, comments: true } },
    },
  });

  return (
    <div className="animate-in">
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="max-w-xl">
          <h1 className="font-display text-5xl leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
            The playlist
            <br />
            behind the <span className="text-gradient italic">code</span>
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-text-secondary">
            Discover what developers listen to in their flow state.
            Share your playlist, find your next favorite.
          </p>
          <div className="mt-8 flex items-center gap-4">
            <Link href="/explore" className="btn-primary text-base px-7 py-3">
              Explore
            </Link>
            <Link href="/share" className="btn-secondary text-base px-7 py-3">
              Share yours
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Playlists */}
      {recentPlaylists.length > 0 && (
        <section>
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-medium text-text-secondary">Recently shared</h2>
            <Link href="/explore" className="text-sm text-text-tertiary hover:text-text-primary transition-colors">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {recentPlaylists.map((playlist) => (
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
        </section>
      )}
    </div>
  );
}
