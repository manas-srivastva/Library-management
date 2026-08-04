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
// Test 1 — Admin Get All
it("should allow admin to get all books", async () => {

    const token = await createAdminToken();

    await createBook(token);

    const res = await request(app)
        .get("/api/books")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    expect(Array.isArray(res.body.data)).toBe(true);

});

// Test 2 — Librarian Get All
it("should allow librarian to get all books", async () => {

    const token = await createLibrarianToken();

    await createBook(token);

    const res = await request(app)
        .get("/api/books")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

});

// Test 3 — Member Get All
it("should allow member to get all books", async () => {

    const adminToken = await createAdminToken();
    const memberToken = await createMemberToken();

    await createBook(adminToken);

    const res = await request(app)
        .get("/api/books")
        .set("Authorization", `Bearer ${memberToken}`);

    expect(res.statusCode).toBe(200);

});

// Test 4 — Missing JWT
it("should not get books without token", async () => {

    const res = await request(app)
        .get("/api/books");

    expect(res.statusCode).toBe(401);

});

// Test 5 — Invalid JWT
it("should not get books with invalid token", async () => {

    const res = await request(app)
        .get("/api/books")
        .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);

});


// Test 6 — Get Book by ID
it("should get a book by id", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    const res = await request(app)
        .get(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    expect(res.body.data._id).toBe(created.body.data._id);

});


// Test 7 — Invalid ObjectId
it("should return 400 for invalid object id", async () => {

    const token = await createAdminToken();

    const res = await request(app)
        .get("/api/books/invalidid")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);

});

// Test 8 — Book Not Found
it("should return 404 when book does not exist", async () => {

    const token = await createAdminToken();

    const id = new mongoose.Types.ObjectId();

    const res = await request(app)
        .get(`/api/books/${id}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);

});


// Test 1 — Admin can update
it("should allow admin to update a book", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    const res = await request(app)
        .put(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Updated Clean Code"
        });

    expect(res.statusCode).toBe(200);

    expect(res.body.data.title).toBe("Updated Clean Code");

});


// Test 2 — Librarian can update
it("should allow librarian to update a book", async () => {

    const token = await createLibrarianToken();

    const created = await createBook(token);

    const res = await request(app)
        .put(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Updated Book"
        });

    expect(res.statusCode).toBe(200);

});



//  Test 3 — Member cannot update
it("should not allow member to update a book", async () => {

    const adminToken = await createAdminToken();
    const memberToken = await createMemberToken();

    const created = await createBook(adminToken);

    const res = await request(app)
        .put(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
            title: "Updated"
        });

    expect(res.statusCode).toBe(403);

});


// Test 4 — Missing JWT
it("should not update without token", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    const res = await request(app)
        .put(`/api/books/${created.body.data._id}`)
        .send({
            title: "Updated"
        });

    expect(res.statusCode).toBe(401);

});

// Test 5 — Invalid JWT
it("should not update with invalid token", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    const res = await request(app)
        .put(`/api/books/${created.body.data._id}`)
        .set("Authorization", "Bearer invalidtoken")
        .send({
            title: "Updated"
        });

    expect(res.statusCode).toBe(401);

});


// Test 6 — Duplicate ISBN
it("should not allow duplicate ISBN while updating", async () => {

    const token = await createAdminToken();

    const first = await createBook(token, {
        isbn: "1111111111111"
    });

    const second = await createBook(token, {
        isbn: "2222222222222"
    });

    const res = await request(app)
        .put(`/api/books/${second.body.data._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            isbn: "1111111111111"
        });

    expect(res.statusCode).toBe(400);

    expect(res.body.message).toContain("ISBN already exists");

});



// Test 7 — Validation
it("should validate update payload", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    const res = await request(app)
        .put(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            pages: -10
        });

    expect(res.statusCode).toBe(400);

});

// Test 8 — Invalid ObjectId
it("should return 400 for invalid update id", async () => {

    const token = await createAdminToken();

    const res = await request(app)
        .put("/api/books/invalidid")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Updated"
        });

    expect(res.statusCode).toBe(400);

});

// Test 9 — Book Not Found
it("should return 404 when updating non-existing book", async () => {

    const token = await createAdminToken();

    const id = new mongoose.Types.ObjectId();

    const res = await request(app)
        .put(`/api/books/${id}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Updated"
        });

    expect(res.statusCode).toBe(404);

});
// delete

it("should allow admin to delete a book", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    const res = await request(app)
        .delete(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);

    expect(res.body.message).toBe("Book deleted");

});

it("should not allow librarian to delete a book", async () => {

    const adminToken = await createAdminToken();
    const librarianToken = await createLibrarianToken();

    const created = await createBook(adminToken);

    const res = await request(app)
        .delete(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${librarianToken}`);

    expect(res.statusCode).toBe(403);

});

it("should not allow member to delete a book", async () => {

    const adminToken = await createAdminToken();
    const memberToken = await createMemberToken();

    const created = await createBook(adminToken);

    const res = await request(app)
        .delete(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${memberToken}`);

    expect(res.statusCode).toBe(403);

});

it("should not delete a book without token", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    const res = await request(app)
        .delete(`/api/books/${created.body.data._id}`);

    expect(res.statusCode).toBe(401);

});

it("should not delete a book with invalid token", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    const res = await request(app)
        .delete(`/api/books/${created.body.data._id}`)
        .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);

});

it("should return 400 for invalid object id while deleting", async () => {

    const token = await createAdminToken();

    const res = await request(app)
        .delete("/api/books/invalidid")
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(400);

});

it("should not delete the same book twice", async () => {

    const token = await createAdminToken();

    const created = await createBook(token);

    await request(app)
        .delete(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${token}`);

    const res = await request(app)
        .delete(`/api/books/${created.body.data._id}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);

});

it("should return 404 when deleting non-existing book", async () => {

    const token = await createAdminToken();

    const id = new mongoose.Types.ObjectId();

    const res = await request(app)
        .delete(`/api/books/${id}`)
        .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);

});
});