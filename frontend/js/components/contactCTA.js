import { html } from "../utils/html.js";
import { icon } from "./icons.js";
import { phoneHref, whatsappHref } from "../utils/format.js";

export function contactCTA(d) {
  return html`<section class="cta-band section" aria-labelledby="cta-title">
    <div class="container cta-band__inner">
      <div>
        <h2 id="cta-title">Ready to talk about your smile?</h2>
        <p class="cta-band__lead">Send a photo on WhatsApp or call the clinic. We will suggest the next step and answer your questions.</p>
      </div>
      <div class="cta-band__panel">
        <a class="cta-band__phone" href="${phoneHref(d.phone)}">${d.phone}</a>
        <div class="cta-band__actions">
          <a class="btn btn--light" href="${whatsappHref(d.whatsapp, "Hello, I would like to ask about a treatment.")}" target="_blank" rel="noopener noreferrer">${icon("chat", 20)}WhatsApp</a>
          <a class="btn btn--ghost-light" href="contact.html#appointment">Contact form</a>
        </div>
      </div>
    </div>
  </section>`;
}
