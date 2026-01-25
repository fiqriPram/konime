# 📄 Product Requirements Document (PRD)

## Anime Discovery & Tracking Website

---

## 1. Product Overview

**Product Name (Working Title):** AniTrack
**Category:** Anime Discovery & Tracking Platform
**Target Users:**

- Anime fans who want to **discover**, **track**, and **bookmark** anime
- Users who already know AniList/Kitsu but want a **simpler, cleaner UI**

**Problem Statement:**
Anime data exists across platforms (AniList, Kitsu) but is fragmented and often overwhelming. Users want a **fast, minimalist website** to browse anime, see details, and track what they watch—without heavy social features.

**Solution:**
A modern web app that aggregates anime data from **AniList & Kitsu APIs**, provides a **clean browsing experience**, and allows users to **save favorites, watchlists, and progress**.

---

## 2. Goals & Success Metrics

### Goals

- Provide fast anime browsing with rich metadata
- Combine AniList + Kitsu data into a single experience
- Allow user personalization (watchlist, favorites)

### Success Metrics

- Page load time < 1.5s
- User retention (weekly active users)
- Watchlist creation rate
- Anime detail page engagement time

---

## 3. Core Features (MVP)

### 3.1 Anime Discovery

- Trending anime
- Seasonal anime
- Popular anime
- Search anime by title

**API Source:**

- AniList (primary)
- Kitsu (fallback / additional metadata)

---

### 3.2 Anime Detail Page

Each anime page should show:

- Title (English / Romaji / Japanese)
- Cover image & banner
- Synopsis
- Episodes count
- Status (Airing / Finished)
- Genres
- Studio
- Rating (AniList score)
- External links (AniList, Kitsu)

---

### 3.3 User Authentication

- Email / OAuth (Google optional)
- Session-based auth

---

### 3.4 Watchlist & Favorites

- Add anime to:

  - Watching
  - Completed
  - Planned
  - Dropped

- Mark as favorite
- Track watched episode count

---

### 3.5 User Profile

- Username & avatar
- Anime stats:

  - Total watched
  - Currently watching

- Public or private profile

---

## 4. Nice-to-Have (Post-MVP)

- Recommendations (based on genres watched)
- Episode release countdown
- Sync AniList account
- Comments / reviews
- Dark mode toggle (if not default)

---

## 5. User Flow

### New User

1. Landing page
2. Browse trending anime
3. Open anime detail
4. Sign up
5. Add anime to watchlist

### Returning User

1. Login
2. Dashboard
3. Continue watching
4. Update progress

---

## 6. Pages & Routes (Next.js App Router)

### Public

- `/` – Landing Page
- `/anime` – Browse Anime
- `/anime/[slug]` – Anime Detail
- `/search` – Search Results

### Auth

- `/login`
- `/register`

### Protected

- `/dashboard`
- `/watchlist`
- `/profile`

---

## 7. Tech Stack

### Frontend

- **Next.js (App Router)**
- **TailwindCSS**
- **shadcn/ui**
- **Lucide Icons**
- **Server Components + Streaming**

### Backend

- **Next.js API Routes**
- **Prisma ORM**
- **Neon (PostgreSQL)**

### External APIs

- **AniList GraphQL API**
- **Kitsu REST API**

---

## 8. Database Schema (High Level)

### User

- id
- email
- username
- avatar
- createdAt

### Anime

- id
- anilistId
- kitsuId
- title
- coverImage
- bannerImage
- status
- episodes
- genres

### Watchlist

- id
- userId
- animeId
- status (watching/completed/planned)
- progress
- updatedAt

### Favorite

- id
- userId
- animeId

---

## 9. API Strategy

- **AniList as primary source**
- **Kitsu as fallback / enrichment**
- Cache anime data in database to reduce API calls
- Use ISR / revalidation for anime pages

---

## 10. Non-Functional Requirements

- SEO-friendly (metadata, OpenGraph)
- Responsive (mobile-first)
- Rate-limit external API calls
- Error handling for API downtime

---

## 11. Risks & Considerations

- API rate limits (AniList & Kitsu)
- Data inconsistency between APIs
- Legal disclaimer (not hosting content)

---

## 12. Future Monetization (Optional)

- Ads (ethical placement)
- Premium account:

  - Advanced stats
  - Recommendations
  - Sync with AniList
