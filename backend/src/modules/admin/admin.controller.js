import { Router } from "express";
import adminCategoryRouter from "../category/category.controller.js";
import adminCaseRouter from "../case/case.controller.js";



const adminRouter = Router()

adminRouter.use("/categories", adminCategoryRouter)
adminRouter.use("/cases", adminCaseRouter)

export default adminRouter