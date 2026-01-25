import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Star,
  Calendar,
  Clock,
  Film,
  ExternalLink,
  Plus,
  Heart,
} from "lucide-react";

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
  kitsuId?: string;
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

async function AnimePage({ params }: { params: Promise<{ id: string }> }) {
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

  const getStatusColor = (status?: string) => {
    switch (status?.toLowerCase()) {
      case "releasing":
      case "currently airing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "finished":
      case "finished airing":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "not yet released":
      case "upcoming":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  const getScoreColor = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const formatDate = (date?: {
    year?: number;
    month?: number;
    day?: number;
  }) => {
    if (!date?.year) return "Unknown";
    const month = date.month
      ? new Date(date.month, 1).toLocaleString("default", { month: "short" })
      : "";
    const day = date.day ? `, ${date.day}` : "";
    return `${month}${day}, ${date.year}`;
  };

  const getExternalLinks = () => {
    const links = [];
    if (typeof anime.id === "number") {
      links.push({
        name: "AniList",
        url: `https://anilist.co/anime/${anime.id}`,
      });
    }
    if (anime.kitsuId) {
      links.push({
        name: "Kitsu",
        url: `https://kitsu.io/anime/${anime.kitsuId}`,
      });
    }
    return links;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section with Banner */}
      {anime.bannerImage && (
        <div className="relative h-64 sm:h-80 lg:h-96">
          <Image
            src={anime.bannerImage}
            alt={getTitle()}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
      )}

      <main className="container mx-auto px-4 py-8">
<div className="grid gap-8 lg:grid-cols-3">
          {/* Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {/* Cover Image */}
            <Card>
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                <Image
                  src={anime.coverImage.large}
                  alt={getTitle()}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </Card>

            {/* Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-1">Studio</h4>
                    <p className="text-sm text-muted-foreground">
                      {anime.studios.nodes[0].name}
                    </p>
                  </div>
                )}

                {(anime.startDate?.year || anime.endDate?.year) && (
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Aired
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(anime.startDate)} -{" "}
                      {formatDate(anime.endDate)}
                    </p>
                  </div>
                )}

                {anime.season && anime.seasonYear && (
                  <div>
                    <h4 className="font-semibold mb-1">Season</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {anime.season} {anime.seasonYear}
                    </p>
                  </div>
                )}

                {anime.source && (
                  <div>
                    <h4 className="font-semibold mb-1">Source</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {anime.source}
                    </p>
                  </div>
                )}

                {anime.averageScore && (
                  <div>
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Score
                    </h4>
                    <p
                      className={`text-sm font-medium ${getScoreColor(anime.averageScore)}`}
                    >
                      {anime.averageScore}% / 100
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  Start Watching
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Mark as Completed
                </Button>
                <Button variant="outline" className="w-full" size="sm">
                  Add to Plan to Watch
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Actions */}
            <div>
              <div className="mb-4">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                  {getTitle()}
                </h1>
                {anime.title.romaji && anime.title.romaji !== getTitle() && (
                  <p className="text-xl text-muted-foreground">
                    {anime.title.romaji}
                  </p>
                )}
                {anime.title.native &&
                  anime.title.native !== anime.title.romaji && (
                    <p className="text-lg text-muted-foreground">
                      {anime.title.native}
                    </p>
                  )}
              </div>

              <div className="flex flex-wrap gap-3 mb-6">
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add to Watchlist
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <Heart className="h-4 w-4" />
                  Add to Favorites
                </Button>
                {getExternalLinks().map((link) => (
                  <Button variant="ghost" size="sm" asChild key={link.name}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {link.name}
                    </a>
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {anime.status && (
                  <Badge className={getStatusColor(anime.status)}>
                    {anime.status.replace("_", " ").toUpperCase()}
                  </Badge>
                )}
                {anime.episodes && (
                  <Badge variant="outline">{anime.episodes} Episodes</Badge>
                )}
                {anime.averageScore && (
                  <Badge
                    variant="outline"
                    className={getScoreColor(anime.averageScore)}
                  >
                    <Star className="h-3 w-3 mr-1" />
                    {anime.averageScore}%
                  </Badge>
                )}
                {anime.duration && (
                  <Badge variant="outline">
                    <Clock className="h-3 w-3 mr-1" />
                    {anime.duration} min
                  </Badge>
                )}
              </div>
            </div>

            {/* Synopsis */}
            <Card>
              <CardHeader>
                <CardTitle>Synopsis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  {anime.description ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: anime.description.replace(/\n/g, "<br />"),
                      }}
                    />
                  ) : (
                    <p className="text-muted-foreground">
                      No synopsis available.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Genres</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {anime.genres.map((genre) => (
                      <Badge key={genre} variant="secondary">
                        {genre}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>


        </div>
      </main>
    </div>
  );
}

export default AnimePage;
