// The Constellation: creators who love Jesus, scattered across the earth
// like stars. Members are added by hand after Auzi approves each request;
// only what they consent to share appears here. State level only, never
// exact locations.

export type ConstellationMember = {
  name: string;
  href: string | null;
  /** State or region: the resolution stars live at, never exact */
  state: string;
  country: string;
  lat: number;
  lng: number;
};

export const CONSTELLATION = {
  title: "The Constellation",
  kicker: "Creators across the earth",
  intro:
    "A map of creators who love Jesus and share the Stars Forever vision.",
  how: {
    kicker: "How it works",
    items: [
      "Ask to join with the form below. Every request is personally reviewed.",
      "Once approved, your star appears on the map: your name, your state, and a link to your work. Nothing else, and only ever with your consent.",
      "Approved creators also get invited into the private Stars Forever community.",
    ],
  },
  emptyNote: "The first stars are being placed. Yours could be among them.",
  form: {
    kicker: "Join the Constellation",
    heading: "Put Your Star on the Map",
    sub: "Get exclusive access to the constellation group chat",
  },
  members: [] as ConstellationMember[],
};
