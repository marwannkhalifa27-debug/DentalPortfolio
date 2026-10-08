import express from "express"
import { port } from "./config/env/env.config.js"
import { dbConnection } from "./config/db/dbConnection.js"
import authRouter from "./modules/auth/auth.controller.js"

export const bootstrap = async () => {
    await dbConnection()
    const app = express()
    app.use(express.json())
    app.use(cors)

    app.use("/auth", authRouter)
    app.get("/", (req,res,next) => {
        res.status(200).json("Hi")
    })

    app.listen(port, () => console.log(`Server is running on port ${port}`))
}
