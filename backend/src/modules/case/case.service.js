import { caseModel } from "../../config/db/models/cases.model.js"



export const getCases = async(req,res,next) => {
    try {
        const cases = await caseModel.find()
        return res.status(200).json(cases)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const getCaseById = async(req,res,next) => {
    try {
        const id = req.params.id
        if (!mongoose.isValidObjectId(id)) return res.status(404).json({ message: "Case not found" })
        const found = await caseModel.findOne({ _id: id, isPublished: true})
        return res.status(200).json(found)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}
