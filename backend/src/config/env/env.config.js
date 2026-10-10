import "dotenv/config"

const required = (name) => {
    const value = process.env[name]
    if (!value) throw new Error(`Missing env var: ${name}`)
    return value
}

export const db_uri = required("DB_URI")
export const token_secret = required("TOKEN_SECRET")
export const port = process.env.PORT ?? 3000