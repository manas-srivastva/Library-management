import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";

import {
    createAdminToken,
    createLibrarianToken,
    createMemberToken
} from "./helpers/authHelper.js";

import { createBook } from "./helpers/bookHelper.js";
import { createAuthor } from "./helpers/authorHelper.js";
import { createCategory } from "./helpers/categoryHelper.js";
import { createPublisher } from "./helpers/publisherHelper.js";

describe("Book API", () => {
// Test 1 — Admin can create a book
it("should allow admin to create a book", async () => {

    const token = await createAdminToken();

    const res = await createBook(token);

    expect(res.statusCode).toBe(201);

    expect(res.body.message).toBe("Book created");

    expect(res.body.data.title).toBe("Clean Code");

});
// Test 2 — Librarian can create a book
it("should allow librarian to create a book", async () => {

    const token = await createLibrarianToken();

    const res = await createBook(token);

    expect(res.statusCode).toBe(201);

});


//Test 3 — Member cannot create
it("should not allow member to create a book", async () => {

    const adminToken = await createAdminToken();
    const memberToken = await createMemberToken();

    const author = await createAuthor(adminToken);
    const category = await createCategory(adminToken);
    const publisher = await createPublisher(adminToken);

    const res = await createBook(
        memberToken,
        {},
        {
            authorId: author.body.data._id,
            categoryId: category._id,
            publisherId: publisher.body.data._id
        }
    );

    expect(res.statusCode).toBe(403);

});

//Test 4 — Missing JWT
it("should not create a book without token", async () => {

    const res = await request(app)
        .post("/api/books")
        .send({});

    expect(res.statusCode).toBe(401);

});
// Test 5 — Invalid JWT
it("should not create a book with invalid token", async () => {

    const res = await request(app)
        .post("/api/books")
        .set("Authorization", "Bearer invalidtoken")
        .send({});

    expect(res.statusCode).toBe(401);

});


// Test 6 — Duplicate ISBN
it("should not create duplicate ISBN",async ()=>{
const token=await createAdminToken();
const isbn="9780132350884";
await createBook(token, { isbn });
const res=await createBook(token, { isbn });
expect(res.statusCode).toBe(400);
expect(res.body.message).toContain("ISBN already exists");
});



// Test 7 — Validation Error
it("should validate required fields", async () => {

    const token = await createAdminToken();

    const res = await request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${token}`)
        .send({});

    expect(res.statusCode).toBe(400);

});

});