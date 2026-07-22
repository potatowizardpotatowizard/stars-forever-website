import { pageOg, OG_SIZE } from "@/lib/og";

export const alt = "The Story | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/story-set.jpg",
    title: "The Story",
    line: "Seven days before Beast Games season one, Auzi's brother died. What happened next became Stars Forever.",
  });
}
