import { NextRequest, NextResponse } from "next/server";

const ANILIST_GRAPHQL =
  process.env.ANILIST_API_URL || "https://graphql.anilist.co";

const genresQuery = `
  query {
    GenreCollection
  }
`;

const animeByGenreQuery = `
  query ($genre: String!, $page: Int) {
    Page(page: $page, perPage: 20) {
      pageInfo {
        hasNextPage
      }
      media(genre_in: [$genre], sort: POPULARITY_DESC, type: ANIME) {
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
  const genre = searchParams.get("genre");
  const page = searchParams.get("page");

  try {
    if (type === "genres") {
      const genresData = await fetchAniList(genresQuery);
      return NextResponse.json(genresData.GenreCollection);
    }

    if (type === "anime" && genre) {
      const pageNum = page ? parseInt(page) : 1;
      const animeData = await fetchAniList(animeByGenreQuery, {
        genre: genre,
        page: pageNum,
      });
      
      return NextResponse.json({
        anime: animeData.Page.media,
        pageInfo: animeData.Page.pageInfo,
      });
    }

    return NextResponse.json(
      { error: "Invalid parameters. Use ?type=genres or ?type=anime&genre={name}" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Genre API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch genre data" },
      { status: 500 }
    );
  }
}