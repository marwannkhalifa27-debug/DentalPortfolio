import { initLayout, loadInto } from "../main.js";
import { getCases, getCategories } from "../services/api.js";
import { html, qs } from "../utils/html.js";
import { caseGrid } from "../components/caseCard.js";
import { categoryFilter } from "../components/categoryFilter.js";
import { loadingState, errorState, emptyState } from "../components/states.js";

await initLayout("cases");

const root = qs("#cases-root");
let active = new URLSearchParams(location.search).get("category") ?? "";

loadInto(root, {
  loading: loadingState(6),
  load: () => Promise.all([getCases(), getCategories()]),
  error: () => errorState({ title: "Cases could not be loaded", message: "Check your connection and try again." }),
  render: ([cases, categories]) => {
    const names = new Map(categories.map((c) => [c.slug, c.name]));
    if (!cases.length) return emptyState({ title: "No cases published yet", message: "New cases are added regularly. Check back soon." });
    if (!cases.some((c) => c.category === active)) active = "";

    // Render the shell once, then update only the results when the filter changes.
    queueMicrotask(() => {
      const filterEl = qs("#filter");
      const results = qs("#results");
      const live = qs("#results-status");
      const draw = () => {
        const list = active ? cases.filter((c) => c.category === active) : cases;
        filterEl.innerHTML = String(categoryFilter({ categories, cases, active }));
        results.innerHTML = String(list.length ? caseGrid(list, names) : emptyState({ title: "No cases in this category", message: "Try another treatment type.", action: { id: "reset", label: "Show all cases" } }));
        live.textContent = `${list.length} ${list.length === 1 ? "case" : "cases"} shown`;
        const url = new URL(location.href);
        active ? url.searchParams.set("category", active) : url.searchParams.delete("category");
        history.replaceState(null, "", url);
      };
      filterEl.addEventListener("click", (e) => {
        const b = e.target.closest("[data-category]");
        if (!b) return;
        active = b.dataset.category; draw();
        qs(`[data-category="${active}"]`)?.focus();
      });
      results.addEventListener("click", (e) => { if (e.target.closest('[data-action="reset"]')) { active = ""; draw(); } });
      draw();
    });
    return html`<div id="filter"></div><div id="results"></div><p class="visually-hidden" id="results-status" role="status"></p>`;
  },
});
