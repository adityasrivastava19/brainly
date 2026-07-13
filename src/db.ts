import mongoose from "mongoose";
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env before reading process.env

export async function connect ()
{
    try{
        const mongo = process.env.MONGO_URI;
        if (!mongo) {
            // Main issue: MONGO_URI was missing or undefined, so mongoose.connect() would fail.
            throw new Error("MONGO_URI is not defined");
        }

        // Await the connection promise so errors are caught here and the DB is ready before continuing.
        await mongoose.connect(mongo);
        console.log("DB is live");
    }
    catch(error)
    {
        console.log("connection failed", error);
        process.exit(1);
    }
}