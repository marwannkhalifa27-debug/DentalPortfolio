import { esc } from "../utils/html.js"
import { adminFetch, must, assetUrl, showStatus } from "./adminApi.js"

const $ = (id) => document.getElementById(id)

export function init() {
    const form = $("caseForm")
    const list = $("casesList")
    const status = $("caseStatus")
    const listStatus = $("caseListStatus")
    const heading = $("caseFormTitle")
    const cancel = $("caseCancel")
    const note = $("imageNote")
    const submitBtn = form.querySelector("button[type=submit]")
    const { patientConsent: consent, isPublished: publish, featured, category: select } = form.elements
    const treatment = (k) => form.elements[`treatment[${k}]`]

    let cases = []
    let editingId = null

    // Publishing is only possible once consent is ticked.
    const syncPublish = () => {
        publish.disabled = !consent.checked
        if (!consent.checked) publish.checked = false
    }
    consent.addEventListener("change", syncPublish)

    async function loadCategories() {
        const res = await adminFetch("/categories")
        if (!res.ok) return
        const cats = await res.json()
        const keep = select.value
        select.innerHTML = `<option value="">Choose a category…</option>` +
            cats.map((c) => `<option value="${esc(c.id)}">${esc(c.name)}</option>`).join("")
        select.value = keep
    }
    document.addEventListener("categories-changed", loadCategories)

    function render() {
        if (!cases.length) { list.textContent = "No cases yet."; return }
        list.innerHTML = cases.map((c) => `
            <article class="case-list-item">
              <img class="thumb" src="${esc(assetUrl(c.beforeImage))}" alt="">
              <div class="grow">
                <strong>${esc(c.title)}</strong><br>
                <small>${esc(c.category?.name ?? "No category")}</small><br>
                <span class="pill ${c.isPublished ? "pill--ok" : ""}">${c.isPublished ? "Published" : "Draft"}</span>
                ${c.featured ? `<span class="pill">Featured</span>` : ""}
              </div>
              <div class="actions">
                <button type="button" class="btn btn--outline btn--small" data-action="toggle" data-id="${esc(c.id)}">${c.isPublished ? "Unpublish" : "Publish"}</button>
                <button type="button" class="btn btn--outline btn--small" data-action="edit" data-id="${esc(c.id)}">Edit</button>
                <button type="button" class="btn btn--outline btn--small" data-action="delete" data-id="${esc(c.id)}">Delete</button>
              </div>
            </article>`).join("")
    }

    async function loadCases() {
        const res = await adminFetch("/admin/cases")
        if (!res.ok) { list.textContent = "Could not load cases."; return }
        cases = await res.json()
        render()
    }

    function resetForm() {
        form.reset()
        editingId = null
        heading.textContent = "Add a case"
        submitBtn.textContent = "Save case"
        cancel.hidden = true
        note.hidden = true
        form.elements.beforeImage.required = true
        form.elements.afterImage.required = true
        syncPublish()
    }

    function startEdit(c) {
        resetForm()
        editingId = c.id
        form.elements.title.value = c.title ?? ""
        select.value = c.category?.id ?? ""
        form.elements.description.value = c.description ?? ""
        form.elements.details.value = c.details ?? ""
        form.elements.results.value = c.results ?? ""
        for (const k of ["procedure", "duration", "visits"]) treatment(k).value = c.treatment?.[k] ?? ""
        featured.checked = !!c.featured
        consent.checked = !!c.patientConsent
        syncPublish()
        publish.checked = !!c.isPublished && consent.checked
        heading.textContent = `Edit: ${c.title}`
        submitBtn.textContent = "Save changes"
        cancel.hidden = false
        note.hidden = false
        form.elements.beforeImage.required = false
        form.elements.afterImage.required = false
        showStatus(status, "")
        form.scrollIntoView({ behavior: "smooth", block: "start" })
    }

    cancel.addEventListener("click", () => { resetForm(); showStatus(status, "") })

    list.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-action]")
        if (!btn) return
        const c = cases.find((x) => x.id === btn.dataset.id)
        if (!c) return
        showStatus(listStatus, "")

        if (btn.dataset.action === "edit") return startEdit(c)

        btn.disabled = true
        try {
            if (btn.dataset.action === "toggle") {
                const fd = new FormData()
                fd.set("isPublished", String(!c.isPublished))
                await must(await adminFetch(`/admin/cases/${c.id}`, { method: "PATCH", form: fd }))
            } else if (btn.dataset.action === "delete") {
                if (!confirm("Delete this case and its photos? This cannot be undone.")) { btn.disabled = false; return }
                await must(await adminFetch(`/admin/cases/${c.id}`, { method: "DELETE" }))
                if (editingId === c.id) resetForm()
            }
            await loadCases()
        } catch (err) {
            showStatus(listStatus, err.message, "error")   // e.g. "isPublished: Cannot publish without patient consent"
            btn.disabled = false
        }
    })

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        showStatus(status, "")
        const fd = new FormData(form)
        // Unchecked boxes are not sent by browsers, so always send explicit values.
        for (const k of ["featured", "patientConsent", "isPublished"]) fd.set(k, String(form.elements[k].checked))
        // When creating, skip empty optional text fields. When editing, empty values clear the field.
        if (!editingId) for (const [k, v] of [...fd.entries()]) if (v === "") fd.delete(k)

        submitBtn.disabled = true
        try {
            await must(await adminFetch(editingId ? `/admin/cases/${editingId}` : "/admin/cases", {
                method: editingId ? "PATCH" : "POST",
                form: fd,
            }))
            const wasEditing = !!editingId
            resetForm()
            showStatus(status, wasEditing ? "Changes saved." : "Case saved.", "ok")
            await loadCases()
        } catch (err) {
            showStatus(status, err.message, "error")
        } finally {
            submitBtn.disabled = false
        }
    })

    syncPublish()
    loadCategories()
    loadCases()
}