import mongoose from "mongoose";
import { db_uri } from "../env/env.config.js";

export const dbConnection = async () => {
    try {
        await mongoose.connect(db_uri)
        console.log("Database has connected succussfully")
    } catch (error) {
        console.log("Failed to connect", error.message)
    }
}