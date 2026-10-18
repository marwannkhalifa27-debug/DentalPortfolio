import mongoose from "mongoose"
import fs from "fs"

export const validate = (schema) => {
    return (req,res,next) => {
        const result = schema.safeParse(req.body)
        if(!result.success){
            Object.values(req.files ?? {})  
                .flat()
                .forEach((f) => fs.promises.rm(f.path, { force: true }))
            return res.status(400).json(
                {
                    message: "Validation failed",
                    errors: result.error.issues.map(issue => ({
                        field: issue.path.join("."),
                        message: issue.message
                    }))
                }
            )
        }
        req.body = result.data
        next()
    }
}

export const validateId = (req, res, next) =>
    mongoose.isValidObjectId(req.params.id) ? next() : res.status(404).json({ message: "Not found" })

