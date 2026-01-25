import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GenreAnimeContent } from "@/components/genre-anime-content";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";

// Common anime genres mapping
const genreMap: { [key: string]: string } = {
  "action": "Action",
  "adventure": "Adventure",
  "comedy": "Comedy",
  "drama": "Drama",
  "sci-fi": "Sci-Fi",
  "fantasy": "Fantasy",
  "slice-of-life": "Slice of Life",
  "romance": "Romance",
  "thriller": "Thriller",
  "horror": "Horror",
  "mystery": "Mystery",
  "supernatural": "Supernatural",
  "psychological": "Psychological",
  "sports": "Sports",
  "mecha": "Mecha",
  "music": "Music",
  "school": "School",
  "historical": "Historical",
  "military": "Military",
  "shounen": "Shounen",
  "shoujo": "Shoujo",
  "seinen": "Seinen",
  "josei": "Josei",
  "ecchi": "Ecchi",
  "harem": "Harem",
  "isekai": "Isekai",
  "game": "Game",
  "demons": "Demons",
  "magic": "Magic",
  "vampire": "Vampire",
  "samurai": "Samurai",
  "space": "Space",
  "parody": "Parody",
  "super-power": "Super Power",
  "martial-arts": "Martial Arts",
  "police": "Police",
  "cars": "Cars",
  "dementia": "Dementia",
  "kids": "Kids",
  "shounen-ai": "Shounen Ai",
  "shoujo-ai": "Shoujo Ai",
  "yaoi": "Yaoi",
  "yuri": "Yuri",
  "workplace": "Workplace",
  "reincarnation": "Reincarnation",
  "gore": "Gore",
  "cyberpunk": "Cyberpunk",
  "girls-with-powers": "Girls with Powers",
  "boys-love": "Boys Love",
  "idols": "Idols",
  "love-triangle": "Love Triangle",
  "high-stakes-game": "High Stakes Game",
  "time-travel": "Time Travel",
  "post-apocalyptic": "Post-Apocalyptic",
  "survival": "Survival",
  "cults": "Cults",
  "outer-space": "Outer Space",
  "showbiz": "Showbiz",
  "delinquents": "Delinquents",
  "crossdressing": "Crossdressing",
  "education": "Education",
  "gag-humor": "Gag Humor",
  "otaku-culture": "Otaku Culture",
  "performing-arts": "Performing Arts",
  "racing": "Racing",
  "reverse-harem": "Reverse Harem",
  "team-sports": "Team Sports",
  "animal-protagonists": "Animal Protagonists",
  "anthropomorphic": "Anthropomorphic",
  "cooking": "Cooking",
  "machines": "Machines",
  "archaeology": "Archaeology",
  "childcare": "Childcare",
  "detective": "Detective",
  "egyptian": "Egyptian",
  "fairy-tale": "Fairy Tale",
  "fantasy-world": "Fantasy World",
  "genderswap": "Genderswap",
  "gyaru": "Gyaru",
  "incest": "Incest",
  "mahou-shoujo": "Mahou Shoujo",
  "maou": "Maou",
  "medical": "Medical",
  "memoir": "Memoir",
  "monsters": "Monsters",
  "mythology": "Mythology",
  "ninja": "Ninja",
  "pets": "Pets",
  "philosophy": "Philosophy",
  "pirates": "Pirates",
  "politics": "Politics",
  "swordplay": "Swordplay",
  "slapstick": "Slapstick",
  "tragedy": "Tragedy",
  "video-game": "Video Game",
  "visual-arts": "Visual Arts",
  "yakuza": "Yakuza",
  "zombies": "Zombies",
};

function getGenreFromSlug(slug: string): string {
  return genreMap[slug] || slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

async function getAnimeByGenre(genre: string, page: number = 1) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(
      `${baseUrl}/api/genres?type=anime&genre=${encodeURIComponent(genre)}&page=${page}`,
      {
        cache: "force-cache",
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch anime by genre");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching anime by genre:", error);
    return { anime: [], pageInfo: { hasNextPage: false } };
  }
}

function AnimeLoading() {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted rounded-lg aspect-[3/4] w-full mb-3" />
          <div className="h-4 bg-muted rounded mb-2" />
          <div className="h-3 bg-muted rounded w-3/4" />
        </div>
      ))}
    </div>
  );
}

async function GenreAnimePageContent({ slug }: { slug: string }) {
  const genre = getGenreFromSlug(slug);
  const initialData = await getAnimeByGenre(genre);

  return (
    <GenreAnimeContent 
      genre={genre}
      initialAnime={initialData.anime}
      initialPageInfo={initialData.pageInfo}
    />
  );
}

export default async function GenrePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 capitalize">
            {slug.replace(/-/g, ' ')}
          </h1>
          <p className="text-muted-foreground text-lg">
            Discover anime in the {slug.replace(/-/g, ' ')} genre
          </p>
        </div>

        <div className="space-y-8">
          <Suspense fallback={<AnimeLoading />}>
            <GenreAnimePageContent slug={slug} />
          </Suspense>

          <div className="mt-16 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Want to explore more?
              </h2>
              <p className="text-muted-foreground">
                Browse other genres or search for specific anime
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/genres">Browse All Genres</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/search">Search Anime</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}