import jwt from "jsonwebtoken"
import { token_secret } from "../config/env/env.config.js"

export const generateToken = (user) => {
    return jwt.sign(
        {id: user.id},
        token_secret, 
        { expiresIn: "1h" }
    )
}

export const verifyToken = (token) => {
    return jwt.verify(token, token_secret)
}
