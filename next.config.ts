import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      { source: "/missions", destination: "/partner-projects", permanent: true },
      {
        source: "/missions/:slug",
        destination: "/partner-projects/:slug",
        permanent: true,
      },
      {
        source: "/partner-project",
        destination: "/partner-projects",
        permanent: true,
      },
      { source: "/give", destination: "/get-involved", permanent: true },
    ];
  },
};

export default nextConfig;
