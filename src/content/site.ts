/**
 * All homepage copy and studio facts live here. Edit this file to change wording or fill in
 * details; components never hard-code copy.
 *
 * Voice: warm, short, plain. British and Indian English spelling. No em or en dashes.
 * Facts: nothing invented. Every value below was published by the studio itself (Instagram,
 * Threads, WhatsApp Business, Google Business Profile, checked on 18 November 2026). Unknowns are
 * null and their UI stays hidden until a value is set. See CLIENT_CHECKLIST.md.
 */
import type { PhotoKey } from "./images";

export type Placeholder<T> = T | null;

/**
 * A run of text. `italic` marks emotional words; `term` marks romanised Hindi or Marathi words,
 * which are set in italic with their language (`lang`, Marathi by default).
 */
export interface TextRun {
  text: string;
  italic?: boolean;
  term?: boolean;
  lang?: string;
}

/* Studio details. */

export const studio = {
  name: "Studio Chalo",
  handle: "studio_chalo.in",
  /** Looks unregistered (no DNS on 18 November 2026); see CLIENT_CHECKLIST.md. */
  domain: "studiochalo.in",
  /** Shown in Behind the lens as "Led by ..." and as the founder in structured data. */
  ownerName: "Nitesh Titarmare" as Placeholder<string>,
  /** International format for display and tel: links. */
  phone: "+91 70574 74532" as Placeholder<string>,
  /** Digits with country code. NEXT_PUBLIC_WHATSAPP_NUMBER takes priority when set. */
  whatsappNumber: "917057474532" as Placeholder<string>,
  email: "studio.chalo1997@gmail.com" as Placeholder<string>,
  /** Only the part every public source agrees on (the street number differs between them). */
  address: "Ambe Nagar, Pardi, Nagpur 440035" as Placeholder<string>,
  streetAddress: "Ambe Nagar, Pardi" as Placeholder<string>,
  city: "Nagpur",
  region: "Maharashtra",
  postalCode: "440035",
  yearsActive: null as Placeholder<number>,
  weddingsShot: null as Placeholder<number>,
  citiesCovered: null as Placeholder<number>,
  /** The studio's Google Business Profile (reviews and map). */
  reviewsUrl: "https://maps.google.com/?cid=10514533698376686386" as Placeholder<string>,
  developerCredit: null as Placeholder<{ name: string; url: Placeholder<string> }>,
  serviceArea: "Based in Nagpur. Available across India for weddings and pre-weddings.",
} as const;

/**
 * The rating shows only when `show` is true: in the hero readout, the Behind the lens stats and
 * the link under Kind words. Values were read from the public listing on the date below. Ratings
 * never go into structured data.
 */
export const trust = {
  show: true,
  platform: "Google",
  rating: 5.0,
  reviewCount: 5,
  checkedOn: "2026-11-18",
} as const;

export const socials = {
  instagram: {
    handle: "@studio_chalo.in",
    url: "https://www.instagram.com/studio_chalo.in/",
    directMessage: "https://ig.me/m/studio_chalo.in",
  },
  facebook: {
    url: "https://www.facebook.com/nitesh.titarmare.5/",
  },
  threads: {
    url: "https://www.threads.com/@studio_chalo.in",
  },
} as const;

/* Navigation */

export const nav = {
  links: [
    { id: "stories", label: "Stories" },
    { id: "services", label: "Services" },
    { id: "about", label: "About" },
    { id: "process", label: "Process" },
    { id: "reviews", label: "Reviews" },
  ],
  cta: "Book a date",
  menuOpen: "Menu",
  menuClose: "Close",
  menuTitle: "Menu",
  skipLink: "Skip to content",
  homeLabel: "Studio Chalo, back to the top",
} as const;

/* Hero. The title is the studio's own line from its Instagram bio. */

export const hero = {
  eyebrow: "Photography & films · Nagpur",
  title: [
    [{ text: "We make memories" }],
    [{ text: "more " }, { text: "beautiful", italic: true }, { text: "." }],
  ] as TextRun[][],
  sub: "Candid photographs and cinematic films for weddings that feel like you, from the first haldi laugh to the last goodbye.",
  primaryCta: "Check your date",
  secondaryCta: "See the stories",
  badge: "Book your date · Studio Chalo · ",
  badgeLabel: "Book your date on WhatsApp",
  scrollCue: "Scroll",
  print: { frame: "Fr. 001", title: "Golden hour" },
} as const;

/* Services marquee: the same services as the list below, so it is hidden from screen readers. */

export const marquee = [
  "Weddings",
  "Cinematic films",
  "Pre-wedding",
  "Engagement",
  "Haldi & mehendi",
  "Same-day edits",
] as const;

/* The name. "Chalo" is how every plan at a wedding starts; presented as a reading of the name. */

export const manifesto = {
  ornament: "चलो",
  ornamentLang: "hi",
  notes: [
    { term: "chalo", lang: "hi-Latn", meaning: "Hindi for let’s go" },
    { term: "studio", lang: undefined, meaning: "from the Latin studium, devotion" },
  ],
  paragraph: [
    { text: "Every wedding in Nagpur runs on one word. " },
    { text: "Chalo", term: true, lang: "hi-Latn" },
    { text: ", the " },
    { text: "haldi", term: true },
    { text: " is starting. " },
    { text: "Chalo", term: true, lang: "hi-Latn" },
    { text: ", the " },
    { text: "varat", term: true },
    { text: " is here. " },
    { text: "Chalo", term: true, lang: "hi-Latn" },
    { text: ", one last photo before the " },
    { text: "pathavani", term: true },
    {
      text: ". Studio Chalo is the friend with the camera who keeps saying it, so you can stay inside the day while we keep it for you.",
    },
  ] as TextRun[],
} as const;

/* Selected stories. Titles are moments, not couples: the photographs are stand-ins until the
   studio's own work replaces them (see IMAGES.md). */

export interface Story {
  id: string;
  title: string;
  caption: string;
  photo: PhotoKey;
}

export const stories = {
  title: "Selected stories",
  viewLabel: "View",
  openLabel: (title: string) => `Open ${title} full screen`,
  dotLabel: (index: number, total: number) => `Go to story ${index} of ${total}`,
  viewer: {
    close: "Close",
    previous: "Previous story",
    next: "Next story",
  },
  items: [
    {
      id: "haldi-ke-rang",
      title: "Haldi ke rang",
      caption: "Turmeric, marigolds and the whole family in on the joke.",
      photo: "storyHaldi",
    },
    {
      id: "monsoon-on-the-fort",
      title: "Monsoon on the fort",
      caption: "A pre-wedding walk through cloud, rain and old stone.",
      photo: "storyMonsoon",
    },
    {
      id: "antarpat",
      title: "Antarpat",
      caption: "The cloth held between two people, moments before it is lowered.",
      photo: "storyAntarpat",
    },
    {
      id: "mehendi-hands",
      title: "Mehendi hands",
      caption: "Her hands tell the story before anyone says a word.",
      photo: "storyMehendi",
    },
    {
      id: "sangeet-night",
      title: "Sangeet night",
      caption: "Lights, dhol and the whole family on the floor.",
      photo: "storySangeet",
    },
    {
      id: "the-nath",
      title: "The nath",
      caption: "The nath, the nauvari and a quiet minute before the day begins.",
      photo: "storyNath",
    },
  ] as Story[],
} as const;

/* What we capture: the studio's own offer (Instagram bio, reels and WhatsApp catalogue). */

export interface Service {
  id: string;
  title: string;
  description: string;
  photo: PhotoKey;
  /** Completes "We'd like to know more about ..." in the WhatsApp message. */
  enquiry: string;
  /** False until the client confirms they offer it. */
  confirmed: boolean;
}

export const services = {
  title: "What we capture",
  askLabel: (title: string) => `Ask about ${title.toLowerCase()}`,
  rowLabel: (title: string) => `${title}: ask on WhatsApp (opens in a new tab)`,
  items: [
    {
      id: "weddings",
      title: "Weddings",
      description: "The whole day, from the first ritual to the pathavani, told candidly.",
      photo: "storyAntarpat",
      enquiry: "your wedding coverage",
      confirmed: true,
    },
    {
      id: "films",
      title: "Cinematic wedding films",
      description: "Films that play like a movie and still sound like your family.",
      photo: "storySangeet",
      enquiry: "your cinematic wedding films",
      confirmed: true,
    },
    {
      id: "pre-wedding",
      title: "Pre-wedding shoots & films",
      description: "An unhurried shoot and a short film in a place that means something to you both.",
      photo: "storyMonsoon",
      enquiry: "a pre-wedding shoot and film",
      confirmed: true,
    },
    {
      id: "engagement",
      title: "Engagement & ring ceremony",
      description: "The first promise, the rings and both families around you.",
      photo: "detailRings",
      enquiry: "engagement and ring ceremony coverage",
      confirmed: true,
    },
    {
      id: "haldi-mehendi-sangeet",
      title: "Haldi, Mehendi & Sangeet",
      description: "Turmeric, henna, dancing and everyone who joins in.",
      photo: "storyHaldi",
      enquiry: "haldi, mehendi and sangeet coverage",
      confirmed: true,
    },
    {
      id: "same-day-edits",
      title: "Same-day edits",
      description: "A short film of your haldi or wedding, ready to share before the night is over.",
      photo: "storyNath",
      enquiry: "same-day edits",
      confirmed: true,
    },
  ] as Service[],
} as const;

/* Behind the lens */

export const about = {
  title: "Behind the lens",
  paragraphs: [
    "Studio Chalo is a wedding photography and films studio in Nagpur. We work quietly at the edges of the day, close enough to catch the glance and far enough to let it happen.",
    "Our photographs stay candid, our films play like cinema, and your people stay at the centre of both.",
  ],
  ownerLine: (name: string) => `Led by ${name}.`,
  statLabels: {
    rating: (platform: string) => `Rating on ${platform}`,
    reviews: (platform: string) => `Reviews on ${platform}`,
    yearsActive: "Years photographing weddings",
    weddingsShot: "Weddings photographed",
    citiesCovered: "Cities travelled for weddings",
  },
} as const;

/* How we work: a real sequence, so it is numbered. */

export const howWeWork = {
  title: "How we work",
  steps: [
    { title: "Say hello", text: "Tell us your date, city and the functions you’re planning, on WhatsApp or a call." },
    { title: "Plan the story", text: "We map your rituals, places and people so nothing important is missed." },
    { title: "Live your day", text: "We blend in. You stay present." },
    {
      title: "Your heirlooms",
      text: "A carefully edited gallery, your film and an album made to be handed down.",
    },
  ],
} as const;

/* Kind words. Placeholders in our own words until the studio shares real reviews with the
   reviewers' permission (see CLIENT_CHECKLIST.md). */

export interface Testimonial {
  quote: string;
  attribution: string;
  placeholder: boolean;
}

export const testimonials = {
  title: "Kind words",
  placeholderTag: "placeholder",
  readAll: (platform: string) => `Read all reviews on ${platform}`,
  previous: "Previous review",
  next: "Next review",
  status: (index: number, total: number) => `Review ${index} of ${total}`,
  dragLabel: "Drag",
  items: [
    {
      quote: "We barely noticed them on the day. Then the film arrived and it played like a movie.",
      attribution: "Bride & groom, Nagpur",
      placeholder: true,
    },
    {
      quote: "They knew exactly where we should stand, then let us forget the camera.",
      attribution: "Pre-wedding couple, Nagpur",
      placeholder: true,
    },
    {
      quote: "Every ritual is in the photographs, and it still feels like us.",
      attribution: "Bride & groom, Nagpur",
      placeholder: true,
    },
  ] as Testimonial[],
} as const;

/* Instagram wall: a contact sheet of static tiles that all open the profile. */

export const instagram = {
  title: "@studio_chalo.in",
  cta: "Follow on Instagram",
  tileLabel: (title: string) => `${title}, open @studio_chalo.in on Instagram (opens in a new tab)`,
  tiles: [
    { photo: "storyHaldi", rebate: "14" },
    { photo: "detailRings", rebate: "14A" },
    { photo: "storyMonsoon", rebate: "15" },
    { photo: "storyAntarpat", rebate: "15A" },
    { photo: "detailPaithani", rebate: "16" },
    { photo: "storyMehendi", rebate: "16A" },
    { photo: "storySangeet", rebate: "17" },
    { photo: "storyNath", rebate: "17A" },
  ] as { photo: PhotoKey; rebate: string }[],
} as const;

/* Booking */

export const bookingFunctions = [
  "Haldi",
  "Mehendi",
  "Sangeet",
  "Engagement",
  "Wedding",
  "Reception",
  "Pre-wedding",
] as const;
export type BookingFunction = (typeof bookingFunctions)[number];

export const booking = {
  eyebrow: "शुभमंगल सावधान",
  title: [{ text: "Chalo, let’s " }, { text: "keep", italic: true }, { text: " your story." }] as TextRun[],
  sub: "Tell us your date and city, and we’ll check availability.",
  fields: {
    names: {
      label: "Your names",
      placeholder: "e.g. Ananya & Rohan",
      error: "Enter your names",
    },
    date: {
      label: "Wedding date",
      placeholder: "Choose a date",
      helper: "An approximate date is fine.",
      error: "Choose a date (an approximate one is fine)",
      pastError: "Choose a date from today onwards",
      picker: {
        title: "Choose your wedding date",
        previousMonth: "Previous month",
        nextMonth: "Next month",
        previousYear: "Previous year",
        nextYear: "Next year",
        showMonths: "choose a month",
        showDays: "back to the days",
        close: "Close",
      },
    },
    city: {
      label: "City",
      placeholder: "e.g. Nagpur",
      error: "Enter your city",
    },
    functions: {
      legend: "Functions",
      helper: "Choose all that apply.",
    },
  },
  preview: {
    label: "Your message",
    /** Shown in the preview until the matching field is filled in. */
    tokens: { names: "your names", date: "your date", city: "your city" },
  },
  submit: "Check availability on WhatsApp",
  note: "Opens WhatsApp with this message. Nothing is sent until you press send.",
  opened: "WhatsApp is open in a new tab with your message, ready to send.",
  popupBlocked: "WhatsApp did not open in a new tab. Use this link instead:",
  openLink: "Open WhatsApp",
  instagramCta: "Message on Instagram",
  callCta: "Call",
} as const;

/* Footer */

export const footer = {
  srHeading: "Contact and links",
  navLabel: "Footer",
  navigationTitle: "Navigation",
  servicesTitle: "Services",
  connectTitle: "Connect",
  backToTop: "Back to top",
  rights: (year: number) => `© ${year} Studio Chalo. All rights reserved.`,
  credit: (name: string) => `Website by ${name}`,
} as const;

/* Global UI */

export const ui = {
  whatsappFab: "Chat on WhatsApp (opens in a new tab)",
  whatsappTooltip: "Chat on WhatsApp",
  newTab: "(opens in a new tab)",
  cursor: { view: "View", drag: "Drag", open: "Open" },
} as const;

/* SEO */

export const seo = {
  title: "Studio Chalo | Wedding Photography & Films in Nagpur",
  description:
    "Candid wedding photography and cinematic films from Nagpur. Weddings, pre-weddings, engagements, haldi, mehendi and sangeet, across Maharashtra and beyond.",
  ogAlt: "Studio Chalo. We make memories more beautiful.",
  ogEyebrow: "Photography & films · Nagpur",
} as const;

/* 404 */

export const notFoundCopy = {
  frame: "Fr. 404",
  title: "Lost frame.",
  body: "This frame never made it out of the darkroom. The rest of the roll is waiting on the homepage.",
  cta: "Back to the homepage",
} as const;
