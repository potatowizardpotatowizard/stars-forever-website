// Global site constants: navigation, contacts, links, footer.
// All user facing copy lives in content modules, never in components.

export const SITE_NAME = "Stars Forever";

export const SITE_DESCRIPTION =
  "Stars Forever is a ministry that helps creators use their lives and platforms for Jesus.";

export const ANCHOR_VERSE = {
  // Reproduced exactly as provided. Do not edit.
  text: "“Those who are wise shall shine Like the brightness of the firmament, And those who turn many to righteousness Like the stars forever and ever.”",
  reference: "Daniel 12:3",
};

// The verse summoned by typing the Name anywhere on the site.
export const SUMMON_VERSE = {
  text: "“Most assuredly, I say to you, he who hears My word and believes in Him who sent Me has everlasting life, and shall not come into judgment, but has passed from death into life.”",
  reference: "John 5:24",
};

// Shown to people right after they submit a Constellation request.
export const WHATSAPP_INVITE = "https://chat.whatsapp.com/FgJbeSdVcxDGI411fuFhlp";

export const CONTACT = {
  primaryEmail: "auzi@starsforever.co",
  speakingEmail: "benjimanschleg@gmail.com",
  bookingUrl: "https://calendar.app.google/RctCvj7JcxaCzEMv5",
};

// Donation platform link: EquipNet missionary page for Auzi Weber.
export const GIVING_URL: string | null =
  "https://www.equipnet.org/missionaries/aweber";

export const NAV = [
  { label: "The Story", href: "/story" },
  { label: "Partner Projects", href: "/partner-projects" },
  { label: "Find Your Creator Type", href: "/category-3" },
  { label: "Revolutionary Cohort", href: "/revolutionary" },
  { label: "Get Involved", href: "/get-involved" },
];

// The hero menu on the home page: the site itself, presented like a tape menu.
export const HERO_MENU = [
  { label: "The Story", href: "/story" },
  { label: "Partner Projects", href: "/partner-projects" },
  { label: "Find Your Creator Type", href: "/category-3" },
  { label: "Revolutionary Cohort", href: "/revolutionary" },
  { label: "Get Involved", href: "/get-involved" },
];

// Secondary pages reachable from the footer.
export const FOOTER_NAV = [
  { label: "The Vision", href: "/vision" },
  { label: "The Constellation", href: "/constellation" },
  { label: "Speaking", href: "/speaking" },
  { label: "Podcast", href: "/podcast" },
  { label: "YouTube Strategy", href: "/strategy" },
];

export const SOCIAL = [
  { label: "Instagram", href: "https://www.instagram.com/starsforever.co/" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/auzifilms/" },
  { label: "YouTube", href: "https://www.youtube.com/@RespectfullyInspired" },
];

export const FOUNDERS = [
  {
    name: "Auzi Films",
    line: "Creator of nearly a decade who saw God move on the biggest sets in the world and never looked back.",
    href: "https://www.linkedin.com/in/auzifilms/",
    instagram: "https://www.instagram.com/auzi.films/",
    imageSlot: "story-founder-auzi",
  },
  {
    name: "Benjiman Schlegel",
    line: "Digital missionary, storyteller, and creative strategist reaching souls on the mission field of the internet.",
    href: "https://benjiman7.com",
    instagram: "https://www.instagram.com/benjiman/",
    imageSlot: "story-founder-benjiman",
  },
];
