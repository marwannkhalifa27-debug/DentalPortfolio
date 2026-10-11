import { Router } from "express";
import { getDentistProfile } from "./dentist.service.js";


const dentistRouter = Router()

dentistRouter.get("/", getDentistProfile)

export default dentistRouter