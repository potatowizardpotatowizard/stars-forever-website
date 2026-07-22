import { pageOg, OG_SIZE } from "@/lib/og";
import { GET_INVOLVED } from "@/content/getInvolved";

export const alt = "Get Involved | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/story-baptism-island.jpg",
    title: "Get Involved",
    line: GET_INVOLVED.intro,
  });
}
