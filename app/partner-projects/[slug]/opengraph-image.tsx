import { pageOg, OG_SIZE } from "@/lib/og";
import { IMAGES } from "@/content/images";
import { MISSIONS } from "@/content/missions";

export const alt = "Partner Project | Stars Forever";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function OgImage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const mission = MISSIONS.find((m) => m.slug === slug);
  const file = mission ? IMAGES[mission.cardImageSlot]?.file : undefined;
  return pageOg({
    image: file ? `images/${file}` : "images/beast-hero.jpg",
    title: mission?.name ?? "Partner Projects",
    line:
      mission?.summary ??
      "We collaborate with creators on projects that share Jesus with their secular audience.",
  });
}
