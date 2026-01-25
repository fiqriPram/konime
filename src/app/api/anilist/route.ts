import { NextRequest, NextResponse } from "next/server";

const ANILIST_GRAPHQL =
  process.env.ANILIST_API_URL || "https://graphql.anilist.co";

const trendingQuery = `
  query {
    Page(page: 1, perPage: 12) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          large
        }
        bannerImage
        description
        episodes
        status
        genres
        averageScore
        studios {
          nodes {
            name
          }
        }
        season
        seasonYear
      }
    }
  }
`;

const seasonalQuery = `
  query ($season: MediaSeason!, $year: Int!) {
    Page(page: 1, perPage: 12) {
      media(season: $season, seasonYear: $year, sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          large
        }
        bannerImage
        description
        episodes
        status
        genres
        averageScore
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const popularQuery = `
  query {
    Page(page: 1, perPage: 12) {
      media(sort: POPULARITY_DESC, type: ANIME) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          large
        }
        bannerImage
        description
        episodes
        status
        genres
        averageScore
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const searchQuery = `
  query ($search: String!) {
    Page(page: 1, perPage: 20) {
      media(search: $search, type: ANIME) {
        id
        title {
          english
          romaji
          native
        }
        coverImage {
          large
        }
        bannerImage
        description
        episodes
        status
        genres
        averageScore
        studios {
          nodes {
            name
          }
        }
      }
    }
  }
`;

const animeDetailQuery = `
  query ($id: Int!) {
    Media(id: $id, type: ANIME) {
      id
      title {
        english
        romaji
        native
      }
      coverImage {
        large
      }
      bannerImage
      description
      episodes
      status
      genres
      averageScore
      studios {
        nodes {
          name
        }
      }
      season
      seasonYear
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      duration
      source
    }
  }
`;

async function fetchAniList(query: string, variables?: any) {
  const response = await fetch(ANILIST_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query,
      variables,
    }),
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!response.ok) {
    throw new Error(`AniList API error: ${response.status}`);
  }

  const data = await response.json();
  return data.data;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type");
  const search = searchParams.get("search");
  const id = searchParams.get("id");
  const season = searchParams.get("season");
  const year = searchParams.get("year");

  try {
    switch (type) {
      case "trending":
        const trendingData = await fetchAniList(trendingQuery);
        return NextResponse.json(trendingData.Page.media);

      case "seasonal":
        const currentSeason = season || getSeason();
        const currentYear = year ? parseInt(year) : new Date().getFullYear();
        const seasonalData = await fetchAniList(seasonalQuery, {
          season: currentSeason.toUpperCase(),
          year: currentYear,
        });
        return NextResponse.json(seasonalData.Page.media);

      case "popular":
        const popularData = await fetchAniList(popularQuery);
        return NextResponse.json(popularData.Page.media);

      case "search":
        if (!search) {
          return NextResponse.json(
            { error: "Search query required" },
            { status: 400 },
          );
        }
        const searchData = await fetchAniList(searchQuery, { search });
        return NextResponse.json(searchData.Page.media);

      case "detail":
        if (!id) {
          return NextResponse.json(
            { error: "Anime ID required" },
            { status: 400 },
          );
        }
        const detailData = await fetchAniList(animeDetailQuery, {
          id: parseInt(id),
        });
        return NextResponse.json(detailData.Media);

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 },
        );
    }
  } catch (error) {
    console.error("AniList API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime data" },
      { status: 500 },
    );
  }
}

function getSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
}
