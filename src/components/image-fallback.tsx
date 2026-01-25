interface ImageFallbackProps {
  className?: string;
  title?: string;
}

export function ImageFallback({ className, title }: ImageFallbackProps) {
  return (
    <div
      className={`flex items-center justify-center bg-muted text-muted-foreground ${className}`}
    >
      <svg
        className="w-8 h-8"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    </div>
  );
}
