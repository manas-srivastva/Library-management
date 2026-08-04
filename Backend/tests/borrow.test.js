import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";

import {
    createAdmin,
    createAdminToken,
    createLibrarian,
    createLibrarianToken,
    createMember,
    createMemberToken,
} from "./helpers/authHelper.js";

import { createBookCopy } from "./helpers/bookCopyHelper.js";
import { createBorrow } from "./helpers/borrowHelper.js";

describe("POST /api/borrows", () => {

    it("should allow admin to borrow a book", async () => {

        const admin = await createAdmin();

        const res = await createBorrow(admin);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();

    });

    it("should allow librarian to borrow a book", async () => {

        const librarian = await createLibrarian();

        const res = await createBorrow(librarian);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);

    });

    it("should not allow member to borrow a book", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const copy = await createBookCopy(admin.token);

        const res = await request(app)
            .post("/api/borrows")
            .set("Authorization", `Bearer ${member.token}`)
            .send({
                user: member.user.email,
                issuedBy: member.user.email,
                barcode: copy.body.data.barcode,
                dueDate: new Date(),
            });

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const copy = await createBookCopy(admin.token);

        const res = await request(app)
            .post("/api/borrows")
            .send({
                user: member.user.email,
                issuedBy: admin.user.email,
                barcode: copy.body.data.barcode,
                dueDate: new Date(),
            });

        expect(res.statusCode).toBe(401);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const copy = await createBookCopy(admin.token);

        const res = await request(app)
            .post("/api/borrows")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                user: member.user.email,
                issuedBy: admin.user.email,
                barcode: copy.body.data.barcode,
                dueDate: new Date(),
            });

        expect(res.statusCode).toBe(401);

    });

    it("should reject non-existing user", async () => {

        const admin = await createAdmin();

        const copy = await createBookCopy(admin.token);

        const res = await request(app)
            .post("/api/borrows")
            .set("Authorization", `Bearer ${admin.token}`)
            .send({
                user: "unknown@test.com",
                issuedBy: admin.user.email,
                barcode: copy.body.data.barcode,
                dueDate: new Date(),
            });

        expect(res.statusCode).toBe(404);

    });

    it("should reject non-existing issuer", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const copy = await createBookCopy(admin.token);

        const res = await request(app)
            .post("/api/borrows")
            .set("Authorization", `Bearer ${admin.token}`)
            .send({
                user: member.user.email,
                issuedBy: "unknown@test.com",
                barcode: copy.body.data.barcode,
                dueDate: new Date(),
            });

        expect(res.statusCode).toBe(404);

    });

    it("should reject non-existing barcode", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const res = await request(app)
            .post("/api/borrows")
            .set("Authorization", `Bearer ${admin.token}`)
            .send({
                user: member.user.email,
                issuedBy: admin.user.email,
                barcode: "INVALID-BARCODE",
                dueDate: new Date(),
            });

        expect(res.statusCode).toBe(404);

    });

it("should not borrow an unavailable copy", async () => {

    const admin = await createAdmin();
    const member = await createMember();

    const copy = await createBookCopy(admin.token);

    await request(app)
        .post("/api/borrows")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({
            user: member.user.email,
            issuedBy: admin.user.email,
            barcode: copy.body.data.barcode,
            dueDate: new Date(),
        });

    const res = await request(app)
        .post("/api/borrows")
        .set("Authorization", `Bearer ${admin.token}`)
        .send({
            user: member.user.email,
            issuedBy: admin.user.email,
            barcode: copy.body.data.barcode,
            dueDate: new Date(),
        });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);

});

    it("should validate required fields", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .post("/api/borrows")
            .set("Authorization", `Bearer ${admin.token}`)
            .send({});

        expect(res.statusCode).toBe(400);

    });



    // GET
    describe("GET /api/borrows", () => {

    it("should allow admin to get all borrow records", async () => {

        const admin = await createAdmin();

        await createBorrow(admin);
        await createBorrow(admin);

        const res = await request(app)
            .get("/api/borrows")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    });

    it("should allow librarian to get all borrow records", async () => {

        const librarian = await createLibrarian();

        await createBorrow(librarian);

        const res = await request(app)
            .get("/api/borrows")
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);

    });

    it("should not allow member to get all borrow records", async () => {

        const member = await createMember();

        const res = await request(app)
            .get("/api/borrows")
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);

    });

    it("should reject request without token", async () => {

        const res = await request(app)
            .get("/api/borrows");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const res = await request(app)
            .get("/api/borrows")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

});


// GET BY ID
describe("GET /api/borrows/:id", () => {

    it("should get a borrow record by id", async () => {

        const admin = await createAdmin();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .get(`/api/borrows/${borrow.body.data._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(borrow.body.data._id);

    });

    it("should allow librarian to get a borrow record", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .get(`/api/borrows/${borrow.body.data._id}`)
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should allow member to get a borrow record", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .get(`/api/borrows/${borrow.body.data._id}`)
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .get(`/api/borrows/${borrow.body.data._id}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .get(`/api/borrows/${borrow.body.data._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid object id", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/borrows/123")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

    it("should return 404 for non-existing borrow record", async () => {

        const admin = await createAdmin();

        const id = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/borrows/${id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

});


// PUT /api/borrows/return/:id
describe("PUT /api/borrows/return/:id", () => {

    it("should allow admin to return a book", async () => {

        const admin = await createAdmin();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .put(`/api/borrows/return/${borrow.body.data._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe("RETURNED");
        expect(res.body.data.returnDate).toBeDefined();

    });

    it("should allow librarian to return a book", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .put(`/api/borrows/return/${borrow.body.data._id}`)
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should not allow member to return a book", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .put(`/api/borrows/return/${borrow.body.data._id}`)
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .put(`/api/borrows/return/${borrow.body.data._id}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();

        const borrow = await createBorrow(admin);

        const res = await request(app)
            .put(`/api/borrows/return/${borrow.body.data._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid object id", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .put("/api/borrows/return/123")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

    it("should return 404 for non-existing borrow record", async () => {

        const admin = await createAdmin();

        const id = new mongoose.Types.ObjectId();

        const res = await request(app)
            .put(`/api/borrows/return/${id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

    it("should not return the same book twice", async () => {

        const admin = await createAdmin();

        const borrow = await createBorrow(admin);

        await request(app)
            .put(`/api/borrows/return/${borrow.body.data._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        const res = await request(app)
            .put(`/api/borrows/return/${borrow.body.data._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

});
});