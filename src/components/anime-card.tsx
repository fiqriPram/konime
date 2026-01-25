import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  kitsuId?: string;
}

interface AnimeCardProps {
  anime: Anime;
}

export function AnimeCard({ anime }: AnimeCardProps) {
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

  return (
    <Link href={`/anime/${anime.id}`}>
      <Card className="group cursor-pointer overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl w-full">
        <div className="relative aspect-[3/4] w-full overflow-hidden">
          <Image
            src={anime.coverImage.large}
            alt={getTitle()}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2UyZThmMCIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY0NzQ4YiI+CiAgICAgIEltYWdlCiAgICA8L3RleHQ+Cjwvc3ZnPg=="
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <div className="line-clamp-3 text-sm">
              {anime.description?.replace(/<[^>]*>/g, "").substring(0, 100)}...
            </div>
          </div>
        </div>
        <CardContent className="p-3 space-y-2">
          <h3 className="line-clamp-2 font-semibold text-sm leading-tight min-h-10">
            {getTitle()}
          </h3>

          <div className="flex flex-wrap gap-1 mb-2">
            {anime.status && (
              <Badge
                variant="secondary"
                className={`text-[10px] px-1.5 py-0.5 ${getStatusColor(anime.status)}`}
              >
                {anime.status.replace("_", " ").toUpperCase()}
              </Badge>
            )}
            {anime.episodes && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0.5">
                {anime.episodes} EP
              </Badge>
            )}
            {anime.averageScore && (
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0.5 ${getScoreColor(anime.averageScore)}`}
              >
                ⭐ {anime.averageScore}%
              </Badge>
            )}
          </div>

          <div className="flex flex-wrap gap-1">
            {anime.genres?.slice(0, 2).map((genre) => (
              <Badge
                key={genre}
                variant="secondary"
                className="text-[10px] px-1.5 py-0.5"
              >
                {genre}
              </Badge>
            ))}
            {anime.genres && anime.genres.length > 2 && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0.5">
                +{anime.genres.length - 2}
              </Badge>
            )}
          </div>

          {anime.studios?.nodes && anime.studios.nodes.length > 0 && (
            <div className="text-xs text-muted-foreground truncate">
              {anime.studios.nodes[0].name}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
