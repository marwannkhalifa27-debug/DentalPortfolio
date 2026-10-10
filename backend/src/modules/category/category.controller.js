import { Router } from "express";
import { addCategories, deleteCategory, getCategories, updateCategory } from "./category.service.js";
import { authenticate } from "../../middleware/auth.js";
import { validate, validateId } from "../../middleware/validation.js";
import { categorySchema } from "./category.validation.js";


const categoryRouter = Router()

categoryRouter.get("/", getCategories)
categoryRouter.post("/",authenticate, validate(categorySchema), addCategories)
categoryRouter.patch("/:id",authenticate, validate(categorySchema), validateId(), updateCategory)
categoryRouter.delete("/:id",authenticate,validateId(), deleteCategory)



export default categoryRouter