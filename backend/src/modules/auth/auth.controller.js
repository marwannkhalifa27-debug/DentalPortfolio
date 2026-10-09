import { Router } from "express";
import { login, register } from "./auth.service.js";
import { validate } from "../../middleware/validation.js";
import { loginSchema, registerSchema } from "./auth.validation.js";


const authRouter = Router()

authRouter.post("/login",validate(loginSchema), login)

export default authRouter