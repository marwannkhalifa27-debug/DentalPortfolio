import { html } from "../utils/html.js";
import { submitContactMessage } from "../services/api.js";

export function contactForm() {
  const auto = { name: "name", phone: "tel", email: "email" };
  const field = (id, label, type, hint = "") => html`<div class="field" data-field="${id}">
    <label for="${id}">${label}${hint ? html` <span class="field__hint">${hint}</span>` : ""}</label>
    <input id="${id}" name="${id}" type="${type}" autocomplete="${auto[id]}" aria-describedby="${id}-error">
    <p class="field__error" id="${id}-error" aria-live="polite"></p>
  </div>`;
  return html`<form class="form" novalidate data-contact-form>
    <div class="form__row">
      ${field("name", "Your name", "text")}
      ${field("phone", "Phone number", "tel")}
    </div>
    ${field("email", "Email", "email", "(optional)")}
    <div class="field" data-field="message">
      <label for="message">How can we help?</label>
      <textarea id="message" name="message" aria-describedby="message-error"></textarea>
      <p class="field__error" id="message-error" aria-live="polite"></p>
    </div>
    <div class="form__trap" aria-hidden="true"><label>Leave this empty<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
    <div data-status role="status"></div>
    <button class="btn" type="submit">Send message</button>
  </form>`;
}

const rules = {
  name: (v) => (v.trim().length < 2 ? "Enter your name." : ""),
  phone: (v) => (/^[+\d][\d\s()-]{6,}$/.test(v.trim()) ? "" : "Enter a phone number we can call or message."),
  email: (v) => (v.trim() && !/^\S+@\S+\.\S+$/.test(v.trim()) ? "Enter a valid email address, or leave it empty." : ""),
  message: (v) => (v.trim().length < 5 ? "Tell us briefly what you need." : ""),
};

export function initContactForm(form) {
  const status = form.querySelector("[data-status]");
  const button = form.querySelector("button[type=submit]");

  const validateField = (name) => {
    const wrap = form.querySelector(`[data-field="${name}"]`);
    const error = rules[name](form.elements[name].value);
    wrap.classList.toggle("has-error", Boolean(error));
    form.elements[name].setAttribute("aria-invalid", String(Boolean(error)));
    wrap.querySelector(".field__error").textContent = error;
    return !error;
  };
  Object.keys(rules).forEach((n) => form.elements[n].addEventListener("blur", () => validateField(n)));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.className = ""; status.textContent = "";
    if (form.elements.website.value) return; // honeypot: bots fill this in
    const results = Object.keys(rules).map(validateField);
    if (results.includes(false)) { form.querySelector(".has-error input, .has-error textarea")?.focus(); return; }

    button.disabled = true; button.textContent = "Sending…";
    try {
      await submitContactMessage({ name: form.elements.name.value.trim(), phone: form.elements.phone.value.trim(), email: form.elements.email.value.trim(), message: form.elements.message.value.trim() });
      form.reset();
      status.className = "form__status form__status--ok";
      status.textContent = "Message sent. We will reply on the phone number you gave as soon as possible.";
    } catch {
      status.className = "form__status form__status--error";
      status.textContent = "Your message was not sent. Try again, or contact the clinic by phone or WhatsApp.";
    } finally {
      button.disabled = false; button.textContent = "Send message";
    }
  });
}
