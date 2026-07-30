import request from "supertest";
import app from "../../src/app.js";

export const createPublisher = async (token, data = {}) => {

    const publisherData = {
        name: "O'Reilly Media",
        description: "Technology publisher",
        website: "https://www.oreilly.com",
        country: "USA",
        ...data,
    };

    return request(app)
        .post("/api/publishers")
        .set("Authorization", `Bearer ${token}`)
        .send(publisherData);

};