"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, List, Share2, Heart } from "lucide-react";

async function getEpisode(episodeId: string) {
  try {
    const response = await fetch(`/api/episodes?type=detail&episodeId=${episodeId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch episode");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching episode:", error);
    return null;
  }
}

export default function WatchPage() {
  const params = useParams();
  const router = useRouter();
  const [episode, setEpisode] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [anime, setAnime] = useState<any>(null);

  const { animeId, episodeId } = params as { animeId: string; episodeId: string };

  useEffect(() => {
    const fetchEpisode = async () => {
      setLoading(true);
      const episodeData = await getEpisode(episodeId);
      
      if (episodeData) {
        setEpisode(episodeData);
        setAnime(episodeData.anime);
      }
      setLoading(false);
    };

    fetchEpisode();
  }, [animeId, episodeId]);

  const handleProgress = (currentTime: number, duration: number) => {
    // Save progress to backend
    fetch('/api/episodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        episodeId,
        watchTime: currentTime,
        completed: false,
        userId: 'demo-user' // Would come from auth
      })
    }).catch(error => console.error("Failed to save progress:", error));
  };

  const handleComplete = () => {
    console.log("Episode completed!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!episode || !anime) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Episode Not Found</h1>
          <p className="text-muted-foreground">The episode you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const getTitle = () => {
    return (
      anime.title.english ||
      anime.title.romaji ||
      anime.title.native ||
      "Unknown Title"
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/anime/${animeId}/${getTitle().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Anime
            </Button>
            
            <div className="flex-1 text-center">
              <h1 className="text-lg font-semibold">
                {getTitle()}
              </h1>
              <Badge variant="secondary" className="ml-2">
                {episode.title || `Episode ${episode.number || 1}`}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <List className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Heart className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Player */}
      <div className="container mx-auto px-4 py-6">
        <VideoPlayer
          episode={episode}
          anime={anime}
          watchHistory={episode.watchHistory}
          onProgress={handleProgress}
          onComplete={handleComplete}
        />
      </div>

      {/* Episode Info */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Episode Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Details */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Synopsis</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {episode.synopsis || "No synopsis available."}
                </p>
              </div>
              
              {episode.duration && (
                <div>
                  <h3 className="font-semibold mb-2">Duration</h3>
                  <p className="text-muted-foreground">{episode.duration} minutes</p>
                </div>
              )}
              
              {episode.airDate && (
                <div>
                  <h3 className="font-semibold mb-2">Air Date</h3>
                  <p className="text-muted-foreground">
                    {new Date(episode.airDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
            </div>
            
            {/* Actions */}
            <div className="space-y-4">
              <h3 className="font-semibold mb-2">Actions</h3>
              
              <div className="space-y-2">
                <Button className="w-full">
                  Add to Watchlist
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to Favorites
                </Button>
                
                <Button variant="outline" className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Episode
                </Button>
              </div>
              
              {/* Related Episodes */}
              <div className="mt-6">
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => router.push(`/anime/${animeId}/${getTitle().toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}
                >
                  <List className="w-4 h-4 mr-2" />
                  View All Episodes
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}