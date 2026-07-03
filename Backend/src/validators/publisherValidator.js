import { body } from "express-validator";

export const createPublisherValidator = [

    body("name")
        .notEmpty()
        .withMessage("Publisher name is required")

];

export const updatePublisherValidator = [

    body("name")
        .optional()
        .notEmpty()
        .withMessage("Publisher name cannot be empty")

];