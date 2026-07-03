import ApiError from "../utils/ApiError.js";

import * as repo
    from "../repositories/bookRepository.js";

import Author from "../models/Author.js";
import Publisher from "../models/Publisher.js";
import Category from "../models/Category.js";

export const createBook = async (data) => {

    const existing =
        await repo.findByISBN(data.isbn);

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

    if (authors.length !== data.authors.length) {

        throw new ApiError(

            404,

            "One or more authors not found"

        );

    }

    const publisher =
        await Publisher.findOne({

            name: {
                $regex: `^${data.publisher}$`,
                $options: "i"
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
                $regex: `^${data.category}$`,
                $options: "i"
            }

        });

    if (!category) {

        throw new ApiError(

            404,

            "Category not found"

        );

    }

    data.authors =
        authors.map(author => author._id);

    data.publisher =
        publisher._id;

    data.category =
        category._id;

    return repo.create(data);

};



export const getBooks = async () => {

    return repo.findAll();

};



export const updateBook = async (id, data) => {

    const book =

        await repo.findById(id);

    if (!book) {

        throw new ApiError(

            404,

            "Book not found"

        );

    }

    return repo.update(

        id,

        data

    );

};



export const deleteBook = async (id) => {

    const book =

        await repo.findById(id);

    if (!book) {

        throw new ApiError(

            404,

            "Book not found"

        );

    }

    await repo.remove(id);

};