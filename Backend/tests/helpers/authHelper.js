import request from "supertest";
import app from "../../src/app.js";

import User from "../../src/models/User.js";
import ROLES from "../../src/constants/roles.js";

async function createUserWithRole(role) {
    const email = `${role.toLowerCase()}${Date.now()}@test.com`;
    const password = "password123";

    // Register
    await request(app)
        .post("/api/auth/register")
        .send({
            name: role,
            email,
            password
        });

    // Promote role
    await User.findOneAndUpdate(
        { email },
        { role }
    );

    // Login
    const login = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password
        });

    return login.body.data.token;
}

export async function createAdminToken() {
    return createUserWithRole(ROLES.ADMIN);
}

export async function createLibrarianToken() {
    return createUserWithRole(ROLES.LIBRARIAN);
}

export async function createMemberToken() {
    return createUserWithRole(ROLES.MEMBER);
}