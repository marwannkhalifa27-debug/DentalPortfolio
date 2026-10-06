import { initLayout, loadInto } from "../main.js";
import { getCaseById, getCases, getCategories, ApiError } from "../services/api.js";
import { html, qs, mount } from "../utils/html.js";
import { beforeAfter, initBeforeAfter } from "../components/beforeAfter.js";
import { imageGallery, initImageGallery } from "../components/imageGallery.js";
import { caseGrid } from "../components/caseCard.js";
import { icon } from "../components/icons.js";
import { errorState } from "../components/states.js";
import { formatDate } from "../utils/format.js";
import { sectionHeader } from "../components/sectionHeader.js";

await initLayout("cases");

const root = qs("#case-root");
const id = new URLSearchParams(location.search).get("id");

const paragraphs = (text) => String(text).split(/\n\s*\n/).filter(Boolean).map((p) => html`<p>${p}</p>`);
const infoLabels = { procedure: "Treatment", duration: "Duration", visits: "Visits" };

loadInto(root, {
  loading: html`<div class="container" style="padding-block:3rem" aria-busy="true"><div class="skeleton" style="height:2.5rem;width:60%;margin-bottom:1.5rem"></div><div class="skeleton" style="aspect-ratio:4/3;max-width:980px"></div></div>`,
  load: async () => {
    if (!id) throw new ApiError("Missing case id", 404);
    const [c, cats] = await Promise.all([getCaseById(id), getCategories()]);
    return { c, cats };
  },
  error: (err) => html`<div class="container">${err.status === 404
    ? errorState({ title: "Case not found", message: "This case may have been removed. Browse the other cases instead.", retry: false })
    : errorState({ title: "This case could not be loaded" })}
    <p style="text-align:center"><a class="text-link" href="cases.html">${icon("back", 18)}Back to cases</a></p></div>`,
  render: ({ c, cats }) => {
    const names = new Map(cats.map((x) => [x.slug, x.name]));
    document.title = `${c.title} | Dr. Sinan`;
    queueMicrotask(async () => {
      initBeforeAfter(qs("#case-root .ba"));
      initImageGallery(root, c.additionalImages);
      try {
        const more = await getCases({ excludeId: c.id, limit: 3 });
        if (more.length) mount(qs("#more-cases"), html`<div class="container">${sectionHeader({ title: "More cases", action: html`<a class="text-link" href="cases.html">View all cases</a>` })}${caseGrid(more, names)}</div>`);
        else qs("#more-cases").hidden = true;
      } catch { qs("#more-cases").hidden = true; }
    });
    const info = Object.entries(infoLabels).filter(([k]) => c.treatment?.[k]);
    return html`
      <div class="container case-head">
        <a class="text-link" href="cases.html">${icon("back", 18)}Back to cases</a>
        <div class="case-head__meta"><span class="tag">${names.get(c.category) ?? "Other"}</span><time datetime="${c.createdAt}">${formatDate(c.createdAt)}</time></div>
        <h1>${c.title}</h1>
      </div>
      <div class="container case-compare">
        ${beforeAfter({ before: c.beforeImage, after: c.afterImage, title: c.title })}
        <p class="case-compare__hint">Drag the handle, or use the left and right arrow keys, to compare.</p>
      </div>
      <section class="section--tight container case-body">
        <div class="case-body__main">
          <div><h2>About this case</h2>${paragraphs(c.details)}</div>
          ${c.results ? html`<div class="case-result"><h2>Result</h2><p>${c.results}</p></div>` : ""}
          ${c.additionalImages.length ? html`<div><h2>More photos</h2>${imageGallery(c.additionalImages, c.title)}</div>` : ""}
        </div>
        ${info.length ? html`<aside class="case-info" aria-label="Treatment information"><h2>Treatment details</h2>
          <dl>${info.map(([k, label]) => html`<div><dt>${label}</dt><dd>${c.treatment[k]}</dd></div>`)}</dl>
          <a class="btn" style="margin-top:1.25rem;width:100%" href="contact.html#appointment">Ask about this treatment</a></aside>` : ""}
      </section>`;
  },
});
