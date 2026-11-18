import { LOGO_BOUNDS, LOGO_GEOMETRY, LOGO_RULES, type LogoPartName } from "@/components/brand/logo-geometry";
import { LOGO_PATHS } from "@/components/brand/logo-paths";

/**
 * Standalone SVG markup of the studio's logo, for server-side images that cannot use the page's
 * sprite (icons, the link preview card). Server only: it reads the full path data.
 */

function viewBoxSize(part: LogoPartName): { width: number; height: number } {
  const [, , width, height] = LOGO_GEOMETRY[part].viewBox.split(" ").map(Number);
  return { width, height };
}

/** One part as a path in its own viewBox units, wrapped in a positioned, scaled group. */
export function logoPartGroup(
  part: LogoPartName,
  { x, y, scale, fill, stroke = 0 }: { x: number; y: number; scale: number; fill: string; stroke?: number },
): string {
  const strokeAttributes = stroke > 0 ? ` stroke="${fill}" stroke-width="${stroke}" stroke-linejoin="round"` : "";
  return `<g transform="translate(${x} ${y}) scale(${scale})"><path fill-rule="evenodd" fill="${fill}"${strokeAttributes} d="${LOGO_PATHS[part]}"/></g>`;
}

/** The script wordmark ("Studio_chalo.in") at the given width. */
export function scriptSvg(width: number, fill: string): { svg: string; width: number; height: number } {
  const size = viewBoxSize("script");
  const scale = width / size.width;
  const height = Math.round(size.height * scale);
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">` +
    logoPartGroup("script", { x: 0, y: 0, scale, fill }) +
    "</svg>";
  return { svg, width, height };
}

/** The whole lockup at the given width. */
export function lockupSvg(width: number, fill: string): { svg: string; width: number; height: number } {
  const ratio = width / LOGO_BOUNDS.width;
  const height = Math.round(LOGO_BOUNDS.height * ratio);
  const parts = (Object.keys(LOGO_GEOMETRY) as LogoPartName[])
    .map((part) => {
      const { box } = LOGO_GEOMETRY[part];
      const size = viewBoxSize(part);
      return logoPartGroup(part, {
        x: (box.x - LOGO_BOUNDS.x) * ratio,
        y: (box.y - LOGO_BOUNDS.y) * ratio,
        scale: (box.width / size.width) * ratio,
        fill,
      });
    })
    .join("");
  const rules = [LOGO_RULES.left, LOGO_RULES.right]
    .map(
      (rule) =>
        `<rect x="${(rule.x - LOGO_BOUNDS.x) * ratio}" y="${(rule.y - LOGO_BOUNDS.y) * ratio}" width="${rule.width * ratio}" height="${Math.max(1, rule.height * ratio)}" fill="${fill}"/>`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${parts}${rules}</svg>`;
  return { svg, width, height };
}

/** The camera's aspect, for icon layout. */
export function cameraSize(): { width: number; height: number } {
  return viewBoxSize("camera");
}
