import { pageOg, OG_SIZE } from "@/lib/og";
import { PODCAST } from "@/content/podcast";

export const alt = "Respectfully Inspired Podcast | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/podcast-hero.jpg",
    title: "Respectfully Inspired Podcast",
    line: PODCAST.tagline,
  });
}
