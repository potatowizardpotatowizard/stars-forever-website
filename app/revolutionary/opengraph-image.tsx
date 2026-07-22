import { pageOg, OG_SIZE } from "@/lib/og";
import { REVOLUTIONARY } from "@/content/revolutionary";

export const alt = "Revolutionary Cohort | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/rev-strip-1.jpg",
    title: "Revolutionary Cohort",
    line: REVOLUTIONARY.definition,
  });
}
