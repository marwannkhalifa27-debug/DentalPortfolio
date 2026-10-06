/**
 * Tiny safe templating helpers.
 * `html` escapes every interpolated value unless it is already a SafeString
 * (the result of another html`` call or raw()). This keeps API data from injecting markup.
 */
class SafeString {
  constructor(value) { this.value = value; }
  toString() { return this.value; }
}

export const raw = (value) => new SafeString(String(value));

export function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

const render = (v) => (v instanceof SafeString ? v.value : Array.isArray(v) ? v.map(render).join("") : v == null || v === false ? "" : esc(v));

export function html(strings, ...values) {
  let out = "";
  strings.forEach((s, i) => { out += s + (i < values.length ? render(values[i]) : ""); });
  return new SafeString(out);
}

/** Allow only http(s), mailto, tel and relative URLs. */
export function safeUrl(url) {
  const u = String(url ?? "").trim();
  if (!u) return "#";
  if (/^(https?:|mailto:|tel:)/i.test(u) || /^[./#?]/.test(u) || !/^[a-z][a-z0-9+.-]*:/i.test(u)) return u;
  return "#";
}

export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export function mount(el, content) {
  if (el) el.innerHTML = String(content);
}
