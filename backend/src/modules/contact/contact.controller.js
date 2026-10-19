import { Router } from "express";
import { deleteMessage, getMessages, sendMessage, updateMessageRead } from "./contact.service.js";
import { validate, validateId } from "../../middleware/validation.js";
import { contactSchema } from "./contact.validation.js";


export const contactRouter = Router()

contactRouter.post("/", validate(contactSchema), sendMessage)

export const adminContactRouter = Router()

adminContactRouter.get("/", getMessages)
adminContactRouter.patch("/:id", validateId, updateMessageRead)
adminContactRouter.delete("/:id", validateId, deleteMessage)