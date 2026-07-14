// Image manifest. Every photo slot on the site is named here.
// Drop a file into public/images/ with the listed filename, rebuild,
// and the photo appears in place of its labeled placeholder.
// Captions read like documentary lower thirds: who, where, when.

export type ImageSlot = {
  /** Expected filename inside public/images/ */
  file: string;
  alt: string;
  caption?: { who?: string; where?: string; when?: string };
  /** aspect ratio as width / height, used to reserve space */
  ratio: string;
};

export const IMAGES: Record<string, ImageSlot> = {
  // ---- Home -------------------------------------------------------------
  "home-hero": {
    file: "home-hero.jpg",
    alt: "Creators standing under a desert night sky filled with stars",
    caption: { where: "Joshua Tree, California", when: "May 2026" },
    ratio: "16 / 9",
  },
  "home-door-creator": {
    file: "home-door-creator.jpg",
    alt: "A creator filming on location during a Stars Forever project",
    ratio: "4 / 5",
  },
  "home-door-supporter": {
    file: "home-door-supporter.jpg",
    alt: "A baptism during a Stars Forever mission",
    ratio: "4 / 5",
  },
  "home-proof-tokyo": {
    file: "home-proof-tokyo.jpg",
    alt: "The team and new friends gathered in Japan",
    caption: { where: "Japan", when: "Winter 2025" },
    ratio: "3 / 2",
  },
  "home-proof-joshua-tree": {
    file: "home-proof-joshua-tree.jpg",
    alt: "The first cohort gathered together at night in the desert",
    caption: { where: "Joshua Tree, California", when: "May 2026" },
    ratio: "3 / 2",
  },
  "home-proof-beast-games": {
    file: "home-proof-beast-games.jpg",
    alt: "Contestants gathered on the set of Beast Games",
    caption: { where: "Beast Games set", when: "2025" },
    ratio: "3 / 2",
  },

  // ---- The Story ----------------------------------------------------------
  "story-set": {
    file: "story-set.jpg",
    alt: "The set of Beast Games at night",
    caption: { where: "Beast Games set", when: "July 2024 to February 2025" },
    ratio: "21 / 9",
  },
  "story-prayer": {
    file: "story-prayer.jpg",
    alt: "Contestants praying together before a challenge",
    caption: { who: "Contestants", where: "Beast Games set" },
    ratio: "3 / 2",
  },
  "story-church-service": {
    file: "story-church-service.jpg",
    alt: "A church service held on set",
    caption: { where: "Beast Games set" },
    ratio: "3 / 2",
  },
  "story-baptism-island": {
    file: "story-baptism-island.jpg",
    alt: "A baptism in the ocean off a remote island",
    caption: { where: "A remote island" },
    ratio: "3 / 2",
  },
  "story-tribute": {
    file: "story-tribute.jpg",
    alt: "Portrait of Auzi's brother",
    ratio: "4 / 5",
  },
  "story-vision": {
    file: "story-vision.jpg",
    alt: "A crowd of people lit by their phone screens in the dark",
    ratio: "21 / 9",
  },
  "story-founder-benjiman": {
    file: "story-founder-benjiman.jpg",
    alt: "Portrait of Benjiman Schlegel",
    ratio: "4 / 5",
  },
  "story-founder-ben-pierce": {
    file: "story-founder-ben-pierce.jpg",
    alt: "Portrait of Ben Pierce",
    ratio: "4 / 5",
  },
  "story-founder-auzi": {
    file: "story-founder-auzi.jpg",
    alt: "Portrait of Auzi Films",
    ratio: "4 / 5",
  },

  // ---- Mission: Tokyo Drift ----------------------------------------------
  "tokyo-hero": {
    file: "tokyo-hero.jpg",
    alt: "Walking the neon streets of Tokyo at night",
    caption: { where: "Tokyo, Japan", when: "November 2025" },
    ratio: "21 / 9",
  },
  "tokyo-owen": {
    file: "tokyo-owen.jpg",
    alt: "Filming on the streets of Japan",
    caption: { where: "Japan" },
    ratio: "3 / 2",
  },
  "tokyo-subway": {
    file: "tokyo-subway.jpg",
    alt: "A night out with new friends in Tokyo",
    caption: { where: "Tokyo" },
    ratio: "3 / 2",
  },
  "tokyo-hitchhike": {
    file: "tokyo-hitchhike.jpg",
    alt: "On the road in rural Japan",
    caption: { where: "Rural Japan" },
    ratio: "3 / 2",
  },
  "tokyo-circuit": {
    file: "tokyo-circuit.jpg",
    alt: "The crew gathered under the giant lucky cat",
    caption: { where: "Japan" },
    ratio: "3 / 2",
  },
  "tokyo-ebisu": {
    file: "tokyo-ebisu.jpg",
    alt: "Inside the light museum in Tokyo",
    caption: { where: "Tokyo" },
    ratio: "3 / 2",
  },
  "tokyo-church": {
    file: "tokyo-church.jpg",
    alt: "Friends gathered at church in Tokyo",
    caption: { where: "Lifehouse Church, Tokyo" },
    ratio: "3 / 2",
  },
  "tokyo-seven": {
    file: "tokyo-seven.jpg",
    alt: "A night shoot in the old streets of Japan",
    caption: { where: "Japan" },
    ratio: "3 / 2",
  },
  "tokyo-baptism": {
    file: "tokyo-baptism.jpg",
    alt: "A baptism service in Tokyo",
    caption: { where: "Tokyo" },
    ratio: "3 / 2",
  },
  "tokyo-friends": {
    file: "tokyo-friends.jpg",
    alt: "Sharing a meal with new friends in Japan",
    caption: { where: "Tokyo" },
    ratio: "3 / 2",
  },

  // ---- Mission: Revolutionary Cohort, Joshua Tree --------------------------
  "joshua-hero": {
    file: "joshua-hero.jpg",
    alt: "The first cohort standing together in the desert at dusk",
    caption: { where: "Joshua Tree, California", when: "May 2026" },
    ratio: "21 / 9",
  },
  "joshua-candles": {
    file: "joshua-candles.jpg",
    alt: "The cohort gathered in the house after dark on opening night",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "joshua-teaching": {
    file: "joshua-teaching.jpg",
    alt: "A teaching session in the living room",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "joshua-discussion": {
    file: "joshua-discussion.jpg",
    alt: "Creators in group discussion",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "joshua-prayer": {
    file: "joshua-prayer.jpg",
    alt: "Alone with God in the desert at dusk",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "joshua-meal": {
    file: "joshua-meal.jpg",
    alt: "Gathered around the table in the cohort house",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "joshua-stargazing": {
    file: "joshua-stargazing.jpg",
    alt: "The cohort lying on the rocks under the night sky",
    caption: { where: "Joshua Tree National Park" },
    ratio: "3 / 2",
  },
  "joshua-desert": {
    file: "joshua-desert.jpg",
    alt: "The cohort under a Joshua tree on the last day",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },

  // ---- Mission: Beast Games -------------------------------------------------
  "beast-hero": {
    file: "beast-hero.jpg",
    alt: "The Beast Games arena",
    caption: { where: "Beast Games set", when: "July 2024 to February 2025" },
    ratio: "21 / 9",
  },
  "beast-podcast-jeremy": {
    file: "beast-podcast-jeremy.jpg",
    alt: "Jeremy recording a Beast Games podcast episode",
    caption: { who: "Jeremy" },
    ratio: "3 / 2",
  },
  "beast-podcast-courtney": {
    file: "beast-podcast-courtney.jpg",
    alt: "Courtney recording a Beast Games podcast episode",
    caption: { who: "Courtney" },
    ratio: "3 / 2",
  },
  "beast-podcast-auzi": {
    file: "beast-podcast-auzi.jpg",
    alt: "Auzi hanging on in the five million dollar challenge",
    caption: { who: "Auzi Films" },
    ratio: "3 / 2",
  },
  "beast-set-life": {
    file: "beast-set-life.jpg",
    alt: "Life between challenges on the Beast Games set",
    caption: { where: "Beast Games set" },
    ratio: "3 / 2",
  },
  "beast-island-prayer": {
    file: "beast-island-prayer.jpg",
    alt: "Praying together on the island beach",
    caption: { where: "A remote island" },
    ratio: "3 / 2",
  },
  "beast-baptism": {
    file: "beast-baptism.jpg",
    alt: "Arriving at the remote island where two girls were baptized",
    caption: { where: "A remote island" },
    ratio: "3 / 2",
  },

  // ---- Revolutionary ---------------------------------------------------------
  "rev-strip-1": {
    file: "rev-strip-1.jpg",
    alt: "Creators settling into the cohort house",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "rev-strip-2": {
    file: "rev-strip-2.jpg",
    alt: "The cohort outside after dark on the first night",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "rev-strip-3": {
    file: "rev-strip-3.jpg",
    alt: "Group discussion during a teaching session",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "rev-strip-4": {
    file: "rev-strip-4.jpg",
    alt: "The whole cohort gathered on a desert hill at dusk",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "rev-ben-pierce": {
    file: "rev-ben-pierce.jpg",
    alt: "Portrait of Ben Pierce",
    ratio: "4 / 5",
  },

  // ---- Speaking ---------------------------------------------------------------
  "speak-auzi": {
    file: "speak-auzi.jpg",
    alt: "Portrait of Auzi Weber",
    ratio: "4 / 5",
  },
  "speak-benjiman": {
    file: "speak-benjiman.jpg",
    alt: "Portrait of Benjiman Schlegel",
    ratio: "4 / 5",
  },

  // ---- Give ----------------------------------------------------------------------
  "give-reached": {
    file: "give-reached.jpg",
    alt: "A creator sharing the gospel on camera",
    ratio: "3 / 2",
  },
  "give-baptism": {
    file: "give-baptism.jpg",
    alt: "A baptism made possible by giving",
    ratio: "3 / 2",
  },
  "give-discipleship": {
    file: "give-discipleship.jpg",
    alt: "Discipleship over an open Bible",
    ratio: "3 / 2",
  },
};
