import express from "express"
import { port } from "./config/env/env.config.js"
import { dbConnection } from "./config/db/dbConnection.js"
import authRouter from "./modules/auth/auth.controller.js"
import {categoryRouter} from "./modules/category/category.controller.js"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import path from "path"
import {caseRouter} from "./modules/case/case.controller.js"
import adminRouter from "./modules/admin/admin.controller.js"
import { authenticate, requireCsrfHeader } from "./middleware/auth.js"
import {dentistRouter} from "./modules/dentist/dentist.controller.js"
import contactRouter from "./modules/contact/contact.controller.js"
import cookieParser from "cookie-parser"
import { apiLimiter, contactLimiter, loginLimiter } from "./middleware/rateLimit.js"
import { uploadDir } from "./middleware/upload.js"
import { logger } from "./middleware/logger.js"

export const bootstrap = async () => {
    await dbConnection()
    const app = express()
    if (process.env.NODE_ENV === "production") app.set("trust proxy", 1)
        
    app.use(helmet({ contentSecurityPolicy: { directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        "frame-src": ["https://www.google.com"],
        "img-src": ["'self'", "data:", process.env.ASSET_BASE_URL].filter(Boolean),
    } } }))
    app.use(express.json({ limit: "100kb"}))
    app.use(logger)
    app.use(cookieParser())
    app.use("/uploads", express.static(uploadDir, { index: false, maxAge: "30d", immutable: true }))   
    app.use("/api", apiLimiter)
    app.use("/api/auth/login", loginLimiter)

    app.use("/api/admin", authenticate, requireCsrfHeader, adminRouter)
    app.use("/api/auth", authRouter)
    app.use("/api/dentist", dentistRouter)
    app.use("/api/contact", contactLimiter, contactRouter)
    app.use("/api/categories", categoryRouter)
    app.use("/api/cases", caseRouter)
    app.use("/api", (req, res) => res.status(404).json({ message: "Not found" }))

    app.use(express.static(path.join(import.meta.dirname, "../../frontend"))) // Node 20.11+
    app.use((req, res) => res.status(404).json({ message: "Not found" }))

    app.use((err, req, res, next) => {
        if (err.type === "entity.parse.failed") return res.status(400).json({ message: "Invalid JSON" })
        if (err.type === "entity.too.large") return res.status(413).json({ message: "Request too large" })
        if (err.name === "MulterError") return res.status(err.code === "LIMIT_FILE_SIZE" ? 413 : 400).json({ message: "Upload rejected" })
        if (err.code === 11000) return res.status(409).json({ message: "Already exists" })
        if (err.name === "CastError" || err.name === "ValidationError") return res.status(400).json({ message: "Invalid data" })
        console.error(err)
        const known = err.status && err.status < 500
        res.status(known ? err.status : 500).json({ message: known ? err.message : "Server error" })
    })

    app.listen(port, () => console.log(`Server is running on port ${port}`))
}
