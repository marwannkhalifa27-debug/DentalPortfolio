import mongoose from "mongoose";
import bcrypt from "bcrypt"

const adminSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        min: 5,
        max: 20
    },
    username: {
        type: String,
        min: 8,
        max: 20,
        trim: true,
        lowercase: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        max: 72
    },
    phone: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        min: 18,
        max:60
    },
    gender: {
        type: String,
        enum: ["male", "female"]
    }
},
{ 
    timestamps: true
})

adminSchema.pre("save", async function() {
    if(!this.isModified("password")) return 
    this.password = await bcrypt.hash(this.password, 10)
})

adminSchema.post("save", function(doc) {
    console.log(`New user created: ${doc.email}`)
})

export const adminModel = mongoose.model("admin", adminSchema)