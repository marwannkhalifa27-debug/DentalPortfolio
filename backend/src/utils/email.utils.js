import nodemailer from "nodemailer"
import { smtp } from "../config/env/env.config.js"

const missing = Object.entries({
    SMTP_HOST: smtp.host,
    SMTP_USER: smtp.user,
    SMTP_PASS: smtp.pass,
    MAIL_TO: smtp.to,
}).filter(([, value]) => !value).map(([name]) => name)

const transporter = missing.length === 0
    ? nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,
        auth: { user: smtp.user, pass: smtp.pass },
        tls: { rejectUnauthorized: process.env.NODE_ENV === "production" },
    })
    : null

if (transporter) {
    transporter.verify()
        .then(() => console.log("Email server is ready"))
        .catch((err) => console.log("Email verify failed:", err.code, err.message))
} else {
    console.log("Email is not configured. Missing:", missing.join(", "))
}

export async function sendContactEmail({ name, phone, email, message }) {
    if (!transporter) {
        console.log("Email is not configured, skipping notification")
        return
    }

    await transporter.sendMail({
        from: `"Clinic website" <${smtp.user}>`,
        to: smtp.to,
        replyTo: email || undefined,
        subject: `New message from ${name.replace(/\s+/g, " ")}`,
        text: [
            `Name: ${name}`,
            `Phone: ${phone}`,
            `Email: ${email || "not provided"}`,
            "",
            message,
        ].join("\n"),
    })
}