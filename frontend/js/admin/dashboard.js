import { adminFetch } from "./adminApi.js"
import { init as initCases } from "./cases.js"
import { init as initCategories } from "./categories.js"
import { init as initProfile } from "./profile.js"
import { init as initMessages } from "./messages.js"

await adminFetch("/auth/me")      // a 401 here sends the visitor to the login page

const tabs = [...document.querySelectorAll("[data-tab]")]
const panels = [...document.querySelectorAll("[data-panel]")]

function show(name) {
    if (!panels.some((p) => p.dataset.panel === name)) name = "cases"
    tabs.forEach((t) => t.setAttribute("aria-selected", String(t.dataset.tab === name)))
    panels.forEach((p) => { p.hidden = p.dataset.panel !== name })
    history.replaceState(null, "", `#${name}`)
}
tabs.forEach((t) => t.addEventListener("click", () => show(t.dataset.tab)))
show(location.hash.slice(1))

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await adminFetch("/auth/logout", { method: "POST" }).catch(() => {})
    location.href = "admin.html"
})

initCases()
initCategories()
initProfile()
initMessages()