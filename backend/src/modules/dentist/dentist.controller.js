import { Router } from "express";
import { getDentistProfile, updateDentistProfile } from "./dentist.service.js";
import { authenticate } from "../../middleware/auth.js";
import { validate } from "../../middleware/validation.js";
import { updateDentistSchema } from "./dentist.validation.js";


export const dentistRouter = Router()

dentistRouter.get("/", getDentistProfile)

export const adminDentistRouter = Router()

adminDentistRouter.patch("/", validate(updateDentistSchema), updateDentistProfile)

