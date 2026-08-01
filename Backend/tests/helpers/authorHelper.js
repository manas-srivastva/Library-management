import request from "supertest";
import app from "../../src/app.js";

export const createAuthor = async (token, data = {}) => {

    const unique = Date.now() + Math.floor(Math.random() * 10000);

    const authorData = {
        name: `Author-${unique}`,
        bio: "British author",
        birthDate: "1965-07-31",
        nationality: "British",
        ...data,
    };

    return request(app)
        .post("/api/authors")
        .set("Authorization", `Bearer ${token}`)
        .send(authorData);
};