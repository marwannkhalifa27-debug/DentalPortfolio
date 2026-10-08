import { verifyToken } from "../utils/token.utils.js"


export const authenticate = (req,res,next) => {
    try {
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startWith("Bearer ")){
            return res.status(404).json({message: "Authorization header missing or improperly formatted"})
        }

        const token = authHeader.split(" ")
        if(!token){
            return res.status(404).json({message: "No token provided"})
        }

        const decoded = verifyToken(token)
        req.user = decoded


        next()
    } catch (error) {
        return res.status(500).json({message:error.message})
    }
}