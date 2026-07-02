import { body } from "express-validator";

export const createAuthorValidator = [

    body("name")

        .notEmpty()

        .withMessage(

            "Author name is required"

        )

        .isLength({

            min: 2,

            max: 100

        })

        .withMessage(

            "Author name must be between 2 and 100 characters"

        ),

    body("bio")

        .optional()

        .isLength({

            max: 1000

        })

        .withMessage(

            "Bio cannot exceed 1000 characters"

        )

];


export const updateAuthorValidator = [

    body("name")

        .optional()

        .isLength({

            min: 2,

            max: 100

        }),

    body("bio")

        .optional()

        .isLength({

            max: 1000

        })

];