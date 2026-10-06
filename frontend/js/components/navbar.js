import { html } from "../utils/html.js";
import { icon } from "./icons.js";

const links = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "about", label: "About", href: "about.html" },
  { id: "cases", label: "Cases", href: "cases.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
];

export function brand(name) {
  return html`<a class="brand" href="index.html"><span class="brand__mark">${icon("tooth", 20)}</span>${name}</a>`;
}

export function navbar({ name, page }) {
  return html`<header class="site-header">
    <div class="container site-header__inner">
      ${brand(name)}
      <button type="button" class="nav-toggle" aria-expanded="false" aria-controls="site-nav" aria-label="Open menu">${icon("menu", 22)}</button>
      <nav class="nav" id="site-nav" aria-label="Main">
        <ul class="nav__list">
          ${links.map((l) => html`<li><a class="nav__link" href="${l.href}" ${l.id === page ? html`aria-current="page"` : ""}>${l.label}</a></li>`)}
        </ul>
        <a class="btn btn--small" href="contact.html#appointment">Book appointment</a>
      </nav>
    </div>
  </header>`;
}

export function initNavbar(root) {
  const header = root.querySelector(".site-header");
  const toggle = root.querySelector(".nav-toggle");
  const nav = root.querySelector(".nav");
  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    toggle.innerHTML = String(icon(open ? "close" : "menu", 22));
  };
  toggle.addEventListener("click", () => setOpen(!nav.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && nav.classList.contains("is-open")) { setOpen(false); toggle.focus(); } });
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}
