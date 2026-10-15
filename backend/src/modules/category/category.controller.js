import { Router } from "express";
import { addCategory, deleteCategory, getCategories, updateCategory } from "./category.service.js";
import { authenticate } from "../../middleware/auth.js";
import { validate, validateId } from "../../middleware/validation.js";
import { categorySchema, updateCategorySchema } from "./category.validation.js";


const adminCategoryRouter = Router()

categoryRouter.post("/", validate(categorySchema), addCategory)
categoryRouter.patch("/:id", validateId, validate(updateCategorySchema), updateCategory)
categoryRouter.delete("/:id", validateId, deleteCategory)

export default adminCategoryRouter