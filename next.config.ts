import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s4.anilist.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "media.kitsu.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.kitsu.io",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
};

export default nextConfig;
