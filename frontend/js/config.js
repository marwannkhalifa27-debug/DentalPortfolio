/**
 * App configuration.
 * A static site has no build-time env vars, so values live here.
 * To override per environment without editing this file, define
 * window.__APP_CONFIG__ in an inline <script> (or an env.js file) before the module scripts load:
 *   <script>window.__APP_CONFIG__ = { USE_MOCK: false, API_BASE_URL: "https://api.example.com/api" };</script>
 */
const defaults = {
  SITE_NAME: "Dr. Karim",
  API_BASE_URL: "http://localhost:4000/api", // your Express API
  ASSET_BASE_URL: "",                         // prefix for image paths returned by the API (e.g. https://cdn.example.com)
  USE_MOCK: true,                             // set to false once the backend is running
  MOCK_DELAY_MS: 350,                         // simulated network latency in mock mode
  REQUEST_TIMEOUT_MS: 10000,
};

export const config = { ...defaults, ...(window.__APP_CONFIG__ || {}) };
