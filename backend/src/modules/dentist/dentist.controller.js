import { Router } from "express";
import { getDentistProfile, updateDentistPhoto, updateDentistProfile } from "./dentist.service.js";
import { authenticate } from "../../middleware/auth.js";
import { validate } from "../../middleware/validation.js";
import { updateDentistSchema } from "./dentist.validation.js";
import { profileImageUpload } from "../../middleware/upload.js";


export const dentistRouter = Router()

dentistRouter.get("/", getDentistProfile)

export const adminDentistRouter = Router()

adminDentistRouter.patch("/", validate(updateDentistSchema), updateDentistProfile)
adminDentistRouter.patch("/photo", profileImageUpload, updateDentistPhoto)
