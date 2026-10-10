import { adminModel } from "../../config/db/models/admin.model.js"
import bcrypt from "bcrypt"
import { generateToken } from "../../utils/token.utils.js"

const finduserbyemail = async (email) => {
    return await adminModel.findOne({email}).select("+password")
}
const dummyHash = await bcrypt.hash("not-a-real-password", 10)

export const login = async (req, res) => {
    const { email, password } = req.body
    const user = await adminModel.findOne({ email }).select("+password")
    const ok = await bcrypt.compare(password, user ? user.password : dummyHash)
    if (!user || !ok) {
        return res.status(401).json({ message: "Invalid email or password" })
    }
    return res.status(200).json({ message: "Login successfully", email: user.email, token: generateToken(user) })
}