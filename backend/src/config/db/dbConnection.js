import mongoose from "mongoose";

export const dbConnection = async () => {
    try {
        await mongoose.connect()
        console.log("Database has connected succussfully")
    } catch (error) {
        
    }
    
}