import multer from "multer"
import fs from "fs"
import path from "path"
import crypto from "crypto"


const EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp" }

const storage = multer.memoryStorage()

export const caseImageUpload = multer({
    storage,
    limits: { fileSize: 8 * 1024 * 1024, files: 7 },
    fileFilter: (req, file, cb) =>
        EXT[file.mimetype]
            ? cb(null, true)
            : cb(Object.assign(new Error("Only JPEG, PNG or WebP images are allowed"), { status: 400 })),
}).fields([
    { name: "beforeImage", maxCount: 1 },
    { name: "afterImage", maxCount: 1 },
    { name: "additionalImages", maxCount: 5 }
])
export const imageUrl = (file) => `/uploads/images/${file.filename}`
export const removeImages = (urls = []) =>
    Promise.all(urls.filter(Boolean).map((u) => fs.promises.rm(path.join(uploadDir, path.basename(u)), { force: true })))