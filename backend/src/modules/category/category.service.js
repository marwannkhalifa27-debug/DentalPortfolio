import { categoryModel } from "../../config/db/models/categories.model.js"


export const getCategories = async (req,res,next) => {
    try {
        const categories = await categoryModel.find()
        return res.status(200).json(categories)
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const addCategories = async (req,res,next) => {
    try {   
        const { name , slug } = req.body
        const category = await categoryModel.create({ name , slug })
        return res.status(201).json({ 
            message: "Category added successfully",
            category
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

