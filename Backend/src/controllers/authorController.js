import asyncHandler
    from "../utils/asyncHandler.js";

import ApiResponse
    from "../utils/ApiResponse.js";

import * as authorService
    from "../services/authorService.js";


export const createAuthor =

    asyncHandler(

        async (req, res) => {

            const author =

                await authorService.createAuthor(

                    req.body

                );

            res.status(201)

                .json(

                    new ApiResponse(

                        201,

                        "Author created successfully",

                        author

                    )

                );

        }

    );

export const getById = asyncHandler(
async (req, res) => {

    const author =
        await authorService.getById(
            req.params.id
        );

    res.status(200).json(

        new ApiResponse(

            200,

            author,

            "Author fetched successfully"

        )

    );

});
export const getAuthors =

    asyncHandler(

        async (req, res) => {

            const authors =

                await authorService.getAuthors();

            res.status(200)

                .json(

                    new ApiResponse(

                        200,

                        "Authors fetched successfully",

                        authors

                    )

                );

        }

    );


export const updateAuthor =

    asyncHandler(

        async (req, res) => {

            const author =

                await authorService.updateAuthor(

                    req.params.id,

                    req.body

                );

            res.status(200)

                .json(

                    new ApiResponse(

                        200,

                        "Author updated successfully",

                        author

                    )

                );

        }

    );


export const deleteAuthor =

    asyncHandler(

        async (req, res) => {

            await authorService.deleteAuthor(

                req.params.id

            );

            res.status(200)

                .json(

                    new ApiResponse(

                        200,

                        "Author deleted successfully"

                    )

                );

        }

    );