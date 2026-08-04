import asyncHandler

    from "../utils/asyncHandler.js";

import ApiResponse

    from "../utils/ApiResponse.js";

import * as fineService

    from "../services/fineService.js";


export const getAll = asyncHandler(

    async (req, res) => {

        const fines =

            await fineService.getAll();

        res.json(

            new ApiResponse(

                200,
                "Fines fetched",

                fines

                

            )

        );

    }

);


export const getById = asyncHandler(

    async (req, res) => {

        const fine =

            await fineService.getById(

                req.params.id

            );

        res.json(

            new ApiResponse(

                200,
                "Fine fetched",

                fine

                

            )

        );

    }

);


export const getUserFines = asyncHandler(

    async (req, res) => {

        const fines =

            await fineService.getUserFines(

                req.params.id

            );

        res.json(

            new ApiResponse(

                200,
                "User fines fetched",

                fines

                

            )

        );

    }

);


export const pay = asyncHandler(

    async (req, res) => {

        const fine =

            await fineService.payFine(

                req.params.id

            );

        res.json(

            new ApiResponse(

                200,
                "Fine paid",

                fine

                

            )

        );

    }

);