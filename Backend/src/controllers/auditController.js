import * as auditService
from "../services/auditService.js";

import asyncHandler
from "../utils/asyncHandler.js";

import ApiResponse
from "../utils/ApiResponse.js";


export const getAll = asyncHandler(

    async (req, res) => {

        const logs =

            await auditService.getAll();

        res.status(200).json(

            new ApiResponse(

                200,

                logs

            )

        );

    }

);


export const getById = asyncHandler(

    async (req, res) => {

        const log =

            await auditService.getById(

                req.params.id

            );

        res.status(200).json(

            new ApiResponse(

                200,

                log

            )

        );

    }

);


export const getUserLogs = asyncHandler(

    async (req, res) => {

        const logs =

            await auditService.getByUser(

                req.params.id

            );

        res.status(200).json(

            new ApiResponse(

                200,

                logs

            )

        );

    }

);