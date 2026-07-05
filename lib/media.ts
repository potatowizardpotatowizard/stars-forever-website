import fs from "fs";
import path from "path";
import { IMAGES, type ImageSlot } from "@/content/images";

export type ResolvedSlot = ImageSlot & {
  name: string;
  /** Public URL if the file exists in public/images, otherwise null */
  src: string | null;
};

const IMAGES_DIR = path.join(process.cwd(), "public", "images");

/** Resolve a named slot to a real file or a labeled placeholder. */
export function resolveSlot(name: string): ResolvedSlot {
  const entry = IMAGES[name];
  if (!entry) {
    throw new Error(`Unknown image slot: ${name}`);
  }
  const exists = fs.existsSync(path.join(IMAGES_DIR, entry.file));
  return { ...entry, name, src: exists ? `/images/${entry.file}` : null };
}
