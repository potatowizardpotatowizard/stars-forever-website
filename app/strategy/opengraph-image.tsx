import { pageOg, OG_SIZE } from "@/lib/og";

export const alt = "YouTube Strategy Consulting | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/podcast-hat.jpg",
    title: "YouTube Strategy Consulting",
    line: "Auzi Films helps creators find the ideas worth making and package them so they get watched.",
  });
}
