import { pageOg, OG_SIZE } from "@/lib/og";

export const alt = "The Vision | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "brand/bg-greenpurple-star.jpg",
    title: "The Vision",
    line: "In ten years: the digital world evangelized, every platform and niche reached with the Gospel.",
  });
}
