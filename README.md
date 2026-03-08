# Vibotify

A community for developers to share, discover, and vibe to coding playlists.

![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)
![License](https://img.shields.io/badge/License-MIT-green)

## What is Vibotify?

Every developer has a playlist that fuels their flow state. Vibotify is where you share yours.

- **Share** your Spotify coding playlists with the dev community
- **Discover** what other developers listen to while they code
- **Listen** to playlists directly via embedded Spotify player
- **Save** playlists to your Spotify library with one click
- **Vote & Comment** on playlists you love
- **Follow** developers with great taste in coding music

## Tech Stack

| Layer | Technology | Cost |
|-------|-----------|------|
| Framework | Next.js 15 (App Router) | Free |
| Language | TypeScript | Free |
| Database | PostgreSQL (Supabase free tier) | Free |
| ORM | Prisma | Free |
| Auth | NextAuth.js + Spotify OAuth | Free |
| Styling | Tailwind CSS 4 | Free |
| Hosting | Vercel | Free |
| Music API | Spotify Web API | Free |

**Total cost to launch: $0/month**

## Getting Started

### Prerequisites

- Node.js 20+
- A Spotify Developer account (free)
- A PostgreSQL database (Supabase free tier recommended)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/vibotify.git
cd vibotify
npm install
```

### 2. Set up Spotify Developer App

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Set redirect URI to `http://localhost:3000/api/auth/callback/spotify`
4. Copy your Client ID and Client Secret

### 3. Set up Database

**Option A: Supabase (recommended for production)**
1. Create a free project at [supabase.com](https://supabase.com)
2. Go to Settings → Database → Connection string (URI)
3. Copy the connection string

**Option B: Local PostgreSQL**
```bash
docker run -d --name vibotify-db -e POSTGRES_DB=vibotify -e POSTGRES_USER=vibotify -e POSTGRES_PASSWORD=secret -p 5432:5432 postgres:16-alpine
```

### 4. Configure Environment

```bash
cp .env.example .env
```

Fill in your `.env`:
```
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=run-openssl-rand-base64-32
DATABASE_URL=your_postgres_connection_string
```

Generate a secret:
```bash
openssl rand -base64 32
```

### 5. Initialize Database

```bash
npx prisma db push
```

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy to Production

### Vercel (Recommended)

1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Update `NEXTAUTH_URL` to your production URL
5. Add production redirect URI in Spotify Developer Dashboard

### Docker

```bash
docker compose up -d
npx prisma db push
```

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # Spotify OAuth
│   │   ├── playlists/            # CRUD + vote + comment + save
│   │   ├── spotify/              # Spotify API proxy
│   │   └── users/                # Follow
│   ├── explore/                  # Browse playlists
│   ├── login/                    # Auth page
│   ├── playlist/[id]/            # Playlist detail
│   ├── profile/[id]/             # User profile
│   ├── share/                    # Share flow
│   ├── globals.css               # Design tokens
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/
│   ├── comment-section.tsx
│   ├── follow-button.tsx
│   ├── nav.tsx
│   ├── playlist-card.tsx
│   ├── providers.tsx
│   ├── save-to-spotify.tsx
│   └── vote-button.tsx
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma client
│   ├── spotify.ts                # Spotify API
│   └── utils.ts                  # Helpers
└── types/
    └── next-auth.d.ts            # Type augmentation
```

## License

MIT
