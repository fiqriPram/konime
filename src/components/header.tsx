"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg">AniTrack</span>
          </Link>
          <nav className="hidden sm:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/anime"
              className="transition-colors hover:text-foreground/80"
            >
              Browse
            </Link>
            <Link
              href="/genres"
              className="transition-colors hover:text-foreground/80"
            >
              Genres
            </Link>
            <Link
              href="/search"
              className="transition-colors hover:text-foreground/80"
            >
              Search
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden mr-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none md:hidden">
            {/* Mobile search could go here */}
          </div>
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild className="hidden sm:inline-flex">
              <Link href="/register">Sign Up</Link>
            </Button>
            <ThemeToggle />
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 right-0 bg-background border-b sm:hidden animate-fade-in">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              <Link
                href="/anime"
                className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse
              </Link>
              <Link
                href="/genres"
                className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Genres
              </Link>
              <Link
                href="/search"
                className="block py-2 text-sm font-medium transition-colors hover:text-foreground/80"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search
              </Link>
              <div className="pt-2 border-t">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="w-full justify-start"
                >
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Login
                  </Link>
                </Button>
                <Button size="sm" asChild className="w-full justify-start mt-2">
                  <Link
                    href="/register"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
