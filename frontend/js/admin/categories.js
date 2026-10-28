import { esc } from "../utils/html.js"
import { adminFetch, must, showStatus } from "./adminApi.js"

const $ = (id) => document.getElementById(id)
const slugify = (s) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")

export function init() {
    const form = $("categoryForm")
    const list = $("categoriesList")
    const status = $("categoryStatus")
    const heading = $("categoryFormTitle")
    const cancel = $("categoryCancel")
    const submitBtn = form.querySelector("button[type=submit]")
    const { name, slug } = form.elements

    let cats = []
    let editingId = null
    let slugTouched = false

    // The slug follows the name until the admin edits it by hand.
    name.addEventListener("input", () => { if (!editingId && !slugTouched) slug.value = slugify(name.value) })
    slug.addEventListener("input", () => { slugTouched = true })

    function render() {
        if (!cats.length) { list.textContent = "No categories yet."; return }
        list.innerHTML = cats.map((c) => `
            <div class="case-list-item">
              <div class="grow"><strong>${esc(c.name)}</strong><br><small>${esc(c.slug)}</small></div>
              <div class="actions">
                <button type="button" class="btn btn--outline btn--small" data-action="edit" data-id="${esc(c.id)}">Rename</button>
                <button type="button" class="btn btn--outline btn--small" data-action="delete" data-id="${esc(c.id)}">Delete</button>
              </div>
            </div>`).join("")
    }

    async function load() {
        const res = await adminFetch("/categories")
        if (!res.ok) { list.textContent = "Could not load categories."; return }
        cats = await res.json()
        render()
    }

    function reset() {
        form.reset()
        editingId = null
        slugTouched = false
        heading.textContent = "Add a category"
        submitBtn.textContent = "Add category"
        cancel.hidden = true
    }
    cancel.addEventListener("click", () => { reset(); showStatus(status, "") })

    list.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-action]")
        const c = btn && cats.find((x) => x.id === btn.dataset.id)
        if (!c) return
        showStatus(status, "")
        if (btn.dataset.action === "edit") {
            editingId = c.id
            slugTouched = true
            name.value = c.name
            slug.value = c.slug
            heading.textContent = `Rename: ${c.name}`
            submitBtn.textContent = "Save changes"
            cancel.hidden = false
            form.scrollIntoView({ behavior: "smooth", block: "start" })
            return
        }
        if (!confirm(`Delete "${c.name}"?`)) return
        try {
            await must(await adminFetch(`/admin/categories/${c.id}`, { method: "DELETE" }))
            if (editingId === c.id) reset()
            await load()
            document.dispatchEvent(new Event("categories-changed"))
        } catch (err) {
            showStatus(status, err.message, "error")   // "Category is used by existing cases"
        }
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        showStatus(status, "")
        submitBtn.disabled = true
        try {
            await must(await adminFetch(editingId ? `/admin/categories/${editingId}` : "/admin/categories", {
                method: editingId ? "PATCH" : "POST",
                body: { name: name.value.trim(), slug: slug.value.trim() },
            }))
            const wasEditing = !!editingId
            reset()
            showStatus(status, wasEditing ? "Category updated." : "Category added.", "ok")
            await load()
            document.dispatchEvent(new Event("categories-changed"))
        } catch (err) {
            showStatus(status, err.message, "error")
        } finally {
            submitBtn.disabled = false
        }
    })

    load()
}