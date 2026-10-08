import { adminModel } from "../../config/db/models/admin.model.js"
import bcrypt from "bcrypt"
import { generateToken } from "../../utils/token.utils.js"

const finduserbyemail = async (email) => {
    return await adminModel.find({email}).select("+password")
}

export const register = async (req,res,next) => {
    try {
        const {fullName , username, email, password, phone, age, gender} = req.body
        const user = await finduserbyemail(email)
        if(user){
            return res.status(409).json({message: "This email is already registered"})
        }

        await adminModel.create({fullName , username, email, password, phone, age, gender})

        const token = generateToken(user)
        return res.status(201).json(
            {
                message: "Registered successfully",
                email,
                token
            }
        )
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
}

export const login = async (req,res,next) => {
    try {
        const { email , password } = req.body
        const user = await finduserbyemail(email)
        if(!user || !await bcrypt.compare(password, user.password)){
            return res.status(409).json({message: "This email isn't registered before"})
        }

        const token = generateToken(user)

        return res.status(200).json({
            message: "Login successfully",
            email: user.email,
            token: token
        })
    } catch (error) {
        return res.status(500).json({message: error.message})
    }
    
}