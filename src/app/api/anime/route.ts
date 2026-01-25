import { NextRequest, NextResponse } from "next/server";

async function fetchFromAniList(type: string, params?: any) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = new URL("/api/anilist", baseUrl);
  url.searchParams.append("type", type);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`AniList fetch failed: ${response.status}`);
  }
  return response.json();
}

async function fetchFromKitsu(type: string, params?: any) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const url = new URL("/api/kitsu", baseUrl);
  url.searchParams.append("type", type);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value as string);
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error(`Kitsu fetch failed: ${response.status}`);
  }
  return response.json();
}

function convertKitsuToAniListFormat(kitsuData: any[]) {
  return kitsuData.map((item) => ({
    id: item.id,
    title: {
      english: item.attributes.canonicalTitle,
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
  const fallback = searchParams.get("fallback") === "true";

  try {
    // Try AniList first
    try {
      const anilistParams: any = {};
      if (search) anilistParams.search = search;
      if (id) anilistParams.id = id;

      const anilistData = await fetchFromAniList(type || "", anilistParams);
      return NextResponse.json(anilistData);
    } catch (anilistError) {
      console.warn("AniList failed, trying Kitsu:", anilistError);

      if (!fallback) {
        return NextResponse.json(
          { error: "AniList API unavailable. Use ?fallback=true to try Kitsu" },
          { status: 503 },
        );
      }

      // Fallback to Kitsu
      try {
        const kitsuParams: any = {};
        if (search) kitsuParams.search = search;
        if (id) kitsuParams.id = id;

        const kitsuData = await fetchFromKitsu(type || "", kitsuParams);
        const formattedData = convertKitsuToAniListFormat(kitsuData);
        return NextResponse.json(formattedData);
      } catch (kitsuError) {
        console.error("Both AniList and Kitsu failed:", kitsuError);
        return NextResponse.json(
          { error: "Both AniList and Kitsu APIs are unavailable" },
          { status: 500 },
        );
      }
    }
  } catch (error) {
    console.error("Combined API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime data" },
      { status: 500 },
    );
  }
}
