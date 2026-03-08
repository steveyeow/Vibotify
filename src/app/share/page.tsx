"use client";

import { useSession, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ALL_TAGS, cn } from "@/lib/utils";

interface PlaylistPreview {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  trackCount: number;
  spotifyUrl: string;
  ownerName: string;
  snapshotId: string;
  totalDurationMs?: number;
}

type ShareMethod = "url" | "import";

export default function SharePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [method, setMethod] = useState<ShareMethod>("url");
  const [url, setUrl] = useState("");
  const [fetching, setFetching] = useState(false);

  const [importPlaylists, setImportPlaylists] = useState<PlaylistPreview[]>([]);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState("");

  const [selected, setSelected] = useState<PlaylistPreview | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [vibeNote, setVibeNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (session && method === "import" && importPlaylists.length === 0 && !importLoading) {
      setImportLoading(true);
      setImportError("");
      fetch("/api/spotify/playlists/import")
        .then(async (res) => {
          if (!res.ok) {
            const data = await res.json();
            setImportError(data.error || "Could not load playlists. You may need Spotify Premium.");
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data) setImportPlaylists(data);
        })
        .catch(() => setImportError("Could not load playlists."))
        .finally(() => setImportLoading(false));
    }
  }, [session, method, importPlaylists.length, importLoading]);

  async function handleFetchUrl() {
    if (!url.trim()) return;
    setFetching(true);
    setError("");
    setSelected(null);

    try {
      const res = await fetch(
        `/api/spotify/playlists?url=${encodeURIComponent(url.trim())}`
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not fetch playlist.");
        return;
      }
      setSelected(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setFetching(false);
    }
  }

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function resetSelection() {
    setSelected(null);
    setTags([]);
    setVibeNote("");
    setError("");
  }

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/playlists", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          spotifyId: selected.id,
          name: selected.name,
          description: selected.description,
          imageUrl: selected.imageUrl,
          spotifyUrl: selected.spotifyUrl,
          trackCount: selected.trackCount,
          totalDurationMs: selected.totalDurationMs || 0,
          ownerName: selected.ownerName,
          snapshotId: selected.snapshotId,
          tags,
          vibeNote: vibeNote.trim() || null,
        }),
      });

      if (res.status === 409) {
        setError("This playlist has already been shared by someone.");
        return;
      }
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
        return;
      }

      const data = await res.json();
      router.push(`/playlist/${data.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="mx-auto max-w-md py-20 text-center animate-in">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-bg-elevated border border-border-subtle">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
            <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold">Share your coding playlist</h1>
        <p className="mt-3 text-text-secondary">
          Sign in to share your favorite coding playlists with the community.
        </p>
        <button
          onClick={() => signIn("spotify")}
          className="btn-primary mt-6 text-base px-7 py-3"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Sign in with Spotify
        </button>
      </div>
    );
  }

  // Customize step (after selecting a playlist)
  if (selected) {
    return (
      <div className="mx-auto max-w-2xl animate-in">
        <button
          onClick={resetSelection}
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-text-tertiary hover:text-text-secondary transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6" />
          </svg>
          Choose different playlist
        </button>

        <div className="flex items-start gap-5 rounded-2xl border border-border-subtle bg-bg-elevated p-5">
          {selected.imageUrl && (
            <Image
              src={selected.imageUrl}
              alt=""
              width={100}
              height={100}
              className="rounded-xl"
            />
          )}
          <div>
            <h2 className="text-xl font-semibold">{selected.name}</h2>
            <p className="mt-1 text-sm text-text-tertiary">
              {selected.trackCount} tracks · by {selected.ownerName}
            </p>
            {selected.description && (
              <p className="mt-2 text-sm text-text-secondary line-clamp-2">
                {selected.description}
              </p>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-6">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Vibe note{" "}
              <span className="text-text-tertiary font-normal">(optional)</span>
            </label>
            <textarea
              value={vibeNote}
              onChange={(e) => setVibeNote(e.target.value)}
              placeholder="e.g., Perfect for late-night debugging sessions with a cup of coffee..."
              className="textarea"
              rows={3}
              maxLength={280}
            />
            <p className="mt-1.5 text-xs text-text-tertiary">
              {vibeNote.length}/280
            </p>
          </div>

          <div>
            <label className="mb-3 block text-sm font-medium">
              Tags{" "}
              <span className="text-text-tertiary font-normal">
                (select up to 5)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_TAGS.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  disabled={tags.length >= 5 && !tags.includes(tag)}
                  className={cn(
                    tags.includes(tag) ? "tag-active" : "tag",
                    tags.length >= 5 &&
                      !tags.includes(tag) &&
                      "opacity-40 cursor-not-allowed"
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="btn-primary w-full py-3 text-base"
          >
            {submitting ? (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
                Sharing...
              </>
            ) : (
              "Share with the community"
            )}
          </button>
        </div>
      </div>
    );
  }

  // Selection step
  return (
    <div className="mx-auto max-w-2xl animate-in">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">
          Share a playlist
        </h1>
        <p className="mt-2 text-text-secondary">
          Share your favorite coding playlist with the community
        </p>
      </div>

      {/* Method tabs */}
      <div className="mb-6 flex gap-1 rounded-xl bg-bg-elevated p-1 border border-border-subtle">
        <button
          onClick={() => setMethod("url")}
          className={cn(
            "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
            method === "url"
              ? "bg-bg-active text-text-primary shadow-sm"
              : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          Paste link
        </button>
        <button
          onClick={() => setMethod("import")}
          className={cn(
            "flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all",
            method === "import"
              ? "bg-bg-active text-text-primary shadow-sm"
              : "text-text-tertiary hover:text-text-secondary"
          )}
        >
          Import from Spotify
        </button>
      </div>

      {/* Paste URL method */}
      {method === "url" && (
        <div>
          <div className="flex gap-3">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetchUrl()}
              placeholder="https://open.spotify.com/playlist/..."
              className="input flex-1 font-mono text-sm"
            />
            <button
              onClick={handleFetchUrl}
              disabled={!url.trim() || fetching}
              className="btn-primary whitespace-nowrap disabled:opacity-50"
            >
              {fetching ? (
                <svg width="16" height="16" viewBox="0 0 24 24" className="animate-spin" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                "Fetch"
              )}
            </button>
          </div>
          <p className="mt-2 text-xs text-text-tertiary">
            Open Spotify → right-click a playlist → Share → Copy link
          </p>
        </div>
      )}

      {/* Import from account method */}
      {method === "import" && (
        <div>
          {importLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="card animate-pulse p-0 overflow-hidden">
                  <div className="aspect-square bg-bg-hover" />
                  <div className="p-3">
                    <div className="h-4 w-3/4 rounded bg-bg-hover" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-bg-hover" />
                  </div>
                </div>
              ))}
            </div>
          ) : importError ? (
            <div className="rounded-xl border border-border-subtle bg-bg-elevated p-8 text-center">
              <p className="text-sm text-text-secondary">{importError}</p>
              <p className="mt-3 text-xs text-text-tertiary">
                Try the &ldquo;Paste link&rdquo; method instead — it works for all users.
              </p>
              <button
                onClick={() => setMethod("url")}
                className="btn-secondary mt-4"
              >
                Switch to paste link
              </button>
            </div>
          ) : importPlaylists.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {importPlaylists.map((playlist) => (
                <button
                  key={playlist.id}
                  onClick={() => setSelected(playlist)}
                  className="card p-0 overflow-hidden text-left transition-all"
                >
                  <div className="relative aspect-square overflow-hidden">
                    {playlist.imageUrl ? (
                      <Image
                        src={playlist.imageUrl}
                        alt={playlist.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-bg-active">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
                          <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium line-clamp-1">{playlist.name}</h3>
                    <p className="mt-0.5 text-xs text-text-tertiary">
                      {playlist.trackCount} tracks
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border-subtle bg-bg-elevated p-8 text-center">
              <p className="text-sm text-text-secondary">
                No playlists found in your Spotify account.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error for URL method */}
      {error && method === "url" && (
        <div className="mt-4 rounded-xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}
    </div>
  );
}
