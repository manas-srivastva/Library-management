import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ROLES from "../constants/roles.js";
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

    const requestedUserId = req.params.id;

    // Members can only view their own borrowing history
    if (
        req.user.role === "MEMBER" &&
        requestedUserId !== req.user._id.toString()
    ) {
        return res.status(403).json({
            statusCode: 403,
            success: false,
            message: "Forbidden",
            data: null
        });
    }

    const history =
        await borrowService.getUserHistory(
            requestedUserId
        );

    res.status(200).json(
        new ApiResponse(
            200,
            "Borrow history fetched",
            history
        )
    );

});