"use client";

import { useState } from "react";
import { AnimeCard } from "@/components/anime-card";
import { Button } from "@/components/ui/button";

interface GenreAnimeContentProps {
  genre: string;
  initialAnime: any[];
  initialPageInfo: { hasNextPage: boolean };
}

export function GenreAnimeContent({ genre, initialAnime, initialPageInfo }: GenreAnimeContentProps) {
  const [anime, setAnime] = useState(initialAnime);
  const [pageInfo, setPageInfo] = useState(initialPageInfo);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    if (loading || !pageInfo.hasNextPage) return;
    
    setLoading(true);
    try {
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const response = await fetch(
        `${baseUrl}/api/genres?type=anime&genre=${encodeURIComponent(genre)}&page=${page + 1}`
      );
      
      if (!response.ok) throw new Error("Failed to fetch more anime");
      
      const data = await response.json();
      setAnime(prev => [...prev, ...data.anime]);
      setPageInfo(data.pageInfo);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error("Error loading more anime:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!anime || anime.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No anime found</h3>
        <p className="text-muted-foreground">
          No anime available for the "{genre}" genre. Try browsing other genres.
        </p>
        <Button variant="outline" className="mt-4" asChild>
          <a href="/genres">Browse All Genres</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {anime.map((item: any) => (
          <AnimeCard key={item.id} anime={item} />
        ))}
      </div>

      {pageInfo.hasNextPage && (
        <div className="text-center">
          <Button 
            variant="outline" 
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}