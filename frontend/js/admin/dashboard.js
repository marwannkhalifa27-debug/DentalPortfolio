import { config } from "../config.js"
import { esc } from "../utils/html.js"
import { adminFetch, readError } from "./adminApi.js"

const form = document.getElementById("newCaseForm")
const status = document.getElementById("uploadStatus")
const list = document.getElementById("casesList")
const consent = document.getElementById("consent")
const publish = document.getElementById("publish")

function setStatus(text, kind) {
    status.hidden = !text
    status.textContent = text
    status.className = `form__status${kind ? ` form__status--${kind}` : ""}`
}

// Publishing is only possible once consent is ticked.
function syncPublishState() {
    publish.disabled = !consent.checked
    if (!consent.checked) publish.checked = false
}
consent.addEventListener("change", syncPublishState)

async function loadCategories() {
    const res = await fetch(`${config.API_BASE_URL}/categories`)
    if (!res.ok) { setStatus("Could not load categories", "error"); return }
    const categories = await res.json()
    document.getElementById("category").innerHTML =
        `<option value="">Choose a category…</option>` +
        categories.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join("")
}

async function loadCases() {
    const res = await adminFetch("/admin/cases")
    if (!res.ok) { list.textContent = await readError(res); return }
    const cases = await res.json()
    if (!cases.length) { list.textContent = "No cases yet."; return }
    list.innerHTML = cases.map((c) => `
        <div class="case-list-item">
          <div>
            <strong>${esc(c.title)}</strong><br>
            <small>${esc(c.category?.name ?? "No category")} · ${c.isPublished ? "Published" : "Draft"}</small>
          </div>
          <button type="button" class="btn btn--outline btn--small" data-delete="${esc(c.id)}">Delete</button>
        </div>`).join("")
}

// One listener for all delete buttons, so nothing is re-attached after each render.
list.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-delete]")
    if (!btn || !confirm("Delete this case and its photos? This cannot be undone.")) return
    btn.disabled = true
    const res = await adminFetch(`/admin/cases/${btn.dataset.delete}`, { method: "DELETE" })
    if (!res.ok) alert(await readError(res))
    loadCases()
})

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    setStatus("")
    const button = form.querySelector("button[type=submit]")
    button.disabled = true
    try {
        const res = await adminFetch("/admin/cases", { method: "POST", form: new FormData(form) })
        if (!res.ok) throw new Error(await readError(res))
        form.reset()
        syncPublishState()
        setStatus("Case saved.", "ok")
        loadCases()
    } catch (err) {
        setStatus(err.message, "error")
    } finally {
        button.disabled = false
    }
})

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await adminFetch("/auth/logout", { method: "POST" }).catch(() => {})
    location.href = "admin.html"
})

await adminFetch("/auth/me")      // a 401 here sends the visitor to the login page
loadCategories()
loadCases()