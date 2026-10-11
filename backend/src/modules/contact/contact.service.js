import { contactMessageModel } from "../../config/db/models/contactMessage.model.js"


export const sendMessage = async (req,res,next) => {
    const message = await contactMessageModel.create(req.body)
    return res.status(201).json(message)
}