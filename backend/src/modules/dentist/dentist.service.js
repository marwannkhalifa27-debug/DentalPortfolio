import { dentistModel } from "../../config/db/models/dentistProfile.model.js"

export const getDentistProfile = async (req, res) => {
    const profile = await dentistModel.findOne({ singleton: "main" })
    if (!profile) return res.status(404).json({ message: "Profile not found" })
    res.status(200).json(profile)
}