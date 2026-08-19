import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as service from "../services/bookService.js";

export const createBook =

    asyncHandler(async (req, res) => {

        const book = await service.createBook(
            req.body,
            req.user._id
        );

        res.status(201).json(
            new ApiResponse(
                201,
                "Book created",
                book
            )
        );

    });

export const getBooks =

    asyncHandler(async (req, res) => {

        const {
            page = 1,
            limit = 10,
            search = "",
            category
        } = req.query;

        const books = await service.getBooks({

            page: Number(page),

            limit: Number(limit),

            search,

            category

        });

        res.status(200).json(
            new ApiResponse(
                200,
                "Books fetched",
                books
            )
        );

    });

export const getById =

    asyncHandler(async (req, res) => {

        const book = await service.getById(
            req.params.id
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Book fetched",
                book
            )
        );

    });

export const updateBook =

    asyncHandler(async (req, res) => {

        const book = await service.updateBook(
            req.params.id,
            req.body,
            req.user._id      // ✅ Added
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Book updated",
                book
            )
        );

    });

export const deleteBook =

    asyncHandler(async (req, res) => {

        await service.deleteBook(
            req.params.id,
            req.user._id      // ✅ Added
        );

        res.status(200).json(
            new ApiResponse(
                200,
                "Book deleted",
                null
            )
        );

    });