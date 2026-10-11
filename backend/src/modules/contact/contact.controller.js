import { Router } from "express";
import { sendMessage } from "./contact.service.js";
import { validate } from "../../middleware/validation.js";
import { contactSchema } from "./contact.validation.js";


const contactRouter = Router()

contactRouter.post("/", validate(contactSchema), sendMessage)

export default contactRouter