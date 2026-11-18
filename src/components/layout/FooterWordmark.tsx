"use client";

import { useRef } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { QUERIES } from "@/lib/media";

/**
 * The studio's script logo set across the full container width (the SVG scales exactly, so no
 * fitting is needed). It rises out of a mask when it scrolls into view. Decorative: aria-hidden.
 */
export function FooterWordmark() {
  const boxRef = useRef<HTMLDivElement>(null);
  const markRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const box = boxRef.current;
      const mark = markRef.current;
      if (!box || !mark) return;

      const mm = gsap.matchMedia();
      mm.add(QUERIES.motion, () => {
        gsap.fromTo(
          mark,
          { yPercent: 100, autoAlpha: 1 },
          {
            yPercent: 0,
            duration: 1.4,
            ease: "cinematic",
            scrollTrigger: { trigger: box, start: "top 92%", once: true },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: boxRef },
  );

  return (
    <div ref={boxRef} aria-hidden="true" className="footer-wordmark-box mt-14 overflow-hidden md:mt-20">
      <span ref={markRef} data-reveal className="footer-wordmark">
        <Logo variant="script" className="block h-auto w-full" />
      </span>
    </div>
  );
}
