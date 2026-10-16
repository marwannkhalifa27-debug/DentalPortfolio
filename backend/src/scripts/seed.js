import mongoose from "mongoose";
import { casesMock } from "../../../frontend/js/data/cases.js";
import { categoriesMock } from "../../../frontend/js/data/categories.js";
import { dentistMock } from "../../../frontend/js/data/dentist.js";
import { dbConnection } from "../config/db/dbConnection.js";
import { caseModel } from "../config/db/models/cases.model.js";
import { categoryModel } from "../config/db/models/categories.model.js";
import { dentistModel } from "../config/db/models/dentistProfile.model.js";
import "dotenv/config"

await dbConnection()

if (process.env.NODE_ENV === "production") { console.error("Refusing to seed in production"); process.exit(1) }

for(const c of categoriesMock){
    await categoryModel.updateOne({ slug: c.slug }, { $set: c }, { upsert: true })
}

await dentistModel.updateOne({ singleton: "main" }, { $set: dentistMock }, { upsert: true })

if (!(await caseModel.exists({}))) {
    const ids = new Map((await categoryModel.find()).map((c) => [c.slug, c._id]))
    for (const { id, createdAt, category, ...rest } of casesMock) {
        await caseModel.create({ ...rest,createdAt: new Date(createdAt), category: ids.get(category), isPublished: true, patientConsent: true })
    }
}
console.log("Seeded")
await mongoose.disconnect()