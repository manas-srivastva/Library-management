import asyncHandler from "../utils/asyncHandler.js";
import ApiResponse from "../utils/ApiResponse.js";
import ApiError from "../utils/ApiError.js";

import * as fineService from "../services/fineService.js";

import ROLES from "../constants/roles.js";


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

        /*
         * MEMBER can only view their own fine
         */
        if (
            req.user.role === ROLES.MEMBER &&
            fine.user._id.toString() !== req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Forbidden"
            );
        }

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

        /*
         * MEMBER can only view their own fines
         */
        if (
            req.user.role === ROLES.MEMBER &&
            req.params.id !== req.user._id.toString()
        ) {
            throw new ApiError(
                403,
                "Forbidden"
            );
        }

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