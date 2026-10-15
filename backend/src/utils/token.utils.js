import jwt from "jsonwebtoken"
import { token_secret } from "../config/env/env.config.js"
import { SESSION_HOURS } from "./cookie.utils.js"

export const generateToken = (user) => {
    return jwt.sign(
        {id: user.id},
        token_secret, 
        { expiresIn: `${SESSION_HOURS}h` }
    )
}

export const verifyToken = (token) => {
    return jwt.verify(token, token_secret, { algorithms: ["HS256"] })
}
