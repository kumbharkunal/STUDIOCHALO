@AGENTS.md

# Studio Chalo homepage: project conventions

A single-page Next.js 16 demo for Studio Chalo, a wedding photography and films studio in Nagpur. Read `DESIGN.md` before changing anything visual; it is the design source of truth. `README.md` covers running, deploying and checks; `IMAGES.md` the photo slots; `CLIENT_CHECKLIST.md` what the studio still has to confirm.

## Stack and versions (pinned)
- next 16.4.6 (App Router, Turbopack, fully static; 16.4.6 carries the security fixes for 16.0.0 to 16.4.4), react 19.3, TypeScript **6.0.3** (TS 7 breaks typescript-eslint), ESLint **9.39** (eslint-config-next's plugins do not support 10). The React Compiler lint rules are on.
- Tailwind v4 via `@tailwindcss/turbopack` in `next.config.ts`. Tokens in `src/app/globals.css` (`@theme`, default palette cleared).
- gsap 3.15 + @gsap/react (ScrollTrigger, SplitText, ScrambleText, CustomEase), motion 14 (LazyMotion + `m` from `motion/react-m`, async `domMax`), lenis 1.3 (`lenis/react`), ogl (lazy hero shader only).

## Rules
- Copy lives in `src/content/site.ts`; images, alt text, focal points, EXIF and scrim strengths in `src/content/images.ts`. Components never hard-code copy or hex values.
- Studio facts come only from what the studio has published (its profiles and Google listing). Unknown facts are `null` in `site.ts`; UI that needs them renders only when set. Never invent facts (years, counts, names, prices, ratings).
- `trust.show` gates every rating, review count and the Google reviews link. Ratings never go in JSON-LD (`src/lib/seo.ts`). No prices anywhere. No reviewer names or review text in the repository (it is public) unless the studio confirms permission.
- The theme is black and white. The accent token is ink; `error` is the only other colour and is for validation only. States must read without colour. Darkroom bands use `data-surface="dark"` (with `data-nav-tone="dark"`), which inverts the tokens in the subtree; do not hand-pick light colours inside them.
- The logo is the studio's own, traced by `scripts/trace-logo.mjs` into `src/components/brand/logo-geometry.ts` (small, client safe) and `logo-paths.ts` (server only). Draw it with `<Logo />`, which uses `<use>` into the `LogoDefs` sprite; never import `logo-paths.ts` into a client component, never set the studio's name in a font where the logo belongs, and never edit the generated files by hand.
- Server Components by default; `"use client"` only on interactive leaves. Brand marks come from simple-icons in the server component `BrandIcon` and are passed into client components as props; never redraw or recolour them.
- GSAP: import only from `@/lib/gsap` (plugins registered once). Use `useGSAP({ scope })`, `gsap.matchMedia()` with `QUERIES` from `@/lib/media`, and revert on unmount. Pins and scrubbed transforms only under `QUERIES.desktopMotion`; at most two pins (hero, stories).
- Each element is animated by one engine: GSAP for scroll, text, logo and images; Motion for UI state.
- Never call a useGSAP `contextSafe` function from inside a `gsap.matchMedia()` callback (or from another component's GSAP callback): GSAP then nests the parent context in its own child, and the next revert overflows the stack (it shows in `next dev`, where StrictMode reverts on mount). Inside `mm.add((context) => ...)`, bind deferred functions with `context.add("name", fn)`.
- Animate only transform, opacity and clip-path. Never animate blur. No window scroll listeners; use ScrollTrigger or IntersectionObserver.
- Reduced motion: no smoothing (wheel goes back to the browser via Lenis `virtualScroll`), no pins, scrub, parallax, cursor or WebGL; `[data-reveal]` elements get a 200ms fade from `GsapBoot`.
- In-page navigation goes through `scrollToSection()` in `@/lib/scroll` (Lenis with the nav offset). Overlays use `lockScroll()` / `unlockScroll()`; while locked the window reports scroll 0, so section tracking checks `isScrollLocked()`.
- All WhatsApp links come from `waLink()` in `@/lib/whatsapp`. The booking preview and the sent text come from the same template.
- `Button` renders `next/link` for in-site paths (hash links never prefetch) and accepts `wrap` for long labels on phones.
- Text over the hero photo: scrims are flat zones under the copy; tune their strengths per photo in `images.ts` with `tests/contrast-over-image.spec.ts`.
- Copy rules: no em or en dashes anywhere, at most one middle dot per line, British spelling, no filler words. `npm run preflight` enforces this in `src/`; keep the root docs to the same rules.
- React Compiler lint: no `setState` directly in effects, no mutating values returned from hooks, no reading or writing refs during render. Move the work into event handlers, refs or the library's own options.

## Images, logo and fonts
- Slot images live in `/images` (see `IMAGES.md`). The current twelve are AI-generated stand-ins, not the studio's work. `scripts/ensure-images.mjs` creates marked placeholders for missing slots and converts slot-named PNG/JPG files; it never overwrites a real photo. Never delete or overwrite anything in `/images` by hand on the studio's behalf.
- The logo source is `brand/studio-chalo-logo.png`. After changing it: `npm i --no-save potrace@2.1.8 && npm run logo:trace`, then compare `brand/studio-chalo-logo.svg` with the source.
- Zodiak is downloaded at build time by `scripts/fetch-fonts.mjs` into `src/fonts/vendor` (git-ignored) as the official static faces (Light, Regular, Light Italic) plus TTFs for the link preview card. Its license forbids redistribution, subsetting and format conversion; the repository is public, so never commit the files. Only Light is preloaded.
- Tiro Devanagari is held back until after load (`html.deva-ready`, set by `GsapBoot`); system Devanagari faces are named meanwhile.

## Commands
- `npm run dev` (port 3000), `npm run build`, `npm run build:indexable` (demo mode off, for SEO checks), `npm run start:qa` (port 3107, used by Playwright and Lighthouse)
- `npm run lint`, `npm run typecheck`, `npm run preflight`, `npm run images:check`, `npm run logo:trace`
- `npx playwright test` (Chromium, 31 tests; the QA server on 3107 is reused or started). `SHOT_WIDTHS=all` for the nine-width sweep, `SHOT_WEBKIT=1 ... --project=webkit` for WebKit.
- `npm run lh:mobile` / `npm run lh:desktop` against `start:qa`. If Lighthouse reports `NO_NAVSTART`, run again or set `CHROME_PATH` to Playwright's Chromium.
- Port 3000 may already be used by another local project; QA never relies on it.

## Deployment
- GitHub `kumbharkunal/STUDIOCHALO` (public), branch `main`. Vercel project `studiochalo` (scope `kunals-projects-a6e41378`) serves https://studiochalo.vercel.app. Until the repository is connected (`vercel git connect`, once Vercel's GitHub app can see it), deploy with `vercel deploy --prod` from this folder; `.vercelignore` mirrors `.gitignore` for that upload.
- No environment variables are needed for the demo (demo mode is on by default; the site URL comes from Vercel). `.env.local` holds the CLI's OIDC token: git-ignored, never commit it.

## Gotchas
- Turbopack's persistent cache can serve a stale stylesheet after a CSS edit (dev and build). If a CSS change is missing, stop the server, run `npm run clean`, and start again.
- Phones on the Wi-Fi reach `next dev` by this machine's IP; `allowedDevOrigins` in `next.config.ts` lists the machine's own addresses (read at start-up). Without it the dev server withholds its scripts from the phone.
- On mouse and trackpad devices the page scrollbar is `ScrollRail` (the native one is hidden under `html.js`); it tracks the scroll through ScrollTrigger and freezes while `isScrollLocked()`.
- Anything hidden until JavaScript runs needs a CSS failsafe keyed on `.js:not(.gsap-ready)` (reveals, intro, hero clip, nav); `tests/resilience.spec.ts` covers the nav.
- Test contexts set `screen` equal to the viewport and run Chromium on SwiftShader (see `playwright.config.ts`); without that, a fresh headless page can start landscape for an instant and preload the wrong hero. SwiftShader is slow to paint the first frame, so timed screenshots of the intro miss it; record it with the GPU instead.
- The project sits in a OneDrive folder: if builds fail with `EBUSY` or `EPERM`, pause sync or run again.
- Keep LF line endings (`.gitattributes` enforces them on commit).

## Git
- One commit per milestone. End commit messages with the attribution line requested by the session.
