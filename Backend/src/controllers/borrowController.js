import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";

import * as borrowService from "../services/borrowService.js";

export const borrowBook = asyncHandler(async (req, res) => {

    const borrow = await borrowService.borrowBook({
        ...req.body,
        issuedBy: req.user._id
    });

    res.status(201).json(
        new ApiResponse(
            201,
            "Book borrowed",
            borrow
        )
    );
});

export const getAll = asyncHandler(async (req, res) => {

    const {
        page = 1,
        limit = 10,
        search = "",
        status = "",
        from = "",
        to = ""
    } = req.query;


    const result = await borrowService.getAll({

        page,
        limit,
        search,
        status,
        from,
        to

    });


    res.status(200).json(

        new ApiResponse(

            200,

            "Borrow records fetched",

            result

        )

    );

});

export const getById = asyncHandler(async (req, res) => {

    const borrow = await borrowService.getById(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Borrow record fetched",
            borrow
        )
    );

});

export const returnBook = asyncHandler(async (req, res) => {

    const borrow = await borrowService.returnBook(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Book returned",
            borrow
        )
    );

});

export const history = asyncHandler(async (req, res) => {

    const history = await borrowService.getUserHistory(req.params.id);

    res.status(200).json(
        new ApiResponse(
            200,
            "Borrow history fetched",
            history
        )
    );

});