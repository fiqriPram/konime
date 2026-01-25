import { prisma } from './prisma'

// User operations
export async function createUser(data: {
  email: string
  username: string
  avatar?: string
}) {
  return await prisma.user.create({
    data,
  })
}

export async function getUserById(id: string) {
  return await prisma.user.findUnique({
    where: { id },
    include: {
      watchlists: {
        include: { anime: true }
      },
      favorites: {
        include: { anime: true }
      }
    }
  })
}

export async function getUserByEmail(email: string) {
  return await prisma.user.findUnique({
    where: { email }
  })
}

export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username }
  })
}

// Anime operations
export async function createAnime(data: {
  anilistId?: number
  kitsuId?: string
  title: any
  coverImage: string
  bannerImage?: string
  synopsis?: string
  episodes?: number
  status?: string
  genres: string[]
  studio?: string
  rating?: number
}) {
  return await prisma.anime.create({
    data,
  })
}

export async function getAnimeById(id: string) {
  return await prisma.anime.findUnique({
    where: { id },
    include: {
      watchlists: true,
      favorites: true
    }
  })
}

export async function getAnimeByAnilistId(anilistId: number) {
  return await prisma.anime.findUnique({
    where: { anilistId }
  })
}

export async function searchAnime(query: string, limit = 20) {
  return await prisma.anime.findMany({
    where: {
      OR: [
        {
          title: {
            path: ['english', 'romaji', 'native'],
            stringContains: query
          }
        },
        {
          synopsis: {
            contains: query
          }
        }
      ]
    },
    take: limit,
    orderBy: {
      rating: 'desc'
    }
  })
}

// Watchlist operations
export async function addToWatchlist(data: {
  userId: string
  animeId: string
  status: string
  progress?: number
}) {
  return await prisma.watchlist.create({
    data,
  })
}

export async function updateWatchlistStatus(id: string, status: string, progress?: number) {
  return await prisma.watchlist.update({
    where: { id },
    data: {
      status,
      progress
    }
  })
}

export async function removeFromWatchlist(userId: string, animeId: string) {
  return await prisma.watchlist.deleteMany({
    where: {
      userId,
      animeId
    }
  })
}

export async function getUserWatchlist(userId: string) {
  return await prisma.watchlist.findMany({
    where: { userId },
    include: {
      anime: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Favorite operations
export async function addToFavorites(data: {
  userId: string
  animeId: string
}) {
  return await prisma.favorite.create({
    data,
  })
}

export async function removeFromFavorites(userId: string, animeId: string) {
  return await prisma.favorite.deleteMany({
    where: {
      userId,
      animeId
    }
  })
}

export async function getUserFavorites(userId: string) {
  return await prisma.favorite.findMany({
    where: { userId },
    include: {
      anime: true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
}

// Popular anime
export async function getPopularAnime(limit = 12) {
  return await prisma.anime.findMany({
    take: limit,
    orderBy: {
      rating: 'desc'
    }
  })
}

// Genres
export async function getUniqueGenres() {
  const anime = await prisma.anime.findMany({
    select: {
      genres: true
    }
  })
  
  const allGenres = anime.flatMap((a: any) => a.genres)
  return [...new Set(allGenres)]
}