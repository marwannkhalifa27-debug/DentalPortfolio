import { z } from "zod";

export const contactSchema = z.object({
    name: z.string().trim().min(2).max(120),
    phone: z.string().trim().max(40).regex(/^[+\d][\d\s()-]{6,}$/),
    email: z.union([z.email().toLowerCase().max(190), z.literal("")]).optional(),
    message: z.string().trim().min(5).max(2000),
})