import ApiError from "../utils/ApiError.js";

import * as repo from "../repositories/bookRepository.js";
import * as authorRepository from "../repositories/authorRepository.js";
import * as publisherRepository from "../repositories/publisherRepository.js";
import * as categoryRepository from "../repositories/categoryRepository.js";

import * as auditService from "./auditService.js";

import { AUDIT_ACTIONS } from "../constants/auditActions.js";

export const createBook = async (data, userId) => {

    const existing = await repo.findByISBN(data.isbn);

    if (existing) {
        throw new ApiError(400, "ISBN already exists");
    }

    // Validate authors
    for (const authorId of data.authors) {

        const author = await authorRepository.findById(authorId);

        if (!author) {
            throw new ApiError(404, "Author not found");
        }
    }

    // Validate publisher
    const publisher = await publisherRepository.findById(data.publisher);

    if (!publisher) {
        throw new ApiError(404, "Publisher not found");
    }

    // Validate category
    const category = await categoryRepository.findById(data.category);

    if (!category) {
        throw new ApiError(404, "Category not found");
    }

    const book = await repo.create(data);

    await auditService.createLog({
        user: userId,
        action: AUDIT_ACTIONS.BOOK_CREATED,
        entity: "Book",
        entityId: book._id,
        metadata: {
            title: book.title,
            isbn: book.isbn
        }
    });

    return book;
};

export const getBooks = async ({
    page = 1,
    limit = 10,
    search = "",
    category
}) => {

    return repo.findAll({
        page,
        limit,
        search,
        category
    });
};
export const getById = async (id) => {

    const book = await repo.findById(id);

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    return book;
};

export const updateBook = async (id, data, userId) => {

    const book = await repo.findById(id);

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    // Duplicate ISBN check
    if (data.isbn) {

        const existing = await repo.findByISBN(data.isbn);

        if (
            existing &&
            existing._id.toString() !== id
        ) {
            throw new ApiError(400, "ISBN already exists");
        }
    }

    // Validate authors if updated
    if (data.authors) {

        for (const authorId of data.authors) {

            const author = await authorRepository.findById(authorId);

            if (!author) {
                throw new ApiError(404, "Author not found");
            }
        }
    }

    // Validate publisher if updated
    if (data.publisher) {

        const publisher = await publisherRepository.findById(data.publisher);

        if (!publisher) {
            throw new ApiError(404, "Publisher not found");
        }
    }

    // Validate category if updated
    if (data.category) {

        const category = await categoryRepository.findById(data.category);

        if (!category) {
            throw new ApiError(404, "Category not found");
        }
    }

    const updatedBook = await repo.update(id, data);

    await auditService.createLog({
        user: userId,
        action: AUDIT_ACTIONS.BOOK_UPDATED,
        entity: "Book",
        entityId: updatedBook._id,
        metadata: {
            title: updatedBook.title,
            isbn: updatedBook.isbn
        }
    });

    return updatedBook;
};

export const deleteBook = async (id, userId) => {

    const book = await repo.findById(id);

    if (!book) {
        throw new ApiError(404, "Book not found");
    }

    await auditService.createLog({
        user: userId,
        action: AUDIT_ACTIONS.BOOK_DELETED,
        entity: "Book",
        entityId: book._id,
        metadata: {
            title: book.title,
            isbn: book.isbn
        }
    });

    await repo.remove(id);
};