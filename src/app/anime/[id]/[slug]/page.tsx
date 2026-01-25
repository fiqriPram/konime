import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Film, Play } from "lucide-react";
import Image from "next/image";

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
  bannerImage?: string;
  description?: string;
  episodes?: number;
  status?: string;
  genres?: string[];
  averageScore?: number;
  studios?: {
    nodes: { name: string }[];
  };
  season?: string;
  seasonYear?: number;
  startDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  endDate?: {
    year?: number;
    month?: number;
    day?: number;
  };
  duration?: number;
  source?: string;
}


async function getAnimeDetails(id: string): Promise<Anime | null> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/anime?type=detail&id=${id}`, {
      cache: "force-cache",
      next: { revalidate: 3600 }, // Revalidate every hour
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching anime details:", error);
    return null;
  }
}



export default async function AnimePage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>;
}) {
  const { id } = await params;
  const anime = await getAnimeDetails(id);

  if (!anime) {
    notFound();
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
      <Header />

      {/* Hero Section with Banner */}
      {anime.bannerImage && (
        <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden">
          <Image
            src={anime.bannerImage}
            alt={getTitle()}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
        </div>
      )}

      {/* Main Content Grid */}
      <main className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr] xl:gap-8">
          
          {/* Poster Column - Fixed Width */}
          <div className="lg:sticky lg:top-8 lg:h-fit space-y-6">
            {/* Poster Card */}
            <Card className="overflow-hidden border-0 shadow-lg">
              <div className="relative aspect-[3/4] w-full max-w-[320px] mx-auto lg:mx-0">
                <Image
                  src={anime.coverImage.large}
                  alt={getTitle()}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            {/* Quick Info Card */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 space-y-4">
                {anime.episodes && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Episodes</span>
                    <span className="text-sm text-muted-foreground">{anime.episodes}</span>
                  </div>
                )}
                
                {anime.status && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Status</span>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {anime.status.replace("_", " ").toLowerCase()}
                    </Badge>
                  </div>
                )}

                {anime.season && anime.seasonYear && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Season</span>
                    <span className="text-sm text-muted-foreground capitalize">
                      {anime.season} {anime.seasonYear}
                    </span>
                  </div>
                )}

                {anime.averageScore && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Score</span>
                    <span className="text-sm text-muted-foreground">{anime.averageScore}%</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Content Column */}
          <div className="space-y-6">
            {/* Title Section */}
            <div className={`${anime.bannerImage ? '-mt-12 lg:-mt-16' : ''} relative z-10`}>
              <Card className="border-0 shadow-lg bg-card/95 backdrop-blur-sm lg:bg-card">
                <CardContent className="p-6 lg:p-8">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight mb-4">
                    {getTitle()}
                  </h1>
                  
                  {/* Genres */}
                  {anime.genres && anime.genres.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {anime.genres.slice(0, 8).map((genre, index) => (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="text-xs px-3 py-1 rounded-full border-current/20 hover:border-current/40 transition-colors"
                        >
                          {genre}
                        </Badge>
                      ))}
                      {anime.genres.length > 8 && (
                        <Badge variant="secondary" className="text-xs px-3 py-1 rounded-full">
                          +{anime.genres.length - 8}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Synopsis Card */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold">Synopsis</CardTitle>
              </CardHeader>
              <CardContent>
                {anime.description ? (
                  <div 
                    className="prose prose-gray dark:prose-invert max-w-none text-sm leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
                    dangerouslySetInnerHTML={{
                      __html: anime.description
                        .replace(/<br\s*\/?>/g, '</p><p>')
                        .replace(/\n/g, '</p><p>')
                        .replace(/^(<p>)?/, '<p>')
                        .replace(/(<\/p>)?$/, '</p>')
                    }}
                  />
                ) : (
                  <p className="text-muted-foreground italic text-sm">No synopsis available.</p>
                )}
              </CardContent>
            </Card>

            {/* Episodes Section */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Film className="w-5 h-5" />
                  Episodes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 space-y-4">
                  <p className="text-muted-foreground">
                    Start watching this anime series
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
                    <Button asChild className="flex-1">
                      <Link href={`/watch/${anime.id}/episode-1`}>
                        <Play className="w-4 h-4 mr-2" />
                        Watch Now
                      </Link>
                    </Button>
                    <Button variant="outline" asChild className="flex-1">
                      <Link href={`/watch/${anime.id}/episode-1`}>
                        View Episodes
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
