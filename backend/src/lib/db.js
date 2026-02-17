import mongoose from "mongoose";
import { ENV } from "./env.js";

let cachedConnection = null;

const buildConnectionOptions = () => ({
    bufferCommands: false,
    autoIndex: ENV.NODE_ENV !== "production",
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000
});

const connectDB = async () => {
    if (cachedConnection) {
        return cachedConnection;
    }

    const mongoUri = ENV.MONGO_URI?.trim();
    if (!mongoUri) {
        throw new Error("MONGO_URI environment variable is required");
    }

    try {
        cachedConnection = await mongoose.connect(mongoUri, buildConnectionOptions());
        console.info(`MongoDB connected: ${cachedConnection.connection.host}`);
        return cachedConnection;
    } catch (err) {
        cachedConnection = null;
        console.error("MongoDB connection failed", err);
        throw err;
    }
};

export default connectDB;