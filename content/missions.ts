export type MissionSection = {
  kicker?: string;
  heading?: string;
  paragraphs: string[];
  imageSlots?: string[];
};

export type Mission = {
  slug: string;
  name: string;
  location: string;
  partner: string;
  date: string;
  summary: string;
  cardImageSlot: string;
  heroSlot: string;
  burningQuestion?: string;
  /** YouTube embed featured at the top of the project page */
  videoEmbed?: { youtubeId: string; caption: string };
  /** Photo slots that click through to an external link */
  slotLinks?: Record<string, { href: string; label: string }>;
  sections: MissionSection[];
  links: { label: string; href: string }[];
};

export const MISSIONS_INDEX = {
  title: "Missions",
  kicker: "Case studies",
  intro:
    "Every mission is a real story of God moving through creators. Read them like field reports: who went, where, what happened, and what it proves.",
};

export const MISSIONS: Mission[] = [
  {
    slug: "tokyo-drift",
    name: "Tokyo Drift",
    location: "Tokyo and rural Japan",
    partner: "Owen Tucker, Creative Partner 1",
    date: "November 4 to December 4, 2025",
    summary:
      "What would it look like to share Jesus in a secular YouTube video? Thirty days in Japan answered the question and became the blueprint.",
    cardImageSlot: "home-proof-tokyo",
    heroSlot: "tokyo-hero",
    burningQuestion:
      "What would it look like to share Jesus in a secular YouTube video?",
    videoEmbed: {
      youtubeId: "Y3qLQOLS-3s",
      caption: "Tokyo Drift, the full video",
    },
    sections: [
      {
        kicker: "The dream",
        paragraphs: [
          "We believe God places certain dreams on our hearts. Owen, a Japanese lifestyle YouTuber, always dreamed of drifting in Japan. He loves cars and adventures. So we started there, and we sought God daily: God, help us make something of eternal value. Help us to be bold with the gospel in this video and our lives. Help us reach a secular audience who truly needs to know you.",
        ],
        imageSlots: ["tokyo-owen", "tokyo-subway"],
      },
      {
        kicker: "God moved",
        paragraphs: [
          "After our very first prayer walk, we felt led to talk to strangers with cameras. Five minutes later on the subway, the first strangers we met happened to be drifting YouTubers. When we were stuck in rural Japan with no ride, we prayed for one within a minute, and a Japanese grandma pulled over forty seven seconds later, on camera.",
          "By the second week we were drifting in a six car tandem at the biggest drifting event in the world, invited by people we had met through that first subway conversation.",
        ],
        imageSlots: ["tokyo-hitchhike", "tokyo-circuit", "tokyo-ebisu"],
      },
      {
        kicker: "Beyond the video",
        paragraphs: [
          "We shared life deeply with four unbelievers: church, lunches, baptisms, theme parks, birthdays. We discipled Seven, a local Japanese creator who drove hours to our shoots and learned to seek God inside his art. And pastor Kento, moved by the work, invited us in to talk about the mission.",
          "This trip is now the blueprint: help a creator seek God, encounter His power personally, preach the gospel through their creative gifts, strengthen the local church, and watch lives change.",
        ],
        imageSlots: ["tokyo-church", "tokyo-seven", "tokyo-friends"],
      },
    ],
    links: [
      {
        label: "Watch Tokyo Drift on YouTube",
        href: "https://youtu.be/Y3qLQOLS-3s",
      },
      {
        label: "Watch the podcast with Owen Tucker about creating Tokyo Drift",
        href: "https://youtu.be/lmKsfZ4lbts",
      },
    ],
  },
  {
    slug: "revolutionary-cohort",
    name: "Revolutionary Cohort",
    location: "Joshua Tree, California",
    partner: "Ben Pierce, Steiger Ministries",
    date: "May 15 to 17, 2026",
    summary:
      "Ten creators from different niches, one desert house, a weekend of full commitment. Proof that the model works, and the invitation to the next one.",
    cardImageSlot: "home-proof-joshua-tree",
    heroSlot: "joshua-hero",
    sections: [
      {
        kicker: "The gathering",
        paragraphs: [
          "The first cohort brought roughly ten creators from different niches to a shared house in the desert. No stage, no audience, no networking. A think tank, not a conference.",
          "The weekend opened in darkness. Each creator walked into an unlit room and was handed a lit candle. Then came the story of Beast Games, the Category 3 framework, and the four goals of the weekend: a deeper love for Jesus, challenged paradigms, real community, and a target to aim at.",
        ],
        imageSlots: ["joshua-candles", "joshua-teaching"],
      },
      {
        kicker: "The rhythm",
        paragraphs: [
          "Teaching on seeking God. Group discussion that pushed back and sharpened. Personal prayer time alone in the desert. Shared meals around one table. And a complete digital media fast for the whole weekend, so nothing competed with the reason everyone came.",
          "On the final night, every creator presented a Category 3 idea for their own platform, was prayed over, and was driven blindfolded into Joshua Tree National Park to end the weekend stargazing.",
        ],
        imageSlots: [
          "joshua-discussion",
          "joshua-prayer",
          "joshua-meal",
          "joshua-stargazing",
        ],
      },
      {
        kicker: "What it proves",
        paragraphs: [
          "Creators tend to make the content of the events they attend and the examples they have. The cohort exists to give them a new example: Jesus preached in every kind of context, secular or Christian forward. The first weekend proved the model works. The next one is the invitation.",
        ],
        imageSlots: ["joshua-desert"],
      },
    ],
    links: [{ label: "Learn about Revolutionary", href: "/revolutionary" }],
  },
  {
    slug: "beast-games",
    name: "Beast Games",
    location: "On set and beyond",
    partner: "Auzi Films",
    date: "July 2024 to February 2025",
    summary:
      "Ten plus podcasts filmed around the biggest competition show on earth, many carrying Jesus conversations to a secular audience of fans.",
    cardImageSlot: "home-proof-beast-games",
    heroSlot: "beast-hero",
    slotLinks: {
      "beast-podcast-jeremy": {
        href: "https://youtu.be/iLmdLG0fWIU",
        label: "Watch the podcast ▶",
      },
      "beast-podcast-courtney": {
        href: "https://youtu.be/FKqkqQt5CsY",
        label: "Watch the podcast ▶",
      },
      "beast-podcast-auzi": {
        href: "https://youtu.be/Lav88YGfIIo",
        label: "Listen to Auzi's personal Beast Games testimony ▶",
      },
    },
    sections: [
      {
        kicker: "The platform",
        paragraphs: [
          "Beast Games gathered an enormous secular audience. Around the show, Auzi filmed more than ten podcasts, many containing Jesus conversations, all reaching fans of the show. These podcasts became the first personal proof of Category 3 content, and they are now what we teach creative partners.",
        ],
        imageSlots: ["beast-set-life"],
      },
      {
        kicker: "The testimonies",
        paragraphs: [
          "Three episodes carry the story best. Jeremy shares what it was like to be the most outspoken Christian on set. Courtney shares her experience of being baptized on a remote island. And Auzi gives his insider recap of everything God did on Beast Games.",
        ],
        imageSlots: [
          "beast-podcast-jeremy",
          "beast-podcast-courtney",
          "beast-podcast-auzi",
          "beast-baptism",
        ],
      },
      {
        kicker: "Where it started",
        paragraphs: [
          "The full origin of Stars Forever runs through this set: a brother's death, a prayer, and the most Auzi had ever seen God move. Read The Story for the whole account.",
        ],
      },
    ],
    links: [
      {
        label: "Jeremy's testimony podcast",
        href: "https://youtu.be/iLmdLG0fWIU",
      },
      {
        label: "Courtney's baptism story",
        href: "https://youtu.be/FKqkqQt5CsY",
      },
      { label: "Read How Beast Games Inspired Stars Forever", href: "/story" },
    ],
  },
];
