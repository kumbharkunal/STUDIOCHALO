// `npm run logo:trace`: turns the studio's own logo (brand/studio-chalo-logo.png, black on white,
// 1080 x 1080) into vector paths in src/components/brand/logo-data.ts, so the mark stays crisp at
// any size and can take any colour (white over photographs, black on paper, animated by part).
//
// potrace is not a project dependency (it is only needed when the logo file changes):
//   npm i --no-save potrace@2.1.8 && npm run logo:trace
//
// How it works:
//   1. Find every connected shape of ink (8-connected, generous threshold so anti-aliased edges
//      join their shape) and sort the shapes into parts by the logo's rows of ink: camera and
//      script share the first band (the camera is the shapes above its upper part), then the
//      PHOTOGRAPHY & FILMS line, the rule with the heart, and NAGPUR.
//   2. Each part is upscaled 4x from the original greys (lanczos), with every other part masked
//      out, then cut at 50% grey so the traced edge sits where the drawn edge is, and traced.
//      The faint grey tail after the "o" of "chalo" (lighter than 50%) is left out on purpose.
//   3. The two rules beside the heart are measured, not traced: plain rectangles stay crisp and
//      can grow from the heart in the intro.
import { writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { ROOT } from "./image-slots.mjs";

const SOURCE = path.join(ROOT, "brand", "studio-chalo-logo.png");
/** Boxes and viewBoxes only: small enough for client components. */
const GEOMETRY_OUTPUT = path.join(ROOT, "src", "components", "brand", "logo-geometry.ts");
/** The path data (about 35 KB): imported only by server code (the sprite, icons, link card). */
const PATHS_OUTPUT = path.join(ROOT, "src", "components", "brand", "logo-paths.ts");
/** A standalone vector of the whole lockup, for the studio to reuse. */
const SVG_OUTPUT = path.join(ROOT, "brand", "studio-chalo-logo.svg");
const SCALE = 4;
const LABEL_THRESHOLD = 200;
const INK_THRESHOLD = 128;
const PAD = 2;

async function loadPotrace() {
  try {
    const potraceModule = await import("potrace");
    return potraceModule.default ?? potraceModule;
  } catch {
    console.error("[logo] potrace is not installed. Run: npm i --no-save potrace@2.1.8");
    process.exit(1);
  }
}

/** Connected shapes of ink: a label per pixel and a box per shape. */
function label(grey, width, height) {
  const labels = new Int32Array(width * height);
  const shapes = [];
  const stack = [];
  for (let start = 0; start < labels.length; start += 1) {
    if (labels[start] || grey[start] >= LABEL_THRESHOLD) continue;
    const id = shapes.length + 1;
    const shape = { id, x0: width, y0: height, x1: -1, y1: -1, pixels: 0 };
    labels[start] = id;
    stack.push(start);
    while (stack.length > 0) {
      const index = stack.pop();
      const x = index % width;
      const y = (index - x) / width;
      shape.pixels += 1;
      if (x < shape.x0) shape.x0 = x;
      if (x > shape.x1) shape.x1 = x;
      if (y < shape.y0) shape.y0 = y;
      if (y > shape.y1) shape.y1 = y;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          const next = ny * width + nx;
          if (!labels[next] && grey[next] < LABEL_THRESHOLD) {
            labels[next] = id;
            stack.push(next);
          }
        }
      }
    }
    shapes.push(shape);
  }
  return { labels, shapes };
}

/** Rows of ink separated by blank rows. */
function bands(shapes) {
  const sorted = [...shapes].sort((a, b) => a.y0 - b.y0);
  const result = [];
  for (const shape of sorted) {
    const last = result.at(-1);
    if (last && shape.y0 <= last.y1) {
      last.y1 = Math.max(last.y1, shape.y1);
      last.shapes.push(shape);
    } else {
      result.push({ y0: shape.y0, y1: shape.y1, shapes: [shape] });
    }
  }
  return result;
}

function boxOf(shapes) {
  return {
    x0: Math.min(...shapes.map((s) => s.x0)),
    y0: Math.min(...shapes.map((s) => s.y0)),
    x1: Math.max(...shapes.map((s) => s.x1)),
    y1: Math.max(...shapes.map((s) => s.y1)),
  };
}

/**
 * Rewrites potrace's absolute path data (M, L, C, Z) as relative commands on an integer grid
 * (a quarter of a source pixel, at most about 0.2 CSS px off even in the full-width footer), with
 * the shortest separators. The logo is inlined in the page, so this keeps its weight down: roughly
 * half the size of the raw output. Deltas come from rounded absolute points, so error never adds up.
 */
function compact(d) {
  const tokens = d.match(/[MLCZmlcz]|-?\d*\.?\d+(?:e-?\d+)?/g) ?? [];
  const out = [];
  let command = "";
  let last = "";
  let x = 0;
  let y = 0;
  let startX = 0;
  let startY = 0;
  const number = (value) => {
    const text = String(value);
    // A minus sign separates numbers by itself; otherwise a space is needed after a number.
    if (out.length > 0 && /\d$/.test(out[out.length - 1]) && !text.startsWith("-")) out.push(" ");
    out.push(text);
  };
  const emit = (letter) => {
    if (letter !== last || letter === "m") out.push(letter);
    last = letter;
  };
  for (let i = 0; i < tokens.length; ) {
    const token = tokens[i];
    if (/[A-Za-z]/.test(token)) {
      if (token !== token.toUpperCase()) throw new Error(`Unexpected relative command ${token} in potrace output.`);
      command = token;
      i += 1;
      if (command === "Z") {
        emit("z");
        x = startX;
        y = startY;
      }
      continue;
    }
    const take = () => Math.round(Number(tokens[i++]));
    if (command === "M") {
      const nx = take();
      const ny = take();
      emit("m");
      number(nx - x);
      number(ny - y);
      x = startX = nx;
      y = startY = ny;
      command = "L";
      last = "l";
    } else if (command === "L") {
      const nx = take();
      const ny = take();
      emit("l");
      number(nx - x);
      number(ny - y);
      x = nx;
      y = ny;
    } else if (command === "C") {
      const points = [take(), take(), take(), take(), take(), take()];
      emit("c");
      for (let p = 0; p < 6; p += 2) {
        number(points[p] - x);
        number(points[p + 1] - y);
      }
      x = points[4];
      y = points[5];
    } else {
      throw new Error(`Unexpected command ${command} in potrace output.`);
    }
  }
  return out.join("");
}

async function tracePart(potrace, name, shapes, labels, grey4, width) {
  const ids = new Set(shapes.map((shape) => shape.id));
  const box = boxOf(shapes);
  const x0 = Math.max(0, box.x0 - PAD);
  const y0 = Math.max(0, box.y0 - PAD);
  const x1 = Math.min(width - 1, box.x1 + PAD);
  const y1 = Math.min(width - 1, box.y1 + PAD);
  const w = x1 - x0 + 1;
  const h = y1 - y0 + 1;
  const W4 = width * SCALE;
  const out = Buffer.alloc(w * SCALE * h * SCALE, 255);

  for (let y = 0; y < h * SCALE; y += 1) {
    const sy = y0 + Math.floor(y / SCALE);
    for (let x = 0; x < w * SCALE; x += 1) {
      const sx = x0 + Math.floor(x / SCALE);
      // Keep this part's pixels and the blank pixels around them (its anti-aliased edge); white
      // out every pixel that belongs to another part.
      let keep = false;
      for (let dy = -1; dy <= 1 && !keep; dy += 1) {
        for (let dx = -1; dx <= 1 && !keep; dx += 1) {
          const ny = sy + dy;
          const nx = sx + dx;
          if (ny < 0 || nx < 0 || ny >= width || nx >= width) continue;
          if (ids.has(labels[ny * width + nx])) keep = true;
        }
      }
      const own = labels[sy * width + sx];
      if (own && !ids.has(own)) keep = false;
      const value = grey4[(y0 * SCALE + y) * W4 + (x0 * SCALE + x)];
      out[y * w * SCALE + x] = keep && value < INK_THRESHOLD ? 0 : 255;
    }
  }

  const png = await sharp(out, { raw: { width: w * SCALE, height: h * SCALE, channels: 1 } }).png().toBuffer();
  const svg = await new Promise((resolve, reject) => {
    potrace.trace(
      png,
      { threshold: 128, turdSize: 12, alphaMax: 1, optCurve: true, optTolerance: 0.3, turnPolicy: "minority" },
      (error, result) => (error ? reject(error) : resolve(result)),
    );
  });
  const paths = [...svg.matchAll(/\sd="([^"]+)"/g)].map((match) => match[1]);
  if (paths.length === 0) throw new Error(`No path traced for ${name}`);
  const d = compact(paths.join(" "));
  console.log(`[logo] ${name}: ${w} x ${h} px at (${x0}, ${y0}), ${d.length} chars of path data`);
  return { box: { x: x0, y: y0, width: w, height: h }, viewBox: `0 0 ${w * SCALE} ${h * SCALE}`, d };
}

/** A rule's rectangle from its ink coverage, so its thickness and position are sub-pixel exact. */
function measureRule(grey, width, x0, x1, y0, y1) {
  let ink = 0;
  let weightedY = 0;
  for (let y = y0; y <= y1; y += 1) {
    for (let x = x0; x <= x1; x += 1) {
      const coverage = 1 - grey[y * width + x] / 255;
      ink += coverage;
      weightedY += coverage * (y + 0.5);
    }
  }
  const length = x1 - x0 + 1;
  const thickness = ink / length;
  const centre = weightedY / ink;
  const round = (value) => Math.round(value * 100) / 100;
  return { x: x0, y: round(centre - thickness / 2), width: length, height: round(thickness) };
}

async function main() {
  const potrace = await loadPotrace();
  const image = sharp(SOURCE).greyscale();
  const { data: grey, info } = await image.clone().raw().toBuffer({ resolveWithObject: true });
  if (info.width !== info.height) throw new Error("Expected a square logo file.");
  const width = info.width;
  const { data: grey4 } = await sharp(SOURCE)
    .greyscale()
    .resize(width * SCALE, width * SCALE, { kernel: "lanczos3" })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { labels, shapes } = label(grey, width, width);
  const rows = bands(shapes);
  if (rows.length !== 4) throw new Error(`Expected 4 rows of ink, found ${rows.length}.`);
  const [mark, taglineRow, ruleRow, placeRow] = rows;

  // Camera: the shapes in the upper part of the first band; the script is the rest.
  const split = mark.y0 + (mark.y1 - mark.y0) * 0.45;
  const camera = mark.shapes.filter((shape) => shape.y1 < split);
  const script = mark.shapes.filter((shape) => shape.y1 >= split);

  // The rule row: thin wide shapes are the rules, the rest is the heart.
  const isRule = (shape) => shape.y1 - shape.y0 <= 6 && shape.x1 - shape.x0 > 60;
  const rules = ruleRow.shapes.filter(isRule).sort((a, b) => a.x0 - b.x0);
  const heart = ruleRow.shapes.filter((shape) => !isRule(shape));
  if (rules.length !== 2 || heart.length === 0) throw new Error("Could not find the two rules and the heart.");

  const parts = {
    camera: await tracePart(potrace, "camera", camera, labels, grey4, width),
    script: await tracePart(potrace, "script", script, labels, grey4, width),
    tagline: await tracePart(potrace, "tagline", taglineRow.shapes, labels, grey4, width),
    heart: await tracePart(potrace, "heart", heart, labels, grey4, width),
    place: await tracePart(potrace, "place", placeRow.shapes, labels, grey4, width),
  };
  const ruleBoxes = rules.map((rule) => measureRule(grey, width, rule.x0, rule.x1, Math.max(0, rule.y0 - 2), rule.y1 + 2));

  const all = boxOf(shapes);
  const margin = 4;
  const bounds = {
    x: all.x0 - margin,
    y: all.y0 - margin,
    width: all.x1 - all.x0 + 1 + margin * 2,
    height: all.y1 - all.y0 + 1 + margin * 2,
  };

  const json = (value) => JSON.stringify(value);
  const header = [
    "// Generated by scripts/trace-logo.mjs from brand/studio-chalo-logo.png. Do not edit by hand:",
    "// change the logo file and run `npm run logo:trace` (see the script for setup).",
  ];

  const geometry = [
    ...header,
    "//",
    "// Units: boxes and rules are in pixels of the 1080 x 1080 source. Each part's paths (in",
    "// logo-paths.ts, server only) are drawn in that part's own viewBox, four times its box.",
    "",
    "export interface LogoBox {",
    "  x: number;",
    "  y: number;",
    "  width: number;",
    "  height: number;",
    "}",
    "",
    'export type LogoPartName = "camera" | "script" | "tagline" | "heart" | "place";',
    "",
    "/** The whole lockup, in source pixels (its viewBox). */",
    `export const LOGO_BOUNDS: LogoBox = ${json(bounds)};`,
    "",
    "/** The two rules beside the heart. */",
    `export const LOGO_RULES: { left: LogoBox; right: LogoBox } = ${json({ left: ruleBoxes[0], right: ruleBoxes[1] })};`,
    "",
    "/** Where each part sits in the lockup (box) and the coordinate space of its paths (viewBox). */",
    "export const LOGO_GEOMETRY: Record<LogoPartName, { box: LogoBox; viewBox: string }> = {",
    ...Object.entries(parts).map(
      ([name, part]) => `  ${name}: { box: ${json(part.box)}, viewBox: ${json(part.viewBox)} },`,
    ),
    "};",
    "",
  ];

  const paths = [
    ...header,
    "//",
    "// Server only (about 35 KB): the sprite in the root layout, the icons and the link card read",
    "// it; client components draw the logo with <use> and never import this file.",
    "// Paths use the even-odd fill rule.",
    "",
    'import type { LogoPartName } from "./logo-geometry";',
    "",
    "export const LOGO_PATHS: Record<LogoPartName, string> = {",
    ...Object.entries(parts).map(([name, part]) => `  ${name}: ${json(part.d)},`),
    "};",
    "",
  ];

  const nested = Object.values(parts)
    .map(
      (part) =>
        `  <svg x="${part.box.x}" y="${part.box.y}" width="${part.box.width}" height="${part.box.height}" viewBox="${part.viewBox}"><path fill-rule="evenodd" d="${part.d}"/></svg>`,
    )
    .join("\n");
  const rulesSvg = ruleBoxes
    .map((rule) => `  <rect x="${rule.x}" y="${rule.y}" width="${rule.width}" height="${rule.height}"/>`)
    .join("\n");
  const standalone = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}" width="${bounds.width}" height="${bounds.height}" fill="#111111">`,
    "  <title>Studio Chalo</title>",
    nested,
    rulesSvg,
    "</svg>",
    "",
  ].join("\n");

  await writeFile(GEOMETRY_OUTPUT, geometry.join("\n"));
  await writeFile(PATHS_OUTPUT, paths.join("\n"));
  await writeFile(SVG_OUTPUT, standalone);
  for (const file of [GEOMETRY_OUTPUT, PATHS_OUTPUT, SVG_OUTPUT]) console.log(`[logo] wrote ${path.relative(ROOT, file)}`);
}

main().catch((error) => {
  console.error("[logo] failed:", error);
  process.exit(1);
});
