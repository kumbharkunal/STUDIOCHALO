import type { CSSProperties } from "react";
import { cx } from "@/lib/utils";
import { LOGO_BOUNDS, LOGO_GEOMETRY, LOGO_RULES, type LogoBox, type LogoPartName } from "./logo-geometry";

/** Symbol ids in the <LogoDefs /> sprite. */
export function logoSymbolId(part: LogoPartName): string {
  return `sc-logo-${part}`;
}

/** A part's box as percentages of the lockup, so the parts can be HTML elements laid over it. */
function place(box: LogoBox): CSSProperties {
  return {
    left: `${((box.x - LOGO_BOUNDS.x) / LOGO_BOUNDS.width) * 100}%`,
    top: `${((box.y - LOGO_BOUNDS.y) / LOGO_BOUNDS.height) * 100}%`,
    width: `${(box.width / LOGO_BOUNDS.width) * 100}%`,
    height: `${(box.height / LOGO_BOUNDS.height) * 100}%`,
  };
}

function aspect(viewBox: string): string {
  const [, , width, height] = viewBox.split(" ");
  return `${width} / ${height}`;
}

function PartSvg({ part, className, style }: { part: LogoPartName; className?: string; style?: CSSProperties }) {
  const { viewBox } = LOGO_GEOMETRY[part];
  return (
    <svg viewBox={viewBox} className={className} style={style} aria-hidden="true" focusable="false">
      <use href={`#${logoSymbolId(part)}`} />
    </svg>
  );
}

interface LogoProps {
  /**
   * script: the "Studio_chalo.in" wordmark (nav, menu, footer). mark: the camera (small spaces).
   * lockup: the whole logo, every part a separate element for the intro to animate.
   */
  variant?: "script" | "mark" | "lockup";
  className?: string;
  /** Accessible name when the logo stands alone; omit when a label already names it. */
  title?: string;
}

/**
 * Studio Chalo's own logo, traced from their file by scripts/trace-logo.mjs and drawn with <use>
 * from the <LogoDefs /> sprite (so the path data ships once, however often the logo appears). It
 * takes the text colour: white over photographs, ink on paper, white again in the dark bands.
 * Safe in client components: it only reads the small geometry module.
 */
export function Logo({ variant = "script", className, title }: LogoProps) {
  const a11y = title ? { role: "img" as const, "aria-label": title } : { "aria-hidden": true as const };

  if (variant !== "lockup") {
    const part = variant === "mark" ? "camera" : "script";
    const { viewBox } = LOGO_GEOMETRY[part];
    return (
      <svg viewBox={viewBox} className={className} style={{ aspectRatio: aspect(viewBox) }} {...a11y} focusable="false">
        <use href={`#${logoSymbolId(part)}`} />
      </svg>
    );
  }

  return (
    <span
      className={cx("relative block", className)}
      style={{ aspectRatio: `${LOGO_BOUNDS.width} / ${LOGO_BOUNDS.height}` }}
      {...a11y}
    >
      {(["camera", "script", "tagline", "place"] as const).map((part) => (
        <span key={part} data-logo-part={part} className="absolute block" style={place(LOGO_GEOMETRY[part].box)}>
          <PartSvg part={part} className="block size-full" />
        </span>
      ))}
      <span data-logo-rule="left" className="absolute block min-h-px bg-current" style={place(LOGO_RULES.left)} />
      <span data-logo-part="heart" className="absolute block" style={place(LOGO_GEOMETRY.heart.box)}>
        <PartSvg part="heart" className="block size-full" />
      </span>
      <span data-logo-rule="right" className="absolute block min-h-px bg-current" style={place(LOGO_RULES.right)} />
    </span>
  );
}
