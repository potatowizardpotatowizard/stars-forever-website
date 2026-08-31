"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import ConstellationMap from "@/components/ConstellationMap";
import Kicker from "@/components/Kicker";
import {
  CONSTELLATION,
  type ConstellationMember,
} from "@/content/constellation";

// The Constellation opens as a flight: the page lands inside deep space
// with the hero copy glowing center screen, and scrolling assembles the
// planet out of scattered stars — Earth's landmasses as particles,
// members as bright stars at their real coordinates. Once built: drag
// to spin, pinch to zoom, tap a star to meet the creator. Falls back to
// the flat hero and map under reduced motion or without WebGL.

const R = 100;

function toXYZ(lat: number, lng: number, r = R): [number, number, number] {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lng + 180) * Math.PI) / 180;
  return [
    -r * Math.sin(phi) * Math.cos(theta),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ];
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// ---- region drill-down ---------------------------------------------
// continent → camera centroid; membership resolved from each member's
// country name with a lat/lng fallback for anything unlisted
const CONTINENTS: Record<string, { lat: number; lng: number }> = {
  "North America": { lat: 42, lng: -100 },
  "South America": { lat: -15, lng: -60 },
  Europe: { lat: 50, lng: 15 },
  Africa: { lat: 2, lng: 20 },
  Asia: { lat: 34, lng: 95 },
  Oceania: { lat: -26, lng: 140 },
};

const COUNTRY_CONTINENT: Record<string, string> = {
  usa: "North America",
  "united states": "North America",
  canada: "North America",
  mexico: "North America",
  panama: "North America",
  brazil: "South America",
  argentina: "South America",
  chile: "South America",
  colombia: "South America",
  peru: "South America",
  iceland: "Europe",
  uk: "Europe",
  "united kingdom": "Europe",
  england: "Europe",
  germany: "Europe",
  france: "Europe",
  spain: "Europe",
  italy: "Europe",
  norway: "Europe",
  netherlands: "Europe",
  poland: "Europe",
  sweden: "Europe",
  switzerland: "Europe",
  portugal: "Europe",
  ireland: "Europe",
  japan: "Asia",
  india: "Asia",
  philippines: "Asia",
  "south korea": "Asia",
  korea: "Asia",
  china: "Asia",
  indonesia: "Asia",
  thailand: "Asia",
  israel: "Asia",
  singapore: "Asia",
  vietnam: "Asia",
  malaysia: "Asia",
  australia: "Oceania",
  "new zealand": "Oceania",
  "south africa": "Africa",
  nigeria: "Africa",
  kenya: "Africa",
  ghana: "Africa",
  egypt: "Africa",
  uganda: "Africa",
  ethiopia: "Africa",
  morocco: "Africa",
};

function continentOf(m: ConstellationMember): string {
  const named = COUNTRY_CONTINENT[m.country.trim().toLowerCase()];
  if (named) return named;
  const { lat, lng } = m;
  if (lng < -25) return lat >= 13 ? "North America" : "South America";
  if (lng < 52 && lat <= 36) return "Africa";
  if (lng < 45) return "Europe";
  if (lng >= 110 && lat < 5) return "Oceania";
  return "Asia";
}

// Places the drill-down offers even when no creator lives there yet:
// the map is explorable first, inhabited second.
const COUNTRY_CATALOG: Record<string, { name: string; lat: number; lng: number }[]> = {
  "North America": [
    { name: "United States", lat: 39, lng: -98 },
    { name: "Canada", lat: 53, lng: -103 },
    { name: "Mexico", lat: 23.6, lng: -102.5 },
    { name: "Panama", lat: 8.5, lng: -80.8 },
  ],
  "South America": [
    { name: "Brazil", lat: -10.8, lng: -52.9 },
    { name: "Argentina", lat: -34.6, lng: -64.7 },
    { name: "Colombia", lat: 4.6, lng: -74.1 },
    { name: "Chile", lat: -33.5, lng: -70.7 },
    { name: "Peru", lat: -9.2, lng: -75 },
  ],
  Europe: [
    { name: "United Kingdom", lat: 53.8, lng: -1.6 },
    { name: "Germany", lat: 51.1, lng: 10.4 },
    { name: "France", lat: 46.6, lng: 2.5 },
    { name: "Spain", lat: 40.3, lng: -3.7 },
    { name: "Italy", lat: 42.8, lng: 12.8 },
    { name: "Netherlands", lat: 52.2, lng: 5.5 },
    { name: "Norway", lat: 61, lng: 9 },
    { name: "Iceland", lat: 64.9, lng: -18.6 },
    { name: "Portugal", lat: 39.6, lng: -8.1 },
    { name: "Poland", lat: 52, lng: 19.3 },
  ],
  Africa: [
    { name: "South Africa", lat: -29, lng: 24.7 },
    { name: "Nigeria", lat: 9.1, lng: 8.7 },
    { name: "Kenya", lat: 0.2, lng: 37.9 },
    { name: "Ghana", lat: 7.9, lng: -1 },
    { name: "Egypt", lat: 26.8, lng: 30 },
  ],
  Asia: [
    { name: "Japan", lat: 36.2, lng: 138.3 },
    { name: "South Korea", lat: 36.5, lng: 127.9 },
    { name: "Philippines", lat: 12.9, lng: 121.8 },
    { name: "India", lat: 21.1, lng: 78.7 },
    { name: "Indonesia", lat: -2.5, lng: 118 },
    { name: "Thailand", lat: 15.1, lng: 101 },
    { name: "Israel", lat: 31.4, lng: 35 },
    { name: "Singapore", lat: 1.35, lng: 103.8 },
  ],
  Oceania: [
    { name: "Australia", lat: -25.3, lng: 133.8 },
    { name: "New Zealand", lat: -41.8, lng: 172.8 },
  ],
};

const US_STATES: { name: string; lat: number; lng: number }[] = [
  { name: "California", lat: 36.7, lng: -119.4 },
  { name: "Texas", lat: 31, lng: -99 },
  { name: "Florida", lat: 27.8, lng: -81.6 },
  { name: "New York", lat: 42.9, lng: -75.5 },
  { name: "Tennessee", lat: 35.8, lng: -86.4 },
  { name: "Georgia", lat: 32.6, lng: -83.4 },
  { name: "Arizona", lat: 34.2, lng: -111.6 },
  { name: "Colorado", lat: 39, lng: -105.5 },
  { name: "Washington", lat: 47.4, lng: -120.5 },
  { name: "North Carolina", lat: 35.5, lng: -79.4 },
];

const COUNTRY_CANON: Record<string, string> = {
  usa: "United States",
  us: "United States",
  "united states": "United States",
  america: "United States",
  uk: "United Kingdom",
  england: "United Kingdom",
  "united kingdom": "United Kingdom",
  korea: "South Korea",
  "south korea": "South Korea",
};

function canonCountry(c: string): string {
  const k = c.trim().toLowerCase();
  return COUNTRY_CANON[k] ?? c.trim();
}

type View =
  | { level: 0 }
  | { level: 1; continent: string }
  | { level: 2; continent: string; country: string }
  | { level: 3; continent: string; country: string; state: string };

type FlyReq = {
  id: number;
  lat: number;
  lng: number;
  zoom: number;
  zoomOnly?: boolean;
};

type Mode = "loading" | "globe" | "flat";

export default function ConstellationGlobe({
  members: notionMembers = [],
}: {
  members?: ConstellationMember[];
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("loading");
  const [built, setBuilt] = useState(false);
  const [selected, setSelected] = useState<ConstellationMember | null>(null);
  const [linesOn, setLinesOn] = useState(false);
  const linesOnRef = useRef(false);
  const selectedRef = useRef<ConstellationMember | null>(null);
  const builtRef = useRef(false);
  selectedRef.current = selected;
  linesOnRef.current = linesOn;
  builtRef.current = built;

  const seen = new Set<string>();
  const members = [...CONSTELLATION.members, ...notionMembers].filter((m) => {
    const key = `${m.name}|${m.state}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const membersRef = useRef(members);
  membersRef.current = members;

  // ---- drill-down: continent → country → city --------------------
  const [view, setView] = useState<View>({ level: 0 });
  const flyReq = useRef<FlyReq | null>(null);
  const flyId = useRef(0);

  const inView = members.filter((m) => {
    if (view.level === 0) return true;
    if (continentOf(m) !== view.continent) return false;
    if (view.level === 1) return true;
    if (canonCountry(m.country) !== view.country) return false;
    if (view.level === 2) return true;
    return m.state === view.state;
  });
  const chips: { name: string; count: number; onPick: () => void }[] = [];
  const centroid = (list: ConstellationMember[]) => ({
    lat: list.reduce((a, m) => a + m.lat, 0) / list.length,
    lng: list.reduce((a, m) => a + m.lng, 0) / list.length,
  });
  const narrow = () =>
    typeof window !== "undefined" && window.innerWidth < 640;
  const fly = (lat: number, lng: number, zoom: number, zoomOnly = false) => {
    flyReq.current = { id: ++flyId.current, lat, lng, zoom, zoomOnly };
  };
  if (view.level === 0) {
    Object.keys(CONTINENTS).forEach((c) => {
      const list = members.filter((m) => continentOf(m) === c);
      chips.push({
        name: c,
        count: list.length,
        onPick: () => {
          setView({ level: 1, continent: c });
          fly(CONTINENTS[c].lat, CONTINENTS[c].lng, narrow() ? 380 : 300);
        },
      });
    });
  } else if (view.level === 1) {
    const inCont = members.filter((m) => continentOf(m) === view.continent);
    const names = [
      ...(COUNTRY_CATALOG[view.continent] ?? []).map((c) => c.name),
      ...inCont.map((m) => canonCountry(m.country)),
    ];
    [...new Set(names)].forEach((c) => {
      const list = inCont.filter((m) => canonCountry(m.country) === c);
      const cat = (COUNTRY_CATALOG[view.continent] ?? []).find(
        (x) => x.name === c,
      );
      const ct = list.length ? centroid(list) : cat!;
      chips.push({
        name: c,
        count: list.length,
        onPick: () => {
          setView({ level: 2, continent: view.continent, country: c });
          fly(ct.lat, ct.lng, narrow() ? 310 : 250);
        },
      });
    });
  } else if (view.level === 2) {
    const inCountry = members.filter(
      (m) =>
        continentOf(m) === view.continent &&
        canonCountry(m.country) === view.country,
    );
    const catalog = view.country === "United States" ? US_STATES : [];
    const names = [
      ...catalog.map((x) => x.name),
      ...inCountry.map((m) => m.state),
    ];
    [...new Set(names)].forEach((c) => {
      const list = inCountry.filter((m) => m.state === c);
      const cat = catalog.find((x) => x.name === c);
      const ct = list.length ? centroid(list) : cat!;
      chips.push({
        name: c,
        count: list.length,
        onPick: () => {
          setView({
            level: 3,
            continent: view.continent,
            country: view.country,
            state: c,
          });
          fly(ct.lat, ct.lng, narrow() ? 270 : 225);
        },
      });
    });
  }
  // the inhabited places lead, the empty frontier follows
  chips.sort((a, b) => b.count - a.count);
  const goBack = () => {
    if (view.level === 1) {
      setView({ level: 0 });
      const hostW = hostRef.current?.clientWidth ?? 0;
      const hostH = hostRef.current?.clientHeight ?? 1;
      fly(0, 0, hostW < hostH * 0.9 ? 480 : 310, true);
    } else if (view.level === 2) {
      setView({ level: 1, continent: view.continent });
      const c = CONTINENTS[view.continent];
      fly(c.lat, c.lng, narrow() ? 380 : 300);
    } else if (view.level === 3) {
      setView({ level: 2, continent: view.continent, country: view.country });
      const list = members.filter(
        (m) => continentOf(m) === view.continent && m.country === view.country,
      );
      const ct = centroid(list);
      fly(ct.lat, ct.lng, narrow() ? 310 : 250);
    }
  };
  const regionName =
    view.level === 0
      ? "across the earth"
      : view.level === 1
        ? `in ${view.continent}`
        : view.level === 2
          ? `in ${view.country}`
          : `in ${view.state}`;
  const backLabel =
    view.level === 1
      ? "Earth"
      : view.level === 2
        ? view.continent
        : view.level === 3
          ? view.country
          : "";
  const prompt =
    view.level === 0
      ? "tap a continent to fly in"
      : view.level === 1
        ? "tap a country to go deeper"
        : view.level === 2
          ? "tap a state to land"
          : "you have landed";
  const crumbs =
    view.level === 0
      ? ""
      : [
          "Earth",
          view.continent,
          view.level === 2 || view.level === 3 ? view.country : "",
          view.level === 3 ? view.state : "",
        ]
          .filter(Boolean)
          .join(" → ");

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMode("flat");
      return;
    }
    let disposed = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      let THREE: typeof import("three");
      let land: number[];
      try {
        [THREE, land] = await Promise.all([
          import("three"),
          fetch("/constellation-land.json").then((r) => r.json()),
        ]);
      } catch {
        setMode("flat");
        return;
      }
      const host = hostRef.current;
      if (!host || disposed) return;

      let renderer: import("three").WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setMode("flat");
        return;
      }
      setMode("globe");
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.domElement.style.display = "block";
      // vertical swipes keep scrolling the page; horizontal drags spin
      renderer.domElement.style.touchAction = "pan-y";
      renderer.domElement.style.cursor = "grab";
      host.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 1, 2000);
      const startZ = host.clientWidth < host.clientHeight * 0.9 ? 480 : 310;
      camera.position.z = startZ * 1.55;
      const globe = new THREE.Group();
      globe.rotation.x = 0.22;
      globe.rotation.y = -0.9;
      scene.add(globe);

      // ---- land dust -------------------------------------------------
      const count = land.length / 2;
      const targets = new Float32Array(count * 3);
      const starts = new Float32Array(count * 3);
      const colors = new Float32Array(count * 3);
      const delays = new Float32Array(count);
      const rng = (seed: number) => {
        let s = seed;
        return () => {
          s = (s * 16807) % 2147483647;
          return s / 2147483647;
        };
      };
      const rand = rng(42);
      for (let i = 0; i < count; i++) {
        const lng = land[i * 2];
        const lat = land[i * 2 + 1];
        const [x, y, z] = toXYZ(lat, lng);
        targets.set([x, y, z], i * 3);
        const rr = 320 + rand() * 380;
        const u = rand() * 2 - 1;
        const th = rand() * Math.PI * 2;
        const sq = Math.sqrt(1 - u * u);
        starts.set(
          [rr * sq * Math.cos(th), rr * u, rr * sq * Math.sin(th)],
          i * 3,
        );
        delays[i] = rand() * 0.4;
        const warm = 0.72 + rand() * 0.28;
        colors.set([warm * 0.86, warm * 0.82, warm], i * 3);
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(starts.slice(), 3));
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const dustMat = new THREE.PointsMaterial({
        size: 1.9,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        sizeAttenuation: true,
      });
      globe.add(new THREE.Points(geo, dustMat));

      // solid night body so the far side hides once assembled
      const shellMat = new THREE.MeshBasicMaterial({
        color: 0x07050c,
        transparent: true,
        opacity: 0,
        // must not occlude while invisible: an early depth write would
        // swallow the star-written headline inside its silhouette
        depthWrite: false,
      });
      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(R - 2.5, 48, 32),
        shellMat,
      );
      shell.renderOrder = -1;
      globe.add(shell);

      // ---- glow texture ----------------------------------------------
      const starTex = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 64;
        const g = c.getContext("2d")!;
        const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.25, "rgba(233,228,246,0.9)");
        grad.addColorStop(0.55, "rgba(180,140,255,0.45)");
        grad.addColorStop(1, "rgba(180,140,255,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, 64, 64);
        return new THREE.CanvasTexture(c);
      })();
      // soft round WHITE particles for the land: the member-star texture
      // carries a purple halo that must not tint the continents
      const dotTex = (() => {
        const c = document.createElement("canvas");
        c.width = c.height = 32;
        const g = c.getContext("2d")!;
        const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
        grad.addColorStop(0, "rgba(255,255,255,1)");
        grad.addColorStop(0.5, "rgba(255,255,255,0.9)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        g.fillStyle = grad;
        g.fillRect(0, 0, 32, 32);
        return new THREE.CanvasTexture(c);
      })();
      dustMat.map = dotTex;
      dustMat.alphaTest = 0.03;
      dustMat.needsUpdate = true;

      // ---- the star-written headline ---------------------------------
      // THE CONSTELLATION is spelled in star particles; on scroll the
      // letters disband into the same swarm that builds the planet
      await document.fonts.ready.catch(() => undefined);
      const fam =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--font-archivo")
          .trim() || "sans-serif";
      const tc = document.createElement("canvas");
      const tw = 1400;
      const th = 220;
      tc.width = tw;
      tc.height = th;
      const tg = tc.getContext("2d")!;
      tg.font = `700 130px ${fam}`;
      tg.textAlign = "center";
      tg.textBaseline = "middle";
      tg.fillStyle = "#fff";
      const TITLE = CONSTELLATION.title.toUpperCase();
      tg.fillText(TITLE, tw / 2, th / 2);
      const measured = tg.measureText(TITLE).width;
      const img = tg.getImageData(0, 0, tw, th).data;
      const letterPts: [number, number][] = [];
      for (let y = 0; y < th; y += 3) {
        for (let x = 0; x < tw; x += 3) {
          if (img[(y * tw + x) * 4 + 3] > 128 && rand() < 0.8) {
            letterPts.push([x - tw / 2, th / 2 - y]);
          }
        }
      }
      const camZ0 = startZ * 1.55;
      const aspect0 = host.clientWidth / host.clientHeight;
      const worldH0 = 2 * Math.tan((20 * Math.PI) / 180) * camZ0;
      const worldW0 = worldH0 * aspect0;
      const textWorldW = aspect0 > 1 ? worldW0 * 0.46 : worldW0 * 0.92;
      const ts = textWorldW / measured;
      const n2 = letterPts.length;
      const textTarget = new Float32Array(n2 * 3);
      const textBirth = new Float32Array(n2 * 3);
      const textScatter = new Float32Array(n2 * 3);
      for (let i = 0; i < n2; i++) {
        const [lx, ly] = letterPts[i];
        textTarget.set([lx * ts, ly * ts, 0], i * 3);
        textBirth.set(
          [
            lx * ts + (rand() - 0.5) * 90,
            ly * ts + (rand() - 0.5) * 90,
            (rand() - 0.5) * 120,
          ],
          i * 3,
        );
        const rr = 340 + rand() * 360;
        const u = rand() * 2 - 1;
        const thr = rand() * Math.PI * 2;
        const sq = Math.sqrt(1 - u * u);
        textScatter.set(
          [rr * sq * Math.cos(thr), rr * u, rr * sq * Math.sin(thr)],
          i * 3,
        );
      }
      const textGeo = new THREE.BufferGeometry();
      textGeo.setAttribute(
        "position",
        new THREE.BufferAttribute(textBirth.slice(), 3),
      );
      const textMat = new THREE.PointsMaterial({
        size: 2.6,
        color: 0xf3efff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      });
      scene.add(new THREE.Points(textGeo, textMat));

      // ---- member stars ----------------------------------------------
      const mem = membersRef.current;
      const memberSprites = mem.map((m) => {
        const s = new THREE.Sprite(
          new THREE.SpriteMaterial({
            map: starTex,
            transparent: true,
            opacity: 0,
            depthWrite: false,
          }),
        );
        const [x, y, z] = toXYZ(m.lat, m.lng, R + 1.5);
        s.position.set(x, y, z);
        s.scale.setScalar(11);
        s.userData.member = m;
        globe.add(s);
        return s;
      });

      // ---- the wandering unclaimed star ------------------------------
      const ghost = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: starTex,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        }),
      );
      ghost.scale.setScalar(9);
      scene.add(ghost);

      // ---- connection arcs -------------------------------------------
      const arcs: {
        line: import("three").Line;
        born: number;
        segs: number;
      }[] = [];
      const arcBetween = (a: ConstellationMember, b: ConstellationMember) => {
        const va = new THREE.Vector3(...toXYZ(a.lat, a.lng));
        const vb = new THREE.Vector3(...toXYZ(b.lat, b.lng));
        const angle = va.angleTo(vb);
        const segs = 48;
        const pts: import("three").Vector3[] = [];
        for (let i = 0; i <= segs; i++) {
          const t = i / segs;
          const v = va
            .clone()
            .applyAxisAngle(va.clone().cross(vb).normalize(), angle * t)
            .normalize();
          const lift = 1 + Math.sin(t * Math.PI) * (0.08 + angle * 0.1);
          pts.push(v.multiplyScalar(R * lift));
        }
        const g = new THREE.BufferGeometry().setFromPoints(pts);
        const line = new THREE.Line(
          g,
          new THREE.LineBasicMaterial({
            color: 0xb48cff,
            transparent: true,
            opacity: 0.85,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          }),
        );
        g.setDrawRange(0, 0);
        globe.add(line);
        arcs.push({ line, born: performance.now(), segs });
      };

      // ---- constellation mode ----------------------------------------
      const webGroup = new THREE.Group();
      webGroup.visible = false;
      globe.add(webGroup);
      if (mem.length > 1) {
        const left = [...mem];
        let cur = left.shift()!;
        while (left.length) {
          let bi = 0;
          let bd = Infinity;
          const vc = new THREE.Vector3(...toXYZ(cur.lat, cur.lng));
          left.forEach((m, i) => {
            const d = vc.distanceTo(new THREE.Vector3(...toXYZ(m.lat, m.lng)));
            if (d < bd) {
              bd = d;
              bi = i;
            }
          });
          const nxt = left.splice(bi, 1)[0];
          const va = new THREE.Vector3(...toXYZ(cur.lat, cur.lng, R + 1));
          const vb = new THREE.Vector3(...toXYZ(nxt.lat, nxt.lng, R + 1));
          const angle = va.angleTo(vb);
          const pts: import("three").Vector3[] = [];
          for (let i = 0; i <= 32; i++) {
            const t = i / 32;
            const v = va
              .clone()
              .applyAxisAngle(va.clone().cross(vb).normalize(), angle * t)
              .normalize();
            const lift = 1 + Math.sin(t * Math.PI) * 0.04;
            pts.push(v.multiplyScalar((R + 1) * lift));
          }
          const g = new THREE.BufferGeometry().setFromPoints(pts);
          webGroup.add(
            new THREE.Line(
              g,
              new THREE.LineBasicMaterial({
                color: 0xd8ccff,
                transparent: true,
                opacity: 0.55,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
              }),
            ),
          );
          cur = nxt;
        }
      }

      // ---- sizing ----------------------------------------------------
      const resize = () => {
        const w = host.clientWidth;
        const h = host.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(host);

      // ---- interaction -----------------------------------------------
      let dragging = false;
      let px = 0;
      let py = 0;
      let vx = 0;
      let vy = 0;
      let moved = 0;
      let lastTouch = 0;
      let pinchDist = 0;
      let zoom = startZ;
      const el = renderer.domElement;

      const onDown = (e: PointerEvent) => {
        dragging = true;
        flying = false;
        moved = 0;
        px = e.clientX;
        py = e.clientY;
        el.style.cursor = "grabbing";
        lastTouch = performance.now();
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const dx = e.clientX - px;
        const dy = e.clientY - py;
        moved += Math.abs(dx) + Math.abs(dy);
        px = e.clientX;
        py = e.clientY;
        vx = dx * 0.0045;
        vy = dy * 0.0045;
        globe.rotation.y += vx;
        globe.rotation.x = Math.max(
          -1.35,
          Math.min(1.35, globe.rotation.x + vy),
        );
        lastTouch = performance.now();
      };
      const raycaster = new THREE.Raycaster();
      const onUp = (e: PointerEvent) => {
        dragging = false;
        el.style.cursor = "grab";
        lastTouch = performance.now();
        if (moved < 8 && builtRef.current) {
          const rect = el.getBoundingClientRect();
          const ndc = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1,
          );
          raycaster.setFromCamera(ndc, camera);
          const hits = raycaster
            .intersectObjects(memberSprites)
            .filter(
              (h) =>
                (h.object as import("three").Sprite).material.opacity > 0.4,
            );
          setSelected(
            hits.length
              ? ((hits[0].object.userData.member as ConstellationMember) ??
                  null)
              : null,
          );
        }
      };
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2 && builtRef.current) {
          const d = Math.hypot(
            e.touches[0].clientX - e.touches[1].clientX,
            e.touches[0].clientY - e.touches[1].clientY,
          );
          if (pinchDist) {
            zoom = Math.max(210, Math.min(560, zoom - (d - pinchDist) * 0.8));
          }
          pinchDist = d;
          lastTouch = performance.now();
        }
      };
      const onTouchEnd = () => {
        pinchDist = 0;
      };
      el.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      el.addEventListener("touchmove", onTouchMove, { passive: true });
      el.addEventListener("touchend", onTouchEnd);

      // ---- render loop -----------------------------------------------
      let running = true;
      const io = new IntersectionObserver(
        (es) => {
          running = es.some((x) => x.isIntersecting);
        },
        { rootMargin: "20%" },
      );
      io.observe(wrapRef.current!);

      let raf = 0;
      let lastArc = 0;
      let lastBuild = -1;
      let lastText = -1;
      let flying = false;
      let everBuilt = false;
      let buildCur = 0;
      let flyDone = 0;
      let flyZ = zoom;
      const flyQ = new THREE.Quaternion();
      const t0 = performance.now();
      const camDir = new THREE.Vector3();
      const wp = new THREE.Vector3();

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!running) return;
        const wrap = wrapRef.current;
        if (!wrap) return;

        // scroll progress across the whole scene
        const rect = wrap.getBoundingClientRect();
        const vh = window.innerHeight;
        const total = Math.max(rect.height - vh, 1);
        const p = clamp01(-rect.top / total);

        // the hero copy flies past, then the world assembles
        const copy = copyRef.current;
        if (copy) {
          const fade = 1 - clamp01((p - 0.2) / 0.16);
          copy.style.opacity = fade.toFixed(3);
          copy.style.transform = `scale(${(1 + 0.16 * (1 - fade)).toFixed(3)})`;
          copy.style.pointerEvents = fade > 0.1 ? "auto" : "none";
        }
        const hint = hintRef.current;
        if (hint) hint.style.opacity = p < 0.04 ? "1" : "0";

        // the headline: stars gather into letters, then disband into
        // the swarm as the scroll begins
        const tIn = clamp01((now - t0) / 950);
        const tie = 1 - Math.pow(1 - tIn, 3);
        const ds = clamp01((p - 0.14) / 0.24);
        const dse = ds * ds * (3 - 2 * ds);
        const textKey = tie * 1000 + dse;
        if (textKey !== lastText) {
          lastText = textKey;
          const tp = textGeo.getAttribute(
            "position",
          ) as import("three").BufferAttribute;
          const ta = tp.array as Float32Array;
          for (let i = 0; i < n2 * 3; i++) {
            const formed =
              textBirth[i] + (textTarget[i] - textBirth[i]) * tie;
            ta[i] = formed + (textScatter[i] - formed) * dse;
          }
          tp.needsUpdate = true;
          textMat.opacity = (0.25 + 0.75 * tie) * (1 - dse * 0.97);
        }

        // scroll sets the destination, but the stars always take their
        // time flying there: a fast flick still gets the full formation
        let buildTarget = clamp01((p - 0.3) / 0.42);
        if (buildTarget >= 1) everBuilt = true;
        if (everBuilt && p > 0.45) buildTarget = 1;
        buildCur += (buildTarget - buildCur) * 0.045;
        if (Math.abs(buildTarget - buildCur) < 0.0004) buildCur = buildTarget;
        const build = buildCur;
        const be = 1 - Math.pow(1 - build, 3);
        if (build !== lastBuild) {
          lastBuild = build;
          const pos = geo.getAttribute(
            "position",
          ) as import("three").BufferAttribute;
          const arr = pos.array as Float32Array;
          for (let i = 0; i < count; i++) {
            const lt = clamp01((build - delays[i] * 0.4) / (1 - delays[i] * 0.4));
            const e = 1 - Math.pow(1 - lt, 3);
            for (let k = 0; k < 3; k++) {
              arr[i * 3 + k] =
                starts[i * 3 + k] +
                (targets[i * 3 + k] - starts[i * 3 + k]) * e;
            }
          }
          pos.needsUpdate = true;
          dustMat.opacity = 0.4 + 0.5 * be;
          shellMat.opacity = be;
          shellMat.depthWrite = be > 0.35;
        }
        if (build >= 1 !== builtRef.current) setBuilt(build >= 1);

        // members fade up as the planet completes
        const reveal = clamp01((p - 0.68) / 0.14);
        camera.getWorldDirection(camDir);
        memberSprites.forEach((s, i) => {
          wp.copy(s.position).applyMatrix4(globe.matrixWorld).normalize();
          const facing = wp.dot(camDir) < -0.08 ? 1 : 0.12;
          const tw = 0.85 + 0.15 * Math.sin(now / 460 + i * 1.7);
          s.material.opacity = reveal * facing * tw;
        });

        // ghost star orbit
        const ga = now / 9000;
        ghost.position.set(
          Math.cos(ga) * (R + 30),
          Math.sin(now / 6100) * 26,
          Math.sin(ga) * (R + 30),
        );
        ghost.material.opacity = reveal * (0.3 + 0.15 * Math.sin(now / 700));

        // fly-to requests from the region drill-down
        const fr = flyReq.current;
        if (fr && fr.id !== flyDone) {
          flyDone = fr.id;
          flyZ = fr.zoom;
          if (fr.zoomOnly) {
            flyQ.copy(globe.quaternion);
          } else {
            const pv = new THREE.Vector3(...toXYZ(fr.lat, fr.lng)).normalize();
            flyQ.setFromUnitVectors(pv, new THREE.Vector3(0, 0, 1));
            // keep north pointing up after the arc
            const nw = new THREE.Vector3(0, 1, 0).applyQuaternion(flyQ);
            flyQ.premultiply(
              new THREE.Quaternion().setFromAxisAngle(
                new THREE.Vector3(0, 0, 1),
                -Math.atan2(nw.x, nw.y),
              ),
            );
          }
          flying = true;
          lastTouch = now;
        }
        if (flying) {
          globe.quaternion.slerp(flyQ, 0.09);
          zoom += (flyZ - zoom) * 0.09;
          if (globe.quaternion.angleTo(flyQ) < 0.005 && Math.abs(flyZ - zoom) < 2) {
            flying = false;
          }
          lastTouch = now;
        }

        // idle spin and momentum
        if (!dragging && !flying) {
          globe.rotation.y += vx;
          globe.rotation.x = Math.max(
            -1.35,
            Math.min(1.35, globe.rotation.x + vy),
          );
          vx *= 0.94;
          vy *= 0.94;
          if (now - lastTouch > 3500) globe.rotation.y += 0.00085;
        }
        // approach the planet while it builds, then hand zoom to pinch
        if (build < 1) {
          camera.position.z = startZ * (1.55 - 0.55 * be);
          zoom = startZ;
        } else {
          camera.position.z += (zoom - camera.position.z) * 0.12;
        }

        // arcs pulse between members once the world is real
        if (
          reveal >= 1 &&
          !linesOnRef.current &&
          membersRef.current.length > 1 &&
          now - lastArc > 4200
        ) {
          lastArc = now;
          const list = membersRef.current;
          const a = list[Math.floor(Math.random() * list.length)];
          let b = list[Math.floor(Math.random() * list.length)];
          if (b === a) b = list[(list.indexOf(a) + 1) % list.length];
          arcBetween(a, b);
        }
        for (let i = arcs.length - 1; i >= 0; i--) {
          const a = arcs[i];
          const age = now - a.born;
          if (age < 1100) {
            a.line.geometry.setDrawRange(
              0,
              Math.floor((age / 1100) * a.segs) + 1,
            );
          } else if (age < 2600) {
            (a.line.material as import("three").LineBasicMaterial).opacity =
              0.85 * (1 - (age - 1100) / 1500);
          } else {
            globe.remove(a.line);
            a.line.geometry.dispose();
            (a.line.material as import("three").Material).dispose();
            arcs.splice(i, 1);
          }
        }
        webGroup.visible = linesOnRef.current;

        // thread from the chosen star to its card
        const sel = selectedRef.current;
        const line = lineRef.current;
        const card = cardRef.current;
        if (sel && line && card) {
          const sp = memberSprites.find((s) => s.userData.member === sel);
          if (sp) {
            wp.copy(sp.position).applyMatrix4(globe.matrixWorld);
            const v = wp.clone().project(camera);
            const hostRect = host.getBoundingClientRect();
            const sx = ((v.x + 1) / 2) * hostRect.width;
            const sy = ((1 - v.y) / 2) * hostRect.height;
            const cr = card.getBoundingClientRect();
            line.setAttribute("x1", String(sx));
            line.setAttribute("y1", String(sy));
            line.setAttribute(
              "x2",
              String(cr.left - hostRect.left + cr.width / 2),
            );
            line.setAttribute("y2", String(cr.top - hostRect.top));
            wp.normalize();
            line.style.opacity = wp.dot(camDir) < -0.05 ? "0.8" : "0.15";
          }
        }

        renderer.render(scene, camera);
      };
      raf = requestAnimationFrame(frame);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        el.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        el.removeEventListener("touchmove", onTouchMove);
        el.removeEventListener("touchend", onTouchEnd);
        renderer.dispose();
        geo.dispose();
        starTex.dispose();
        el.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // reduced motion or no WebGL: the quiet hero and the flat map
  if (mode === "flat") {
    return (
      <div>
        <header className="mx-auto max-w-7xl px-5 pb-20 pt-32 sm:px-8 sm:pt-44">
          <Kicker>{CONSTELLATION.kicker}</Kicker>
          <h1 className="mt-6 font-display text-5xl font-bold sm:text-6xl">
            {CONSTELLATION.title}
          </h1>
          <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-starlight/90 sm:text-3xl">
            {CONSTELLATION.intro}
          </p>
        </header>
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <ConstellationMap members={notionMembers} />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapRef}
      id="constellation-map"
      className="relative"
      style={{ height: "230svh" }}
    >
      <div ref={hostRef} className="sticky top-0 h-svh overflow-hidden">
        {/* the hero copy, floating in the void before the world exists */}
        <div
          ref={copyRef}
          className="absolute inset-0 z-10 flex flex-col items-center justify-center px-6 text-center"
        >
          <p className="meta-label text-dust">{CONSTELLATION.kicker}</p>
          {/* the headline itself is written in stars on the canvas */}
          <h1 className="sr-only">{CONSTELLATION.title}</h1>
          <div aria-hidden="true" className="h-[16vw] sm:h-28" />
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-starlight/85 sm:text-lg">
            {CONSTELLATION.intro}
          </p>
        </div>

        <p
          ref={hintRef}
          aria-hidden="true"
          className="meta-label absolute bottom-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap text-white transition-opacity duration-700 [text-shadow:0_0_10px_rgb(255_255_255/0.85),0_0_26px_rgb(167_139_250/0.7)]"
        >
          scroll to build the world
        </p>

        {/* region drill-down: continent, country, city, each with its
            count of creators serious about Jesus */}
        {built ? (
          <div className="pointer-events-none absolute inset-x-0 top-16 z-10 px-4 text-center">
            <p className="font-display text-2xl font-bold text-white [text-shadow:0_0_12px_rgb(255_255_255/0.7),0_0_30px_rgb(167_139_250/0.6)]">
              {inView.length}
            </p>
            <p className="meta-label mt-1 text-starlight/80">
              creator{inView.length === 1 ? "" : "s"} serious about Jesus{" "}
              {regionName}
            </p>
            {crumbs ? (
              <p className="meta-label mt-2 text-[10px] text-dust">{crumbs}</p>
            ) : null}
          </div>
        ) : null}
        {built && !selected ? (
          <div className="absolute inset-x-0 bottom-5 z-10 px-4">
            <p className="meta-label mb-3 text-center text-white [text-shadow:0_0_10px_rgb(255_255_255/0.7),0_0_24px_rgb(167_139_250/0.6)]">
              {prompt}
            </p>
            <motion.div layout className="flex flex-wrap items-center justify-center gap-2">
              <AnimatePresence mode="popLayout">
              {view.level > 0 ? (
                <motion.button
                  key={`back-${view.level}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 10 }}
                  transition={{ type: "spring", stiffness: 520, damping: 30 }}
                  type="button"
                  onClick={goBack}
                  className="meta-label rounded-full border border-ember bg-ember/15 px-4 py-2.5 text-starlight transition-colors hover:bg-ember/30"
                >
                  ← {backLabel}
                </motion.button>
              ) : null}
              {chips.map((c, ci) => (
                <motion.button
                  key={`${view.level}-${c.name}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.85, y: 10 }}
                  transition={{ type: "spring", stiffness: 520, damping: 30, delay: ci * 0.045 }}
                  type="button"
                  onClick={c.onPick}
                  className="meta-label rounded-full border border-dust/40 bg-night/80 px-4 py-2.5 text-starlight transition-colors hover:border-ember"
                >
                  {c.name}
                  {c.count > 0 ? (
                    <span className="text-ember"> {c.count}</span>
                  ) : null}
                </motion.button>
              ))}
              </AnimatePresence>
            </motion.div>
          </div>
        ) : null}

        {/* thread between a chosen star and its card */}
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 h-full w-full"
        >
          <line
            ref={lineRef}
            stroke="rgba(216,204,255,0.8)"
            strokeWidth="1"
            style={{ opacity: selected ? 1 : 0 }}
          />
        </svg>

        {/* the chosen creator */}
        <AnimatePresence>
        {selected ? (
          <motion.div
            key={selected.name}
            ref={cardRef}
            initial={{ opacity: 0, y: 26, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ type: "spring", stiffness: 460, damping: 32 }}
            className="absolute bottom-5 left-1/2 z-10 w-[86%] max-w-xs -translate-x-1/2 rounded-lg border border-dust/30 bg-night/90 px-5 py-4 text-center backdrop-blur-sm"
          >
            <p className="font-display text-lg font-bold">{selected.name}</p>
            <p className="meta-label mt-1">
              {selected.state}, {selected.country}
            </p>
            {selected.href ? (
              <a
                href={selected.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mono-link mt-3 inline-block text-sm font-bold text-ember"
              >
                See their work ↗
              </a>
            ) : null}
          </motion.div>
        ) : null}
        </AnimatePresence>

        {/* constellation mode, once the world exists */}
        {built && members.length > 1 && !selected ? (
          <button
            type="button"
            onClick={() => setLinesOn((v) => !v)}
            className={`meta-label absolute bottom-[4.6rem] left-1/2 z-10 -translate-x-1/2 rounded-full border px-4 py-2 transition-colors ${
              linesOn
                ? "border-ember bg-ember/20 text-starlight"
                : "border-dust/30 bg-night/60 text-dust hover:text-starlight"
            }`}
          >
            {linesOn ? "Hide the constellation" : "See the constellation"}
          </button>
        ) : null}

      </div>
    </div>
  );
}
