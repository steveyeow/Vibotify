import type { Metadata } from "next";
import { DM_Sans, Playfair_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { LayoutShell } from "@/components/layout-shell";

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
  title: "Vibotify — the playlist behind the code",
  description:
    "Discover what developers listen to in their flow state. Share your playlist, find your next favorite.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Vibotify — the playlist behind the code",
    description:
      "Discover what developers listen to in their flow state.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibotify — the playlist behind the code",
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
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='light')document.documentElement.classList.add('light')}catch(e){}})()`,
          }}
        />
      </head>
      <body className="h-screen overflow-hidden bg-bg">
        <Providers>
          <Nav />
          <LayoutShell>{children}</LayoutShell>
        </Providers>
      </body>
    </html>
  );
}
