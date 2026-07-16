import { GIVE } from "@/content/give";

export const GET_INVOLVED = {
  title: "Get Involved",
  intro:
    "Everything we do runs on two kinds of people: creators who bring their God dreams, and supporters who fuel the missions. Both are ministry.",

  // Quick actions under the hero intro; Give resolves to GIVING_URL in the page
  quickActions: [
    { label: "Apply as a Creator", href: "/apply" },
    { label: "Give to the Mission", href: null },
    { label: "Book a Call", href: null },
  ],

  creators: {
    kicker: "For creators",
    heading: "Bring Us Your God Dream",
    paths: [
      {
        title: "Apply for a Partner Project",
        body: "We partner with one creator per month on a single project that shares Jesus with their secular audience. It costs you nothing. Bring your most audacious idea.",
        cta: "Start an application",
        href: "/apply",
      },
      {
        title: "Attend a Revolutionary Cohort",
        body: "A weekend that equips and activates creators to boldly share Jesus with a secular audience. Currently invite only. Consistency and commitment matter, not metrics.",
        cta: "About the cohort",
        href: "/revolutionary",
      },
      {
        title: "Book a Call",
        body: "A call is not a commitment. It is a place to give your vision a chance at becoming reality. Tell us what God put on your heart.",
        cta: "Book a Call",
        href: null, // resolved to CONTACT.bookingUrl in the page
      },
    ],
  },

  give: GIVE,
};
