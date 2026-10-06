import { html } from "../utils/html.js";
import { icon } from "./icons.js";

export function imageGallery(images, title = "") {
  if (!images?.length) return "";
  return html`<div class="gallery" data-gallery>
    ${images.map((src, i) => html`<button type="button" class="gallery__item" data-index="${i}" aria-label="Open image ${i + 1} of ${images.length}"><img src="${src}" alt="${title} additional image ${i + 1}" loading="lazy" decoding="async" width="400" height="300"></button>`)}
  </div>
  <dialog class="lightbox" data-lightbox aria-label="Image viewer">
    <div class="lightbox__stage"><img alt="" data-lightbox-img></div>
    <div class="lightbox__bar">
      <span class="lightbox__count" data-lightbox-count aria-live="polite"></span>
      <div class="lightbox__nav">
        <button type="button" class="lightbox__btn" data-prev aria-label="Previous image">${icon("left")}</button>
        <button type="button" class="lightbox__btn" data-next aria-label="Next image">${icon("right")}</button>
        <button type="button" class="lightbox__btn" data-close>Close</button>
      </div>
    </div>
  </dialog>`;
}

export function initImageGallery(root, images) {
  const gallery = root.querySelector("[data-gallery]");
  const dialog = root.querySelector("[data-lightbox]");
  if (!gallery || !dialog) return;
  const img = dialog.querySelector("[data-lightbox-img]");
  const count = dialog.querySelector("[data-lightbox-count]");
  let index = 0;

  const show = (i) => {
    index = (i + images.length) % images.length;
    img.src = images[index];
    img.alt = `Image ${index + 1} of ${images.length}`;
    count.textContent = `${index + 1} of ${images.length}`;
  };
  gallery.addEventListener("click", (e) => {
    const b = e.target.closest("[data-index]");
    if (!b) return;
    show(Number(b.dataset.index));
    dialog.showModal();
  });
  dialog.querySelector("[data-prev]").addEventListener("click", () => show(index - 1));
  dialog.querySelector("[data-next]").addEventListener("click", () => show(index + 1));
  dialog.querySelector("[data-close]").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(index - 1);
    if (e.key === "ArrowRight") show(index + 1);
  });
  // Swipe on touch devices
  let startX = 0;
  dialog.addEventListener("touchstart", (e) => { startX = e.changedTouches[0].clientX; }, { passive: true });
  dialog.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
  }, { passive: true });
}
