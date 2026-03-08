import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function formatTotalDuration(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);

  const intervals = [
    { label: "y", seconds: 31536000 },
    { label: "mo", seconds: 2592000 },
    { label: "w", seconds: 604800 },
    { label: "d", seconds: 86400 },
    { label: "h", seconds: 3600 },
    { label: "m", seconds: 60 },
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) return `${count}${interval.label} ago`;
  }

  return "just now";
}

export const VIBE_TAGS = [
  "deep focus",
  "lo-fi",
  "electronic",
  "ambient",
  "classical",
  "jazz",
  "synthwave",
  "late night",
  "morning flow",
] as const;

export const ALL_TAGS = [
  ...VIBE_TAGS,
  "indie",
  "hip-hop",
  "post-rock",
  "chillhop",
  "dnb",
  "techno",
  "acoustic",
  "cinematic",
  "vaporwave",
  "debugging",
  "refactoring",
  "system design",
  "hackathon",
] as const;
