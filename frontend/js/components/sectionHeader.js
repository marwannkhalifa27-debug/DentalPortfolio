import { html, raw } from "../utils/html.js";

/** Heading block. Pass `action` (an html fragment) to place a link on the right. */
export function sectionHeader({ title, lead = "", action = "", level = 2 } = {}) {
  const heading = raw(`<h${level}>${String(html`${title}`)}</h${level}>`);
  return html`<div class="section-header ${action ? "section-header--split" : ""}">
    <div class="section-header__text">${heading}${lead ? html`<p>${lead}</p>` : ""}</div>
    ${action}
  </div>`;
}
