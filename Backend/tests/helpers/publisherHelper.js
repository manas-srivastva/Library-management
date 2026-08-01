import request from "supertest";
import app from "../../src/app.js";

export const createPublisher = async (token, data = {}) => {

    const unique = Date.now() + Math.floor(Math.random() * 10000);

    const publisherData = {
        name: `Publisher-${unique}`,
        description: "Technology publisher",
        website: `https://publisher-${unique}.com`,
        country: "USA",
        ...data,
    };

    return request(app)
        .post("/api/publishers")
        .set("Authorization", `Bearer ${token}`)
        .send(publisherData);
};