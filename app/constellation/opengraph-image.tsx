import { pageOg, OG_SIZE } from "@/lib/og";
import { CONSTELLATION } from "@/content/constellation";

export const alt = "The Constellation | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/joshua-stargazing.jpg",
    title: "The Constellation",
    line: CONSTELLATION.intro.split(". ")[0] + ".",
  });
}
