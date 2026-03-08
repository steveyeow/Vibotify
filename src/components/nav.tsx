"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

export function Nav() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-bg">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-7">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                className="text-text-inverse"
              >
                <path d="M3 7l4 5-4 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="10" y="15" width="5" height="2.5" rx="1.25" fill="currentColor" />
                <rect x="17" y="7" width="2.5" height="10" rx="1.25" fill="currentColor" />
                <rect x="21" y="4" width="2.5" height="16" rx="1.25" fill="currentColor" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight">
              vibotify
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            <Link
              href="/explore"
              className="rounded-full px-4 py-1.5 text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
            >
              Explore
            </Link>
            <Link
              href="/share"
              className="rounded-full px-4 py-1.5 text-sm font-bold text-text-secondary transition-colors hover:text-text-primary"
            >
              Share
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-bg-hover" />
          ) : session?.user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 rounded-full bg-bg-elevated p-0.5 pr-3 transition-colors hover:bg-bg-hover"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                ) : (
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-text-inverse">
                    {session.user.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <span className="text-xs font-bold">
                  {session.user.name?.split(" ")[0]}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-text-secondary">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {menuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-lg bg-[#282828] p-1 shadow-2xl">
                    <Link
                      href={`/profile/${session.user.id}`}
                      className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/share"
                      className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary md:hidden"
                      onClick={() => setMenuOpen(false)}
                    >
                      Share
                    </Link>
                    <div className="my-1 h-px bg-white/10" />
                    <button
                      onClick={() => signOut()}
                      className="flex w-full items-center rounded-sm px-3 py-2.5 text-sm text-text-secondary transition-colors hover:bg-white/10 hover:text-text-primary"
                    >
                      Log out
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-100"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
