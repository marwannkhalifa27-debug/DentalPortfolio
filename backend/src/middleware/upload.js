import multer from "multer"
import fs from "fs"
import path from "path"

const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null, path.join(import.meta.dirname, "../../uploads/images"))
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
})

export const caseImageUpload = multer({ storage }).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 }
])

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } //5MB
})