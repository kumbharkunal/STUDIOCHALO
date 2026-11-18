import { LOGO_GEOMETRY, type LogoPartName } from "./logo-geometry";
import { LOGO_PATHS } from "./logo-paths";
import { logoSymbolId } from "./Logo";

const PARTS = Object.keys(LOGO_GEOMETRY) as LogoPartName[];

/**
 * The traced logo as an SVG sprite, rendered once in the root layout (server only, so the path
 * data never reaches a client bundle). <Logo /> draws from it with <use>; every symbol fills with
 * currentColor, so each placement takes its own text colour.
 */
export function LogoDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" focusable="false" style={{ position: "absolute" }}>
      <defs>
        {PARTS.map((part) => (
          <symbol key={part} id={logoSymbolId(part)} viewBox={LOGO_GEOMETRY[part].viewBox}>
            <path d={LOGO_PATHS[part]} fill="currentColor" fillRule="evenodd" />
          </symbol>
        ))}
      </defs>
    </svg>
  );
}
