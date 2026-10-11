import mongoose from "mongoose"

const contactMessageSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 40 },
    email: { type: String, trim: true, lowercase: true, maxlength: 190 },
    message: { type: String, required: true, trim: true, minlength: 5, maxlength: 2000 },
    isRead: { type: Boolean, default: false },
}, { timestamps: true })

contactMessageSchema.index({ createdAt: -1 })

export const contactMessageModel = mongoose.model("contactMessage", contactMessageSchema)