import { Router } from "express";
import { addCategory, deleteCategory, getCategories, updateCategory } from "./category.service.js";
import { authenticate } from "../../middleware/auth.js";
import { validate, validateId } from "../../middleware/validation.js";
import { categorySchema, updateCategorySchema } from "./category.validation.js";


const categoryRouter = Router()

categoryRouter.get("/", getCategories)
categoryRouter.post("/",authenticate, validate(categorySchema), addCategory)
categoryRouter.patch("/:id",authenticate, validateId, validate(updateCategorySchema), updateCategory)
categoryRouter.delete("/:id",authenticate, validateId, deleteCategory)

export default categoryRouter