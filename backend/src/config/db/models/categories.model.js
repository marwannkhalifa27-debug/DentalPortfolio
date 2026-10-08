import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: String, 
    slug: {
        type: String,
        unique: true
    }
},
{
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false, transform: (_, ret) => { delete ret._id; return ret } },
})

export const categoryModel = mongoose.model("category", categorySchema)