import type { NextConfig } from "next";

const imageHosts = (process.env.NEXT_IMAGE_HOSTS ?? "")
  .split(",")
  .map((hostname) => hostname.trim().toLowerCase())
  .filter(Boolean);
const validHostname = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*$/i;

if (imageHosts.some((hostname) => !validHostname.test(hostname))) {
  throw new Error("NEXT_IMAGE_HOSTS must be a comma-separated list of exact hostnames.");
}

const nextConfig: NextConfig = {
  distDir: process.env.NEXT_DIST_DIR ?? ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      ...imageHosts.map((hostname) => ({
        protocol: "https" as const,
        hostname,
      })),
    ],
    qualities: [60, 75],
    formats: ["image/avif", "image/webp"],
  },
};

const apiUrl = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL)?.replace(/\/+$/, "");
if (apiUrl) {
  nextConfig.rewrites = async () => [
    {
      source: "/media/:path*",
      destination: `${apiUrl}/media/:path*`,
    },
  ];
}

export default nextConfig;
