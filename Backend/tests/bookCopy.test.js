import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";

import {
    createAdminToken,
    createLibrarianToken,
    createMemberToken,
} from "./helpers/authHelper.js";

import { createBook } from "./helpers/bookHelper.js";
import { createBookCopy } from "./helpers/bookCopyHelper.js";

describe("Book Copy API", () => {

    describe("POST /api/bookcopies", () => {

  it("should allow admin to create a book copy", async () => {
    const token = await createAdminToken();

    const res = await createBookCopy(token);

    console.log(JSON.stringify(res.body, null, 2)); // <-- add this

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.book).toBeDefined();
    expect(res.body.data.barcode).toBeDefined();
});

        it("should allow librarian to create a book copy", async () => {

            const token = await createLibrarianToken();

            const res = await createBookCopy(token);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
        });

it("should not allow member to create a book copy", async () => {

    const adminToken = await createAdminToken();
    const memberToken = await createMemberToken();

    const book = await createBook(adminToken);

    const res = await request(app)
        .post("/api/bookcopies")
        .set("Authorization", `Bearer ${memberToken}`)
        .send({
            book: book.body.data._id,
            barcode: `BC-${Date.now()}`,
            shelfLocation: "A-01",
        });

    expect(res.statusCode).toBe(403);
    expect(res.body.success).toBe(false);

});

        it("should reject request without token", async () => {

            const token = await createAdminToken();

            const book = await createBook(token);

            const res = await request(app)
                .post("/api/bookcopies")
                .send({
                    book: book.body.data._id,
                    barcode: `BC-${Date.now()}`
                });

            expect(res.statusCode).toBe(401);
        });

        it("should reject invalid token", async () => {

            const token = await createAdminToken();

            const book = await createBook(token);

            const res = await request(app)
                .post("/api/bookcopies")
                .set("Authorization", "Bearer invalid")
                .send({
                    book: book.body.data._id,
                    barcode: `BC-${Date.now()}`
                });

            expect(res.statusCode).toBe(401);
        });

        it("should not allow duplicate barcode", async () => {

            const token = await createAdminToken();

            const first = await createBookCopy(token);

            const res = await createBookCopy(token, {
                barcode: first.body.data.barcode,
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
        });

        it("should reject validation errors", async () => {

            const token = await createAdminToken();

            const res = await request(app)
                .post("/api/bookcopies")
                .set("Authorization", `Bearer ${token}`)
                .send({});

            expect(res.statusCode).toBe(400);
        });

    });

    describe("GET /api/bookcopies", () => {

        it("should get all book copies", async () => {

            const token = await createAdminToken();

            await createBookCopy(token);
            await createBookCopy(token);

            const res = await request(app)
                .get("/api/bookcopies");

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);
        });

    });

    describe("GET /api/bookcopies/:id", () => {

        it("should get a copy by id", async () => {

            const token = await createAdminToken();

            const copy = await createBookCopy(token);

            const res = await request(app)
                .get(`/api/bookcopies/${copy.body.data._id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.data._id).toBe(copy.body.data._id);
        });

        it("should reject request without token", async () => {

            const token = await createAdminToken();

            const copy = await createBookCopy(token);

            const res = await request(app)
                .get(`/api/bookcopies/${copy.body.data._id}`);

            expect(res.statusCode).toBe(401);
        });

        it("should reject invalid token", async () => {

            const token = await createAdminToken();

            const copy = await createBookCopy(token);

            const res = await request(app)
                .get(`/api/bookcopies/${copy.body.data._id}`)
                .set("Authorization", "Bearer invalid");

            expect(res.statusCode).toBe(401);
        });

        it("should return 404 for non-existing copy", async () => {

            const token = await createAdminToken();

            const id = new mongoose.Types.ObjectId();

            const res = await request(app)
                .get(`/api/bookcopies/${id}`)
                .set("Authorization", `Bearer ${token}`);

            expect(res.statusCode).toBe(404);
        });

    });




    describe("PUT /api/bookcopies/:id", () => {

    it("should allow admin to update a book copy", async () => {

        const token = await createAdminToken();

        const copy = await createBookCopy(token);

        const res = await request(app)
            .put(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                shelfLocation: "B-05",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.shelfLocation).toBe("B-05");

    });

    it("should allow librarian to update a book copy", async () => {

        const adminToken = await createAdminToken();
        const librarianToken = await createLibrarianToken();

        const copy = await createBookCopy(adminToken);

        const res = await request(app)
            .put(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${librarianToken}`)
            .send({
                shelfLocation: "C-10",
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should not allow member to update a book copy", async () => {

        const adminToken = await createAdminToken();
        const memberToken = await createMemberToken();

        const copy = await createBookCopy(adminToken);

        const res = await request(app)
            .put(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${memberToken}`)
            .send({
                shelfLocation: "D-01",
            });

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);

    });

    it("should reject request without token", async () => {

        const token = await createAdminToken();

        const copy = await createBookCopy(token);

        const res = await request(app)
            .put(`/api/bookcopies/${copy.body.data._id}`)
            .send({
                shelfLocation: "E-01",
            });

        expect(res.statusCode).toBe(401);

    });

    it("should reject invalid token", async () => {

        const token = await createAdminToken();

        const copy = await createBookCopy(token);

        const res = await request(app)
            .put(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", "Bearer invalid")
            .send({
                shelfLocation: "F-01",
            });

        expect(res.statusCode).toBe(401);

    });

    it("should reject invalid object id", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .put("/api/bookcopies/123")
            .set("Authorization", `Bearer ${token}`)
            .send({
                shelfLocation: "A-01",
            });

        expect(res.statusCode).toBe(400);

    });

    it("should return 404 for non-existing book copy", async () => {

        const token = await createAdminToken();

        const id = new mongoose.Types.ObjectId();

        const res = await request(app)
            .put(`/api/bookcopies/${id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                shelfLocation: "A-01",
            });

        expect(res.statusCode).toBe(404);

    });

    it("should validate request body", async () => {

        const token = await createAdminToken();

        const copy = await createBookCopy(token);

        const res = await request(app)
            .put(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                status: "INVALID_STATUS",
            });

        expect(res.statusCode).toBe(400);

    });

});

// delete
describe("DELETE /api/bookcopies/:id", () => {

    it("should allow admin to delete a book copy", async () => {

        const token = await createAdminToken();

        const copy = await createBookCopy(token);

        const res = await request(app)
            .delete(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should not allow librarian to delete a book copy", async () => {

        const adminToken = await createAdminToken();
        const librarianToken = await createLibrarianToken();

        const copy = await createBookCopy(adminToken);

        const res = await request(app)
            .delete(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${librarianToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);

    });

    it("should not allow member to delete a book copy", async () => {

        const adminToken = await createAdminToken();
        const memberToken = await createMemberToken();

        const copy = await createBookCopy(adminToken);

        const res = await request(app)
            .delete(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${memberToken}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);

    });

    it("should reject request without token", async () => {

        const token = await createAdminToken();

        const copy = await createBookCopy(token);

        const res = await request(app)
            .delete(`/api/bookcopies/${copy.body.data._id}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const token = await createAdminToken();

        const copy = await createBookCopy(token);

        const res = await request(app)
            .delete(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid object id", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .delete("/api/bookcopies/123")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

    it("should return 404 for non-existing book copy", async () => {

        const token = await createAdminToken();

        const id = new mongoose.Types.ObjectId();

        const res = await request(app)
            .delete(`/api/bookcopies/${id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

    it("should not delete the same book copy twice", async () => {

        const token = await createAdminToken();

        const copy = await createBookCopy(token);

        await request(app)
            .delete(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
            .delete(`/api/bookcopies/${copy.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

});
});