import mongoose from "mongoose";
import bcrypt from "bcrypt"

const adminSchema = new mongoose.Schema({
    fullName: { type: String, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false }
}, { timestamps: true })

adminSchema.pre("save", async function() {
    if(!this.isModified("password")) return 
    this.password = await bcrypt.hash(this.password, 10)
})

adminSchema.post("save", function(doc) {
    console.log(`New user created: ${doc.email}`)
})

export const adminModel = mongoose.model("admin", adminSchema)