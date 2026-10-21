import { contactMessageModel } from "../../config/db/models/contactMessage.model.js"
import { sendContactEmail } from "../../utils/email.utils.js"

export const sendMessage = async (req, res) => {
    const { name, phone, email, message } = req.body
    await contactMessageModel.create({ name, phone, email: email || undefined, message })

    sendContactEmail({ name, phone, email, message })
        .catch((err) => console.log("Email failed", err.message))
    res.status(201).json({ message: "Message sent successfully" })
}

export const getMessages = async (req,res) => {

    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || 20)))

    const [messages, total, unread] = await Promise.all([
        contactMessageModel.find().sort({ createdAt: -1 }).skip((page -1) * limit).limit(limit),
        contactMessageModel.countDocuments(),
        contactMessageModel.countDocuments({ isRead: false })
    ])

    return res.status(200).json({
        messages,
        unread,
        pagination: {
            page,
            limit,
            total,
            hasMore: page * limit < total,
        }
    })
}


export const updateMessageRead = async (req,res) => {
    const { id } = req.params
    const updatedMessage = await contactMessageModel
        .findByIdAndUpdate(id, { isRead: true }, { new: true })

    if(!updatedMessage) return res.status(404).json({ message:"Message not found!" })

    return res.status(200).json({ message: "Message has been updated", updatedMessage })
}


export const deleteMessage = async (req,res) => {
    const { id } = req.params 
    const deletedMessage = await contactMessageModel.findByIdAndDelete(id)

    if(!deletedMessage) return res.status(404).json({ message:"Message not found!" })

    res.status(204).end()
}
