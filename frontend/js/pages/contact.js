import { initLayout } from "../main.js";
import { html, mount, qs, safeUrl } from "../utils/html.js";
import { icon } from "../components/icons.js";
import { socialLinks } from "../components/socialLinks.js";
import { contactForm, initContactForm } from "../components/contactForm.js";
import { errorState } from "../components/states.js";
import { phoneHref, whatsappHref } from "../utils/format.js";

const d = await initLayout("contact");
const root = qs("#contact-root");

if (!d) {
  mount(root, html`<div class="container">${errorState({ title: "Contact details could not be loaded", message: "Reload the page, or try again in a moment." })}</div>`);
  root.querySelector("[data-retry]")?.addEventListener("click", () => location.reload());
} else {
  const row = (ic, label, content) => html`<li><span class="contact-list__icon">${icon(ic, 22)}</span><div><div class="contact-list__label">${label}</div>${content}</div></li>`;
  mount(root, html`
    <section class="container page-header"><h1>Contact</h1><p>Call, send a message on WhatsApp, or fill in the form and we will get back to you.</p></section>
    <section class="container" style="padding-bottom:var(--section-y)">
      <div class="contact-grid">
        <div>
          <ul class="contact-list">
            ${row("phone", "Phone", html`<a href="${phoneHref(d.phone)}">${d.phone}</a>`)}
            ${row("chat", "WhatsApp", html`<a href="${whatsappHref(d.whatsapp, "Hello, I would like to ask about a treatment.")}" target="_blank" rel="noopener noreferrer">Send a message</a>`)}
            ${row("mail", "Email", html`<a href="mailto:${d.email}">${d.email}</a>`)}
            ${row("pin", "Clinic address", html`<div class="contact-list__value">${d.address}</div>`)}
            ${row("clock", "Working hours", html`<dl class="hours">${d.workingHours.map((h) => html`<div><dt>${h.days}</dt><dd>${h.hours}</dd></div>`)}</dl>`)}
          </ul>
          <div class="contact-social">${socialLinks(d.socialLinks)}</div>
        </div>
        <div class="form-panel" id="appointment">
          <h2>Request an appointment</h2>
          <p>Tell us what you need and the best number to reach you.</p>
          ${contactForm()}
        </div>
      </div>
    </section>
    <section class="container" style="padding-bottom:var(--section-y)" aria-label="Clinic location">
      <div class="map">${d.mapEmbedUrl
        ? html`<iframe src="${safeUrl(d.mapEmbedUrl)}" title="Clinic location on Google Maps" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`
        : html`<div class="map__placeholder">${icon("pin", 34)}<h2 style="font-size:1.4rem">${d.address}</h2><p>Add a Google Maps embed link as <code>mapEmbedUrl</code> in the dentist data to show the map here.</p></div>`}</div>
    </section>`);
  initContactForm(qs("[data-contact-form]"));
  if (location.hash === "#appointment") qs("#appointment")?.scrollIntoView();
}
