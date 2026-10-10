import { verifyToken } from "../utils/token.utils.js"


export const authenticate = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith("Bearer ")){
            return res.status(401).json({message: "Authorization header missing or improperly formatted"})
        }

        const token = authHeader.split(" ")[1]

        const decoded = verifyToken(token)
        req.user = decoded


        next()
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}