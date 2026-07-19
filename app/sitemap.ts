import type { MetadataRoute } from "next";
import { MISSIONS } from "@/content/missions";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://stars-forever.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/story",
    "/partner-projects",
    "/category-3",
    "/revolutionary",
    "/get-involved",
    "/apply",
    "/speaking",
    "/podcast",
    "/strategy",
    "/constellation",
    ...MISSIONS.map((m) => `/partner-projects/${m.slug}`),
  ];
  return routes.map((route) => ({
    url: `${BASE}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
