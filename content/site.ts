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

export const CONTACT = {
  primaryEmail: "flixforauzi@gmail.com",
  speakingEmail: "benjimanschleg@gmail.com",
  bookingUrl: "https://calendar.app.google/RctCvj7JcxaCzEMv5",
};

// Donation platform link. Left null for v1; drop a URL in later and the
// Give page picks it up without any redesign.
export const GIVING_URL: string | null = null;

export const NAV = [
  { label: "The Story", href: "/story" },
  { label: "Partner Projects", href: "/partner-projects" },
  { label: "Christian Content Explained", href: "/category-3" },
  { label: "Revolutionary Cohort", href: "/revolutionary" },
  { label: "Contact", href: "/get-involved" },
];

// The hero menu on the home page: the site itself, presented like a tape menu.
export const HERO_MENU = [
  { label: "The Story", href: "/story" },
  { label: "Partner Projects", href: "/partner-projects" },
  { label: "Christian Content Explained", href: "/category-3" },
  { label: "Revolutionary Cohort", href: "/revolutionary" },
  { label: "Contact", href: "/get-involved" },
];

// Secondary pages reachable from the footer.
export const FOOTER_NAV = [
  { label: "Speaking", href: "/speaking" },
];

export const SOCIAL = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Podcast", href: "https://youtube.com" },
];

export const FOUNDERS = [
  {
    name: "Benjiman Schlegel",
    line: "Digital missionary, storyteller, and creative strategist reaching souls on the mission field of the internet.",
    href: "https://benjiman7.com",
    imageSlot: "story-founder-benjiman",
  },
  {
    name: "Ben Pierce",
    line: "Leads Revolutionary with Steiger Ministries, calling artists to reach the global youth culture for Jesus.",
    href: "https://steiger.org",
    imageSlot: "story-founder-ben-pierce",
  },
  {
    name: "Auzi Films",
    line: "Creator of nearly a decade who saw God move on the biggest sets in the world and never looked back.",
    href: null,
    imageSlot: "story-founder-auzi",
  },
];
