import { html } from "../utils/html.js";
import { icon } from "./icons.js";

/**
 * Interactive before/after comparison.
 * Built on a transparent <input type="range"> so it works with mouse, touch and keyboard
 * (arrow keys, Home, End) and is announced correctly by screen readers.
 */
export function beforeAfter({ before, after, title = "treatment" }) {
  return html`<div class="ba" data-ba>
    <img class="ba__img" src="${after}" alt="After ${title}" width="800" height="600" decoding="async">
    <div class="ba__before"><img class="ba__img" src="${before}" alt="Before ${title}" width="800" height="600" decoding="async"></div>
    <span class="ba__tag ba__tag--before">Before</span>
    <span class="ba__tag ba__tag--after">After</span>
    <div class="ba__line"><span class="ba__knob">${icon("compare", 22)}</span></div>
    <input class="ba__range" type="range" min="0" max="100" value="50" aria-label="Drag to compare before and after">
  </div>`;
}

export function initBeforeAfter(root, { hint = false } = {}) {
  const input = root.querySelector(".ba__range");
  if (!input) return;
  const set = (v) => root.style.setProperty("--pos", `${v}%`);
  let userTouched = false;

  input.addEventListener("input", () => { userTouched = true; set(input.value); });
  ["pointerdown", "keydown", "touchstart"].forEach((e) => input.addEventListener(e, () => { userTouched = true; }, { passive: true }));

  // One-off nudge so visitors notice the handle moves. Skipped for reduced motion or once the user interacts.
  if (hint && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const start = performance.now() + 700;
    const duration = 1600;
    const frame = (now) => {
      if (userTouched) return;
      const t = Math.min(Math.max((now - start) / duration, 0), 1);
      const v = 50 - 20 * Math.sin(t * Math.PI * 2) * (1 - t * 0.2);
      input.value = v; set(v);
      if (t < 1) requestAnimationFrame(frame);
      else { input.value = 50; set(50); }
    };
    requestAnimationFrame(frame);
  }
}
