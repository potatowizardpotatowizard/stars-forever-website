"use client";

import { useEffect, useRef, useState } from "react";
import ConstellationMap from "@/components/ConstellationMap";
import {
  CONSTELLATION,
  type ConstellationMember,
} from "@/content/constellation";

// The Constellation as a planet: Earth's landmasses are thousands of
// star particles on a sphere floating in the site's night, members are
// bright stars pinned at their real coordinates. Drag to spin, pinch or
// scroll to zoom, tap a star to meet the creator. On arrival the whole
// planet assembles itself out of the starfield. Falls back to the flat
// map under reduced motion or when WebGL is unavailable.

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

type Mode = "loading" | "globe" | "flat";

export default function ConstellationGlobe({
  members: notionMembers = [],
}: {
  members?: ConstellationMember[];
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<Mode>("loading");
  const [selected, setSelected] = useState<ConstellationMember | null>(null);
  const [linesOn, setLinesOn] = useState(false);
  const linesOnRef = useRef(false);
  const selectedRef = useRef<ConstellationMember | null>(null);
  selectedRef.current = selected;
  linesOnRef.current = linesOn;

  const seen = new Set<string>();
  const members = [...CONSTELLATION.members, ...notionMembers].filter((m) => {
    const key = `${m.name}|${m.city}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  const membersRef = useRef(members);
  membersRef.current = members;

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
      renderer.domElement.style.touchAction = "none";
      renderer.domElement.style.cursor = "grab";
      host.prepend(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(40, 1, 1, 2000);
      // narrow screens start further out so the whole planet fits
      const startZ =
        host.clientWidth < host.clientHeight * 0.9 ? 480 : 310;
      camera.position.z = startZ;
      const globe = new THREE.Group();
      // tilt slightly and face the Americas/Atlantic on arrival
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
        // fly in from a wide scattered shell
        const rr = 320 + rand() * 340;
        const u = rand() * 2 - 1;
        const th = rand() * Math.PI * 2;
        const sq = Math.sqrt(1 - u * u);
        starts.set([rr * sq * Math.cos(th), rr * u, rr * sq * Math.sin(th)], i * 3);
        delays[i] = rand() * 0.55;
        const warm = 0.72 + rand() * 0.28;
        colors.set([warm * 0.86, warm * 0.82, warm], i * 3);
      }
      const flown = sessionStorage.getItem("sf-globe-flown") === "1";
      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.BufferAttribute(flown ? targets.slice() : starts.slice(), 3),
      );
      geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
      const dust = new THREE.Points(
        geo,
        new THREE.PointsMaterial({
          size: 1.9,
          vertexColors: true,
          transparent: true,
          opacity: 0.9,
          depthWrite: false,
          sizeAttenuation: true,
        }),
      );
      globe.add(dust);

      // a night-dark body inside the dust so the far side hides and the
      // planet reads as solid instead of a see-through scatter
      const shell = new THREE.Mesh(
        new THREE.SphereGeometry(R - 2.5, 48, 32),
        new THREE.MeshBasicMaterial({ color: 0x07050c }),
      );
      shell.renderOrder = -1;
      globe.add(shell);

      // ---- glow texture for stars ------------------------------------
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
            .applyAxisAngle(
              va.clone().cross(vb).normalize(),
              angle * t,
            )
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
        // greedy chain through nearest unvisited neighbors
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
        globe.rotation.x = Math.max(-0.9, Math.min(0.9, globe.rotation.x + vy));
        lastTouch = performance.now();
      };
      const raycaster = new THREE.Raycaster();
      const onUp = (e: PointerEvent) => {
        dragging = false;
        el.style.cursor = "grab";
        lastTouch = performance.now();
        if (moved < 8) {
          // a tap: try to meet a creator
          const rect = el.getBoundingClientRect();
          const ndc = new THREE.Vector2(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1,
          );
          raycaster.setFromCamera(ndc, camera);
          const hits = raycaster
            .intersectObjects(memberSprites)
            .filter((h) => (h.object as import("three").Sprite).material.opacity > 0.4);
          setSelected(
            hits.length
              ? ((hits[0].object.userData.member as ConstellationMember) ?? null)
              : null,
          );
        }
      };
      const onWheel = (e: WheelEvent) => {
        e.preventDefault();
        zoom = Math.max(210, Math.min(560, zoom + e.deltaY * 0.4));
        lastTouch = performance.now();
      };
      const onTouchMove = (e: TouchEvent) => {
        if (e.touches.length === 2) {
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
      el.addEventListener("wheel", onWheel, { passive: false });
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
      io.observe(host);

      const t0 = performance.now();
      const FLY_MS = 2300;
      let raf = 0;
      let lastArc = performance.now() + 3500;
      const camDir = new THREE.Vector3();
      const wp = new THREE.Vector3();

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame);
        if (!running) return;

        // fly-in: dust streams from the void into continents
        const ft = flown ? 1 : Math.min(1, (now - t0) / FLY_MS);
        if (ft < 1) {
          const pos = geo.getAttribute("position") as import("three").BufferAttribute;
          const arr = pos.array as Float32Array;
          for (let i = 0; i < count; i++) {
            const lt = Math.min(
              1,
              Math.max(0, (ft - delays[i] * 0.55) / (1 - delays[i] * 0.55)),
            );
            const e = 1 - Math.pow(1 - lt, 3);
            for (let k = 0; k < 3; k++) {
              arr[i * 3 + k] =
                starts[i * 3 + k] + (targets[i * 3 + k] - starts[i * 3 + k]) * e;
            }
          }
          pos.needsUpdate = true;
          if (ft >= 1) sessionStorage.setItem("sf-globe-flown", "1");
        } else if (!flown && !sessionStorage.getItem("sf-globe-flown")) {
          sessionStorage.setItem("sf-globe-flown", "1");
        }

        // members and the wandering star fade up once land has settled
        const reveal = flown ? 1 : Math.min(1, Math.max(0, (now - t0 - FLY_MS + 300) / 700));
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
        ghost.material.opacity =
          reveal * (0.3 + 0.15 * Math.sin(now / 700));

        // idle spin and momentum
        if (!dragging) {
          globe.rotation.y += vx;
          globe.rotation.x = Math.max(
            -0.9,
            Math.min(0.9, globe.rotation.x + vy),
          );
          vx *= 0.94;
          vy *= 0.94;
          if (now - lastTouch > 3500) globe.rotation.y += 0.00085;
        }
        camera.position.z += (zoom - camera.position.z) * 0.12;

        // pulse arcs between random members
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
            a.line.geometry.setDrawRange(0, Math.floor((age / 1100) * a.segs) + 1);
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

        // the thread from the selected star to its card
        const sel = selectedRef.current;
        const line = lineRef.current;
        const card = cardRef.current;
        if (sel && line && card) {
          const sp = memberSprites.find(
            (s) => s.userData.member === sel,
          );
          if (sp) {
            wp.copy(sp.position).applyMatrix4(globe.matrixWorld);
            const v = wp.clone().project(camera);
            const rect = host.getBoundingClientRect();
            const sx = ((v.x + 1) / 2) * rect.width;
            const sy = ((1 - v.y) / 2) * rect.height;
            const cr = card.getBoundingClientRect();
            line.setAttribute("x1", String(sx));
            line.setAttribute("y1", String(sy));
            line.setAttribute("x2", String(cr.left - rect.left + cr.width / 2));
            line.setAttribute("y2", String(cr.top - rect.top));
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
        el.removeEventListener("wheel", onWheel);
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

  if (mode === "flat") return <ConstellationMap members={notionMembers} />;

  return (
    <div
      id="constellation-map"
      ref={hostRef}
      className="relative h-[68svh] w-full overflow-hidden md:h-[76svh]"
    >
      {/* thread between a chosen star and its card */}
      <svg
        ref={svgRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <line
          ref={lineRef}
          stroke="rgba(216,204,255,0.8)"
          strokeWidth="1"
          style={{ opacity: selected ? 1 : 0 }}
        />
      </svg>

      {/* the chosen creator */}
      {selected ? (
        <div
          ref={cardRef}
          className="absolute bottom-5 left-1/2 z-10 w-[86%] max-w-xs -translate-x-1/2 rounded-lg border border-dust/30 bg-night/90 px-5 py-4 text-center backdrop-blur-sm"
        >
          <p className="font-display text-lg font-bold">{selected.name}</p>
          <p className="meta-label mt-1">
            {selected.city}, {selected.country}
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
        </div>
      ) : null}

      {/* constellation mode */}
      {members.length > 1 ? (
        <button
          type="button"
          onClick={() => setLinesOn((v) => !v)}
          className={`meta-label absolute left-4 top-4 z-10 rounded-full border px-4 py-2 transition-colors ${
            linesOn
              ? "border-ember bg-ember/20 text-starlight"
              : "border-dust/30 bg-night/60 text-dust hover:text-starlight"
          }`}
        >
          {linesOn ? "Hide the constellation" : "See the constellation"}
        </button>
      ) : null}

      {members.length === 0 && mode === "globe" ? (
        <p className="pointer-events-none absolute inset-x-0 bottom-6 px-6 text-center font-meta text-xs uppercase tracking-[0.18em] text-starlight/80">
          {CONSTELLATION.emptyNote}
        </p>
      ) : null}
    </div>
  );
}
