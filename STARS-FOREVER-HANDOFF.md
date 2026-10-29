# Stars Forever Website: Complete Handoff

> **Who this is for:** the developer taking over changes to the Stars Forever website on their own computer.
> **What it covers:** everything decided, built, reverted, learned and left open from July 5 2026 (first commit) to October 29 2026 (this handoff). It draws on the project's memory notes, about four months of build conversations, and all 716 commits.
> **Live site:** https://starsforever.co (same deployment as https://stars-forever.vercel.app)
> **Repo:** https://github.com/potatowizardpotatowizard/stars-forever-website (public as of Oct 29 2026)

---

## Table of contents

1. [The 60 second version](#1-the-60-second-version)
2. [What Stars Forever is (the ministry)](#2-what-stars-forever-is-the-ministry)
3. [The people](#3-the-people)
4. [Getting it running on your machine](#4-getting-it-running-on-your-machine)
5. [Deploying (read this before you push)](#5-deploying-read-this-before-you-push)
6. [Tech stack](#6-tech-stack)
7. [Project structure, file by file](#7-project-structure-file-by-file)
8. [Pages and routes](#8-pages-and-routes)
9. [The content system (where all copy lives)](#9-the-content-system-where-all-copy-lives)
10. [The image slot system](#10-the-image-slot-system)
11. [Design system: the analog black purple look](#11-design-system-the-analog-black-purple-look)
12. [Copy and voice rules](#12-copy-and-voice-rules)
13. [Forms, email, and Notion](#13-forms-email-and-notion)
14. [The Constellation (map, globe, Notion workflow)](#14-the-constellation-map-globe-notion-workflow)
15. [Signature effects and the hard-won lessons behind them](#15-signature-effects-and-the-hard-won-lessons-behind-them)
16. [Easter eggs and secrets](#16-easter-eggs-and-secrets)
17. [Partner Project pages and the journey fly-through](#17-partner-project-pages-and-the-journey-fly-through)
18. [Do not casually rework these (user-approved after heavy iteration)](#18-do-not-casually-rework-these)
19. [Things that were tried and rejected](#19-things-that-were-tried-and-rejected)
20. [Assets: the brand kit and raw media (outside the repo)](#20-assets-the-brand-kit-and-raw-media-outside-the-repo)
21. [Video and image processing recipes](#21-video-and-image-processing-recipes)
22. [Open issues and known bugs](#22-open-issues-and-known-bugs)
23. [Still waiting on Auzi / content gaps](#23-still-waiting-on-auzi--content-gaps)
24. [The "Site of the Year" roadmap](#24-the-site-of-the-year-roadmap)
25. [How the owner likes to work (review habits and preferences)](#25-how-the-owner-likes-to-work)
26. [Full project timeline](#26-full-project-timeline)
27. [Key links and IDs](#27-key-links-and-ids)
28. [Outdated docs in the repo](#28-outdated-docs-in-the-repo)

---

## 1. The 60 second version

- **What:** the website for **Stars Forever**, a Christian ministry that helps creators, artists and entrepreneurs use their lives and platforms for Jesus.
- **Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, three.js, Lenis smooth scroll, Motion, Vercel Analytics. No database: Notion is the only backend, used for the Constellation.
- **Hosting:** Vercel project `stars-forever`, custom domain **starsforever.co**.
- **Deploys are manual.** `git push` does **not** deploy. Production goes out with `npx vercel deploy --prod` (see §5).
- **All copy lives in `content/*.ts`**, never inside components.
- **All photos are named slots** in `content/images.ts`. Drop a file with the right name into `public/images/` and it replaces the placeholder.
- **The look:** analog black film grain, purple nebula, Fragment Mono typewriter menu, glowing stars and meteors everywhere. It was rebranded on July 12 2026 to match cofounder Auzi's Framer homepage.
- **The owner reviews on an iPhone.** Every effect has to work on mobile. A desktop-only effect counts as unfinished.
- **Biggest open item:** the Notion token is dead (401), so the Constellation globe shows zero members (§22).

---

## 2. What Stars Forever is (the ministry)

**Mission line (site description):** "Stars Forever is a ministry that helps creators use their lives and platforms for Jesus."

**Anchor verse (used everywhere; reproduce it EXACTLY, never edit it):**
> "Those who are wise shall shine Like the brightness of the firmament, And those who turn many to righteousness Like the stars forever and ever." (Daniel 12:3)

### The two programs (only two, never call anything else a program)

1. **Partner Projects:** collaborative projects where Stars Forever goes with a creator into the boldest project of their life and helps them share Jesus with a **secular audience**. Each project gets a case-study page on the site (§17).
2. **Revolutionary Cohort:** a gathering of creators built around the missionary lifestyle, run with Steiger (Ben Pierce). Cohort 1 met in Joshua Tree, California, May 15–17 2026, with ten creators. Cohort 2 has a waitlist.

### Category 3 (educational only, NOT a program)

The `/category-3` page ("Find Your Creator Type") explains three kinds of Christian creators:
- **Category 1: Faith Focused Creators**
- **Category 2: Mainstream Focused Creators**
- **Category 3: Eternity Shifting Creators**: mainstream creators whose content carries their faith and the story of Jesus to a secular audience. This is who Stars Forever is trying to raise up.

Auzi wrote the category definitions personally ("in Auzi's words" shows up in a lot of commit messages). Don't paraphrase them.

### The Vision

`/vision` (added July 27 2026) lays out the big idea: **create creator missionaries worldwide.** (They were called "content missionaries" until Aug 3 2026, when the wording changed to "creator missionaries" across the vision.) The page structure is The Problem (life moved online and lostness moved with it: anxious, depressed, needing Jesus), backed by swipeable statistics, then The Solution, then a "digital sky" in which every niche (art, comedy, tech, outdoors, fitness, finance, beauty, family, education...) lights up once it has its missionary. It closes by asking people to give so another niche gets its missionary.

### Other offerings on the site

- **Speaking** (`/speaking`): Auzi and Benjiman speak at events. There's an inquiry form, topics, formats (the formats say "Talk", not "Sermon"), and a downloadable one-pager PDF (`public/brand/stars-forever-speakers.pdf`).
- **Podcast** (`/podcast`): *Respectfully Inspired* on YouTube, Spotify and Apple Podcasts, with a "Popular Episodes" section.
- **YouTube Strategy** (`/strategy`): Auzi Films' paid YouTube consulting ladder, priced from low to high: Strategy Call (3 day refund window), Video Feedback, Channel Audit ($350), Video Workshop ($750, scarce seats), and Strategy Partner (top tier, gold ring). It has five video testimonials and its own minimal footer, and it "speaks only strategy".
- **Giving:** goes through EquipNet, Auzi Weber's missionary page: https://www.equipnet.org/missionaries/aweber
- **Book a call:** Google appointment calendar https://calendar.app.google/RctCvj7JcxaCzEMv5

---

## 3. The people

| Person | Role | Notes |
|---|---|---|
| **Auzi Weber** ("Auzi Films", @auzi.films) | Cofounder. Saw God move on the biggest sets in the world (Beast Games) | Approves design direction and content. "Auzi Films website" is this same site; no separate Auzi Films site exists. Email: auzi@starsforever.co |
| **Benjiman Schlegel** | Cofounder. Digital missionary, storyteller, creative strategist | benjiman7.com. His bio links to Thinq Media. Speaking contact email is in `content/site.ts` |
| **Ben Pierce** | Steiger (Steiger Ministries) | Partner on Revolutionary Cohort 1. Linked as just "Steiger" (the surname was dropped from the label) → steiger.org |
| **Owen Tucker** | Creative Partner 1 | Tokyo Drift partner project |
| **Weston Vansoest** | Creative Partner 2 | Real Treasure partner project (Iceland). He's the protagonist of the video (on-screen credit "Weston Victim" at t=8.5s of the TikTok) |
| **Cohort 1 creators (10)** | | Weston Vansoest, Owen Tucker, Lucas Mayfield, Jordan Orme, Juicy Jacob, Justin Leusner, Andrew Nemes, Austin Pepito, Nelly Crux, Blake Vandevegte (roster order ends with Andrew, Austin, Nelly, then Blake last) |
| **Jon Dorman** | YouTube Strategy Creator and Founder of Studio Forge | Strategy testimonial |

**Photo identification gotchas (Real Treasure):** the hitchhiker is the bearded guy, who appears only in the mossy cliff series and the abandoned plane photo. The person on the red chair and in the left of the flight selfie is the backwards-cap crew member, **not** Weston.

---

## 4. Getting it running on your machine

### Requirements
- Node.js 20+ (the owner's machine runs v24)
- npm (there's a `package-lock.json`; use npm, not yarn or pnpm)

### Steps

```bash
git clone https://github.com/potatowizardpotatowizard/stars-forever-website.git
cd stars-forever-website
npm install
npm run dev
```

Then open http://localhost:3000.

### Environment variables

`.env*` files are git-ignored. **None are needed to run the site locally.** Everything degrades gracefully:

| Variable | What it does | Without it |
|---|---|---|
| `NOTION_TOKEN` | Notion integration secret for the Constellation | Globe shows no members; join form falls back to email/mailto |
| `NOTION_DATABASE_ID` | The "Constellation Requests" database id | Same as above |
| `RESEND_API_KEY` | Sends form submissions by email via Resend | Forms fall back to a prefilled `mailto:`. **Never set in production either**, so this is the current live behavior |
| `CONTACT_EMAIL` | Where Resend mail goes | Defaults to auzi@starsforever.co |
| `MAIL_FROM` | Resend sender | Defaults to `Stars Forever <onboarding@resend.dev>` |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, OG images, sitemap, JSON-LD | Falls back to https://stars-forever.vercel.app. **Set to https://starsforever.co in Vercel production** |
| `NOTION_LIGHTS_DB_ID` | Exists in the owner's `.env.local` but **no code uses it** | Ignore it |

If you need the real secrets, **ask the owner to send them privately.** Don't put them in chat logs, issues or commits.

### Scripts
- `npm run dev`: dev server
- `npm run build`: production build (do this before deploying; it catches type errors)
- `npm run start`: serve the production build
- `npm run lint`: lint

---

## 5. Deploying (read this before you push)

- The Vercel project is **`stars-forever`**, connected to this GitHub repo, with **starsforever.co** attached as the canonical domain (since July 20 2026).
- **Pushing to GitHub does NOT trigger a production deploy.** Every production release has been run by hand:
  ```bash
  npx vercel deploy --prod
  ```
- To deploy you need access to the owner's Vercel team (ask to be added) or the owner deploys for you. If you work on a fork, the owner can pull your changes and deploy.
- **After deploying, check the live site on an iPhone-sized viewport.** That's how the owner reviews everything.
- **Commit style:** the commit history reads like a story. Messages are one evocative present-tense sentence about what the visitor sees, e.g. *"The promise rises clean: uncontaminated placement, no teleporting letters"* or *"Mobile: meteor a bit higher, fill-this-out arrow a bit lower"*. Matching that keeps the log readable for the owner.
- **Reverts are normal and expected.** The owner often says "try it, revert freely". Keep risky experiments in their own commit so `git revert` is clean (there are dozens of `Revert "..."` commits in the history).

---

## 6. Tech stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15** (App Router) | Server components by default; effects are client components |
| UI | **React 19** | |
| Language | **TypeScript 5.8** | |
| Styling | **Tailwind CSS v4** via `@tailwindcss/postcss` | Tokens in `@theme` in `app/globals.css` (~2,000 lines of custom CSS too) |
| 3D | **three.js 0.185** | Constellation globe, journey fly-through |
| Smooth scroll | **Lenis** | `components/SmoothScroll.tsx` |
| Animation | **Motion** (formerly Framer Motion) v13, plus lots of hand-rolled canvas + rAF | |
| Analytics | **@vercel/analytics** | CTA click events tracked |
| Fonts | `next/font/google`: **Archivo** (display), **Figtree** (body), **Fragment Mono** (meta/menu) | |
| Backend | **Notion API** (Constellation), **Resend** (email; key never set), **Open-Meteo geocoding** (free, no key) | |
| Images | `next/image` with AVIF/WebP; remote pattern allows `i.ytimg.com` for YouTube thumbnails | |
| SEO | `app/sitemap.ts`, `app/robots.ts`, Organization JSON-LD in layout, per-route `opengraph-image.tsx` share cards | |

---

## 7. Project structure, file by file

```
app/                     Routes (App Router). Each route has page.tsx + opengraph-image.tsx
  layout.tsx             Root layout: fonts, metadata, JSON-LD, and ALL global effects mounted here
  globals.css            Design tokens + ~2,000 lines of effect/utility CSS
  api/                   Form endpoints (see §13)
  not-found.tsx          "Lost in space" 404
content/                 ALL user-facing copy and data (see §9)
components/              ~70 components, mostly effects (see below)
lib/
  notion.ts              Constellation: insert requests, query Accepted members, geocode
  mail.ts                Resend wrapper (returns false when no key → client mailto fallback)
  media.ts               Resolves named image slots to real files or placeholders
  og.tsx                 Shared OG image renderer
public/
  images/                ~75 site photos, named per content/images.ts
  brand/                 Web-optimized brand art, logos, OG images, posters, effect sprites
  brand/video/           13 self-hosted mp4s (hero loops, explainers, testimonials)
  constellation-land.json  Land dot samples for the 3D globe
next.config.ts           Image formats + permanent redirects for old routes
```

### Components, grouped by job

**Global effects (all mounted in `app/layout.tsx`):**
- `TapeIntro`: VHS tape intro
- `SmoothScroll`: Lenis
- `ShootingStar`: rare random shooting stars
- `Header`: nav plus the full-screen "galactic" mobile menu (starfield + slowly wandering nebulas, left-aligned starred links, no Home entry)
- `Footer`: closing scene: anchor verse written in stars, newsletter
- `WarpNavigator`: "warp jump" page transitions (purple long-exposure streaks)
- `ScrollReset`: every route change opens at the top
- `StarCursor`: four-point star cursor with ribbon comet tail (desktop)
- `ConstellationTrail`: lingering chemtrail used only on /constellation
- `WarpScroll`: streaks on very fast scroll
- `VerseSummon`: type JESUS → John 5:24
- `GoodFriday`: red theme on Good Friday
- `CodeRain`: Matrix rain secret behind the gold star
- `LetterFall`: supernova easter egg letter physics
- `Grain` / `.grain-layer`: one fixed film-grain layer over the whole site (so no section edge can ever end the texture)

**Home:** `GalaxyHero`, `HeroStarLogo`, `StarField`, `MissionIntro`, `StarBridge` (desktop-only shooting star bridging the reframe line into the Tokyo Drift header), `CohortSpotlight`, `ProjectShowcase`, `ExploreSplit` (current Explore section), `StatCarousel`, `NumberTicker`

**Partner Projects:** `ProjectBurst` (pinned collage that bursts open, see §18), `DesktopProjects`, `JourneyScene` (3D fly-through, 560 lines), `JourneyThread`, `MissionIntro`, `VideoBlock`, `YouTubeEmbed`, `LazyVideo`, `GrowVideo`

**Revolutionary Cohort:** `CohortSpotlight`, `MonologueDeck` ("Sound Familiar?" swipe deck with burning meteorite), `FocusMonologue`, `WaitlistForm`, `ScrollSwell`

**Vision:** `DigitalSky` (niche constellation chart), `NicheCycler`, `VisionClaimStrip`, `ProblemScrolly`

**Category 3:** `Category3Ignite` (fire/glow card effect), `Category3Link`

**Constellation:** `ConstellationGlobe` (three.js, ~1,600 lines), `ConstellationMap` (flat fallback), `ConstellationForm`, `ConstellationWhisper`, `SendStar`, `Constellation`

**Story:** `StoryJourney`, `StoryConnector`

**Apply:** `ApplyForm`, `DreamStars`, `ProofParallax`, `SuccessStars`

**Shared bits:** `MediaSlot`, `Reveal`, `Kicker`, `GlitchText`, `Cta`, `AnchorSnap`, `StarMark`, `NewsletterForm`, `SpeakingForm`

**Shelved / unused alternates (kept on purpose, not wired in):** `CohortGather`, `CohortConstellation`, `ExploreOrbit`, `ExploreIndex` (earlier Explore directions)

---

## 8. Pages and routes

| Route | Page | Notes |
|---|---|---|
| `/` | Home | Hero "tape menu", mission line, explainer video, Daniel 12:3 + reframe, Tokyo Drift feature, Recent Work (CohortSpotlight), Explore, closing |
| `/vision` | The Vision | First item in nav and hero menu since July 27 |
| `/partner-projects` | Partner Projects | "The Projects So Far" ProjectBurst scene + project list |
| `/partner-projects/[slug]` | Project pages | `real-treasure`, `tokyo-drift`, `revolutionary-cohort`, `beast-games` |
| `/category-3` | Find Your Creator Type | Categories 1, 2, 3 explained |
| `/revolutionary` | Revolutionary Cohort | Explainer, Sound Familiar deck, Ten Creators, testimonies, Cohort 2 waitlist |
| `/get-involved` | Get Involved | Giving (EquipNet), booking calendar, meteor CTAs |
| `/story` | The Story | Auzi tells the origin story in first person as a constellation journey/fly-through. Footer-linked, no longer in the main menu |
| `/constellation` | The Constellation | 3D globe of approved creators + join form |
| `/speaking` | Speaking | Inquiry form + one-pager |
| `/podcast` | Podcast | Respectfully Inspired |
| `/strategy` | YouTube Strategy | Auzi Films consulting; its own minimal footer |
| `/apply` | Apply | Multi-step Partner Project application |

**Main nav and hero menu (5 items, both identical):** The Vision · Partner Projects · Find Your Creator Type · Revolutionary Cohort · Get Involved
**Footer nav:** The Story · The Constellation · Speaking · Podcast · YouTube Strategy

**Permanent redirects (`next.config.ts`):** `/missions` → `/partner-projects`, `/missions/:slug` → `/partner-projects/:slug`, `/partner-project` → `/partner-projects`, `/give` → `/get-involved`

---

## 9. The content system (where all copy lives)

**Rule:** user-facing copy goes in `content/*.ts`, never inline in components. When the owner asks for a wording change, it's almost always a one-line edit in one of these files:

| File | Contents |
|---|---|
| `site.ts` | Site name, description, **ANCHOR_VERSE**, SUMMON_VERSE, WhatsApp invite, contact emails, booking URL, giving URL, NAV, HERO_MENU, FOOTER_NAV, socials, founders |
| `home.ts` | Home page copy |
| `vision.ts` | Vision page |
| `story.ts` | The Story chapters |
| `missions.ts` | **All Partner Project pages** (largest content file; schema below) |
| `partner.ts` | Partner Projects index copy |
| `revolutionary.ts` | Cohort page |
| `category3.ts` | Category definitions (Auzi's words) |
| `getInvolved.ts`, `give.ts` | Get Involved and giving |
| `speaking.ts`, `podcast.ts`, `strategy.ts` | Those pages |
| `constellation.ts` | Constellation copy + a hand-placed `members` array (emptied July 19; Notion is the source of truth) |
| `niches.ts` | Niche list for the Vision sky |
| `images.ts` | The image slot manifest (§10) |

### Mission (Partner Project) schema, from `content/missions.ts`

Each project page is generated from one `Mission` object. Optional fields switch features on:
- `slug`, `name`, `location`, `partner`, `partnerHref`, `date`, `summary`
- `journeySub`: line under "THE JOURNEY" in the fly-through
- `journeyRoute: { afterKicker, stops[] }`: draws the ember route map mid-flight after the section with that kicker
- `cardImageSlot`, `heroSlot`, `heroVideo`
- `burningQuestion`
- `stats`: reach strip (e.g. 2M+ views)
- `commentWall`: real comments from the posted video as quote cards (**word for word from the source**)
- `videoEmbed` (YouTube) or `videoLink` (TikTok/Instagram thumbnail that opens externally)
- `slotLinks`: photos that click through to a link (with a custom hover label)
- `desktopHiddenSlots`: shown on phones, hidden on desktop
- `roster`: participants with channels and niches
- `sections[]`: `{ kicker, heading, paragraphs, imageSlots, link }`
- `links[]`: "Go Deeper" links
- `testimonies`: what creators did afterward, as collapsible rows with "receipt" pills linking to timecoded videos

Current projects:
| Slug | Name | Partner | Where | When | Route |
|---|---|---|---|---|---|
| `real-treasure` | Real Treasure | Weston Vansoest, Creative Partner 2 | Iceland and Southern California | July 9–17 2026 | California → Iceland |
| `tokyo-drift` | Tokyo Drift | Owen Tucker, Creative Partner 1 | Tokyo and rural Japan | Nov 4 – Dec 4 2025 | Tokyo → Rural Japan → Ebisu Circuit |
| `revolutionary-cohort` | Revolutionary Cohort 1 | Ben Pierce, Steiger | Joshua Tree, California | May 15–17 2026 | Shared house → Desert → Joshua Tree |
| `beast-games` | Beast Games | Auzi Films | On set and beyond (Las Vegas, Toronto, Panama island). Ten plus podcasts filmed around the biggest competition show on earth | July 2024 – Feb 2025 | Las Vegas → Toronto → Panama |

Real Treasure is the most recent project and is featured on `/partner-projects`. Its numbers: 2M+ / 1M+ / 11K+ summed across platforms, refreshed on request (checked Aug 22 via yt-dlp). One later commit references 7.2M views on the Vision claim strip. **Refresh stats before quoting them.**

---

## 10. The image slot system

- Every photo position on the site has a **named slot** in `content/images.ts`: `{ file, alt, caption: { who, where, when }, ratio }`.
- `lib/media.ts` checks at build time whether `public/images/<file>` exists. `components/MediaSlot.tsx` renders the real photo or a dignified labeled placeholder.
- **To add or swap a photo:** drop the file into `public/images/` with the exact filename from the manifest, then rebuild. To add a new slot, add an entry to `IMAGES` and reference it by name.
- Captions read like **documentary lower thirds**: who · where · when.
- **Known gotcha (fixed Aug 22):** with `fill`, Tailwind class order made `relative` beat `absolute` and collapsed photo heroes. If a full-bleed photo collapses to zero height, check that first.
- **Weight:** keep stills under ~400 KB. An Aug 30 audit recompressed 65 stills and saved 5 MB; before that 20 images were over 400 KB, with the largest at 676 KB.

---

## 11. Design system: the analog black purple look

The **canonical design is black/purple analog** (rebranded July 12 2026). The original July 5 design was warm amber, and `README.md` and `HANDOFF.md` still describe that old design (§28).

### Tokens (`app/globals.css` → `@theme`)
```css
--color-night:     #07050c;  /* page background */
--color-soot:      #130d1d;  /* raised surfaces */
--color-starlight: #efecf7;  /* text */
--color-ember:     #a78bfa;  /* accent / glow / focus ring */
--color-violet:    #6d28d9;  /* deep accent */
--color-dust:      #978bad;  /* muted meta text */

--font-display: Archivo     (headings weight 700, tracking -0.01em)
--font-body:    Figtree
--font-meta:    Fragment Mono (uppercase, 0.18em tracking: "typewriter metadata")
```

### Visual language
- **Film grain** over everything (one fixed layer).
- **Faint brand starfield** (`/brand/bg-black-stars.jpg`) behind every page at 30% opacity.
- **Colorways per page**, drawn from the brand kit's star art: purple (home/partner), green (Revolutionary/Vision), orange (giving), blue (The Story hero), green/purple. Each hero fades into black through an "afterglow".
- **Hero menu** = "tape menu": Fragment Mono, 22px, uppercase, natural tracking, violet glow on hover. It's an exact match to Auzi's brand page.
- **Glitch headings** sitewide at **42ms**. This was tried faster and reverted, so 42ms is the number.
- **Meteor / comet / shooting-star motifs** are everywhere. Prefer the brand-kit photo art (`public/brand/fx-*.webp`, `meteorite-orange.webp`) over pure CSS. CSS meteors were replaced with real art more than once.
- **12fps stepped "analog" motion** is used for the burning/fire effects family (a Prometheus Fuels technique that fits the VHS brand).
- **No visible section seams.** A lot of work went into gradient blooms and eased gradients that kill Mach bands. Seams were checked by row-scanning screenshots of every page (Aug 28–30). New sections should fade into each other.

### Layout rhythm (standardized Aug 30)
- **8px spacing scale** for heroes, sections, CTA bands and paragraph stacks.
- **One heading scale** sitewide, with quiet headings on their own token.
- **Readability caps:** long copy holds 60–75 characters per line.
- **Kicker → heading gap:** `mt-6`.
- On phones, the Partner Projects burst card and project list keep a constant **48px rhythm** on every phone size.

### Motion rules
- Respect `prefers-reduced-motion`. Reduced motion gets plain static fallbacks (e.g. ProjectBurst becomes a plain heading + list).
- Animate **transform and opacity only** wherever possible (see the LetterFall lessons in §15).
- **No device-motion APIs** (tilt or shake). iOS permission prompts annoyed Auzi, and both effects were removed.
- Below-the-fold videos load only on approach. YouTube embeds are lazy, and hidden variants fetch nothing.

---

## 12. Copy and voice rules

- **No em dashes or hyphens in display copy.** This is a hard rule from the start of the project. Headings and on-page copy use periods, commas or line breaks instead.
- **ANCHOR_VERSE is reproduced exactly.** Never edit it.
- **Title Case** on section headers and item headers.
- **Only two programs** (Partner Projects, Revolutionary Cohort). Never call Category 3 a program.
- **Say "creator missionaries", not "content missionaries"** (changed Aug 3).
- **"Talk", not "Sermon"** in speaking formats.
- **"Steiger", not "Steiger Ministries"**, in link labels.
- **The podcast is referred to by its name only** (Respectfully Inspired).
- **Copy Auzi supplies is used verbatim.** Many commits are literally "in Auzi's words".
- **The Story is told by Auzi in first person.**
- **Mission line wrapping is set by hand:** three lines on phones, two on desktop.
- **Comment walls quote the real comments word for word.**

---

## 13. Forms, email, and Notion

All forms POST to `app/api/*` route handlers. Each has a **honeypot field named `website`** (bots fill it and get a fake success), validates required fields, then tries to send:

| Endpoint | Form | Required | Delivery |
|---|---|---|---|
| `/api/apply` | `/apply` multi-step Partner Project application | name, email, God dream | Resend → else mailto fallback |
| `/api/waitlist` | Cohort 2 waitlist on `/revolutionary` | name, email (also handle, "based in", give/receive) | Resend → else mailto |
| `/api/speak` | Speaking inquiry | name, email, event | Resend → else mailto |
| `/api/subscribe` | Footer newsletter | email | Resend → else mailto |
| `/api/constellation` | Constellation join | name, email, state | **Notion insert** (+ Resend if set; mailto is a last resort) |
| `/api/constellation-debug` | **Temporary diagnostic, DELETE IT** (§22) | | |

**Important:** `RESEND_API_KEY` has **never been set** in production. In practice every form except the Constellation opens the visitor's mail app with a prefilled email to auzi@starsforever.co. To make the forms send directly: create a Resend account, verify the starsforever.co domain, set `RESEND_API_KEY` (and ideally `MAIL_FROM` on the verified domain) in Vercel, and redeploy. No code changes are needed.

---

## 14. The Constellation (map, globe, Notion workflow)

**What it is:** `/constellation` (added July 17 2026) is a public map of approved Christ-centered creators, plus a private WhatsApp community. Both are invite-only and personally approved by Auzi. The first star placed was Auzi Films.

### Workflow
1. A visitor submits the join form (`ConstellationForm.tsx`) → `POST /api/constellation`.
2. `lib/notion.ts` inserts a row into the **"Constellation Requests"** Notion database (on Auzi's "The Constellation" page in the "Respectfully Inspired's Notion" workspace).
3. Right after submitting, the visitor sees the **WhatsApp community invite** on screen (`WHATSAPP_INVITE` in `content/site.ts`). This is a policy decision from July 20: everyone gets the group-chat link immediately.
4. **Map placement still requires approval:** Auzi flips the row's **Status** select to **"Accepted"** in Notion.
5. The page queries Notion for Accepted rows (`getAcceptedMembers`), geocodes each place through the free **Open-Meteo** geocoder (cached for a day; unknown places are skipped rather than mapped wrong), and renders them as stars. The page revalidates every 300s (ISR), and the member query uses `cache: "no-store"`, because a cached empty result once pinned the globe empty.

**Notion database properties:** Name (title), Email (email), Channel (url), **City (rich_text, which now holds a STATE/REGION value; the column name stays "City" on purpose)**, Country (rich_text), Note (rich_text), Status (select).

**Integration permissions:** insert + read only (no update or delete).

### The globe (`ConstellationGlobe.tsx`, Aug 29–31 2026)
This replaced the flat map and was inspired by Igloo Inc (Awwwards SOTY):
- three.js star-dust globe. Land dots come from `/constellation-land.json`, sampled off `world-map.svg` with cos-latitude thinning, plus an inner occluder sphere.
- Drag, pinch, idle spin. Tap a member star for a creator card (spring physics in and out).
- Random member arcs, a constellation-mode toggle, and a fly-in assembly that runs once per session.
- The headline is **written in stars**: letters gather, then disband into the swarm that builds the world.
- **Region drill-down:** earth → continent → country → state. Each zone morphs the stars into its **real boundary outline** (actual map polygons). Countries and states ride a **snap carousel** where each swipe re-forms the stars. Every level is explorable even with zero members, and counts stay honest. Greenland was retired from the continent view.
- Flat-map fallback (`ConstellationMap.tsx`).
- The globe was still being iterated when work paused ("user iterating on likes/dislikes").

### Send a Star
`?star=Name` on a URL opens a full-screen arrival: the night takes over the screen, a star descends into the map, and a greeting appears below the map. `SendStar.tsx` handles it; it's server-rendered.

---

## 15. Signature effects and the hard-won lessons behind them

### Star cursor (`StarCursor.tsx`), July 19, user-approved after MANY iterations
- A four-point star cursor with a **smooth canvas ribbon comet tail**: 11 chain links, a 7px head that tapers, white → violet, and it chases and melts.
- Drawn as **filled quads, NOT stroked segments.** Stroked round caps read as "dots", and the owner hates that.
- On `/constellation` the comet tail switches off and `ConstellationTrail.tsx` (a lingering 1300ms chemtrail) takes over: **one streak per page**.
- The owner's reference favorite is at commit **`4f65851`**. If the cursor ever regresses, compare against it.

### Warp jump page transitions (`WarpNavigator.tsx`)
- Picked by the owner on Aug 28 from four offered styles: **warp jump**, crossfade through stars, shooting star wipe, analog glitch cut. **If they dislike it later, show the four options again.**
- It had been broken for a long time. The fix was `flushSync` so the canvas mounts before the first draw.
- Final behavior: the jump starts from stillness, stars materialize and accelerate as **purple long-exposure streaks**, the page and menu fade out flat (so no edges peek through), the load overlaps the jump, and the new page decelerates back in.

### Supernova (`StarField.tsx` + `LetterFall.tsx`)
Click the hero logo 7 times → the logo collapses and detonates, flies off as a shooting star, the letters fall, a glowing cross raises every fallen letter, the menu resurrects, and the mission line becomes **John 11:25** glowing forever. Daniel 12:3 is born star by star beneath the cross, shines, and ascends into stardust.

**LetterFall lessons (these took a whole day):**
- Clone flights must animate **TRANSFORM ONLY**. Keyframed `text-shadow` causes main-thread jank, which shows up as scattered letters.
- **Never reuse fallen spans.** Always create fresh spans.
- **Freeze the mission element's height before swapping text.** Shorter text re-centers the flex-centered menu and causes a half-inch jump.
- **Snap-finish all overlay animations before the reveal.**

### StarBridge
A shooting star that bridges the reframe line ("...like the stars...") into a bursting Tokyo Drift header. **Desktop only** since Sep 25; phones get a tightened gap instead.

### Home mission intro
The mission statement opens the site at center stage, then glides home. The intro flag lives on the `<html>` element so React can't strip it, and it survives hydration effect reruns.

### Other notable effects
- **VHS tape intro** (`TapeIntro`)
- **Rare shooting stars** across any page
- **Warp scroll:** faint, fine, brief streaks behind the words on very fast scroll (made "whisper" quiet after being too loud)
- **Category 3 Ignite:** the Category 3 card burns. The final version is a title that fades into a white fire glow with a charge, purple label, and example link. A write-on effect was removed. Desktop keeps Categories 1 and 2 lit; the "spotlight steal" is mobile only.
- **Apply hero:** living purple spiral galaxy canvas. Long-exposure purple trails get sucked into the galaxy on desktop, and the doubt words (fear, anxiety, unworthiness) are pulled into it and burn out. Dream stars arrive and merge on scroll, waiting a full second after load on mobile.
- **Get Involved CTAs:** photo-real meteor glyphs with living fire point at each action.
- **"Sound Familiar?" deck** (Revolutionary): swipe-through monologue with a burning orange meteorite (brand art) whose embers intensify on every swipe.
- **Mobile Revolutionary video:** black-out spotlight with a glowing "Press Play" and a "Rotate" hint.
- **Footer/closing:** the anchor verse is written in stars. Explore is the "split index": numbered credits beside a drifting viewfinder that previews whichever page you hover. The viewfinder pins on phones.

---

## 16. Easter eggs and secrets

Documented for Auzi in Notion: "Site Secrets & Wonders" page under The Constellation.

1. **Supernova:** 7 clicks on the hero logo (§15).
2. **Type JESUS** anywhere → John 5:24 is summoned (`VerseSummon`).
3. **Gold star:** a big four-point gold star appears about 1 in 250 times, roughly on a once-a-minute appointment. Clicking it starts the Matrix-green code rain (`CodeRain`): "MYSTERY MAKES HISTORY" / "reach out to Auzi". The hidden star and its sky are royal/deep purple.
4. **Warp-speed scroll streaks.**
5. **Send a Star** links (`?star=Name`).
6. **Good Friday** red theme (`GoodFriday`).
7. A **whispered star** hidden on three pages (`ConstellationWhisper`).
8. **Lost-in-space 404.**

**Removed easter eggs (don't bring them back without asking):** the tape shelf, the wall of light, tilt sky, shake meteors, touch comet (all mobile motion effects were removed by July 20), and mega meteorites.

---

## 17. Partner Project pages and the journey fly-through

Each `/partner-projects/[slug]` page has: hero (photo or ambient video loop) → metadata header (partner, location, date) → stats strip → burning question → featured video → **THE JOURNEY** → sections → comment wall → testimonies → Go Deeper links.

### The Journey (`JourneyScene.tsx`), Aug 27–29
- Built as **Tier 1** of the Site-of-the-Year roadmap (§24): the story's photos are **planes in 3D deep space** along a flight path, scroll flies the camera through, there's fog depth, and story beats float between photos.
- It starts with a glowing glitch title gate at zero depth and lands in darkness before unpinning. The loop and starfield sleep once you've passed.
- The camera loop is continuous and eased, with eager async image decode for smoothness.
- **Route interludes (Tier 3):** mid-flight, an ember line draws the mission's geography (e.g. Tokyo → rural Japan → Ebisu Circuit). Each waypoint carries a tiny **constellation-outline drawing** of the place, using real logos where relevant (the MrBeast panther for Beast Games, the Stars Forever star for Stars Forever; Panama is drawn as an island, Iceland gets its fjords). Labels alternate above and below, counted back from the end. Black breathing room follows every text and map plane, and photos stay dark until the map finishes.
- On mobile a glowing thread leads from the video into the journey.
- It's now used on **all** partner projects **and** The Story (California → Beast Games → the island → Stars Forever).
- The Story's opening line holds steady (no glitch scramble), and brother photos open the story flight.

### Real Treasure details (Aug 22 + Sep 4)
- Hero = an 18s Iceland montage cut from the TikTok itself (16:9 crop of a 720p yt-dlp download) at `brand/video/real-treasure-hero-bg.mp4`, with 0.35s crossfades. No waterfall clip; it ends on snow. Poster = Weston in a flower field.
- The full 2-minute video is self-hosted at `brand/video/real-treasure-full.mp4` in a vertical VideoBlock below the burning question. The thumbnail elsewhere opens Instagram.
- Video links: instagram.com/reel/Db9PKZrPr3g and tiktok.com/t/ZTDmy4fXm
- Sep 4 "Iceland film drop": Weston and the map open the fly-through, with a new cover on the black sand. The ice cave, horses, Diamond Beach, the hitchhiker roadside pickup, and Weston at the falls joined the journey.

### Tokyo Drift
Links to the real Owen Tucker podcast episode. YouTube video embedded and featured on home. The comment wall uses real faith-related YouTube comments. Stats live inside "Go Deeper".

### Revolutionary Cohort 1 testimonies
Each creator has a tag, a line, and "receipt" pills linking to timecoded video moments where Jesus shows up in their content. Examples: Lucas Mayfield ("A grandma, a skydive, the gospel") now has four purple receipt pills with Scrappy's story leading. Jordan Orme: "two channels, one gospel". Owen Tucker: three adventures, Jesus in all of them. Weston joined with his treasure hunt.

---

## 18. Do not casually rework these

These were iterated with the owner many times and explicitly approved. Change them only when asked, and keep any change in its own revertible commit:

1. **StarCursor** comet tail (reference commit `4f65851`).
2. **LetterFall / supernova** choreography.
3. **ProjectBurst** ("The Projects So Far" on `/partner-projects`), built against the reference https://omeduogroningen.nl: ONE pinned scene with the heading and intro at top and a tight collage of 6 equal photos packed around a looping Real Treasure montage video at 60% vertical. Scroll bursts the photos radially outward, and the video grows until its width **exactly** reaches the screen edges (never past), finishing at the release point. The card list overlaps in via `-mt-[20svh]` so it "scrolls right into" the cards. Collage offsets are pixel-clamped (vw with min/max px) so photos never climb into the heading. Since Sep 25 **the collage measures the heading and ducks below it**, so no screen size hides the intro. The list overlap is exact geometry: *47svh minus half the card, minus 48*.
   - **The desktop version currently matches mobile.** A desktop "peek" experiment was reverted, and the owner said: *"desktop scroll effect is bad, reverse it, I will give you new revisions."* **Wait for the owner's desktop revisions before touching it.**
4. **CohortSpotlight** (home "Recent Work"): no scroll effect. It has a dusk video card ("Joshua Tree / Learn More" → /revolutionary), 10 swipeable creator cards, a "Read About The First Event" button, "next cohort coming soon" with the graded b-roll montage, an /apply link, and the Steiger credit.
5. **Cohort montage rule:** mostly group shots, one roadtrip shot, scenic is OK, and **NEVER the red hoodie clips** (C2552–C2558, C2563).
6. **Warp jump** transitions (§15).
7. **Galactic mobile menu**: left-aligned starred links, no Home entry, centered footer line.
8. **Home hero colors**: restored to their exact originals after an ambience experiment (§19).

---

## 19. Things that were tried and rejected

Useful so you don't rebuild them by accident:

- **ProjectTimeline.tsx** (fly-through, then horizontal strip): built and **deleted**. The owner rejected both.
- **ProjectBurst desktop peek** (photos peeking into the hero, heading arriving late): reverted.
- **Desktop home "zig zag"**: tried, then adjusted.
- **"Twelve hero upgrades across every inner page"** (July 15): reverted the same day.
- **Purple ambient drift across home** (July 17): removed, "cleaner without it".
- **"Seven brand-art star effects"** across home, vision and partner projects (Aug 23): reverted.
- **Process constellation** (zigzag): removed.
- **Page ambience / continuous color field** (Aug 30): every color restored exactly to the pre-ambience state. Only the meteors and the roster grid survived.
- **Faster glitch** headings: back to 42ms.
- **Explore as a star tunnel** (Sep 4): reverted. **Explore as an orbit ring** (Sep 5): replaced. The current version is the **split index + viewfinder**. `ExploreOrbit.tsx` and `ExploreIndex.tsx` are still in the repo, unused.
- **Category 3 title write-on effect**: removed. Many glow color variants were tried (blue, purple, orange); the final one is white fire glow.
- **Tilt, shake, touch comet** mobile effects: all removed (permission prompts).
- **Mission line centered** experiment (Sep 25): the "experiment, revert freely" commit stayed, but then wrapping by hand came in.
- **Tokyo Drift star thread into the journey** (Sep 25): reverted. The bridging star is desktop only.
- **Daniel 12:3 in plain type** (Sep 30): reverted next day back to "written in stars"; the scroll-to-top fix stayed.
- **Vision continuous hero canvas**: first take reverted, second take kept.
- **Statement band / lock-in spark** on the niche sentence: dropped.
- **CohortGather / CohortConstellation**: shelved alternates.

---

## 20. Assets: the brand kit and raw media (outside the repo)

The raw asset library lives on the owner's machine at `~/Claude Code/stars-forever-assets/` (**about 38 GB, NOT in git**; there's also a copy in iCloud Drive). Web-optimized copies of everything the site uses are already in `public/brand/` and `public/images/`, so **you don't need the raw library to run or edit the site.** Ask the owner if you need originals.

What's in it:
- **`Assets/` + `Stars-Forever-Brand-Kit.zip`**: logos and star art in six colorways (purple, green, orange, blue, green/purple, black). Originally from Google Drive folder `17FuvPFipYN8q3qC-HWiqEECraf4vTG4r`.
- **`Video Explinations/`**: 2-minute explainers for Stars Forever, Partner Projects and Revolutionary Cohort (web versions are in `public/brand/video/`, **re-encoded to 8-bit** so desktop browsers can play them, and halved in size).
- **`YouTube Strategy Referrals/`**: five referral/testimonial videos (cut and mounted on /strategy).
- **`Real Treasure/`**: raw HEICs + comment screenshots (Drive: Stars Forever Website > Parter Projects > Real Treasure, folder `1GokEeWCYZEbQ87p6dW9oPmjkiFmUu_zu`; `IMG_7312.heic` is permission-blocked).
- **`tokyo-drift/`**: ~45 photos + `Tokyo Drift Background.mov`.
- **`beast-games/`**: Beast Games photos.
- **`revolutionary-cohort-1/`**: `Photos/`, `Audio Sessions/`, `Event Videos/B-Roll/` (36 Sony 4K HEVC S-log clips, about 12 GB, from Drive folder `12rLVjUNph1ReoGIH2YlPppTN4GK1AVFX`; one file permission-blocked).

**In `public/brand/`:** background art (`bg-*.jpg`), effect sprites (`fx-*.webp`, `meteorite-orange.webp`, `dark-meteor.png`), logos and icons, per-page OG images (`og-*.jpg`), video posters, route-map logos (`route-beast.png`, `route-star.png`), `world-map.svg`, and the speakers one-pager PDF.

**In `public/brand/video/`:** hero loops (beast, tokyo, real-treasure), cohort-dusk, cohort-montage, three explainers, five testimonials.

---

## 21. Video and image processing recipes

**S-log color grade** (used for `brand/video/cohort-montage.mp4`; reuse it for any future cohort footage):
```
curves=master='0/0 0.10/0.02 0.32/0.26 0.58/0.66 0.82/0.93 1/1',
eq=saturation=1.7:contrast=1.06,
colorbalance=rs=.02:bs=-.02:rm=.01:bm=-.015
```
(as an ffmpeg `-vf` chain)

**General video rules learned:**
- Re-encode to **8-bit H.264** for web. 10-bit/HEVC won't play in many desktop browsers.
- Ambient hero loops: short (~18–30s), light, brightness around 55%, crossfades of about 0.35s between scenes.
- Use `preload="metadata"` and lazy-load below-the-fold videos.
- Always ship a poster JPG (`public/brand/poster-*.jpg`).
- Social videos: download with **yt-dlp**, then crop and cut with **ffmpeg**.

**Images:** recompress stills to under ~400 KB, convert HEIC to JPG, and crop to keep faces (several commits exist just to keep Weston's head and arms in frame).

---

## 22. Open issues and known bugs

### 🔴 1. Notion token is dead, so the Constellation shows zero members (open since Aug 29 2026)
The Notion integration token returns **401 Unauthorized** from both production and local. `getAcceptedMembers()` returns `[]`, so the globe shows no member stars, no counts and no region chips (they only render when members exist). The owner deferred the fix.

**Fix:**
1. **Owner:** notion.so/my-integrations → the Stars Forever integration → copy the Internal Integration Secret. Check that it's still connected to the Constellation Requests database (database `⋯` → Connections).
2. Update `NOTION_TOKEN` in `.env.local` **and** in Vercel production: `npx vercel env rm NOTION_TOKEN production --yes`, then `npx vercel env add NOTION_TOKEN production`. Or do it in the Vercel dashboard: Settings → Environment Variables.
3. Redeploy (`npx vercel deploy --prod`) and check that member stars and chips appear at https://starsforever.co/constellation.
4. **Delete `app/api/constellation-debug/route.ts`.** It's a temporary diagnostic that returns only booleans and lengths, but it shouldn't stay.
5. **Data cleanup:** existing Notion rows hold **city** names in the "City" column, but the map now expects **state/region** values there (e.g. San Diego → California).

### 🟠 2. Resend is not configured
All forms except the Constellation fall back to `mailto:`. See §13 for the fix.

### 🟠 3. Small-phone overlap on Partner Projects (reported Sep 25)
The scroll effect looks right on an iPhone 15 Pro Max, but on smaller phones the project photos covered text. The "audience" section was the example given. Commit `9d6db11` (*"The collage measures the heading and ducks below it, so no screen ever hides the intro"*) was the fix attempt. **Check it on small viewports (375×667, 390×844)** before calling it done.

### 🟡 4. Mobile layout reports from Sep 5
The owner sent iPhone screenshots showing uneven spacing and overlap, and a photo clipping above the Constellation section on scroll. Commits that same day adjusted spacing in the closing scenes ("The last three scenes breathe evenly"). **Not confirmed fixed; check on a phone.**

### 🟡 5. `NOTION_LIGHTS_DB_ID`
It's in the owner's `.env.local`, but no code uses it. It's probably left over from a planned feature. Ask before building on it.

### 🟡 6. Outdated `README.md` / `HANDOFF.md`
They describe the July 5 warm-amber build (§28).

---

## 23. Still waiting on Auzi / content gaps

From the running "pending" list (some may have arrived since):
- Founder portraits (better/official ones)
- Direct YouTube links for some references
- Impact numbers
- Cohort quotes
- Real social links (partly done: Instagram @starsforever.co, LinkedIn, YouTube @RespectfullyInspired are live)
- **RESEND_API_KEY**
- **Tokyo Drift photos still missing:** a real **subway shot** (the strangers-on-the-subway story beat) and a **crowd/track shot from the Ebisu drift event**.
- **General rule:** when a story beat needs a photo that isn't in the assets or `public/images`, ask the owner. They offered to supply more photos.
- Auzi still needs to delete an old copy of the "Site Secrets & Wonders" Notion page.

Done since the list was made: the custom domain (starsforever.co), the giving platform (EquipNet), Beast Games + Tokyo Drift photos, and the cohort photos.

---

## 24. The "Site of the Year" roadmap

On Aug 26 2026 the owner asked for research into Awwwards Sites of the Year (Lando Norris, Igloo Inc, Lusion v3, Persepolis Reimagined, Umami Land, Star Atlas, Prometheus Fuels, Mammut Baikal, Nomadic Tribe) with an eye to submitting starsforever.co.

**Core lessons:** one continuous world, not sections. Scroll is the camera. Photos are applied to 3D rather than going pure 3D. Every transition carries a signature texture.

| # | Idea | Status |
|---|---|---|
| Tier 1 | Journey pages: photos as planes in 3D, scroll flies the camera, fog, floating story beats | ✅ **DONE** on all partner projects + The Story |
| Tier 2 | Single-photo 3D depth via AI depth maps (Facebook 3D-photo parallax) on hero shots | ⬜ Not started |
| Tier 3 | Route interludes: ember line draws the trip's geography | ✅ **DONE** on every journey |
| QW1 | 12fps stepped analog effects on ambient animations | ✅ Done for the burning-effects family |
| QW2 | Scroll-velocity reactions: starfields/trails stretch with fast scroll | 🟡 Partly (WarpScroll) |
| QW3 | Fog depth on home showcase far cards | ⬜ |
| QW4 | Desktop cursor as faint ember star with decaying trail | ✅ (StarCursor) |
| 5 | Seamless page transitions | ✅ **DONE** (warp jump) |
| 6 | Shader photo reveals: frost/displacement dissolve (OGL) | ⬜ |
| 7 | Menu constellation: links as stars with connecting lines | ⬜ |
| 8 | Full journey pages everywhere | 🟡 Projects + Story done |
| 9 | Playful toy: fly a star through the Vision Digital Sky igniting niches | ⬜ |
| 10 | Opt-in ambient sound design (muted by default) | ⬜ |
| 11 | Igloo-style 3D star globe for the Constellation | ✅ **DONE** (needs the Notion fix to show members) |

Also from the Aug 30 research: a GSAP/ScrollTrigger skill pack and an open-source "web-designer-plugin" with 48 patterns from top sites. Treat those as references; neither is a dependency.

---

## 25. How the owner likes to work

- **They review on an iPhone.** Mobile comes first. Never ship a desktop-only effect and call it done. Scroll-driven effects are fine; device-motion APIs are not.
- **Link the live page at the end of every update message**, and link the specific page that changed: https://starsforever.co/... — **not** the vercel.app URL.
- **Small, fast iterations.** Expect "a bit higher", "a touch more air", "swap these two photos". Each tweak becomes one commit plus a deploy.
- **"Try it, revert freely."** Experiments are welcome, but keep them isolated so they revert cleanly.
- **When offering design options, show them** (screenshots or quick variants) instead of describing them, and remember which ones were turned down.
- **Copy from Auzi goes in verbatim.**
- **Don't redesign approved pieces unprompted** (§18).
- **They hate "dots"** in trails and comet tails. Everything should read as one continuous streak of light.

---

## 26. Full project timeline

| Date | What happened |
|---|---|
| **Jul 5** | Scaffold: Next.js, content modules, design system, all eight pages (original warm-amber design) |
| **Jul 6** | QA pass, sr-only h1 on home |
| **Jul 12** | **Rebrand to analog black purple** with the official brand kit. New hero menu, drifting starfield, cohort photos, colorways sitewide, Fragment Mono. **Phase 1 ($20K push, approved by Auzi):** hyperspace transitions, application, newsletter, analytics, SEO |
| **Jul 13** | Category naming churn (settled on "Category 3 Explained"), per-page colorways, home section order, afterglows |
| **Jul 14** | Real photos fill Tokyo Drift + Beast Games. Podcast links. Ambient hero videos. Cohort 1 roster with creator links. Favicon |
| **Jul 15** | The Story as a constellation journey. Giving goes live via EquipNet. Two cofounders. Explainers re-encoded to 8-bit. Speaking page overhaul. Meteor quick-action links |
| **Jul 16** | Podcast page (Respectfully Inspired). auzi@starsforever.co sitewide. Mission intro animation. YouTube Strategy page with five testimonials |
| **Jul 17** | Strategy price ladder. Category definitions in Auzi's words. **The Constellation launches** (map, form, first star: Auzi Films). StarBridge comet → header ignition. GitHub backup begins |
| **Jul 18–19** | **Star cursor** saga. **Notion-driven Constellation.** **Twelve wonders** (supernova, summoned verse, gold star, warp scroll, send-a-star, Good Friday...). LetterFall perfected. Touch comet removed |
| **Jul 20** | Shake removed (iOS permission prompts). **starsforever.co** becomes canonical. WhatsApp link shown to everyone |
| **Jul 22–25** | Per-page share cards. Daniel 12:3 born from stars beneath the cross. Cohort testimonies "case files" with receipts |
| **Jul 27** | **The Vision page.** Story in Auzi's first person. Digital Sky chart (hand-drawn connections). Vision replaces Story in the menus |
| **Jul 29 – Aug 7** | Juicy Jacob naming. "Creator missionaries" wording. Jordan's testimony updates |
| **Aug 22** | **Real Treasure** project live. **ProjectBurst** (omeduo reference). CohortSpotlight. Graded cohort montage. Desktop zig-zag essays. 74 commits in one day |
| **Aug 23** | Vision argues one beat at a time. Problem stats deck. **Sound Familiar deck** with burning meteorite. Meteor trio. Revolutionary mobile parity |
| **Aug 24** | Which Creator Are You. Category copy. Photo-real meteor CTAs on Get Involved. **Category 3 Ignite** (many glow variants) |
| **Aug 25** | Apply page rebuilt: spiral galaxy, light trails, dream stars, proof strip. Cohort 2 waitlist questions. Mobile rotate hint |
| **Aug 26** | Galactic mobile menu. Continuous hero canvases. Vision claim strip + niche cycler. **SOTY research** |
| **Aug 27** | **Journey fly-through** (Tokyo Drift prototype → all projects). Comment walls from real comments |
| **Aug 28** | Sitewide seam removal (gradient blooms). 12fps analog motion. The Story becomes a fly-through. **Warp jump fixed.** Tier 3 route interlude |
| **Aug 29** | Warp jump polished into the brand look. Route maps with real outlines and logos. **3D Constellation globe.** Region drill-down. **Notion 401 discovered** |
| **Aug 30** | Ambience experiment (reverted). 8px spacing scale, type scale, readability caps. Seam elimination by measurement. Performance pass (lazy video, 65 stills recompressed). Globe card physics |
| **Aug 31** | Globe: real geography outlines, swipe carousel, explorable empty zones, stats count-ups |
| **Sep 4** | Iceland film drop into the Real Treasure journey. Footer becomes the final scene (verse in stars). Explore experiments |
| **Sep 5** | Explore settles on the split index + viewfinder. Mobile layout reports |
| **Sep 16–25** | Lucas Mayfield receipts (Scrappy). Mission line hand-wrapped. Collage ducks below heading (small-phone fix). StarBridge desktop only |
| **Sep 30 – Oct 1** | Scroll-to-top on route change. Daniel 12:3 back in stars. **Last commit: `e9c9220`** |
| **Oct 29** | Repo made public for this handoff |

716 commits in total. Busiest days: Aug 22 and Jul 19 (74 each), Jul 17 (66).

---

## 27. Key links and IDs

| Thing | Value |
|---|---|
| Live site | https://starsforever.co |
| Vercel URL | https://stars-forever.vercel.app |
| Vercel project | `stars-forever` |
| GitHub | https://github.com/potatowizardpotatowizard/stars-forever-website |
| Primary email | auzi@starsforever.co |
| Booking calendar | https://calendar.app.google/RctCvj7JcxaCzEMv5 |
| Giving (EquipNet) | https://www.equipnet.org/missionaries/aweber |
| Instagram | https://www.instagram.com/starsforever.co/ |
| Auzi Films Instagram | https://www.instagram.com/auzi.films/ |
| LinkedIn | https://www.linkedin.com/in/auzifilms/ |
| YouTube / podcast | https://www.youtube.com/@RespectfullyInspired |
| Benjiman | https://benjiman7.com |
| Steiger | https://steiger.org |
| ProjectBurst design reference | https://omeduogroningen.nl |
| Notion DB | "Constellation Requests" on "The Constellation" page, workspace "Respectfully Inspired's Notion" (ask the owner for access) |
| WhatsApp community | in `content/site.ts` as `WHATSAPP_INVITE` |
| Favorite cursor commit | `4f65851` |
| Last commit at handoff | `e9c9220` (Oct 1 2026) |

---

## 28. Outdated docs in the repo

- **`README.md`** and **`HANDOFF.md`** were written on July 5 2026 and describe the original **warm-amber** design, before the July 12 rebrand. **This file supersedes them.** Treat the black/purple analog look as canonical. Updating or removing the old two is a reasonable first commit.

---

### Suggested first steps for you

1. Clone it, run `npm install && npm run dev`, and click through every route on desktop and at iPhone size.
2. Read `content/site.ts`, `content/missions.ts`, and `app/layout.tsx`. Those three files explain most of the site.
3. Get added to the Vercel team (or agree that the owner deploys).
4. Pick up open issue #1 (Notion token) with the owner, since it needs their Notion login.
5. Check the small-phone overlap (#3) on real devices.

Welcome aboard. 🌟
