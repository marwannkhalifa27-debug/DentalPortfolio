import mongoose from "mongoose"
import { caseModel } from "../../config/db/models/cases.model.js"
import { categoryModel } from "../../config/db/models/categories.model.js"
import { imageUrl, removeImages } from "../../middleware/upload.js"

const bad = (message) => Object.assign(new Error(message), { status: 400})
const pickFiles = (f = {}) => ({
    before: f.beforeImage?.[0] && imageUrl(f.beforeImage[0]),
    after: f.afterImage?.[0] && imageUrl(f.afterImage[0]),
    extra: (f.additionalImages ?? []).map(imageUrl),
})
const assertCategory = async (id) => {
    if (id && !(await categoryModel.exists({ _id: id}))) throw bad("Category does not exist")
}
export const listAllCases = async (req,res) => {
    res.json(await caseModel.find().populate("category", "name slug").sort({ createdAt: -1}))
}

export const getAnyCase = async (req,res) => {
    const found = await caseModel.findById(req.params.id).populate("category", "name slug")
    if(!found) return res.status(404).json({ message: "Case not found" })
    res.json(found)
}

export const getCases = async (req, res) => {
    const { category, featured } = req.query

    const pageNumber = parseInt(req.query.page) || 1
    const limitNumber = Math.min(parseInt(req.query.limit) || 50, 50)

    const filter = { isPublished: true }
    if (featured === "true") filter.featured = true
    if (category) {
        const cat = await categoryModel.findOne({ slug: String(category) })
        if (!cat) return res.status(200).json({
            success: true,
            data: [],
            pagination: { totalCases: 0, totalPages: 0, currentPage: pageNumber }
        })
        filter.category = cat._id
    }

    const totalCases = await caseModel.countDocuments(filter)
    const totalPages = Math.ceil(totalCases / limitNumber)

    const cases = await caseModel.find(filter)
        .select("-patientConsent")
        .populate("category", "name slug")
        .sort({ createdAt: -1 })
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
    return res.status(200).json({
        success: true,
        data: cases,
        pagination: {
            totalCases,
            totalPages,
            currentPage: pageNumber,
            hasNextPage: pageNumber < totalPages,
            hasPrevPage: pageNumber > 1
        }
    })
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

export const createCase = async (req,res) => {

    const { before, after, extra } = pickFiles(req.files)
    const uploaded = [before, after, ...extra]
    
    try {
        if(!before || !after) throw bad("Before and after images are required")

        await assertCategory(req.body.category)
        const doc = await caseModel.create({
            ...req.body,
            beforeImage: before,
            afterImage: after,
            additionalImages: extra
        })

        return res.status(201).json({message: "Case created", case: doc})
    } catch (error) {
        await removeImages(uploaded)
        throw err
    }
}
export const updateCase = async (req, res) => {
    const { before, after, extra } = pickFiles(req.files)
    const fresh = [before, after, ...extra]
    try {
        const doc = await caseModel.findById(req.params.id)
        if (!doc) { await removeImages(fresh); return res.status(404).json({ message: "Case not found" }) }
        if (!Object.keys(req.body).length && !fresh.some(Boolean)) throw bad("Nothing to update")
        await assertCategory(req.body.category)

        const old = []
        if (before) { old.push(doc.beforeImage); doc.beforeImage = before }
        if (after) { old.push(doc.afterImage); doc.afterImage = after }
        if (extra.length) { old.push(...doc.additionalImages); doc.additionalImages = extra } // replaces the set
        doc.set(req.body)
        await doc.save()            // save(), not findByIdAndUpdate, so the consent rule runs
        await removeImages(old)
        res.json(doc)
    } catch (err) {
        await removeImages(fresh)
        throw err
    }
}

export const deleteCase = async (req, res) => {
    const doc = await caseModel.findByIdAndDelete(req.params.id)
    if (!doc) return res.status(404).json({ message: "Case not found" })
    await removeImages([doc.beforeImage, doc.afterImage, ...doc.additionalImages])
    res.status(204).end()
}