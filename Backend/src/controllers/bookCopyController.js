import asyncHandler
    from "../utils/asyncHandler.js";

import ApiResponse
    from "../utils/ApiResponse.js";

import * as service
    from "../services/bookCopyService.js";


export const createBookCopy =

    asyncHandler(async (req, res) => {

        const copy =

            await service.createBookCopy(

                req.body

            );

        res.status(201).json(

            new ApiResponse(

                201,
                "Book copy created",

                copy

                

            )

        );

    });
export const getById = asyncHandler(
async(req,res)=>{

    const copy =
        await service.getById(

            req.params.id

        );

    res.status(200).json(

        new ApiResponse(

            200,
            "Book copy fetched successfully",

            copy

            

        )

    );

});

export const getBookCopies =

    asyncHandler(async (req, res) => {

        const copies =

            await service.getBookCopies();

        res.status(200).json(

            new ApiResponse(

                200,
                "Copies fetched",

                copies

                

            )

        );

    });


export const updateBookCopy =

    asyncHandler(async (req, res) => {

        const copy =

            await service.updateBookCopy(

                req.params.id,

                req.body

            );

        res.status(200).json(

            new ApiResponse(

                200,
                "Copy updated",

                copy

                

            )

        );

    });


export const deleteBookCopy =

    asyncHandler(async (req, res) => {

        await service.deleteBookCopy(

            req.params.id

        );

        res.status(200).json(

            new ApiResponse(

                200,

                "Copy deleted",

                null

                

            )

        );

    });
