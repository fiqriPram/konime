import { NextRequest, NextResponse } from "next/server";

const KITSU_API_URL = process.env.KITSU_API_URL || "https://api.kitsu.io";

interface KitsuAnime {
  id: string;
  attributes: {
    canonicalTitle: string;
    titles: {
      en?: string;
      en_jp?: string;
      ja_jp?: string;
    };
    synopsis: string;
    posterImage: {
      large: string;
    };
    coverImage?: {
      large: string;
    };
    episodeCount: number;
    status: string;
    subtype: string;
    averageRating: string;
    startDate: string;
    endDate: string;
    ageRating: string;
    youtubeVideoId?: string;
  };
}

async function fetchKitsu(endpoint: string, params?: Record<string, string>) {
  const url = new URL(endpoint, KITSU_API_URL);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Accept: "application/vnd.api+json",
      "Content-Type": "application/vnd.api+json",
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`Kitsu API error: ${response.status}`);
  }

  return response.json();
}

function getCurrentSeason() {
  const month = new Date().getMonth();
  const year = new Date().getFullYear();
  
  let season;
  if (month >= 2 && month <= 4) season = "spring";
  else if (month >= 5 && month <= 7) season = "summer";
  else if (month >= 8 && month <= 10) season = "fall";
  else season = "winter";
  
  return { season, year };
}

function convertKitsuToAniListFormat(kitsuData: KitsuAnime[]) {
  return kitsuData.map((item) => ({
    id: item.id,
    title: {
      english: item.attributes.titles.en || item.attributes.canonicalTitle,
      romaji: item.attributes.titles.en_jp || item.attributes.canonicalTitle,
      native: item.attributes.titles.ja_jp || item.attributes.canonicalTitle,
    },
    coverImage: {
      large: item.attributes.posterImage.large,
    },
    bannerImage: item.attributes.coverImage?.large,
    description: item.attributes.synopsis,
    episodes: item.attributes.episodeCount,
    status: item.attributes.status,
    genres: [], // Kitsu genres would require additional API calls
    averageScore: item.attributes.averageRating
      ? parseFloat(item.attributes.averageRating) * 10
      : null,
    studios: { nodes: [] }, // Studio info would require additional API calls
    kitsuId: item.id,
  }));
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const id = searchParams.get("id");
  const page = searchParams.get("page");
  const season = searchParams.get("season");
  const year = searchParams.get("year");
  const format = searchParams.get("format");

  try {
    switch (type) {
      case "trending":
        const trendingData = await fetchKitsu("/anime", {
          sort: "-user_count",
          "page[limit]": "12",
          "filter[season]": getCurrentSeason().season,
          "filter[seasonYear]": getCurrentSeason().year.toString(),
        });
        return NextResponse.json(convertKitsuToAniListFormat(trendingData.data));

      case "seasonal":
        const currentSeason = season || getCurrentSeason().season;
        const currentYear = year ? parseInt(year) : getCurrentSeason().year;
        const seasonalData = await fetchKitsu("/anime", {
          sort: "-user_count",
          "page[limit]": "12",
          "filter[season]": currentSeason,
          "filter[seasonYear]": currentYear.toString(),
        });
        return NextResponse.json(convertKitsuToAniListFormat(seasonalData.data));

      case "popular":
        const popularData = await fetchKitsu("/anime", {
          sort: "-average_rating",
          "page[limit]": "12",
        });
        return NextResponse.json(convertKitsuToAniListFormat(popularData.data));

      case "search":
        if (!search) {
          return NextResponse.json(
            { error: "Search query required" },
            { status: 400 },
          );
        }
        const searchData = await fetchKitsu("/anime", {
          "filter[text]": search,
          "page[limit]": "20",
        });
        return NextResponse.json(convertKitsuToAniListFormat(searchData.data));

      case "detail":
        if (!id) {
          return NextResponse.json(
            { error: "Anime ID required" },
            { status: 400 },
          );
        }
        const detailData = await fetchKitsu(`/anime/${id}`, {
          include: "genres,productions",
        });
        const formattedDetail = convertKitsuToAniListFormat([detailData.data])[0];
        
        // Add genres if available
        if (detailData.included) {
          const genres = detailData.included
            .filter((item: any) => item.type === "genres")
            .map((item: any) => item.attributes.name);
          formattedDetail.genres = genres;
        }
        
        return NextResponse.json(formattedDetail);

      case "genres":
        // Get all available genres
        const genresData = await fetchKitsu("/genres", {
          "filter[kind]": "anime",
          "page[limit]": "50",
        });
        return NextResponse.json(genresData.data.map((item: any) => item.attributes.name));

      case "anime-by-genre":
        const genre = searchParams.get("genre");
        if (!genre) {
          return NextResponse.json(
            { error: "Genre parameter required" },
            { status: 400 },
          );
        }
        const pageNum = page ? parseInt(page) : 1;
        const animeByGenreData = await fetchKitsu("/anime", {
          "filter[genres]": genre,
          "page[limit]": "20",
          "page[offset]": ((pageNum - 1) * 20).toString(),
          sort: "-user_count",
        });
        
        const formattedAnime = convertKitsuToAniListFormat(animeByGenreData.data);
        return NextResponse.json({
          anime: formattedAnime,
          pageInfo: {
            hasNextPage: animeByGenreData.data.length === 20,
          },
        });

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("Kitsu API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime data from Kitsu" },
      { status: 500 },
    );
  }
}
