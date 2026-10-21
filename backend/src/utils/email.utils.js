import nodemailer from "nodemailer";
import { smtp } from "../config/env/env.config.js";


const enabled = smtp.host && smtp.user && smtp.pass && smtp.to

const transporter = enabled
    ? nodemailer.createTransport({
        host: smtp.host,
        port: smtp.port,
        secure: smtp.port === 465,   // 465 = TLS from the start, 587 = upgrades to TLS
        auth: { user: smtp.user, pass: smtp.pass },
    })
    : null

try {
    await transporter.verify()
    console.log("Server is ready to recieve messages")
} catch (error) {
    console.log("Failed to verify", error)
}

export async function sendContactEmail({ name, phone, email, message }) {
    if(!transporter){
        console.log("Email is not configured")
        return
    }

    await transporter.sendMail({
        from: `Clinic website <${smtp.user}>`,
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