# Studio Chalo · homepage demo

A single-page site for Studio Chalo, a wedding photography and films studio in Nagpur led by Nitesh Titarmare, built around the studio's own line: "We make memories more beautiful."

It is a pitch demo, live at **https://studiochalo.vercel.app**. Search engines are kept out (demo mode). Studio facts come only from the studio's own public profiles and Google listing; anything unconfirmed is hidden or tagged "placeholder", and the twelve photographs are AI-generated stand-ins until the studio's own work replaces them.

- **Design source of truth:** [`DESIGN.md`](DESIGN.md)
- **Photographs:** [`IMAGES.md`](IMAGES.md) (sizes, composition notes, how to replace them)
- **What to confirm with the studio before launch:** [`CLIENT_CHECKLIST.md`](CLIENT_CHECKLIST.md)
- **Conventions for anyone (or any AI assistant) editing the code:** [`CLAUDE.md`](CLAUDE.md)

## The look

Black and white, like the studio's logo; the photographs are the only colour on the page. Ink type and black buttons on a soft white page, silver hairlines, and two black "darkroom" bands: the stories film roll and the footer, which carries the studio's script logo across the full width. The logo itself is traced from the studio's file into vectors, so it is sharp at every size and turns white over photographs.

## What is on the page

| Section | What it does |
|---|---|
| Intro | First visit only: the studio's logo signs itself in (the camera rises, the script is written left to right, the small caps settle), the rules beside the heart fill with the real loading progress, the heart beats, then an aperture iris opens onto the hero. Click, scroll or a key skips it. |
| Hero | Art-directed photo (portrait and landscape crops) under "We make memories more beautiful." On large screens, scrolling turns the screen into a framed print. A WebGL "liquid light" follows the cursor. The Google rating sits in the readout. |
| Marquee | The services in italic, speeding up and reversing with your scroll. |
| The name | चलो and its reading ("chalo · Hindi for let’s go"); the paragraph develops word by word. |
| Selected stories | A black darkroom band: a pinned horizontal film roll on desktop, a swipe carousel on phones; any frame opens full screen. |
| What we capture | An index of services; hovering shows a floating photo. Each row opens WhatsApp with a message about that service. |
| Behind the lens | A print that develops as it scrolls into view, "Led by Nitesh Titarmare", and the Google rating counting up. |
| How we work | Four steps on a silver thread; each numeral fills with ink as the thread reaches it. |
| Kind words | A card stack you can drag, or move with the buttons and arrow keys, with a link to all reviews on Google. |
| Instagram | A contact sheet of frames that converge as you arrive. |
| Booking | Names, date, city and functions compose a WhatsApp message to the studio, shown live before it is sent. The date opens the site's own calendar. Nothing is sent by the site itself. |
| Footer | A black band: links, official social marks (Instagram, Facebook, Threads, WhatsApp), phone, email and area, and the script logo set to the page width. |

Also: a floating WhatsApp button, a custom cursor (white over the dark bands) and scrollbar on desktop, film grain, a 404 page ("Lost frame."), link previews for WhatsApp and social apps (the hero photo with the script logo), icons made from the logo's camera, and structured data for search engines (no rating, no price).

## Run it locally

Needs Node.js 20.9 or later.

```bash
npm install
npm run dev          # http://localhost:3000
```

`npm run dev` and `npm run build` first:

1. download the Zodiak display font from Fontshare into `src/fonts/vendor` (needs a connection on the first run; cached in `.next/cache/fontshare` afterwards);
2. create a marked placeholder for any missing photo in `/images`, and convert slot-named PNG or JPG files to WebP.

**On your phone:** with the phone on the same Wi-Fi, open the "Network" address that `npm run dev` prints (for example `http://192.168.1.20:3000`). The dev server only serves its scripts to hostnames it allows; `next.config.ts` allows this computer's own network addresses automatically, so restart `npm run dev` if the computer's address changes.

Production build and server:

```bash
npm run build
npm run start        # http://localhost:3000
npm run start:qa     # same build on port 3107, used by the tests and Lighthouse
```

## Edit the content

All copy and studio details live in **`src/content/site.ts`**. Components never hard-code text.

- **Studio facts** (`studio`): name, phone, WhatsApp number, email, area and lead photographer come from the studio's own profiles. Years active, weddings photographed, cities covered and the developer credit start as `null`; anything left `null` stays hidden.
- **Rating** (`trust`): 5.0 from 5 reviews on Google, read on 18 November 2026. `trust.show: false` hides it everywhere. See `CLIENT_CHECKLIST.md`.
- **Reviews** (`testimonials`): three placeholders in our own words, each tagged "placeholder" on the page. Replace them with real reviews (with the reviewers' permission) and set `placeholder: false`.
- **WhatsApp:** `studio.whatsappNumber` (digits with country code). `NEXT_PUBLIC_WHATSAPP_NUMBER` overrides it. With neither, every WhatsApp button opens WhatsApp in share mode with the message already written.

Photographs, their alt text, focal points and scrim strengths live in **`src/content/images.ts`**. See `IMAGES.md`.

## The logo

The studio's logo file, `brand/studio-chalo-logo.png`, is traced into vector paths by `scripts/trace-logo.mjs`:

- `src/components/brand/logo-geometry.ts`: where each part sits (small, safe in client components);
- `src/components/brand/logo-paths.ts`: the path data (server only, rendered once as an SVG sprite by `LogoDefs`);
- `brand/studio-chalo-logo.svg`: the whole lockup as one standalone file the studio can reuse.

`<Logo variant="script" />` (or `"mark"`, `"lockup"`) draws it with `<use>` in the current text colour. If the logo file changes:

```bash
npm i --no-save potrace@2.1.8
npm run logo:trace
```

## Environment variables

Copy `.env.example` to `.env.local` for local work. None are needed for the demo on Vercel.

| Variable | Purpose | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for metadata, link previews, sitemap and structured data | Vercel's production URL, then `https://studiochalo.vercel.app` |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Optional override of the studio's WhatsApp number, digits only, e.g. `91XXXXXXXXXX` | `studio.whatsappNumber` in `site.ts` |
| `NEXT_PUBLIC_DEMO_MODE` | `true` keeps the site out of search results (noindex). Set `false` at launch. | `true` |
| `OG_IMAGE_SOURCE` | Optional: preview the link card with another photo at build time | `images/hero-desktop.webp` |

Leave `NEXT_PUBLIC_SITE_URL` unset on Vercel until `studiochalo.in` is registered and pointed at the project; the production URL is used automatically.

## Deploy to Vercel

Production is the Vercel project `studiochalo` (scope `kunals-projects-a6e41378`), live at https://studiochalo.vercel.app. The framework (Next.js), build command and output are detected automatically, and no environment variables are needed.

- **Deploy from this folder:** `vercel deploy --prod` (production) or `vercel deploy` (a preview URL). `.vercelignore` keeps local QA output, the font download and photo originals out of the upload, because the CLI does not read `.gitignore`.
- **Deploy on every push:** the project is not connected to GitHub yet, because Vercel's GitHub app cannot see this repository. Give it access (GitHub, Settings, Applications, Vercel, Configure, Repository access: add `STUDIOCHALO`), then run `vercel git connect`. From then on every push to `main` redeploys production, and other branches get preview URLs.
- `vercel link` wrote `.env.local` with a short-lived `VERCEL_OIDC_TOKEN` for local use. It is git-ignored and never uploaded; never commit it.

At launch: register the domain in the studio's name, add it in Vercel (Project, Settings, Domains), set `NEXT_PUBLIC_SITE_URL=https://studiochalo.in` and `NEXT_PUBLIC_DEMO_MODE=false`, and redeploy.

The repository is public. The Zodiak font files are git-ignored and downloaded at build time (their license does not allow redistribution), and `.env*` files are never committed.

## Quality checks

```bash
npm run lint           # ESLint, zero warnings allowed
npm run typecheck      # route types + TypeScript
npm run preflight      # copy rules: no em or en dashes, no filler words, at most one middle dot per line
npm run images:check   # which photo slots are real, placeholder or missing
npx playwright test    # needs `npm run build`; starts the server on port 3107 if it is not running
npm run lh:mobile      # Lighthouse against `npm run start:qa`
npm run lh:desktop
```

The Playwright suite (31 tests in Chromium) covers:

- **Mobile menu:** 20 rapid taps, the focus trap, Escape, the background staying still, returning to the same place on the page, and closing on resize.
- **Accessibility:** axe WCAG 2.2 A/AA scans of the home page at 390 and 1440px after every section has revealed (the black bands included), with reduced motion, with the menu open, with the date picker open (days and months), and the 404 page.
- **Reduced motion:** no pins, smoothing, scrub or WebGL, and every element visible.
- **Console:** clean through the first-visit intro, the full scroll and the story viewer.
- **Hero contrast:** measured on real pixels at six widths.
- **Booking form:** validation; the date picker (past days disabled, keyboard picking, Escape, focus and scroll position restored); and the preview being exactly the text that opens in WhatsApp.
- **Review stack:** buttons, arrow keys and announcements.
- **Scroll rail:** replaces the page scrollbar on a mouse, follows the scroll and drags the page; touch devices keep their own.
- **Resilience:** the nav and the content appear even when no script runs.
- **Overflow:** no horizontal scroll at 390 and 1440px. `SHOT_WIDTHS=all` sweeps 320, 360, 390, 430, 768, 1024, 1280, 1440 and 1920px.

WebKit: `SHOT_WEBKIT=1 npx playwright test tests/screens.spec.ts --project=webkit`.

### Latest results (18 November 2026, stand-in photos)

| | Performance | Accessibility | Best practices | SEO |
|---|---|---|---|---|
| Desktop | 96 | 100 | 100 | 69 (demo mode) |
| Mobile | 77 | 100 | 100 | 69 (demo mode) |

- **Playwright:** 31 of 31 pass in Chromium.
- **SEO 69** is deliberate: demo mode blocks indexing. `npm run build:indexable` turns it off for an SEO check.
- **Mobile performance:** limited by simulated LCP (4.7s on Lighthouse's slow-4G model; the observed LCP on the same run was 0.24s). The model counts every byte requested before the hero paints, including the animation stack the design relies on (React, Next.js, GSAP, Motion, Lenis). Measured on a busy development machine; an idle one scores higher.
- **The logo** is inlined as an SVG sprite at the end of the document, on an integer grid with relative commands (14 KB of path data instead of 36 KB), so the hero markup streams first.
- **Hero contrast:** every line of hero text passes 4.5:1 (title 3:1) at every tested width with the current photos; the lowest are the readout at 4.92 (390px) and the title at 4.89 (768px).

## Project structure

```
brand/                  the studio's logo file and its traced SVG
images/                 the 12 photo slots (see IMAGES.md); PNG/JPG originals are git-ignored
public/                 grain texture
scripts/                fonts, image placeholders and checks, logo tracing, copy preflight
src/app/                layout, page, 404, page-transition template, link-preview images, icons, manifest, robots, sitemap
src/components/brand/   the traced logo: geometry, paths, <Logo /> and the <LogoDefs /> sprite
src/components/layout/  nav, mobile menu, footer, preloader, smooth scroll, cursor, grain, floating WhatsApp
src/components/sections/ one file (or a server + client pair) per section
src/components/ui/      buttons, headings, image reveals, crop marks, brand marks
src/components/webgl/   the lazy hero shader
src/content/            site.ts (copy and facts), images.ts (photos)
src/lib/                GSAP setup, media queries, scroll helpers, WhatsApp links, fonts, logo SVG for images, SEO
tests/                  Playwright specs
```

## Troubleshooting

- **Port 3000 is busy:** another local project may be using it. Run `npx next dev --port 3001`. Tests and Lighthouse use port 3107.
- **On a phone the nav never appears and nothing animates:** the page's scripts are not running. With `npm run dev`, open the "Network" address it prints and restart the dev server if the computer's address changed (only allowed addresses get the scripts). If scripts fail anyway, the nav and the content still appear after about four seconds, without animation.
- **A CSS change does not show up:** Turbopack's cache can occasionally serve a stale stylesheet. Stop the server, run `npm run clean` (clears `.next/dev` and `.next/cache/turbopack`), then start it again.
- **The font download fails:** check the connection to `api.fontshare.com`, then build again. Nothing is committed, so every machine downloads its own copy once.
- **`EBUSY` or `EPERM` errors in a OneDrive folder:** pause OneDrive sync while working, or move the project outside the synced folder.
- **Lighthouse reports `NO_NAVSTART`:** an intermittent trace failure in headless Chrome on Windows. Run it again, or point it at Playwright's Chromium with `CHROME_PATH`.

## Credits and licenses

| Asset | License or source |
|---|---|
| Logo | Studio Chalo's own mark, traced from their file; it belongs to the studio |
| Zodiak | Indian Type Foundry, ITF Free Font License: self-hosting allowed; no redistribution or modification. Downloaded at build time, never committed. |
| Hanken Grotesk, DM Mono, Tiro Devanagari Marathi | SIL Open Font License (via `next/font`) |
| Brand marks | simple-icons (CC0); the marks belong to their owners and are used unaltered |
| Icons | Phosphor |
| Animation | GSAP (free standard license), Motion, Lenis, OGL |
| Photographs | AI-generated stand-ins until the studio supplies its own |
