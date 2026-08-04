import request from "supertest";
import app from "../../src/app.js";

import User from "../../src/models/User.js";
import ROLES from "../../src/constants/roles.js";

async function createUserWithRole(role) {

    const email = `${role.toLowerCase()}${Date.now()}@test.com`;
    const password = "password123";

    await request(app)
        .post("/api/auth/register")
        .send({
            name: role,
            email,
            password,
        });

    const user = await User.findOneAndUpdate(
        { email },
        { role },
        { new: true }
    );

    const login = await request(app)
        .post("/api/auth/login")
        .send({
            email,
            password,
        });

    return {
        token: login.body.data.token,
        user,
    };
}

export async function createAdmin() {
    return createUserWithRole(ROLES.ADMIN);
}

export async function createLibrarian() {
    return createUserWithRole(ROLES.LIBRARIAN);
}

export async function createMember() {
    return createUserWithRole(ROLES.MEMBER);
}

// Backward compatibility
export async function createAdminToken() {
    const { token } = await createAdmin();
    return token;
}

export async function createLibrarianToken() {
    const { token } = await createLibrarian();
    return token;
}

export async function createMemberToken() {
    const { token } = await createMember();
    return token;
}