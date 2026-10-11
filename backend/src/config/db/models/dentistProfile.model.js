import mongoose from "mongoose"

const dentistSchema = new mongoose.Schema({
  singleton: { type: String, default: "main", unique: true },   // upsert on this key
  name, title, intro, biography: [String], university, graduationYear, experienceYears,
  interests, phone, whatsapp, email, address, mapEmbedUrl, profileImage,
  specialization: [String],
  highlights: [{ title, text }],
  certifications: [{ title, issuer, year }],
  timeline: [{ period, title, place, text }],
  workingHours: [{ days, hours }],
  socialLinks: { instagram, facebook }
}, {
    timestamps: true
})

export const dentistModel = mongoose.model("dentist", dentistSchema)