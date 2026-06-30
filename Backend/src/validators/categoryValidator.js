import { body } from "express-validator";

export const createCategoryValidator = [

    body("name")

        .notEmpty()

        .withMessage(

            "Category name is required"

        )

        .isLength({

            min: 2,

            max: 50

        })

        .withMessage(

            "Category name must be between 2 and 50 characters"

        ),

    body("description")

        .optional()

        .isLength({

            max: 300

        })

        .withMessage(

            "Description cannot exceed 300 characters"

        )

];


export const updateCategoryValidator = [

    body("name")

        .optional()

        .isLength({

            min: 2,

            max: 50

        })

        .withMessage(

            "Category name must be between 2 and 50 characters"

        ),

    body("description")

        .optional()

        .isLength({

            max: 300

        })

        .withMessage(

            "Description cannot exceed 300 characters"

        )

];