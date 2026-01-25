import { AnimeCard } from "@/components/anime-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import { Header } from "@/components/header";

async function fetchAnimeData(type: string) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/anime?type=${type}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch ${type} anime`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error fetching ${type} anime:`, error);
    return [];
  }
}

async function AnimeSection({ title, type }: { title: string; type: string }) {
  const anime = await fetchAnimeData(type);

  if (!anime || anime.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="text-center py-8 text-muted-foreground">
          <p>No anime data available. Please check back later.</p>
          <Button variant="outline" className="mt-4" asChild>
            <a href={`/api/anime?type=${type}&fallback=true`}>
              Try Alternative Source
            </a>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {anime.map((item: any) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>
    </section>
  );
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

export default function AnimePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Anime</h1>
          <p className="text-muted-foreground text-lg">
            Discover your next favorite anime from our curated collection
          </p>
        </div>

        <div className="space-y-12">
          <Suspense
            fallback={
              <>
                <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
                <AnimeLoading />
              </>
            }
          >
            <AnimeSection title="Trending Now" type="trending" />
          </Suspense>

          <Suspense
            fallback={
              <>
                <h2 className="text-2xl font-bold mb-6">Popular This Season</h2>
                <AnimeLoading />
              </>
            }
          >
            <AnimeSection title="Popular This Season" type="seasonal" />
          </Suspense>

          <Suspense
            fallback={
              <>
                <h2 className="text-2xl font-bold mb-6">All Time Popular</h2>
                <AnimeLoading />
              </>
            }
          >
            <AnimeSection title="All Time Popular" type="popular" />
          </Suspense>
        </div>

        <div className="mt-16 text-center">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">
              Can't find what you're looking for?
            </h2>
            <p className="text-muted-foreground">
              Try searching for specific anime titles, browse by genres, or explore our complete catalog
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <a href="/search">Search Anime</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/genres">Browse by Genre</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/api/anime?type=trending&fallback=true">
                  Alternative Data Source
                </a>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
