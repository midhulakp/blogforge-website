import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();

async function db(){
    try {
      let conn=await mongoose.connect(process.env.MONGO_URI)  
      console.log(`db is connected on ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit()
    }
}
export default db;