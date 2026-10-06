import { html } from "../utils/html.js";
import { formatDate } from "../utils/format.js";

export const caseUrl = (id) => `case.html?id=${encodeURIComponent(id)}`;

/** `categories` is a Map of slug -> name. */
export function caseCard(c, categories = new Map()) {
  return html`<article class="case-card">
    <div class="pair">
      <div class="pair__item"><img src="${c.beforeImage}" alt="Before: ${c.title}" loading="lazy" decoding="async" width="400" height="400"><span>Before</span></div>
      <div class="pair__item"><img src="${c.afterImage}" alt="After: ${c.title}" loading="lazy" decoding="async" width="400" height="400"><span>After</span></div>
    </div>
    <div class="case-card__body">
      <div class="case-card__meta">
        <span class="tag">${categories.get(c.category) ?? "Other"}</span>
        <time class="case-card__date" datetime="${c.createdAt}">${formatDate(c.createdAt)}</time>
      </div>
      <h3 class="case-card__title">${c.title}</h3>
      <p class="case-card__text">${c.description}</p>
      <div class="case-card__action"><a class="btn btn--outline btn--small" href="${caseUrl(c.id)}">View case<span class="visually-hidden">: ${c.title}</span></a></div>
    </div>
  </article>`;
}

export function caseGrid(cases, categories) {
  return html`<div class="case-grid">${cases.map((c) => caseCard(c, categories))}</div>`;
}
