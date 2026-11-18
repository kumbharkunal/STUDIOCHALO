import type { ProfessionalService, WithContext } from "schema-dts";
import { seo, socials, studio } from "@/content/site";
import { siteUrl } from "@/lib/env";

/**
 * Structured data for the studio. Only facts the studio has published itself: no rating, no
 * review count and no price range (ratings never go here, prices are never shown). Contact
 * details and the founder appear while they are set in site.ts.
 */
export function studioJsonLd(): WithContext<ProfessionalService> {
  const sameAs: string[] = [socials.instagram.url, socials.facebook.url, socials.threads.url];

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#studio`,
    name: studio.name,
    alternateName: studio.handle,
    url: `${siteUrl}/`,
    description: seo.description,
    image: `${siteUrl}/opengraph-image`,
    logo: `${siteUrl}/icon/512`,
    sameAs,
    address: {
      "@type": "PostalAddress",
      addressLocality: studio.city,
      addressRegion: studio.region,
      postalCode: studio.postalCode,
      addressCountry: "IN",
      ...(studio.streetAddress ? { streetAddress: studio.streetAddress } : {}),
    },
    areaServed: [
      { "@type": "City", name: studio.city },
      { "@type": "State", name: studio.region },
      { "@type": "Country", name: "India" },
    ],
    knowsAbout: ["Wedding photography", "Cinematic wedding films", "Pre-wedding photography", "Candid photography"],
    ...(studio.reviewsUrl ? { hasMap: studio.reviewsUrl } : {}),
    ...(studio.phone ? { telephone: studio.phone } : {}),
    ...(studio.email ? { email: studio.email } : {}),
    ...(studio.ownerName ? { founder: { "@type": "Person", name: studio.ownerName } } : {}),
  };
}

/** Serialised for a <script type="application/ld+json">, with "<" escaped against injection. */
export function jsonLdScript(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
