import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Suspense } from "react";
import Link from "next/link";

async function getGenres() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/genres?type=genres`, {
      cache: "force-cache",
      next: { revalidate: 86400 }, // Revalidate every day
    });

    if (!response.ok) {
      throw new Error("Failed to fetch genres");
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
}

function createGenreSlug(genre: string): string {
  return genre
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function GenreLoading() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {Array.from({ length: 24 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-16 bg-muted rounded-lg" />
        </div>
      ))}
    </div>
  );
}

async function GenresContent() {
  const genres = await getGenres();

  if (!genres || genres.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No genres available</h3>
        <p className="text-muted-foreground">Please check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {genres.map((genre: string) => (
        <Link
          key={genre}
          href={`/genre/${createGenreSlug(genre)}`}
          className="group"
        >
          <Card className="h-16 flex items-center justify-center transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
            <CardContent className="p-4">
              <h3 className="text-center font-medium group-hover:text-primary transition-colors">
                {genre}
              </h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function GenresPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse by Genre</h1>
          <p className="text-muted-foreground text-lg">
            Discover anime by exploring different genres and find your perfect match
          </p>
        </div>

        <div className="space-y-8">
          <Suspense fallback={<GenreLoading />}>
            <GenresContent />
          </Suspense>

          <div className="mt-16 text-center">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                Can't find a specific genre?
              </h2>
              <p className="text-muted-foreground">
                Try searching for anime with specific genres or browse our complete catalog
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <Link href="/search">Search Anime</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/anime">Browse All Anime</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}