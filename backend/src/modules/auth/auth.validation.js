import { z } from "zod"

export const registerSchema = z.object({
    fullName: z.string().min(5).max(20) ,
    username: z.string().min(8).max(20).trim().toLowerCase(),
    email: z.email().trim().toLowerCase(), 
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string(), 
    age: z.number().min(18).max(60), 
    gender: z.enum(["male", "female"]).optional()
})

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});