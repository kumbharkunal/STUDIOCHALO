# Client checklist · confirm before launch

Everything Studio Chalo needs to confirm, supply or decide. The demo uses only what the studio has published itself (Instagram, Threads, WhatsApp Business and its Google Business Profile, read on 18 November 2026). Anything else is hidden or carries a visible "placeholder" tag, so the demo never states something the studio has not said.

Most answers are a one-line change in `src/content/site.ts` (copy and facts) or `src/content/images.ts` (photos). Environment variables are set in Vercel (or `.env.local`).

## Decisions to raise first

- [ ] **The domain `studiochalo.in` looks unregistered.** It had no DNS records on 18 November 2026. Offer to register it in the studio's own name. At launch: add it in Vercel (Project, Settings, Domains), set `NEXT_PUBLIC_SITE_URL=https://studiochalo.in`, set `NEXT_PUBLIC_DEMO_MODE=false`, redeploy.
- [ ] **The rating line.** The site shows "5.0 · 5 reviews on Google" in the hero, as count-up stats in Behind the lens, and as a "Read all reviews on Google" link under Kind words. It was read from their Google Business Profile on 18 November 2026. Confirm they are happy to cite it, and update `trust` (rating, review count, `checkedOn`) when it changes. Two of the five reviews appear to come from a photographer they work with; if they would rather not cite a count that includes those, set `trust.show: false` and every rating disappears. Ratings never go into the structured data for search engines.
- [ ] **The studio address.** Google lists "Plot no 24, 25, Ambe Nagar, Pardi" and WhatsApp Business lists "1640, Ambe Nagar, Pardi" (both Nagpur 440035). The site shows only the part they agree on: "Ambe Nagar, Pardi, Nagpur 440035". Ask which street address is right and whether they want it on the site at all (`studio.address`, `studio.streetAddress`).
- [ ] **The reading of the name.** The manifesto presents the name as a reading, not as its origin story, with a paragraph about the word every Nagpur wedding runs on:
  - "chalo · Hindi for let’s go"
  - "studio · from the Latin studium, devotion"

  Ask whether they are happy with it, or would like to tell the real story behind the name (`manifesto` in `site.ts`).

## Contact details (shown now, from their own profiles)

- [ ] **Phone and WhatsApp: +91 70574 74532** (their Threads bio, WhatsApp Business and Google). Every WhatsApp button opens a chat with this number with the message already written; nothing is sent until the visitor presses send. Confirm it is the number they want enquiries on. `NEXT_PUBLIC_WHATSAPP_NUMBER` overrides it without a code change.
- [ ] **Email: studio.chalo1997@gmail.com** (WhatsApp Business), shown in the footer. Confirm.
- [ ] **Lead photographer: Nitesh Titarmare.** Behind the lens says "Led by Nitesh Titarmare." and the structured data names him as founder. Confirm the name and the role, or set `studio.ownerName` to `null`.
- [ ] **Social profiles.** Instagram and Threads `@studio_chalo.in`, and Facebook: Nitesh's personal profile, as no studio page was found. Ask whether they have, or want, a Facebook page for the studio instead (`socials` in `site.ts`).

## Facts and services

- [ ] **Experience figures** (`studio.yearsActive`, `weddingsShot`, `citiesCovered`). None are published, so none are shown. When they share real numbers, they count up in Behind the lens.
- [ ] **Service area.** Currently: "Based in Nagpur. Available across India for weddings and pre-weddings." (`studio.serviceArea`). Their profiles say "india" and their work includes a beach pre-wedding. Confirm.
- [ ] **Services.** The list follows their bio, reels and WhatsApp catalogue: Weddings, Cinematic wedding films, Pre-wedding shoots & films, Engagement & ring ceremony, Haldi, Mehendi & Sangeet, and Same-day edits (from their reels). Confirm each one and add anything missing, such as albums, drone or reels.
- [ ] **The album.** Step 04 of How we work promises "a carefully edited gallery, your film and an album made to be handed down". Confirm albums are part of their packages; otherwise adjust the wording.
- [ ] **No prices anywhere.** Their WhatsApp catalogue lists package prices; the site deliberately shows none, and every call to action is about checking a date. Keep it that way unless they decide otherwise.

## Photographs and reviews

- [ ] **Twelve real photographs**, with permission from the couples shown. The demo uses AI-generated stand-ins of Maharashtrian weddings. They are not Studio Chalo's work: replace them before launch and never present them as real weddings. Sizes, composition notes and how to swap them in are in `IMAGES.md`; `npm run images:check` shows progress. Their Instagram has strong candidates (haldi, mehendi, couple portraits, a bride and groom under fireworks).
- [ ] **Real camera details** for each photo (they shoot Sony Alpha) for the EXIF readouts, or approval to keep them as decorative.
- [ ] **Three real reviews**, with each reviewer's permission and the attribution they prefer (for example "Ananya & Rohan, Nagpur, 2026"). Their Google reviews praise the direction during shoots, films that feel cinematic and the clarity of the photos. Replace the placeholders in `testimonials` and set `placeholder: false`; the "placeholder" tag then disappears. Never quote a review without permission.
- [ ] **Re-check the hero contrast** after the hero photos change: `npx playwright test tests/contrast-over-image.spec.ts` (see `IMAGES.md`).

## Language

- [ ] **Hindi and Marathi terms.** The page uses चलो (the manifesto ornament), शुभमंगल सावधान (the booking eyebrow), and haldi, mehendi, sangeet, varat, pathavani, antarpat, nath, nauvari and Paithani. Ask the studio to confirm spelling and usage.
- [ ] **English spelling** is British (colour, centre), as is usual in India. Confirm they are happy with that.

## Brand and legal

- [ ] **The logo.** Their logo file was traced into vectors (`brand/studio-chalo-logo.svg`, rebuilt by `npm run logo:trace`), so it stays sharp at every size and can turn white over photographs and on the black bands. A faint grey stroke after the "o" of "chalo" in their file was left out as an artefact. Ask for the original vector file if they have one, and whether that stroke is intended.
- [ ] **Instagram mark.** Meta publishes the Instagram glyph as an image asset, not as colour values. The site fills the official glyph shape with the familiar gradient colours. For production, swap in the official asset from Meta's brand resources if exactness matters to them. The WhatsApp, Facebook and Threads marks use their published colours.
- [ ] **Display font licence.** Zodiak (Indian Type Foundry) is free for commercial web use under the ITF Free Font License, but it may not be redistributed or modified. The repository is public, so the font files are git-ignored and downloaded at build time; never commit them.
- [ ] **Developer credit** in the footer (`studio.developerCredit`, name and optional link), if they want one.
- [ ] **Privacy.** The booking form sends nothing to any server: it only opens WhatsApp with a message the visitor sends themselves. No cookies or trackers; Vercel Speed Insights (cookieless) runs only on Vercel.

## At launch

- [ ] Domain added in Vercel; `NEXT_PUBLIC_SITE_URL` set.
- [ ] `NEXT_PUBLIC_DEMO_MODE=false` (this allows search indexing).
- [ ] Contact details, address and the rating line confirmed.
- [ ] Real photos in; `npm run images:check` reports 12 real.
- [ ] Placeholder reviews replaced or removed.
- [ ] `npm run lint`, `npm run typecheck`, `npm run preflight` and `npx playwright test` all pass.
