/**
 * Shared bootstrap for every page: loads dentist info, renders the header and footer.
 * Returns the dentist object so each page script can reuse it.
 */
import { getDentist } from "./services/api.js";
import { config } from "./config.js";
import { mount, qs } from "./utils/html.js";
import { navbar, initNavbar } from "./components/navbar.js";
import { footer } from "./components/footer.js";

const fallback = { name: config.SITE_NAME, title: "Dentist", biography: [], specialization: [], socialLinks: {}, workingHours: [] };

export async function initLayout(page) {
  let dentist = null;
  try { dentist = await getDentist(); } catch { /* header and footer fall back to basic content */ }
  const d = dentist ?? fallback;

  const header = qs("#site-header");
  mount(header, navbar({ name: d.name, page }));
  initNavbar(header);
  mount(qs("#site-footer"), footer(d));
  if (dentist && dentist.name) document.title = document.title.replace("Dr. Karim", dentist.name);
  return dentist;
}

/** Runs `load`, shows a loading state, then `render`, or an error state with retry. */
export async function loadInto(target, { loading, load, render, error }) {
  const run = async () => {
    mount(target, loading);
    try {
      const data = await load();
      mount(target, render(data));
    } catch (err) {
      mount(target, error(err));
      target.querySelector("[data-retry]")?.addEventListener("click", run);
      return;
    }
    target.dispatchEvent(new CustomEvent("rendered", { bubbles: true }));
  };
  return run();
}
