import { adminModel } from "../../config/db/models/admin.model.js"
import bcrypt from "bcrypt"

const finduserbyemail = async (email) => {
    await adminModel.find({email})
}

export const register = async (req,res,next) => {
    const {fullName , username, email, password, phone, age, gender} = req.body
    const exists = await finduserbyemail(email)
    if(exists){
        return res.status(409).json({message: "This email is already registered"})
    }

    const user = await adminModel.create({fullName , username, email, password, phone, age, gender})

    return res.status(201).json(
        {
            message: "Registered successfully",
            email
        }
    )
}

export const login = async (req,res,next) => {
    const { email , password } = req.body
    const user = await finduserbyemail(email)
    if(!user || !await bcrypt.compare(password, user.password)){
        return res.status(409).json({message: "This email isn't registered before"})
    }



    return res.status(200).json({message: "Login successfully"}) //Will add token later
}