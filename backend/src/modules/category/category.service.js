import { categoryModel } from "../../config/db/models/categories.model.js"


export const getCategories = async (req,res,next) => {
    try {
        const categories = await categoryModel.find().sort({ name: 1})
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

export const updateCategory = async (req,res,next) => {
    try {
        const category = await categoryModel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        return res.status(200).json({ 
                message: "Category updated successfully",
                category
            })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}
export const deleteCategory = async (req, res) => {
    if (await caseModel.exists({ category: req.params.id })) {
        return res.status(409).json({ message: "Category is used by existing cases" })
    }
    const category = await categoryModel.findByIdAndDelete(req.params.id)
    if (!category) return res.status(404).json({ message: "Category not found" })
    res.status(204).end()
}