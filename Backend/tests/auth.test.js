import { describe, test, expect } from "@jest/globals";
import request from "supertest";
import app from "../src/app.js";

describe("Authentication - Register", () => {

    test("should register a new user", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Manas",
                email: "manas@test.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.success).toBe(true);
    });

    test("should not register duplicate email", async () => {

        const user = {
            name: "Manas",
            email: "duplicate@test.com",
            password: "password123"
        };

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const res = await request(app)
            .post("/api/auth/register")
            .send(user);

        expect(res.statusCode).toBe(409);
        expect(res.body.success).toBe(false);
    });

    test("should reject invalid email", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Manas",
                email: "invalid-email",
                password: "password123"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("should reject missing password", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                name: "Manas",
                email: "missing@test.com"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    test("should reject missing name", async () => {

        const res = await request(app)
            .post("/api/auth/register")
            .send({
                email: "noname@test.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

});







describe("Authentication - Login", () => {

    test("should login successfully", async () => {

        const user = {
            name: "Manas",
            email: "login@test.com",
            password: "password123"
        };

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password
            });

            console.log(res.statusCode);
            console.log(res.body);
            

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        expect(res.body.data).toHaveProperty("token");
        expect(res.body.data).toHaveProperty("user");

        expect(res.body.data.user.email).toBe(user.email);
    });

    test("should reject wrong password", async () => {

        const user = {
            name: "Manas",
            email: "wrong@test.com",
            password: "password123"
        };

        await request(app)
            .post("/api/auth/register")
            .send(user);

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: "wrongpassword"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

    test("should reject unknown email", async () => {

        const res = await request(app)
            .post("/api/auth/login")
            .send({
                email: "nouser@test.com",
                password: "password123"
            });

        expect(res.statusCode).toBe(401);
        expect(res.body.success).toBe(false);
    });

});







describe("Authentication - Protected Routes", () => {

    test("should get current user with valid token", async () => {

        const user = {
            name: "Manas",
            email: "me@test.com",
            password: "password123"
        };

        // Register
        await request(app)
            .post("/api/auth/register")
            .send(user);

        // Login
        const loginRes = await request(app)
            .post("/api/auth/login")
            .send({
                email: user.email,
                password: user.password
            });

        const token = loginRes.body.data.token;

        // Access protected route
        const res = await request(app)
            .get("/api/auth/me")
            .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);

        expect(res.body.data.email).toBe(user.email);
        expect(res.body.data.name).toBe(user.name);
    });

});


test("should reject request without token", async () => {

    const res = await request(app)
        .get("/api/auth/me");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);

});


test("should reject invalid token", async () => {

    const res = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);

});