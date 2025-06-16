import mongoose  from "mongoose";
import { DB_NAME } from "../constants.js";

const dbConnection = async ()=>{
try {
   const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}?retryWrites=true&w=majority`);
   console.log("Database Connected Successfully : HOST => ",connectionInstance.connection.host);
} catch (error) {
    console.log("Error while connection the database", error);
}
}

export default dbConnection;