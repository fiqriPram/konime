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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const id = searchParams.get("id");

  try {
    switch (type) {
      case "trending":
        const trendingData = await fetchKitsu("/anime", {
          sort: "-user_count",
          "page[limit]": "12",
        });
        return NextResponse.json(trendingData.data);

      case "popular":
        const popularData = await fetchKitsu("/anime", {
          sort: "-average_rating",
          "page[limit]": "12",
        });
        return NextResponse.json(popularData.data);

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
        return NextResponse.json(searchData.data);

      case "detail":
        if (!id) {
          return NextResponse.json(
            { error: "Anime ID required" },
            { status: 400 },
          );
        }
        const detailData = await fetchKitsu(`/anime/${id}`);
        return NextResponse.json(detailData.data);

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
