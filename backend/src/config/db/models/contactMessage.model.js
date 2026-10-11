import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
    name, phone, email, message, isRead, createdAt  // maxlength on every field
})

export const contactMessageModel = mongoose.model("contact-message", contactMessageSchema)