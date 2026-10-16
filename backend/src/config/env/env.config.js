import dotenv from "dotenv"
import path from "node:path"
dotenv.config({ path: path.join(import.meta.dirname, "../../../.env"), quiet: true })

const required = (name) => {
    const value = process.env[name]
    if (!value) throw new Error(`Missing env var: ${name}`)
    return value
}

export const db_uri = required("DB_URI")
export const token_secret = required("TOKEN_SECRET")
export const port = process.env.PORT ?? 3000

if (token_secret.length < 32) throw new Error("TOKEN_SECRET must be at least 32 characters")