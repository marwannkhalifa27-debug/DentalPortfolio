import { Router } from "express";
import { sendMessage } from "./contact.service.js";


const contactRouter = Router()

contactRouter.post("/contact", sendMessage)

export default contactRouter