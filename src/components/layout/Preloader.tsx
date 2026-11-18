"use client";

import { useRef, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { gsap, useGSAP } from "@/lib/gsap";
import { QUERIES } from "@/lib/media";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { palette, withAlpha } from "@/lib/tokens";
import { uiStore } from "@/lib/ui-store";

const STORAGE_KEY = "chalo:intro";
const READY_CAP_MS = 1000;
/** Long enough for the script to be written in before the iris opens. */
const MIN_LOGO_MS = 950;
const FAILSAFE_MS = 6000;

/** Fired when the iris is 40% open, so the hero load timeline can overlap it. */
export const INTRO_OPEN_EVENT = "chalo:intro-open";

interface Iris {
  radius: number;
  rotation: number;
  edges: number;
}

/**
 * First-visit intro, built from the studio's own logo: the camera rises, "Studio_chalo.in" is
 * written in from left to right, the small caps settle, and the two rules beside the heart fill
 * with real progress (fonts and the hero photo decoding, capped at 1s). The heart beats once, the
 * logo lifts away and an aperture iris opens onto the hero, which is server-rendered and already
 * painted underneath. Click, wheel, touch or a key skips it. Repeat visits in the same session
 * never render it (the head script hides it before paint).
 */
export function Preloader() {
  const [mounted, setMounted] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const root = rootRef.current;
      if (!root || !contextSafe) return;

      const html = document.documentElement;
      if (html.classList.contains("intro-seen")) {
        uiStore.set({ preloaderDone: true });
        if (!document.querySelector("[data-hero]")) uiStore.set({ navReady: true });
        setMounted(false);
        return;
      }

      const logo = root.querySelector<HTMLElement>("[data-preloader-logo]");
      const part = (name: string) => root.querySelector<HTMLElement>(`[data-logo-part="${name}"]`);
      const camera = part("camera");
      const script = part("script");
      const smallCaps = [part("tagline"), part("place")].filter((element) => element !== null);
      const heart = part("heart");
      const ruleLeft = root.querySelector<HTMLElement>('[data-logo-rule="left"]');
      const ruleRight = root.querySelector<HTMLElement>('[data-logo-rule="right"]');
      const canvas = root.querySelector<HTMLCanvasElement>("canvas");
      const context2d = canvas?.getContext("2d") ?? null;
      if (!logo || !camera || !script || !heart || !ruleLeft || !ruleRight || !canvas || !context2d) return;

      const reduce = window.matchMedia(QUERIES.reduce).matches;
      let finished = false;
      let opening = false;
      let timeline: gsap.core.Timeline | null = null;

      lockScroll();

      const finish = () => {
        if (finished) return;
        finished = true;
        try {
          window.sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // Storage can be unavailable (private mode); the intro then simply plays again.
        }
        uiStore.set({ preloaderDone: true });
        // The hero releases the nav from its own timeline; without a hero, release it here.
        if (!document.querySelector("[data-hero]")) uiStore.set({ navReady: true });
        unlockScroll();
        setMounted(false);
      };

      // Canvas iris: one layer, a hexagonal hole cut with destination-out, silver blade edges.
      const iris: Iris = { radius: 0, rotation: 0, edges: 0 };
      let width = 0;
      let height = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        context2d.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      const draw = () => {
        context2d.globalCompositeOperation = "source-over";
        context2d.clearRect(0, 0, width, height);
        context2d.fillStyle = palette.paper;
        context2d.fillRect(0, 0, width, height);
        if (iris.radius <= 0) return;
        const cx = width / 2;
        const cy = height / 2;
        const points = Array.from({ length: 6 }, (_, index) => {
          const angle = ((index * 60 + iris.rotation) * Math.PI) / 180;
          return [cx + iris.radius * Math.cos(angle), cy + iris.radius * Math.sin(angle)] as const;
        });
        context2d.globalCompositeOperation = "destination-out";
        context2d.beginPath();
        points.forEach(([x, y], index) => (index === 0 ? context2d.moveTo(x, y) : context2d.lineTo(x, y)));
        context2d.closePath();
        context2d.fill();
        context2d.globalCompositeOperation = "source-over";
        if (iris.edges > 0) {
          context2d.strokeStyle = withAlpha(palette.silver, 0.7 * iris.edges);
          context2d.lineWidth = 1;
          context2d.beginPath();
          points.forEach(([x1, y1], index) => {
            const [x2, y2] = points[(index + 1) % 6];
            context2d.moveTo(x1, y1);
            context2d.lineTo(x1 + (x2 - x1) * 1.6, y1 + (y2 - y1) * 1.6);
          });
          context2d.stroke();
        }
      };

      const open = contextSafe(() => {
        if (opening) return;
        opening = true;
        if (reduce) {
          uiStore.set({ preloaderDone: true });
          window.dispatchEvent(new Event(INTRO_OPEN_EVENT));
          gsap.to(root, { autoAlpha: 0, duration: 0.2, ease: "power1.out", onComplete: finish });
          return;
        }
        resize();
        const maxRadius = (Math.hypot(width, height) / 2 / Math.cos(Math.PI / 6)) * 1.06;
        timeline = gsap.timeline({ onComplete: finish });
        timeline
          .to([ruleLeft, ruleRight], { scaleX: 1, duration: 0.2, ease: "power2.out" })
          .to(heart, { scale: 1.18, duration: 0.14, ease: "power2.out" }, "-=0.04")
          .to(heart, { scale: 1, duration: 0.3, ease: "back.out(3)" })
          .to(logo, { yPercent: -14, autoAlpha: 0, duration: 0.38, ease: "power2.in" }, "+=0.05")
          .addLabel("iris", "+=0.02")
          .add(() => {
            draw();
            gsap.set(canvas, { autoAlpha: 1 });
            root.style.backgroundColor = "transparent";
          }, "iris")
          .to(iris, { edges: 1, duration: 0.2, ease: "power1.out", onUpdate: draw }, "iris")
          .to(iris, { radius: maxRadius, rotation: 60, duration: 0.85, ease: "cinematic", onUpdate: draw }, "iris")
          .to(iris, { edges: 0, duration: 0.45, ease: "power1.in", onUpdate: draw }, "iris+=0.45")
          .add(() => {
            uiStore.set({ preloaderDone: true });
            window.dispatchEvent(new Event(INTRO_OPEN_EVENT));
          }, "iris+=0.34");
      });

      const skip = contextSafe(() => {
        if (finished) return;
        if (!opening) open();
        timeline?.timeScale(3);
      });

      // Real progress: half for fonts, half for the hero photo decoding. The two rules grow out
      // from the heart as it arrives.
      let progress = 0;
      const growLeft = gsap.quickTo(ruleLeft, "scaleX", { duration: 0.3, ease: "power2.out" });
      const growRight = gsap.quickTo(ruleRight, "scaleX", { duration: 0.3, ease: "power2.out" });
      const step = () => {
        progress = Math.min(1, progress + 0.5);
        if (reduce || opening) return;
        growLeft(progress);
        growRight(progress);
      };
      const fontsReady = (document.fonts?.ready ?? Promise.resolve()).then(step);
      const heroImage = document.querySelector<HTMLImageElement>("[data-hero-image] img");
      const imageReady = (heroImage ? heroImage.decode().catch(() => undefined) : Promise.resolve()).then(step);
      const capped = new Promise((resolve) => window.setTimeout(resolve, READY_CAP_MS));
      const logoDrawn = new Promise((resolve) => window.setTimeout(resolve, reduce ? 0 : MIN_LOGO_MS));
      void Promise.all([Promise.race([Promise.all([fontsReady, imageReady]), capped]), logoDrawn]).then(() => open());

      if (!reduce) {
        gsap.set(ruleLeft, { scaleX: 0, transformOrigin: "100% 50%" });
        gsap.set(ruleRight, { scaleX: 0, transformOrigin: "0% 50%" });
        gsap.set(heart, { scale: 0, transformOrigin: "50% 55%" });
        gsap.set(logo, { autoAlpha: 1 });
        gsap
          .timeline()
          .from(camera, { yPercent: 45, autoAlpha: 0, duration: 0.7, ease: "expo.out" })
          .fromTo(
            script,
            { clipPath: "inset(-10% 100% -10% 0%)" },
            { clipPath: "inset(-10% 0% -10% 0%)", duration: 0.9, ease: "cinematic" },
            0.12,
          )
          .from(smallCaps, { yPercent: 70, autoAlpha: 0, duration: 0.6, ease: "expo.out", stagger: 0.08 }, 0.4);
      } else {
        gsap.set(logo, { autoAlpha: 1 });
      }

      const events: (keyof WindowEventMap)[] = ["wheel", "touchstart", "keydown", "pointerdown"];
      for (const type of events) window.addEventListener(type, skip, { passive: true });
      const failsafe = window.setTimeout(finish, FAILSAFE_MS);
      window.addEventListener("resize", resize);

      return () => {
        for (const type of events) window.removeEventListener(type, skip);
        window.removeEventListener("resize", resize);
        window.clearTimeout(failsafe);
        if (!finished) {
          finished = true;
          unlockScroll();
        }
      };
    },
    { scope: rootRef },
  );

  if (!mounted) return null;

  return (
    <div ref={rootRef} className="preloader" aria-hidden="true">
      <canvas className="preloader-canvas" />
      <div className="preloader-center">
        <div data-preloader-logo className="preloader-logo">
          <Logo variant="lockup" />
        </div>
      </div>
    </div>
  );
}
