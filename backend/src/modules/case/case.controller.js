import { Router } from "express";
import { createCase, getCaseById, getCases } from "./case.service.js";
import { authenticate } from "../../middleware/auth.js";
import { caseImageUpload } from "../../middleware/upload.js";


const caseRouter = Router()
const adminCaseRouter = Router()



caseRouter.get("/", getCases)
caseRouter.get("/:id", getCaseById)

adminCaseRouter.use(authenticate)

adminCaseRouter.post("/", caseImageUpload, createCase);

// adminCaseRouter.patch("/:id", caseImageUpload, updateCase);
// adminCaseRouter.delete("/:id", deleteCase);

export default { caseRouter , adminCaseRouter }