import { Router } from "express";
import { getCaseById, getCases } from "./case.service.js";


const caseRouter = Router()

caseRouter.get("/", getCases)
caseRouter.get("/:id", getCaseById)


export default caseRouter