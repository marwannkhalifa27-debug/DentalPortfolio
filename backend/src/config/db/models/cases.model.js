import mongoose from "mongoose";

const caseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 500 },
  details: String,
  results: String,
  category: { type: mongoose.Schema.Types.ObjectId, ref: "category", required: true },
  treatment: { procedure: String, duration: String, visits: String },
  beforeImage: { type: String, required: true },
  afterImage: { type: String, required: true },
  additionalImages: { type: [String], default: [] },
  featured: { type: Boolean, default: false },
  isPublished: { type: Boolean, default: false },
  patientConsent: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true, versionKey: false, transform: (_, ret) => { delete ret._id; return ret } },
})

export const caseModel = mongoose.model("case", caseSchema)