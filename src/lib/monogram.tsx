import sharp from "sharp";
import { cameraSize, logoPartGroup } from "@/lib/logo-svg";
import { palette } from "@/lib/tokens";

/**
 * The app icon: the camera from the studio's own logo, ivory on an ink square. `rounded` gives the
 * browser-tab favicon its own corners and a larger camera; touch and manifest icons are full-bleed
 * squares (platforms apply their own mask), with the camera inside the maskable safe zone. At
 * favicon sizes the thin outline gets a matching stroke so it still reads at 32px.
 */
export async function monogram(dimension: number, { rounded }: { rounded: boolean }): Promise<Response> {
  const camera = cameraSize();
  const width = dimension * (rounded ? 0.76 : 0.54);
  const scale = width / camera.width;
  const height = camera.height * scale;
  const x = (dimension - width) / 2;
  const y = (dimension - height) / 2 + dimension * 0.015;
  // About 0.9px of extra weight at 32px; none at the larger sizes, where the outline reads as drawn.
  const stroke = dimension <= 48 ? 0.9 / scale : 0;
  const radius = rounded ? Math.round(dimension * 0.22) : 0;

  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}">` +
    `<rect width="${dimension}" height="${dimension}" rx="${radius}" fill="${palette.ink}"/>` +
    logoPartGroup("camera", { x, y, scale, fill: palette.ivory, stroke }) +
    "</svg>";

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
