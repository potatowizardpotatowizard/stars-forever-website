import { pageOg, OG_SIZE } from "@/lib/og";
import { PARTNER } from "@/content/partner";

export const alt = "Partner Projects | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/beast-hero.jpg",
    title: "Partner Projects",
    line: PARTNER.definition,
  });
}
