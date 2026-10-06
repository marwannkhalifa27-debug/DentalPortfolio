import { html } from "../utils/html.js";
import { icon } from "./icons.js";
import { brand } from "./navbar.js";
import { socialLinks } from "./socialLinks.js";
import { phoneHref } from "../utils/format.js";

export function footer(d) {
  const year = new Date().getFullYear();
  return html`<footer class="site-footer">
    <div class="container site-footer__grid">
      <div class="site-footer__about">
        ${brand(d.name)}
        <p>${d.title}</p>
        <div style="margin-top:1.25rem">${socialLinks(d.socialLinks)}</div>
      </div>
      <div>
        <h2>Explore</h2>
        <ul class="footer-links">
          <li><a href="index.html">Home</a></li><li><a href="about.html">About</a></li>
          <li><a href="cases.html">Cases</a></li><li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div>
        <h2>Clinic</h2>
        <ul class="footer-contact">
          ${d.phone ? html`<li>${icon("phone", 18)}<a href="${phoneHref(d.phone)}">${d.phone}</a></li>` : ""}
          ${d.email ? html`<li>${icon("mail", 18)}<a href="mailto:${d.email}">${d.email}</a></li>` : ""}
          ${d.address ? html`<li>${icon("pin", 18)}<span>${d.address}</span></li>` : ""}
          ${d.workingHours?.[0] ? html`<li>${icon("clock", 18)}<span>${d.workingHours[0].days}, ${d.workingHours[0].hours}</span></li>` : ""}
        </ul>
      </div>
    </div>
    <div class="container site-footer__base"><span>&copy; ${year} ${d.name}</span><span>Case photos are published with patient consent.</span></div>
  </footer>`;
}
