import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: String, 
    slug: {
        type: String,
        unique: true
    }
},
{
    timestamps: true
})

export const categoryModel = mongoose.model("category", categorySchema)