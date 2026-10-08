import express from "express"
import { port } from "./config/env/env.config.js"

export const bootstrap = async () => {
    const app = express()

    app.get("/", (req,res,next) => {
        res.status(200).json("Hi")
    })

    app.listen(port, () => console.log(`Server is running on port ${port}`))
}