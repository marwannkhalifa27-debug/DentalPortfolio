import { initLayout } from "../main.js";
import { html, mount, qs } from "../utils/html.js";
import { contactCTA } from "../components/contactCTA.js";
import { errorState } from "../components/states.js";
import { sectionHeader } from "../components/sectionHeader.js";

const d = await initLayout("about");
const root = qs("#about-root");

if (!d) {
  mount(root, html`<div class="container">${errorState({ title: "Profile could not be loaded" })}</div>`);
  root.querySelector("[data-retry]")?.addEventListener("click", () => location.reload());
} else {
  mount(root, html`
    <section class="container page-header"><h1>About ${d.name}</h1></section>
    <section class="container" style="padding-bottom:var(--section-y)">
      <div class="about-hero">
        <div class="portrait"><img src="${d.profileImage}" alt="Portrait of ${d.name}" width="800" height="1000" decoding="async"></div>
        <div class="about-hero__text">
          <p class="about-hero__lead">${d.biography[0]}</p>
          ${d.biography.slice(1).map((p) => html`<p>${p}</p>`)}
          <dl class="facts">
            ${d.experience != null ? html`<div><dt>Experience</dt><dd>${d.experience} years</dd></div>` : ""}
            ${d.university ? html`<div><dt>Education</dt><dd>${[d.university, d.graduationYear].filter(Boolean).join(", ")}</dd></div>` : ""}
            ${d.interests ? html`<div style="grid-column:1/-1"><dt>Professional interests</dt><dd>${d.interests}</dd></div>` : ""}
          </dl>
          ${d.specialization.length ? html`<div><h2 style="font-size:1.3rem;margin-bottom:.8rem">Specializations</h2>
            <div class="chips">${d.specialization.map((s) => html`<span class="chip">${s}</span>`)}</div></div>` : ""}
        </div>
      </div>
    </section>
    <section class="section section--white"><div class="container two-col">
      ${d.timeline.length ? html`<div>${sectionHeader({ title: "Education and experience" })}
        <ol class="timeline">...</ol></div>` : ""}
      ${d.certifications.length ? html`<div>${sectionHeader({ title: "Certifications" })}
        <ul class="cert-list">...</ul></div>` : ""}
    </div></section>
    <div id="contact-cta"></div>`);
  mount(qs("#contact-cta"), contactCTA(d));
}
