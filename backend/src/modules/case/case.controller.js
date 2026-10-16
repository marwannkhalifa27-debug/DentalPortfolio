import { Router } from "express";
import { createCase, deleteCase, getAnyCase, getCaseById, getCases, listAllCases, updateCase } from "./case.service.js";
import { authenticate } from "../../middleware/auth.js";
import { caseImageUpload } from "../../middleware/upload.js";
import { validate, validateId } from "../../middleware/validation.js";
import { caseSchema, updateCaseSchema } from "./case.validation.js";


export const caseRouter = Router()

caseRouter.get("/", getCases)
caseRouter.get("/:id", getCaseById)


export const adminCaseRouter = Router()

adminCaseRouter.get("/", listAllCases)
adminCaseRouter.get("/:id", validateId, getAnyCase)
adminCaseRouter.post("/", caseImageUpload, validate(caseSchema), createCase);
adminCaseRouter.patch("/:id", validateId, caseImageUpload, validate(updateCaseSchema), updateCase);
adminCaseRouter.delete("/:id", validateId, deleteCase);