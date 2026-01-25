"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { AnimeCard } from "@/components/anime-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

interface Anime {
  id: string | number;
  title: {
    english?: string;
    romaji?: string;
    native?: string;
  };
  coverImage: {
    large: string;
  };
  description?: string;
  episodes?: number;
  status?: string;
  genres?: string[];
  averageScore?: number;
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery.trim()) {
      performSearch(debouncedQuery);
    } else {
      setResults([]);
      setSearched(false);
    }
  }, [debouncedQuery]);

  const performSearch = async (searchQuery: string) => {
    setLoading(true);
    setSearched(true);

    try {
      const response = await fetch(
        `/api/anime?type=search&search=${encodeURIComponent(searchQuery)}`,
      );

      if (!response.ok) {
        throw new Error("Search failed");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Search Anime</h1>
            <p className="text-muted-foreground text-lg">
              Find your favorite anime by title
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search for anime..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-4 py-3 text-lg"
              />
              {loading && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 animate-spin h-4 w-4" />
              )}
            </div>
          </form>

          {loading && (
            <div className="text-center py-8">
              <Loader2 className="animate-spin mx-auto h-8 w-8 mb-4" />
              <p className="text-muted-foreground">Searching anime...</p>
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-16">
              <h2 className="text-2xl font-semibold mb-4">No results found</h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any anime matching "{query}"
              </p>
              <div className="space-y-4">
                <Button asChild>
                  <a href="/api/anime?type=search&search={encodeURIComponent(query)}&fallback=true">
                    Try Alternative Source
                  </a>
                </Button>
                <Button variant="outline" asChild className="ml-4">
                  <a href="/anime">Browse All Anime</a>
                </Button>
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-6">
                {results.length} {results.length === 1 ? "Result" : "Results"}{" "}
                for "{query}"
              </h2>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {results.map((anime) => (
                  <AnimeCard key={anime.id} anime={anime} />
                ))}
              </div>
            </div>
          )}

          {!searched && !loading && (
            <div className="text-center py-16">
              <Search className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-4">Start Searching</h2>
              <p className="text-muted-foreground mb-6">
                Type in the search box above to find your favorite anime
              </p>
              <div className="flex justify-center gap-4">
                <Button asChild>
                  <a href="/anime">Browse Popular Anime</a>
                </Button>
                <Button variant="outline" asChild>
                  <a href="/">Back to Home</a>
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
