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
        const caseById = await caseModel.findById(id)
        return res.status(200).json(caseById)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}
