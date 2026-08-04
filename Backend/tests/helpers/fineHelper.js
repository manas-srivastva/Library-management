import request from "supertest";
import app from "../../src/app.js";

import { createBorrow } from "./borrowHelper.js";

export const createFine = async (admin) => {

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const borrow = await createBorrow(
        admin,
        {
            dueDate: yesterday
        }
    );

    await request(app)
        .put(`/api/borrows/return/${borrow.body.data._id}`)
        .set("Authorization", `Bearer ${admin.token}`);

    const fines = await request(app)
        .get("/api/fines")
        .set("Authorization", `Bearer ${admin.token}`);

    return fines.body.data[0];

};