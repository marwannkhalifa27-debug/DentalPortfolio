/**
 * Centralised data layer.
 * Pages and components never call fetch() or import mock data directly:
 * they call the functions below. Switching to the real backend means
 * setting USE_MOCK to false in config.js (and matching the endpoints/shapes in the README).
 *
 * Expected endpoints:
 *   GET  /dentist
 *   GET  /categories
 *   GET  /cases?category=slug&featured=true&limit=3
 *   GET  /cases/:id
 *   POST /contact   { name, phone, email, message }
 */
import { config } from "../config.js";
import { dentistMock } from "../data/dentist.js";
import { casesMock } from "../data/cases.js";
import { categoriesMock } from "../data/categories.js";

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ---------- Real requests ---------- */

async function request(path, { method = "GET", body } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(config.API_BASE_URL + path, {
      method,
      headers: body ? { "Content-Type": "application/json", Accept: "application/json" } : { Accept: "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
    if (!res.ok) {
      let message = "Request failed";
      try { message = (await res.json()).message || message; } catch { /* non-JSON error body */ }
      throw new ApiError(message, res.status);
    }
    return res.status === 204 ? null : await res.json();
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(err.name === "AbortError" ? "The request timed out" : "Could not reach the server");
  } finally {
    clearTimeout(timer);
  }
}

/* ---------- Mock requests ---------- */

async function mock(fn) {
  await sleep(config.MOCK_DELAY_MS);
  // Add ?mock_error=1 to any page URL to test the error states.
  if (new URLSearchParams(location.search).has("mock_error")) throw new ApiError("Simulated server error", 500);
  return structuredClone(fn());
}

/* ---------- Normalisers: the single place that adapts API responses to the UI model ---------- */

const withBase = (url) => (!url || /^(https?:|data:)/i.test(url) || !config.ASSET_BASE_URL ? url : config.ASSET_BASE_URL.replace(/\/$/, "") + "/" + url.replace(/^\//, ""));

function normalizeCase(c) {
  const category = typeof c.category === "object" && c.category ? c.category.slug : c.category;
  return {
    id: String(c.id),
    title: c.title ?? "",
    category: category ?? "other",
    description: c.description ?? "",
    details: c.details ?? c.description ?? "",
    treatment: c.treatment ?? {},
    results: c.results ?? "",
    beforeImage: withBase(c.beforeImage),
    afterImage: withBase(c.afterImage),
    additionalImages: (c.additionalImages ?? []).map(withBase),
    featured: Boolean(c.featured),
    createdAt: c.createdAt ?? "",
  };
}

function normalizeDentist(d) {
  const biography = Array.isArray(d.biography) ? d.biography : String(d.biography ?? "").split(/\n\s*\n/).filter(Boolean);
  return {
    ...d,
    biography,
    specialization: Array.isArray(d.specialization) ? d.specialization : d.specialization ? [d.specialization] : [],
    highlights: d.highlights ?? [],
    certifications: d.certifications ?? [],
    timeline: d.timeline ?? [],
    workingHours: d.workingHours ?? [],
    socialLinks: d.socialLinks ?? {},
    profileImage: withBase(d.profileImage),
  };
}

/* ---------- Public API ---------- */

export async function getDentist() {
  const data = config.USE_MOCK ? await mock(() => dentistMock) : await request("/dentist");
  return normalizeDentist(data);
}

export async function getCategories() {
  return config.USE_MOCK ? mock(() => categoriesMock) : request("/categories");
}

export async function getCases({ category, featured, limit, excludeId } = {}) {
  let list;
  if (config.USE_MOCK) {
    list = await mock(() => casesMock);
  } else {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (featured) params.set("featured", "true");
    if (limit) params.set("limit", String(limit));
    list = await request("/cases" + (params.size ? `?${params}` : ""));
  }
  list = list.map(normalizeCase);
  // Filtering is repeated client-side so mock mode and real mode behave the same.
  if (category) list = list.filter((c) => c.category === category);
  if (featured) list = list.filter((c) => c.featured);
  if (excludeId) list = list.filter((c) => c.id !== String(excludeId));
  list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return limit ? list.slice(0, limit) : list;
}

export async function getCaseById(id) {
  if (config.USE_MOCK) {
    const found = await mock(() => casesMock.find((c) => c.id === String(id)) ?? null);
    if (!found) throw new ApiError("Case not found", 404);
    return normalizeCase(found);
  }
  return normalizeCase(await request(`/cases/${encodeURIComponent(id)}`));
}

export async function submitContactMessage(payload) {
  if (config.USE_MOCK) return mock(() => ({ ok: true }));
  return request("/contact", { method: "POST", body: payload });
}
