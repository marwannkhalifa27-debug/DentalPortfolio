import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }, 
    slug: {
        type: String,
        required: true,
        unique: true
    }
},
{
    timestamps: true,
    toJSON: { virtuals: true, versionKey: false, transform: (_, ret) => { delete ret._id; return ret } },
})

export const categoryModel = mongoose.model("category", categorySchema)