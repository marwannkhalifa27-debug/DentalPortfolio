import { Router } from "express";
import { getInfo, login, logout } from "./auth.service.js";
import { validate } from "../../middleware/validation.js";
import { loginSchema } from "./auth.validation.js";
import { authenticate, requireCsrfHeader } from "../../middleware/auth.js";


const authRouter = Router()

authRouter.post("/login",validate(loginSchema), login)
authRouter.post("/logout", requireCsrfHeader, logout)
authRouter.get("/me", authenticate, getInfo)
export default authRouter