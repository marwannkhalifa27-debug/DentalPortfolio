import { Router } from "express";
import { addCategories, getCategories } from "./category.service.js";
import { authenticate } from "../../middleware/auth.js";


const categoryRouter = Router()

categoryRouter.get("/", getCategories)
categoryRouter.post("/",authenticate, addCategories)

export default categoryRouter