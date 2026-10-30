import { dentistModel } from "../../config/db/models/dentistProfile.model.js"
import { removeImages, uploadProfileImage } from "../../middleware/upload.js"

export const getDentistProfile = async (req, res) => {
    const profile = await dentistModel.findOne({ singleton: "main" })
    if (!profile) return res.status(404).json({ message: "Profile not found" })
    res.status(200).json(profile)
}

export const updateDentistProfile = async (req,res) => {
    const { socialLinks, ...data} = req.body
    let profile = await dentistModel.findOne({ singleton: "main" })

    if (!profile) {
        if (!data.name || !data.title)
            return res.status(400).json({ message: "name and title are required to create the profile" })
        profile = await dentistModel.create({ ...data, socialLinks })
        return res.status(201).json(profile)
    }

    profile.set(data)
    for (const [k, v] of Object.entries(socialLinks ?? {})) profile.set(`socialLinks.${k}`, v)
    await profile.save()
    res.json(profile)
}
export const updateDentistPhoto = async (req, res) => {
    if (!req.file) return res.status(400).json({ message: "Photo file is required" })
    const profile = await dentistModel.findOne({ singleton: "main" })
    if (!profile) return res.status(404).json({ message: "Save the profile details first" })

    const newKey = await uploadProfileImage(req.file)
    try {
        const oldKey = profile.profileImage
        profile.profileImage = newKey
        await profile.save()
        if (oldKey) await removeImages([oldKey])
        res.json({ profileImage: newKey })
    } catch (err) {
        await removeImages([newKey])
        throw err
    }
}