# AniTrack - Anime Discovery & Tracking Platform

A modern web application for discovering, browsing, and tracking anime with a clean, minimalist interface. Built with Next.js, TypeScript, and TailwindCSS.

## 🚀 Features

### ✅ Completed

- **🌗 Dark Mode Support**: Full dark/light mode toggle with system preference detection
- **🔍 Anime Discovery**: Browse trending, seasonal, and popular anime
- **🎨 Modern UI**: Clean interface built with shadcn/ui components
- **📱 Responsive Design**: Mobile-first responsive design
- **🔗 External API Integration**:
  - Primary: AniList GraphQL API
  - Fallback: Kitsu REST API
- **🎯 Rich Metadata**: Detailed anime information including:
  - Titles (English, Romaji, Native)
  - Cover images and banners
  - Synopsis and descriptions
  - Episodes count and status
  - Genres and studios
  - Ratings and scores
  - External links to AniList/Kitsu

### 🚧 In Progress / Planned

- **👤 User Authentication**: Email and OAuth support
- **📋 Watchlist Management**: Track watching/completed/planned anime
- **❤️ Favorites System**: Mark favorite anime
- **👤 User Profiles**: Personal stats and dashboard
- **🔔 Notifications**: Episode release reminders

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, React 19
- **Styling**: TailwindCSS, shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (planned)
- **APIs**: AniList GraphQL, Kitsu REST
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- PostgreSQL database (local or cloud)

## 🚀 Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd konime
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   Copy `.env.example` to `.env` (or edit the existing `.env`):

   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/anitrack"

   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"

   # External APIs
   ANILIST_API_URL="https://graphql.anilist.co"
   KITSU_API_URL="https://api.kitsu.io"
   ```

4. **Set up the database**

   If using local PostgreSQL:

   ```bash
   # Start PostgreSQL (if using Docker)
   docker run --name postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres

   # Run Prisma migrations
   npx prisma migrate dev --name init
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Troubleshooting

### Image Loading Issues

If you encounter errors about unconfigured image hostnames, make sure your `next.config.ts` includes the proper image domains:

```typescript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 's4.anilist.co',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'media.kitsu.io',
      pathname: '/**',
    },
    {
      protocol: 'https',
      hostname: 'cdn.kitsu.io',
      pathname: '/**',
    },
  ],
}
```

### Port Already in Use

If port 3000 is already in use, Next.js will automatically use the next available port (usually 3001). Check the terminal output for the correct URL.

### Database Connection

- Ensure PostgreSQL is running
- Verify your `DATABASE_URL` is correct
- Run `npx prisma generate` if you've made schema changes
- Run `npx prisma migrate dev` to apply migrations

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── anime/          # Combined anime API
│   │   ├── anilist/        # AniList API integration
│   │   └── kitsu/          # Kitsu API integration
│   ├── anime/              # Anime browsing pages
│   │   ├── page.tsx        # Browse anime
│   │   └── [id]/           # Anime detail page
│   ├── search/             # Search functionality
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # shadcn/ui components
│   ├── anime-card.tsx      # Anime card component
│   ├── header.tsx          # Header navigation
│   ├── theme-provider.tsx  # Dark mode provider
│   └── theme-toggle.tsx    # Dark mode toggle
├── hooks/                  # Custom React hooks
│   └── use-debounce.ts     # Debounce hook
└── lib/                    # Utility libraries
    ├── prisma.ts           # Prisma client
    └── utils.ts            # Utility functions
```

## 🎨 UI Components

The application uses shadcn/ui components for a consistent, modern design:

- **Cards**: Display anime information
- **Badges**: Show status, genres, ratings
- **Buttons**: Interactive actions
- **Input**: Search and forms
- **Dropdown**: Navigation menus

## 🌗 Dark Mode

Dark mode is fully implemented with:

- System preference detection
- Manual toggle button
- Persistent theme selection
- Smooth transitions
- Proper color contrast

## 📊 API Integration

### AniList (Primary)

- GraphQL API for comprehensive anime data
- Rich metadata including ratings, studios, seasons
- High-quality images and descriptions

### Kitsu (Fallback)

- REST API as backup data source
- Alternative anime information
- Cross-reference capabilities

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on git push

### Other Platforms

```bash
# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [AniList](https://anilist.co/) for providing excellent anime data
- [Kitsu](https://kitsu.io/) for fallback API support
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Next.js](https://nextjs.org/) for the amazing framework
- [TailwindCSS](https://tailwindcss.com/) for utility-first styling

---

**Note**: This is a hobby project built for educational purposes. All anime data is sourced from external APIs and no content is hosted on this platform.
