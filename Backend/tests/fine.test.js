import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";

import {
    createAdmin,
    createLibrarian,
    createMember
} from "./helpers/authHelper.js";

import { createFine } from "./helpers/fineHelper.js";

// GET /api/fines
describe("GET /api/fines", () => {

    it("should allow admin to get all fines", async () => {

        const admin = await createAdmin();

        await createFine(admin);

        const res = await request(app)
            .get("/api/fines")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThanOrEqual(1);

    });

    it("should allow librarian to get all fines", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        await createFine(admin);

        const res = await request(app)
            .get("/api/fines")
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);

    });

    it("should not allow member to get all fines", async () => {

        const member = await createMember();

        const res = await request(app)
            .get("/api/fines")
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);

    });

    it("should reject request without token", async () => {

        const res = await request(app)
            .get("/api/fines");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const res = await request(app)
            .get("/api/fines")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

});

// GET /api/fines/:id
describe("GET /api/fines/:id", () => {

    it("should get a fine by id", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/${fine._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(fine._id);

    });

    it("should allow librarian to get a fine", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/${fine._id}`)
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should allow member to get a fine", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/${fine._id}`)
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/${fine._id}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/${fine._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid object id", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/fines/123")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

    it("should return 404 for non-existing fine", async () => {

        const admin = await createAdmin();

        const id = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/fines/${id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

});


// PUT /api/fines/pay/:id
describe("PUT /api/fines/pay/:id", () => {

    it("should allow admin to pay a fine", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .put(`/api/fines/pay/${fine._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe("PAID");

    });

    it("should allow librarian to pay a fine", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        const fine = await createFine(admin);

        const res = await request(app)
            .put(`/api/fines/pay/${fine._id}`)
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should allow member to pay a fine", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const fine = await createFine(admin);

        const res = await request(app)
            .put(`/api/fines/pay/${fine._id}`)
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .put(`/api/fines/pay/${fine._id}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .put(`/api/fines/pay/${fine._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid object id", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .put("/api/fines/pay/123")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

    it("should return 404 for non-existing fine", async () => {

        const admin = await createAdmin();

        const id = new mongoose.Types.ObjectId();

        const res = await request(app)
            .put(`/api/fines/pay/${id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

    it("should not pay the same fine twice", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        await request(app)
            .put(`/api/fines/pay/${fine._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        const res = await request(app)
            .put(`/api/fines/pay/${fine._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

});


// GET /api/fines/user/:id
describe("GET /api/fines/user/:id", () => {

    it("should get user fines", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/user/${fine.user._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);

    });

    it("should allow librarian to get user fines", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/user/${fine.user._id}`)
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should allow member to get user fines", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/user/${fine.user._id}`)
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/user/${fine.user._id}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();

        const fine = await createFine(admin);

        const res = await request(app)
            .get(`/api/fines/user/${fine.user._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid object id", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/fines/user/123")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

    it("should return empty array for user with no fines", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const res = await request(app)
            .get(`/api/fines/user/${member.user._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(0);

    });

});