import { Router } from "express";
import { addCategory, deleteCategory, getCategories, updateCategory } from "./category.service.js";
import { authenticate } from "../../middleware/auth.js";
import { validate, validateId } from "../../middleware/validation.js";
import { categorySchema, updateCategorySchema } from "./category.validation.js";

export const categoryRouter = Router()

categoryRouter.get("/", getCategories)

export const adminCategoryRouter = Router()

adminCategoryRouter.post("/", validate(categorySchema), addCategory)
adminCategoryRouter.patch("/:id", validateId, validate(updateCategorySchema), updateCategory)
adminCategoryRouter.delete("/:id", validateId, deleteCategory)