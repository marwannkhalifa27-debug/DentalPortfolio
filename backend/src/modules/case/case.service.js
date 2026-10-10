import mongoose from "mongoose"
import { caseModel } from "../../config/db/models/cases.model.js"
import { categoryModel } from "../../config/db/models/categories.model.js"

export const getCases = async (req, res) => {
    const { category, featured, limit } = req.query
    const filter = { isPublished: true }
    if (featured === "true") filter.featured = true
    if (category) {
        const cat = await categoryModel.findOne({ slug: String(category) })
        if (!cat) return res.status(200).json([])
        filter.category = cat._id
    }
    const cases = await caseModel.find(filter)
        .select("-patientConsent")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .limit(Math.min(Number(limit) || 50, 50))
    return res.status(200).json(cases)
}

export const getCaseById = async (req, res) => {
    const { id } = req.params
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "Case not found" })
    const found = await caseModel.findOne({ _id: id, isPublished: true })
        .select("-patientConsent")
        .populate("category", "name slug")
    if (!found) return res.status(404).json({ message: "Case not found" })
    return res.status(200).json(found)
}