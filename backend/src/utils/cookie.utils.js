

export const SESSION_HOURS = 8

export const cookieOptions = {
    httpOnly: true,
    samSite: "strict",
    path:"/api",
    secure:process.env.NODE_ENV = "production"
}

export const sessionMaxAge = SESSION_HOURS * 60 * 60 * 1000