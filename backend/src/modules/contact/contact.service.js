import { contactMessageModel } from "../../config/db/models/contactMessage.model.js"

export const sendMessage = async (req, res) => {
    const { name, phone, email, message } = req.body
    await contactMessageModel.create({ name, phone, email: email || undefined, message })
    res.status(201).json({ message: "Message sent successfully" })
}

export const getMessages = async (req,res) => {

    const page = Math.max(1, Number(req.query.page) || 1)
    const requestedLimit = Number(req.query.limit || 20)
    const limit = Math.min(100, Math.max(1, requestedLimit))

    const skip = (page - 1) * limit

    const messages = await contactMessageModel
        .find()
        .sort({ createdAt:-1 })
        .skip(skip)
        .limit(limit)
    return res.status(200).json({
        messages,
        pagination: {
            page: 1,
            limit: 20,
            hasMore: true,
            nextPage: 2
        }
    })
}


export const updateMessageRead = async (req,res) => {
    const { id } = req.params
    const updatedMessage = await contactMessageModel
        .findByIdAndUpdate(id, { isRead: true }, { new: true, runValidators: true })

    if(!updatedMessage) return res.status(404).json({ message:"Message not found!" })

    return res.status(201).json({ message: "Message has been updated", updatedMessage })
}


export const deleteMessage = async (req,res) => {
    const { id } = req.params 
    const deletedMessage = await contactMessageModel.findByIdAndDelete(id)

    if(!deletedMessage) return res.status(404).json({ message:"Message not found!" })

    return res.status(200).json({ message: "Message has been deleted", deletedMessage })
}
