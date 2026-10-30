import mongoose from "mongoose"

const str = (max) => ({ type: String, trim: true, maxlength: max })
const sub = (fields) => new mongoose.Schema(fields, { _id: false })

const dentistSchema = new mongoose.Schema({
    singleton: { type: String, default: "main", unique: true, immutable: true },
    name: { ...str(120), required: true },
    title: { ...str(200), required: true },
    intro: str(400),
    biography: [str(2000)],
    university: str(160),
    graduationYear: { type: Number, min: 1950, max: 2100 },
    experience: { type: Number, min: 0, max: 80 },
    interests: str(255),
    phone: str(40),
    whatsapp: str(40),
    email: { ...str(190), lowercase: true },
    profileImage: str(255),
    specialization: [str(80)],
    highlights: [sub({ title: str(120), text: str(400) })],
    certifications: [sub({ title: str(160), issuer: str(160), year: Number })],
    timeline: [sub({ period: str(60), title: str(160), place: str(160), text: str(400) })],
    socialLinks: { instagram: str(300), facebook: str(300) },
}, {
    timestamps: true,
    toJSON: { versionKey: false, transform: (_, ret) => { delete ret._id; delete ret.singleton; return ret } },
})

export const dentistModel = mongoose.model("dentist", dentistSchema)