import dotenv from "dotenv";

dotenv.config();
import mongoose from "mongoose";
import { beforeAll, beforeEach, afterAll } from "@jest/globals";
import { MongoMemoryServer } from "mongodb-memory-server";
import connectDB from "../src/config/db.js";

let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();

    const uri = mongoServer.getUri();

    await connectDB(uri);
});

beforeEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany({});
    }
});

afterAll(async () => {
    await mongoose.connection.close();

    await mongoServer.stop();
});