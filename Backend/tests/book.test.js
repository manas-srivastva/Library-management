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

    const token = await createMemberToken();

    const res = await createBook(token);

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
});