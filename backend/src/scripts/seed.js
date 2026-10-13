import { casesMock } from "../../../frontend/js/data/cases.js";
import { categoriesMock } from "../../../frontend/js/data/categories.js";
import { dentistMock } from "../../../frontend/js/data/dentist.js";
import { dbConnection } from "../config/db/dbConnection.js";
import { caseModel } from "../config/db/models/cases.model.js";
import { categoryModel } from "../config/db/models/categories.model.js";
import { dentistModel } from "../config/db/models/dentistProfile.model.js";

await dbConnection()

for(const c of categoriesMock){
    await categoryModel.updateOne({ slug: c.clug }, { $set: c }, { upsert: true })
}

await dentistModel.updateOne({ singleton: "main" }, { $set: dentistMock }, { upsert: true })

if (!(await caseModel.exists({}))) {
    const ids = new Map((await categoryModel.find()).map((c) => [c.slug, c._id]))
    for (const { id, createdAt, category, ...rest } of casesMock) {
        await caseModel.create({ ...rest, category: ids.get(category), isPublished: true, patientConsent: true })
    }
}
console.log("Seeded")
await mongoose.disconnect()