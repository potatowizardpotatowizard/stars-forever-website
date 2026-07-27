// The eighteen niches of the digital world, shared by the Digital
// Sky, the hero's niche cycler, and the claim strip. Plain data:
// importable from server and client components alike.
export const SKY_NODES: { label: string; x: number; y: number }[] = [
  { label: "Food", x: 0.1, y: 0.26 },
  { label: "Gaming", x: 0.24, y: 0.14 },
  { label: "Music", x: 0.4, y: 0.24 },
  { label: "Fitness", x: 0.57, y: 0.12 },
  { label: "Travel", x: 0.74, y: 0.22 },
  { label: "Fashion", x: 0.9, y: 0.14 },
  { label: "Sports", x: 0.07, y: 0.55 },
  { label: "Tech", x: 0.2, y: 0.42 },
  { label: "Comedy", x: 0.34, y: 0.52 },
  { label: "Art", x: 0.48, y: 0.4 },
  { label: "Beauty", x: 0.63, y: 0.48 },
  { label: "Cars", x: 0.78, y: 0.42 },
  { label: "Science", x: 0.9, y: 0.56 },
  { label: "Outdoors", x: 0.12, y: 0.78 },
  { label: "Film", x: 0.3, y: 0.72 },
  { label: "Finance", x: 0.48, y: 0.68 },
  { label: "Family", x: 0.66, y: 0.74 },
  { label: "Education", x: 0.84, y: 0.78 },
];

export const NICHES = SKY_NODES.map((n) => n.label);
