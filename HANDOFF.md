# Handoff status — July 5, 2026

New Stars Forever site lives here (NOT in the David Hearst folder; that is a
separate live project and was left untouched). Fresh git repo, 2 commits.

## Done

- Full source dump extracted and mined for copy
- Complete build: all 8 pages, content modules, design system
  - Routes: /, /story, /category-3, /missions, /missions/tokyo-drift,
    /missions/revolutionary-cohort, /missions/beast-games, /revolutionary,
    /partner-project, /speaking, /give
  - content/ modules hold ALL copy; components hold none
  - Image manifest (content/images.ts) + labeled placeholder system, no
    photos in hand yet (expected; that is the launch state)
  - Tokens: night/soot/starlight/ember/dust; Fraunces + Figtree + IBM Plex
    Mono; star field motif; reduced motion respected
- Type check clean, `npm run build` passes (all static, ~112 kB first load)
- Copy QA grep done: zero em dashes, zero hyphens in rendered copy
- Committed: f6e60ea (scaffold + content), 55aba1e (design system + pages)

## Where I stopped, exactly

Dev server had JUST started (npm run dev, port 3211) for the in-browser QA
pass. No page was inspected in a browser yet. Nothing else is half done; all
files are written and committed.

## Remaining QA checklist (not yet run)

1. Visual pass on every route in a browser (placeholders, spacing, hero)
2. Mobile pass at 375px + keyboard focus visibility check
3. Click every CTA (calendar link, mailtos, internal routes)
4. Lighthouse performance + accessibility 90 plus on deployed preview
5. Deploy to Vercel (new project; do NOT reuse the David Hearst project)
6. Commit any QA fixes

## To resume on another machine

cd into this folder, `npm install`, `npm run dev`. See README.md for the
photo drop-in workflow and pending items (GIVING_URL, social links, direct
video URLs).
