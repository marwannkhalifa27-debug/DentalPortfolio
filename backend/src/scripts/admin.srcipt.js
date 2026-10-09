import { dbConnection } from "../config/db/dbConnection.js"



const [ email, password ] = process.argv.slice(2)
if(!email || !password || password.length < 8){
    console.log("Usage: npm run create-admin -- <email> <password (8+ chars)>")
    process.exit(1)
}

await dbConnection()
if (await adminModel.exists({})) {
  console.error("An admin already exists. Not creating another.")
  process.exit(1)
}
await adminModel.create({ email, password })
console.log("Admin created:", email)
await mongoose.disconnect()