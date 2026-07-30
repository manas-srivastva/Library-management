import request from "supertest";
import app from "../../src/app.js";

export const createAuthor = async (token, data = {}) => {
    const authorData = {
        name: "J.K. Rowling",
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