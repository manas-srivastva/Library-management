import asyncHandler
    from "../utils/asyncHandler.js";

import ApiResponse
    from "../utils/ApiResponse.js";

import * as service
    from "../services/bookService.js";


export const createBook =

    asyncHandler(async (req, res) => {

        const book =

            await service.createBook(

                req.body

            );

        res.status(201).json(

            new ApiResponse(

                201,

                book,

                "Book created"

            )

        );

    });


export const getBooks =

    asyncHandler(async (req, res) => {

        const books =

            await service.getBooks();

        res.status(200).json(

            new ApiResponse(

                200,

                books,

                "Books fetched"

            )

        );

    });


export const updateBook =

    asyncHandler(async (req, res) => {

        const book =

            await service.updateBook(

                req.params.id,

                req.body

            );

        res.status(200).json(

            new ApiResponse(

                200,

                book,

                "Book updated"

            )

        );

    });


export const deleteBook =

    asyncHandler(async (req, res) => {

        await service.deleteBook(

            req.params.id

        );

        res.status(200).json(

            new ApiResponse(

                200,

                null,

                "Book deleted"

            )

        );

    });