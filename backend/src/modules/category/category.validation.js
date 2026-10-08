import { z } from "zod";


export const categorySchema = z.object({
    name: z.string(),
    slug: z.string()
})