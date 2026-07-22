import { pageOg, OG_SIZE } from "@/lib/og";

export const alt = "YouTube Strategy Consulting | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function OgImage() {
  return pageOg({
    image: "images/podcast-hat.jpg",
    // Portrait photo (1080x1616): start the visible band 16% down
    // so the face and the microphone both make the frame.
    crop: { aspect: 1616 / 1080, top: 0.16 },
    title: "YouTube Strategy Consulting",
    line: "Auzi Films helps creators find the ideas worth making and package them so they get watched.",
  });
}
