import { StoriesClient } from "./StoriesClient";

/**
 * Selected stories: six moments, not invented couples. The roll runs on a black darkroom band
 * (data-surface="dark" inverts the tokens inside it), so the nav turns dark over it too.
 */
export function Stories() {
  return (
    <section
      id="stories"
      aria-labelledby="stories-title"
      data-surface="dark"
      data-nav-tone="dark"
      className="relative bg-paper text-ink"
    >
      <StoriesClient />
    </section>
  );
}
