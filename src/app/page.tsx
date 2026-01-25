import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Discover & Track Your <span className="text-primary">Anime</span>
            </h1>
            <p className="mx-auto max-w-2xl text-gray-500 md:text-xl dark:text-gray-400">
              A clean, minimalist platform to browse, discover, and track your
              favorite anime with rich metadata from AniList and Kitsu.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/anime">Browse Anime</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/search">Search</Link>
            </Button>
          </div>

          <div className="w-full max-w-6xl mx-auto mt-16">
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <CardTitle>Discover</CardTitle>
                  <CardDescription>
                    Find trending, seasonal, and popular anime with detailed
                    metadata
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <CardTitle>Track</CardTitle>
                  <CardDescription>
                    Keep track of what you&apos;re watching, completed, and
                    planning to watch
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105">
                <CardHeader>
                  <CardTitle>Organize</CardTitle>
                  <CardDescription>
                    Create watchlists and favorites to manage your anime
                    collection
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
