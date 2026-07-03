import asyncHandler from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import * as publisherService
    from "../services/publisherService.js";


export const createPublisher =
    asyncHandler(async (req, res) => {

        const publisher =
            await publisherService.createPublisher(
                req.body
            );

        res.status(201).json(

            new ApiResponse(
                201,
                publisher,
                "Publisher created successfully"
            )

        );

    });


export const getPublishers =
    asyncHandler(async (req, res) => {

        const publishers =
            await publisherService.getPublishers();

        res.status(200).json(

            new ApiResponse(
                200,
                publishers,
                "Publishers fetched successfully"
            )

        );

    });


export const updatePublisher =
    asyncHandler(async (req, res) => {

        const publisher =
            await publisherService.updatePublisher(

                req.params.id,

                req.body

            );

        res.status(200).json(

            new ApiResponse(

                200,

                publisher,

                "Publisher updated successfully"

            )

        );

    });


export const deletePublisher =
    asyncHandler(async (req, res) => {

        await publisherService.deletePublisher(

            req.params.id

        );

        res.status(200).json(

            new ApiResponse(

                200,

                null,

                "Publisher deleted successfully"

            )

        );

    });