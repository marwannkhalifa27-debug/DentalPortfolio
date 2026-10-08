import { Router } from "express";
import { addCategories, getCategories } from "./category.service.js";
import { authenticate } from "../../middleware/auth.js";
import { validate } from "../../middleware/validation.js";
import { categorySchema } from "./category.validation.js";


const categoryRouter = Router()

categoryRouter.get("/", getCategories)
categoryRouter.post("/",authenticate, validate(categorySchema), addCategories)

export default categoryRouter