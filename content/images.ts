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
    alt: "A drift car sliding through a corner at a Japanese circuit",
    caption: { where: "Japan", when: "Winter 2025" },
    ratio: "3 / 2",
  },
  "home-proof-joshua-tree": {
    file: "home-proof-joshua-tree.jpg",
    alt: "Creators gathered around candlelight in a dark desert house",
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
    caption: { where: "Beast Games set", when: "Season one" },
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
    alt: "A drift car mid slide under stadium lights in Japan",
    caption: { where: "Ebisu Circuit, Japan", when: "November 2025" },
    ratio: "21 / 9",
  },
  "tokyo-owen": {
    file: "tokyo-owen.jpg",
    alt: "Owen Tucker filming in Tokyo",
    caption: { who: "Owen Tucker", where: "Tokyo" },
    ratio: "3 / 2",
  },
  "tokyo-subway": {
    file: "tokyo-subway.jpg",
    alt: "Meeting drifting YouTubers on the Tokyo subway",
    caption: { where: "Tokyo subway" },
    ratio: "3 / 2",
  },
  "tokyo-hitchhike": {
    file: "tokyo-hitchhike.jpg",
    alt: "Hitchhiking to a drift event in rural Japan",
    caption: { where: "Rural Japan" },
    ratio: "3 / 2",
  },
  "tokyo-circuit": {
    file: "tokyo-circuit.jpg",
    alt: "Cars lined up at a Japanese drift circuit",
    caption: { where: "Nikko Circuit, Japan" },
    ratio: "3 / 2",
  },
  "tokyo-ebisu": {
    file: "tokyo-ebisu.jpg",
    alt: "Tandem drifting at Ebisu Circuit",
    caption: { where: "Ebisu Circuit, Fukushima" },
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
    alt: "Seven, a local Japanese creator, on a video shoot",
    caption: { who: "Seven", where: "Japan" },
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
    alt: "The desert at dusk outside Joshua Tree",
    caption: { where: "Joshua Tree, California", when: "May 2026" },
    ratio: "21 / 9",
  },
  "joshua-candles": {
    file: "joshua-candles.jpg",
    alt: "Creators holding lit candles in a dark room",
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
    alt: "Personal prayer time in the desert",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "joshua-meal": {
    file: "joshua-meal.jpg",
    alt: "A shared meal around one long table",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "joshua-stargazing": {
    file: "joshua-stargazing.jpg",
    alt: "Stargazing at Hidden Valley in Joshua Tree National Park",
    caption: { where: "Joshua Tree National Park" },
    ratio: "3 / 2",
  },
  "joshua-desert": {
    file: "joshua-desert.jpg",
    alt: "Joshua trees under an open sky",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },

  // ---- Mission: Beast Games -------------------------------------------------
  "beast-hero": {
    file: "beast-hero.jpg",
    alt: "The Beast Games arena",
    caption: { where: "Beast Games set", when: "Season one" },
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
    alt: "Auzi recording his Beast Games recap",
    caption: { who: "Auzi Films" },
    ratio: "3 / 2",
  },
  "beast-set-life": {
    file: "beast-set-life.jpg",
    alt: "Life between challenges on the Beast Games set",
    caption: { where: "Beast Games set" },
    ratio: "3 / 2",
  },
  "beast-baptism": {
    file: "beast-baptism.jpg",
    alt: "Two girls baptized on a remote island",
    caption: { where: "A remote island" },
    ratio: "3 / 2",
  },

  // ---- Revolutionary ---------------------------------------------------------
  "rev-strip-1": {
    file: "rev-strip-1.jpg",
    alt: "Creators arriving at the cohort house",
    caption: { where: "Joshua Tree, California" },
    ratio: "3 / 2",
  },
  "rev-strip-2": {
    file: "rev-strip-2.jpg",
    alt: "Candlelight during the opening night",
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
    alt: "Stargazing in Joshua Tree National Park",
    caption: { where: "Joshua Tree National Park" },
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
