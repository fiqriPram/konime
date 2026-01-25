export type UserStatus = 'watching' | 'completed' | 'planned' | 'dropped'

export interface CreateUserData {
  email: string
  username: string
  avatar?: string
}

export interface UpdateWatchlistData {
  status: UserStatus
  progress?: number
}

export interface AnimeWithRelations {
  id: string
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
  createdAt: Date
  updatedAt: Date
  watchlists?: any[]
  favorites?: any[]
}

export interface WatchlistWithAnime {
  id: string
  userId: string
  animeId: string
  status: UserStatus
  progress: number
  createdAt: Date
  updatedAt: Date
  anime: AnimeWithRelations
}

export interface FavoriteWithAnime {
  id: string
  userId: string
  animeId: string
  createdAt: Date
  anime: AnimeWithRelations
}