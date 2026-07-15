import mongoose from "mongoose";

const connectDB = async (uri = process.env.MONGO_URL) => {
    try {
        const connection = await mongoose.connect(uri);

        console.log(
            `MongoDB Connected: ${connection.connection.host}`
        );

        return connection;
    } catch (error) {
        console.error(`MongoDB Error: ${error.message}`);
        throw error;
    }
};

export default connectDB;