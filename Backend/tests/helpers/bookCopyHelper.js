import request from "supertest";
import app from "../../src/app.js";
import { createBook } from "./bookHelper.js";

export const createBookCopy = async (
    token,
    data = {},
    dependencies = {}
) => {

    let bookId = dependencies.bookId;

    if (!bookId) {
        const book = await createBook(token);
        bookId = book.body.data._id;
    }

    const unique =
        Date.now() +
        Math.floor(Math.random() * 10000);

    return await request(app)
        .post("/api/bookcopies")
        .set("Authorization", `Bearer ${token}`)
        .send({
            book: bookId,
            barcode: `BC-${unique}`,
            status: "AVAILABLE",
            shelfLocation: "A-01",
            condition: "New",
            notes: "Test Copy",
            ...data,
        });
};