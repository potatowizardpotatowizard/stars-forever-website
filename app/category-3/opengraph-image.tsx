import { pageOg, OG_SIZE } from "@/lib/og";

export const alt = "Category 1, 2, and 3 Explained | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/tokyo-drift-car.jpg",
    title: "Category 1, 2, & 3 Explained",
    line: "The educational framework behind Stars Forever: the difference between Category 1, 2, and 3 content, and why it matters.",
  });
}
