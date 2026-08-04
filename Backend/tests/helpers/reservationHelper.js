import request from "supertest";
import app from "../../src/app.js";

import { createMember } from "./authHelper.js";
import { createBook } from "./bookHelper.js";

export const createReservation = async (
    user,
    data = {},
    dependencies = {}
) => {

    let memberEmail = dependencies.memberEmail;
    let bookTitle = dependencies.bookTitle;

    if (!memberEmail) {

        const member = await createMember();

        memberEmail = member.user.email;

    }

    if (!bookTitle) {

        const book = await createBook(user.token);

        bookTitle = book.body.data.title;

    }

    return await request(app)
        .post("/api/reservations")
        .set("Authorization", `Bearer ${user.token}`)
        .send({
            user: memberEmail,
            book: bookTitle,
            ...data,
        });

};