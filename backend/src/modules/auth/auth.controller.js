import { Router } from "express";
import { getInfo, login } from "./auth.service.js";
import { validate } from "../../middleware/validation.js";
import { loginSchema } from "./auth.validation.js";
import { authenticate } from "../../middleware/auth.js";


const authRouter = Router()

authRouter.post("/login",validate(loginSchema), login)
authRouter.get("/me", authenticate, getInfo)

export default authRouter