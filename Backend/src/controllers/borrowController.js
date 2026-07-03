import asyncHandler
    from "../utils/asyncHandler.js";

import ApiResponse
    from "../utils/ApiResponse.js";

import * as borrowService
    from "../services/borrowService.js";


export const borrowBook =

    asyncHandler(

        async (req, res) => {

            const borrow =

                await borrowService.borrowBook(

                    req.body

                );

            res.status(201)

                .json(

                    new ApiResponse(

                        201,

                        borrow,

                        "Book borrowed"

                    )

                );

        }

    );



export const getAll =

    asyncHandler(

        async (req, res) => {

            const borrows =

                await borrowService.getAll();

            res.json(

                new ApiResponse(

                    200,

                    borrows

                )

            );

        }

    );



export const getById =

    asyncHandler(

        async (req, res) => {

            const borrow =

                await borrowService.getById(

                    req.params.id

                );

            res.json(

                new ApiResponse(

                    200,

                    borrow

                )

            );

        }

    );



export const returnBook =

    asyncHandler(

        async (req, res) => {

            const borrow =

                await borrowService.returnBook(

                    req.params.id

                );

            res.json(

                new ApiResponse(

                    200,

                    borrow,

                    "Returned"

                )

            );

        }

    );



export const history =

    asyncHandler(

        async (req, res) => {

            const data =

                await borrowService.getUserHistory(

                    req.params.id

                );

            res.json(

                new ApiResponse(

                    200,

                    data

                )

            );

        }

    );