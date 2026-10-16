import { Router } from "express";
import { createCase, deleteCase, getCaseById, getCases, updateCase } from "./case.service.js";
import { authenticate } from "../../middleware/auth.js";
import { caseImageUpload } from "../../middleware/upload.js";
import { validate } from "../../middleware/validation.js";
import { updateCaseSchema } from "./case.validation.js";


export const caseRouter = Router()

caseRouter.get("/", getCases)
caseRouter.get("/:id", getCaseById)


export const adminCaseRouter = Router()

adminCaseRouter.post("/", caseImageUpload, createCase);
adminCaseRouter.patch("/:id", caseImageUpload, validate(updateCaseSchema), updateCase);
adminCaseRouter.delete("/:id", deleteCase);