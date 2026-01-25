"use client";

import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

interface ClickableGenreBadgeProps {
  genre: string;
  className?: string;
  variant?: "default" | "secondary" | "destructive" | "outline";
}

export function ClickableGenreBadge({ genre, className, variant = "secondary" }: ClickableGenreBadgeProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/genre/${genre.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
  };

  return (
    <Badge
      variant={variant}
      className={`hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer ${className}`}
      onClick={handleClick}
    >
      {genre}
    </Badge>
  );
}