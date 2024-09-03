import mongoose from 'mongoose';
import envs from "./envs.config.js";

export const connectMongoDB = async () => {
    try {
        await mongoose.connect(envs.MONGO_URL)
            .then(() => console.log("Successfully connected to the database using Mongoose!!"))
            .catch((err) => console.log(err))
    } catch (error) {
        console.error("Could not connect to the database using Mongoose: " + error);
        process.exit();
    }
}