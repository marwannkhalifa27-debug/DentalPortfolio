import { Router } from "express";
import { login } from "./auth.service.js";
import { validate } from "../../middleware/validation.js";
import { loginSchema } from "./auth.validation.js";


const authRouter = Router()

authRouter.post("/login",validate(loginSchema), login)

export default authRouter