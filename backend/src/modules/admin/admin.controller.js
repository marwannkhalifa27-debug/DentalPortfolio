import { Router } from "express";
import adminCategoryRouter from "../category/category.controller.js";


const adminRouter = Router()

adminRouter.use("/categories", adminCategoryRouter)

export default adminRouter