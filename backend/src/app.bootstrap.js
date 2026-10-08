import express from "express"
import { port } from "./config/env/env.config.js"
import { dbConnection } from "./config/db/dbConnection.js"
import authRouter from "./modules/auth/auth.controller.js"
import categoryRouter from "./modules/category/category.controller.js"
import cors from "cors"
import helmet from "helmet"
import rateLimit from "express-rate-limit"

export const bootstrap = async () => {
    await dbConnection()
    const app = express()
    app.use(express.json())
    app.use(cors(), helmet(), rateLimit())

    app.use("/api/auth", authRouter)
    app.use("/api/categories", categoryRouter)
    app.use(express.static(path.join(import.meta.dirname, "../../frontend"))) // Node 20.11+
    app.use((req, res) => res.status(404).json({ message: "Not found" }))
    app.use((err, req, res, next) => {
        console.error(err)
        res.status(err.status ?? 500).json({ message: err.status ? err.message : "Server error" })
    })

    app.listen(port, () => console.log(`Server is running on port ${port}`))
}
