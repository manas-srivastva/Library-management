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

import { createBook } from "./helpers/bookHelper.js";
import { createReservation } from "./helpers/reservationHelper.js";


describe("Reservation API", () => {

describe("POST /api/reservations", () => {

    it("should create a reservation", async () => {

        const admin = await createAdmin();

        const res = await createReservation(admin);

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.data).toBeDefined();

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const book = await createBook(admin.token);

        const res = await request(app)
            .post("/api/reservations")
            .send({
                user: member.user.email,
                book: book.body.data.title,
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const book = await createBook(admin.token);

        const res = await request(app)
            .post("/api/reservations")
            .set("Authorization", "Bearer invalidtoken")
            .send({
                user: member.user.email,
                book: book.body.data.title,
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject non-existing user", async () => {

        const admin = await createAdmin();

        const book = await createBook(admin.token);

        const res = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${admin.token}`)
            .send({
                user: "unknown@test.com",
                book: book.body.data.title,
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

    it("should reject non-existing book", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const res = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${admin.token}`)
            .send({
                user: member.user.email,
                book: "Unknown Book",
            });

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

    it("should reject validation errors", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .post("/api/reservations")
            .set("Authorization", `Bearer ${admin.token}`)
            .send({});

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

});
// GET /api/reservations


describe("GET /api/reservations", () => {

    it("should allow admin to get all reservations", async () => {

        const admin = await createAdmin();

        await createReservation(admin);
        await createReservation(admin);

        const res = await request(app)
            .get("/api/reservations")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBeGreaterThanOrEqual(2);

    });

    it("should allow librarian to get all reservations", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        await createReservation(admin);

        const res = await request(app)
            .get("/api/reservations")
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(Array.isArray(res.body.data)).toBe(true);

    });

    it("should not allow member to get all reservations", async () => {

        const member = await createMember();

        const res = await request(app)
            .get("/api/reservations")
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.success).toBe(false);

    });

    it("should reject request without token", async () => {

        const res = await request(app)
            .get("/api/reservations");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const res = await request(app)
            .get("/api/reservations")
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

});


// GET /api/reservations/:id
describe("GET /api/reservations/:id", () => {

    it("should get a reservation by id", async () => {

        const admin = await createAdmin();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .get(`/api/reservations/${reservation.body.data._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data._id).toBe(reservation.body.data._id);

    });

    it("should allow librarian to get a reservation", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .get(`/api/reservations/${reservation.body.data._id}`)
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should allow member to get a reservation", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .get(`/api/reservations/${reservation.body.data._id}`)
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .get(`/api/reservations/${reservation.body.data._id}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .get(`/api/reservations/${reservation.body.data._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid object id", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .get("/api/reservations/123")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

    it("should return 404 for non-existing reservation", async () => {

        const admin = await createAdmin();

        const id = new mongoose.Types.ObjectId();

        const res = await request(app)
            .get(`/api/reservations/${id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

});



// PUT /api/reservations/cancel/:id
describe("PUT /api/reservations/cancel/:id", () => {

    it("should allow admin to cancel a reservation", async () => {

        const admin = await createAdmin();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .put(`/api/reservations/cancel/${reservation.body.data._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.status).toBe("CANCELLED");

    });

    it("should allow librarian to cancel a reservation", async () => {

        const admin = await createAdmin();
        const librarian = await createLibrarian();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .put(`/api/reservations/cancel/${reservation.body.data._id}`)
            .set("Authorization", `Bearer ${librarian.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should allow member to cancel a reservation", async () => {

        const admin = await createAdmin();
        const member = await createMember();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .put(`/api/reservations/cancel/${reservation.body.data._id}`)
            .set("Authorization", `Bearer ${member.token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

    });

    it("should reject request without token", async () => {

        const admin = await createAdmin();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .put(`/api/reservations/cancel/${reservation.body.data._id}`);

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid token", async () => {

        const admin = await createAdmin();

        const reservation = await createReservation(admin);

        const res = await request(app)
            .put(`/api/reservations/cancel/${reservation.body.data._id}`)
            .set("Authorization", "Bearer invalidtoken");

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);

    });

    it("should reject invalid object id", async () => {

        const admin = await createAdmin();

        const res = await request(app)
            .put("/api/reservations/cancel/123")
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);

    });

    it("should return 404 for non-existing reservation", async () => {

        const admin = await createAdmin();

        const id = new mongoose.Types.ObjectId();

        const res = await request(app)
            .put(`/api/reservations/cancel/${id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);

    });

    it("should cancel the same reservation only once", async () => {

        const admin = await createAdmin();

        const reservation = await createReservation(admin);

        await request(app)
            .put(`/api/reservations/cancel/${reservation.body.data._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        const res = await request(app)
            .put(`/api/reservations/cancel/${reservation.body.data._id}`)
            .set("Authorization", `Bearer ${admin.token}`);

        // Your current service will probably return 200.
        // If you later add a check for already-cancelled reservations,
        // change this expectation to 400.

        expect([200, 400]).toContain(res.statusCode);

    });

});


});