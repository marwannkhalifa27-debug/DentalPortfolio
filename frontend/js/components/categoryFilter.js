import { html } from "../utils/html.js";

/** Renders pill buttons. Only categories that have at least one case are shown. */
export function categoryFilter({ categories, cases, active = "" }) {
  const counts = new Map();
  cases.forEach((c) => counts.set(c.category, (counts.get(c.category) ?? 0) + 1));
  const visible = categories.filter((c) => counts.get(c.slug));
  const btn = (slug, label, count) => html`<button type="button" class="filter__btn" data-category="${slug}" aria-pressed="${slug === active}">${label}<span class="filter__count">${count}</span></button>`;
  return html`<div class="filter" role="group" aria-label="Filter cases by treatment">
    ${btn("", "All", cases.length)}${visible.map((c) => btn(c.slug, c.name, counts.get(c.slug)))}
  </div>`;
}
