import rateLimit from "express-rate-limit";

const make = (windowsMs, limit) => rateLimit({ windowMs, limit, standardHeaders: true, legacyHeaders: false})
export const apiLimiter = make(15 * 60 * 1000, 300)
export const loginLimiter = make(15 * 60 * 1000, 10)
export const contactLimiter = make(60 * 60 * 1000, 5)
