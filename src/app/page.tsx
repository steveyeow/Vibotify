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

  return (
    <div className="flex min-h-full animate-in flex-col justify-center" style={{ marginTop: "-8vh" }}>
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
          The playlist
          <br />
          behind the <span className="text-gradient italic pr-1">code</span>
        </h1>
        <p className="mt-6 max-w-md text-lg leading-relaxed text-text-secondary">
          Discover what developers listen to in their flow state.
          Share your playlist, find your next favorite.
        </p>
        <div className="mt-10 flex items-center gap-4">
          <Link href="/explore" className="btn-primary text-base px-8 py-3.5">
            Explore
          </Link>
          <Link href="/share" className="btn-secondary text-base px-8 py-3.5">
            Share yours
          </Link>
        </div>
      </div>
    </div>
  );
}
