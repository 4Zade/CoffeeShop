import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const uri: string = process.env.MONGO_URI

export default async function run() {
  try {
    await mongoose.connect(uri);
    console.log("[mongoose] Database started successfully");
  } catch (err: unknown) {
    console.log("[mongoose] Error: ", err);
  }
}
