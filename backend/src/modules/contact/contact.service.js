import { contactMessageModel } from "../../config/db/models/contactMessage.model.js"

export const sendMessage = async (req, res) => {
    const { name, phone, email, message } = req.body
    await contactMessageModel.create({ name, phone, email: email || undefined, message })
    res.status(201).json({ message: "Message sent successfully" })
}