# IMAGES.md · the twelve photographs

The page uses twelve photo slots. For the pitch, every slot holds an AI-generated stand-in of a Maharashtrian wedding. They are **not Studio Chalo's work**: they must be replaced with the studio's own photographs (with the couples' permission) before launch, and never presented as real weddings. This guide explains how to replace them, what each photo needs to show, and how to check the result.

## How replacing works

1. Save the photo in `/images` with the **exact slot name**, as `.webp`, `.png`, `.jpg` or `.jpeg` (for example `story-haldi.jpg`).
2. Run `npm run dev` or `npm run build`. A slot-named PNG or JPG is converted to the slot's WebP at its exact size, cropped around the most interesting area (sharp's attention crop, quality 88). Your original file is kept, and is git-ignored.
3. Run `npm run images:check`. Every slot should report `real` with the right size.

Safety rules built into the scripts:

- A real photo is **never overwritten**. Generated placeholders carry a hidden marker (`studiochalo-placeholder` in their metadata), and the scripts only ever replace files that have that marker.
- Missing slots get a fresh placeholder, so the build never breaks.
- To change a photo that is already in place (the current stand-ins count as real), delete the old `.webp` yourself, then add the new file.

You can also export a WebP at the exact size yourself and drop it in; nothing is converted then.

## After replacing a photo

In `src/content/images.ts`, for that photo:

1. **`alt`**: describe what the photo actually shows, in one plain sentence (no "image of").
2. **`focal`**: where the subject is, in percent from the left (`x`) and the top (`y`). Crops on every screen keep this point in view.
3. **`exif`**: the real lens, aperture, shutter and ISO (the studio shoots Sony Alpha). The current values are decorative stand-ins.
4. **Hero photos only, `scrim`**: how much ink darkens the photo behind the headline. Run:

   ```bash
   npm run build && npx playwright test tests/contrast-over-image.spec.ts --project=chromium
   ```

   It measures the real pixels under every line of hero text at six widths and prints the contrast for each. Lower the scrim values while the test still passes (lighter is better for the photo); raise them if it fails.

If the photo shows a different moment, update its title in `images.ts` and the matching story or service in `src/content/site.ts`.

## The slots

| File | Size (px) | Ratio | Used in |
|---|---|---|---|
| `hero-desktop.webp` | 2560 × 1440 | 16:9 | Hero on landscape screens; link preview card; WebGL texture |
| `hero-mobile.webp` | 1080 × 1920 | 9:16 | Hero on portrait screens |
| `story-haldi.webp` | 1200 × 1800 | 2:3 | Stories 01; services (Haldi, Mehendi & Sangeet); Instagram tile 1 |
| `story-monsoon.webp` | 1800 × 1200 | 3:2 | Stories 02; services (Pre-wedding shoots & films); Instagram tile 3 |
| `story-antarpat.webp` | 1200 × 1800 | 2:3 | Stories 03; services (Weddings); Instagram tile 4 |
| `story-mehendi.webp` | 1200 × 1800 | 2:3 | Stories 04; manifesto print; Instagram tile 6 |
| `story-sangeet.webp` | 1800 × 1200 | 3:2 | Stories 05; services (Cinematic wedding films); Instagram tile 7 |
| `story-nath.webp` | 1200 × 1800 | 2:3 | Stories 06; services (Same-day edits); Instagram tile 8 |
| `behind-the-lens.webp` | 1200 × 1500 | 4:5 | Behind the lens (shown developing from grey to colour) |
| `detail-rings.webp` | 1200 × 1200 | 1:1 | How we work accent; services (Engagement & ring ceremony); Instagram tile 2 |
| `detail-paithani.webp` | 1200 × 1200 | 1:1 | Manifesto print; Instagram tile 5 |
| `cta-silk.webp` | 1920 × 1080 | 16:9 | Booking background, behind a strong paper wash |

Photos are shown as sharp prints: no rounded corners, no borders, no filters. Several slots appear in more than one place, often cropped to a square or 4:5, so keep the subject away from the edges. The site around them is black and white; the photographs are the only colour on the page, so true, warm colour matters.

## What each photo should show

Every note can be pasted into an image brief. General direction for all twelve: candid wedding photography in Nagpur and across Maharashtra, natural light, warm and true colour (no heavy grading, no fake film borders), real emotion over posing, and no text, watermarks or logos in the frame. The studio's Instagram already has good candidates for most slots.

**hero-desktop.webp** (the most important photo). A bride and groom sharing a quiet laugh at golden hour. Place the couple in the right third of the frame (about 70% from the left) with their faces at about 40% from the top. Keep the left half and the lower half calm and fairly dark (shadowed wall, garden or soft dusk), because the headline sits there in white type. Warm backlight, shallow depth of field.

**hero-mobile.webp**. The same moment, composed vertically. The couple in the middle (faces around 55 to 60% from the top). The top third and the bottom third should be calm and dark (sky in shade, foliage, ground), because the title sits at the top and the buttons at the bottom.

**story-haldi.webp**. Turmeric-stained hands and marigolds as relatives laugh during the haldi. Bright, joyful, a little messy. Faces in the upper half.

**story-monsoon.webp**. A pre-wedding walk through mist and rain, on old fort walls or green hills. The couple small in a big landscape; moody greens.

**story-antarpat.webp**. The antarpat: a silk cloth held up between the bride and groom by family members, moments before it is lowered. The cloth should read clearly; faces partly hidden by it is the point.

**story-mehendi.webp**. A bride's hands with fresh mehendi resting on a silk saree. Close and intimate; the pattern sharp.

**story-sangeet.webp**. Family members dancing under warm string lights at a sangeet night. Movement, some blur in the dancers is welcome; warm night tones.

**story-nath.webp**. A bride in a nauvari saree wearing a nath, sitting by window light before the ceremony. Quiet and still; her face in the upper third.

**behind-the-lens.webp**. A photographer kneeling with a camera, framing a candid moment at a wedding. Ideally a real behind-the-scenes photo of Nitesh or the Studio Chalo team; their Instagram "BTS" highlight is a good source.

**detail-rings.webp**. Two wedding rings resting on the folds of a silk saree. Shot from above or at a slight angle, centred.

**detail-paithani.webp**. A close-up of a Paithani border with its woven peacock motif. Rich colour, sharp weave, centred.

**cta-silk.webp**. Soft folds of silk fabric with gentle light, no people. It sits behind an 86% paper wash, so subtle texture and warm tones matter more than detail. Avoid strong dark areas.

## Checking AI-generated images

If stand-ins are generated again for another pitch round, check each one for:

- **Hands and fingers:** count them, especially in the mehendi, haldi and rings photos.
- **Jewellery:** the nath (nose ring) sits on the correct side and looks Maharashtrian; mangalsutra and bangles look plausible.
- **Clothing:** a nauvari is draped as nine yards (between the legs); a Paithani border has its characteristic motifs.
- **Ritual accuracy:** the antarpat is a cloth held between the couple by family, not a curtain or a veil; haldi is turmeric paste, not powder thrown.
- **Text and faces:** no garbled lettering anywhere; no faces of real, identifiable people.
- **Light and lens:** consistent with the EXIF in `images.ts` (an 85mm portrait at f/1.8 looks different from a 24mm landscape at f/4).

## Link previews

The link preview card (`/opengraph-image`, shown by WhatsApp, Instagram, Facebook and X) is built from `hero-desktop.webp` at build time: the photo under an ink wash, with the studio's script logo and the headline in white. While the hero is a generated placeholder, the card is typographic instead (the logo and headline in ink on paper). To preview the card with another photo, set `OG_IMAGE_SOURCE` (see `.env.example`).
