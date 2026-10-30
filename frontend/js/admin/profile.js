import { esc } from "../utils/html.js"
import { adminFetch, must, showStatus } from "./adminApi.js"

const $ = (id) => document.getElementById(id)

// Repeating groups: [key, label, input type]. Keys match the backend schema exactly.
const repeaters = {
    highlights: { fields: [["title", "Title"], ["text", "Text"]] },
    certifications: { fields: [["title", "Title"], ["issuer", "Issuer"], ["year", "Year", "number"]] },
    timeline: { fields: [["period", "Period"], ["title", "Title"], ["place", "Place"], ["text", "Text"]] },
}

export function init() {
    const form = $("profileForm")
    const status = $("profileStatus")
    const f = form.elements
    const val = (n) => f[n].value.trim()
    const box = (name) => document.querySelector(`[data-repeater="${name}"]`)

    function addRow(name, values = {}) {
        const row = document.createElement("div")
        row.className = "repeat-row"
        row.innerHTML = repeaters[name].fields.map(([key, label, type]) =>
            `<label class="field"><span>${label}</span><input data-key="${key}" type="${type ?? "text"}" value="${esc(values[key] ?? "")}"></label>`
        ).join("") + `<button type="button" class="btn btn--outline btn--small" data-remove>Remove</button>`
        box(name).append(row)
    }

    function collect(name) {
        const { fields } = repeaters[name]
        return [...box(name).querySelectorAll(".repeat-row")].map((row) => {
            const item = {}
            let any = false
            for (const [key, , type] of fields) {
                const v = row.querySelector(`[data-key="${key}"]`).value.trim()
                if (v) any = true
                item[key] = type === "number" ? (v ? Number(v) : undefined) : v
            }
            return any ? item : null          // blank rows are ignored
        }).filter(Boolean)
    }

    document.querySelectorAll("[data-add]").forEach((b) =>
        b.addEventListener("click", () => addRow(b.dataset.add)))
    form.addEventListener("click", (e) => { if (e.target.closest("[data-remove]")) e.target.closest(".repeat-row").remove() })

    function fill(d) {
        for (const k of ["name", "title", "intro", "university", "interests", "phone", "whatsapp", "email"])
            f[k].value = d[k] ?? ""
        f.graduationYear.value = d.graduationYear ?? ""
        f.experience.value = d.experience ?? ""
        f.biography.value = (d.biography ?? []).join("\n\n")
        f.specialization.value = (d.specialization ?? []).join(", ")
        f.instagram.value = d.socialLinks?.instagram ?? ""
        f.facebook.value = d.socialLinks?.facebook ?? ""
        for (const name of Object.keys(repeaters)) {
            box(name).innerHTML = ""
            ;(d[name] ?? []).forEach((v) => addRow(name, v))
        }
    }

    async function load() {
        const res = await adminFetch("/dentist")
        if (res.status === 404) { showStatus(status, "No profile yet. Fill in at least the name and title, then save.", ""); return }
        if (!res.ok) { showStatus(status, "Could not load the profile.", "error"); return }
        fill(await res.json())
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault()
        showStatus(status, "")


        const body = {
            name: val("name"),
            title: val("title"),
            intro: val("intro"),
            biography: val("biography").split(/\n\s*\n/).map((s) => s.trim()).filter(Boolean),
            university: val("university"),
            interests: val("interests"),
            specialization: val("specialization").split(",").map((s) => s.trim()).filter(Boolean),
            phone: val("phone"),
            whatsapp: val("whatsapp"),
            email: val("email"),
            socialLinks: { instagram: val("instagram"), facebook: val("facebook") },
        }
        if (val("graduationYear")) body.graduationYear = Number(val("graduationYear"))
        if (val("experience")) body.experience = Number(val("experience"))
        for (const name of Object.keys(repeaters)) body[name] = collect(name)

        const button = form.querySelector("button[type=submit]")
        button.disabled = true
        try {
            await must(await adminFetch("/admin/dentist", { method: "PATCH", body }))

            if (f.pPhoto?.files?.[0]) {
                const fd = new FormData()
                fd.set("profileImage", f.pPhoto.files[0])
                await must(await adminFetch("/admin/dentist/photo", { method: "PATCH", form: fd }))
                f.pPhoto.value = ""
            }
            showStatus(status, "Profile saved.", "ok")
        } catch (err) {
            showStatus(status, err.message, "error")
        } finally {
            button.disabled = false
        }
    })

    load()
}