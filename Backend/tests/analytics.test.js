import request from "supertest";

import app from "../src/app.js";

import {
    createAdmin,
    createLibrarian,
    createMember
} from "./helpers/authHelper.js";

describe("Analytics API", () => {

    describe("GET /api/analytics/overview", () => {

        it("should allow admin", async () => {

            const admin = await createAdmin();

            const res = await request(app)
                .get("/api/analytics/overview")
                .set("Authorization", `Bearer ${admin.token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            expect(res.body.data).toHaveProperty("users");
            expect(res.body.data).toHaveProperty("books");
            expect(res.body.data).toHaveProperty("borrows");
            expect(res.body.data).toHaveProperty("reservations");
            expect(res.body.data).toHaveProperty("fines");

        });

        it("should allow librarian", async () => {

            const librarian = await createLibrarian();

            const res = await request(app)
                .get("/api/analytics/overview")
                .set("Authorization", `Bearer ${librarian.token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

        });

        it("should not allow member", async () => {

            const member = await createMember();

            const res = await request(app)
                .get("/api/analytics/overview")
                .set("Authorization", `Bearer ${member.token}`);

            expect(res.statusCode).toBe(403);

        });

        it("should reject missing token", async () => {

            const res = await request(app)
                .get("/api/analytics/overview");

            expect(res.statusCode).toBe(401);

        });

        it("should reject invalid token", async () => {

            const res = await request(app)
                .get("/api/analytics/overview")
                .set("Authorization", "Bearer invalidtoken");

            expect(res.statusCode).toBe(401);

        });

    });

    describe("GET /api/analytics/popular-books", () => {

        it("should allow admin", async () => {

            const admin = await createAdmin();

            const res = await request(app)
                .get("/api/analytics/popular-books")
                .set("Authorization", `Bearer ${admin.token}`);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(Array.isArray(res.body.data)).toBe(true);

        });

        it("should allow librarian", async () => {

            const librarian = await createLibrarian();

            const res = await request(app)
                .get("/api/analytics/popular-books")
                .set("Authorization", `Bearer ${librarian.token}`);

            expect(res.statusCode).toBe(200);

        });

        it("should not allow member", async () => {

            const member = await createMember();

            const res = await request(app)
                .get("/api/analytics/popular-books")
                .set("Authorization", `Bearer ${member.token}`);

            expect(res.statusCode).toBe(403);

        });

    });

    describe("GET /api/analytics/active-members", () => {

        it("should allow admin", async () => {

            const admin = await createAdmin();

            const res = await request(app)
                .get("/api/analytics/active-members")
                .set("Authorization", `Bearer ${admin.token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);

        });

        it("should allow librarian", async () => {

            const librarian = await createLibrarian();

            const res = await request(app)
                .get("/api/analytics/active-members")
                .set("Authorization", `Bearer ${librarian.token}`);

            expect(res.statusCode).toBe(200);

        });

        it("should not allow member", async () => {

            const member = await createMember();

            const res = await request(app)
                .get("/api/analytics/active-members")
                .set("Authorization", `Bearer ${member.token}`);

            expect(res.statusCode).toBe(403);

        });

    });

    describe("GET /api/analytics/fines", () => {

        it("should allow admin", async () => {

            const admin = await createAdmin();

            const res = await request(app)
                .get("/api/analytics/fines")
                .set("Authorization", `Bearer ${admin.token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);

        });

        it("should allow librarian", async () => {

            const librarian = await createLibrarian();

            const res = await request(app)
                .get("/api/analytics/fines")
                .set("Authorization", `Bearer ${librarian.token}`);

            expect(res.statusCode).toBe(200);

        });

        it("should not allow member", async () => {

            const member = await createMember();

            const res = await request(app)
                .get("/api/analytics/fines")
                .set("Authorization", `Bearer ${member.token}`);

            expect(res.statusCode).toBe(403);

        });

    });

    describe("GET /api/analytics/monthly-borrows", () => {

        it("should allow admin", async () => {

            const admin = await createAdmin();

            const res = await request(app)
                .get("/api/analytics/monthly-borrows")
                .set("Authorization", `Bearer ${admin.token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.data)).toBe(true);

        });

        it("should allow librarian", async () => {

            const librarian = await createLibrarian();

            const res = await request(app)
                .get("/api/analytics/monthly-borrows")
                .set("Authorization", `Bearer ${librarian.token}`);

            expect(res.statusCode).toBe(200);

        });

        it("should not allow member", async () => {

            const member = await createMember();

            const res = await request(app)
                .get("/api/analytics/monthly-borrows")
                .set("Authorization", `Bearer ${member.token}`);

            expect(res.statusCode).toBe(403);

        });

    });

});