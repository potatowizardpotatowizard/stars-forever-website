import { pageOg, OG_SIZE } from "@/lib/og";

export const alt = "Apply | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/beast-set-life.jpg",
    title: "Start an Application",
    line: "Apply for a Partner Project: a specific project that shares Jesus with a secular audience. It costs you nothing.",
  });
}
