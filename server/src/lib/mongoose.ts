import mongoose from "mongoose";
import config from "@/config";
import type { ConnectOptions } from "mongoose";
import { logger } from "@/lib/winston";

const clientOptions: ConnectOptions = {
    dbName: "blog-app", 
    appName: "Blog API", 
    serverApi: {
        version: "1", 
        strict: true, 
        deprecationErrors: true, 
    }, 
}

export const connectToDatabase = async (): Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error("MONGO_URI is not defined in environment variables.");
    }

    try { 
        await mongoose.connect(config.MONGO_URI, clientOptions); 

        logger.info("Connected to MongoDB database successfully.", {
            uri: config.MONGO_URI, 
            options: clientOptions
        });
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to connect to MongoDB: ${error.message}`);
        }
    }
}

export const disconnectFromDatabase = async (): Promise<void> => { 
    try { 
        await mongoose.disconnect(); 

        logger.info("Disconnected from MongoDB database successfully.", {
            uri: config.MONGO_URI, 
            options: clientOptions
        });
    } catch (error) { 
        if (error instanceof Error) { 
            throw new Error(`Failed to disconnect from MongoDB: ${error.message}`);
        }
    }
}