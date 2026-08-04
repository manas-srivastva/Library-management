import * as analyticsService
    from "../services/analyticsService.js";

import asyncHandler
    from "../utils/asyncHandler.js";

import ApiResponse
    from "../utils/ApiResponse.js";


export const overview = asyncHandler(

    async (req, res) => {

        const data =
            await analyticsService.getOverview();

        res.status(200).json(

            new ApiResponse(

                200,

                "Overview fetched successfully",

                data

            )

        );

    }

);


export const popularBooks = asyncHandler(

    async (req, res) => {

        const data =
            await analyticsService.getPopularBooks();

        res.status(200).json(

            new ApiResponse(

                200,

                "Popular books fetched successfully",

                data

            )

        );

    }

);


export const activeMembers = asyncHandler(

    async (req, res) => {

        const data =
            await analyticsService.getActiveMembers();

        res.status(200).json(

            new ApiResponse(

                200,

                "Active members fetched successfully",

                data

            )

        );

    }

);


export const fineStats = asyncHandler(

    async (req, res) => {

        const data =
            await analyticsService.getFineStats();

        res.status(200).json(

            new ApiResponse(

                200,

                "Fine statistics fetched successfully",

                data

            )

        );

    }

);


export const monthlyBorrows = asyncHandler(

    async (req, res) => {

        const data =
            await analyticsService.getMonthlyBorrows();

        res.status(200).json(

            new ApiResponse(

                200,

                "Monthly borrows fetched successfully",

                data

            )

        );

    }

);