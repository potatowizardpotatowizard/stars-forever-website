import { pageOg, OG_SIZE } from "@/lib/og";

export const alt = "Speaking | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/speak-auzi.jpg",
    title: "Speaking",
    line: "We are not pastors. We are creators who have shared Jesus in places most ministries never reach.",
  });
}
