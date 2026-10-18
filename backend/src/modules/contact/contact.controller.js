import { Router } from "express";
import { deleteMessage, getMessages, sendMessage, updateMessageRead } from "./contact.service.js";
import { validate } from "../../middleware/validation.js";
import { contactSchema } from "./contact.validation.js";
import { authenticate } from "../../middleware/auth.js";


export const contactRouter = Router()

contactRouter.post("/", validate(contactSchema), sendMessage)

export const adminContactRouter = Router()

adminContactRouter.get("/messages", authenticate, getMessages)
adminContactRouter.patch("/:id", authenticate, updateMessageRead)
adminContactRouter.delete("/:id", authenticate, deleteMessage)