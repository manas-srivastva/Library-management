import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";
import { describe, it, expect } from "@jest/globals";
import {
    createAdminToken,
    createLibrarianToken,
    createMemberToken,
} from "./helpers/authHelper.js";

import { createAuthor } from "./helpers/authorHelper.js";

describe("Author API",() => {
    describe("POST /api/authors", () => {

it("should allow admin to create an author", async () => {

    const token = await createAdminToken();

    const authorName = "J.K. Rowling";

    const res = await createAuthor(token, {
        name: authorName,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Author created successfully");
    expect(res.body.data.name).toBe(authorName);

});

    it("should allow librarian to create an author", async () => {

        const token = await createLibrarianToken();

        const res = await createAuthor(token, {
            name: "Dan Brown",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);

    });

    it("should forbid member from creating an author", async () => {

        const token = await createMemberToken();

        const res = await createAuthor(token);

        expect(res.statusCode).toBe(403);

    });

    it("should return 401 when JWT is missing", async () => {

        const res = await request(app)
            .post("/api/authors")
            .send({
                name: "J.K. Rowling",
            });

        expect(res.statusCode).toBe(401);

    });

    it("should return 401 for invalid JWT", async () => {

        const res = await request(app)
            .post("/api/authors")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                name: "J.K. Rowling",
            });

        expect(res.statusCode).toBe(401);

    });

it("should not allow duplicate author", async () => {

    const token = await createAdminToken();

    const authorName = "J.K. Rowling";

    await createAuthor(token, {
        name: authorName,
    });

    const res = await createAuthor(token, {
        name: authorName,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Author already exists");

});

    it("should require author name", async () => {

        const token = await createAdminToken();

        const res = await createAuthor(token, {
            name: "",
        });

        expect(res.statusCode).toBe(400);

    });

    it("should validate minimum name length", async () => {

        const token = await createAdminToken();

        const res = await createAuthor(token, {
            name: "A",
        });

        expect(res.statusCode).toBe(400);

    });

    it("should validate maximum name length", async () => {

        const token = await createAdminToken();

        const res = await createAuthor(token, {
            name: "A".repeat(101),
        });

        expect(res.statusCode).toBe(400);

    });

    it("should validate bio length", async () => {

        const token = await createAdminToken();

        const res = await createAuthor(token, {
            bio: "A".repeat(1001),
        });

        expect(res.statusCode).toBe(400);

    });

  });
  describe("GET /api/authors", () => {

    it("should return all authors", async () => {

        const token = await createAdminToken();

        await createAuthor(token);

        await createAuthor(token, {
            name: "Dan Brown",
        });

        const res = await request(app)
            .get("/api/authors");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Authors fetched successfully");

        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    });

    it("should return an empty array when no authors exist", async () => {

        const res = await request(app)
            .get("/api/authors");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);

    });

});


// GET /api/authors/:id

describe("GET /api/authors/:id", () => {

it("should allow admin to get an author by id", async () => {

    const token = await createAdminToken();

    const authorName = "J.K. Rowling";

    const author = await createAuthor(token, {
        name: authorName,
    });

    const res = await request(app)
        .get(`/api/authors/${author.body.data._id}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Author fetched successfully");
    expect(res.body.data.name).toBe(authorName);

});

    it("should allow librarian to get an author by id", async () => {

        const adminToken = await createAdminToken();
        const librarianToken = await createLibrarianToken();

        const author = await createAuthor(adminToken);

        const res = await request(app)
            .get(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${librarianToken}`);

        expect(res.statusCode).toBe(200);

    });

    it("should allow member to get an author by id", async () => {

        const adminToken = await createAdminToken();
        const memberToken = await createMemberToken();

        const author = await createAuthor(adminToken);

        const res = await request(app)
            .get(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${memberToken}`);

        expect(res.statusCode).toBe(200);

    });

    it("should return 401 when JWT is missing", async () => {

        const token = await createAdminToken();
        const author = await createAuthor(token);

        const res = await request(app)
            .get(`/api/authors/${author.body.data._id}`);

        expect(res.statusCode).toBe(401);

    });

    it("should return 401 for invalid JWT", async () => {

        const token = await createAdminToken();
        const author = await createAuthor(token);

        const res = await request(app)
            .get(`/api/authors/${author.body.data._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);

    });

    it("should return 400 for invalid ObjectId", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .get("/api/authors/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);

    });

    it("should return 404 when author does not exist", async () => {

        const token = await createAdminToken();

        const id = "507f1f77bcf86cd799439011";

        const res = await request(app)
            .get(`/api/authors/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);

    });

});



// PUT /api/authors/:id

describe("PUT /api/authors/:id", () => {

    it("should allow admin to update an author", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .put(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "George R.R. Martin",
                bio: "American novelist"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Author updated successfully");
        expect(res.body.data.name).toBe("George R.R. Martin");

    });

    it("should allow librarian to update an author", async () => {

        const adminToken = await createAdminToken();
        const librarianToken = await createLibrarianToken();

        const author = await createAuthor(adminToken);

        const res = await request(app)
            .put(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${librarianToken}`)
            .send({
                bio: "Updated by librarian"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should forbid member from updating an author", async () => {

        const adminToken = await createAdminToken();
        const memberToken = await createMemberToken();

        const author = await createAuthor(adminToken);

        const res = await request(app)
            .put(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${memberToken}`)
            .send({
                name: "Updated Name"
            });

        expect(res.statusCode).toBe(403);

    });

    it("should return 401 when JWT is missing", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .put(`/api/authors/${author.body.data._id}`)
            .send({
                name: "Updated Name"
            });

        expect(res.statusCode).toBe(401);

    });

    it("should return 401 for invalid JWT", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .put(`/api/authors/${author.body.data._id}`)
            .set("Authorization", "Bearer invalidtoken")
            .send({
                name: "Updated Name"
            });

        expect(res.statusCode).toBe(401);

    });

    it("should return 400 for invalid ObjectId", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .put("/api/authors/invalid-id")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Name"
            });

        expect(res.statusCode).toBe(400);

    });

    it("should return 404 when author does not exist", async () => {

        const token = await createAdminToken();

        const id = "507f1f77bcf86cd799439011";

        const res = await request(app)
            .put(`/api/authors/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Name"
            });

        expect(res.statusCode).toBe(404);

    });

    it("should not allow duplicate author name", async () => {

        const token = await createAdminToken();

        await createAuthor(token, {
            name: "J.K. Rowling"
        });

        const second = await createAuthor(token, {
            name: "Dan Brown"
        });

        const res = await request(app)
            .put(`/api/authors/${second.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "J.K. Rowling"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Author already exists");

    });

    it("should validate minimum name length", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .put(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "A"
            });

        expect(res.statusCode).toBe(400);

    });

    it("should validate maximum name length", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .put(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "A".repeat(101)
            });

        expect(res.statusCode).toBe(400);

    });

    it("should validate bio length", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .put(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                bio: "A".repeat(1001)
            });

        expect(res.statusCode).toBe(400);

    });

});

// DELETE /api/authors/:id
describe("DELETE /api/authors/:id", () => {

    it("should allow admin to delete an author", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .delete(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Author deleted successfully");

    });

    it("should forbid librarian from deleting an author", async () => {

        const adminToken = await createAdminToken();
        const librarianToken = await createLibrarianToken();

        const author = await createAuthor(adminToken);

        const res = await request(app)
            .delete(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${librarianToken}`);

        expect(res.statusCode).toBe(403);

    });

    it("should forbid member from deleting an author", async () => {

        const adminToken = await createAdminToken();
        const memberToken = await createMemberToken();

        const author = await createAuthor(adminToken);

        const res = await request(app)
            .delete(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${memberToken}`);

        expect(res.statusCode).toBe(403);

    });

    it("should return 401 when JWT is missing", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .delete(`/api/authors/${author.body.data._id}`);

        expect(res.statusCode).toBe(401);

    });

    it("should return 401 for invalid JWT", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        const res = await request(app)
            .delete(`/api/authors/${author.body.data._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);

    });

    it("should return 400 for invalid ObjectId", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .delete("/api/authors/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);

    });

    it("should return 404 when author does not exist", async () => {

        const token = await createAdminToken();

        const id = "507f1f77bcf86cd799439011";

        const res = await request(app)
            .delete(`/api/authors/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Author not found");

    });

    it("should not delete the same author twice", async () => {

        const token = await createAdminToken();

        const author = await createAuthor(token);

        await request(app)
            .delete(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
            .delete(`/api/authors/${author.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toBe("Author not found");

    });

});
})