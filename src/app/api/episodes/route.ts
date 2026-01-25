import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const animeId = searchParams.get("animeId");
  const episodeId = searchParams.get("episodeId");
  const season = searchParams.get("season");
  const type = searchParams.get("type");

  try {
    switch (type) {
      case "list":
        if (!animeId) {
          return NextResponse.json(
            { error: "Anime ID required" },
            { status: 400 }
          );
        }

        const episodes = await prisma.episode.findMany({
          where: { animeId },
          orderBy: [
            { season: { sort: "asc" } },
            { number: { sort: "asc" } }
          ],
          include: {
            anime: {
              select: {
                id: true,
                title: true,
                coverImage: true
              }
            }
          }
        });

        // Group episodes by season
        const episodesBySeason = episodes.reduce((acc: any, episode: any) => {
          const season = episode.season || 0;
          if (!acc[season]) {
            acc[season] = [];
          }
          acc[season].push(episode);
          return acc;
        }, {} as Record<number, any>);

        return NextResponse.json({
          animeId,
          episodesBySeason,
          totalEpisodes: episodes.length
        });

      case "detail":
        if (!episodeId) {
          return NextResponse.json(
            { error: "Episode ID required" },
            { status: 400 }
          );
        }

        const episode = await prisma.episode.findUnique({
          where: { id: episodeId },
          include: {
            anime: {
              select: {
                id: true,
                title: true,
                coverImage: true
              }
            }
          }
        });

        if (!episode) {
          return NextResponse.json(
            { error: "Episode not found" },
            { status: 404 }
          );
        }

        // Get user watch history if available (would need authentication)
        const watchHistory = await prisma.watchHistory.findUnique({
          where: { 
            userId_episodeId: {
              userId: "demo-user", // This would come from auth
              episodeId 
            }
          }
        });

        return NextResponse.json({
          ...episode,
          watchHistory: watchHistory ? {
            watchTime: watchHistory.watchTime,
            totalTime: watchHistory.totalTime,
            completed: watchHistory.completed
          } : null
        });

      case "season":
        if (!animeId || !season) {
          return NextResponse.json(
            { error: "Anime ID and season required" },
            { status: 400 }
          );
        }

        const seasonEpisodes = await prisma.episode.findMany({
          where: { 
            animeId,
            season: parseInt(season)
          },
          orderBy: { number: "asc" }
        });

        return NextResponse.json({
          animeId,
          season: parseInt(season),
          episodes: seasonEpisodes,
          totalEpisodes: seasonEpisodes.length
        });

      default:
        return NextResponse.json(
          { error: "Invalid type parameter" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Episode API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch episode data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const episodeId = searchParams.get("episodeId");

  if (!episodeId) {
    return NextResponse.json(
      { error: "Episode ID required" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const { watchTime, completed, userId } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    // Update or create watch history
    const watchHistory = await prisma.watchHistory.upsert({
      where: {
        userId_episodeId: {
          userId,
          episodeId
        }
      },
      update: {
        watchTime: watchTime,
        completed: completed || false
      },
      create: {
        userId,
        episodeId,
        watchTime,
        totalTime: 1440, // Default 24 minutes
        completed: completed || false
      }
    });

    return NextResponse.json({ success: true, watchHistory });
  } catch (error) {
    console.error("Watch history update error:", error);
    return NextResponse.json(
      { error: "Failed to update watch history" },
      { status: 500 }
    );
  }
}