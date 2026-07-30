import { body } from "express-validator";

export const createPublisherValidator = [

    body("name")
        .notEmpty()
        .withMessage("Publisher name is required")
        .isLength({
            min: 2,
            max: 100
        })
        .withMessage(
            "Publisher name must be between 2 and 100 characters"
        ),

    body("description")
        .optional()
        .isLength({
            max: 1000
        })
        .withMessage(
            "Description cannot exceed 1000 characters"
        ),

    body("website")
        .optional()
        .isURL()
        .withMessage(
            "Website must be a valid URL"
        ),

    body("country")
        .optional()
        .isLength({
            max: 100
        })
        .withMessage(
            "Country cannot exceed 100 characters"
        )

];

export const updatePublisherValidator = [

    body("name")
        .optional()
        .isLength({
            min: 2,
            max: 100
        })
        .withMessage(
            "Publisher name must be between 2 and 100 characters"
        ),

    body("description")
        .optional()
        .isLength({
            max: 1000
        })
        .withMessage(
            "Description cannot exceed 1000 characters"
        ),

    body("website")
        .optional()
        .isURL()
        .withMessage(
            "Website must be a valid URL"
        ),

    body("country")
        .optional()
        .isLength({
            max: 100
        })
        .withMessage(
            "Country cannot exceed 100 characters"
        )

];