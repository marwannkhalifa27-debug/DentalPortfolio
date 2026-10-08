import Z from "zod"

export const registerSchema = Z.object({
    fullName: Z.string().minLength(5).maxLength(20) ,
    username: Z.string().minLength(8).maxLength(20).trim().toLowerCase(),
    email: Z.email().trim().toLowerCase(), 
    password: Z.string().min(8, "Password must be at least 8 characters"),
    phone: Z.number(), 
    age: Z.number().min(18).max(60), 
    gender: Z.enum(["male", "female"]).optional()
})

export const loginSchema = Z.object({
  email: Z.email().toLowerCase(),
  password: Z.string().min(8, "Password must be at least 8 characters"),
});