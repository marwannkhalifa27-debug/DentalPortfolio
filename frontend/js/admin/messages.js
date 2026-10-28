import { esc } from "../utils/html.js"
import { adminFetch, must, showStatus } from "./adminApi.js"

const $ = (id) => document.getElementById(id)

export function init() {
    const list = $("messagesList")
    const status = $("messagesStatus")
    const more = $("messagesMore")
    const badge = $("unreadBadge")
    const refresh = $("messagesRefresh")

    let messages = []
    let unread = 0
    let page = 1
    let hasMore = false

    function render() {
        badge.hidden = unread === 0
        badge.textContent = unread
        more.hidden = !hasMore
        if (!messages.length) { list.textContent = "No messages yet."; return }
        list.innerHTML = messages.map((m) => `
            <article class="message ${m.isRead ? "" : "message--unread"}">
              <div class="message__head">
                <strong>${esc(m.name)}</strong>
                <small>${esc(new Date(m.createdAt).toLocaleString())}</small>
              </div>
              <div class="message__meta">
                <a href="tel:${esc(m.phone)}">${esc(m.phone)}</a>
                ${m.email ? ` · <a href="mailto:${esc(m.email)}">${esc(m.email)}</a>` : ""}
              </div>
              <p class="message__body">${esc(m.message)}</p>
              <div class="actions">
                ${m.isRead ? "" : `<button type="button" class="btn btn--outline btn--small" data-action="read" data-id="${esc(m._id)}">Mark as read</button>`}
                <button type="button" class="btn btn--outline btn--small" data-action="delete" data-id="${esc(m._id)}">Delete</button>
              </div>
            </article>`).join("")
    }

    async function load(reset = true) {
        if (reset) { page = 1; messages = [] }
        const res = await adminFetch(`/admin/messages?page=${page}&limit=20`)
        if (!res.ok) { showStatus(status, "Could not load messages.", "error"); return }
        const data = await res.json()
        messages = messages.concat(data.messages)
        unread = data.unread
        hasMore = data.pagination.hasMore
        render()
    }

    more.addEventListener("click", () => { page += 1; load(false) })
    refresh.addEventListener("click", () => load(true))

    list.addEventListener("click", async (e) => {
        const btn = e.target.closest("[data-action]")
        const m = btn && messages.find((x) => x._id === btn.dataset.id)
        if (!m) return
        showStatus(status, "")
        btn.disabled = true
        try {
            if (btn.dataset.action === "read") {
                await must(await adminFetch(`/admin/messages/${m._id}`, { method: "PATCH" }))
                m.isRead = true
                unread = Math.max(0, unread - 1)
            } else {
                if (!confirm("Delete this message?")) { btn.disabled = false; return }
                await must(await adminFetch(`/admin/messages/${m._id}`, { method: "DELETE" }))
                messages = messages.filter((x) => x !== m)
                if (!m.isRead) unread = Math.max(0, unread - 1)
            }
            render()
        } catch (err) {
            showStatus(status, err.message, "error")
            btn.disabled = false
        }
    })

    load()
}