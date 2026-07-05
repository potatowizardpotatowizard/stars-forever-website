# Stars Forever

Website for Stars Forever, a ministry that helps creators, artists, and
entrepreneurs use their lives and platforms for Jesus.

Next.js (App Router, TypeScript) + Tailwind CSS, deployed to Vercel.

## Editing copy

All user facing copy lives in `content/` as one module per page. Components
never contain copy. Two strict rules:

1. **No em dashes and no hyphens** in any user facing string. Rephrase
   instead. Check with:
   `grep -rnE '[—–-]' content/ --include='*.ts'` and confirm every hit is a
   slug, URL, or filename, never display copy.
2. **Scripture is reproduced exactly** as provided, including internal
   punctuation. Never edit `ANCHOR_VERSE` in `content/site.ts`.

## Dropping in photos

The site ships with labeled placeholder slots. To fill one:

1. Look up the slot in `content/images.ts` (every placeholder displays its
   slot name on the site).
2. Drop a file with the listed filename into `public/images/`.
3. Rebuild (`npm run build`) or redeploy. The photo appears automatically,
   with its caption rendered as a documentary lower third.

No stock photography, ever.

## Pending items

- `GIVING_URL` in `content/site.ts` is `null`. When a donation platform is
  chosen, set the URL and the Give page switches from the mailto button to
  the platform link automatically.
- Social links in `content/site.ts` are placeholders.
- Video links on Category 3 and mission pages point to YouTube searches.
  Replace with direct video URLs in `content/category3.ts` and
  `content/missions.ts` when convenient.

## Commands

- `npm run dev` — local dev server
- `npm run build` — production build
