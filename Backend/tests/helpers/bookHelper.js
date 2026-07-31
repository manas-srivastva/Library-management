import request from "supertest";
import app from "../../src/app.js";

import { createAuthor } from "./authorHelper.js";
import { createCategory } from "./categoryHelper.js";
import { createPublisher } from "./publisherHelper.js";

export const createBook = async (
    token,
    data = {},
    dependencies = {}
) => {

    let authorId = dependencies.authorId;
    let categoryId = dependencies.categoryId;
    let publisherId = dependencies.publisherId;

    // Create Author if not provided
    if (!authorId) {

        const author = await createAuthor(token);

        if (author.statusCode !== 201) {
            return author;
        }

        authorId = author.body.data._id;
    }

    // Create Category if not provided
    if (!categoryId) {

        const category = await createCategory(token);

        if (!category || !category._id) {
            return category;
        }

        categoryId = category._id;
    }

    // Create Publisher if not provided
    if (!publisherId) {

        const publisher = await createPublisher(token);

        if (publisher.statusCode !== 201) {
            return publisher;
        }

        publisherId = publisher.body.data._id;
    }

    return request(app)
        .post("/api/books")
        .set("Authorization", `Bearer ${token}`)
        .send({
            title: "Clean Code",
            isbn: `9780132350${Date.now()}`,
            description: "Software craftsmanship",
            language: "English",
            publicationYear: 2008,
            pages: 464,
            authors: [authorId],
            publisher: publisherId,
            category: categoryId,
            ...data
        });

};