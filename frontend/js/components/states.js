import { html } from "../utils/html.js";
import { icon } from "./icons.js";

export function loadingState(count = 3) {
  return html`<div class="case-grid" aria-busy="true" aria-label="Loading">
    ${Array.from({ length: count }, () => html`<div class="skeleton-card"><div class="skeleton"></div>
      <div class="skeleton-card__lines"><span class="skeleton"></span><span class="skeleton"></span><span class="skeleton"></span></div></div>`)}
  </div>`;
}

export function errorState({ title = "Something went wrong", message = "We could not load this content. Check your connection and try again.", retry = true } = {}) {
  return html`<div class="state state--error" role="alert">
    <span class="state__icon">${icon("alert", 26)}</span>
    <h2>${title}</h2><p>${message}</p>
    ${retry ? html`<button type="button" class="btn btn--outline" data-retry>Try again</button>` : ""}
  </div>`;
}

export function emptyState({ title = "Nothing here yet", message = "", action } = {}) {
  return html`<div class="state">
    <span class="state__icon">${icon("image", 26)}</span>
    <h2>${title}</h2>${message ? html`<p>${message}</p>` : ""}
    ${action ? html`<button type="button" class="btn btn--outline" data-action="${action.id}">${action.label}</button>` : ""}
  </div>`;
}
