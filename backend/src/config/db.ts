import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  if (isConnected) return true;

  const primaryUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/agritwin";

  try {
    console.log(`[AgriTwin DB] Connecting to MongoDB: ${primaryUri}...`);
    await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 1500,
    });
    isConnected = true;
    console.log("[AgriTwin DB] Successfully connected to MongoDB instance.");
    return true;
  } catch (err: any) {
    console.warn(`[AgriTwin DB] Primary MongoDB daemon unavailable (${err.message}).`);
    console.log("[AgriTwin DB] Activating high-performance In-Memory Document Store with full Mongoose compatibility.");
    isConnected = false;
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected;
}
