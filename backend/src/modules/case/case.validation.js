import { z } from "zod"
const text = (max) => z.string().trim().max(max)

export const caseSchema = z.strictObject({
    title: text(120).min(3),
    description: text(500).min(10),
    details: text(5000).optional(),
    results: text(2000).optional(),
    category: z.string().regex(/^[a-f\d]{24}$/i),
    treatment: z.strictObject({
        procedure: text(120).optional(), duration: text(80).optional(), visits: text(80).optional(),
    }).optional(),
    featured: z.stringbool().optional(),
    isPublished: z.stringbool().optional(),
    patientConsent: z.stringbool().optional(),
})
export const updateCaseSchema = caseSchema.partial().refine((d) => Object.keys(d).length > 0, "Nothing to update")