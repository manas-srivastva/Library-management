import asyncHandler from "../utils/asyncHandler.js";

import ApiResponse from "../utils/ApiResponse.js";

import * as categoryService from "../services/categoryService.js";


export const createCategory =

    asyncHandler(

        async (req, res) => {

            const category =

                await categoryService.createCategory(

                    req.body

                );

            res.status(201)

                .json(

                    new ApiResponse(

                        201,

                        "Category created successfully",

                        category

                    )

                );

        }

    );

export const getById = asyncHandler(
async(req,res)=>{

    const category =
        await categoryService.getById(

            req.params.id

        );

    res.status(200).json(

        new ApiResponse(

            200,

            category,

            "Category fetched successfully"

        )

    );

});
export const getCategories =

    asyncHandler(

        async (req, res) => {

            const categories =

                await categoryService.getCategories();

            res.status(200)

                .json(

                    new ApiResponse(

                        200,

                        "Categories fetched successfully",

                        categories

                    )

                );

        }

    );


export const updateCategory =

    asyncHandler(

        async (req, res) => {

            const category =

                await categoryService.updateCategory(

                    req.params.id,

                    req.body

                );

            res.status(200)

                .json(

                    new ApiResponse(

                        200,

                        "Category updated successfully",

                        category

                    )

                );

        }

    );


export const deleteCategory =

    asyncHandler(

        async (req, res) => {

            await categoryService.deleteCategory(

                req.params.id

            );

            res.status(200)

                .json(

                    new ApiResponse(

                        200,

                        "Category deleted successfully"

                    )

                );

        }

    );