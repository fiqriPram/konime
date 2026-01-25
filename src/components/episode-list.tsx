"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Clock, Calendar, CheckCircle } from "lucide-react";

interface Episode {
  id: string;
  season?: number;
  number: number;
  title?: string;
  synopsis?: string;
  duration?: number;
  airDate?: string;
  thumbnail?: string;
}

interface EpisodeListProps {
  animeId: string;
  episodes: Episode[];
  watchHistory?: Record<string, {
    watchTime: number;
    totalTime: number;
    completed: boolean;
  }>;
}

export function EpisodeList({ animeId, episodes, watchHistory }: EpisodeListProps) {
  const [selectedSeason, setSelectedSeason] = useState<number | null>(null);
  
  // Group episodes by season
  const episodesBySeason = episodes.reduce((acc: Record<number, Episode[]>, episode: Episode) => {
    const season = episode.season || 0;
    if (!acc[season]) {
      acc[season] = [];
    }
    acc[season].push(episode);
    return acc;
  }, {});

  const seasons = Object.keys(episodesBySeason)
    .map(Number)
    .sort((a, b) => a - b);



  const formatDate = (dateString?: string) => {
    if (!dateString) return "Unknown";
    return new Date(dateString).toLocaleDateString();
  };

  const getEpisodeProgress = (episodeId: string) => {
    const history = watchHistory?.[episodeId];
    if (!history) return null;
    return (history.watchTime / history.totalTime) * 100;
  };

  const getEpisodeStatus = (episodeId: string) => {
    const history = watchHistory?.[episodeId];
    if (!history) return null;
    if (history.completed) return "completed";
    if (history.watchTime > 0) return "watching";
    return "unwatched";
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "watching":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const displayEpisodes = selectedSeason !== null 
    ? episodesBySeason[selectedSeason] || []
    : episodes;

  return (
    <div className="space-y-6">
      {/* Season Selector */}
      {seasons.length > 1 && (
        <div className="flex gap-2 mb-4">
          <Button
            variant={selectedSeason === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSeason(null)}
          >
            All Episodes
          </Button>
          {seasons.map((season) => (
            <Button
              key={season}
              variant={selectedSeason === season ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSeason(season)}
            >
              Season {season}
            </Button>
          ))}
        </div>
      )}

      {/* Episodes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayEpisodes.map((episode) => {
          const progress = getEpisodeProgress(episode.id);
          const status = getEpisodeStatus(episode.id);
          
          return (
            <Card key={episode.id} className="group hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold">
                      {episode.title || `Episode ${episode.number}`}
                    </CardTitle>
                    {episode.season && selectedSeason === null && (
                      <Badge variant="secondary" className="ml-2">
                        S{episode.season}
                      </Badge>
                    )}
                  </div>
                  {progress !== null && (
                    <div className="text-sm text-muted-foreground">
                      {Math.round(progress)}% watched
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {/* Thumbnail */}
                <Link href={`/watch/${animeId}/${episode.id}`}>
                  <div className="relative aspect-video rounded-t-lg overflow-hidden bg-black">
                    {episode.thumbnail ? (
                      <img
                        src={episode.thumbnail}
                        alt={episode.title || `Episode ${episode.number}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                        <Play className="w-12 h-12 text-white opacity-70" />
                      </div>
                    )}
                    
                    {/* Status Overlay */}
                    {status && (
                      <div className="absolute top-2 right-2">
                        <Badge className={getStatusColor(status)}>
                          {status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                          {status}
                        </Badge>
                      </div>
                    )}
                    
                    {/* Progress Bar */}
                    {progress !== null && progress > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                        <div 
                          className="h-full bg-blue-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </Link>
                
                {/* Episode Info */}
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {episode.duration && (
                      <>
                        <Clock className="w-4 h-4" />
                        <span>{episode.duration} min</span>
                      </>
                    )}
                    {episode.airDate && (
                      <>
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(episode.airDate)}</span>
                      </>
                    )}
                  </div>
                  
                  {episode.synopsis && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {episode.synopsis}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}