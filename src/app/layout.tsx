import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-display",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "vibotify — the playlist behind the code",
  description:
    "Discover what developers listen to in their flow state. Share your playlist, find your next favorite.",
  openGraph: {
    title: "vibotify — the playlist behind the code",
    description:
      "Discover what developers listen to in their flow state.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "vibotify — the playlist behind the code",
    description:
      "Discover what developers listen to in their flow state.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-bg">
        <Providers>
          <Nav />
          <div className="flex gap-2 px-2 pb-2">
            <Sidebar />
            <main className="flex-1 overflow-hidden rounded-lg bg-[#121212] px-6 pb-20 pt-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
