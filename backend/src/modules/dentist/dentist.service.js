import { dentistModel } from "../../config/db/models/dentistProfile.model.js"


export const getDentistProfile = async (req,res,next) => {
    const profile = await dentistModel.findOne({ singleton })
    return res.status(200).json(profile)
}