/**
 * Palette for places that cannot read CSS custom properties: metadata, the Open Graph image,
 * generated icons and the intro canvas. Components style through the Tailwind tokens in
 * globals.css instead. Keep both in sync.
 */
export const palette = {
  paper: "#F5F5F3",
  paperDeep: "#EAEAE7",
  ivory: "#FCFCFB",
  ink: "#111111",
  inkSoft: "#5A5A57",
  accent: "#111111",
  accentHover: "#2E2E2E",
  silver: "#9B9B98",
  error: "#B42318",
} as const;

/** "#9B9B98" + 0.5 becomes "rgba(155, 155, 152, 0.5)", for canvas drawing. */
export function withAlpha(hex: string, alpha: number): string {
  const value = hex.replace("#", "");
  const red = Number.parseInt(value.slice(0, 2), 16);
  const green = Number.parseInt(value.slice(2, 4), 16);
  const blue = Number.parseInt(value.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${Math.max(0, Math.min(1, alpha))})`;
}
