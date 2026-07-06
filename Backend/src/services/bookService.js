import ApiError from "../utils/ApiError.js";

import * as repo
    from "../repositories/bookRepository.js";

import Author
    from "../models/Author.js";

import Publisher
    from "../models/Publisher.js";

import Category
    from "../models/Category.js";

import * as auditService
    from "./auditService.js";

import { AUDIT_ACTIONS }
    from "../constants/auditActions.js";


export const createBook = async (

    data,

    userId

) => {

    const existing =

        await repo.findByISBN(

            data.isbn

        );

    if (existing) {

        throw new ApiError(

            400,

            "ISBN already exists"

        );

    }


    const authors =

        await Author.find({

            name: {

                $in: data.authors

            }

        });

    if (

        authors.length !==

        data.authors.length

    ) {

        throw new ApiError(

            404,

            "One or more authors not found"

        );

    }


    const publisher =

        await Publisher.findOne({

            name: {

                $regex:

                    `^${data.publisher}$`,

                $options:

                    "i"

            }

        });

    if (!publisher) {

        throw new ApiError(

            404,

            "Publisher not found"

        );

    }


    const category =

        await Category.findOne({

            name: {

                $regex:

                    `^${data.category}$`,

                $options:

                    "i"

            }

        });

    if (!category) {

        throw new ApiError(

            404,

            "Category not found"

        );

    }


    data.authors =

        authors.map(

            author => author._id

        );

    data.publisher =

        publisher._id;

    data.category =

        category._id;


    const book =

        await repo.create(

            data

        );


    await auditService.createLog({

        user:

            userId,

        action:

            AUDIT_ACTIONS.BOOK_CREATED,

        entity:

            "Book",

        entityId:

            book._id,

        metadata: {

            title:

                book.title,

            isbn:

                book.isbn

        }

    });


    return book;

};



export const getBooks = async () => {

    return repo.findAll();

};



export const updateBook = async (

    id,

    data,

    userId

) => {

    const book =

        await repo.findById(

            id

        );

    if (!book) {

        throw new ApiError(

            404,

            "Book not found"

        );

    }


    const updatedBook =

        await repo.update(

            id,

            data

        );


    await auditService.createLog({

        user:

            userId,

        action:

            AUDIT_ACTIONS.BOOK_UPDATED,

        entity:

            "Book",

        entityId:

            updatedBook._id,

        metadata: {

            title:

                updatedBook.title,

            isbn:

                updatedBook.isbn

        }

    });


    return updatedBook;

};



export const deleteBook = async (

    id,

    userId

) => {

    const book =

        await repo.findById(

            id

        );

    if (!book) {

        throw new ApiError(

            404,

            "Book not found"

        );

    }


    await auditService.createLog({

        user:

            userId,

        action:

            AUDIT_ACTIONS.BOOK_DELETED,

        entity:

            "Book",

        entityId:

            book._id,

        metadata: {

            title:

                book.title,

            isbn:

                book.isbn

        }

    });


    await repo.remove(id);

};