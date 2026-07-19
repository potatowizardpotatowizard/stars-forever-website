// The Constellation: creators who love Jesus, scattered across the earth
// like stars. Members are added by hand after Auzi approves each request;
// only what they consent to share appears here. City level only, never
// exact locations.

export type ConstellationMember = {
  name: string;
  href: string | null;
  city: string;
  country: string;
  lat: number;
  lng: number;
};

export const CONSTELLATION = {
  title: "The Constellation",
  kicker: "Creators across the earth",
  intro:
    "A global family of creators who love Jesus. Put your star on the map, get exclusive access to the private group chat, connect with likeminded creators near you, and find a friend in every city you travel through.",
  how: {
    kicker: "How it works",
    items: [
      "Ask to join with the form below. Every request is personally reviewed.",
      "Once approved, your star appears on the map: your name, your city, and a link to your work. Nothing else, and only ever with your consent.",
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
