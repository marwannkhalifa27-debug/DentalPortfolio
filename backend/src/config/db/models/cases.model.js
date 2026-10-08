import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
    title: String,
    description: String,
    details: String,
    results: String,
    category: {
        type:mongoose.Types.ObjectId(),
        ref: "category"
    },
    treatment:{

    },
    beforeImage: String,
    afterImage: String,
    additionalImages: String,
    featured: Boolean
},
{
    timestamps: true
})

export const caseModel = mongoose.model("case", caseSchema)