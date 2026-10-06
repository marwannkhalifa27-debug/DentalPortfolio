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
            <div><dt>Experience</dt><dd>${d.experience} years</dd></div>
            <div><dt>Education</dt><dd>${d.university}, ${d.graduationYear}</dd></div>
            <div style="grid-column:1/-1"><dt>Professional interests</dt><dd>${d.interests}</dd></div>
          </dl>
          <div><h2 style="font-size:1.3rem;margin-bottom:.8rem">Specializations</h2>
            <div class="chips">${d.specialization.map((s) => html`<span class="chip">${s}</span>`)}</div></div>
        </div>
      </div>
    </section>
    <section class="section section--white"><div class="container two-col">
      <div>${sectionHeader({ title: "Education and experience" })}
        <ol class="timeline">${d.timeline.map((t) => html`<li class="timeline__item">
          <div class="timeline__period">${t.period}</div><h3 class="timeline__title">${t.title}</h3>
          <div class="timeline__place">${t.place}</div><p class="timeline__text">${t.text}</p></li>`)}</ol></div>
      <div>${sectionHeader({ title: "Certifications" })}
        <ul class="cert-list">${d.certifications.map((c) => html`<li><strong>${c.title}</strong><span>${c.issuer}, ${c.year}</span></li>`)}</ul></div>
    </div></section>
    <div id="contact-cta"></div>`);
  mount(qs("#contact-cta"), contactCTA(d));
}
