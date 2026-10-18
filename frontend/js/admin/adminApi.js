import { config } from "../config.js"

// Every admin request goes through here: same-origin cookie, CSRF header, redirect on 401.
export async function adminFetch(path, { method = "GET", body, form } = {}) {
    const res = await fetch(config.API_BASE_URL + path, {
        method,
        credentials: "same-origin",
        headers: { "X-Requested-With": "fetch", ...(body ? { "Content-Type": "application/json" } : {}) },
        body: form ?? (body ? JSON.stringify(body) : undefined),   // FormData sets its own content type
    })
    if (res.status === 401) { location.href = "admin.html"; throw new Error("Please sign in again") }
    return res
}

// Turns any error response into one readable sentence.
export async function readError(res) {
    try {
        const data = await res.json()
        if (Array.isArray(data.errors) && data.errors.length) return data.errors.map((e) => e.message).join(". ")
        return data.message || "Request failed"
    } catch {
        return res.status === 429 ? "Too many attempts. Please try again later." : "Request failed"
    }
}