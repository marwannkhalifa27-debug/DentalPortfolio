import { z } from "zod"

const text = (max) => z.string().trim().max(max)
const https = z.url().max(300).refine((u) => u.startsWith("https://"), "Must start with https://")
const optionalUrl = z.union([z.literal(""), https])          // "" clears the field
const phone = z.string().trim().max(40).regex(/^[+\d][\d\s()-]{6,}$/, "Invalid phone number")
const optionalPhone = z.union([z.literal(""), phone])


const currentYear = new Date().getFullYear()

export const dentistSchema = z.strictObject({
    name: text(120).min(2),
    title: text(200).min(2),
    intro: text(400),
    biography: z.array(text(2000).min(1)).max(6),
    university: text(160),
    graduationYear: z.number().int().min(1950).max(currentYear),
    experience: z.number().int().min(0).max(80),
    interests: text(255),
    specialization: z.array(text(80).min(1)).max(12),

    phone: optionalPhone,
    whatsapp: optionalPhone,
    email: z.union([z.literal(""), z.email().toLowerCase().max(190)]),

    socialLinks: z.strictObject({
        instagram: optionalUrl,
        facebook: optionalUrl,
        // future: tiktok, youtube, linkedin, x (in the model too)
    }).partial(),

    highlights: z.array(z.strictObject({ title: text(120).min(1), text: text(400).min(1) })).max(8),
    certifications: z.array(z.strictObject({
        title: text(160).min(1),
        issuer: text(160),
        year: z.number().int().min(1950).max(currentYear),
    })).max(20),
    timeline: z.array(z.strictObject({
        period: text(60).min(1),
        title: text(160).min(1),
        place: text(160),
        text: text(400),
    })).max(20),
})

export const updateDentistSchema = dentistSchema.partial()
    .refine((d) => Object.keys(d).length > 0, "Nothing to update")