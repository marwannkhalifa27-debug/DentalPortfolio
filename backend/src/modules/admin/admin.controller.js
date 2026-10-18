import { Router } from "express";
import { adminCategoryRouter } from "../category/category.controller.js";
import { adminCaseRouter } from "../case/case.controller.js";
import { adminDentistRouter } from "../dentist/dentist.controller.js";
import { adminContactRouter } from "../contact/contact.controller.js";

const adminRouter = Router()

adminRouter.use("/categories", adminCategoryRouter)
adminRouter.use("/cases", adminCaseRouter)
adminRouter.use("/dentist", adminDentistRouter)
adminRouter.use("/messages", adminContactRouter)

export default adminRouter