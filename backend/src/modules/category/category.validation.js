import { z } from "zod"

export const categorySchema = z.object({
    name: z.string().trim().min(2).max(40),
    slug: z.string().trim().toLowerCase().max(40)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only"),
})

export const updateCategorySchema = categorySchema
    .partial()
    .refine((data) => Object.keys(data).length > 0, "Nothing to update")