import { initLayout } from "../main.js";
import { getCases, getCategories } from "../services/api.js";
import { html, mount, qs } from "../utils/html.js";
import { beforeAfter, initBeforeAfter } from "../components/beforeAfter.js";
import { caseGrid, caseUrl } from "../components/caseCard.js";
import { dentistProfile } from "../components/dentistProfile.js";
import { contactCTA } from "../components/contactCTA.js";
import { sectionHeader } from "../components/sectionHeader.js";
import { loadingState, errorState } from "../components/states.js";
import { whatsappHref } from "../utils/format.js";

const dentist = await initLayout("home");

/* ----- Hero ----- */
if (dentist) {
  mount(qs("#hero-text"), html`
    <h1>${dentist.name}</h1>
    <p class="hero__title-line">${dentist.title}</p>
    <p class="hero__intro">${dentist.intro}</p>
    <div class="hero__actions">
      <a class="btn" href="cases.html">View my cases</a>
      <a class="btn btn--outline" href="contact.html">Contact me</a>
    </div>
    <div class="hero__byline">
      <img class="hero__avatar" src="${dentist.profileImage}" alt="" width="52" height="52">
      <div><strong>${dentist.experience} years of experience</strong>${dentist.university}, class of ${dentist.graduationYear}</div>
    </div>`);
}

// Hero visual: the first featured case as an interactive comparison.
try {
  const [hero] = await getCases({ featured: true, limit: 1 });
  if (hero) {
    mount(qs("#hero-visual"), html`<div class="hero__frame">${beforeAfter({ before: hero.beforeImage, after: hero.afterImage, title: hero.title })}</div>
      <div class="hero__caption"><span>${hero.title}. Drag to compare.</span><a class="text-link" href="${caseUrl(hero.id)}">See this case</a></div>`);
    initBeforeAfter(qs("#hero-visual .ba"), { hint: true });
  } else { qs("#hero-visual").hidden = true; }
} catch {
  mount(qs("#hero-visual"), html`<div class="hero__frame"><div class="portrait" style="aspect-ratio:4/3;border-radius:var(--r-lg)"><img src="${dentist?.profileImage ?? ""}" alt=""></div></div>`);
}

/* ----- About preview ----- */
if (dentist) mount(qs("#about-preview"), dentistProfile(dentist));

/* ----- Featured cases ----- */
const featured = qs("#featured-cases");
async function loadFeatured() {
  mount(featured, loadingState(3));
  try {
    const [cases, cats] = await Promise.all([getCases({ featured: true, limit: 3 }), getCategories()]);
    const map = new Map(cats.map((c) => [c.slug, c.name]));
    mount(featured, cases.length ? caseGrid(cases, map) : html`<p>New cases are added regularly. Check back soon.</p>`);
  } catch {
    mount(featured, errorState({ title: "Cases could not be loaded", message: "Check your connection and try again." }));
    featured.querySelector("[data-retry]")?.addEventListener("click", loadFeatured);
  }
}
loadFeatured();

/* ----- Highlights ----- */
if (dentist?.highlights?.length) {
  mount(qs("#highlights"), html`${sectionHeader({ title: "Why patients choose this clinic" })}
    <ul class="highlights">${dentist.highlights.map((h) => html`<li><h3>${h.title}</h3><p>${h.text}</p></li>`)}</ul>`);
}

/* ----- Contact CTA ----- */
if (dentist) mount(qs("#contact-cta"), contactCTA(dentist));
