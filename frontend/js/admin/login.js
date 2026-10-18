import { config } from "../config.js"
import { readError } from "./adminApi.js"

const form = document.getElementById("loginForm")
const status = document.getElementById("status")
const button = form.querySelector("button")

form.addEventListener("submit", async (e) => {
    e.preventDefault()
    button.disabled = true
    button.textContent = "Checking…"
    status.hidden = true
    try {
        // plain fetch, not adminFetch: a wrong password also returns 401 and must not redirect
        const res = await fetch(`${config.API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: form.elements.email.value, password: form.elements.password.value }),
        })
        if (res.ok) { location.href = "dashboard.html"; return }
        throw new Error(await readError(res))
    } catch (err) {
        status.textContent = err.message
        status.hidden = false
        button.disabled = false
        button.textContent = "Log in"
    }
})