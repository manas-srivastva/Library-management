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

                fines,

                "Fines fetched"

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

                fine,

                "Fine fetched"

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

                fines,

                "User fines fetched"

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

                fine,

                "Fine paid"

            )

        );

    }

);