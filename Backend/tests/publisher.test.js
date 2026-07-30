import request from "supertest";
import mongoose from "mongoose";

import app from "../src/app.js";
import { describe, it, expect } from "@jest/globals";
import { createPublisher } from "./helpers/publisherHelper.js";

import {
    createAdminToken,
    createLibrarianToken,
    createMemberToken,
} from "./helpers/authHelper.js";

describe("Publisher API", () => {

    beforeEach(async () => {
        await mongoose.connection.db.dropDatabase();
    });
// POST
    describe("POST /api/publishers", () => {

        it("should allow admin to create a publisher", async () => {

            const token = await createAdminToken();

            const res = await createPublisher(token);

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.message).toBe("Publisher created successfully");
            expect(res.body.data.name).toBe("O'Reilly Media");

        });

        it("should allow librarian to create a publisher", async () => {

            const token = await createLibrarianToken();

            const res = await createPublisher(token, {
                name: "Packt"
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);

        });

        it("should forbid member from creating a publisher", async () => {

            const token = await createMemberToken();

            const res = await createPublisher(token);

            expect(res.statusCode).toBe(403);

        });

        it("should return 401 when JWT is missing", async () => {

            const res = await request(app)
                .post("/api/publishers")
                .send({
                    name: "O'Reilly Media"
                });

            expect(res.statusCode).toBe(401);

        });

        it("should return 401 for invalid JWT", async () => {

            const res = await request(app)
                .post("/api/publishers")
                .set("Authorization", "Bearer invalidtoken")
                .send({
                    name: "O'Reilly Media"
                });

            expect(res.statusCode).toBe(401);

        });

        it("should not allow duplicate publisher", async () => {

            const token = await createAdminToken();

            await createPublisher(token);

            const res = await createPublisher(token);

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.message).toBe("Publisher already exists");

        });

        it("should require publisher name", async () => {

            const token = await createAdminToken();

            const res = await createPublisher(token, {
                name: ""
            });

            expect(res.statusCode).toBe(400);

        });

    });
// GET
    describe("GET /api/publishers", () => {

    it("should return all publishers", async () => {

        const token = await createAdminToken();

        await createPublisher(token);

        await createPublisher(token, {
            name: "Packt"
        });

        const res = await request(app)
            .get("/api/publishers");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Publishers fetched successfully");
        expect(res.body.data.length).toBe(2);

    });

    it("should return an empty array when no publishers exist", async () => {

        const res = await request(app)
            .get("/api/publishers");

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Publishers fetched successfully");
        expect(res.body.data).toEqual([]);

    });

});
// GET BY ID
describe("GET /api/publishers/:id", () => {

    it("should allow admin to fetch publisher by id", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .get(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Publisher fetched successfully");
        expect(res.body.data._id).toBe(
            publisher.body.data._id
        );

    });

    it("should allow librarian to fetch publisher by id", async () => {

        const adminToken = await createAdminToken();
        const librarianToken = await createLibrarianToken();

        const publisher = await createPublisher(adminToken);

        const res = await request(app)
            .get(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${librarianToken}`);

        expect(res.statusCode).toBe(200);

    });

    it("should allow member to fetch publisher by id", async () => {

        const adminToken = await createAdminToken();
        const memberToken = await createMemberToken();

        const publisher = await createPublisher(adminToken);

        const res = await request(app)
            .get(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${memberToken}`);

        expect(res.statusCode).toBe(200);

    });

    it("should return 401 when token is missing", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .get(`/api/publishers/${publisher.body.data._id}`);

        expect(res.statusCode).toBe(401);

    });

    it("should return 401 for invalid token", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .get(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", "Bearer invalid");

        expect(res.statusCode).toBe(401);

    });

    it("should return 404 for non-existing publisher", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .get("/api/publishers/507f1f77bcf86cd799439011")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Publisher not found");

    });

    it("should return 400 for invalid publisher id", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .get("/api/publishers/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);

    });

});

// PUT
describe("PUT /api/publishers/:id", () => {

    it("should allow admin to update a publisher", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Packt"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Publisher updated successfully");
        expect(res.body.data.name).toBe("Packt");

    });

    it("should allow librarian to update a publisher", async () => {

        const adminToken = await createAdminToken();
        const librarianToken = await createLibrarianToken();

        const publisher = await createPublisher(adminToken);

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${librarianToken}`)
            .send({
                name: "Pearson"
            });

        expect(res.statusCode).toBe(200);
        expect(res.body.data.name).toBe("Pearson");

    });

    it("should forbid member from updating a publisher", async () => {

        const adminToken = await createAdminToken();
        const memberToken = await createMemberToken();

        const publisher = await createPublisher(adminToken);

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${memberToken}`)
            .send({
                name: "Pearson"
            });

        expect(res.statusCode).toBe(403);

    });

    it("should return 401 when JWT is missing", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .send({
                name: "Pearson"
            });

        expect(res.statusCode).toBe(401);

    });

    it("should return 401 for invalid JWT", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", "Bearer invalid")
            .send({
                name: "Pearson"
            });

        expect(res.statusCode).toBe(401);

    });

    it("should return 404 for non-existing publisher", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .put("/api/publishers/507f1f77bcf86cd799439011")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Pearson"
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Publisher not found");

    });

    it("should return 400 for invalid publisher id", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .put("/api/publishers/invalid-id")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Pearson"
            });

        expect(res.statusCode).toBe(400);

    });

    it("should not update to an existing publisher name", async () => {

        const token = await createAdminToken();

        await createPublisher(token, {
            name: "O'Reilly"
        });

        const publisher = await createPublisher(token, {
            name: "Packt"
        });

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "O'Reilly"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.message).toBe("Publisher already exists");

    });

    it("should reject empty publisher name", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: ""
            });

        expect(res.statusCode).toBe(400);

    });

    // Include these only if you upgraded the validator

    it("should reject publisher name shorter than 2 characters", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "A"
            });

        expect(res.statusCode).toBe(400);

    });

    it("should reject publisher name longer than 100 characters", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .put(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "A".repeat(101)
            });

        expect(res.statusCode).toBe(400);

    });

});





// delete
describe("DELETE /api/publishers/:id", () => {

    it("should allow admin to delete a publisher", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .delete(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Publisher deleted successfully");

    });

    it("should forbid librarian from deleting a publisher", async () => {

        const adminToken = await createAdminToken();
        const librarianToken = await createLibrarianToken();

        const publisher = await createPublisher(adminToken);

        const res = await request(app)
            .delete(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${librarianToken}`);

        expect(res.statusCode).toBe(403);

    });

    it("should forbid member from deleting a publisher", async () => {

        const adminToken = await createAdminToken();
        const memberToken = await createMemberToken();

        const publisher = await createPublisher(adminToken);

        const res = await request(app)
            .delete(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${memberToken}`);

        expect(res.statusCode).toBe(403);

    });

    it("should return 401 when JWT is missing", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .delete(`/api/publishers/${publisher.body.data._id}`);

        expect(res.statusCode).toBe(401);

    });

    it("should return 401 for invalid JWT", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        const res = await request(app)
            .delete(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", "Bearer invalid");

        expect(res.statusCode).toBe(401);

    });

    it("should return 404 for non-existing publisher", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .delete("/api/publishers/507f1f77bcf86cd799439011")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Publisher not found");

    });

    it("should return 400 for invalid publisher id", async () => {

        const token = await createAdminToken();

        const res = await request(app)
            .delete("/api/publishers/invalid-id")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(400);

    });

    it("should not delete the same publisher twice", async () => {

        const token = await createAdminToken();

        const publisher = await createPublisher(token);

        await request(app)
            .delete(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        const res = await request(app)
            .delete(`/api/publishers/${publisher.body.data._id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.message).toBe("Publisher not found");

    });

});
});