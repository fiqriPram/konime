import { prisma } from '../src/lib/prisma'

const animeData = [
  {
    anilistId: 16498,
    title: {
      english: "Attack on Titan",
      romaji: "Shingeki no Kyojin",
      native: "進撃の巨人"
    },
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx9CtSE1A7nXIL5auxPA.jpg",
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/16498.jpg",
    synopsis: "Several hundred years ago, humans were nearly exterminated by titans...",
    episodes: 87,
    status: "Finished",
    genres: ["Action", "Drama", "Fantasy", "Military", "Shounen"],
    studio: "Wit Studio",
    rating: 9.0
  },
  {
    anilistId: 21,
    title: {
      english: "One Piece",
      romaji: "One Piece",
      native: "ワンピース"
    },
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/nx24j76Jc34dCljY1N3.jpg",
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/21.jpg",
    synopsis: "Gol D. Roger, known as the Pirate King, was executed...",
    episodes: 1000,
    status: "Releasing",
    genres: ["Adventure", "Comedy", "Drama", "Shounen"],
    studio: "Toei Animation",
    rating: 9.1
  },
  {
    anilistId: 52991,
    title: {
      english: "Jujutsu Kaisen",
      romaji: "Jujutsu Kaisen",
      native: "呪術廻戦"
    },
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/n9ew2ymdOcEl5B8xJfM.jpg",
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/52991.jpg",
    synopsis: "Yuji Itadori is a genius with track and field...",
    episodes: 24,
    status: "Finished",
    genres: ["Action", "School", "Shounen", "Supernatural"],
    studio: "MAPPA",
    rating: 8.5
  },
  {
    anilistId: 113415,
    title: {
      english: "Chainsaw Man",
      romaji: "Chainsaw Man",
      native: "チェンソーマン"
    },
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/epGgrn874DrcrU3p26c.jpg",
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/113415.jpg",
    synopsis: "Denji has a simple dream—to live a happy and peaceful life...",
    episodes: 12,
    status: "Finished",
    genres: ["Action", "Supernatural", "Shounen"],
    studio: "MAPPA",
    rating: 8.6
  },
  {
    anilistId: 30,
    title: {
      english: "Death Note",
      romaji: "Death Note",
      native: "デスノート"
    },
    coverImage: "https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/ynboWAiAwJiI8Y3d3fQ.jpg",
    bannerImage: "https://s4.anilist.co/file/anilistcdn/media/anime/banner/30.jpg",
    synopsis: "A shinigami, as a god of death, can kill any person...",
    episodes: 37,
    status: "Finished",
    genres: ["Mystery", "Psychological", "Supernatural", "Thriller"],
    studio: "Madhouse",
    rating: 9.0
  }
]

async function main() {
  console.log('🌱 Seeding database with sample anime data...')
  
  for (const anime of animeData) {
    await prisma.anime.upsert({
      where: { anilistId: anime.anilistId },
      update: anime,
      create: anime
    })
  }
  
  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })