import { html, safeUrl } from "../utils/html.js";
import { icon } from "./icons.js";

const labels = { instagram: "Instagram", facebook: "Facebook" };

export function socialLinks(links = {}) {
  const entries = Object.entries(links).filter(([k, v]) => v && labels[k]);
  if (!entries.length) return "";
  return html`<div class="social">${entries.map(([k, url]) =>
    html`<a href="${safeUrl(url)}" target="_blank" rel="noopener noreferrer" aria-label="${labels[k]}">${icon(k)}</a>`)}</div>`;
}
